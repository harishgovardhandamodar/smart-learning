<template>
  <div class="sandbox-page">
    <div class="container">

      <!-- Header -->
      <div class="page-header animate-slide-up">
        <router-link to="/focus" class="back-link">← {{ t('sandbox.backToLearn') }}</router-link>
        <h1 class="page-title">📊 {{ t('sandbox.title') }}</h1>
        <p class="page-subtitle">{{ t('sandbox.subtitle') }}</p>
        <div class="sandbox-stats">
          <div class="ss-card">
            <span class="ss-icon">⭐</span>
            <span class="ss-val">{{ progress.points }}</span>
            <span class="ss-lbl">{{ t('sandbox.points') }}</span>
          </div>
          <div class="ss-card">
            <span class="ss-icon">🏆</span>
            <span class="ss-val">{{ progress.completedChallenges.length }}</span>
            <span class="ss-lbl">{{ t('sandbox.completed') }}</span>
          </div>
          <div class="ss-card">
            <span class="ss-icon">🎖️</span>
            <span class="ss-val">{{ t(`sandbox.tier${progress.currentTier}`) }}</span>
            <span class="ss-lbl">{{ t('sandbox.rank') }}</span>
          </div>
        </div>
      </div>

      <!-- Active Challenge View -->
      <template v-if="activeMode">
        <div class="challenge-view animate-slide-up">
          <button class="btn-back-challenge" @click="exitChallenge">← {{ t('sandbox.backToHub') }}</button>

          <!-- WHAT-IF SLIDER MODE -->
          <div v-if="activeMode === 'whatif'" class="challenge-card">
            <h2>🔬 {{ t('sandbox.whatIfTitle') }}</h2>
            <p class="challenge-desc">{{ currentWhatIfDataset.subtitle[locale] || currentWhatIfDataset.subtitle.en }}</p>

            <!-- Scatter Plot SVG -->
            <div class="chart-container">
              <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="scatter-svg">
                <!-- Grid -->
                <line v-for="i in 5" :key="'h'+i" :x1="chartPadL" :y1="chartPadT + i * gridStepY"
                  :x2="svgWidth - chartPadR" :y2="chartPadT + i * gridStepY"
                  stroke="var(--border)" stroke-width="1" />
                <line v-for="i in 5" :key="'v'+i"
                  :x1="chartPadL + i * gridStepX" :y1="chartPadT"
                  :x2="chartPadL + i * gridStepX" :y2="svgHeight - chartPadB"
                  stroke="var(--border)" stroke-width="1" />

                <!-- Axes -->
                <line :x1="chartPadL" :y1="svgHeight - chartPadB" :x2="svgWidth - chartPadR" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="chartPadL" :y1="chartPadT" :x2="chartPadL" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />

                <!-- Axis labels -->
                <text :x="svgWidth / 2" :y="svgHeight - 5" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600">
                  {{ currentWhatIfDataset.xLabel[locale] || currentWhatIfDataset.xLabel.en }}
                </text>
                <text :x="10" :y="svgHeight / 2" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600" :transform="`rotate(-90, 10, ${svgHeight / 2})`">
                  {{ currentWhatIfDataset.yLabel[locale] || currentWhatIfDataset.yLabel.en }}
                </text>

                <!-- Line of best fit -->
                <line v-if="bestFitLine" :x1="bestFitLine.x1" :y1="bestFitLine.y1" :x2="bestFitLine.x2" :y2="bestFitLine.y2"
                  stroke="var(--primary)" stroke-width="2" stroke-dasharray="6,4" opacity="0.6" />

                <!-- Data points -->
                <circle v-for="(pt, i) in svgPoints" :key="'pt'+i"
                  :cx="pt.sx" :cy="pt.sy" :r="pt.excluded ? 6 : 7"
                  :fill="pt.excluded ? 'var(--text-muted)' : 'var(--accent)'"
                  :opacity="pt.excluded ? 0.3 : 1"
                  :stroke="pt.excluded ? 'var(--danger)' : 'none'"
                  :stroke-width="pt.excluded ? 2 : 0"
                  stroke-dasharray="3,2"
                  class="data-point" />

                <!-- Trend label -->
                <text :x="svgWidth - chartPadR - 5" :y="chartPadT + 15" text-anchor="end" font-size="11" fill="var(--primary)" font-weight="700">
                  R² = {{ currentR2.toFixed(3) }}
                </text>
              </svg>
            </div>

            <!-- What-If Slider -->
            <div class="whatif-controls">
              <label class="slider-label">🚫 {{ t('sandbox.outlierSlider') }}</label>
              <div class="slider-track">
                <input type="range" :min="0" :max="currentWhatIfDataset.points.length - 1"
                  v-model.number="outlierSliderVal" class="custom-slider" />
              </div>
              <p class="slider-info">
                {{ t('sandbox.removingPoint') }} <strong>{{ currentWhatIfDataset.points[outlierSliderVal]?.x }}</strong>
                {{ t('sandbox.excludedCount') }}: <strong>{{ excludedCount }}</strong>
              </p>
              <button class="btn btn-sm btn-outline" @click="toggleExclude(outlierSliderVal)">
                {{ isExcluded(outlierSliderVal) ? t('sandbox.includePoint') : t('sandbox.excludePoint') }}
              </button>
            </div>

            <!-- AI Analysis -->
            <div class="ai-analysis-card" v-if="whatIfAnalysis">
              <h4>🤖 {{ t('sandbox.aiAnalysis') }}</h4>
              <p>{{ locale === 'nl' ? currentWhatIfDataset.insightNL : currentWhatIfDataset.insightEN }}</p>
              <div class="analysis-comparison">
                <div class="ac-side">
                  <span class="ac-label">{{ t('sandbox.withOutliers') }}</span>
                  <span class="ac-val">R² = {{ originalR2.toFixed(3) }}</span>
                </div>
                <span class="ac-arrow">→</span>
                <div class="ac-side ac-after">
                  <span class="ac-label">{{ t('sandbox.withoutOutliers') }}</span>
                  <span class="ac-val">R² = {{ currentR2.toFixed(3) }}</span>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" @click="whatIfAnalysis = !whatIfAnalysis">
              {{ whatIfAnalysis ? t('sandbox.hideAnalysis') : t('sandbox.showAnalysis') }} 🤖
            </button>
          </div>

          <!-- MISLEADING GRAPH MODE -->
          <div v-if="activeMode === 'misleading'" class="challenge-card">
            <h2>🚩 {{ t('sandbox.misleadingTitle') }}</h2>
            <p class="challenge-desc">{{ currentMisleading.scenario[locale] || currentMisleading.scenario.en }}</p>

            <!-- Misleading Chart SVG -->
            <div class="chart-container">
              <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="misleading-svg">
                <!-- Y-axis grid -->
                <line v-for="(tick, i) in yTicks" :key="'yt'+i"
                  :x1="chartPadL" :y1="tick.y" :x2="svgWidth - chartPadR" :y2="tick.y"
                  stroke="var(--border)" stroke-width="1" />
                <text v-for="(tick, i) in yTicks" :key="'yl'+i"
                  :x="chartPadL - 8" :y="tick.y + 4" text-anchor="end" font-size="10" fill="var(--text-muted)">
                  {{ tick.label }}
                </text>

                <!-- Bars -->
                <rect v-for="(bar, i) in misleadingBars" :key="'bar'+i"
                  :x="bar.x" :y="bar.y" :width="barWidth" :height="bar.h"
                  :fill="currentMisleading.chartData.color || 'var(--danger)'"
                  rx="4" class="bar-rect" />

                <!-- Value labels on bars -->
                <text v-for="(bar, i) in misleadingBars" :key="'vlbl'+i"
                  :x="bar.x + barWidth / 2" :y="bar.y - 8" text-anchor="middle"
                  font-size="11" fill="var(--text)" font-weight="700">
                  {{ formatCurrency(currentMisleading.chartData.values[i]) }}
                </text>

                <!-- X-axis labels -->
                <text v-for="(label, i) in currentMisleading.chartData.labels" :key="'xlbl'+i"
                  :x="chartPadL + (i + 0.5) * barGroupWidth" :y="svgHeight - chartPadB + 18"
                  text-anchor="middle" font-size="11" fill="var(--text-muted)">
                  {{ label }}
                </text>

                <!-- Axes -->
                <line :x1="chartPadL" :y1="svgHeight - chartPadB" :x2="svgWidth - chartPadR" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="chartPadL" :y1="chartPadT" :x2="chartPadL" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />

                <!-- Warning indicator if truncated -->
                <rect v-if="currentMisleading.chartData.yMin > 0"
                  :x="chartPadL - chartPadL + 2" :y="svgHeight - chartPadB - 18" width="auto" height="16"
                  fill="rgba(255,118,117,0.15)" rx="4" />
                <text v-if="currentMisleading.chartData.yMin > 0"
                  :x="chartPadL + 6" :y="svgHeight - chartPadB - 6" font-size="10" fill="var(--danger)" font-weight="700">
                  ⚠️ Y-axis starts at {{ formatCurrency(currentMisleading.chartData.yMin) }}
                </text>
              </svg>
            </div>

            <!-- Flag Options -->
            <div class="flag-options" v-if="!misleadingAnswered">
              <h4>{{ t('sandbox.whatsWrong') }}</h4>
              <button v-for="opt in currentMisleading.options" :key="opt.id"
                class="flag-btn" :class="{ selected: selectedFlag === opt.id }"
                @click="selectedFlag = opt.id">
                🚩 {{ opt.label[locale] || opt.label.en }}
              </button>
              <button class="btn btn-primary" :disabled="!selectedFlag" @click="submitMisleadingFlag">
                {{ t('sandbox.flagIt') }}
              </button>
            </div>

            <!-- Result -->
            <div v-if="misleadingAnswered" class="challenge-result" :class="misleadingCorrect ? 'correct' : 'wrong'">
              <div class="cr-icon">{{ misleadingCorrect ? '🎉' : '💡' }}</div>
              <h3>{{ misleadingCorrect ? t('sandbox.correctFlag') : t('sandbox.notQuite') }}</h3>
              <p>{{ currentMisleading.trick[locale] || currentMisleading.trick.en }}</p>
              <p v-if="misleadingCorrect" class="cr-points">+{{ currentMisleading.points }} {{ t('sandbox.points') }}</p>
            </div>
          </div>

          <!-- AI DEBATE MODE -->
          <div v-if="activeMode === 'debate'" class="challenge-card">
            <h2>🤖 {{ t('sandbox.debateTitle') }}</h2>
            <p class="challenge-desc">{{ currentDebate.dataset.title[locale] || currentDebate.dataset.title.en }}</p>

            <!-- Dataset visualization -->
            <div class="chart-container">
              <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="debate-svg">
                <!-- Grid -->
                <line v-for="i in 5" :key="'dh'+i" :x1="chartPadL" :y1="chartPadT + i * gridStepY"
                  :x2="svgWidth - chartPadR" :y2="chartPadT + i * gridStepY"
                  stroke="var(--border)" stroke-width="1" />

                <!-- Axes -->
                <line :x1="chartPadL" :y1="svgHeight - chartPadB" :x2="svgWidth - chartPadR" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="chartPadL" :y1="chartPadT" :x2="chartPadL" :y2="svgHeight - chartPadB" stroke="var(--text-muted)" stroke-width="2" />

                <!-- Axis labels -->
                <text :x="svgWidth / 2" :y="svgHeight - 5" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600">
                  {{ debateXLabel }}
                </text>

                <!-- Scatter points -->
                <circle v-for="(pt, i) in debatePoints" :key="'dp'+i"
                  :cx="pt.sx" :cy="pt.sy" r="7"
                  fill="var(--secondary)" stroke="white" stroke-width="2" />
              </svg>
            </div>

            <!-- AI Claim -->
            <div class="ai-claim-card">
              <div class="ai-avatar">🤖</div>
              <div class="ai-claim-text">
                <h4>{{ t('sandbox.aiClaims') }}</h4>
                <p class="ai-quote">"{{ currentDebate.aiClaim[locale] || currentDebate.aiClaim.en }}"</p>
              </div>
            </div>

            <!-- Flaw Selection -->
            <div class="flaw-selection" v-if="!debateAnswered">
              <h4>{{ t('sandbox.findFlaws') }}</h4>
              <p class="flaw-hint">{{ t('sandbox.flawHint') }}</p>
              <div class="flaw-options">
                <label v-for="flaw in currentDebate.flaws" :key="flaw.id" class="flaw-option"
                  :class="{ selected: selectedFlaws.includes(flaw.id) }">
                  <input type="checkbox" :value="flaw.id" v-model="selectedFlaws" />
                  <span class="flaw-text">{{ flaw[locale] || flaw.en }}</span>
                </label>
              </div>
              <button class="btn btn-primary" :disabled="selectedFlaws.length === 0" @click="submitDebate">
                {{ t('sandbox.submitFlaws') }}
              </button>
            </div>

            <!-- Debate Result -->
            <div v-if="debateAnswered" class="challenge-result" :class="debateScore >= 2 ? 'correct' : 'wrong'">
              <div class="cr-icon">{{ debateScore >= 2 ? '🏆' : '💪' }}</div>
              <h3>{{ debateScore >= 2 ? t('sandbox.greatDebug') : t('sandbox.keepLooking') }}</h3>
              <div class="flaw-results">
                <div v-for="flaw in currentDebate.flaws" :key="flaw.id" class="flaw-result"
                  :class="{ found: selectedFlaws.includes(flaw.id) }">
                  <span class="fr-icon">{{ selectedFlaws.includes(flaw.id) ? '✅' : '❌' }}</span>
                  <span>{{ flaw[locale] || flaw.en }}</span>
                </div>
              </div>
              <p v-if="debateScore >= 2" class="cr-points">+{{ currentDebate.points }} {{ t('sandbox.points') }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- TIER HUB -->
      <template v-else>
        <!-- Section 3: Tiered Progression -->
        <h2 class="section-title animate-slide-up">🎮 {{ t('sandbox.progression') }}</h2>
        <div class="tiers-grid">
          <div v-for="tier in SANDBOX_TIERS" :key="tier.level" class="tier-card animate-slide-up"
            :class="{ locked: !isTierUnlocked(tier.level), active: progress.currentTier === tier.level, expanded: selectedTier === tier.level }"
            :style="{ '--tier-color': tier.color }"
            @click="selectTier(tier)">
            <div class="tier-header">
              <span class="tier-icon">{{ tier.icon }}</span>
              <div>
                <h3>{{ t(`sandbox.tier${tier.level}`) }}</h3>
                <span class="tier-level">{{ t('sandbox.level') }} {{ tier.level }}</span>
              </div>
              <span v-if="!isTierUnlocked(tier.level)" class="tier-lock">🔒</span>
              <span v-else-if="isTierComplete(tier.level)" class="tier-done">✅</span>
              <span v-else class="tier-expand">{{ selectedTier === tier.level ? '▲' : '▶' }}</span>
            </div>
            <div class="tier-body">
              <p class="tier-skill">{{ tier.coreSkill[locale] || tier.coreSkill.en }}</p>
              <div class="tier-charts">
                <span v-for="ct in tier.chartTypes[locale] || tier.chartTypes.en" :key="ct" class="tier-chart-badge">{{ ct }}</span>
              </div>
              <p class="tier-theme">{{ tier.theme[locale] || tier.theme.en }}</p>
            </div>
            <div v-if="!isTierUnlocked(tier.level)" class="tier-unlock-req">
              🔓 {{ t('sandbox.needPoints') }}: {{ tier.pointsRequired }} {{ t('sandbox.points') }}
            </div>
            <!-- Expanded: show tier challenges -->
            <div v-if="selectedTier === tier.level && isTierUnlocked(tier.level)" class="tier-challenges">
              <div v-for="chId in tier.challenges" :key="chId" class="tier-ch-item"
                :class="{ done: isChallengeDone(chId) }"
                @click.stop="openTierChallenge(chId)">
                <span class="tci-icon">{{ isChallengeDone(chId) ? '✅' : '▶️' }}</span>
                <span class="tci-name">{{ getChallengeName(chId) }}</span>
                <span v-if="isChallengeDone(chId)" class="tci-done">{{ t('sandbox.completed') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Interactive Challenge Modes -->
        <h2 class="section-title animate-slide-up">🎯 {{ t('sandbox.challengeModes') }}</h2>

        <!-- What-If Slider Cards -->
        <h3 class="subsection-title animate-slide-up">🔬 {{ t('sandbox.whatIfTitle') }}</h3>
        <div class="challenges-grid animate-slide-up">
          <div v-for="ds in WHAT_IF_DATASETS" :key="ds.id" class="challenge-card-mini"
            :class="{ locked: !isDatasetUnlocked(ds) }"
            @click="startWhatIf(ds)">
            <div class="ccm-header">
              <span class="ccm-icon">📈</span>
              <h4>{{ ds.title[locale] || ds.title.en }}</h4>
              <span v-if="isDatasetUnlocked(ds)" class="ccm-status">▶️</span>
              <span v-else class="ccm-status">🔒</span>
            </div>
            <p>{{ ds.subtitle[locale] || ds.subtitle.en }}</p>
            <span class="ccm-points">100 {{ t('sandbox.points') }}</span>
          </div>
        </div>

        <!-- Misleading Graph Cards -->
        <h3 class="subsection-title animate-slide-up">🚩 {{ t('sandbox.misleadingTitle') }}</h3>
        <div class="challenges-grid animate-slide-up">
          <div v-for="ch in MISLEADING_CHALLENGES" :key="ch.id" class="challenge-card-mini"
            :class="{ locked: !isDatasetUnlocked(ch), done: isChallengeDone(ch.id) }"
            @click="startMisleading(ch)">
            <div class="ccm-header">
              <span class="ccm-icon">📊</span>
              <h4>{{ ch.title[locale] || ch.title.en }}</h4>
              <span v-if="isChallengeDone(ch.id)" class="ccm-status done-mark">✅</span>
              <span v-else-if="isDatasetUnlocked(ch)" class="ccm-status">▶️</span>
              <span v-else class="ccm-status">🔒</span>
            </div>
            <p>{{ ch.scenario[locale] || ch.scenario.en }}</p>
            <span class="ccm-points">{{ ch.points }} {{ t('sandbox.points') }}</span>
          </div>
        </div>

        <!-- AI Debate Cards -->
        <h3 class="subsection-title animate-slide-up">🤖 {{ t('sandbox.debateTitle') }}</h3>
        <div class="challenges-grid animate-slide-up">
          <div v-for="db in AI_DEBATE_CHALLENGES" :key="db.id" class="challenge-card-mini"
            :class="{ locked: !isDatasetUnlocked(db), done: isChallengeDone(db.id) }"
            @click="startDebate(db)">
            <div class="ccm-header">
              <span class="ccm-icon">⚖️</span>
              <h4>{{ db.title[locale] || db.title.en }}</h4>
              <span v-if="isChallengeDone(db.id)" class="ccm-status done-mark">✅</span>
              <span v-else-if="isDatasetUnlocked(db)" class="ccm-status">▶️</span>
              <span v-else class="ccm-status">🔒</span>
            </div>
            <p>{{ db.dataset.title[locale] || db.dataset.title.en }}</p>
            <span class="ccm-points">{{ db.points }} {{ t('sandbox.points') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue'
import {
  SANDBOX_TIERS, WHAT_IF_DATASETS, MISLEADING_CHALLENGES, AI_DEBATE_CHALLENGES,
  getSandboxProgress, addSandboxPoints, markChallengeComplete,
  isChallengeComplete, computeLineOfBestFit, filterPoints,
} from '../data/sandboxData'

const t = inject('t')
const locale = inject('locale')
const selectedKidId = inject('selectedKidId')

const kidId = computed(() => selectedKidId?.value)
const progress = ref(getSandboxProgress(kidId.value || 'default'))

const activeMode = ref(null)
const activeDatasetId = ref(null)
const selectedTier = ref(null)

// ── Tier Selection ──
function selectTier(tier) {
  if (!isTierUnlocked(tier.level)) return
  selectedTier.value = selectedTier.value === tier.level ? null : tier.level
}

function getChallengeName(chId) {
  const w = WHAT_IF_DATASETS.find(d => d.id === chId)
  if (w) return w.title[locale.value] || w.title.en
  const m = MISLEADING_CHALLENGES.find(d => d.id === chId)
  if (m) return m.title[locale.value] || m.title.en
  const d = AI_DEBATE_CHALLENGES.find(db => db.id === chId)
  if (d) return d.title[locale.value] || d.title.en
  return chId
}

function openTierChallenge(chId) {
  const w = WHAT_IF_DATASETS.find(d => d.id === chId)
  if (w) { startWhatIf(w); return }
  const m = MISLEADING_CHALLENGES.find(d => d.id === chId)
  if (m) { startMisleading(m); return }
  const d = AI_DEBATE_CHALLENGES.find(db => db.id === chId)
  if (d) { startDebate(d); return }
}

// ── What-If Slider State ──
const outlierSliderVal = ref(0)
const excludedIndices = ref(new Set())
const whatIfAnalysis = ref(false)

const currentWhatIfDataset = computed(() =>
  WHAT_IF_DATASETS.find(d => d.id === activeDatasetId.value) || WHAT_IF_DATASETS[0]
)

const filteredPoints = computed(() =>
  filterPoints(currentWhatIfDataset.value.points, [...excludedIndices.value])
)

const originalBestFit = computed(() => computeLineOfBestFit(currentWhatIfDataset.value.points))
const currentBestFit = computed(() => computeLineOfBestFit(filteredPoints.value))

const originalR2 = computed(() => originalBestFit.value.r2)
const currentR2 = computed(() => currentBestFit.value.r2)

const excludedCount = computed(() => excludedIndices.value.size)

// SVG chart dimensions
const svgWidth = 500
const svgHeight = 300
const chartPadL = 50
const chartPadR = 20
const chartPadT = 20
const chartPadB = 40
const gridStepX = (svgWidth - chartPadL - chartPadR) / 5
const gridStepY = (svgHeight - chartPadT - chartPadB) / 5

function getSvgPoints(dataset, excluded) {
  const points = dataset.points
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1

  const plotW = svgWidth - chartPadL - chartPadR
  const plotH = svgHeight - chartPadT - chartPadB

  return points.map((p, i) => ({
    sx: chartPadL + ((p.x - minX) / rangeX) * plotW,
    sy: svgHeight - chartPadB - ((p.y - minY) / rangeY) * plotH,
    excluded: excluded.has(i),
  }))
}

const svgPoints = computed(() => getSvgPoints(currentWhatIfDataset.value, excludedIndices.value))

const bestFitLine = computed(() => {
  if (filteredPoints.value.length < 2) return null
  const bf = currentBestFit.value
  const points = currentWhatIfDataset.value.points
  const xs = points.map(p => p.x)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...filteredPoints.value.map(p => p.y))
  const maxY = Math.max(...filteredPoints.value.map(p => p.y))
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1
  const plotW = svgWidth - chartPadL - chartPadR
  const plotH = svgHeight - chartPadT - chartPadB

  const x1 = minX
  const x2 = maxX
  const y1 = bf.slope * x1 + bf.intercept
  const y2 = bf.slope * x2 + bf.intercept

  return {
    x1: chartPadL,
    y1: svgHeight - chartPadB - ((y1 - minY) / rangeY) * plotH,
    x2: chartPadL + plotW,
    y2: svgHeight - chartPadB - ((y2 - minY) / rangeY) * plotH,
  }
})

function toggleExclude(idx) {
  const s = new Set(excludedIndices.value)
  if (s.has(idx)) s.delete(idx)
  else s.add(idx)
  excludedIndices.value = s
}

function isExcluded(idx) {
  return excludedIndices.value.has(idx)
}

// ── Misleading Graph State ──
const currentMisleading = ref(null)
const selectedFlag = ref(null)
const misleadingAnswered = ref(false)
const misleadingCorrect = ref(false)

const yTicks = computed(() => {
  if (!currentMisleading.value) return []
  const d = currentMisleading.value.chartData
  const ticks = []
  const steps = 5
  const range = d.yMax - d.yMin
  for (let i = 0; i <= steps; i++) {
    const val = d.yMin + (range * i) / steps
    const plotH = svgHeight - chartPadT - chartPadB
    const y = svgHeight - chartPadB - (i / steps) * plotH
    ticks.push({ y, label: formatCurrency(val) })
  }
  return ticks
})

const barGroupWidth = computed(() => {
  if (!currentMisleading.value) return 0
  const count = currentMisleading.value.chartData.values.length
  return (svgWidth - chartPadL - chartPadR) / count
})

const barWidth = computed(() => barGroupWidth.value * 0.6)

const misleadingBars = computed(() => {
  if (!currentMisleading.value) return []
  const d = currentMisleading.value.chartData
  const plotH = svgHeight - chartPadT - chartPadB
  const range = d.yMax - d.yMin

  return d.values.map((val, i) => {
    const x = chartPadL + i * barGroupWidth.value + (barGroupWidth.value - barWidth.value) / 2
    const h = ((val - d.yMin) / range) * plotH
    return { x, y: svgHeight - chartPadB - h, h }
  })
})

function formatCurrency(val) {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k'
  return '$' + val
}

// ── AI Debate State ──
const currentDebate = ref(null)
const selectedFlaws = ref([])
const debateAnswered = ref(false)
const debateScore = ref(0)

const debatePoints = computed(() => {
  if (!currentDebate.value) return []
  const ds = currentDebate.value.dataset
  if (!ds.points) return []
  const xs = ds.points.map(p => p.x)
  const ys = ds.points.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1
  const plotW = svgWidth - chartPadL - chartPadR
  const plotH = svgHeight - chartPadT - chartPadB

  return ds.points.map(p => ({
    sx: chartPadL + ((p.x - minX) / rangeX) * plotW,
    sy: svgHeight - chartPadB - ((p.y - minY) / rangeY) * plotH,
  }))
})

const debateXLabel = computed(() => {
  if (!currentDebate.value?.dataset) return ''
  const ds = currentDebate.value.dataset
  return ds.xLabel?.[locale.value] || ds.xLabel?.en || ''
})

// ── Progress & Unlock Logic ──
function isTierUnlocked(level) {
  return progress.value.unlockedTiers.includes(level)
}

function isTierComplete(level) {
  const tier = SANDBOX_TIERS.find(t => t.level === level)
  if (!tier) return false
  return tier.challenges.every(cId => progress.value.completedChallenges.includes(cId))
}

function isDatasetUnlocked(item) {
  const tier = SANDBOX_TIERS.find(t => t.challenges.includes(item.id))
  if (!tier) return true
  return isTierUnlocked(tier.level)
}

function isChallengeDone(challengeId) {
  return progress.value.completedChallenges.includes(challengeId)
}

function refreshProgress() {
  progress.value = getSandboxProgress(kidId.value || 'default')
}

// ── Challenge Starters ──
function startWhatIf(dataset) {
  if (!isDatasetUnlocked(dataset)) return
  activeMode.value = 'whatif'
  activeDatasetId.value = dataset.id
  excludedIndices.value = new Set()
  outlierSliderVal.value = 0
  whatIfAnalysis.value = false

  if (!isChallengeDone(dataset.id)) {
    const p = addSandboxPoints(kidId.value || 'default', 100)
    markChallengeComplete(kidId.value || 'default', dataset.id)
    refreshProgress()
  }
}

function startMisleading(challenge) {
  if (!isDatasetUnlocked(challenge)) return
  activeMode.value = 'misleading'
  currentMisleading.value = challenge
  selectedFlag.value = null
  misleadingAnswered.value = false
  misleadingCorrect.value = false
}

function startDebate(challenge) {
  if (!isDatasetUnlocked(challenge)) return
  activeMode.value = 'debate'
  currentDebate.value = challenge
  selectedFlaws.value = []
  debateAnswered.value = false
  debateScore.value = 0
}

function exitChallenge() {
  activeMode.value = null
  activeDatasetId.value = null
  currentMisleading.value = null
  currentDebate.value = null
}

// ── Challenge Submissions ──
function submitMisleadingFlag() {
  if (!selectedFlag.value || !currentMisleading.value) return
  misleadingAnswered.value = true
  misleadingCorrect.value = selectedFlag.value === currentMisleading.value.correctFlag

  if (misleadingCorrect.value) {
    const p = addSandboxPoints(kidId.value || 'default', currentMisleading.value.points)
    markChallengeComplete(kidId.value || 'default', currentMisleading.value.id)
    refreshProgress()
  }
}

function submitDebate() {
  if (selectedFlaws.value.length === 0 || !currentDebate.value) return
  debateAnswered.value = true
  debateScore.value = selectedFlaws.value.length

  if (debateScore.value >= 2) {
    const p = addSandboxPoints(kidId.value || 'default', currentDebate.value.points)
    markChallengeComplete(kidId.value || 'default', currentDebate.value.id)
    refreshProgress()
  }
}

watch(() => kidId.value, refreshProgress)
</script>

<style scoped lang="scss">
.sandbox-page { padding: 20px 0 60px; }

.page-header { margin-bottom: 24px; }
.back-link { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light); display: inline-flex; align-items: center; margin-bottom: 12px; transition: color 0.2s; &:hover { color: var(--primary); } }
.page-title { font-size: 2rem; font-weight: 700; }
.page-subtitle { color: var(--text-light); font-size: 0.95rem; margin-top: 4px; margin-bottom: 16px; }

/* Stats Row */
.sandbox-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px; }
.ss-card {
  background: var(--bg-card); border-radius: var(--radius); padding: 16px; text-align: center;
  box-shadow: var(--shadow);
}
.ss-icon { font-size: 1.3rem; display: block; margin-bottom: 4px; }
.ss-val { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; display: block; }
.ss-lbl { font-size: 0.75rem; color: var(--text-muted); }

/* Section Titles */
.section-title { font-size: 1.3rem; font-weight: 700; margin: 24px 0 14px; }
.subsection-title { font-size: 1.05rem; font-weight: 600; margin: 18px 0 10px; color: var(--text-light); }

/* Tier Cards (Section 3) */
.tiers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 28px; }
.tier-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 20px;
  box-shadow: var(--shadow); border: 2px solid transparent; transition: all 0.3s; cursor: pointer;
  &.active { border-color: var(--tier-color); box-shadow: 0 4px 20px color-mix(in srgb, var(--tier-color) 20%, transparent); }
  &.locked { opacity: 0.55; cursor: not-allowed; }
  &.expanded { border-color: var(--tier-color); }
}
.tier-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.tier-icon { font-size: 2.2rem; }
.tier-header h3 { font-size: 1.05rem; }
.tier-level { font-size: 0.75rem; color: var(--text-muted); }
.tier-lock { font-size: 1.4rem; margin-left: auto; }
.tier-done { font-size: 1.4rem; margin-left: auto; }
.tier-expand { font-size: 1rem; margin-left: auto; color: var(--text-muted); transition: transform 0.3s; }
.tier-body { margin-bottom: 10px; }
.tier-skill { font-size: 0.85rem; color: var(--text-light); margin-bottom: 8px; line-height: 1.4; }
.tier-charts { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.tier-chart-badge {
  padding: 3px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 600;
  background: var(--chip-bg); color: var(--primary);
}
.tier-theme { font-size: 0.82rem; font-style: italic; color: var(--text-muted); }
.tier-unlock-req {
  padding: 8px 12px; background: rgba(253, 203, 110, 0.12); border-radius: 8px;
  font-size: 0.78rem; font-weight: 600; color: var(--warning); text-align: center;
}

/* Expanded Tier Challenges */
.tier-challenges { margin-top: 14px; border-top: 1px solid var(--border); padding-top: 12px; }
.tier-ch-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: 10px; transition: background 0.2s; cursor: pointer;
  &:hover { background: var(--chip-bg); }
  &.done { opacity: 0.7; }
}
.tci-icon { font-size: 1rem; flex-shrink: 0; }
.tci-name { flex: 1; font-size: 0.88rem; font-weight: 600; }
.tci-done { font-size: 0.72rem; color: var(--success); font-weight: 600; }

