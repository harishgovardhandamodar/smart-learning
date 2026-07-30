<template>
  <div class="mindmap-wrapper">
    <button class="mindmap-toggle" @click="visible = !visible" :class="{ active: visible }">
      <span>🗺️</span>
      <span>{{ visible ? 'Hide Mind Map' : 'Show Mind Map' }}</span>
    </button>

    <transition name="mm-expand">
      <div v-if="visible" class="mindmap-container">
        <div class="mindmap-header">
          <h3>🧠 Key Concepts</h3>
          <p class="mindmap-question">{{ question }}</p>
          <span class="drag-hint">Drag nodes to rearrange</span>
        </div>

        <div class="mindmap-canvas" ref="canvasRef">
          <svg
            :width="svgW"
            :height="svgH"
            ref="svgRef"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointerleave="onPointerUp"
          >
            <defs>
              <filter id="mmShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="rgba(108,92,231,0.18)" />
              </filter>
              <linearGradient id="mmCenterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6C5CE7" />
                <stop offset="100%" stop-color="#A29BFE" />
              </linearGradient>
            </defs>

            <!-- connections -->
            <g class="connections-layer">
              <path
                v-for="(conn, ci) in connections"
                :key="'c-' + ci"
                :d="conn.d"
                fill="none"
                :stroke="conn.color"
                :stroke-width="conn.width"
                stroke-linecap="round"
                :opacity="conn.opacity"
                class="conn-line"
              />
            </g>

            <!-- leaf nodes (render first so branches are on top) -->
            <g
              v-for="(n, i) in leafNodes"
              :key="'leaf-' + i"
              class="mm-node leaf-node"
              :class="{ dragging: dragId === n.id }"
              :style="{ cursor: 'grab' }"
              @pointerdown.prevent="onPointerDown($event, n.id)"
            >
              <rect
                :x="n.x - n.w / 2"
                :y="n.y - n.h / 2"
                :width="n.w"
                :height="n.h"
                :rx="8"
                fill="white"
                :stroke="n.color"
                stroke-width="1.5"
                filter="url(#mmShadow)"
              />
              <text
                :x="n.x"
                :y="n.y + 1"
                text-anchor="middle"
                dominant-baseline="middle"
                class="leaf-text"
                font-size="10"
                fill="#636E72"
              >{{ n.label }}</text>
            </g>

            <!-- branch nodes -->
            <g
              v-for="(n, i) in branchNodes"
              :key="'branch-' + i"
              class="mm-node branch-node"
              :class="{ dragging: dragId === n.id }"
              :style="{ cursor: 'grab' }"
              @pointerdown.prevent="onPointerDown($event, n.id)"
            >
              <rect
                :x="n.x - n.w / 2"
                :y="n.y - n.h / 2"
                :width="n.w"
                :height="n.h"
                :rx="12"
                :fill="n.color"
                filter="url(#mmShadow)"
              />
              <text
                :x="n.x"
                :y="n.y - 5"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="16"
              >{{ n.icon }}</text>
              <text
                :x="n.x"
                :y="n.y + 14"
                text-anchor="middle"
                dominant-baseline="middle"
                class="branch-text"
                font-size="10.5"
                fill="white"
              >{{ n.label }}</text>
            </g>

            <!-- center node -->
            <g
              class="mm-node center-node"
              :class="{ dragging: dragId === 'center' }"
              style="cursor: grab"
              @pointerdown.prevent="onPointerDown($event, 'center')"
            >
              <circle
                :cx="center.x"
                :cy="center.y"
                :r="center.r"
                fill="url(#mmCenterGrad)"
                filter="url(#mmShadow)"
              />
              <text
                :x="center.x"
                :y="center.y - 8"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="22"
              >{{ topicIcon }}</text>
              <text
                :x="center.x"
                :y="center.y + 14"
                text-anchor="middle"
                dominant-baseline="middle"
                class="center-text"
                font-size="11"
                fill="white"
              >{{ center.label }}</text>
            </g>
          </svg>
        </div>

        <div class="concept-list">
          <div
            v-for="(c, i) in concepts"
            :key="i"
            class="concept-card"
            :style="{ borderLeftColor: BRANCH_COLORS[i % BRANCH_COLORS.length] }"
          >
            <div class="concept-header">
              <span>{{ c.icon }}</span>
              <strong>{{ c.concept }}</strong>
            </div>
            <p class="concept-detail">{{ c.detail }}</p>
            <div v-if="c.keywords?.length" class="concept-keywords">
              <span v-for="kw in c.keywords" :key="kw" class="kw-tag">{{ kw }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  concepts: { type: Array, default: () => [] },
  question: { type: String, default: '' },
  topicIcon: { type: String, default: '💡' },
})

