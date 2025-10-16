import { useState } from 'react'
import { generatePersonalizedPlan } from '../services/aiService'
import PlanDisplay from './PlanDisplay'

type Category = 'Physical' | 'Mental' | 'Financial' | 'Personal'
type Question = {
  id: number
  text: string
  type: 'text' | 'scale' | 'choice'
  choices?: string[]
}

const categoryQuestions: Record<Category, Question[]> = {
  Physical: [
    {
      id: 1,
      text: "How would you rate your current physical fitness level (1-10)?",
      type: "scale"
    },
    {
      id: 2,
      text: "What are your main physical goals?",
      type: "choice",
      choices: ["Weight Loss", "Muscle Gain", "Endurance", "Overall Health", "Sports Performance"]
    },
    {
      id: 3,
      text: "How many hours per week can you dedicate to exercise?",
      type: "text"
    },
    {
      id: 4,
      text: "What are your current obstacles to achieving your physical goals?",
      type: "text"
    },
    {
      id: 5,
      text: "What type of physical activities do you enjoy most?",
      type: "choice",
      choices: ["Cardio", "Weight Training", "Team Sports", "Yoga/Stretching", "Outdoor Activities"]
    },
    {
      id: 6,
      text: "How would you describe your current eating habits?",
      type: "choice",
      choices: ["Regular Balanced Meals", "Irregular Eating", "Strict Diet", "Frequent Snacking", "Mindful Eating"]
    },
    {
      id: 7,
      text: "How does your energy level fluctuate throughout the day?",
      type: "text"
    },
    {
      id: 8,
      text: "What specific areas of your body would you like to focus on improving?",
      type: "text"
    },
    {
      id: 9,
      text: "How does your sleep quality affect your physical performance?",
      type: "text"
    },
    {
      id: 10,
      text: "What would be your ideal physical state in one year?",
      type: "text"
    }
  ],
  Mental: [
    {
      id: 1,
      text: "How would you rate your current stress levels (1-10)?",
      type: "scale"
    },
    {
      id: 2,
      text: "What aspects of mental wellness are most important to you?",
      type: "choice",
      choices: ["Stress Management", "Focus/Concentration", "Emotional Balance", "Personal Growth", "Relationships"]
    },
    {
      id: 3,
      text: "What mental challenges would you like to overcome?",
      type: "text"
    },
    {
      id: 4,
      text: "How do you currently manage stress or mental challenges?",
      type: "text"
    },
    {
      id: 5,
      text: "How would you rate your work-life balance (1-10)?",
      type: "scale"
    },
    {
      id: 6,
      text: "What activities help you feel most mentally refreshed?",
      type: "choice",
      choices: ["Meditation", "Reading", "Creative Activities", "Nature Walks", "Social Interaction"]
    },
    {
      id: 7,
      text: "How does your mental state affect your daily productivity?",
      type: "text"
    },
    {
      id: 8,
      text: "What recurring thoughts or worries occupy your mind most often?",
      type: "text"
    },
    {
      id: 9,
      text: "How do your relationships impact your mental wellbeing?",
      type: "text"
    },
    {
      id: 10,
      text: "What would ideal mental clarity and peace look like for you?",
      type: "text"
    }
  ],
  Financial: [
    {
      id: 1,
      text: "How would you rate your current financial stability (1-10)?",
      type: "scale"
    },
    {
      id: 2,
      text: "What are your primary financial goals?",
      type: "choice",
      choices: ["Debt Freedom", "Wealth Building", "Investment", "Business Growth", "Financial Security"]
    },
    {
      id: 3,
      text: "What's your target timeline for achieving these goals?",
      type: "text"
    },
    {
      id: 4,
      text: "What are your biggest financial challenges right now?",
      type: "text"
    },
    {
      id: 5,
      text: "How would you describe your current spending habits?",
      type: "choice",
      choices: ["Very Frugal", "Balanced", "Occasional Splurges", "Impulsive Spending", "Strategic Investment"]
    },
    {
      id: 6,
      text: "What percentage of your income do you currently save/invest?",
      type: "choice",
      choices: ["0-5%", "6-10%", "11-20%", "21-30%", "More than 30%"]
    },
    {
      id: 7,
      text: "How do you feel about taking financial risks?",
      type: "text"
    },
    {
      id: 8,
      text: "What financial skills would you like to develop?",
      type: "text"
    },
    {
      id: 9,
      text: "How does your financial situation affect your life decisions?",
      type: "text"
    },
    {
      id: 10,
      text: "What would financial freedom mean to you personally?",
      type: "text"
    }
  ],
  Personal: [
    {
      id: 1,
      text: "How satisfied are you with your personal growth (1-10)?",
      type: "scale"
    },
    {
      id: 2,
      text: "What areas of personal development interest you most?",
      type: "choice",
      choices: ["Leadership", "Creativity", "Communication", "Time Management", "Life Purpose"]
    },
    {
      id: 3,
      text: "What personal achievements would make the biggest impact on your life?",
      type: "text"
    },
    {
      id: 4,
      text: "What's holding you back from achieving your personal goals?",
      type: "text"
    },
    {
      id: 5,
      text: "How do you prefer to learn and grow?",
      type: "choice",
      choices: ["Self-Study", "Mentorship", "Hands-on Experience", "Group Learning", "Formal Education"]
    },
    {
      id: 6,
      text: "What values are most important to you?",
      type: "choice",
      choices: ["Integrity", "Growth", "Impact", "Freedom", "Connection"]
    },
    {
      id: 7,
      text: "How do you measure personal success?",
      type: "text"
    },
    {
      id: 8,
      text: "What legacy would you like to leave behind?",
      type: "text"
    },
    {
      id: 9,
      text: "How do your current habits align with your personal goals?",
      type: "text"
    },
    {
      id: 10,
      text: "What would your ideal life look like in 5 years?",
      type: "text"
    }
  ]
}

