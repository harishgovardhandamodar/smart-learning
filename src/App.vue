<template>
  <div id="smart-learning">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { checkConnection, getModels, getDefaultModel } from './services/ollama'
import { useTheme } from './theme'
import { useI18n } from './i18n'
import { getKids, getSelectedKidId, setSelectedKid } from './data/kids'
import { preGenerateChartsProgress } from './data/preGenerateCharts'
import { storage } from './utils/storage'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'

const { isDark, toggleTheme } = useTheme()
const { t, setLocale, locale, currentLocale } = useI18n()

const isConnected = ref(false)
provide('isConnected', isConnected)

const MODEL_STORAGE_KEY = 'foxy_selected_model'
const selectedModel = ref(storage.get(MODEL_STORAGE_KEY, ''))
const availableModels = ref([])

function setSelectedModel(model) {
  selectedModel.value = model
  storage.set(MODEL_STORAGE_KEY, model)
}

provide('selectedModel', selectedModel)
provide('availableModels', availableModels)
provide('setSelectedModel', setSelectedModel)
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
provide('t', t)
provide('setLocale', setLocale)
provide('locale', locale)
provide('currentLocale', currentLocale)

const allKids = ref(getKids())
const selectedKidId = ref(getSelectedKidId())
const selectedKid = computed(() => allKids.value.find(k => k.id === selectedKidId.value) || null)

function switchKid(kidId) {
  setSelectedKid(kidId)
  selectedKidId.value = kidId
  allKids.value = getKids()
}

function refreshKids() {
  allKids.value = getKids()
  selectedKidId.value = getSelectedKidId()
}

provide('selectedKid', selectedKid)
provide('selectedKidId', selectedKidId)
provide('switchKid', switchKid)
provide('refreshKids', refreshKids)

async function checkStatus() {
  isConnected.value = await checkConnection()
  availableModels.value = getModels()
  if (!selectedModel.value && availableModels.value.length > 0) {
    selectedModel.value = getDefaultModel()
    storage.set(MODEL_STORAGE_KEY, selectedModel.value)
  }
}

onMounted(() => {
  checkStatus()
  const interval = setInterval(checkStatus, 15000)
  onUnmounted(() => clearInterval(interval))

  if (selectedKidId.value) {
    preGenerateChartsProgress(selectedKidId.value)
  }
})
</script>

<style scoped>
.main-content {
  flex: 1;
  padding-top: 72px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
