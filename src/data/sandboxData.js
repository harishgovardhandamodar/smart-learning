// ── Data Sandbox: Gamified Progression & Challenge Data ──
// Section 3: Tiered progression structure (Ages 10-18)
// Section 4: Interactive mechanics (What-If, Misleading, AI Debate)

import { storage } from '../utils/storage'

const STORAGE_KEY_SANDBOX = 'foxy_sandbox_progress'

// ── Section 3: Tiered Progression Structure ──

export const SANDBOX_TIERS = [
  {
    level: 1,
    title: { en: 'The Detective', nl: 'De Detective' },
    icon: '🔍',
    chartTypes: { en: ['Bar Charts', 'Pie Charts'], nl: ['Balkdiagrammen', 'Cirkeldiagrammen'] },
    coreSkill: { en: 'Identifying categorical majorities and outliers', nl: 'Categorische meerderheden en uitschieters identificeren' },
    theme: { en: 'Analyze spending habits of a fictional supervillain', nl: 'Analyseer de uitgaven van een fictieve schurk' },
    color: '#6C5CE7',
    challenges: ['truncated-y-axis', 'missing-baseline', 'graph-without-zero', 'unequal-bar-widths', 'truncated-pie', 'color-emphasis-trick', 'missing-total-labels', 'fabricated-scale', 'wrong-chart-for-data', 'selective-category'],
    pointsRequired: 0,
  },
  {
    level: 2,
    title: { en: 'The Tracker', nl: 'De Tracker' },
    icon: '📈',
    chartTypes: { en: ['Line Graphs', 'Area Charts'], nl: ['Lijndiagrammen', 'Vlakdiagrammen'] },
    coreSkill: { en: 'Identifying chronological trends and anomalies over time', nl: 'Chronologische trends en anomalieën in de tijd identificeren' },
    theme: { en: 'Track global climate metrics or spaceship fuel burning rates', nl: 'Volg wereldwijde klimaatgegevens of brandstofverbruik van een ruimteschip' },
    color: '#00B894',
    challenges: ['cherry-picked-dates', 'truncated-x-axis', 'gaming-scores', 'compressed-timeline', 'moving-average-trick', 'seasonal-misdirection', 'endpoint-cherry-pick', 'cumulative-trick', 'trendline-extrapolation', 'missing-data-gaps'],
    pointsRequired: 200,
  },
  {
    level: 3,
    title: { en: 'The Predictor', nl: 'De Voorspeller' },
    icon: '🔮',
    chartTypes: { en: ['Scatter Plots', 'Histograms'], nl: ['Spreidingsdiagrammen', 'Histogrammen'] },
    coreSkill: { en: 'Spotting correlations, clusters, and data distributions', nl: 'Correlaties, clusters en gegevensverdelingen herkennen' },
    theme: { en: 'Correlate athlete training hours to match wins', nl: 'Correleer trainingstijden van atleten met wedstrijdoverwinningen' },
    color: '#E17055',
    challenges: ['dual-axis-manipulation', '3d-pie-distortion', 'percentage-vs-absolute', 'debate-scatter', 'sleep-performance', 'outlier-influence', 'false-equivalence', 'correlation-causation', 'bin-size-trick', 'spurious-correlation'],
    pointsRequired: 500,
  },
  {
    level: 4,
    title: { en: 'The Strategist', nl: 'De Strateeg' },
    icon: '♟️',
    chartTypes: { en: ['Box Plots', 'Heatmaps'], nl: ['Boxplots', 'Heatmaps'] },
    coreSkill: { en: 'Understanding variance, percentiles, and multidimensional density', nl: 'Variantie, percentielen en multidimensionale dichtheid begrijpen' },
    theme: { en: 'Optimize a simulated logistics or streaming network', nl: 'Optimaliseer een gesimuleerd logistiek of streaming netwerk' },
    color: '#FD79A8',
    challenges: ['misleading-area-chart', 'debate-pie', 'debate-line', 'exercise-mood', 'selection-bias', 'survivorship-bias', 'map-area-distortion', 'log-scale-surprise', 'confounding-variable', 'base-rate-neglect'],
    pointsRequired: 1000,
  },
]

