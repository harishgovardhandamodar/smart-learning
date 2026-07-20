<template>
  <div class="mindmap-wrapper">
    <button class="mindmap-toggle" @click="visible = !visible" :class="{ active: visible }">
      <span class="toggle-icon">{{ visible ? '🗺️' : '🗺️' }}</span>
      <span>{{ visible ? 'Hide Mind Map' : 'Show Mind Map' }}</span>
    </button>

    <transition name="mindmap-expand">
      <div v-if="visible" class="mindmap-container">
        <div class="mindmap-header">
          <h3>🧠 Key Concepts</h3>
          <p class="mindmap-question">{{ question }}</p>
        </div>
        <div class="mindmap-canvas" ref="canvasRef">
          <svg :width="svgWidth" :height="svgHeight" ref="svgRef">
            <defs>
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(108,92,231,0.15)" />
              </filter>
              <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6C5CE7" />
                <stop offset="100%" stop-color="#A29BFE" />
              </linearGradient>
            </defs>

            <g v-for="(branch, bi) in layout.branches" :key="bi" class="branch-group">
              <path
                :d="branch.path"
                fill="none"
                :stroke="branch.color"
                stroke-width="2.5"
                stroke-linecap="round"
                :opacity="0.5"
                class="branch-line"
                :style="{ animationDelay: `${bi * 0.1}s` }"
              />

              <g v-for="(leaf, li) in branch.leaves" :key="`${bi}-${li}`">
                <path
                  :d="leaf.path"
                  fill="none"
                  :stroke="branch.color"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  :opacity="0.3"
                  class="branch-line"
                  :style="{ animationDelay: `${bi * 0.1 + li * 0.05}s` }"
                />
              </g>
            </g>

            <g
              v-for="(node, ni) in layout.branchNodes"
              :key="'b-' + ni"
              class="node branch-node"
              :style="{ animationDelay: `${ni * 0.08}s` }"
            >
              <rect
                :x="node.x - node.w / 2"
                :y="node.y - node.h / 2"
                :width="node.w"
                :height="node.h"
                :rx="10"
                :fill="node.color"
                filter="url(#nodeShadow)"
                :opacity="0.95"
              />
              <text
                :x="node.x"
                :y="node.y - 4"
                text-anchor="middle"
                dominant-baseline="middle"
                class="node-icon"
                font-size="18"
              >{{ node.icon }}</text>
              <text
                :x="node.x"
                :y="node.y + 14"
                text-anchor="middle"
                dominant-baseline="middle"
                class="node-label"
                font-size="11"
                fill="white"
              >{{ truncate(node.label, 18) }}</text>
            </g>

            <g
              v-for="(node, li) in layout.leafNodes"
              :key="'l-' + li"
              class="node leaf-node"
              :style="{ animationDelay: `${0.3 + li * 0.04}s` }"
            >
              <rect
                :x="node.x - node.w / 2"
                :y="node.y - node.h / 2"
                :width="node.w"
                :height="node.h"
                :rx="8"
                fill="white"
                :stroke="node.borderColor"
                stroke-width="1.5"
                filter="url(#nodeShadow)"
              />
              <text
                :x="node.x"
                :y="node.y"
                text-anchor="middle"
                dominant-baseline="middle"
                class="leaf-label"
                font-size="10"
                fill="#636E72"
              >{{ truncate(node.label, 24) }}</text>
            </g>

            <g class="center-node">
              <circle
                :cx="layout.center.x"
                :cy="layout.center.y"
                :r="layout.center.r"
                fill="url(#centerGrad)"
                filter="url(#nodeShadow)"
              />
              <text
                :x="layout.center.x"
                :y="layout.center.y - 8"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="24"
              >{{ topicIcon }}</text>
              <text
                :x="layout.center.x"
                :y="layout.center.y + 16"
                text-anchor="middle"
                dominant-baseline="middle"
                class="center-label"
                font-size="11"
                fill="white"
              >{{ truncate(centerLabel, 20) }}</text>
            </g>
          </svg>
        </div>

        <div class="concept-list">
          <div
            v-for="(branch, i) in concepts"
            :key="i"
            class="concept-card"
            :style="{ borderLeftColor: branchColors[i % branchColors.length] }"
          >
            <div class="concept-header">
              <span class="concept-icon">{{ branch.icon }}</span>
              <strong>{{ branch.concept }}</strong>
            </div>
            <p class="concept-detail">{{ branch.detail }}</p>
            <div v-if="branch.keywords?.length" class="concept-keywords">
              <span v-for="kw in branch.keywords" :key="kw" class="keyword-tag">{{ kw }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  concepts: { type: Array, default: () => [] },
  question: { type: String, default: '' },
  topicIcon: { type: String, default: '💡' },
  centerLabel: { type: String, default: 'Topic' },
})

const visible = ref(false)
const canvasRef = ref(null)
const svgWidth = ref(600)
const svgHeight = ref(400)