export default function WhyPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showPlan, setShowPlan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<{
    plan: string
    shortTermSteps: string[]
    longTermGoals: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState<string>('')

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setCurrentAnswer('')
    setShowPlan(false)
    setAiResponse(null)
    setError(null)
  }

  const handleNext = async () => {
    if (!selectedCategory || !currentAnswer) return

    const updatedAnswers = {
      ...answers,
      [currentQuestionIndex]: currentAnswer
    };
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < categoryQuestions[selectedCategory].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setCurrentAnswer('')
    } else {
      setShowPlan(true)
      setLoading(true)
      try {
        console.log('Generating plan for category:', selectedCategory);
        console.log('With answers:', updatedAnswers);
        const response = await generatePersonalizedPlan(selectedCategory, updatedAnswers)
        console.log('Received AI response:', response);
        setAiResponse(response)
      } catch (err) {
        console.error('Error in handleNext:', err);
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setCurrentAnswer(answers[currentQuestionIndex - 1] || '')
    }
  }

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer)
  }

  const renderQuestion = () => {
    if (!selectedCategory) return null
    const question = categoryQuestions[selectedCategory][currentQuestionIndex]

    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
        <h3 className="text-xl mb-4 font-bold text-white">{question.text}</h3>
        {question.type === 'scale' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => handleAnswerChange(num.toString())}
                className={`w-12 h-12 rounded-full ${
                  currentAnswer === num.toString()
                    ? 'bg-[#FFA500] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } transition-colors duration-300`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
        {question.type === 'choice' && question.choices && (
          <div className="flex flex-col gap-2">
            {question.choices.map(choice => (
              <button
                key={choice}
                onClick={() => handleAnswerChange(choice)}
                className={`p-3 rounded-lg ${
                  currentAnswer === choice
                    ? 'bg-[#FFA500] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } text-left transition-colors duration-300`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
        {question.type === 'text' && (
          <div className="mt-2">
            <textarea
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              rows={4}
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg ${
              currentQuestionIndex === 0
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white'
            } transition-colors duration-300`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={`px-6 py-2 rounded-lg ${
              !currentAnswer
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-[#FFA500] hover:bg-[#FF8C00] text-white'
            } transition-colors duration-300`}
          >
            {currentQuestionIndex === categoryQuestions[selectedCategory].length - 1 ? 'Generate Roadmap' : 'Next'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      {!selectedCategory ? (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What area would you like to focus on?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(categoryQuestions).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category as Category)}
                className="p-8 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group"
              >
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FFA500]">
                  {category}
                </h3>
                <p className="text-white/70">
                  {category === 'Physical' && 'Achieve your fitness and health goals'}
                  {category === 'Mental' && 'Enhance your mental wellbeing and clarity'}
                  {category === 'Financial' && 'Build and secure your financial future'}
                  {category === 'Personal' && 'Grow and develop as an individual'}
                </p>
              </button>
            ))}
          </div>
          <div className="text-center text-white/80 mt-12 max-w-2xl mx-auto text-lg leading-relaxed space-y-2">
            <p>Generate your personal roadmap to get a custom overview of how to lock in.</p>
            <p>Receive actionable steps in the direction of your version of success.</p>
            <p><span className="text-[#FFA500]">Free for the community!</span></p>
          </div>
        </div>
      ) : showPlan ? (
        loading ? (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Analyzing Your Responses</h3>
            <p className="text-white/70">
              We are carefully analyzing your answers and creating a personalized roadmap...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Error</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-6 py-3 bg-[#FFA500] text-white rounded-lg hover:bg-[#FF8C00] transition-colors duration-300"
            >
              Start Over
            </button>
          </div>
        ) : aiResponse ? (
          <PlanDisplay
            plan={aiResponse.plan}
            shortTermSteps={aiResponse.shortTermSteps}
            longTermGoals={aiResponse.longTermGoals}
            onStartOver={() => setSelectedCategory(null)}
          />
        ) : null
      ) : (
        <div>
          <div className="max-w-4xl mx-auto mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-white hover:text-[#FFA500] transition-colors duration-300"
            >
              ← Back to Categories
            </button>
            <h2 className="text-2xl font-bold text-white mt-4">
              {selectedCategory} Journey
            </h2>
            <div className="mt-4 flex gap-2">
              {categoryQuestions[selectedCategory].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index <= currentQuestionIndex ? 'bg-[#FFA500]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          {renderQuestion()}
        </div>
      )}
    </div>
  )
}