// ── Section 4: What-If Slider Datasets ──

export const WHAT_IF_DATASETS = [
  {
    id: 'gaming-scores',
    title: { en: 'Video Game Hours vs. Exam Scores', nl: 'Game-uren vs. Toetsresultaten' },
    subtitle: { en: 'Does too much gaming hurt grades?', nl: 'Beschadigt te veel gamen je cijfers?' },
    xLabel: { en: 'Gaming Hours/Day', nl: 'Game-uren/Dag' },
    yLabel: { en: 'Exam Score (%)', nl: 'Toets Score (%)' },
    points: [
      { x: 0, y: 92 }, { x: 0.5, y: 94 }, { x: 1, y: 91 },
      { x: 1.5, y: 89 }, { x: 2, y: 87 }, { x: 2.5, y: 82 },
      { x: 3, y: 75 }, { x: 3.5, y: 70 }, { x: 4, y: 65 },
      { x: 4.5, y: 58 }, { x: 5, y: 55 }, { x: 5.5, y: 52 },
      { x: 6, y: 48 },
    ],
    outlierIndices: [11, 12],
    insightEN: 'Up to 2 hours of gaming, scores stay high (85-95%). Beyond 2 hours, scores drop linearly to ~50% at 6 hours.',
    insightNL: 'Tot 2 uur gamen blijven scores hoog (85-95%). Na 2 uur dalen scores lineair naar ~50% bij 6 uur.',
  },
  {
    id: 'sleep-performance',
    title: { en: 'Sleep Hours vs. Test Performance', nl: 'Slaap-uren vs. Prestatie' },
    subtitle: { en: 'How does sleep affect learning?', nl: 'Hoe beïnvloedt slapen je leerprestaties?' },
    xLabel: { en: 'Hours of Sleep', nl: 'Uren Slaap' },
    yLabel: { en: 'Test Score (%)', nl: 'Test Score (%)' },
    points: [
      { x: 4, y: 45 }, { x: 5, y: 55 }, { x: 6, y: 68 },
      { x: 7, y: 78 }, { x: 8, y: 88 }, { x: 9, y: 92 },
      { x: 10, y: 90 }, { x: 11, y: 85 }, { x: 12, y: 75 },
    ],
    outlierIndices: [8],
    insightEN: 'Performance peaks at 8-9 hours of sleep. Too little sleep hurts, but too much can also reduce alertness.',
    insightNL: 'Prestatie piekt bij 8-9 uur slaap. Te weinig slaap schaadt, maar te veel kan ook de alertheid verminderen.',
  },
  {
    id: 'exercise-mood',
    title: { en: 'Exercise Minutes vs. Mood Score', nl: 'Beweging vs. Stemming' },
    subtitle: { en: 'Does exercise really make you happier?', nl: 'Maakt beweging je echt gelukkiger?' },
    xLabel: { en: 'Exercise Minutes/Day', nl: 'Bewegingsminuten/Dag' },
    yLabel: { en: 'Mood Score (1-10)', nl: 'Stemming Score (1-10)' },
    points: [
      { x: 0, y: 4 }, { x: 10, y: 5 }, { x: 20, y: 6 },
      { x: 30, y: 7.5 }, { x: 45, y: 8.5 }, { x: 60, y: 9 },
      { x: 75, y: 8.5 }, { x: 90, y: 7 }, { x: 120, y: 5.5 },
    ],
    outlierIndices: [],
    insightEN: 'Mood improves with exercise up to about 60 minutes, then can decline with overexertion.',
    insightNL: 'Stemming verbetert met bewegen tot ongeveer 60 minuten, daarna kan overbelasting een daling veroorzaken.',
  },
]

