from flask import Flask, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import os
from dotenv import load_dotenv
import openai
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure OpenAI with project API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# Configure CORS based on environment
if os.getenv('FLASK_ENV') == 'production':
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "supports_credentials": False
        }
    })
else:
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "supports_credentials": False
        }
    })

@app.before_request
def before_request():
    # Add CORS headers for OPTIONS requests
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        return response

@app.route('/')
def home():
    return 'API is running'

# Database configuration
if os.getenv('DATABASE_URL'):
    # Use PostgreSQL in production
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
else:
    # Use SQLite in development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///whys.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Why message model
class Why(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    color = db.Column(db.String(20), nullable=False)
    position_x = db.Column(db.Float, nullable=False)
    position_y = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
            'color': self.color,
            'position': {
                'x': self.position_x,
                'y': self.position_y
            }
        }

# Create database tables
with app.app_context():
    db.create_all()

# Function to remove expired messages (older than 24 hours)
def cleanup_expired_messages():
    with app.app_context():
        try:
            expiration_time = datetime.utcnow() - timedelta(hours=24)
            Why.query.filter(Why.created_at < expiration_time).delete()
            db.session.commit()
            print("Cleanup successful")
        except Exception as e:
            print(f"Error during cleanup: {str(e)}")
            db.session.rollback()

# Set up scheduler to run cleanup every hour
if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=cleanup_expired_messages, trigger="interval", hours=1)
    scheduler.start()

# Root route for health check
@app.route('/health')
def root():
    return jsonify({"status": "healthy"}), 200

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        print("=== Chat Request ===")
        print("Headers:", {k: v for k, v in request.headers.items()})
        print("User Agent:", request.headers.get('User-Agent'))
        print("Protocol:", request.scheme)
        print("Is HTTPS:", request.is_secure)
        print("=================")

        data = request.json
        print("Request data:", data)
        
        if not data:
            print("No data received")
            return jsonify({"error": "No data provided"}), 400
            
        message = data.get('message', '')
        print("Message:", message)
        
        if not message:
            print("No message in data")
            return jsonify({"error": "No message provided"}), 400

        print("Calling OpenAI API...")
        # Generate response using OpenAI
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant that helps users plan their goals and actions."},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        print("OpenAI API response received")

        # Extract the response
        response = completion.choices[0].message.content
        print("Extracted response")

        # Extract short-term steps and long-term goals
        import re
        
        # Extract immediate actions
        short_term_match = re.search(r'# Immediate Actions\n((?:[\d\.\s]+[^\n]+\n){3})', response, re.IGNORECASE)
        short_term_steps = []
        if short_term_match:
            steps = short_term_match.group(1).strip().split('\n')
            short_term_steps = [step.replace(r'^\d+\.\s*', '').strip() for step in steps if step.strip()]
        print("Extracted short-term steps:", short_term_steps)

        # Extract 1 year goals
        long_term_match = re.search(r'# 1 Year Achievement.*?Action Steps:\n((?:[\d\.\s]+[^\n]+\n){2})', response, re.IGNORECASE)
        long_term_goals = []
        if long_term_match:
            goals = long_term_match.group(1).strip().split('\n')
            long_term_goals = [goal.replace(r'^\d+\.\s*', '').strip() for goal in goals if goal.strip()]
        print("Extracted long-term goals:", long_term_goals)

        return jsonify({
            "response": response,
            "shortTermSteps": short_term_steps,
            "longTermGoals": long_term_goals
        })

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500

@app.route('/api/why', methods=['POST'])
def create_why():
    try:
        data = request.json
        new_why = Why(
            message=data['message'],
            color=data['color'],
            position_x=data['position']['x'],
            position_y=data['position']['y']
        )
        db.session.add(new_why)
        db.session.commit()
        return jsonify(new_why.to_dict()), 201
    except Exception as e:
        print(f"Error creating why: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/whys', methods=['GET'])
def get_whys():
    try:
        # Only return messages from the last 24 hours
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        whys = Why.query.filter(Why.created_at >= cutoff_time).all()
        return jsonify([why.to_dict() for why in whys])
    except Exception as e:
        print(f"Error getting whys: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact_submit():
    try:
        data = request.get_json(force=True, silent=True) or {}
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip()
        interest = (data.get('interest') or '').strip()
        message = (data.get('message') or '').strip()

        if not email or not message:
            return jsonify({"error": "Email and message are required"}), 400

        to_email = os.getenv('CONTACT_TO', 'dylan@dyligent.solutions')
        from_email = os.getenv('CONTACT_FROM', 'no-reply@dyligent.solutions')
        sg_key = os.getenv('SENDGRID_API_KEY')

        if not sg_key:
            return jsonify({"error": "Email service not configured"}), 500

        subject = f"New Contact Form Submission - {name or 'Website Visitor'}"
        ua = request.headers.get('User-Agent', '')
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        body_lines = [
            f"Name: {name or 'N/A'}",
            f"Email: {email}",
            f"Interested in: {interest or 'N/A'}",
            "",
            message,
            "",
            f"IP: {ip}",
            f"User-Agent: {ua}",
        ]
        content = "\n".join(body_lines)

        mail = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            plain_text_content=content,
        )

        # optional reply-to
        if email:
            mail.reply_to = email

        sg = SendGridAPIClient(sg_key)
        resp = sg.send(mail)
        print(f"SendGrid response: {resp.status_code}")

        return jsonify({"ok": True}), 200
    except Exception as e:
        print(f"Error in contact endpoint: {str(e)}")
        return jsonify({"error": "Failed to send message"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, threaded=True)
