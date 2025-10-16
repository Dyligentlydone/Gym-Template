type Category = 'Physical' | 'Mental' | 'Financial' | 'Personal'

export async function generatePersonalizedPlan(
  category: Category,
  answers: Record<number, string>
): Promise<{ plan: string; shortTermSteps: string[]; longTermGoals: string[] }> {
  const message = `As an expert life coach specializing in ${category.toLowerCase()} development, analyze the following detailed assessment and create a comprehensive, personalized development roadmap.

User's ${category} Assessment:
${Object.entries(answers)
  .map(([questionId, answer]) => `Question ${questionId}: ${answer}`)
  .join('\n')}

Please structure your response with the following sections using markdown headers:

# Comprehensive Analysis
[Provide a brief analysis of the user's current situation and goals]

# Immediate Actions
1. [First immediate action]
2. [Second immediate action]
3. [Third immediate action]

# Sustainable Growth Strategy
[Outline the strategy for sustainable growth]

# Support System and Resources
[List key support systems and resources]

# 1 Week Milestone
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [What to expect after one week]

# 1 Month Vision
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [What to expect after one month]

# 3 Month Transformation
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [What to expect after three months]

# 6 Month Evolution
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [What to expect after six months]

# 1 Year Achievement
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [What to expect after one year]

# 5 Year Vision
Action Steps:
1. [First action]
2. [Second action]
Expected Outcome: [Long-term vision and expectations]

# The Success Story
[Write a brief success story from the future perspective]`;

  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (!apiUrl) {
      throw new Error('API URL is not configured');
    }
    
    // Remove trailing slash if present
    const baseUrl = apiUrl.replace(/\/$/, '');
    
    console.log('Sending request to API:', `${baseUrl}/api/chat`);
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      throw new Error('Failed to generate roadmap');
    }

    const data = await response.json();
    console.log('Received response:', data);
    const plan = data.response;
    
    // Extract short-term steps and long-term goals using regex
    const shortTermMatch = plan.match(/# Immediate Actions\n((?:[\d\.\s]+[^\n]+\n){3})/is);
    const longTermMatch = plan.match(/# 1 Year Achievement.*?Action Steps:\n((?:[\d\.\s]+[^\n]+\n){2})/is);

    console.log('Short-term match:', shortTermMatch);
    console.log('Long-term match:', longTermMatch);

    const shortTermSteps = shortTermMatch ? 
      shortTermMatch[1].split('\n')
        .filter(step => step.trim())
        .map(step => step.replace(/^\d+\.\s*/, '').trim()) : 
      [];

    const longTermGoals = longTermMatch ?
      longTermMatch[1].split('\n')
        .filter(goal => goal.trim())
        .map(goal => goal.replace(/^\d+\.\s*/, '').trim()) :
      [];

    console.log('Extracted steps:', { shortTermSteps, longTermGoals });

    return {
      plan,
      shortTermSteps,
      longTermGoals
    };
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate personalized roadmap. Please try again.');
  }
}