const BRANCH_COLORS = [
  '#6C5CE7', '#00B894', '#E17055', '#0984E3',
  '#FD79A8', '#FDCB6E', '#00CEC9', '#A29BFE',
]
const BRANCH_ICONS = ['💡', '⚡', '🔬', '🔗', '🌟', '🎯', '🔑', '📌']

const STOP_WORDS = new Set([
  'what', 'why', 'how', 'when', 'where', 'who', 'which', 'is', 'are',
  'do', 'does', 'did', 'can', 'could', 'would', 'should', 'will',
  'the', 'a', 'an', 'to', 'in', 'of', 'for', 'on', 'at', 'by',
  'with', 'from', 'about', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'between', 'tell', 'explain', 'make',
  'made', 'become', 'work', 'works', 'this', 'that', 'it', 'i',
  'me', 'my', 'we', 'you', 'your', 'they', 'them', 'and', 'or',
  'but', 'not', 'no', 'so', 'if', 'then', 'than', 'just',
  'also', 'very', 'really', 'some', 'any', 'all', 'each', 'every',
  'get', 'got', 'has', 'have', 'had', 'was', 'were', 'been', 'being',
])

function extractTopicFromQuestion(q) {
  if (!q) return 'Topic'
  const cleaned = q.replace(/[?!.,;:'"()]/g, ' ').replace(/\s+/g, ' ').trim()
  const words = cleaned.split(' ')

  const meaningful = words.filter(w => {
    const lower = w.toLowerCase()
    return lower.length > 2 && !STOP_WORDS.has(lower)
  })

  if (meaningful.length === 0) return truncate(words[words.length - 1] || 'Topic', 18)

  const phrase = meaningful.slice(0, 4).join(' ')
  const capitalized = phrase.charAt(0).toUpperCase() + phrase.slice(1)
  return truncate(capitalized, 22)
}

const visible = ref(false)
const canvasRef = ref(null)
const svgRef = ref(null)
const svgW = ref(680)
const svgH = ref(440)

// all draggable nodes stored as a flat map: id -> { x, y, ... }
const nodes = ref({})
const dragId = ref(null)
const dragOffset = ref({ x: 0, y: 0 })

function truncate(s, len) { return s && s.length > len ? s.slice(0, len) + '…' : s || '' }
function measureTextW(text, fontSize) { return text.length * fontSize * 0.58 + 20 }

// ── compute initial positions (collision-free) ──
function computeLayout() {
  const concepts = props.concepts || []
  const count = concepts.length
  if (count === 0) return

  const cx = svgW.value / 2
  const cy = svgH.value / 2
  const centerR = 40
  const placed = [] // { x, y, w, h }

  const newNodes = {}

  // center
  newNodes['center'] = { id: 'center', x: cx, y: cy, r: centerR, label: extractTopicFromQuestion(props.question), icon: props.topicIcon, type: 'center' }
  placed.push({ x: cx, y: cy, w: centerR * 2, h: centerR * 2 })

  const branchR = Math.min(svgW.value, svgH.value) * 0.30
  const leafDist = 90

  for (let i = 0; i < count; i++) {
    const c = concepts[i]
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const color = BRANCH_COLORS[i % BRANCH_COLORS.length]

    // place branch node
    let bx = cx + Math.cos(angle) * branchR
    let by = cy + Math.sin(angle) * branchR
    const bw = Math.max(100, Math.min(measureTextW(c.concept, 10.5) + 10, 150))
    const bh = 42

    // push away from existing nodes
    const branchRect = { x: bx, y: by, w: bw, h: bh }
    resolveOverlap(branchRect, placed, 8)
    bx = branchRect.x
    by = branchRect.y
    placed.push({ ...branchRect })

    const bId = `b-${i}`
    newNodes[bId] = {
      id: bId, x: bx, y: by, w: bw, h: bh,
      color, icon: c.icon || BRANCH_ICONS[i % BRANCH_ICONS.length],
      label: truncate(c.concept, 18), type: 'branch',
      centerIdx: i,
    }

    // place leaf nodes
    const keywords = c.keywords || []
    const leafCount = Math.min(keywords.length, 4)
    if (leafCount === 0) continue

    const outwardAngle = Math.atan2(by - cy, bx - cx)
    const spread = Math.min(leafCount * 0.55, 1.8)
    const startA = outwardAngle - spread / 2

    for (let j = 0; j < leafCount; j++) {
      const la = leafCount === 1 ? outwardAngle : startA + (j / (leafCount - 1)) * spread
      let lx = bx + Math.cos(la) * leafDist
      let ly = by + Math.sin(la) * leafDist
      const lw = Math.max(72, measureTextW(keywords[j], 10))
      const lh = 24

      const leafRect = { x: lx, y: ly, w: lw, h: lh }
      resolveOverlap(leafRect, placed, 6)
      lx = leafRect.x
      ly = leafRect.y
      placed.push({ ...leafRect })

      newNodes[`l-${i}-${j}`] = {
        id: `l-${i}-${j}`, x: lx, y: ly, w: lw, h: lh,
        color, label: truncate(keywords[j], 20), type: 'leaf',
        parentBranch: bId,
      }
    }
  }

  nodes.value = newNodes
}

function resolveOverlap(rect, placed, padding) {
  const pad = padding || 6
  for (let iter = 0; iter < 40; iter++) {
    let moved = false
    for (const other of placed) {
      const ox = other.x, oy = other.y, ow = other.w / 2 + pad, oh = other.h / 2 + pad
      const nx = rect.x, ny = rect.y, nw = rect.w / 2 + pad, nh = rect.h / 2 + pad

      const dx = nx - ox
      const dy = ny - oy
      const overlapX = ow + nw - Math.abs(dx)
      const overlapY = oh + nh - Math.abs(dy)

      if (overlapX > 0 && overlapY > 0) {
        moved = true
        if (overlapX < overlapY) {
          rect.x += (dx >= 0 ? overlapX / 2 : -overlapX / 2)
        } else {
          rect.y += (dy >= 0 ? overlapY / 2 : -overlapY / 2)
        }
      }
    }
    if (!moved) break
  }
}

// ── computed node lists ──
const center = computed(() => nodes.value['center'] || { x: 0, y: 0, r: 40, label: '', icon: '' })

const branchNodes = computed(() =>
  Object.values(nodes.value).filter(n => n.type === 'branch')
)

const leafNodes = computed(() =>
  Object.values(nodes.value).filter(n => n.type === 'leaf')
)

// ── connections (always recalculated from positions) ──
const connections = computed(() => {
  const all = nodes.value
  const c = all['center']
  if (!c) return []

  const conns = []

  for (const n of Object.values(all)) {
    if (n.type === 'branch') {
      conns.push({
        d: bezierPath(c.x, c.y, n.x, n.y),
        color: n.color,
        width: 2.5,
        opacity: 0.45,
      })
    }
    if (n.type === 'leaf' && n.parentBranch) {
      const p = all[n.parentBranch]
      if (p) {
        conns.push({
          d: bezierPath(p.x, p.y, n.x, n.y),
          color: p.color,
          width: 1.5,
          opacity: 0.25,
        })
      }
    }
  }
  return conns
})

function bezierPath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  // slight curve perpendicular to line
  const cx1 = mx - dy * 0.15
  const cy1 = my + dx * 0.15
  return `M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`
}

// ── drag & drop ──
function getSVGPoint(e) {
  const svg = svgRef.value
  if (!svg) return { x: 0, y: 0 }
  const rect = svg.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function onPointerDown(e, id) {
  const pt = getSVGPoint(e)
  const node = nodes.value[id]
  if (!node) return

  dragId.value = id
  dragOffset.value = { x: pt.x - node.x, y: pt.y - node.y }

  if (svgRef.value) {
    svgRef.value.setPointerCapture(e.pointerId)
  }
}

function onPointerMove(e) {
  if (!dragId.value) return
  const pt = getSVGPoint(e)
  const nx = pt.x - dragOffset.value.x
  const ny = pt.y - dragOffset.value.y

  const n = nodes.value[dragId.value]
  if (!n) return

  const dx = nx - n.x
  const dy = ny - n.y

  // move the dragged node
  n.x = nx
  n.y = ny

  // if dragging branch, move its children too
  if (n.type === 'branch') {
    for (const child of Object.values(nodes.value)) {
      if (child.type === 'leaf' && child.parentBranch === n.id) {
        child.x += dx
        child.y += dy
      }
    }
  }

  // if dragging center, move everything
  if (n.type === 'center') {
    for (const child of Object.values(nodes.value)) {
      if (child.id !== 'center') {
        child.x += dx
        child.y += dy
      }
    }
  }

  // trigger reactivity
  nodes.value = { ...nodes.value }
}

function onPointerUp() {
  dragId.value = null
}

// ── sizing ──
function updateSize() {
  if (canvasRef.value) {
    const w = canvasRef.value.clientWidth
    svgW.value = Math.max(500, w)
    svgH.value = Math.max(350, Math.min(480, w * 0.62))
  }
}

onMounted(() => {
  updateSize()
  computeLayout()
})

watch(visible, (v) => {
  if (v) {
    nextTick(() => {
      updateSize()
      computeLayout()
    })
  }
})

watch(() => props.concepts, () => {
  if (visible.value) {
    nextTick(computeLayout)
  }
})
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
}

.mm-expand-enter-active { animation: mm-in 0.35s ease; }
.mm-expand-leave-active { animation: mm-in 0.25s ease reverse; }
@keyframes mm-in {
  from { opacity: 0; max-height: 0; transform: scaleY(0.85); }
  to { opacity: 1; max-height: 2000px; transform: scaleY(1); }
}

.mindmap-container {
  margin-top: 12px;
  background: linear-gradient(135deg, rgba(108,92,231,0.03), rgba(0,206,201,0.03));
  border: 1.5px solid rgba(108,92,231,0.1);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
}

.mindmap-header {
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;

  h3 {
    font-size: 1rem;
    font-weight: 700;
  }

  .mindmap-question {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-style: italic;
    flex: 1;
  }

  .drag-hint {
    font-size: 0.7rem;
    color: var(--text-muted);
    background: rgba(108,92,231,0.06);
    padding: 3px 10px;
    border-radius: 8px;
    white-space: nowrap;
  }
}

.mindmap-canvas {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 16px;
  text-align: center;

  svg {
    display: inline-block;
    touch-action: none;
    user-select: none;
  }
}

.conn-line {
  transition: d 0.05s linear;
}

.mm-node {
  transition: filter 0.15s ease;

  &.dragging {
    filter: url(#mmShadow) brightness(1.08);
    opacity: 0.92;
  }

  &:not(.dragging):hover {
    filter: url(#mmShadow) brightness(1.04);
  }
}

.branch-text, .center-text, .leaf-text {
  font-family: var(--font-display);
  font-weight: 600;
  fill: var(--text-light);
  pointer-events: none;
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
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.25s; }
  &:nth-child(5) { animation-delay: 0.3s; }
  &:nth-child(6) { animation-delay: 0.35s; }
}

.concept-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 1rem;

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

.kw-tag {
  background: rgba(108,92,231,0.06);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .concept-list { grid-template-columns: 1fr; }
  .mindmap-header { flex-direction: column; gap: 6px; }
}
</style>