// ── Misleading Graph Challenges ──

export const MISLEADING_CHALLENGES = [
  {
    id: 'truncated-y-axis',
    title: { en: 'The Truncated Y-Axis', nl: 'De Afgeknipte Y-as' },
    scenario: {
      en: 'A news headline reads: "Coffee Shop Sales PLUMMET!" The graph shows sales dropping from $48,000 to $46,500.',
      nl: 'Een krantenkop luidt: "Koffiewinkel Verkopen STORTEN IN!" De grafiek toont een daling van $48.000 naar $46.500.',
    },
    trick: {
      en: 'The Y-axis starts at $45,000 instead of $0, making a small 3% drop look like a massive crash.',
      nl: 'De Y-as begint bij $45.000 in plaats van $0, waardoor een kleine daling van 3% eruitziet als een enorme crash.',
    },
    correctFlag: 'y-axis-truncated',
    options: [
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'wrong-labels', label: { en: 'The labels are misspelled', nl: 'De labels zijn verkeerd gespeld' } },
      { id: 'missing-legend', label: { en: 'There is no legend', nl: 'Er is geen legenda' } },
    ],
    points: 150,
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      values: [48000, 47500, 47800, 47000, 46500],
      yMin: 45000,
      yMax: 50000,
      color: '#FF7675',
    },
  },
  {
    id: 'cherry-picked-dates',
    title: { en: 'The Cherry-Picked Timeline', nl: 'De Uitgekozen Tijdlijn' },
    scenario: {
      en: 'A company claims: "Our stock is CRASHING!" showing a steep downward line over the last 3 days.',
      nl: 'Een bedrijf beweert: "Onze aandelen STORTEN IN!" met een steile daling over de laatste 3 dagen.',
    },
    trick: {
      en: 'They only show 3 days after a record-high peak. The 6-month trend is actually strongly upward.',
      nl: 'Ze tonen alleen 3 dagen na een recordhoogtepunt. De 6-maanden trend is eigenlijk sterk stijgend.',
    },
    correctFlag: 'cherry-picked-timeframe',
    options: [
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'cherry-picked-timeframe', label: { en: 'Only a tiny time window is shown', nl: 'Er wordt slechts een klein tijdvenster getoond' } },
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'wrong-colors', label: { en: 'The colors are misleading', nl: 'De kleuren zijn misleidend' } },
    ],
    points: 200,
    chartData: {
      labels: ['Mon', 'Tue', 'Wed'],
      values: [150, 142, 135],
      yMin: 0,
      yMax: 160,
      color: '#FF7675',
      contextLine: [100, 105, 110, 115, 120, 125, 130, 138, 145, 150],
      contextLabels: ['5mo ago', '', '', '', '', '', '', '', '', 'Now'],
    },
  },
  {
    id: 'dual-axis-trick',
    title: { en: 'The Dual-Axis Deception', nl: 'De Dual-As Misleiding' },
    scenario: {
      en: 'A headline says: "Smartphone Use Causes Exam Failures!" Two lines seem to move together perfectly.',
      nl: 'Een kop zegt: "Smartphonegebruik Veroorzaakt Schooldaling!" Twee lijnen lijken perfect samen te bewegen.',
    },
    trick: {
      en: 'The two Y-axes have completely different scales, making unrelated trends look correlated.',
      nl: 'De twee Y-assen hebben volledig verschillende schalen, waardoor ongerelateerde trends gecorreleerd lijken.',
    },
    correctFlag: 'dual-axis-manipulation',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'dual-axis-manipulation', label: { en: 'Two different Y-axis scales are used', nl: 'Twee verschillende Y-asschalen worden gebruikt' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'missing-data', label: { en: 'Important data points are missing', nl: 'Belangrijke gegevenspunten ontbreken' } },
    ],
    points: 250,
    chartData: {
      leftAxis: { label: { en: 'Phone Hours', nl: 'Telefoon Uren' }, values: [2, 3, 4, 5, 6, 7], min: 0, max: 10 },
      rightAxis: { label: { en: 'Exam %', nl: 'Toets %' }, values: [85, 80, 82, 78, 76, 74], min: 70, max: 90 },
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    },
  },
  {
    id: 'missing-baseline',
    title: { en: 'The Missing Baseline', nl: 'De Ontbrekende Basislijn' },
    scenario: {
      en: 'An ad claims: "Our new vitamin boosts energy by 200%!" showing a huge bar compared to a tiny one.',
      nl: 'Een advertentie beweert: "Onze nieuwe vitamine verhoogt energie met 200%!" met een enorme balk vergeleken met een kleine.',
    },
    trick: {
      en: 'The "200% boost" is measured from an artificially low baseline of 1 unit. The actual difference is minimal.',
      nl: 'De "200% boost" wordt gemeten vanaf een kunstmatig lage basis van 1 eenheid. Het daadwerkelijke verschil is minimaal.',
    },
    correctFlag: 'misleading-baseline',
    options: [
      { id: 'misleading-baseline', label: { en: 'The starting point is artificially low', nl: 'Het startpunt is kunstmatig laag' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'wrong-units', label: { en: 'The units are wrong', nl: 'De eenheden zijn verkeerd' } },
    ],
    points: 175,
    chartData: {
      labels: ['Before', 'After'],
      values: [1, 3],
      yMin: 0,
      yMax: 100,
      color: '#6C5CE7',
      realValues: [45, 47],
    },
  },
  {
    id: '3d-pie-distortion',
    title: { en: 'The 3D Pie Chart Illusion', nl: 'De 3D Cirkeldiagram Illusie' },
    scenario: {
      en: 'A cereal company advertises: "Our brand is the #1 choice!" Their 3D pie chart makes their slice look enormous compared to competitors.',
      nl: 'Een ontbijtgranenbedrijf adverteert: "Ons merk is de #1 keuze!" Hun 3D cirkeldiagram laat hun stuk er enorm uitzien vergeleken met concurrenten.',
    },
    trick: {
      en: 'The 3D perspective tilts the pie forward, making the front slice appear much larger than it really is. The actual percentages are close (28% vs 25% vs 24%).',
      nl: 'Het 3D-perspectief kantelt de taart naar voren, waardoor het voorste stuk veel groter lijkt dan het in werkelijkheid is. De werkelijke percentages zijn dichtbij elkaar (28% vs 25% vs 24%).',
    },
    correctFlag: '3d-perspective-distortion',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: '3d-perspective-distortion', label: { en: '3D perspective distorts the proportions', nl: '3D-perspectief vervormt de verhoudingen' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'wrong-colors', label: { en: 'The colors are misleading', nl: 'De kleuren zijn misleidend' } },
    ],
    points: 175,
    chartData: {
      labels: ['OatBlast', 'CrunchCo', 'FiberPlus', 'Other'],
      values: [28, 25, 24, 23],
      colors: ['#6C5CE7', '#00B894', '#FDCB6E', '#B2BEC3'],
    },
  },
  {
    id: 'percentage-vs-absolute',
    title: { en: 'Percentage vs. Absolute Numbers', nl: 'Percentage vs. Absolute Getallen' },
    scenario: {
      en: 'A tech blog writes: "App X grew 500% while App Y grew only 50%!" The bar chart makes App X look dominant.',
      nl: 'Een techblog schrijft: "App X groeide met 500% terwijl App Y slechts 50% groeide!" De balkdiagram laat App X dominant lijken.',
    },
    trick: {
      en: 'App X went from 2 to 12 users (500% growth, +10 people). App Y went from 10,000 to 15,000 (50% growth, +5,000 people). Percentage growth hides the massive difference in actual users.',
      nl: 'App X ging van 2 naar 12 gebruikers (500% groei, +10 personen). App Y ging van 10.000 naar 15.000 (50% groei, +5.000 personen). Percentagegroei verbergt het enorme verschil in werkelijke gebruikers.',
    },
    correctFlag: 'percentage-hides-absolute',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'percentage-hides-absolute', label: { en: 'Percentages hide the real numbers', nl: 'Percentages verbergen de echte getallen' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'wrong-labels', label: { en: 'The axis labels are wrong', nl: 'De aslabels zijn verkeerd' } },
    ],
    points: 225,
    chartData: {
      labels: ['App X', 'App Y'],
      values: [500, 50],
      yMin: 0,
      yMax: 600,
      color: '#E17055',
      hiddenContext: { appX: { from: 2, to: 12 }, appY: { from: 10000, to: 15000 } },
    },
  },
  {
    id: 'unequal-bar-widths',
    title: { en: 'The Unequal Bar Widths', nl: 'De Ongelijke Balkbreedtes' },
    scenario: {
      en: 'A city report says: "District A has WAY more parks than District B!" The bar chart shows District A\'s bar towering over B\'s.',
      nl: 'Een stadsrapport zegt: "District A heeft VEEL meer parken dan District B!" De balkdiagram toont District A\'s balk torenhoog boven B.',
    },
    trick: {
      en: 'District A\'s bar is 3x wider than District B\'s, making it look proportionally larger. Both districts have similar park counts when you read the actual numbers.',
      nl: 'District A\'s balk is 3x breder dan District B\'s, waardoor het proportioneel groter lijkt. Beide districten hebben vergelijkbare parkaantallen als je de werkelijke getallen leest.',
    },
    correctFlag: 'unequal-bar-widths',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'unequal-bar-widths', label: { en: 'Bars have different widths', nl: 'Balken hebben verschillende breedtes' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'wrong-colors', label: { en: 'The colors are misleading', nl: 'De kleuren zijn misleidend' } },
    ],
    points: 175,
    chartData: {
      labels: ['District A', 'District B'],
      values: [12, 10],
      yMin: 0,
      yMax: 15,
      color: '#00B894',
      barWidths: [3, 1],
    },
  },
  {
    id: 'truncated-x-axis',
    title: { en: 'The Truncated X-Axis', nl: 'De Afgeknipte X-as' },
    scenario: {
      en: 'A fitness app shows: "Users LOSE 10kg in just 1 week!" with a dramatic downward line graph.',
      nl: 'Een fitness-app toont: "Gebruikers VERLIESEN 10kg in slechts 1 week!" met een dramatisch dalende lijndiagram.',
    },
    trick: {
      en: 'The X-axis labels skip from "Day 1" straight to "Day 7", hiding that the weight loss happened over 7 days, not overnight. The daily change is actually normal water fluctuation.',
      nl: 'De X-as labels springen van "Dag 1" direct naar "Dag 7", waardoor verborgen wordt dat het gewichtsverlies over 7 dagen plaatsvond, niet \'s nachts. De dagelijkse verandering is eigenlijk normale waterfluctuatie.',
    },
    correctFlag: 'truncated-x-axis',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'truncated-x-axis', label: { en: 'Time labels skip important days', nl: 'Tijdslabels overslaan belangrijke dagen' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'missing-data', label: { en: 'Important data points are missing', nl: 'Belangrijke gegevenspunten ontbreken' } },
    ],
    points: 200,
    chartData: {
      labels: ['Day 1', 'Day 7'],
      values: [90, 80],
      yMin: 75,
      yMax: 95,
      color: '#FD79A8',
      hiddenDays: ['Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
      hiddenValues: [89.5, 89.8, 89.2, 89.6, 89.1, 80],
    },
  },
  {
    id: 'graph-without-zero',
    title: { en: 'The "Zero? What Zero?" Trick', nl: 'De "Nul? Welke Nul?" Truc' },
    scenario: {
      en: 'A headline reads: "Electric Car Sales EXPLODE — 10x Growth!" The bar chart shows one tiny bar and one huge bar.',
      nl: 'Een kop luidt: "Elektrische Auto Verkopen EXPLOEREN — 10x Groei!" De balkdiagram toont een kleine en een grote balk.',
    },
    trick: {
      en: 'The chart starts the Y-axis at 9,000 instead of 0. The "tiny" bar represents 9,500 sales and the "huge" bar is 10,500 — only a 10.5% increase, not 10x.',
      nl: 'De grafiek begint de Y-as bij 9.000 in plaats van 0. De "kleine" balk vertegenwoordigt 9.500 verkopen en de "grote" balk is 10.500 — slechts een toename van 10,5%, niet 10x.',
    },
    correctFlag: 'y-axis-truncated',
    options: [
      { id: 'y-axis-truncated', label: { en: 'Y-axis starts way above zero', nl: 'Y-as begint ver boven nul' } },
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'wrong-labels', label: { en: 'The title is misleading', nl: 'De titel is misleidend' } },
      { id: 'missing-legend', label: { en: 'There is no legend', nl: 'Er is geen legenda' } },
    ],
    points: 150,
    chartData: {
      labels: ['2023', '2024'],
      values: [9500, 10500],
      yMin: 9000,
      yMax: 11000,
      color: '#00CEC9',
    },
  },
  {
    id: 'misleading-area-chart',
    title: { en: 'The Stacked Area Inflation', nl: 'De Gestapelde Vlak Opblazing' },
    scenario: {
      en: 'A social media post shows: "Our platform is KILLING the competition!" Three colored areas seem to dwarf the competitor.',
      nl: 'Een social media-post toont: "Ons platform VERNIETIGT de concurrentie!" Drie gekleurde vlakken lijken de concurrent te overtreffen.',
    },
    trick: {
      en: 'The stacked area chart adds values on top of each other, making the total look massive. When unstacked, the competitor\'s single area is actually larger than any one of the three.',
      nl: 'Het gestapelde vlakdiagram telt waarden boven elkaar op, waardoor het totaal er massief uitziet. Losgestapeld is het enkele vlak van de concurrent eigenlijk groter dan elk van de drie.',
    },
    correctFlag: 'stacked-area-misleading',
    options: [
      { id: 'no-issue', label: { en: 'The graph looks honest to me', nl: 'De grafiek ziet er eerlijk uit' } },
      { id: 'stacked-area-misleading', label: { en: 'Stacking areas inflates the visual', nl: 'Stapelen van vlakken blaast het beeld op' } },
      { id: 'y-axis-truncated', label: { en: 'Y-axis doesn\'t start at zero', nl: 'Y-as begint niet bij nul' } },
      { id: 'wrong-colors', label: { en: 'The colors are misleading', nl: 'De kleuren zijn misleidend' } },
    ],
    points: 250,
    chartData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        { label: 'Feature A', values: [20, 25, 30, 35], color: '#6C5CE7' },
        { label: 'Feature B', values: [15, 18, 22, 28], color: '#00B894' },
        { label: 'Feature C', values: [10, 12, 15, 20], color: '#FD79A8' },
      ],
      competitor: { label: 'Competitor', values: [40, 45, 50, 55], color: '#B2BEC3' },
      yMin: 0,
      yMax: 120,
    },
  },
]

