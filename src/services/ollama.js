import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://localhost:11434' })

let availableModels = []

export async function checkConnection() {
  try {
    const res = await ollama.list()
    availableModels = res.models || []
    return true
  } catch {
    availableModels = []
    return false
  }
}

export function getModels() {
  return availableModels
}

export function getDefaultModel() {
  if (availableModels.length === 0) return ''
  const preferred = ['llama3.2', 'llama3.1', 'llama3', 'llama2', 'mistral', 'gemma2', 'phi3']
  for (const name of preferred) {
    if (availableModels.some(m => m.name.startsWith(name))) {
      return availableModels.find(m => m.name.startsWith(name)).name
    }
  }
  return availableModels[0].name
}

const TOPIC_SYSTEM_PROMPTS = {
  science: `You are Professor Spark, a friendly and enthusiastic science teacher for kids aged 8-14. 
You explain science concepts using fun analogies, simple language, and exciting examples from everyday life.
Use emojis to make your explanations lively. Keep responses concise but informative.
Always encourage curiosity and ask thought-provoking questions.`,
  
  technology: `You are Tech-Bot Ada, a fun and patient technology mentor for kids aged 8-14.
You explain how computers, the internet, coding, and gadgets work using simple terms and cool examples.
Use emojis and make technology sound exciting and accessible.
Encourage kids to think about how they could create their own tech projects.`,
  
  engineering: `You are Engineer Max, a creative and encouraging engineering guide for kids aged 8-14.
You explain how things are built, how bridges stand, how rockets fly, using simple language and fun facts.
Use emojis and relate engineering to things kids see and use every day.
Encourage hands-on thinking and problem-solving.`,
  
  mathematics: `You are Math Wizard Pi, a fun and patient math teacher for kids aged 8-14.
You explain math concepts using visual examples, puzzles, and real-world connections.
Use emojis to make math less intimidating and more like a game.
Show how math is everywhere in daily life and encourage creative problem-solving.`,
}

const QUIZ_SYSTEM_PROMPT = `You are a fun quiz master for kids aged 8-14. Generate a quiz based on the given topic.
You must respond with ONLY a valid JSON array of exactly 5 objects. Each object has:
- "question": the question text
- "options": array of exactly 4 answer strings
- "correct": the index (0-3) of the correct answer
- "explanation": a short fun explanation of the correct answer

Do NOT include any text outside the JSON array. No markdown, no code blocks. Just pure JSON.
Make questions age-appropriate, fun, and educational. Use emojis in the questions and explanations.`

export async function sendMessage(messages, topic, model) {
  const systemPrompt = TOPIC_SYSTEM_PROMPTS[topic] || TOPIC_SYSTEM_PROMPTS.science
  const selectedModel = model || getDefaultModel()

  const response = await ollama.chat({
    model: selectedModel,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
  })

  return response
}

export async function generateQuiz(topic, model) {
  const topicNames = {
    science: 'Science',
    technology: 'Technology & Computer Science',
    engineering: 'Engineering & Design',
    mathematics: 'Mathematics & Logic',
  }

  const selectedModel = model || getDefaultModel()

  const response = await ollama.chat({
    model: selectedModel,
    messages: [
      { role: 'system', content: QUIZ_SYSTEM_PROMPT },
      { role: 'user', content: `Generate a fun quiz about ${topicNames[topic] || topic} for curious kids. Remember: ONLY the JSON array, nothing else.` },
    ],
  })

  let content = response.message.content.trim()
  
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    content = jsonMatch[0]
  }

  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}
