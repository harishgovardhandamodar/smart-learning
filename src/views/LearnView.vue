<template>
  <div class="learn-page">
    <div class="container">
      <div class="learn-header">
        <router-link to="/topics" class="back-link">← Back to Topics</router-link>
        <div class="topic-badge" :style="{ background: topic.gradient }">
          <span>{{ topic.icon }}</span>
          <h1>{{ topic.title }}</h1>
        </div>
      </div>

      <div class="chat-container">
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state animate-bounce">
            <div class="empty-icon">{{ topic.icon }}</div>
            <h2>Welcome to {{ topic.title }}!</h2>
            <p>Ask me anything about {{ topic.title.toLowerCase() }}. I'm your personal AI tutor!</p>
            <div class="suggestion-chips">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                class="suggestion-chip"
                @click="sendMessage(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <template v-for="(msg, index) in messages" :key="index">
            <div
              class="message"
              :class="msg.role"
            >
              <div class="message-avatar">
                {{ msg.role === 'user' ? '🧑‍🎓' : topic.icon }}
              </div>
              <div class="message-content">
                <div class="message-sender">{{ msg.role === 'user' ? 'You' : 'AI Tutor' }}</div>
                <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
              </div>
            </div>

            <MindMap
              v-if="msg.role === 'assistant' && msg.content && mindMaps[index]"
              :concepts="mindMaps[index]"
              :question="findUserQuestion(index)"
              :topic-icon="topic.icon"
              :center-label="topic.title"
            />
            <div
              v-else-if="msg.role === 'assistant' && msg.content && mindMapLoading[index]"
              class="mindmap-loading"
            >
              <span class="loading-spinner"></span>
              Generating mind map...
            </div>
          </template>

          <div v-if="isLoading" class="message assistant">
            <div class="message-avatar">{{ topic.icon }}</div>
            <div class="message-content">
              <div class="message-sender">AI Tutor</div>
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="model-selector" v-if="models.length > 0">
            <label>Model:</label>
            <select v-model="selectedModel" class="model-select">
              <option v-for="m in models" :key="m.name" :value="m.name">
                {{ m.name }}
              </option>
            </select>
          </div>
          <div class="no-model-warning" v-if="models.length === 0 && !connected">
            <span>⚠️ Ollama not connected. Please start <code>ollama serve</code></span>
          </div>
          <form class="chat-form" @submit.prevent="handleSend">
            <input
              ref="inputField"
              v-model="userInput"
              type="text"
              class="chat-input"
              :placeholder="`Ask about ${topic.title.toLowerCase()}...`"
              :disabled="isLoading || !connected"
            />
            <button
              type="submit"
              class="send-btn"
              :disabled="!userInput.trim() || isLoading || !connected"
            >
              <span v-if="isLoading">⏳</span>
              <span v-else>🚀</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { STEM_TOPICS } from '../data/topics'
import { sendMessage as ollamaSend, generateMindMap, getModels, getDefaultModel } from '../services/ollama'
import MindMap from '../components/MindMap.vue'

const route = useRoute()
const connected = inject('isConnected', ref(false))

const topicId = computed(() => route.params.topicId)
const topic = computed(() => STEM_TOPICS.find(t => t.id === topicId.value) || STEM_TOPICS[0])

const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const inputField = ref(null)
const selectedModel = ref('')
const models = ref([])

const mindMaps = ref({})
const mindMapLoading = ref({})

const suggestions = computed(() => {
  const subs = topic.value.subtopics
  return [
    `Tell me about ${subs[0]}`,
    `How does ${subs[1]} work?`,
    `Why is ${subs[2]} important?`,
    `Fun facts about ${subs[0]}!`,
  ]
})