// ── AI Debate Challenges ──

export const AI_DEBATE_CHALLENGES = [
  {
    id: 'debate-scatter',
    title: { en: 'Debug the AI: Scatter Plot', nl: 'Debug de AI: Spreidingsdiagram' },
    dataset: {
      title: { en: 'Study Hours vs. Test Scores', nl: 'Studie-uren vs. Toetsresultaten' },
      points: [
        { x: 1, y: 55 }, { x: 2, y: 62 }, { x: 3, y: 70 },
        { x: 4, y: 75 }, { x: 5, y: 78 }, { x: 6, y: 82 },
        { x: 7, y: 85 }, { x: 8, y: 84 }, { x: 9, y: 88 },
        { x: 10, y: 90 },
      ],
      xLabel: { en: 'Study Hours', nl: 'Studie-uren' },
      yLabel: { en: 'Test Score (%)', nl: 'Test Score (%)' },
    },
    aiClaim: {
      en: 'Students who study more than 8 hours always get the highest scores. More study time guarantees better results!',
      nl: 'Studenten die meer dan 8 uur studeren krijgen altijd de hoogste scores. Meer studietijd garandeert betere resultaten!',
    },
    flaws: [
      {
        id: 'correlation-not-causation',
        en: 'The AI confuses correlation with causation — other factors like prior knowledge matter too.',
        nl: 'De AI verwarrelt correlatie met oorzaak-gevolg — andere factoren zoals voorkennis tellen ook.',
      },
      {
        id: 'ignores-diminishing-returns',
        en: 'The AI ignores diminishing returns — the gain from 8 to 10 hours is much smaller than from 1 to 3.',
        nl: 'De AI negeert dalende opbrengsten — de winst van 8 naar 10 uur is veel kleiner dan van 1 naar 3.',
      },
      {
        id: 'overgeneralization',
        en: 'The AI overgeneralizes with "always" and "guarantees" — the data shows trends, not certainties.',
        nl: 'De AI generaliseert met "altijd" en "garanties" — de gegevens tonen trends, geen zekerheden.',
      },
    ],
    correctFlawCount: 3,
    points: 300,
  },
  {
    id: 'debate-pie',
    title: { en: 'Debug the AI: Pie Chart', nl: 'Debug de AI: Cirkeldiagram' },
    dataset: {
      title: { en: 'Social Media Usage by Platform', nl: 'Social Media Gebruik per Platform' },
      slices: [
        { label: 'TikTok', value: 35 },
        { label: 'Instagram', value: 28 },
        { label: 'YouTube', value: 22 },
        { label: 'Snapchat', value: 10 },
        { label: 'Other', value: 5 },
      ],
    },
    aiClaim: {
      en: 'TikTok is clearly the most popular platform with 35% — that means more than a third of all teens use it daily.',
      nl: 'TikTok is duidelijk het populairste platform met 35% — dat betekent dat meer dan een derde van alle tieners het dagelijks gebruikt.',
    },
    flaws: [
      {
        id: 'percentage-not-count',
        en: 'The AI assumes percentages mean daily users, but the data only shows platform preference, not usage frequency.',
        nl: 'De AI neemt aan dat percentages dagelijkse gebruikers betekenen, maar de gegevens tonen alleen platformvoorkeur, geen gebruiksrequentie.',
      },
      {
        id: 'no-sample-size',
        en: 'The AI doesn\'t mention the sample size — how many teens were surveyed? 10 or 10,000?',
        nl: 'De AI noemt de steekproefomvang niet — hoeveel tieners werden ondervraagd? 10 of 10.000?',
      },
      {
        id: 'ignores-overlap',
        en: 'Teens use multiple platforms — the categories aren\'t mutually exclusive.',
        nl: 'Tieners gebruiken meerdere platforms — de categorieën zijn niet wederzijds uitsluitend.',
      },
    ],
    correctFlawCount: 3,
    points: 250,
  },
  {
    id: 'debate-line',
    title: { en: 'Debug the AI: Line Graph', nl: 'Debug de AI: Lijndiagram' },
    dataset: {
      title: { en: 'Global Temperature Anomaly (1980-2024)', nl: 'Globale Temperatuuranomalie (1980-2024)' },
      points: [
        { x: 1980, y: 0.26 }, { x: 1985, y: 0.12 }, { x: 1990, y: 0.45 },
        { x: 1995, y: 0.46 }, { x: 2000, y: 0.42 }, { x: 2005, y: 0.68 },
        { x: 2010, y: 0.72 }, { x: 2015, y: 0.90 }, { x: 2020, y: 1.02 },
        { x: 2024, y: 1.29 },
      ],
      xLabel: { en: 'Year', nl: 'Jaar' },
      yLabel: { en: 'Temperature Anomaly (°C)', nl: 'Temperatuuranomalie (°C)' },
    },
    aiClaim: {
      en: 'Global warming has been a perfectly smooth and steady increase since 1980 with no exceptions.',
      nl: 'Opwarming van de aarde is een perfect gladde en gestage toename sinds 1980 zonder uitzonderingen.',
    },
    flaws: [
      {
        id: 'ignores-variability',
        en: 'The AI ignores year-to-year variability — temperatures dip in some years (e.g., 1985, 2000).',
        nl: 'De AI negeert de jaarlijkse variabiliteit — temperaturen dalen in sommige jaren (bijv. 1985, 2000).',
      },
      {
        id: 'smooth-trend-fallacy',
        en: '"Perfectly smooth" is wrong — the trend has short-term fluctuations even though the overall direction is upward.',
        nl: '"Perfect glad" is fout — de trend heeft kortetermijnfluctuaties hoewel de algemene richting stijgend is.',
      },
      {
        id: 'cherry-picked-start',
        en: 'Starting at 1980 ignores earlier data that provides important context for the warming trend.',
        nl: 'Beginnen bij 1980 negeert eerdere gegevens die belangrijke context bieden voor de opwarmings趋势.',
      },
    ],
    correctFlawCount: 3,
    points: 275,
  },
]