const branchColors = [
  '#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E',
  '#00B894', '#E17055', '#0984E3', '#A29BFE',
]

const branchIcons = ['💡', '🔗', '⚡', '🌟', '🎯', '🔑', '📌', '✨']

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

function measureText(text, fontSize) {
  return text.length * fontSize * 0.55
}

const layout = computed(() => {
  const branches = props.concepts || []
  const cx = svgWidth.value / 2
  const cy = svgHeight.value / 2
  const centerR = 38
  const branchRadius = 150
  const leafRadius = 70
  const count = Math.min(branches.length, 8)

  const branchNodes = []
  const leafNodes = []
  const paths = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const bx = cx + Math.cos(angle) * branchRadius
    const by = cy + Math.sin(angle) * branchRadius
    const color = branchColors[i % branchColors.length]

    const label = branches[i].concept || ''
    const tw = measureText(label, 11)
    const bw = Math.max(110, Math.min(tw + 36, 160))

    branchNodes.push({ x: bx, y: by, w: bw, h: 38, color, label, icon: branches[i].icon || branchIcons[i] })

    const bpath = `M ${cx} ${cy} Q ${cx + Math.cos(angle) * branchRadius * 0.5} ${cy + Math.sin(angle) * branchRadius * 0.5} ${bx} ${by}`

    const leaves = branches[i].keywords || []
    const subLeaves = []
    const leafAngleSpread = Math.min(leaves.length * 0.4, 1.2)

    for (let j = 0; j < leaves.length; j++) {
      const la = angle - leafAngleSpread / 2 + (leaves.length > 1 ? (j / (leaves.length - 1)) * leafAngleSpread : 0)
      const lx = bx + Math.cos(la) * leafRadius
      const ly = by + Math.sin(la) * leafRadius
      const lw = Math.max(70, measureText(leaves[j], 10) + 20)

      leafNodes.push({ x: lx, y: ly, w: lw, h: 24, label: leaves[j], borderColor: color })
      subLeaves.push({ path: `M ${bx} ${by} L ${lx} ${ly}` })
    }

    paths.push({ color, path: bpath, leaves: subLeaves })
  }

  return { center: { x: cx, y: cy, r: centerR }, branches: paths, branchNodes, leafNodes }
})

function updateSize() {
  if (canvasRef.value) {
    const w = canvasRef.value.clientWidth
    svgWidth.value = w
    svgHeight.value = Math.max(320, Math.min(450, w * 0.6))
  }
}

onMounted(updateSize)
watch(visible, (v) => { if (v) setTimeout(updateSize, 50) })
</script>

<style scoped lang="scss">
.mindmap-wrapper {
  margin-top: 8px;
}

.mindmap-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  background: rgba(108, 92, 231, 0.06);
  color: var(--primary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  border: 1.5px solid rgba(108, 92, 231, 0.12);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 92, 231, 0.12);
    transform: translateY(-1px);
  }

  &.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .toggle-icon {
    font-size: 1rem;
  }
}

.mindmap-expand-enter-active {
  animation: expand-in 0.4s ease;
}
.mindmap-expand-leave-active {
  animation: expand-in 0.3s ease reverse;
}
@keyframes expand-in {
  from { opacity: 0; max-height: 0; transform: scaleY(0.8); }
  to { opacity: 1; max-height: 2000px; transform: scaleY(1); }
}

.mindmap-container {
  margin-top: 12px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.03), rgba(0, 206, 201, 0.03));
  border: 1.5px solid rgba(108, 92, 231, 0.1);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
}

.mindmap-header {
  margin-bottom: 12px;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .mindmap-question {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-style: italic;
  }
}

.mindmap-canvas {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 16px;
  text-align: center;

  svg {
    display: inline-block;
  }
}

.center-label {
  font-family: var(--font-display);
  font-weight: 700;
}

.node-label {
  font-family: var(--font-display);
  font-weight: 600;
}

.leaf-label {
  font-family: var(--font-body);
  font-weight: 600;
}

.branch-line {
  animation: draw-line 0.8s ease forwards;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
}

@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}

.node {
  animation: node-pop 0.4s ease forwards;
  opacity: 0;
  transform-origin: center;
}

@keyframes node-pop {
  0% { opacity: 0; transform: scale(0.5); }
  70% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

.center-node {
  animation: node-pop 0.5s ease forwards;
}

.concept-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.concept-card {
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  border-left: 3px solid;
  animation: slide-up 0.4s ease forwards;
  opacity: 0;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }
}

.concept-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;

  .concept-icon {
    font-size: 1rem;
  }

  strong {
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: var(--text);
  }
}

.concept-detail {
  font-size: 0.78rem;
  color: var(--text-light);
  line-height: 1.4;
  margin-bottom: 6px;
}

.concept-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.keyword-tag {
  background: rgba(108, 92, 231, 0.06);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .concept-list {
    grid-template-columns: 1fr;
  }
}
</style>
