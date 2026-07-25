<template>
  <div class="lesson-page">
    <div class="container" v-if="path && lesson">

      <!-- Path Header -->
      <div class="lesson-header animate-slide-up">
        <router-link :to="`/focus/${pathId}`" class="back-link">← {{ t('lesson.backToPath') }}</router-link>
        <div class="lesson-badge" :style="{ background: path.icon ? 'var(--chip-bg)' : 'var(--primary)' }">
          <span class="badge-icon">{{ lesson.icon }}</span>
          <div class="badge-text">
            <h1>{{ getLessonTitle(lesson) }}</h1>
            <span class="lesson-meta">{{ path.icon }} {{ getPathTitle(path) }} · {{ lesson.duration }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="lesson-progress animate-slide-up">
        <div class="lp-bar">
          <div class="lp-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="lp-dots">
          <span v-for="(l, i) in path.lessons" :key="i" class="lp-dot"
            :class="{ completed: isLessonCompleted(i), current: i === lessonIndex, upcoming: i > lessonIndex }"
            @click="goToLesson(i)">
          </span>
        </div>
      </div>

      <!-- Lesson Steps -->
      <div class="lesson-body">

        <!-- Step 1: Concept -->
        <section class="lesson-section animate-slide-up" v-if="activeStep === 'concept'">
          <div class="step-label">{{ t('lesson.understand') }}</div>
          <div class="concept-card">
            <div class="concept-text" v-html="renderText(lesson.concept[locale] || lesson.concept.en)"></div>
          </div>
          <button class="btn btn-primary btn-block" @click="activeStep = 'example'">
            {{ t('lesson.seeExample') }} →
          </button>
        </section>

        <!-- Step 2: Example / Illustration -->
        <section class="lesson-section animate-slide-up" v-if="activeStep === 'example'">
          <div class="step-label">{{ t('lesson.seeIt') }}</div>

          <!-- Bar Chart Example -->
          <div v-if="lesson.example?.type === 'interactive-bar' || lesson.example?.type === 'comparison'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div v-if="exampleData.bars" class="bar-example">
              <div v-for="bar in exampleData.bars" :key="bar.label" class="ex-bar-row">
                <span class="ex-bar-label">{{ bar.emoji || '' }} {{ bar.label }}</span>
                <div class="ex-bar-track">
                  <div class="ex-bar-fill" :style="{ width: (bar.value / maxExampleBar) * 100 + '%', background: bar.color || 'var(--primary)' }"></div>
                </div>
                <span class="ex-bar-val">{{ bar.value }}</span>
              </div>
            </div>
            <div v-if="exampleData.left && exampleData.right" class="comparison-grid">
              <div class="comp-side">
                <h4>{{ exampleData.left.label }}</h4>
                <pre class="comp-data">{{ exampleData.left.content }}</pre>
              </div>
              <div class="comp-side comp-right">
                <h4>{{ exampleData.right.label }}</h4>
                <div class="bar-example compact">
                  <div v-for="bar in exampleData.right.bars" :key="bar.label" class="ex-bar-row">
                    <span class="ex-bar-label">{{ bar.label }}</span>
                    <div class="ex-bar-track">
                      <div class="ex-bar-fill" :style="{ width: (bar.value / 12) * 100 + '%', background: bar.color }"></div>
                    </div>
                    <span class="ex-bar-val">{{ bar.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pie Chart Example -->
          <div v-else-if="lesson.example?.type === 'pie'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="pie-example">
              <svg viewBox="0 0 200 200" class="pie-svg">
                <circle cx="100" cy="100" r="90" fill="var(--border)" />
                <circle v-for="(slice, i) in pieSlices" :key="i" cx="100" cy="100" r="90"
                  fill="none" :stroke="slice.color" stroke-width="30"
                  :stroke-dasharray="`${slice.arc} ${2 * Math.PI * 90}`"
                  :stroke-dashoffset="slice.offset"
                  class="pie-slice" />
              </svg>
              <div class="pie-legend">
                <div v-for="(slice, i) in exampleData.slices" :key="i" class="legend-row">
                  <span class="legend-color" :style="{ background: slice.color }"></span>
                  <span>{{ slice.emoji }} {{ slice.label }}</span>
                  <span class="legend-pct">{{ slice.value }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Line Graph Example -->
          <div v-else-if="lesson.example?.type === 'line'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="line-example">
              <svg viewBox="0 0 400 200" class="line-svg">
                <line v-for="i in 5" :key="'h'+i" :x1="40" :y1="i*35" :x2="390" :y2="i*35" stroke="var(--border)" stroke-width="1" />
                <polyline :points="linePoints" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <circle v-for="(pt, i) in lineDataPoints" :key="'dot'+i" :cx="pt.x" :cy="pt.y" r="5" fill="var(--primary)" class="line-dot" />
                <text v-for="(pt, i) in lineDataPoints" :key="'lbl'+i" :x="pt.x" :y="pt.y - 12" text-anchor="middle" font-size="11" fill="var(--text)" font-weight="600">{{ pt.val }}°</text>
                <text v-for="(pt, i) in lineDataPoints" :key="'day'+i" :x="pt.x" :y="195" text-anchor="middle" font-size="10" fill="var(--text-muted)">{{ pt.label }}</text>
              </svg>
            </div>
          </div>

          <!-- Pictograph Example -->
          <div v-else-if="lesson.example?.type === 'pictograph'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="picto-key">{{ t('lesson.key') }}: {{ exampleData.key }}</div>
            <div class="picto-grid">
              <div v-for="row in exampleData.data" :key="row.label" class="picto-row">
                <span class="picto-label">{{ row.label }}</span>
                <div class="picto-emojis">
                  <span v-for="n in row.count" :key="n" class="picto-emoji">{{ row.emoji }}</span>
                </div>
                <span class="picto-val">{{ row.value }}</span>
              </div>
            </div>
          </div>

          <!-- Decision Example -->
          <div v-else-if="lesson.example?.type === 'decision'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="decision-list">
              <div v-for="(sc, i) in exampleData.scenarios" :key="i" class="decision-row">
                <span class="dec-q">{{ sc.question }}</span>
                <span class="dec-arrow">→</span>
                <span class="dec-answer">{{ sc.icon }} {{ sc.answer }}</span>
                <span class="dec-reason">({{ sc.reason }})</span>
              </div>
            </div>
          </div>

          <!-- Fraction Visual -->
          <div v-else-if="lesson.example?.type === 'fraction-visual'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="fraction-visual">
              <div class="fraction-bar">
                <div v-for="n in exampleData.parts" :key="n" class="fraction-piece"
                  :class="{ filled: n <= exampleData.filled }">
                </div>
              </div>
              <span class="fraction-label">{{ exampleData.label }}</span>
            </div>
          </div>

          <!-- Tally Example -->
          <div v-else-if="lesson.example?.type === 'tally'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="tally-steps">
              <div v-for="(step, i) in exampleData.steps" :key="i" class="tally-step">
                <span class="ts-label">{{ step.step }}:</span>
                <span v-if="step.text" class="ts-text">{{ step.text }}</span>
                <div v-if="step.tally" class="ts-tally">
                  <div v-for="(count, name) in step.tally" :key="name" class="tally-row">
                    <span class="tally-name">{{ name }}</span>
                    <span class="tally-marks">{{ getTallyMarks(count) }}</span>
                    <span class="tally-count">{{ count }}</span>
                  </div>
                </div>
                <div v-if="step.bars" class="ts-bars">
                  <div v-for="bar in step.bars" :key="bar.label" class="ex-bar-row mini">
                    <span class="ex-bar-label">{{ bar.label }}</span>
                    <div class="ex-bar-track">
                      <div class="ex-bar-fill" :style="{ width: (bar.value / 5) * 100 + '%', background: 'var(--primary)' }"></div>
                    </div>
                    <span class="ex-bar-val">{{ bar.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Decimal Grid -->
          <div v-else-if="lesson.example?.type === 'decimal-grid' || lesson.example?.type === 'percentage-grid'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <div class="grid-visual">
              <div class="mini-grid">
                <div v-for="n in (exampleData.total || 100)" :key="n" class="grid-cell"
                  :class="{ filled: n <= (exampleData.filled * (exampleData.grid || 10)) }">
                </div>
              </div>
              <span class="grid-label">{{ exampleData.label }}</span>
            </div>
          </div>

          <!-- Analysis Example -->
          <div v-else-if="lesson.example?.type === 'analysis'" class="example-card">
            <h3>{{ exampleData.title }}</h3>
            <p class="analysis-data">{{ exampleData.data }}</p>
            <div class="analysis-bars">
              <div v-for="r in exampleData.results" :key="r.label" class="ex-bar-row">
                <span class="ex-bar-label">{{ r.label }}</span>
                <div class="ex-bar-track">
                  <div class="ex-bar-fill" :style="{ width: (r.count / 10) * 100 + '%', background: r.color }"></div>
                </div>
                <span class="ex-bar-val">{{ r.count }}</span>
              </div>
            </div>
            <div class="insights-box">
              <h4>💡 {{ t('lesson.insights') }}</h4>
              <ul>
                <li v-for="(ins, i) in exampleData.insights" :key="i">{{ ins }}</li>
              </ul>
            </div>
          </div>

          <!-- WHAT-IF INTERACTIVE -->
          <div v-else-if="activeMode === 'whatif'" class="example-card interactive-example">
            <h3>{{ whatIfData.title?.[locale] || whatIfData.title?.en || 'What-If Explorer' }}</h3>
            <p class="example-subtitle">{{ whatIfData.subtitle?.[locale] || whatIfData.subtitle?.en }}</p>
            <div class="chart-container">
              <svg :viewBox="`0 0 ${_svgW} ${_svgH}`" class="sandbox-svg">
                <line v-for="i in 5" :key="'wh'+i" :x1="_padL" :y1="_padT + i * _gridStepY" :x2="_svgW - _padR" :y2="_padT + i * _gridStepY" stroke="var(--border)" stroke-width="1" />
                <line v-for="i in 5" :key="'wv'+i" :x1="_padL + i * _gridStepX" :y1="_padT" :x2="_padL + i * _gridStepX" :y2="_svgH - _padB" stroke="var(--border)" stroke-width="1" />
                <line :x1="_padL" :y1="_svgH - _padB" :x2="_svgW - _padR" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="_padL" :y1="_padT" :x2="_padL" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <text :x="_svgW / 2" :y="_svgH - 5" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600">{{ whatIfData.xLabel?.[locale] || whatIfData.xLabel?.en || '' }}</text>
                <text :x="10" :y="_svgH / 2" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600" :transform="`rotate(-90, 10, ${_svgH / 2})`">{{ whatIfData.yLabel?.[locale] || whatIfData.yLabel?.en || '' }}</text>
                <line v-if="whatIfBestFitLine" :x1="whatIfBestFitLine.x1" :y1="whatIfBestFitLine.y1" :x2="whatIfBestFitLine.x2" :y2="whatIfBestFitLine.y2" stroke="var(--primary)" stroke-width="2" stroke-dasharray="6,4" opacity="0.6" />
                <circle v-for="(pt, i) in whatIfSvgPoints" :key="'wpt'+i" :cx="pt.sx" :cy="pt.sy" :r="pt.excluded ? 6 : 7" :fill="pt.excluded ? 'var(--text-muted)' : 'var(--accent)'" :opacity="pt.excluded ? 0.3 : 1" :stroke="pt.excluded ? 'var(--danger)' : 'none'" :stroke-width="pt.excluded ? 2 : 0" stroke-dasharray="3,2" />
                <text :x="_svgW - _padR - 5" :y="_padT + 15" text-anchor="end" font-size="11" fill="var(--primary)" font-weight="700">R² = {{ whatIfCurrentR2.toFixed(3) }}</text>
              </svg>
            </div>
            <div class="whatif-controls">
              <label class="slider-label">🚫 {{ t('sandbox.outlierSlider') }}</label>
              <div class="slider-track">
                <input type="range" :min="0" :max="whatIfData.points.length - 1" v-model.number="outlierSliderVal" class="custom-slider" />
              </div>
              <p class="slider-info">{{ t('sandbox.removingPoint') }} <strong>{{ whatIfData.points[outlierSliderVal]?.x }}</strong> · {{ t('sandbox.excludedCount') }}: <strong>{{ whatIfExcludedCount }}</strong></p>
              <button class="btn btn-sm btn-outline" @click="toggleWhatIfExclude(outlierSliderVal)">
                {{ excludedIndices.has(outlierSliderVal) ? t('sandbox.includePoint') : t('sandbox.excludePoint') }}
              </button>
            </div>
            <div v-if="whatIfAnalysis" class="ai-analysis-card">
              <h4>🤖 {{ t('sandbox.aiAnalysis') }}</h4>
              <p>{{ locale === 'nl' ? whatIfData.insightNL : whatIfData.insightEN }}</p>
              <div class="analysis-comparison">
                <div class="ac-side"><span class="ac-label">{{ t('sandbox.withOutliers') }}</span><span class="ac-val">R² = {{ whatIfOriginalR2.toFixed(3) }}</span></div>
                <span class="ac-arrow">→</span>
                <div class="ac-side ac-after"><span class="ac-label">{{ t('sandbox.withoutOutliers') }}</span><span class="ac-val">R² = {{ whatIfCurrentR2.toFixed(3) }}</span></div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" @click="whatIfAnalysis = !whatIfAnalysis">{{ whatIfAnalysis ? t('sandbox.hideAnalysis') : t('sandbox.showAnalysis') }} 🤖</button>
          </div>

          <!-- MISLEADING INTERACTIVE -->
          <div v-else-if="activeMode === 'misleading'" class="example-card interactive-example">
            <h3>{{ misleadingData.title?.[locale] || misleadingData.title?.en || 'Spot the Deception' }}</h3>
            <p class="example-subtitle">{{ misleadingData.scenario?.[locale] || misleadingData.scenario?.en }}</p>
            <div class="chart-container">
              <svg :viewBox="`0 0 ${_svgW} ${_svgH}`" class="sandbox-svg">
                <line v-for="(tick, i) in misleadingYTicks" :key="'myt'+i" :x1="_padL" :y1="tick.y" :x2="_svgW - _padR" :y2="tick.y" stroke="var(--border)" stroke-width="1" />
                <text v-for="(tick, i) in misleadingYTicks" :key="'myl'+i" :x="_padL - 8" :y="tick.y + 4" text-anchor="end" font-size="10" fill="var(--text-muted)">{{ tick.label }}</text>
                <rect v-for="(bar, i) in misleadingBars" :key="'mb'+i" :x="bar.x" :y="bar.y" :width="misleadingBarW" :height="bar.h" :fill="misleadingData.chartData.color || 'var(--danger)'" rx="4" class="bar-rect" />
                <text v-for="(bar, i) in misleadingBars" :key="'mvl'+i" :x="bar.x + misleadingBarW / 2" :y="bar.y - 8" text-anchor="middle" font-size="11" fill="var(--text)" font-weight="700">{{ formatCurrency(misleadingData.chartData.values[i]) }}</text>
                <text v-for="(label, i) in misleadingData.chartData.labels" :key="'mxl'+i" :x="_padL + (i + 0.5) * misleadingBarGroupW" :y="_svgH - _padB + 18" text-anchor="middle" font-size="11" fill="var(--text-muted)">{{ label }}</text>
                <line :x1="_padL" :y1="_svgH - _padB" :x2="_svgW - _padR" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="_padL" :y1="_padT" :x2="_padL" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <rect v-if="misleadingData.chartData.yMin > 0" :x="_padL + 2" :y="_svgH - _padB - 18" width="auto" height="16" fill="rgba(255,118,117,0.15)" rx="4" />
                <text v-if="misleadingData.chartData.yMin > 0" :x="_padL + 6" :y="_svgH - _padB - 6" font-size="10" fill="var(--danger)" font-weight="700">⚠️ Y-axis starts at {{ formatCurrency(misleadingData.chartData.yMin) }}</text>
              </svg>
            </div>
            <div v-if="!misleadingAnswered" class="flag-options">
              <h4>{{ t('sandbox.whatsWrong') }}</h4>
              <button v-for="opt in misleadingData.options" :key="opt.id" class="flag-btn" :class="{ selected: selectedFlag === opt.id }" @click="selectedFlag = opt.id">🚩 {{ opt.label?.[locale] || opt.label?.en }}</button>
              <button class="btn btn-primary" :disabled="!selectedFlag" @click="misleadingAnswered = true">{{ t('sandbox.flagIt') }}</button>
            </div>
            <div v-if="misleadingAnswered" class="challenge-result" :class="selectedFlag === misleadingData.correctFlag ? 'correct' : 'wrong'">
              <div class="cr-icon">{{ selectedFlag === misleadingData.correctFlag ? '🎉' : '💡' }}</div>
              <h3>{{ selectedFlag === misleadingData.correctFlag ? t('sandbox.correctFlag') : t('sandbox.notQuite') }}</h3>
              <p>{{ misleadingData.trick?.[locale] || misleadingData.trick?.en }}</p>
            </div>
          </div>

          <!-- AI DEBATE INTERACTIVE -->
          <div v-else-if="activeMode === 'debate'" class="example-card interactive-example">
            <h3>{{ debateData.title?.[locale] || debateData.title?.en || 'AI Debate' }}</h3>
            <p class="example-subtitle">{{ debateData.dataset.title?.[locale] || debateData.dataset.title?.en }}</p>
            <div class="chart-container">
              <svg :viewBox="`0 0 ${_svgW} ${_svgH}`" class="sandbox-svg">
                <line v-for="i in 5" :key="'dh'+i" :x1="_padL" :y1="_padT + i * _gridStepY" :x2="_svgW - _padR" :y2="_padT + i * _gridStepY" stroke="var(--border)" stroke-width="1" />
                <line :x1="_padL" :y1="_svgH - _padB" :x2="_svgW - _padR" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <line :x1="_padL" :y1="_padT" :x2="_padL" :y2="_svgH - _padB" stroke="var(--text-muted)" stroke-width="2" />
                <text :x="_svgW / 2" :y="_svgH - 5" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="600">{{ debateData.dataset.xLabel?.[locale] || debateData.dataset.xLabel?.en || '' }}</text>
                <circle v-for="(pt, i) in debateSvgPoints" :key="'dp'+i" :cx="pt.sx" :cy="pt.sy" r="7" fill="var(--secondary)" stroke="white" stroke-width="2" />
              </svg>
            </div>
            <div class="ai-claim-card">
              <div class="ai-avatar">🤖</div>
              <div class="ai-claim-text">
                <h4>{{ t('sandbox.aiClaims') }}</h4>
                <p class="ai-quote">"{{ debateData.aiClaim?.[locale] || debateData.aiClaim?.en }}"</p>
              </div>
            </div>
            <div v-if="!debateAnswered" class="flaw-selection">
              <h4>{{ t('sandbox.findFlaws') }}</h4>
              <p class="flaw-hint">{{ t('sandbox.flawHint') }}</p>
              <div class="flaw-options">
                <label v-for="flaw in debateData.flaws" :key="flaw.id" class="flaw-option" :class="{ selected: selectedFlaws.includes(flaw.id) }">
                  <input type="checkbox" :value="flaw.id" v-model="selectedFlaws" />
                  <span class="flaw-text">{{ flaw[locale] || flaw.en }}</span>
                </label>
              </div>
              <button class="btn btn-primary" :disabled="selectedFlaws.length === 0" @click="debateAnswered = true">{{ t('sandbox.submitFlaws') }}</button>
            </div>
            <div v-if="debateAnswered" class="challenge-result" :class="selectedFlaws.length >= 2 ? 'correct' : 'wrong'">
              <div class="cr-icon">{{ selectedFlaws.length >= 2 ? '🏆' : '💪' }}</div>
              <h3>{{ selectedFlaws.length >= 2 ? t('sandbox.greatDebug') : t('sandbox.keepLooking') }}</h3>
              <div class="flaw-results">
                <div v-for="flaw in debateData.flaws" :key="flaw.id" class="flaw-result" :class="{ found: selectedFlaws.includes(flaw.id) }">
                  <span class="fr-icon">{{ selectedFlaws.includes(flaw.id) ? '✅' : '❌' }}</span>
                  <span>{{ flaw[locale] || flaw.en }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button class="btn btn-ghost" @click="activeStep = 'concept'">← {{ t('lesson.back') }}</button>
            <button class="btn btn-primary" @click="activeStep = 'mindmap'">{{ t('lesson.seeMap') }} →</button>
          </div>
        </section>

        <!-- Step 3: Mind Map -->
        <section class="lesson-section animate-slide-up" v-if="activeStep === 'mindmap'">
          <div class="step-label">{{ t('lesson.mapIt') }}</div>
          <div class="mindmap-card">
            <MindMap
              :concepts="path.mindMap.nodes"
              :question="getLessonTitle(lesson)"
              :topic-icon="lesson.icon"
            />
          </div>
          <div class="step-actions">
            <button class="btn btn-ghost" @click="activeStep = 'example'">← {{ t('lesson.back') }}</button>
            <button class="btn btn-primary" @click="activeStep = 'quiz'">{{ t('lesson.quizMe') }} →</button>
          </div>
        </section>

        <!-- Step 4: Quiz -->
        <section class="lesson-section animate-slide-up" v-if="activeStep === 'quiz'">
          <div class="step-label">{{ t('lesson.testYourself') }}</div>

          <div v-if="!quizComplete" class="quiz-card">
            <div class="quiz-progress-row">
              <span>{{ t('lesson.question') }} {{ quizIdx + 1 }} / {{ lesson.quiz.length }}</span>
              <span class="quiz-score">{{ t('lesson.score') }}: {{ quizScore }}</span>
            </div>

            <h3 class="quiz-question">{{ getQuizQuestion(lesson.quiz[quizIdx]) }}</h3>

            <div class="quiz-options">
              <button v-for="(opt, i) in lesson.quiz[quizIdx].options" :key="i"
                class="quiz-opt"
                :class="{ selected: selectedOpt === i, correct: showAnswer && i === lesson.quiz[quizIdx].correct, wrong: showAnswer && selectedOpt === i && i !== lesson.quiz[quizIdx].correct }"
                :disabled="showAnswer"
                @click="selectedOpt = i">
                <span class="opt-letter">{{ ['A','B','C','D'][i] }}</span>
                <span>{{ typeof opt === 'object' ? (opt[locale] || opt.en) : opt }}</span>
              </button>
            </div>

            <div v-if="showAnswer" class="quiz-explanation">
              <span>{{ selectedOpt === lesson.quiz[quizIdx].correct ? '🎉' : '💡' }}</span>
              <span>{{ typeof lesson.quiz[quizIdx].explanation === 'object' ? (lesson.quiz[quizIdx].explanation[locale] || lesson.quiz[quizIdx].explanation.en) : lesson.quiz[quizIdx].explanation }}</span>
            </div>

            <div class="quiz-actions">
              <button v-if="!showAnswer && selectedOpt !== null" class="btn btn-primary" @click="checkQuiz">
                {{ t('lesson.check') }}
              </button>
              <button v-if="showAnswer" class="btn btn-primary" @click="nextQuizQuestion">
                {{ quizIdx < lesson.quiz.length - 1 ? t('lesson.nextQuestion') : t('lesson.seeResults') }}
              </button>
            </div>
          </div>

          <!-- Quiz Results -->
          <div v-else class="quiz-results">
            <div class="qr-icon">{{ quizScorePercent >= 80 ? '🏆' : quizScorePercent >= 50 ? '⭐' : '💪' }}</div>
            <h2>{{ quizScorePercent >= 80 ? t('lesson.amazing') : quizScorePercent >= 50 ? t('lesson.goodJob') : t('lesson.keepTrying') }}</h2>
            <div class="qr-score">{{ quizScore }}/{{ lesson.quiz.length }}</div>
            <div class="step-actions" style="justify-content: center">
              <button class="btn btn-primary" @click="finishLesson">{{ t('lesson.continue') }} →</button>
            </div>
          </div>
        </section>

        <!-- Step 5: Practice & Complete -->
        <section class="lesson-section animate-slide-up" v-if="activeStep === 'complete'">
          <div class="step-label">{{ t('lesson.practice') }}</div>
          <div class="practice-card">
            <h3>✏️ {{ t('lesson.yourTurn') }}</h3>
            <p>{{ typeof lesson.practice === 'object' ? (lesson.practice[locale] || lesson.practice.en) : lesson.practice }}</p>
          </div>

          <div class="completion-banner">
            <span class="comp-icon">🎉</span>
            <h3>{{ t('lesson.lessonComplete') }}</h3>
            <p>{{ t('lesson.score') }}: {{ quizScore }}/{{ lesson.quiz.length }}</p>
          </div>

          <div class="step-actions" style="justify-content: center">
            <router-link v-if="lessonIndex < path.lessons.length - 1" :to="`/focus/${pathId}/lesson/${lessonIndex + 1}`"
              class="btn btn-primary">
              {{ t('lesson.nextLesson') }}: {{ getLessonTitle(path.lessons[lessonIndex + 1]) }} →
            </router-link>
            <router-link v-else :to="`/focus/${pathId}`" class="btn btn-primary">
              🏆 {{ t('lesson.pathComplete') }}
            </router-link>
            <router-link :to="`/focus/${pathId}`" class="btn btn-ghost">
              {{ t('lesson.backToPath') }}
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPathById, completeLesson, getPathProgress } from '../services/pathService'
import MindMap from '../components/MindMap.vue'
import { WHAT_IF_DATASETS, MISLEADING_CHALLENGES, AI_DEBATE_CHALLENGES, computeLineOfBestFit, filterPoints } from '../data/sandboxData'

const route = useRoute()
const t = inject('t')
const locale = inject('locale')
const selectedKidId = inject('selectedKidId')

const pathId = computed(() => route.params.pathId)
const lessonIndex = computed(() => parseInt(route.params.lessonIndex) || 0)
const path = computed(() => getPathById(pathId.value))
const lesson = computed(() => path.value?.lessons?.[lessonIndex.value])

const activeStep = ref('concept')
const quizIdx = ref(0)
const quizScore = ref(0)
const selectedOpt = ref(null)
const showAnswer = ref(false)
const quizComplete = ref(false)

// ── Interactive Sandbox State ──
const activeMode = ref(null)
const outlierSliderVal = ref(0)
const excludedIndices = ref(new Set())
const whatIfAnalysis = ref(false)
const selectedFlag = ref(null)
const misleadingAnswered = ref(false)
const selectedFlaws = ref([])
const debateAnswered = ref(false)

const INTERACTIVE_TYPES = ['whatif', 'misleading', 'debate']

const isInteractiveLesson = computed(() =>
  lesson.value?.example?.type && INTERACTIVE_TYPES.includes(lesson.value.example.type)
)

const activeExampleType = computed(() => lesson.value?.example?.type || null)

const activeDataset = computed(() => {
  if (!isInteractiveLesson.value) return null
  const id = lesson.value?.example?.[locale.value]?.datasetId || lesson.value?.example?.en?.datasetId
  if (!id) return null
  return WHAT_IF_DATASETS.find(d => d.id === id) || MISLEADING_CHALLENGES.find(d => d.id === id) || AI_DEBATE_CHALLENGES.find(d => d.id === id) || null
})

const progressPercent = computed(() => {
  if (!path.value) return 0
  return Math.round(((lessonIndex.value + 1) / path.value.lessons.length) * 100)
})

const quizScorePercent = computed(() => {
  if (!lesson.value) return 0
  return Math.round((quizScore.value / lesson.value.quiz.length) * 100)
})

const exampleData = computed(() => {
  if (!lesson.value?.example) return {}
  const loc = locale.value
  return lesson.value.example[loc] || lesson.value.example.en || {}
})

const maxExampleBar = computed(() => {
  if (!exampleData.value.bars) return 1
  return Math.max(...exampleData.value.bars.map(b => b.value), 1)
})

const pieSlices = computed(() => {
  if (!exampleData.value.slices) return []
  const total = exampleData.value.slices.reduce((s, sl) => s + sl.value, 0)
  const circumference = 2 * Math.PI * 90
  let offset = 0
  return exampleData.value.slices.map(sl => {
    const pct = sl.value / total
    const arc = pct * circumference
    const slice = { ...sl, arc, offset }
    offset -= arc
    return slice
  })
})

const lineDataPoints = computed(() => {
  if (!exampleData.value.data) return []
  const data = exampleData.value.data
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1
  const startX = 60
  const endX = 370
  const gap = data.length > 1 ? (endX - startX) / (data.length - 1) : 0
  const topY = 30
  const bottomY = 160
  return data.map((d, i) => ({
    x: startX + i * gap,
    y: bottomY - ((d.value - min) / range) * (bottomY - topY),
    val: d.value,
    label: d.label,
  }))
})

const linePoints = computed(() => {
  return lineDataPoints.value.map(pt => `${pt.x},${pt.y}`).join(' ')
})

// ── Sandbox Chart Helpers ──
const _svgW = 500, _svgH = 300, _padL = 50, _padR = 20, _padT = 20, _padB = 40
const _gridStepX = (_svgW - _padL - _padR) / 5
const _gridStepY = (_svgH - _padT - _padB) / 5

const whatIfData = computed(() => {
  if (!isInteractiveLesson.value || activeExampleType.value !== 'whatif') return WHAT_IF_DATASETS[0]
  return activeDataset.value?.points ? activeDataset.value : WHAT_IF_DATASETS[0]
})
const whatIfFiltered = computed(() => {
  if (!isInteractiveLesson.value) return whatIfData.value.points
  return filterPoints(whatIfData.value.points, [...excludedIndices.value])
})
const whatIfOriginalBF = computed(() => computeLineOfBestFit(whatIfData.value.points))
const whatIfCurrentBF = computed(() => computeLineOfBestFit(whatIfFiltered.value))
const whatIfOriginalR2 = computed(() => whatIfOriginalBF.value.r2)
const whatIfCurrentR2 = computed(() => whatIfCurrentBF.value.r2)
const whatIfExcludedCount = computed(() => excludedIndices.value.size)

const whatIfSvgPoints = computed(() => {
  if (!isInteractiveLesson.value) return []
  const pts = whatIfData.value.points
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const rX = maxX - minX || 1, rY = maxY - minY || 1
  const pW = _svgW - _padL - _padR, pH = _svgH - _padT - _padB
  return pts.map((p, i) => ({
    sx: _padL + ((p.x - minX) / rX) * pW,
    sy: _svgH - _padB - ((p.y - minY) / rY) * pH,
    excluded: excludedIndices.value.has(i),
  }))
})

const whatIfBestFitLine = computed(() => {
  if (!isInteractiveLesson.value) return null
  if (whatIfFiltered.value.length < 2) return null
  const bf = whatIfCurrentBF.value
  const pts = whatIfData.value.points
  const minX = Math.min(...pts.map(p => p.x))
  const maxX = Math.max(...pts.map(p => p.x))
  const minY = Math.min(...whatIfFiltered.value.map(p => p.y))
  const maxY = Math.max(...whatIfFiltered.value.map(p => p.y))
  const rX = maxX - minX || 1, rY = maxY - minY || 1
  const pW = _svgW - _padL - _padR, pH = _svgH - _padT - _padB
  const y1 = bf.slope * minX + bf.intercept
  const y2 = bf.slope * maxX + bf.intercept
  return {
    x1: _padL, y1: _svgH - _padB - ((y1 - minY) / rY) * pH,
    x2: _padL + pW, y2: _svgH - _padB - ((y2 - minY) / rY) * pH,
  }
})

const misleadingData = computed(() => {
  if (!isInteractiveLesson.value) return MISLEADING_CHALLENGES[0]
  return activeDataset.value?.chartData ? activeDataset.value : MISLEADING_CHALLENGES[0]
})

const misleadingYTicks = computed(() => {
  if (!isInteractiveLesson.value) return []
  const d = misleadingData.value.chartData
  const ticks = [], steps = 5, range = d.yMax - d.yMin
  const pH = _svgH - _padT - _padB
  for (let i = 0; i <= steps; i++) {
    const val = d.yMin + (range * i) / steps
    ticks.push({ y: _svgH - _padB - (i / steps) * pH, label: formatCurrency(val) })
  }
  return ticks
})

const misleadingBarGroupW = computed(() => {
  if (!isInteractiveLesson.value) return 100
  return (_svgW - _padL - _padR) / (misleadingData.value.chartData.values.length || 1)
})
const misleadingBarW = computed(() => misleadingBarGroupW.value * 0.6)

const misleadingBars = computed(() => {
  if (!isInteractiveLesson.value) return []
  const d = misleadingData.value.chartData, pH = _svgH - _padT - _padB, range = d.yMax - d.yMin
  return d.values.map((val, i) => {
    const x = _padL + i * misleadingBarGroupW.value + (misleadingBarGroupW.value - misleadingBarW.value) / 2
    const h = ((val - d.yMin) / range) * pH
    return { x, y: _svgH - _padB - h, h }
  })
})

const debateData = computed(() => {
  if (!isInteractiveLesson.value) return AI_DEBATE_CHALLENGES[0]
  return activeDataset.value?.dataset ? activeDataset.value : AI_DEBATE_CHALLENGES[0]
})

const debateSvgPoints = computed(() => {
  if (!isInteractiveLesson.value) return []
  const ds = debateData.value.dataset
  if (!ds.points) return []
  const xs = ds.points.map(p => p.x), ys = ds.points.map(p => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const rX = maxX - minX || 1, rY = maxY - minY || 1
  const pW = _svgW - _padL - _padR, pH = _svgH - _padT - _padB
  return ds.points.map(p => ({
    sx: _padL + ((p.x - minX) / rX) * pW,
    sy: _svgH - _padB - ((p.y - minY) / rY) * pH,
  }))
})

function toggleWhatIfExclude(idx) {
  const s = new Set(excludedIndices.value)
  if (s.has(idx)) s.delete(idx)
  else s.add(idx)
  excludedIndices.value = s
}

function formatCurrency(val) {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k'
  return '$' + val
}

function getPathTitle(p) { return p.title[locale.value] || p.title.en }
function getLessonTitle(l) { return l.title[locale.value] || l.title.en }

function isLessonCompleted(idx) {
  if (!selectedKidId?.value || !path.value) return false
  const prog = getPathProgress(selectedKidId.value, pathId.value)
  return prog.completedLessons.includes(idx)
}

function goToLesson(idx) {
  if (idx <= lessonIndex.value || isLessonCompleted(idx)) {
    router.push(`/focus/${pathId.value}/lesson/${idx}`)
  }
}

function getQuizQuestion(q) {
  return typeof q.question === 'object' ? (q.question[locale.value] || q.question.en) : q.question
}

function checkQuiz() {
  if (selectedOpt.value === null) return
  showAnswer.value = true
  if (selectedOpt.value === lesson.value.quiz[quizIdx.value].correct) {
    quizScore.value++
  }
}

function nextQuizQuestion() {
  if (quizIdx.value < lesson.value.quiz.length - 1) {
    quizIdx.value++
    selectedOpt.value = null
    showAnswer.value = false
  } else {
    quizComplete.value = true
  }
}

function finishLesson() {
  if (selectedKidId?.value && path.value) {
    completeLesson(selectedKidId.value, pathId.value, lessonIndex.value, quizScorePercent.value)
  }
  activeStep.value = 'complete'
}

function getTallyMarks(n) {
  const full = Math.floor(n / 5)
  const remainder = n % 5
  let marks = ''
  for (let i = 0; i < full; i++) marks += '|||| '
  for (let i = 0; i < remainder; i++) marks += '|'
  return marks.trim()
}

function renderText(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

watch(() => route.params.lessonIndex, () => {
  activeStep.value = 'concept'
  quizIdx.value = 0
  quizScore.value = 0
  selectedOpt.value = null
  showAnswer.value = false
  quizComplete.value = false
  activeMode.value = null
})

watch(activeStep, (step) => {
  if (step === 'example' && isInteractiveLesson.value) {
    activeMode.value = activeExampleType.value
    if (activeMode.value === 'whatif') {
      excludedIndices.value = new Set()
      outlierSliderVal.value = 0
      whatIfAnalysis.value = false
    } else if (activeMode.value === 'misleading') {
      selectedFlag.value = null
      misleadingAnswered.value = false
    } else if (activeMode.value === 'debate') {
      selectedFlaws.value = []
      debateAnswered.value = false
    }
  }
})

onMounted(() => {
  // Reset state on mount
})
</script>

<style scoped lang="scss">
.lesson-page { padding: 20px 0 60px; }

.lesson-header { margin-bottom: 20px; }
.back-link { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light); display: inline-flex; align-items: center; margin-bottom: 12px; transition: color 0.2s; &:hover { color: var(--primary); } }

.lesson-badge {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: var(--radius-lg);
}
.badge-icon { font-size: 2.2rem; }
.badge-text h1 { font-size: 1.3rem; }
.lesson-meta { font-size: 0.82rem; color: var(--text-light); }

.lesson-progress { margin-bottom: 24px; }
.lp-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 10px; }
.lp-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width 0.5s ease; }
.lp-dots { display: flex; gap: 8px; justify-content: center; }
.lp-dot {
  width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--border); cursor: pointer; transition: all 0.3s;
  &.completed { background: var(--success); border-color: var(--success); }
  &.current { background: var(--primary); border-color: var(--primary); transform: scale(1.2); }
  &.upcoming { opacity: 0.5; }
}

.lesson-section { max-width: 700px; margin: 0 auto; }

.step-label {
  display: inline-block; padding: 4px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 700;
  background: rgba(108, 92, 231, 0.1); color: var(--primary); margin-bottom: 16px; text-transform: uppercase;
  letter-spacing: 0.5px;
}

.concept-card, .example-card, .mindmap-card, .quiz-card, .practice-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 28px;
  box-shadow: var(--shadow); margin-bottom: 20px;
}

.concept-text { line-height: 1.8; font-size: 1rem;
  :deep(strong) { color: var(--primary); }
  :deep(code) { background: var(--code-bg); padding: 2px 6px; border-radius: 4px; font-size: 0.9rem; }
}

.example-card h3 { font-size: 1.1rem; margin-bottom: 16px; }

/* Bar Example */
.bar-example { display: flex; flex-direction: column; gap: 10px; }
.ex-bar-row { display: flex; align-items: center; gap: 10px; }
.ex-bar-label { width: 100px; font-weight: 600; font-size: 0.85rem; text-align: right; flex-shrink: 0; }
.ex-bar-track { flex: 1; height: 24px; background: var(--border); border-radius: 6px; overflow: hidden; }
.ex-bar-fill { height: 100%; border-radius: 6px; transition: width 0.8s ease; }
.ex-bar-val { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; width: 30px; }
.ex-bar-row.mini { .ex-bar-label { width: 80px; font-size: 0.8rem; } .ex-bar-track { height: 16px; } }

/* Comparison */
.comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.comp-side { padding: 16px; background: var(--chip-bg); border-radius: 12px; }
.comp-side h4 { font-size: 0.9rem; margin-bottom: 8px; color: var(--primary); }
.comp-data { font-size: 0.85rem; color: var(--text-light); white-space: pre-line; }
.comp-right { background: rgba(108, 92, 231, 0.05); }

/* Pie */
.pie-example { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center; }
.pie-svg { width: 180px; height: 180px; }
.pie-slice { transition: stroke-dasharray 0.8s ease; }
.pie-legend { display: flex; flex-direction: column; gap: 8px; }
.legend-row { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
.legend-color { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }
.legend-pct { font-family: var(--font-display); font-weight: 700; margin-left: auto; }

/* Line */
.line-example { overflow-x: auto; }
.line-svg { width: 100%; min-width: 350px; }
.line-dot { animation: pulse-dot 2s ease infinite; }
@keyframes pulse-dot { 0%, 100% { r: 5; } 50% { r: 7; } }

/* Pictograph */
.picto-key { font-size: 0.85rem; color: var(--text-light); margin-bottom: 12px; font-weight: 600; }
.picto-grid { display: flex; flex-direction: column; gap: 10px; }
.picto-row { display: flex; align-items: center; gap: 10px; }
.picto-label { width: 80px; font-weight: 600; font-size: 0.85rem; text-align: right; }
.picto-emojis { display: flex; gap: 4px; flex-wrap: wrap; }
.picto-emoji { font-size: 1.3rem; }
.picto-val { font-family: var(--font-display); font-weight: 700; margin-left: auto; }

/* Decision */
.decision-list { display: flex; flex-direction: column; gap: 10px; }
.decision-row { display: flex; align-items: center; gap: 8px; padding: 10px; background: var(--chip-bg); border-radius: 10px; flex-wrap: wrap; }
.dec-q { flex: 1; font-size: 0.9rem; min-width: 150px; }
.dec-arrow { color: var(--primary); font-weight: 700; }
.dec-answer { font-weight: 700; font-size: 0.9rem; color: var(--success); }
.dec-reason { font-size: 0.78rem; color: var(--text-muted); }

/* Fraction Visual */
.fraction-visual { text-align: center; }
.fraction-bar { display: flex; gap: 4px; justify-content: center; margin-bottom: 12px; }
.fraction-piece { width: 50px; height: 50px; border-radius: 8px; border: 2px solid var(--border); transition: all 0.3s;
  &.filled { background: var(--primary); border-color: var(--primary); }
}
.fraction-label { font-size: 1.1rem; font-weight: 700; color: var(--primary); }

/* Tally */
.tally-steps { display: flex; flex-direction: column; gap: 16px; }
.tally-step { padding: 12px; background: var(--chip-bg); border-radius: 10px; }
.ts-label { font-weight: 700; color: var(--primary); margin-right: 8px; }
.ts-text { font-style: italic; color: var(--text-light); }
.ts-tally, .ts-bars { margin-top: 8px; }
.tally-row { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
.tally-name { width: 80px; font-weight: 600; }
.tally-marks { font-family: monospace; font-size: 1.1rem; letter-spacing: 2px; color: var(--primary); }
.tally-count { font-weight: 700; margin-left: auto; }

/* Grid Visual */
.grid-visual { text-align: center; }
.mini-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; max-width: 300px; margin: 0 auto 12px; }
.grid-cell { aspect-ratio: 1; border-radius: 4px; border: 1px solid var(--border); transition: all 0.3s;
  &.filled { background: var(--primary); border-color: var(--primary); }
}
.grid-label { font-size: 0.9rem; color: var(--text-light); font-weight: 600; }

/* Analysis */
.analysis-data { color: var(--text-light); margin-bottom: 16px; }
.analysis-bars { margin-bottom: 16px; }
.insights-box { padding: 14px; background: rgba(0, 184, 148, 0.06); border-radius: 10px; border-left: 4px solid var(--success); }
.insights-box h4 { margin-bottom: 8px; font-size: 0.9rem; }
.insights-box ul { padding-left: 16px; }
.insights-box li { font-size: 0.85rem; color: var(--text-light); margin-bottom: 6px; line-height: 1.4; }

/* Quiz */
.quiz-progress-row { display: flex; justify-content: space-between; font-weight: 600; font-size: 0.85rem; color: var(--text-light); margin-bottom: 16px; }
.quiz-score { color: var(--primary); }
.quiz-question { font-size: 1.1rem; margin-bottom: 20px; }
.quiz-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.quiz-opt {
  display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(108, 92, 231, 0.04);
  border: 2px solid rgba(108, 92, 231, 0.1); border-radius: 12px; font-size: 0.95rem; text-align: left;
  transition: all 0.2s; cursor: pointer;
  &:hover:not(:disabled) { border-color: var(--primary); background: rgba(108, 92, 231, 0.08); }
  &.selected { border-color: var(--primary); background: rgba(108, 92, 231, 0.1); }
  &.correct { border-color: var(--success); background: rgba(0, 184, 148, 0.1); }
  &.wrong { border-color: var(--danger); background: rgba(255, 118, 117, 0.1); }
  &:disabled { cursor: default; }
}
.opt-letter {
  width: 28px; height: 28px; border-radius: 8px; background: rgba(108, 92, 231, 0.1);
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;
  color: var(--primary); flex-shrink: 0;
}
.quiz-explanation {
  display: flex; gap: 8px; padding: 12px; background: rgba(253, 203, 110, 0.1); border-radius: 10px;
  margin-bottom: 16px; font-size: 0.85rem; color: var(--text-light);
}
.quiz-actions { display: flex; justify-content: center; }

.quiz-results { text-align: center; }
.qr-icon { font-size: 4rem; margin-bottom: 12px; }
.qr-score { font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 20px; }

/* Practice */
.practice-card {
  h3 { margin-bottom: 10px; }
  p { color: var(--text-light); line-height: 1.6; font-size: 1rem; }
}

.completion-banner {
  text-align: center; padding: 24px; background: linear-gradient(135deg, rgba(0, 184, 148, 0.08), rgba(108, 92, 231, 0.06));
  border-radius: var(--radius-lg); margin-bottom: 20px;
}
.comp-icon { font-size: 3rem; display: block; margin-bottom: 8px; }

.step-actions { display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap; }

.btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; cursor: pointer; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); &:hover { transform: translateY(-2px); } }
.btn-ghost { background: transparent; color: var(--text-light); &:hover { background: var(--chip-bg); } }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
.btn-sm { padding: 8px 16px; font-size: 0.82rem; }
.btn-block { width: 100%; justify-content: center; }

@media (max-width: 640px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .ex-bar-label { width: 70px; font-size: 0.8rem; }
  .sandbox-svg { min-width: 300px; }
}

/* ── Interactive Sandbox Embedded ── */
.interactive-example {
  border: 2px solid rgba(108, 92, 231, 0.15);
}
.example-subtitle {
  font-size: 0.9rem; color: var(--text-light); margin-bottom: 16px; line-height: 1.5;
}
.chart-container {
  background: var(--chip-bg); border-radius: var(--radius); padding: 16px;
  margin-bottom: 16px; overflow-x: auto;
}
.sandbox-svg { width: 100%; min-width: 350px; }
.bar-rect { transition: all 0.5s ease; }
.whatif-controls {
  padding: 14px; background: var(--chip-bg); border-radius: var(--radius); margin-bottom: 14px;
}
.slider-label { font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 8px; }
.slider-track { margin-bottom: 8px; }
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
.slider-info { font-size: 0.82rem; color: var(--text-light); margin-bottom: 8px; }
.ai-analysis-card {
  padding: 14px; background: rgba(108, 92, 231, 0.06); border-radius: var(--radius);
  border-left: 4px solid var(--primary); margin-bottom: 14px;
  h4 { margin-bottom: 8px; }
  p { font-size: 0.88rem; color: var(--text-light); line-height: 1.5; }
}
.analysis-comparison { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.ac-side { text-align: center; flex: 1; }
.ac-label { display: block; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px; }
.ac-val { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; color: var(--primary); }
.ac-after .ac-val { color: var(--success); }
.ac-arrow { font-size: 1.2rem; color: var(--text-muted); }
.flag-options { margin-bottom: 14px; h4 { margin-bottom: 10px; font-size: 0.92rem; } }
.flag-btn {
  display: block; width: 100%; text-align: left; padding: 11px 14px;
  background: rgba(255, 118, 117, 0.04); border: 2px solid rgba(255, 118, 117, 0.1);
  border-radius: 10px; font-size: 0.88rem; margin-bottom: 7px; transition: all 0.2s; cursor: pointer;
  &:hover { border-color: var(--danger); background: rgba(255, 118, 117, 0.08); }
  &.selected { border-color: var(--danger); background: rgba(255, 118, 117, 0.12); }
}
.challenge-result {
  padding: 18px; border-radius: var(--radius-lg); text-align: center; margin-top: 14px;
  &.correct { background: rgba(0, 184, 148, 0.08); border: 2px solid rgba(0, 184, 148, 0.2); }
  &.wrong { background: rgba(255, 118, 117, 0.06); border: 2px solid rgba(255, 118, 117, 0.15); }
}
.cr-icon { font-size: 2.5rem; margin-bottom: 6px; }
.ai-claim-card {
  display: flex; gap: 12px; padding: 16px; background: rgba(0, 206, 201, 0.06);
  border-radius: var(--radius); border: 2px solid rgba(0, 206, 201, 0.15); margin-bottom: 18px;
}
.ai-avatar { font-size: 1.8rem; flex-shrink: 0; }
.ai-claim-text { flex: 1; }
.ai-claim-text h4 { font-size: 0.82rem; color: var(--secondary); margin-bottom: 6px; }
.ai-quote { font-size: 0.92rem; font-style: italic; color: var(--text-light); line-height: 1.5; }
.flaw-selection { margin-bottom: 14px; h4 { margin-bottom: 6px; } }
.flaw-hint { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
.flaw-options { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
.flaw-option {
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px;
  background: rgba(253, 203, 110, 0.04); border: 2px solid rgba(253, 203, 110, 0.12);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  input[type="checkbox"] { margin-top: 3px; accent-color: var(--primary); }
  &:hover { border-color: var(--warning); }
  &.selected { border-color: var(--warning); background: rgba(253, 203, 110, 0.1); }
}
.flaw-text { font-size: 0.85rem; line-height: 1.4; }
.flaw-results { display: flex; flex-direction: column; gap: 7px; margin-top: 12px; text-align: left; }
.flaw-result {
  display: flex; align-items: flex-start; gap: 8px; padding: 7px 10px;
  border-radius: 8px; font-size: 0.82rem; line-height: 1.4;
  &.found { background: rgba(0, 184, 148, 0.08); }
  &:not(.found) { background: rgba(255, 118, 117, 0.06); color: var(--text-light); }
}
.fr-icon { flex-shrink: 0; }
</style>