/* Challenge Cards (Section 4) */
.challenges-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.challenge-card-mini {
  display: flex; flex-direction: column; gap: 6px; padding: 16px 20px;
  background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow);
  border: 2px solid transparent; cursor: pointer; transition: all 0.3s;
  &:hover:not(.locked) { border-color: var(--primary-light); transform: translateY(-2px); }
  &.locked { opacity: 0.45; cursor: not-allowed; }
  &.done { border-color: rgba(0, 184, 148, 0.2); }
}
.ccm-header { display: flex; align-items: center; gap: 10px; }
.ccm-icon { font-size: 1.3rem; }
.ccm-header h4 { flex: 1; font-size: 0.95rem; }
.ccm-status { font-size: 1rem; }
.done-mark { color: var(--success); }
.challenge-card-mini p { font-size: 0.82rem; color: var(--text-light); line-height: 1.4; }
.ccm-points { font-size: 0.75rem; color: var(--primary); font-weight: 600; }

/* Active Challenge View */
.challenge-view { max-width: 700px; margin: 0 auto; }
.btn-back-challenge {
  background: transparent; color: var(--text-light); font-family: var(--font-display);
  font-weight: 500; font-size: 0.9rem; margin-bottom: 16px; padding: 8px 0;
  &:hover { color: var(--primary); }
}
.challenge-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 28px;
  box-shadow: var(--shadow); margin-bottom: 20px;
  h2 { font-size: 1.2rem; margin-bottom: 8px; }
}
.challenge-desc { color: var(--text-light); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; }