// ── Sandbox Progress Management ──

export function getSandboxProgress(kidId) {
  const all = storage.get(STORAGE_KEY_SANDBOX, {})
  return all[kidId] || { points: 0, completedChallenges: [], unlockedTiers: [1], currentTier: 1 }
}

export function saveSandboxProgress(kidId, progress) {
  const all = storage.get(STORAGE_KEY_SANDBOX, {})
  all[kidId] = progress
  storage.set(STORAGE_KEY_SANDBOX, all)
}

export function addSandboxPoints(kidId, points) {
  const progress = getSandboxProgress(kidId)
  progress.points += points

  for (const tier of SANDBOX_TIERS) {
    if (progress.points >= tier.pointsRequired && !progress.unlockedTiers.includes(tier.level)) {
      progress.unlockedTiers.push(tier.level)
    }
  }

  const highestUnlocked = Math.max(...progress.unlockedTiers)
  progress.currentTier = highestUnlocked

  saveSandboxProgress(kidId, progress)
  return progress
}

export function markChallengeComplete(kidId, challengeId) {
  const progress = getSandboxProgress(kidId)
  if (!progress.completedChallenges.includes(challengeId)) {
    progress.completedChallenges.push(challengeId)
  }
  saveSandboxProgress(kidId, progress)
  return progress
}

export function isChallengeComplete(kidId, challengeId) {
  const progress = getSandboxProgress(kidId)
  return progress.completedChallenges.includes(challengeId)
}

// ── Line of Best Fit Calculator ──

export function computeLineOfBestFit(points) {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
  for (const p of points) {
    sumX += p.x
    sumY += p.y
    sumXY += p.x * p.y
    sumX2 += p.x * p.x
    sumY2 += p.y * p.y
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const yMean = sumY / n
  let ssTot = 0, ssRes = 0
  for (const p of points) {
    ssTot += (p.y - yMean) ** 2
    ssRes += (p.y - (slope * p.x + intercept)) ** 2
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot

  return { slope, intercept, r2 }
}

export function filterPoints(points, excludedIndices) {
  return points.filter((_, i) => !excludedIndices.includes(i))
}