function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function findUserQuestion(assistantIndex) {
  for (let i = assistantIndex - 1; i >= 0; i--) {
    if (messages.value[i].role === 'user') return messages.value[i].content
  }
  return ''
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function fetchMindMap(msgIndex) {
  const assistantMsg = messages.value[msgIndex]
  const userMsg = findUserQuestion(msgIndex)
  if (!userMsg || !assistantMsg.content) return

  mindMapLoading.value[msgIndex] = true
  try {
    const concepts = await generateMindMap(userMsg, assistantMsg.content, selectedModel.value)
    if (concepts && concepts.length > 0) {
      mindMaps.value[msgIndex] = concepts
    }
  } catch {
    // Silently fail - mind map is optional
  } finally {
    delete mindMapLoading.value[msgIndex]
    await scrollToBottom()
  }
}

async function sendMessage(text) {
  const content = text || userInput.value.trim()
  if (!content || isLoading.value || !connected.value) return

  messages.value.push({ role: 'user', content })
  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const chatMessages = messages.value.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const stream = await ollamaSend(chatMessages, topicId.value, selectedModel.value)
    let assistantContent = ''
    messages.value.push({ role: 'assistant', content: '' })
    const msgIndex = messages.value.length - 1

    for await (const part of stream) {
      assistantContent += part.message.content
      messages.value[msgIndex].content = assistantContent
      await scrollToBottom()
    }

    fetchMindMap(msgIndex)
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: `Oops! Something went wrong. Make sure Ollama is running and you have a model available. Error: ${error.message}`,
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

function handleSend() {
  sendMessage()
}

onMounted(() => {
  models.value = getModels()
  const defaultModel = getDefaultModel()
  if (defaultModel) selectedModel.value = defaultModel
})
</script>

<style scoped lang="scss">
.learn-page {
  padding: 20px 0 40px;
  min-height: calc(100vh - 72px);
  display: flex;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.learn-header {
  margin-bottom: 20px;
}

.back-link {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-light);
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
  transition: color 0.2s;

  &:hover {
    color: var(--primary);
  }
}

.topic-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px 10px 16px;
  border-radius: 16px;
  color: white;

  span {
    font-size: 1.8rem;
  }

  h1 {
    font-size: 1.3rem;
    font-weight: 700;
  }
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  min-height: 500px;
  max-height: calc(100vh - 200px);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.empty-state h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-light);
  max-width: 400px;
  margin-bottom: 24px;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.suggestion-chip {
  background: rgba(108, 92, 231, 0.08);
  color: var(--primary);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    transform: translateY(-2px);
  }
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  animation: slide-up 0.3s ease;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  &.assistant {
    align-self: flex-start;
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(108, 92, 231, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.message-sender {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.message-content {
  background: rgba(108, 92, 231, 0.05);
  padding: 12px 16px;
  border-radius: 16px;
  border-top-left-radius: 4px;

  .user & {
    background: var(--primary);
    color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 4px;
  }
}

.message-text {
  font-size: 0.95rem;
  line-height: 1.6;

  :deep(strong) {
    font-weight: 700;
  }

  :deep(code) {
    background: rgba(108, 92, 231, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .user & :deep(code) {
    background: rgba(255, 255, 255, 0.2);
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
    animation: typing 1.4s ease-in-out infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

.chat-input-area {
  border-top: 2px solid rgba(108, 92, 231, 0.08);
  padding: 16px 20px;
  background: rgba(108, 92, 231, 0.02);
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    font-family: var(--font-display);
  }
}

.model-select {
  font-family: var(--font-body);
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 8px;
  border: 2px solid rgba(108, 92, 231, 0.15);
  background: white;
  color: var(--text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--primary);
  }
}

.no-model-warning {
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #E17055;

  code {
    background: rgba(253, 203, 110, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.chat-form {
  display: flex;
  gap: 10px;
}

.chat-input {
  flex: 1;
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 12px 18px;
  border-radius: 14px;
  border: 2px solid rgba(108, 92, 231, 0.15);
  background: white;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.send-btn {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: var(--primary);
  color: white;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

@media (max-width: 640px) {
  .message {
    max-width: 95%;
  }

  .chat-messages {
    padding: 16px;
  }

  .empty-state h2 {
    font-size: 1.3rem;
  }
}

.mindmap-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  margin-left: 52px;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-weight: 500;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(108, 92, 231, 0.15);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