/* Chart Container */
.chart-container {
  background: var(--chip-bg); border-radius: var(--radius); padding: 16px;
  margin-bottom: 20px; overflow-x: auto;
}
.scatter-svg, .misleading-svg, .debate-svg { width: 100%; min-width: 350px; }
.data-point { transition: all 0.3s; cursor: pointer; }
.bar-rect { transition: all 0.5s ease; }

/* What-If Controls */
.whatif-controls {
  padding: 16px; background: var(--chip-bg); border-radius: var(--radius); margin-bottom: 16px;
}
.slider-label { font-weight: 700; font-size: 0.9rem; display: block; margin-bottom: 8px; }
.slider-track { margin-bottom: 10px; }
.custom-slider {
  width: 100%; height: 8px; border-radius: 4px; background: var(--border); outline: none;
  -webkit-appearance: none; appearance: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
    background: var(--accent); cursor: pointer; border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  &::-moz-range-thumb {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--accent); cursor: pointer; border: 3px solid white;
  }
}
.slider-info { font-size: 0.85rem; color: var(--text-light); margin-bottom: 8px; }

/* AI Analysis */
.ai-analysis-card {
  padding: 16px; background: rgba(108, 92, 231, 0.06); border-radius: var(--radius);
  border-left: 4px solid var(--primary); margin-bottom: 16px;
  h4 { margin-bottom: 8px; }
  p { font-size: 0.9rem; color: var(--text-light); line-height: 1.5; }
}
.analysis-comparison { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.ac-side { text-align: center; flex: 1; }
.ac-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
.ac-val { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--primary); }
.ac-after .ac-val { color: var(--success); }
.ac-arrow { font-size: 1.2rem; color: var(--text-muted); }

/* Flag Options */
.flag-options { margin-bottom: 16px;
  h4 { margin-bottom: 12px; font-size: 0.95rem; }
}
.flag-btn {
  display: block; width: 100%; text-align: left; padding: 12px 16px;
  background: rgba(255, 118, 117, 0.04); border: 2px solid rgba(255, 118, 117, 0.1);
  border-radius: 12px; font-size: 0.9rem; margin-bottom: 8px; transition: all 0.2s;
  &:hover { border-color: var(--danger); background: rgba(255, 118, 117, 0.08); }
  &.selected { border-color: var(--danger); background: rgba(255, 118, 117, 0.12); }
}

/* AI Claim Card */
.ai-claim-card {
  display: flex; gap: 14px; padding: 18px; background: rgba(0, 206, 201, 0.06);
  border-radius: var(--radius); border: 2px solid rgba(0, 206, 201, 0.15); margin-bottom: 20px;
}
.ai-avatar { font-size: 2rem; flex-shrink: 0; }
.ai-claim-text { flex: 1; }
.ai-claim-text h4 { font-size: 0.85rem; color: var(--secondary); margin-bottom: 6px; }
.ai-quote { font-size: 0.95rem; font-style: italic; color: var(--text-light); line-height: 1.5; }

/* Flaw Selection */
.flaw-selection { margin-bottom: 16px;
  h4 { margin-bottom: 6px; }
}
.flaw-hint { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; }
.flaw-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.flaw-option {
  display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
  background: rgba(253, 203, 110, 0.04); border: 2px solid rgba(253, 203, 110, 0.12);
  border-radius: 12px; cursor: pointer; transition: all 0.2s;
  input[type="checkbox"] { margin-top: 3px; accent-color: var(--primary); }
  &:hover { border-color: var(--warning); }
  &.selected { border-color: var(--warning); background: rgba(253, 203, 110, 0.1); }
}
.flaw-text { font-size: 0.88rem; line-height: 1.4; }

/* Challenge Result */
.challenge-result {
  padding: 20px; border-radius: var(--radius-lg); text-align: center; margin-top: 16px;
  &.correct { background: rgba(0, 184, 148, 0.08); border: 2px solid rgba(0, 184, 148, 0.2); }
  &.wrong { background: rgba(255, 118, 117, 0.06); border: 2px solid rgba(255, 118, 117, 0.15); }
}
.cr-icon { font-size: 3rem; margin-bottom: 8px; }
.cr-points { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--success); margin-top: 10px; }
.flaw-results { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; text-align: left; }
.flaw-result {
  display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px;
  border-radius: 8px; font-size: 0.85rem; line-height: 1.4;
  &.found { background: rgba(0, 184, 148, 0.08); }
  &:not(.found) { background: rgba(255, 118, 117, 0.06); color: var(--text-light); }
}
.fr-icon { flex-shrink: 0; }

/* Buttons */
.btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; cursor: pointer; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); &:hover { transform: translateY(-2px); } }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
.btn-sm { padding: 8px 16px; font-size: 0.82rem; }

@media (max-width: 640px) {
  .tiers-grid { grid-template-columns: 1fr; }
  .chart-container { padding: 10px; }
}
</style>
