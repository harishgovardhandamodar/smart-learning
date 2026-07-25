// ── Learning Path Templates ──
// Each path is a zero-to-hero journey with structured lessons.
// Learning method: Scaffold → Example → Visual Summary → Active Recall → Practice

import { PHYSICS_WEEK1, PHYSICS_WEEK2, PHYSICS_WEEK3, PHYSICS_WEEK4 } from './physicsCurriculum'

// ── Built-in Path: Charts, Graphs & Analysis ──

export const CHARTS_PATH = {
  id: 'charts-graphs-analysis',
  icon: '📊',
  category: 'data-science',
  difficulty: 'beginner',
  estimatedHours: 4,
  title: { en: 'Charts, Graphs & Analysis', nl: 'Grafieken, Diagrammen & Analyse' },
  subtitle: { en: 'From zero to hero — learn to read, create & analyze data!', nl: 'Van nul tot held — leer gegevens lezen, maken & analyseren!' },
  description: {
    en: 'A fun journey to master charts and graphs. You\'ll learn why we visualize data, how to read different chart types, and how to create your own!',
    nl: 'Een leuke reis om grafieken en diagrammen te beheersen. Je leert waarom we gegevens visualiseren, hoe je verschillende grafiektypen leest, en hoe je je eigen maakt!'
  },
  prerequisites: [],
  mindMap: {
    nodes: ['Charts & Graphs', 'Bar Charts', 'Pie Charts', 'Line Graphs', 'Pictographs', 'Data Collection', 'Analysis', 'Create Your Own', 'What-If Explorer', 'Spot Deception', 'AI Debate'],
    connections: [
      ['Charts & Graphs', 'Bar Charts'],
      ['Charts & Graphs', 'Pie Charts'],
      ['Charts & Graphs', 'Line Graphs'],
      ['Charts & Graphs', 'Pictographs'],
      ['Charts & Graphs', 'Data Collection'],
      ['Charts & Graphs', 'Analysis'],
      ['Analysis', 'Create Your Own'],
      ['Create Your Own', 'What-If Explorer'],
      ['What-If Explorer', 'Spot Deception'],
      ['Spot Deception', 'AI Debate'],
    ]
  },
  lessons: [
    // Lesson 1: Why Visualize Data?
    {
      id: 'why-visualize',
      title: { en: 'Why Do We Visualize Data?', nl: 'Waarom Visualiseren We Gegevens?' },
      icon: '🔍',
      duration: '15 min',
      concept: {
        en: `Imagine someone tells you: "In our class, 12 kids like pizza, 8 like pasta, 5 like tacos, and 3 like salad."

That's a lot of numbers to remember! But what if I showed you a colorful chart instead?

**Data visualization** is the art of turning numbers into pictures. It helps us:
- **See patterns** — which food is most popular? Pizza! (It has the biggest bar)
- **Compare things** — pasta is almost twice as popular as tacos
- **Make decisions** — if we order lunch for the class, we know what to get
- **Tell stories** — numbers alone are boring, but charts make them exciting!

Think of it like this: a recipe written as a list of numbers (200g flour, 100g sugar...) is hard to imagine. But a photo of the finished cake? That tells the whole story instantly!`,
        nl: `Stel je voor dat iemand zegt: "In onze klas vinden 12 kinderen pizza lekker, 8 vinden pasta lekker, 5 vinden taco's lekker, en 3 vinden salade lekker."

Dat zijn veel getallen om te onthouden! Maar wat als ik je een kleurrijke grafiek laat zien in plaats daarvan?

**Gegevensvisualisatie** is de kunst om getallen in plaatjes om te zetten. Het helpt ons om:
- **Patronen te zien** — welk eten is het populairst? Pizza! (Het heeft de grootste balk)
- **Dingen te vergelijken** — pasta is bijna twee keer zo populair als taco's
- **Beslissingen te nemen** — als we lunch voor de klas bestellen, weten we wat we moeten halen
- **Verhalen te vertellen** — getallen alleen zijn saai, maar grafieken maken ze spannend!

Denk er zo over na: een recept geschreven als een lijst met getallen (200g bloem, 100g suiker...) is moeilijk om je voor te stellen. Maar een foto van de afgewerkt taart? Dat vertelt het hele verhaal onmiddellijk!`
      },
      example: {
        type: 'comparison',
        en: {
          title: 'Numbers vs. Chart',
          left: { label: 'Raw Numbers', content: 'Pizza: 12\nPasta: 8\nTacos: 5\nSalad: 3' },
          right: { label: 'Bar Chart', bars: [{ label: 'Pizza', value: 12, color: '#FF6B6B' }, { label: 'Pasta', value: 8, color: '#4ECDC4' }, { label: 'Tacos', value: 5, color: '#FFE66D' }, { label: 'Salad', value: 3, color: '#95E1D3' }] }
        },
        nl: {
          title: 'Getallen vs. Grafiek',
          left: { label: 'Ruwe Getallen', content: 'Pizza: 12\nPasta: 8\nTaco\'s: 5\nSalade: 3' },
          right: { label: 'Balkdiagram', bars: [{ label: 'Pizza', value: 12, color: '#FF6B6B' }, { label: 'Pasta', value: 8, color: '#4ECDC4' }, { label: 'Taco\'s', value: 5, color: '#FFE66D' }, { label: 'Salade', value: 3, color: '#95E1D3' }] }
        }
      },
      quiz: [
        {
          question: { en: 'What does data visualization help us do?', nl: 'Waarom helpt gegevensvisualisatie ons?' },
          options: [
            { en: 'Turn numbers into pictures to see patterns', nl: 'Getallen in plaatjes omzetten om patronen te zien' },
            { en: 'Make food taste better', nl: 'Eten lekkerder maken' },
            { en: 'Count faster on a calculator', nl: 'Sneller tellen op een rekenmachine' },
            { en: 'Remember phone numbers', nl: 'Telefoonnummers onthouden' }
          ],
          correct: 0,
          explanation: { en: 'Data visualization turns numbers into visual pictures (like charts) so we can spot patterns, compare things, and tell stories with data!', nl: 'Gegevensvisualisatie zet getallen om in visuele plaatjes (zoals grafieken) zodat we patronen kunnen zien, dingen kunnen vergelijken, en verhalen kunnen vertellen met gegevens!' }
        },
        {
          question: { en: 'If 12 kids like pizza and 6 like tacos, what can a chart tell us instantly?', nl: 'Als 12 kinderen pizza lekker vinden en 6 taco\'s, wat kan een grafiek ons direct vertellen?' },
          options: [
            { en: 'Pizza is twice as popular as tacos', nl: 'Pizza is twee keer zo populair als taco\'s' },
            { en: 'Tacos taste better', nl: 'Taco\'s smaken beter' },
            { en: 'We need more plates', nl: 'We hebben meer borden nodig' },
            { en: 'Pizza has more cheese', nl: 'Pizza heeft meer kaas' }
          ],
          correct: 0,
          explanation: { en: 'A chart makes it easy to compare — the pizza bar is twice as tall as the tacos bar, so pizza is twice as popular!', nl: 'Een grafiek maakt het gemakkelijk om te vergelijken — de pizza-balk is twee keer zo hoog als de taco-balk, dus pizza is twee keer zo populair!' }
        }
      ],
      practice: {
        en: 'Think of your favorite fruits. How many of each does your family eat in a week? Draw a simple chart on paper!',
        nl: 'Denk aan je favoriete fruit. Hoeveel van elk eet je gezin per week? Teken een eenvoudige grafiek op papier!'
      }
    },

    // Lesson 2: Bar Charts
    {
      id: 'bar-charts',
      title: { en: 'Bar Charts — Comparing Things', nl: 'Balkdiagrammen — Dingen Vergelijken' },
      icon: '📊',
      duration: '20 min',
      concept: {
        en: `**Bar charts** are the most common type of chart. They use bars (rectangles) to show how much of something there is.

**How to read a bar chart:**
- The **tall bars** = MORE of something
- The **short bars** = LESS of something
- The **labels** at the bottom tell you WHAT you're comparing
- The **numbers** on the side tell you HOW MUCH

**Example: Our Class Pets Survey**
~~~
  🐱 Cats     ████████████ (8)
  🐕 Dogs     ██████████████████ (12)
  🐹 Hamsters █████ (3)
  🐟 Fish     ████████ (6)
~~~

**Key rules for bar charts:**
1. Bars should be the **same width** — only the height changes
2. The gap between bars should be **consistent**
3. Always include a **title** so people know what they're looking at
4. Start the number scale at **zero** (otherwise it can be misleading!)

**When to use bar charts:**
- Comparing different groups (cats vs dogs vs hamsters)
- Comparing different categories (favorite foods, colors, subjects)`,
        nl: `**Balkdiagrammen** zijn het meest voorkomende type grafiek. Ze gebruiken balken (rechthoeken) om te laten zien hoeveel van iets er is.

**Hoe lees je een balkdiagram?**
- De **hoge balken** = MEER van iets
- De **korte balken** = MINDER van iets
- De **labels** onderaan vertellen WAT je vergelijkt
- De **getallen** aan de zijkant vertellen HOEVEEL

**Voorbeeld: Ons Klas Huisdieren Onderzoek**
~~~
  🐱 Katten     ████████████ (8)
  🐕 Honden     ██████████████████ (12)
  🐹 Hamsters   █████ (3)
  🐟 Vissen     ████████ (6)
~~~

**Belangrijke regels voor balkdiagrammen:**
1. Balken moeten **dezelfde breedte** hebben — alleen de hoogte verandert
2. De afstand tussen balken moet **consistent** zijn
3. Altijd een **titel** opnemen zodat mensen weten waar ze naar kijken
4. Begin de getallenschaal op **nul** (anders kan het misleidend zijn!)

**Wanneer gebruik je balkdiagrammen?**
- Verschillende groepen vergelijken (katten vs honden vs hamsters)
- Verschillende categorieën vergelijken (favoriete etenswaren, kleuren, vakken)`
      },
      example: {
        type: 'interactive-bar',
        en: {
          title: 'Favorite School Subjects',
          subtitle: 'Click the bars to explore!',
          data: [
            { label: 'Math', value: 15, emoji: '🧮', color: '#6C5CE7' },
            { label: 'Art', value: 12, emoji: '🎨', color: '#FD79A8' },
            { label: 'Science', value: 18, emoji: '🔬', color: '#00B894' },
            { label: 'PE', value: 20, emoji: '⚽', color: '#FDCB6E' },
            { label: 'Music', value: 8, emoji: '🎵', color: '#E17055' }
          ]
        },
        nl: {
          title: 'Favoriete Schoolvakken',
          subtitle: 'Klik op de balken om te ontdekken!',
          data: [
            { label: 'Rekenen', value: 15, emoji: '🧮', color: '#6C5CE7' },
            { label: 'Kunst', value: 12, emoji: '🎨', color: '#FD79A8' },
            { label: 'Natuurkunde', value: 18, emoji: '🔬', color: '#00B894' },
            { label: 'Gym', value: 20, emoji: '⚽', color: '#FDCB6E' },
            { label: 'Muziek', value: 8, emoji: '🎵', color: '#E17055' }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'In a bar chart, what does a TALL bar mean?', nl: 'In een balkdiagram, wat betekent een HOGEC balk?' },
          options: [
            { en: 'More of that thing', nl: 'Meer van dat ding' },
            { en: 'Less of that thing', nl: 'Minder van dat ding' },
            { en: 'The thing is expensive', nl: 'Het ding is duur' },
            { en: 'Nobody chose it', nl: 'Niemand koos het' }
          ],
          correct: 0,
          explanation: { en: 'Tall bars = MORE! If PE has the tallest bar, it means the most kids chose PE as their favorite.', nl: 'Hoge balken = MEER! Als gym de hoogste balk heeft, betekent dat de meeste kinderen gym kozen als hun favoriet.' }
        },
        {
          question: { en: 'Why should the number scale on a bar chart start at zero?', nl: 'Waarom moet de getallenschaal op een balkdiagram bij nul beginnen?' },
          options: [
            { en: 'Otherwise the chart can be misleading', nl: 'Anders kan de grafiek misleidend zijn' },
            { en: 'Because zero is a nice number', nl: 'Omdat nul een mooi getal is' },
            { en: 'It doesn\'t matter', nl: 'Het maakt niet uit' },
            { en: 'Because we always start at 10', nl: 'Omdat we altijd bij 10 beginnen' }
          ],
          correct: 0,
          explanation: { en: 'If you start at 5 instead of 0, a bar of 6 looks 6x bigger than a bar of 5 — but it\'s only 20% more! Starting at zero keeps things honest.', nl: 'Als je bij 5 begint in plaats van 0, lijkt een balk van 6 zes keer groter dan een balk van 5 — maar het is slechts 20% meer! Bij nul beginnen houdt eerlijk.' }
        }
      ],
      practice: {
        en: 'Survey your family: What\'s everyone\'s favorite color? Draw a bar chart with the results. Make sure the bars are the same width!',
        nl: 'Onderzoek je gezin: Wat is ieders favoriete kleur? Teken een balkdiagram met de resultaten. Zorg ervoor dat de balken dezelfde breedte hebben!'
      }
    },

    // Lesson 3: Pie Charts
    {
      id: 'pie-charts',
      title: { en: 'Pie Charts — Parts of a Whole', nl: 'Cirkeldiagrammen — Delen van een Geheel' },
      icon: '🥧',
      duration: '20 min',
      concept: {
        en: `A **pie chart** is a circle divided into slices — like cutting a pizza! Each slice shows how much of the total something takes up.

**The whole pie = 100%** of everything you're counting.

**How to read a pie chart:**
- **Big slices** = that category has a LARGER share
- **Small slices** = that category has a SMALLER share
- All slices together = **100%** (the whole pie)

**Example: How Our Class Spends Free Time**
~~~
        ⚽ Sports (40%)
       /          \
      /            \
Playing ─────────── Reading
Games              (15%)
(30%)    \        /
          \      /
         Art & Crafts
            (15%)
~~~

**When to use pie charts:**
- When you want to show **parts of a whole** (percentages)
- When you have **2-6 categories** (too many slices gets messy!)
- When all the numbers add up to a **total**

**When NOT to use pie charts:**
- Comparing exact values (bar charts are better for that)
- When you have many categories (the slices get too thin)
- When values are very close in size (hard to tell the difference)`,
        nl: `Een **cirkeldiagram** is een cirkel verdeeld in stukken — net zoals het snijden van een pizza! Elk stuk laat zien hoeveel van het totaal iets inneemt.

**De hele taart = 100%** van alles wat je telt.

**Hoe lees je een cirkeldiagram?**
- **Grote stukken** = die categorie heeft een GROTER aandeel
- **Kleine stukken** = die categorie heeft een KLEINER aandeel
- Alle stukken samen = **100%** (de hele taart)

**Voorbeeld: Hoe Onze Klas Vrije Tijd Besteedt**
~~~
        ⚽ Sport (40%)
       /          \
      /            \
Spelen ──────────── Lezen
(30%)               (15%)
      \            /
       \          /
      Kunst & Knutselen
          (15%)
~~~

**Wanneer gebruik je cirkeldiagrammen?**
- Als je **delen van een geheel** wilt laten zien (percentages)
- Als je **2-6 categorieën** hebt (te veel stukken wordt rommelig!)
- Als alle getallen optellen tot een **totaal**

**Wanneer NIET gebruiken?**
- Exacte waarden vergelijken (balkdiagrammen zijn beter)
- Als je veel categorieën hebt (de stukken worden te dun)
- Als waarden heel dicht bij elkaar liggen (moeilijk om verschil te zien)`
      },
      example: {
        type: 'pie',
        en: {
          title: 'How We Travel to School',
          slices: [
            { label: 'Walk', value: 35, emoji: '🚶', color: '#00B894' },
            { label: 'Car', value: 30, emoji: '🚗', color: '#6C5CE7' },
            { label: 'Bike', value: 25, emoji: '🚲', color: '#FDCB6E' },
            { label: 'Bus', value: 10, emoji: '🚌', color: '#E17055' }
          ]
        },
        nl: {
          title: 'Hoe We Naar School Reizen',
          slices: [
            { label: 'Lopen', value: 35, emoji: '🚶', color: '#00B894' },
            { label: 'Auto', value: 30, emoji: '🚗', color: '#6C5CE7' },
            { label: 'Fiets', value: 25, emoji: '🚲', color: '#FDCB6E' },
            { label: 'Bus', value: 10, emoji: '🚌', color: '#E17055' }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'In a pie chart, what does the whole circle represent?', nl: 'In een cirkeldiagram, wat vertegenwoordigt de hele cirkel?' },
          options: [
            { en: '100% of everything being counted', nl: '100% van alles wat geteld wordt' },
            { en: 'The biggest category', nl: 'De grootste categorie' },
            { en: 'The smallest category', nl: 'De kleinste categorie' },
            { en: 'Half of the data', nl: 'De helft van de gegevens' }
          ],
          correct: 0,
          explanation: { en: 'The whole pie = 100%. Each slice is a part of that total. If 35% walk to school, their slice takes up 35% of the circle.', nl: 'De hele taart = 100%. Elk stuk is een deel van dat totaal. Als 35% naar school loopt, neemt hun stuk 35% van de cirkel in.' }
        },
        {
          question: { en: 'You have 8 categories of data. Should you use a pie chart?', nl: 'Je hebt 8 categorieën gegevens. Moet je een cirkeldiagram gebruiken?' },
          options: [
            { en: 'No — too many slices makes it hard to read', nl: 'Nee — te veel stukken maakt het moeilijk om te lezen' },
            { en: 'Yes — pie charts work for any number', nl: 'Ja — cirkeldiagrammen werken voor elk aantal' },
            { en: 'Yes — more slices is always better', nl: 'Ja — meer stukken is altijd beter' },
            { en: 'No — pie charts are only for food data', nl: 'Nee — cirkeldiagrammen zijn alleen voor voedselgegevens' }
          ],
          correct: 0,
          explanation: { en: 'Pie charts work best with 2-6 categories. With 8+ categories, the slices become too thin and hard to tell apart. Use a bar chart instead!', nl: 'Cirkeldiagrammen werken het beste met 2-6 categorieën. Met 8+ categorieën worden de stukken te dun en moeilijk uit elkaar te houden. Gebruik een balkdiagram!' }
        }
      ],
      practice: {
        en: 'Look at your breakfast this week. What did you eat each day? Create a pie chart showing the percentages!',
        nl: 'Kijk naar je ontbijt deze week. Wat at je elke dag? Maak een cirkeldiagram met de percentages!'
      }
    },

    // Lesson 4: Line Graphs
    {
      id: 'line-graphs',
      title: { en: 'Line Graphs — Tracking Changes', nl: 'Lijndiagrammen — Veranderingen Volgen' },
      icon: '📈',
      duration: '20 min',
      concept: {
        en: `A **line graph** shows how something changes over **time**. The line goes up, down, or stays flat — and that tells a story!

**How to read a line graph:**
- The **horizontal axis** (bottom) = TIME (days, weeks, months, years)
- The **vertical axis** (left) = WHAT YOU'RE MEASURING
- **Line going UP** = the value is INCREASING 📈
- **Line going DOWN** = the value is DECREASING 📉
- **Flat line** = the value is STAYING THE SAME ➡️

**Example: Plant Growth Over 6 Weeks**
~~~
Height
(cm)
 30 |                              *
 25 |                        *
 20 |                  *
 15 |            *
 10 |      *
  5 | *
    +----+----+----+----+----+----→
      W1   W2   W3   W4   W5   W6
~~~
The plant grew slowly at first, then faster, then slowed down near the end!

**When to use line graphs:**
- Showing how something changes over **time**
- Tracking **trends** (is it going up or down?)
- Comparing **multiple lines** on the same graph (temperature vs rainfall)`,
        nl: `Een **lijndiagram** laat zien hoe iets verandert in de **tijd**. De lijn gaat omhoog, omlaag, of blijft plat — en dat vertelt een verhaal!

**Hoe lees je een lijndiagram?**
- De **horizontale as** (onder) = TIJD (dagen, weken, maanden, jaren)
- De **verticale as** (links) = WAT JE MEEET
- **Lijn omhoog** = de waarde NEOEMT TOE 📈
- **Lijn omlaag** = de waarde NEEMT AF 📉
- **Platte lijn** = de waarde BLIJFT HETZELFDE ➡️

**Voorbeeld: Plantengroei Over 6 Weken**
~~~
Hoogte
(cm)
 30 |                              *
 25 |                        *
 20 |                  *
 15 |            *
 10 |      *
  5 | *
    +----+----+----+----+----+----→
      W1   W2   W3   W4   W5   W6
~~~
De plant groeide eerst langzaam, toen sneller, en vertraagde aan het einde!

**Wanneer gebruik je lijndiagrammen?**
- Laten zien hoe iets verandert in de **tijd**
- **Trends** volgen (gaat het omhoog of omlaag?)
- **Meerdere lijnen** vergelijken op dezelfde grafiek (temperatuur vs neerslag)`
      },
      example: {
        type: 'line',
        en: {
          title: 'Daily Temperature This Week',
          subtitle: 'Watch the trend!',
          data: [
            { label: 'Mon', value: 18 },
            { label: 'Tue', value: 22 },
            { label: 'Wed', value: 20 },
            { label: 'Thu', value: 25 },
            { label: 'Fri', value: 28 },
            { label: 'Sat', value: 24 },
            { label: 'Sun', value: 21 }
          ]
        },
        nl: {
          title: 'Dagelijkse Temperatuur Deze Week',
          subtitle: 'Volg de trend!',
          data: [
            { label: 'Ma', value: 18 },
            { label: 'Di', value: 22 },
            { label: 'Wo', value: 20 },
            { label: 'Do', value: 25 },
            { label: 'Vr', value: 28 },
            { label: 'Za', value: 24 },
            { label: 'Zo', value: 21 }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'On a line graph, what does the line going UP tell us?', nl: 'Op een lijndiagram, wat vertelt de lijn die OMHOOG gaat ons?' },
          options: [
            { en: 'The value is increasing over time', nl: 'De waarde neemt toe in de tijd' },
            { en: 'The value is decreasing', nl: 'De waarde neemt af' },
            { en: 'Nothing is changing', nl: 'Er verandert niets' },
            { en: 'The data is wrong', nl: 'De gegevens zijn fout' }
          ],
          correct: 0,
          explanation: { en: 'Line going UP = INCREASING! Think of it like climbing a hill — you\'re going higher!', nl: 'Lijn OMHOOG = TOENAME! Denk eraan als een heuvel beklimmen — je gaat hoger!' }
        },
        {
          question: { en: 'Which type of chart is BEST for showing temperature changes over a month?', nl: 'Welk type grafiek is het BESTE om temperatuurveranderingen over een maand te laten zien?' },
          options: [
            { en: 'Line graph — it shows changes over time', nl: 'Lijndiagram — het laat veranderingen in de tijd zien' },
            { en: 'Pie chart — it shows percentages', nl: 'Cirkeldiagram — het laat percentages zien' },
            { en: 'Bar chart — it compares categories', nl: 'Balkdiagram — het vergelijkt categorieën' },
            { en: 'Pictograph — it uses pictures', nl: 'Pictogram — het gebruikt afbeeldingen' }
          ],
          correct: 0,
          explanation: { en: 'Line graphs are perfect for tracking changes over time! Temperature changes day by day, so a line graph shows the trend beautifully.', nl: 'Lijndiagrammen zijn perfect om veranderingen in de tijd bij te houden! Temperatuur verandert dag voor dag, dus een lijndiagram laat de trend mooi zien.' }
        }
      ],
      practice: {
        en: 'Measure the temperature outside every day this week. At the end, draw a line graph showing the changes!',
        nl: 'Meet de temperatuur buiten elke dag deze week. Teken aan het einde een lijndiagram met de veranderingen!'
      }
    },

    // Lesson 5: Pictographs
    {
      id: 'pictographs',
      title: { en: 'Pictographs — Pictures Tell the Story', nl: 'Pictogrammen — Afbeeldingen Vertellen het Verhaal' },
      icon: '🖼️',
      duration: '15 min',
      concept: {
        en: `A **pictograph** (or pictogram) uses **pictures or symbols** instead of bars to represent data. Each picture stands for a certain number.

**How to read a pictograph:**
- Look at the **key** — it tells you what each picture is worth
- **Count the pictures** (or fractions of pictures) for each row
- Multiply by the key value to get the total

**Example: Our Class Pet Survey (Key: 🐾 = 2 pets)**
~~~
Cats:     🐱🐱🐱🐾        = 7 pets
Dogs:     🐕🐕🐕🐕🐕      = 10 pets
Fish:     🐟🐟🐟           = 6 pets
~~~

**Why pictographs are cool:**
- They're **fun to look at** — pictures are more engaging than plain bars
- They're **easy to understand** — even for very young kids
- They tell a **visual story** at a glance

**When to use pictographs:**
- Simple data with small numbers
- When you want to make data **fun and engaging**
- For younger audiences who might find regular charts boring`,
        nl: `Een **pictogram** gebruikt **afbeeldingen of symbolen** in plaats van balken om gegevens weer te geven. Elke afbeelding staat voor een bepaald aantal.

**Hoe lees je een pictogram?**
- Kijk naar de **sleutel** — het vertelt je wat elke afbeelding waard is
- **Tel de afbeeldingen** (of fracties van afbeeldingen) voor elke rij
- Vermenigvuldig met de sleutelwaarde om het totaal te krijgen

**Voorbeeld: Ons Klas Huisdier Onderzoek (Sleutel: 🐾 = 2 huisdieren)**
~~~
Katten:   🐱🐱🐱🐾        = 7 huisdieren
Honden:   🐕🐕🐕🐕🐕      = 10 huisdieren
Vissen:   🐟🐟🐟           = 6 huisdieren
~~~

**Waarom pictogrammen leuk zijn:**
- Ze zijn **leuk om naar te kijken** — afbeeldingen zijn boeiender dan gewone balken
- Ze zijn **gemakkelijk te begrijpen** — zelfs voor hele jonge kinderen
- Ze vertellen een **visueel verhaal** in één oogopslag

**Wanneer gebruik je pictogrammen?**
- Eenvoudige gegevens met kleine getallen
- Als je gegevens **leuk en boeiend** wilt maken
- Voor jongere doelgroepen die gewone grafieken saai vinden`
      },
      example: {
        type: 'pictograph',
        en: {
          title: 'Lunch Orders Today',
          key: '🍎 = 3 students',
          data: [
            { label: 'Pizza', emoji: '🍕', count: 5, value: 15 },
            { label: 'Sandwich', emoji: '🥪', count: 3, value: 9 },
            { label: 'Salad', emoji: '🥗', count: 2, value: 6 },
            { label: 'Soup', emoji: '🍲', count: 1, value: 3 }
          ]
        },
        nl: {
          title: 'Lunchbestellingen Vandaag',
          key: '🍎 = 3 leerlingen',
          data: [
            { label: 'Pizza', emoji: '🍕', count: 5, value: 15 },
            { label: 'Broodje', emoji: '🥪', count: 3, value: 9 },
            { label: 'Salade', emoji: '🥗', count: 2, value: 6 },
            { label: 'Soep', emoji: '🍲', count: 1, value: 3 }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'In a pictograph where 🍎 = 3 students, what does 🍎🍎🍎 mean?', nl: 'In een pictogram waar 🍎 = 3 leerlingen, wat betekent 🍎🍎🍎?' },
          options: [
            { en: '9 students', nl: '9 leerlingen' },
            { en: '3 students', nl: '3 leerlingen' },
            { en: '6 students', nl: '6 leerlingen' },
            { en: '12 students', nl: '12 leerlingen' }
          ],
          correct: 0,
          explanation: { en: 'Each 🍎 = 3 students. So 🍎🍎🍎 = 3 + 3 + 3 = 9 students!', nl: 'Elke 🍎 = 3 leerlingen. Dus 🍎🍎🍎 = 3 + 3 + 3 = 9 leerlingen!' }
        }
      ],
      practice: {
        en: 'Create your own pictograph about something you like! Use emojis or draw your own symbols. Remember to include a key!',
        nl: 'Maak je eigen pictogram over iets wat je leuk vindt! Gebruik emojis of teken je eigen symbolen. Onthoud een sleutel!'
      }
    },

    // Lesson 6: Data Collection
    {
      id: 'data-collection',
      title: { en: 'Collecting Data — Ask the Right Questions', nl: 'Gegevens Verzamelen — Stel de Juiste Vragen' },
      icon: '📋',
      duration: '15 min',
      concept: {
        en: `Before you can make any chart, you need **data**. Data is information you collect by asking questions, counting things, or measuring.

**Steps to collect data:**
1. **Ask a clear question** — "What's your favorite color?" (not "Tell me about colors")
2. **Choose who to ask** — your class, your family, your friends
3. **Ask everyone the same question** — so the data is fair
4. **Write down every answer** — use tally marks (||||)
5. **Organize your data** — count each category

**Tally Marks:**
~~~
Red:    |||| |    = 6
Blue:   |||| |||  = 8
Green:  ||||      = 4
Yellow: |||| ||   = 7
~~~

**The Scientific Method for Kids:**
1. 🤔 **Question** — What do you want to find out?
2. 📋 **Plan** — Who will you ask? How many people?
3. ❓ **Ask** — Collect your data
4. 🔢 **Count** — Organize and count
5. 📊 **Chart** — Make a chart to show your results
6. 💡 **Conclude** — What did you learn?

**Good data collection tips:**
- Be **fair** — don't influence people's answers
- Be **consistent** — ask the same way each time
- Be **patient** — good data takes time to collect`,
        nl: `Voordat je een grafiek kunt maken, heb je **gegevens** nodig. Gegevens zijn informatie die je verzamelt door vragen te stellen, dingen te tellen of te meten.

**Stappen om gegevens te verzamelen:**
1. **Stel een duidelijke vraag** — "Wat is je favoriete kleur?" (niet "Vertel me over kleuren")
2. **Kies aan wie je vraagt** — je klas, je gezin, je vrienden
3. **Vraag iedereen dezelfde vraag** — zodat de gegevens eerlijk zijn
4. **Schrijf elk antwoord op** — gebruik streepjestelling (||||)
5. **Organiseer je gegevens** — tel elke categorie

**Streepjestelling:**
~~~
Rood:   |||| |    = 6
Blauw:  |||| |||  = 8
Groen:  ||||      = 4
Geel:   |||| ||   = 7
~~~

**De Wetenschappelijke Methode voor Kinderen:**
1. 🤔 **Vraag** — Wat wil je ontdekken?
2. 📋 **Plan** — Aan wie ga je vragen? Hoeveel mensen?
3. ❓ **Vraag** — Verzamel je gegevens
4. 🔢 **Tel** — Organiseer en tel
5. 📊 **Grafiek** — Maak een grafiek om je resultaten te laten zien
6. 💡 **Concludeer** — Wat heb je geleerd?

**Tips voor goed gegevensverzameling:**
- Wees **eerlijk** — beïnvloed geen antwoorden
- Wees **consistent** — vraag op dezelfde manier
- Wees **geduldig** — goede gegevens kosten tijd om te verzamelen`
      },
      example: {
        type: 'tally',
        en: {
          title: 'Favorite Season Survey',
          steps: [
            { step: 'Ask', text: '"What\'s your favorite season?"' },
            { step: 'Collect', data: ['Spring', 'Summer', 'Winter', 'Summer', 'Fall', 'Summer', 'Spring', 'Winter', 'Fall', 'Summer', 'Fall', 'Winter', 'Spring', 'Summer', 'Fall'] },
            { step: 'Tally', tally: { 'Spring': 3, 'Summer': 5, 'Fall': 4, 'Winter': 3 } },
            { step: 'Chart', bars: [{ label: 'Spring', value: 3 }, { label: 'Summer', value: 5 }, { label: 'Fall', value: 4 }, { label: 'Winter', value: 3 }] }
          ]
        },
        nl: {
          title: 'Favoriet Seizoen Onderzoek',
          steps: [
            { step: 'Vraag', text: '"Wat is je favoriete seizoen?"' },
            { step: 'Verzamel', data: ['Lente', 'Zomer', 'Winter', 'Zomer', 'Herfst', 'Zomer', 'Lente', 'Winter', 'Herfst', 'Zomer', 'Herfst', 'Winter', 'Lente', 'Zomer', 'Herfst'] },
            { step: 'Tellen', tally: { 'Lente': 3, 'Zomer': 5, 'Herfst': 4, 'Winter': 3 } },
            { step: 'Grafiek', bars: [{ label: 'Lente', value: 3 }, { label: 'Zomer', value: 5 }, { label: 'Herfst', value: 4 }, { label: 'Winter', value: 3 }] }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'What\'s the FIRST step before making a chart?', nl: 'Wat is de EERSTE stap voordat je een grafiek maakt?' },
          options: [
            { en: 'Collect data by asking questions or counting', nl: 'Gegevens verzamelen door vragen te stellen of te tellen' },
            { en: 'Draw the chart', nl: 'Teken de grafiek' },
            { en: 'Choose colors for the bars', nl: 'Kies kleuren voor de balken' },
            { en: 'Show it to your teacher', nl: 'Laat het aan je leraar zien' }
          ],
          correct: 0,
          explanation: { en: 'You need data FIRST! No data = nothing to chart. Always start by collecting information.', nl: 'Je hebt EERST gegevens nodig! Geen gegevens = niets om te tekenen. Begin altijd met het verzamelen van informatie.' }
        }
      ],
      practice: {
        en: 'Design a survey about something your family does. Ask everyone, use tally marks, then create a bar chart from your results!',
        nl: 'Ontwerp een onderzoek over iets wat je gezin doet. Vraag iedereen, gebruik streepjestelling, en maak dan een balkdiagram van je resultaten!'
      }
    },

    // Lesson 7: Choosing the Right Chart
    {
      id: 'choosing-charts',
      title: { en: 'Choosing the Right Chart', nl: 'Kies de Juiste Grafiek' },
      icon: '🎯',
      duration: '15 min',
      concept: {
        en: `Now you know different types of charts. But **WHICH one should you use?** That depends on what story your data tells!

**The Chart Decision Guide:**

📊 **Use a BAR CHART when...**
- You're **comparing** different groups
- You have categories (colors, foods, subjects)
- You want to see which is biggest/smallest

🥧 **Use a PIE CHART when...**
- You want to show **parts of a whole**
- Your numbers add up to a **total (100%)**
- You have 2-6 categories

📈 **Use a LINE GRAPH when...**
- You're showing changes over **time**
- You want to see a **trend** (going up, down, or flat)
- You have many time points (days, weeks, months)

🖼️ **Use a PICTOGRAPH when...**
- You want to make data **fun and visual**
- Your numbers are **small and simple**
- Your audience is younger

**Real-World Example:**
Imagine you measured how much rain fell each month:
- **Line graph** ✓ (tracking change over time)
- **Bar chart** ✓ (comparing months side by side)
- **Pie chart** ✗ (months don't add up to a total)
- **Pictograph** ✓ (if using raindrop symbols!)`,
        nl: `Nu ken je verschillende soorten grafieken. Maar **WELKE moet je gebruiken?** Dat hangt af van welk verhaal je gegevens vertellen!

**De Grafiek Beslisgids:**

📊 **Gebruik een BALKDIAGRAM wanneer...**
- Je verschillende groepen **vergelijkt**
- Je categorieën hebt (kleuren, etenswaren, vakken)
- Je wilt zien welk grootste/kleinste is

🥧 **Gebruik een CIRKELDIAGRAM wanneer...**
- Je **delen van een geheel** wilt laten zien
- Je getallen optellen tot een **totaal (100%)**
- Je 2-6 categorieën hebt

📈 **Gebruak een LIJNDIAGRAM wanneer...**
- Je veranderingen in de **tijd** laat zien
- Je een **trend** wilt zien (omhoog, omlaag, of plat)
- Je veel tijdpunten hebt (dagen, weken, maanden)

🖼️ **Gebruik een PICTOGRAM wanneer...**
- Je gegevens **leuk en visueel** wilt maken
- Je getallen **klein en eenvoudig** zijn
- Je doelgroep jonger is

**Real-Wereld Voorbeeld:**
Stel je voor dat je hebt gemeten hoeveel regen er elke maand viel:
- **Lijndiagram** ✓ (verandering in de tijd bijhouden)
- **Balkdiagram** ✓ (maanden zij aan zij vergelijken)
- **Cirkeldiagram** ✗ (maanden tellen niet op tot een totaal)
- **Pictogram** ✓ (als je regendruppelsymbolen gebruikt!)`
      },
      example: {
        type: 'decision',
        en: {
          title: 'What Chart Should I Use?',
          scenarios: [
            { question: 'Compare test scores in Math, Science, and English', answer: 'Bar Chart', icon: '📊', reason: 'Comparing categories' },
            { question: 'Show how your height changed over 5 years', answer: 'Line Graph', icon: '📈', reason: 'Tracking change over time' },
            { question: 'Show what percentage of students ride bus, bike, or walk', answer: 'Pie Chart', icon: '🥧', reason: 'Parts of a whole' },
            { question: 'Count how many books each kid read this month', answer: 'Bar Chart', icon: '📊', reason: 'Comparing counts' }
          ]
        },
        nl: {
          title: 'Welke Grafiek Moet Ik Gebruiken?',
          scenarios: [
            { question: 'Vergelijk cijfers in Rekenen, Natuurkunde en Engels', answer: 'Balkdiagram', icon: '📊', reason: 'Categorieën vergelijken' },
            { question: 'Laat zien hoe je lengte veranderde over 5 jaar', answer: 'Lijndiagram', icon: '📈', reason: 'Verandering in de tijd' },
            { question: 'Laat zien welk percentage met de bus, fiets of lopend gaat', answer: 'Cirkeldiagram', icon: '🥧', reason: 'Delen van een geheel' },
            { question: 'Tel hoeveel boeken elk kind deze maand las', answer: 'Balkdiagram', icon: '📊', reason: 'Aantallen vergelijken' }
          ]
        }
      },
      quiz: [
        {
          question: { en: 'You want to show how much money your class raised each week for 8 weeks. Which chart is BEST?', nl: 'Je wilt laten zien hoeveel geld je klas elk week ophaalde gedurende 8 weken. Welke grafiek is het BESTE?' },
          options: [
            { en: 'Line graph — tracking over time', nl: 'Lijndiagram — bijhouden in de tijd' },
            { en: 'Pie chart — showing percentages', nl: 'Cirkeldiagram — percentages laten zien' },
            { en: 'Pictograph — using pictures', nl: 'Pictogram — afbeeldingen gebruiken' },
            { en: 'No chart needed', nl: 'Geen grafiek nodig' }
          ],
          correct: 0,
          explanation: { en: 'Weekly fundraising over 8 weeks = changes over TIME. A line graph shows the trend perfectly — is money increasing each week?', nl: 'Wekelijkse fondsenwerving over 8 weken = veranderingen in de TIJD. Een lijndiagram toont de trend perfect — neemt het geld elke week toe?' }
        }
      ],
      practice: {
        en: 'Think of 3 different data questions you could ask. For each one, decide which type of chart would work best and explain why!',
        nl: 'Denk aan 3 verschillende gegevensvragen die je zou kunnen stellen. Beslis voor elke welk type grafiek het beste werkt en leg uit waarom!'
      }
    },

    // Lesson 8: Create Your Own
    {
      id: 'create-your-own',
      title: { en: 'Create Your Own Analysis!', nl: 'Maak Je Eigen Analyse!' },
      icon: '🏆',
      duration: '25 min',
      concept: {
        en: `Congratulations! You've learned all the key skills. Now it's time to put it all together!

**Your Mission: Data Detective 🔍**

You're going to:
1. **Choose a question** that interests you
2. **Collect real data** by surveying people
3. **Organize** your data with tally marks
4. **Create a chart** using the right type
5. **Analyze** — what patterns do you see?
6. **Present** your findings!

**Analysis Tips — Ask Yourself:**
- What is the **biggest** number? What is the **smallest**?
- Are there any **surprises**? Did something unexpected happen?
- What **pattern** or **trend** do I see?
- If I could ask **one more question**, what would it be?
- What **decision** could I make based on this data?

**Example Analysis:**
"My class's favorite food survey shows that pizza is #1 with 45%, followed by tacos at 30%. This means if we order class pizza, most kids will be happy! But 55% of kids prefer other foods, so maybe we should order TWO things."

**Remember the golden rule of data analysis:**
📊 **Every chart tells a story. Your job is to find it!**`,
        nl: `Gefeliciteerd! Je hebt alle belangrijke vaardigheden geleerd. Nu is het tijd om alles samen te brengen!

**Je Missie: Gegevens Detective 🔍**

Je gaat:
1. **Kies een vraag** die je interessant vindt
2. **Verzamel echte gegevens** door mensen te ondervragen
3. **Organiseer** je gegevens met streepjestelling
4. **Maak een grafiek** met het juiste type
5. **Analyseer** — welke patronen zie je?
6. **Presenteer** je bevindingen!

**Analysetips — Stel Jezelf:**
- Wat is het **grootste** getal? Wat is het **kleinste**?
- Zijn er **verrassingen**? Is er iets onverwachts gebeurd?
- Welk **patroon** of **trend** zie ik?
- Als ik **nog één vraag** kon stellen, wat zou die zijn?
- Welke **beslissing** kan ik nemen op basis van deze gegevens?

**Voorbeeld Analyse:**
"Het favoriete eten van mijn klas toont dat pizza #1 is met 45%, gevolgd door taco's op 30%. Dit betekent dat als we pizza bestellen, de meeste kinderen blij zullen zijn! Maar 55% van de kinderen vindt andere dingen lekker, dus misschien moeten we TWEE dingen bestellen."

**Onthoud de gouden regel van gegevensanalyse:**
📊 **Elk grafiek vertelt een verhaal. Jouw taak is om het te vinden!**`
      },
      example: {
        type: 'analysis',
        en: {
          title: 'Sample Analysis: Our Class Weather Log',
          data: 'We recorded the weather for 3 weeks (21 days):',
          results: [
            { type: 'bar', label: 'Sunny', count: 10, color: '#FDCB6E' },
            { type: 'bar', label: 'Cloudy', count: 7, color: '#B2BEC3' },
            { type: 'bar', label: 'Rainy', count: 4, color: '#74B9FF' }
          ],
          insights: [
            '☀️ Most days were sunny (48%) — great for outdoor activities!',
            '🌧️ Only 4 rainy days — we should plan outdoor events on sunny days',
            '☁️ Cloudy days often preceded rain — could be a prediction tool!'
          ]
        },
        nl: {
          title: 'Voorbeeld Analyse: Ons Weerlogboek',
          data: 'We registreerden het weer gedurende 3 weken (21 dagen):',
          results: [
            { type: 'bar', label: 'Zonnig', count: 10, color: '#FDCB6E' },
            { type: 'bar', label: 'Bewolkt', count: 7, color: '#B2BEC3' },
            { type: 'bar', label: 'Regenachtig', count: 4, color: '#74B9FF' }
          ],
          insights: [
            '☀️ De meeste dagen waren zonnig (48%) — geweldig voor buitenactiviteiten!',
            '🌧️ Slechts 4 regenachtige dagen — we moeten buitenactiviteiten plannen op zonnige dagen',
            '☁️ Bewolkte dagen gingen vaak vooraf aan regen — een voorspellingstool!'
          ]
        }
      },
      quiz: [
        {
          question: { en: 'What\'s the LAST step in the data detective process?', nl: 'Wat is de LAATSTE stap in het gegevensdetectieproces?' },
          options: [
            { en: 'Present and share your findings', nl: 'Presenteer en deel je bevindingen' },
            { en: 'Collect the data', nl: 'Verzamel de gegevens' },
            { en: 'Choose a chart type', nl: 'Kies een grafiektype' },
            { en: 'Write a title', nl: 'Schrijf een titel' }
          ],
          correct: 0,
          explanation: { en: 'The final step is sharing what you learned! Data is most powerful when you tell others about it.', nl: 'De laatste stap is delen wat je hebt geleerd! Gegevens zijn het krachtigst wanneer je er anderen over vertelt.' }
        }
      ],
      practice: {
        en: 'You\'re a Data Detective! Choose a question, collect data from your family or friends, create a chart, and write a 3-sentence analysis of what you found!',
        nl: 'Je bent een Gegevensdetective! Kies een vraag, verzamel gegevens van je gezin of vrienden, maak een grafiek, en schrijf een analyse van 3 zinnen over wat je hebt gevonden!'
      }
    },

    // Lesson 9: What-If Explorer — Interactive Data Sandbox
    {
      id: 'whatif-explorer',
      title: { en: 'What-If Explorer — Change the Data, See the Trend', nl: 'Wat-If Verkenner — Verander de Gegevens, Zie de Trend' },
      icon: '🔬',
      duration: '20 min',
      concept: {
        en: `**What happens when you remove data points from a chart?** That's what a data scientist asks every day!

**The What-If Explorer** lets you play with real data:
- You'll see a **scatter plot** — dots showing the relationship between two things
- Drag a **slider** to exclude outlier data points
- Watch the **line of best fit** (the trend line) change in real-time!
- See how the **R² value** (how well the line fits) changes

**Why this matters:**
- Real data is messy — it has outliers (extreme values)
- Sometimes one weird data point can change the whole story
- Data scientists must decide: keep the outlier or remove it?

**Key concept: Line of Best Fit**
The line of best fit is a straight line that best represents the trend in your data. When you remove outliers:
- The line might **shift position** (move up or down)
- The **slope** might change (steeper or flatter)
- The **R² value** tells you how well the line matches — higher is better!

**Example insight:**
"Up to 2 hours of gaming, exam scores stay high (85-95%). Beyond 2 hours, scores drop linearly to ~50% at 6 hours."`,
        nl: `**Wat gebeurt er als je gegevenspunten uit een grafiek verwijdert?** Dat is wat een datawetenschapper elke dag vraagt!

**De Wat-If Verkenner** laat je spelen met echte gegevens:
- Je ziet een **spreidingsdiagram** — punten die de relatie tussen twee dingen tonen
- Sleep een **schuifregelaar** om uitschieters te verwijderen
- Kijk hoe de **lijn van de beste passing** (de trendlijn) in realtime verandert!
- Zie hoe de **R²-waarde** (hoe goed de lijn past) verandert

**Waarom dit belangrijk is:**
- Echte gegevens zijn rommelig — het heeft uitschieters (extreme waarden)
- Soms kan één vreemd gegeenspunt het hele verhaal veranderen
- Datawetenschappers moeten beslissen: de uitschieter behouden of verwijderen?

**Belangrijk concept: Lijn van de Beste Passing**
De lijn van de beste passing is een rechte lijn die het beste de trend in je gegevens weergeeft. Wanneer je uitschieters verwijdert:
- De lijn kan **van positie veranderen** (omhoog of omlaag)
- De **helling** kan veranderen (steiler of vlakker)
- De **R²-waarde** vertelt je hoe goed de lijn past — hoger is beter!`,
      },
      example: {
        type: 'whatif',
        en: {
          title: 'Video Game Hours vs. Exam Scores',
          subtitle: 'Drag the slider to remove data points and watch the trend change!',
          datasetId: 'gaming-scores',
        },
        nl: {
          title: 'Game-uren vs. Toetsresultaten',
          subtitle: 'Sleep de schuifregelaar om gegeenspunten te verwijderen en zie de trend veranderen!',
          datasetId: 'gaming-scores',
        },
      },
      quiz: [
        {
          question: { en: 'What happens to the line of best fit when you remove a high outlier?', nl: 'Wat gebeurt er met de lijn van de beste passing wanneer je een hoge uitschieter verwijdert?' },
          options: [
            { en: 'The line shifts and the R² may improve', nl: 'De lijn verschuift en de R² kan verbeteren' },
            { en: 'Nothing changes at all', nl: 'Er verandert niets' },
            { en: 'The line disappears', nl: 'De lijn verdwijnt' },
            { en: 'The chart turns into a bar chart', nl: 'De grafiek verandert in een balkdiagram' },
          ],
          correct: 0,
          explanation: { en: 'Removing an outlier changes the math! The line repositions to better fit the remaining points, and R² (goodness of fit) often improves.', nl: 'Het verwijderen van een uitschieter verandert de wiskunde! De lijn herpositioneert zich om beter bij de overgebleven punten te passen, en R² (passingkwaliteit) verbetert vaak.' }
        },
        {
          question: { en: 'What does R² tell you about a trend line?', nl: 'Wat vertelt R² je over een trendlijn?' },
          options: [
            { en: 'How well the line fits the data points', nl: 'Hoe goed de lijn bij de gegevenspunten past' },
            { en: 'How many data points exist', nl: 'Hoeveel gegevenspunten er zijn' },
            { en: 'The exact slope of the line', nl: 'De exacte helling van de lijn' },
            { en: 'Whether the data is fake', nl: 'Of de gegevens nep zijn' },
          ],
          correct: 0,
          explanation: { en: 'R² (R-squared) measures how closely the data points follow the trend line. R² = 1.0 means perfect fit; R² = 0 means no pattern at all.', nl: 'R² (R-kwadraat) meet hoe goed de gegeenspunten de trendlijn volgen. R² = 1.0 betekent perfecte passing; R² = 0 betekent geen patroon.' }
        }
      ],
      practice: {
        en: 'Think of something that might have outliers — like test scores in your class. What would happen to the average if the highest and lowest scores were removed?',
        nl: 'Denk aan iets dat uitschieters kan hebben — zoals toetscijfers in je klas. Wat zou er met het gemiddelde gebeuren als de hoogste en laagste cijfers werden verwijderd?'
      }
    },

    // Lesson 10: Spot Deception — Misleading Graphs
    {
      id: 'spot-deception',
      title: { en: 'Spot Deception — How Graphs Lie', nl: 'Spot de List — Hoe Grafieken Liegen' },
      icon: '🚩',
      duration: '25 min',
      concept: {
        en: `**Graphs can be used to LIE.** Not every chart you see is honest — companies, news outlets, and politicians use tricks to manipulate how data looks.

**The 6 Most Common Graph Lies:**

**1. The Truncated Y-Axis** 📊
The Y-axis doesn't start at zero. A tiny change looks HUGE.
*Example: Sales dropping from $48,000 to $46,500 (3% drop) looks like a crash when Y starts at $45,000.*

**2. Cherry-Picked Timeframes** 🍒
Only showing a tiny window of time that supports your story.
*Example: Showing 3 bad days of stock prices while hiding a 6-month uptrend.*

**3. Dual-Axis Manipulation** 📈📉
Two Y-axes with different scales make unrelated trends look correlated.
*Example: "Smartphone use causes exam failures!" — two lines seem to match, but the scales are rigged.*

**4. Missing Baseline** 📏
Starting from an artificially low number to exaggerate growth.
*Example: "200% boost!" measured from 1 unit to 3 units — the real values are 45 vs 47.*

**5. 3D Pie Distortion** 🥧
3D perspective makes front slices look bigger than back slices.
*Example: 28% looks way bigger than 25% because it's in the front of a 3D pie.*

**6. Percentage vs. Absolute** 🔢
Showing percentages while hiding the real numbers.
*Example: "App X grew 500%!" (2 to 12 users) vs "App Y grew 50%!" (10,000 to 15,000).*

**How to protect yourself:**
- Always check if the Y-axis starts at zero
- Look at the FULL timeline, not just a snippet
- Check if two axes use different scales
- Ask: "What are the REAL numbers behind these percentages?"`,
        nl: `**Grafieken kunnen worden gebruikt om te LIEGEN.** Niet elke grafiek die je ziet is eerlijk — bedrijven, nieuwsmedia en politici gebruiken trucjes om de gegevens er anders uit te laten zien.

**De 6 Meest Voorkomende Grafiek-Lügen:**

**1. De Afgeknipte Y-as** 📊
De Y-as begint niet bij nul. Een kleine verandering lijkt GROOT.
*Voorbeeld: Verkopen dalen van $48.000 naar $46.500 (3% daling) lijkt een crash als Y bij $45.000 begint.*

**2. Uitgekozen Tijdvensters** 🍒
Alleen een klein tijdsvenster tonen dat je verhaal ondersteunt.
*Voorbeeld: 3 slechte dagen van aandelen tonen terwijl een 6-maanden stijging wordt verborgen.*

**3. Dual-As Misleiding** 📈📉
Twee Y-assen met verschillende schalen maken ongerelateerde trends gecorreleerd.
*Voorbeeld: "Smartphonegebruik veroorzaakt schooldaling!" — twee lijnen lijken te matchen, maar de schalen zijn gemanipuleerd.*

**4. Ontbrekende Basislijn** 📏
Beginnen vanaf een kunstmatig laag getal om groei te overdrijven.
*Voorbeeld: "200% boost!" gemeten van 1 eenheid naar 3 eenheden — de echte waarden zijn 45 vs 47.*

**5. 3D Taart Vervorming** 🥧
3D-perspectief maakt voorste stukken groter dan achterste stukken.
*Voorbeeld: 28% lijkt veel groter dan 25% omdat het vooraan staat in een 3D-taart.*

**6. Percentage vs. Absoluut** 🔢
Percentages tonen terwijl de echte getallen worden verborgen.
*Voorbeeld: "App X groeide 500%!" (2 naar 12 gebruikers) vs "App Y groeide 50%!" (10.000 naar 15.000).*

**Hoe je jezelf beschermt:**
- Controleer altijd of de Y-as bij nul begint
- Kijk naar de VOLLEDIGE tijdlijn, niet alleen een片段
- Controleer of twee assen verschillende schalen gebruiken
- Vraag: "Wat zijn de ECHTE getallen achter deze percentages?"`,
      },
      example: {
        type: 'misleading',
        en: {
          title: 'Spot the Deception!',
          subtitle: 'One of these headlines is using a graph trick. Can you find it?',
          datasetId: 'truncated-y-axis',
        },
        nl: {
          title: 'Spot de List!',
          subtitle: 'Eén van deze koppen gebruikt een grafiektruc. Kun je die vinden?',
          datasetId: 'truncated-y-axis',
        },
      },
      quiz: [
        {
          question: { en: 'A graph shows sales dropping from $48,000 to $46,500 but the Y-axis starts at $45,000. What\'s the trick?', nl: 'Een grafiek toont verkopen dalen van $48.000 naar $46.500 maar de Y-as begint bij $45.000. Wat is de truc?' },
          options: [
            { en: 'The truncated Y-axis makes a 3% drop look like a crash', nl: 'De afgeknipte Y-as maakt een 3% daling eruit zien als een crash' },
            { en: 'The colors are wrong', nl: 'De kleuren zijn verkeerd' },
            { en: 'The labels are misspelled', nl: 'De labels zijn verkeerd gespeld' },
            { en: 'Nothing — the graph is fine', nl: 'Niets — de grafiek is prima' },
          ],
          correct: 0,
          explanation: { en: 'When the Y-axis starts at $45,000 instead of $0, a small $1,500 drop (3%) looks like it goes from top to bottom — massively deceptive!', nl: 'Wanneer de Y-as bij $45.000 begint in plaats van $0, lijkt een kleine daling van $1.500 (3%) van boven naar onder te gaan — enorm misleidend!' }
        },
        {
          question: { en: 'Why is a 3D pie chart often misleading?', nl: 'Waarom is een 3D-cirkeldiagram vaak misleidend?' },
          options: [
            { en: 'The 3D perspective makes front slices look bigger', nl: 'Het 3D-perspectief maakt voorste stukken groter' },
            { en: '3D charts always use wrong colors', nl: '3D-grafieken gebruiken altijd verkeerde kleuren' },
            { en: 'You can\'t read numbers on a 3D chart', nl: 'Je kunt geen getallen lezen op een 3D-grafiek' },
            { en: '3D charts are always accurate', nl: '3D-grafieken zijn altijd nauwkeurig' },
          ],
          correct: 0,
          explanation: { en: 'The 3D tilt pushes front slices forward and compresses back slices, distorting proportions. A 28% slice in front can look twice as big as a 25% slice in back!', nl: 'De 3D-tilt duwt voorste stukken naar voren en comprimeert achterste stukken, waardoor verhoudingen vervormd raken. Een 28%-stuk vooraan kan twee keer zo groot lijken als een 25%-stuk achteraan!' }
        }
      ],
      practice: {
        en: 'Find a news article with a graph. Check: Does the Y-axis start at zero? Is the full timeline shown? Are the axes labeled clearly? Report back what you find!',
        nl: 'Zoek een nieuwsartikel met een grafiek. Controleer: Begint de Y-as bij nul? Wordt de volledige tijdlijn getoond? Zijn de assen duidelijk gelabeld? Rapporteer wat je vindt!'
      }
    },

    // Lesson 11: AI Debate — Debug the Machine
    {
      id: 'ai-debate',
      title: { en: 'AI Debate — Debug the Machine', nl: 'AI Debat — Debug de Machine' },
      icon: '🤖',
      duration: '25 min',
      concept: {
        en: `**Can you find mistakes in an AI's analysis?** That's exactly what data scientists do — they question everything, even the smartest computers!

**How AI Debate Mode works:**
1. You see a **dataset** and a **chart**
2. An AI writes an **analysis** of the data
3. But the AI made **intentional mistakes** — logical flaws!
4. Your job: **find all the flaws** and prove the AI wrong!

**Common AI Logic Flaws:**

**1. Correlation ≠ Causation** 🔗
Just because two things move together doesn't mean one causes the other.
*Example: "Ice cream sales and drowning rates both go up in summer!" — heat causes both, not ice cream causing drowning.*

**2. Overgeneralization** 🌍
Using words like "always", "never", "guarantees" when data only shows trends.
*Example: "Students who study more ALWAYS get higher scores" — the data shows a trend, not a guarantee.*

**3. Ignoring Diminishing Returns** 📉
Not noticing that adding more of something has less effect over time.
*Example: "Study 10 hours for the best score!" — going from 8 to 10 hours only adds 2 points, while 1 to 3 hours adds 15.*

**4. Missing Sample Size** 📋
Not mentioning how many people were surveyed — 10 or 10,000?
*Example: "35% prefer TikTok!" — but was this survey of 20 people or 20,000?*

**5. Ignoring Confounding Variables** 🎛️
Forgetting that a third factor might be the real cause.
*Example: "More phone use causes lower grades" — but maybe students who struggle use phones more to cope.*

**Why this matters:**
AI is powerful but not perfect. The best data analysts are the ones who can **think critically** and find what the AI missed!`,
        nl: `**Kun je fouten vinden in een AI-analyse?** Dat is precies wat datawetenschappers doen — ze vragen alles in twijfel, zelfs de slimste computers!

**Hoe AI Debat Modus werkt:**
1. Je ziet een **gegevensset** en een **grafiek**
2. Een AI schrijft een **analyse** van de gegevens
3. Maar de AI heeft **opzettelijke fouten** gemaakt — logische gebreken!
4. Jouw taak: **vind alle gebreken** en bewijs dat de AI ongelijk heeft!

**Veelvoorkomende AI-Logische Gebreken:**

**1. Correlatie ≠ Oorzaak-gevolg** 🔗
Als twee dingen samen bewegen, betekent niet dat de ene de andere veroorzaakt.
*Voorbeeld: "IJsjesverkoop en verdrinkingen stijgen beide in de zomer!" — hitte veroorzaakt beide, niet ijsjes die verdrinking veroorzaken.*

**2. Overgeneralisatie** 🌍
Woorden gebruiken zoals "altijd", "nooit", "garanties" wanneer gegevens alleen trends tonen.
*Voorbeeld: "Studenten die meer studeren krijgen ALTIJD hogere cijfers" — de gegevens tonen een trend, geen garantie.*

**3. Dalende Opbrengsten Negeren** 📉
Niet opmerken dat meer van iets steeds minder effect heeft.
*Voorbeeld: "Studeer 10 uur voor het beste cijfer!" — van 8 naar 10 uur levert slechts 2 punten op, terwijl 1 naar 3 uur 15 punten oplevert.*

**4. Steekproefomvang Negeren** 📋
Niet vermelden hoeveel mensen werden ondervraagd — 10 of 10.000?
*Voorbeeld: "35% geeft de voorkeur aan TikTok!" — maar was dit onderzoek van 20 of 20.000 mensen?*

**5. Verstorende Variabelen Negeren** 🎛️
Vergeten dat een derde factor de echte oorzaak kan zijn.
*Voorbeeld: "Meer telefoongebruik veroorzaakt lagere cijfers" — maar misschien gebruiken studenten die het moeilijk hebben meer telefoon om ermee om te gaan.*

**Waarom dit belangrijk is:**
AI is krachtig maar niet perfect. De beste data-analisten zijn degenen die **kritisch kunnen denken** en vinden wat de AI heeft gemist!`,
      },
      example: {
        type: 'debate',
        en: {
          title: 'Find the Flaws in the AI\'s Analysis',
          subtitle: 'The AI analyzed this chart but made some logical errors. Can you spot them all?',
          datasetId: 'debate-scatter',
        },
        nl: {
          title: 'Vind de Fouten in de AI-Analyse',
          subtitle: 'De AI heeft deze grafiek geanalyseerd maar logische fouten gemaakt. Kun je ze allemaal vinden?',
          datasetId: 'debate-scatter',
        },
      },
      quiz: [
        {
          question: { en: 'An AI says: "Countries with more chocolate consumption win more Nobel Prizes, so chocolate makes you smarter." What\'s the flaw?', nl: 'Een AI zegt: "Landen met meer chocoladeconsumptie winnen meer Nobelprijzen, dus chocolade maakt je slimmer." Wat is het gebrek?' },
          options: [
            { en: 'Correlation doesn\'t prove causation — richer countries buy more chocolate AND fund more research', nl: 'Correlatie bewijst geen oorzaak-gevolg — rijkere landen kopen meer chocolade EN financieren meer onderzoek' },
            { en: 'The data is wrong', nl: 'De gegevens zijn fout' },
            { en: 'There is no flaw', nl: 'Er is geen gebrek' },
            { en: 'Chocolate is actually bad for you', nl: 'Chocolade is eigenlijk slecht voor je' },
          ],
          correct: 0,
          explanation: { en: 'This is a classic correlation ≠ causation trap! Wealthier countries can afford more chocolate AND invest more in science. Wealth is the confounding variable.', nl: 'Dit is een klassieke correlatie ≠ oorzaak-gevolg valkuil! Rijkere landen kunnen meer chocolade betalen EN meer in wetenschap investeren. Welvaart is de verstorende variabele.' }
        },
        {
          question: { en: 'An AI says: "Students who use StudyApp get 90% scores — it ALWAYS works!" What words should raise red flags?', nl: 'Een AI zegt: "Studenten die StudyApp gebruiken krijgen 90% scores — het werkt ALTIJD!" Welke woorden moeten een waarschuwingssignaal zijn?' },
          options: [
            { en: '"ALWAYS" — data shows trends, not guarantees', nl: '"ALTIJD" — gegevens tonen trends, geen garanties' },
            { en: '"Students" — the word is too vague', nl: '"Studenten" — het woord is te vaag' },
            { en: '"90%" — this is a low score', nl: '"90%" — dit is een laag cijfer' },
            { en: 'Nothing is wrong', nl: 'Er is niets mis' },
          ],
          correct: 0,
          explanation: { en: 'The word "ALWAYS" is a huge red flag. Real data shows trends with variation — some students might score 95%, others 70%. No result is guaranteed for everyone!', nl: 'Het woord "ALTIJD" is een enorm waarschuwingssignaal. Echte gegevens tonen trends met variatie — sommige studenten scoren mogelijk 95%, anderen 70%. Geen resultaat is gegarandeerd voor iedereen!' }
        }
      ],
      practice: {
        en: 'Ask Foxy to analyze a simple dataset. Then try to find ONE logical flaw in the AI\'s response. Can you catch the machine making a mistake?',
        nl: 'Vraag Foxy om een eenvoudige gegevensset te analyseren. Probeer dan EEN logisch gebrek te vinden in het AI-antwoord. Kun je de machine een fout zien maken?'
      }
    }
  ]
}

// ── Built-in Path: Fractions & Decimals ──

export const FRACTIONS_PATH = {
  id: 'fractions-decimals',
  icon: '🔢',
  category: 'mathematics',
  difficulty: 'beginner',
  estimatedHours: 5,
  title: { en: 'Fractions & Decimals', nl: 'Breuken & Decimale Getallen' },
  subtitle: { en: 'Master the world of parts, pieces, and percentages!', nl: 'Beheers de wereld van delen, stukken en percentages!' },
  description: {
    en: 'A step-by-step journey to understand fractions and decimals — from pizza slices to real-world math!',
    nl: 'Een stap-voor-stap reis om breuken en decimale getallen te begrijpen — van pizzapunten tot echte wiskunde!'
  },
  prerequisites: [],
  mindMap: {
    nodes: ['Fractions', 'Parts of a Whole', 'Equivalent Fractions', 'Adding Fractions', 'Decimals', 'Percentages', 'Real-World Math'],
    connections: [
      ['Fractions', 'Parts of a Whole'],
      ['Fractions', 'Equivalent Fractions'],
      ['Fractions', 'Adding Fractions'],
      ['Fractions', 'Decimals'],
      ['Decimals', 'Percentages'],
      ['Percentages', 'Real-World Math']
    ]
  },
  lessons: [
    {
      id: 'what-are-fractions',
      title: { en: 'What Are Fractions?', nl: 'Wat Zijn Breuken?' },
      icon: '🍕',
      duration: '15 min',
      concept: {
        en: `**Fractions** are just pieces of a whole thing!

Imagine you have a **pizza** cut into 8 equal slices. If you eat **3 slices**, you ate **3/8** of the pizza.

**The top number (numerator)** = how many pieces you have
**The bottom number (denominator)** = how many equal pieces the whole is divided into

So **3/8** means: 3 pieces out of 8 total pieces.

**More examples:**
- 🍫 A chocolate bar with 10 squares, you ate 2 = **2/10**
- 🎂 A cake cut in 4 pieces, you got 1 = **1/4**
- 🥧 A pie with 6 slices, all gone = **6/6 = 1 whole!**

**Key insight:** When numerator = denominator, you have the WHOLE thing!`,
        nl: `**Breuken** zijn gewoon stukken van een heel ding!

Stel je voor dat je een **pizza** hebt die in 8 gelijke stukken is gesneden. Als je **3 stukken** eet, at je **3/8** van de pizza.

**Het bovenste getal (teller)** = hoeveel stukjes je hebt
**Het onderste getal (noemer)** = in hoeveel gelijke stukken het geheel is verdeeld

Dus **3/8** betekent: 3 stukjes van de 8 totale stukjes.

**Meer voorbeelden:**
- 🍫 Een chocoladereep met 10 blokjes, je at er 2 = **2/10**
- 🎂 Een cake in 4 stukken, jij kreeg er 1 = **1/4**
- 🥧 Een taart met 6 stukken, alles op = **6/6 = 1 geheel!**

**Belangrijk inzicht:** When teller = noemer, heb je het HELE ding!`
      },
      example: {
        type: 'fraction-visual',
        en: {
          title: 'Pizza Fractions',
          parts: 8,
          filled: 3,
          label: '3/8 of the pizza'
        },
        nl: {
          title: 'Pizza Breuken',
          parts: 8,
          filled: 3,
          label: '3/8 van de pizza'
        }
      },
      quiz: [
        {
          question: { en: 'A chocolate bar has 12 pieces. You eat 5. What fraction did you eat?', nl: 'Een chocoladereep heeft 12 stukjes. Je eet er 5. Welke breuk at je?' },
          options: ['5/12', '12/5', '7/12', '5/7'],
          correct: 0,
          explanation: { en: 'You ate 5 pieces out of 12 total = 5/12. Numerator (5) = what you have. Denominator (12) = total pieces.', nl: 'Je at 5 stukjes van de 12 totale = 5/12. Teller (5) = wat je hebt. Noemer (12) = totale stukjes.' }
        }
      ],
      practice: { en: 'Cut a piece of paper into 4 equal parts. Shade 1 part. That\'s 1/4! Try making 2/4, 3/4, and 4/4.', nl: 'Knip een stuk papier in 4 gelijke delen. Kleur 1 deel. Dat is 1/4! Probeer 2/4, 3/4, en 4/4 te maken.' }
    },
    {
      id: 'equivalent-fractions',
      title: { en: 'Equivalent Fractions — Same Value!', nl: 'Gelijke Breuken — Zelfde Waarde!' },
      icon: '⚖️',
      duration: '15 min',
      concept: {
        en: `**Equivalent fractions** look different but have the SAME value!

Think of it this way:
- **1/2** of a pizza (cut in 2) = **2/4** of a pizza (cut in 4) = **4/8** (cut in 8)

They're all the same amount of pizza!

**How to find equivalent fractions:**
Multiply (or divide) BOTH numbers by the same amount:
- 1/2 × 2/2 = **2/4**
- 1/2 × 3/3 = **3/6**
- 1/2 × 4/4 = **4/8**

**Simplifying fractions:**
Divide both numbers by their biggest common factor:
- 4/8 ÷ 4/4 = **1/2**
- 6/12 ÷ 6/6 = **1/2**
- 10/20 ÷ 10/10 = **1/2**

**All of these = 1/2!**`,
        nl: `**Gelijke breuken** zien er anders uit maar hebben dezelfde waarde!

Denk er zo over na:
- **1/2** van een pizza (in 2 gesneden) = **2/4** van een pizza (in 4) = **4/8** (in 8)

Het zijn allemaal dezelfde hoeveelheid pizza!

**Hoe vind je gelijke breuken?**
Vermenigvuldig (of deel) BEIDE getallen met dezelfde hoeveelheid:
- 1/2 × 2/2 = **2/4**
- 1/2 × 3/3 = **3/6**
- 1/2 × 4/4 = **4/8**

**Breuken vereenvoudigen:**
Deel beide getallen door hun grootste gemeenschappelijke factor:
- 4/8 ÷ 4/4 = **1/2**
- 6/12 ÷ 6/6 = **1/2**

**Allemaal = 1/2!**`
      },
      example: {
        type: 'fraction-visual',
        en: { title: '1/2 = 2/4 = 4/8', parts: 8, filled: 4, label: 'All equal to 1/2!' },
        nl: { title: '1/2 = 2/4 = 4/8', parts: 8, filled: 4, label: 'Allemaal gelijk aan 1/2!' }
      },
      quiz: [
        {
          question: { en: 'Which fraction is equivalent to 2/4?', nl: 'Welke breuk is gelijk aan 2/4?' },
          options: ['1/2', '3/4', '2/8', '4/2'],
          correct: 0,
          explanation: { en: '2/4 simplified = divide both by 2 → 1/2. They represent the same amount!', nl: '2/4 vereenvoudigd = deel beide door 2 → 1/2. Ze vertegenwoordigen dezelfde hoeveelheid!' }
        }
      ],
      practice: { en: 'Draw the same rectangle 3 times. Divide one into 2 parts (shade 1), one into 4 parts (shade 2), one into 8 parts (shade 4). See? They\'re all the same!', nl: 'Teken dezelfde rechthoek 3 keer. Deel er een in 2 delen (kleur 1), er een in 4 delen (kleur 2), er een in 8 delen (kleur 4). Zie je? Ze zijn allemaal hetzelfde!' }
    },
    {
      id: 'decimals-intro',
      title: { en: 'Decimals — Fractions in Disguise!', nl: 'Decimale Getallen — Breuken in Vermomming!' },
      icon: '🔢',
      duration: '15 min',
      concept: {
        en: `**Decimals** are just another way to write fractions — using a dot!

**The decimal point** separates whole numbers from parts:
- **0.5** = half (1/2)
- **0.25** = a quarter (1/4)
- **0.75** = three quarters (3/4)
- **0.1** = one tenth (1/10)

**The place values after the dot:**
- First position: **tenths** (1/10)
- Second position: **hundredths** (1/100)
- Third position: **thousandths** (1/1000)

**Key conversions:**
- 1/2 = 0.5
- 1/4 = 0.25
- 3/4 = 0.75
- 1/10 = 0.1
- 1/5 = 0.2

**Decimals are everywhere in real life:**
- Money: €2.50 (2 euros and 50 cents)
- Height: 1.45 meters
- Time: 3.5 hours (3 and a half hours)`,
        nl: `**Decimale getallen** zijn gewoon een andere manier om breuken te schrijven — met een punt!

**Het decimale punt** scheidt hele getallen van delen:
- **0,5** = helft (1/2)
- **0,25** = een kwart (1/4)
- **0,75** = drie kwart (3/4)
- **0,1** = een tiende (1/10)

**De plaatsen na het punt:**
- Eerste positie: **tienden** (1/10)
- Tweede positie: **honderdsten** (1/100)
- Derde positie: **duizendsten** (1/1000)

**Belangrijke omzettingen:**
- 1/2 = 0,5
- 1/4 = 0,25
- 3/4 = 0,75

**Decimale getallen zijn overal in het echte leven:**
- Geld: €2,50
- Lengte: 1,45 meter
- Tijd: 3,5 uur`
      },
      example: {
        type: 'decimal-grid',
        en: { title: '0.75 = 75/100', grid: 10, filled: 7, partial: 5, label: '75 out of 100 squares' },
        nl: { title: '0,75 = 75/100', grid: 10, filled: 7, partial: 5, label: '75 van de 100 vakjes' }
      },
      quiz: [
        {
          question: { en: 'What is 3/4 as a decimal?', nl: 'Wat is 3/4 als decimaal getal?' },
          options: ['0.75', '0.34', '0.25', '3.4'],
          correct: 0,
          explanation: { en: '3/4 = 0.75. Think: 3 out of 4 equal parts = 75 hundredths = 0.75!', nl: '3/4 = 0,75. Denk: 3 van de 4 gelijke delen = 75 honderdsten = 0,75!' }
        }
      ],
      practice: { en: 'Look at prices in a shop. Write each one as a fraction AND a decimal. Example: €1.25 = 125/100 = 1 1/4', nl: 'Kijk naar prijzen in een winkel. Schrijf elke als een breuk EN een decimaal. Voorbeeld: €1,25 = 125/100 = 1 1/4' }
    },
    {
      id: 'percentages',
      title: { en: 'Percentages — Out of 100', nl: 'Percentages — Van de 100' },
      icon: '%',
      duration: '15 min',
      concept: {
        en: `A **percentage** is just a fraction with 100 as the bottom number!

**Percent = "per cent" = "out of 100"**

- **50%** = 50/100 = 1/2 (half!)
- **25%** = 25/100 = 1/4 (a quarter!)
- **100%** = 100/100 = 1 (the whole thing!)
- **0%** = 0/100 = nothing!

**Easy conversions:**
- 1/2 = 50%
- 1/4 = 25%
- 3/4 = 75%
- 1/10 = 10%
- 1/5 = 20%

**Percentages in real life:**
- 🏪 "50% OFF!" means half price
- 📊 "85% of students passed" means 85 out of 100 students
- 🌧️ "30% chance of rain" means 30 out of 100 chance

**Pro tip:** Percentages, decimals, and fractions are all the same number in different costumes!`,
        nl: `Een **percentage** is gewoon een breuk met 100 als onderste getal!

**Procent = "per cent" = "van de 100"**

- **50%** = 50/100 = 1/2 (helft!)
- **25%** = 25/100 = 1/4 (een kwart!)
- **100%** = 100/100 = 1 (het hele ding!)
- **0%** = 0/100 = niets!

**Eenvoudige omzettingen:**
- 1/2 = 50%
- 1/4 = 25%
- 3/4 = 75%
- 1/10 = 10%
- 1/5 = 20%

**Percentages in het echte leven:**
- 🏪 "50% KORTING!" betekent halve prijs
- 📊 "85% van de leerlingen is geslaagd"
- 🌧️ "30% kans op regen" betekent 30 van de 100 kans

**Pro-tip:** Percentages, decimale getallen en breuken zijn allemaal hetzelfde getal in verschillende vermommingen!`
      },
      example: {
        type: 'percentage-grid',
        en: { title: '75% = 0.75 = 3/4', total: 100, filled: 75, label: '75 out of 100 squares filled' },
        nl: { title: '75% = 0,75 = 3/4', total: 100, filled: 75, label: '75 van de 100 vakjes gevuld' }
      },
      quiz: [
        {
          question: { en: 'A store has a 25% discount. As a fraction, what is 25%?', nl: 'Een winkel heeft 25% korting. Als breuk, wat is 25%?' },
          options: ['1/4', '2/5', '1/2', '1/5'],
          correct: 0,
          explanation: { en: '25% = 25/100 = 1/4. A 25% discount means you pay 3/4 of the price!', nl: '25% = 25/100 = 1/4. Een korting van 25% betekent dat je 3/4 van de prijs betaalt!' }
        }
      ],
      practice: { en: 'Check your test paper or a recipe. Find 3 examples of fractions or percentages and convert them to the other form!', nl: 'Controleer je proefwerk of een recept. Vind 3 voorbeelden van breuken of percentages en converteer ze naar de andere vorm!' }
    }
  ]
}

// ── Built-in Path: Physics Deep Dive ──

export const PHYSICS_PATH = {
  id: 'physics-deep-dive',
  icon: '⚡',
  category: 'science',
  title: { en: 'Physics Deep Dive', nl: 'Natuurkunde Verdieping' },
  subtitle: { en: '4-week experiential physics academy', nl: '4-weeks ervaringsgericht natuurkunde academie' },
  description: {
    en: 'A comprehensive, hands-on physics curriculum covering movement, waves, light, and magnetism through experiments with household materials.',
    nl: 'Een uitgebreid, praktisch natuurkunde curriculum over beweging, golven, licht en magnetisme via experimenten met huishoudelijke materialen.',
  },
  prerequisites: [],
  mindMap: {
    nodes: ['Physics', 'Kinematics', 'Waves & Sound', 'Light & Optics', 'Magnetism', 'Forces', 'Experiments'],
    connections: [
      ['Physics', 'Kinematics'],
      ['Physics', 'Waves & Sound'],
      ['Physics', 'Light & Optics'],
      ['Physics', 'Magnetism'],
      ['Kinematics', 'Forces'],
      ['Waves & Sound', 'Experiments'],
      ['Light & Optics', 'Experiments'],
      ['Magnetism', 'Experiments'],
    ]
  },
  lessons: [
    // Week 1: Kinematics
    {
      id: 'week-1-kinematics',
      title: { en: 'Week 1: Movement & Forces', nl: 'Week 1: Beweging & Krachten' },
      icon: '🏃',
      duration: '7 days',
      concept: PHYSICS_WEEK1,
      example: { type: 'analysis' },
      quiz: [
        {
          question: { en: 'Why does a coin on an index card drop straight into a glass when the card is flicked?', nl: 'Waarom valt een munt op een indexkaart recht in een glas wanneer de kaart wordt weggeslagen?' },
          options: [
            { en: 'Inertia — the coin resists the change in motion', nl: 'Traagheid — de munt weerstaat de verandering in beweging' },
            { en: 'Gravity pulls it down', nl: 'Zwaartekracht trekt het omlaag' },
            { en: 'Air resistance slows it', nl: 'Luchtweerstand vertraagt het' },
            { en: 'Static electricity holds it', nl: 'Statische elektriciteit houdt het vast' },
          ],
          correct: 0,
          explanation: { en: 'The card moves sideways but the coin, due to inertia, stays in place. Without the card supporting it, gravity pulls it straight down into the glass.', nl: 'De kaart beweegt zijwaarts maar de munt blijft door traagheid op zijn plek. Zonder de kaart eronder trekt de zwaartekracht het recht het glas in.' }
        },
        {
          question: { en: 'A balloon rocket flies forward when air rushes backward. Which law does this demonstrate?', nl: 'Een ballonraket vliegt vooruit wanneer lucht naar achteren stroomt. Welke wet illustreert dit?' },
          options: [
            { en: 'Newton\'s Third Law — every action has an equal and opposite reaction', nl: 'Newton\'s Derde Wet — elke actie heeft een gelijke en tegengestelde reactie' },
            { en: 'Newton\'s First Law — objects at rest stay at rest', nl: 'Newton\'s Eerste Wet — objecten in rust blijven in rust' },
            { en: 'Conservation of energy', nl: 'Behoud van energie' },
            { en: 'Friction', nl: 'Wrijving' },
          ],
          correct: 0,
          explanation: { en: 'The air rushing backward is the "action," and the rocket flying forward is the "reaction." These two forces are equal in strength but opposite in direction.', nl: 'De lucht die naar achteren stroomt is de "actie," en de raket die naar voren vliegt is de "reactie." Deze twee krachten zijn even sterk maar tegengesteld van richting.' }
        },
        {
          question: { en: 'If you drop a bowling ball and a feather in a vacuum (no air), which hits the ground first?', nl: 'Als je een bowlingbal en een veer in een vacuüm (geen lucht) laat vallen, welke raakt dan als eerste de grond?' },
          options: [
            { en: 'They hit at the same time — gravity accelerates everything equally', nl: 'Ze raken tegelijk — zwaartekracht versnelt alles gelijk' },
            { en: 'The bowling ball — it\'s heavier', nl: 'De bowlingbal — hij is zwaarder' },
            { en: 'The feather — it has less air resistance', nl: 'De veer — hij heeft minder luchtweerstand' },
            { en: 'It depends on the height', nl: 'Het hangt af van de hoogte' },
          ],
          correct: 0,
          explanation: { en: 'In a vacuum, there is no air resistance. Gravity accelerates all objects at the same rate (~9.8 m/s²), so they land simultaneously. NASA proved this on the Moon!', nl: 'In een vacuüm is er geen luchtweerstand. Zwaartekracht versnelt alle objecten met hetzelfde tempo (~9,8 m/s²), dus ze landen tegelijkertijd. NASA heeft dit bewezen op de Maan!' }
        },
      ],
      practice: {
        en: 'Find 3 examples of inertia in your daily life (seatbelts, cup holders, phone cases). How does each one fight the "lazy tendency" of objects?',
        nl: 'Vind 3 voorbeelden van traagheid in je dagelijks leven (veiligheidsgordels, bekerhouders, telefoonhoesjes). Hoe vecht elk tegen de "luie neiging" van objecten?',
      }
    },

    // Week 2: Waves & Sound
    {
      id: 'week-2-waves-sound',
      title: { en: 'Week 2: Waves & Sound', nl: 'Week 2: Golven & Geluid' },
      icon: '🎵',
      duration: '7 days',
      concept: PHYSICS_WEEK2,
      example: { type: 'analysis' },
      quiz: [
        {
          question: { en: 'Why does a string telephone only work when the string is pulled tight?', nl: 'Waarom werkt een snaartelefoon alleen als de snaar strak wordt aangetrokken?' },
          options: [
            { en: 'Tight string transmits vibrations efficiently; slack string absorbs them', nl: 'Strakke snaar transmitteert trillingen efficiënt; losse snaar absorbeert ze' },
            { en: 'The string needs to be heavy', nl: 'De snaar moet zwaar zijn' },
            { en: 'Sound only travels through metal', nl: 'Geluid reist alleen door metaal' },
            { en: 'The cans need to be a specific size', nl: 'De blikken moeten een specifieke grootte hebben' },
          ],
          correct: 0,
          explanation: { en: 'A tight string can carry vibrations from one end to the other. A slack string absorbs the vibrations like a cushion, so the sound energy is lost.', nl: 'Een strakke snaar kan trillingen van het ene uiteinde naar het andere dragen. Een losse snaar absorbeert de trillingen als een kussen, dus de geluidsenergie gaat verloren.' }
        },
        {
          question: { en: 'When you tap a glass with more water, it makes a lower sound. Why?', nl: 'Wanneer je een glas met meer water tapt, maakt het een lagere toon. Waarom?' },
          options: [
            { en: 'More water = slower vibration = lower pitch', nl: 'Meer water = langzamere trilling = lagere toonhoogte' },
            { en: 'More water = faster vibration = higher pitch', nl: 'Meer water = snellere trilling = hogere toonhoogte' },
            { en: 'Water absorbs the sound', nl: 'Water absorbeert het geluid' },
            { en: 'The glass becomes thicker', nl: 'Het glas wordt dikker' },
          ],
          correct: 0,
          explanation: { en: 'Adding water increases the mass that must vibrate. More mass vibrates more slowly, producing a lower frequency and thus a lower pitch.', nl: 'Water toevoegen verhoogt de massa die moet trillen. Meer massa trilt langzamer, wat een lagere frequentie en dus een lagere toonhoogte produceert.' }
        },
        {
          question: { en: 'A whisper and a shout from the same person have the same pitch but different volume. What is different?', nl: 'Een gefluister en een schreeuw van dezelfde persoon hebben dezelfde toonhoogte maar verschillend volume. Wat is anders?' },
          options: [
            { en: 'The amplitude — how far the vocal cords vibrate', nl: 'De amplitude — hoe ver de stembanden trillen' },
            { en: 'The frequency — how fast the vocal cords vibrate', nl: 'De frequentie — hoe snel de stembanden trillen' },
            { en: 'The speed of sound', nl: 'De snelheid van het geluid' },
            { en: 'The distance to the listener', nl: 'De afstand tot de luisteraar' },
          ],
          correct: 0,
          explanation: { en: 'Pitch is determined by frequency (how fast), while volume is determined by amplitude (how hard). A whisper and a shout have the same frequency but different amplitudes.', nl: 'Toonhoogte wordt bepaald door frequentie (hoe snel), terwijl volume wordt bepaald door amplitude (hoe hard). Een gefluister en een schreeuw hebben dezelfde frequentie maar verschillende amplitudes.' }
        },
      ],
      practice: {
        en: 'Walk through your house and find the 3 highest-pitched and 3 lowest-pitched sounds you can. What objects are creating them? Are the high-pitched objects smaller or larger?',
        nl: 'Loop door je huis en vind de 3 hoogste en 3 laagste tonen die je kunt vinden. Welke objecten maken ze? Zijn de hoge-tonige objecten kleiner of groter?',
      }
    },

    // Week 3: Light & Optics
    {
      id: 'week-3-light-optics',
      title: { en: 'Week 3: Light & Optics', nl: 'Week 3: Licht & Optica' },
      icon: '🌈',
      duration: '7 days',
      concept: PHYSICS_WEEK3,
      example: { type: 'analysis' },
      quiz: [
        {
          question: { en: 'A coin at the bottom of a bowl becomes visible when you pour water in. What happened to the light?', nl: 'Een munt op de bodem van een kom wordt zichtbaar wanneer je er water in giet. Wat is er met het licht gebeurd?' },
          options: [
            { en: 'Light bent (refracted) as it passed from water to air', nl: 'Licht boog (refracteerde) toen het van water naar lucht ging' },
            { en: 'The water amplified the light', nl: 'Het water versterkte het licht' },
            { en: 'The coin reflected more light', nl: 'De munt reflecteerde meer licht' },
            { en: 'Light traveled faster through water', nl: 'Licht reisde sneller door water' },
          ],
          correct: 0,
          explanation: { en: 'Light bends when it passes between materials with different densities. The bent light path around the bowl rim lets you see the coin that was previously hidden.', nl: 'Licht buigt wanneer het tussen materialen met verschillende dichtheden passeert. Het gebogen lichtpad rond de komrand laat je de munt zien die eerder verborgen was.' }
        },
        {
          question: { en: 'Why does a pinhole camera produce an upside-down image?', nl: 'Waarom produceert een camera obscura een ondersteboven beeld?' },
          options: [
            { en: 'Light travels in straight lines — top light goes to bottom, bottom light goes to top', nl: 'Licht reist in rechte lijnen — bovenlicht gaat naar onderen, onderlicht gaat naar boven' },
            { en: 'The pinhole flips the image', nl: 'De pinhole draait het beeld om' },
            { en: 'The wax paper inverts colors', nl: 'Het waspapier inverteert kleuren' },
            { en: 'Gravity bends the light', nl: 'Zwaartekracht buigt het licht' },
          ],
          correct: 0,
          explanation: { en: 'Since light travels in straight lines, rays from the top of the object pass through the pinhole and hit the bottom of the screen, and vice versa. This creates a naturally inverted image.', nl: 'Omdat licht in rechte lijnen reist, passeren stralen vanaf de bovenkant van het object door de pinhole en raken de onderkant van het scherm, en omgekeerd. Dit creëert een natuurlijk geïnverteerd beeld.' }
        },
        {
          question: { en: 'When you pass a rainbow through a second prism, it recombines into white light. What does this prove?', nl: 'Wanneer je een regenboog door een tweede prisma stuurt, combineert het weer tot wit licht. Wat bewijst dit?' },
          options: [
            { en: 'White light is actually a mixture of all colors', nl: 'Wit licht is eigenlijk een mengsel van alle kleuren' },
            { en: 'Prisms create light from nothing', nl: 'Prisma\'s creëren licht uit het niets' },
            { en: 'Colors are not real', nl: 'Kleuren zijn niet echt' },
            { en: 'Light cannot be split', nl: 'Licht kan niet worden gesplitst' },
          ],
          correct: 0,
          explanation: { en: 'Newton\'s prism experiment proved that white light is not pure — it\'s a combination of all colors of the rainbow. The prism separates them, and a second prism recombines them.', nl: 'Newton\'s prisma-experiment bewees dat wit licht niet puur is — het is een combinatie van alle kleuren van de regenboog. Het prisma scheidt ze, en een tweede prisma combineert ze weer.' }
        },
      ],
      practice: {
        en: 'Find 3 real-world examples of refraction in your home (a swimming pool, a glass of water, a magnifying glass). How does each one bend light differently?',
        nl: 'Vind 3 praktijkvoorbeelden van refractie in je huis (een zwembad, een glas water, een vergrootglas). Hoe buigt elk het licht anders?',
      }
    },

    // Week 4: Magnetism & Electromagnetism
    {
      id: 'week-4-magnetism',
      title: { en: 'Week 4: Magnetism & Electromagnetism', nl: 'Week 4: Magnetisme & Elektromagnetisme' },
      icon: '🧲',
      duration: '7 days',
      concept: PHYSICS_WEEK4,
      example: { type: 'analysis' },
      quiz: [
        {
          question: { en: 'A compass needle points north because the Earth is essentially a giant...?', nl: 'Een kompasnaald wijst naar het noorden omdat de Aarde in feite een reusachtige... is?' },
          options: [
            { en: 'Magnet — with a magnetic north and south pole', nl: 'Magneet — met een magnetisch noord- en zuidpool' },
            { en: 'Battery — generating electric current', nl: 'Batterij — elektrische stroom opwekkend' },
            { en: 'Electromagnet — powered by solar energy', nl: 'Elektromagneet — aangedreven door zonne-energie' },
            { en: 'Static charge — from atmospheric electricity', nl: 'Statische lading — door atmosferische elektriciteit' },
          ],
          correct: 0,
          explanation: { en: 'Earth\'s core contains molten iron that creates a magnetic field. This field has a north and south pole, and the compass needle (a tiny magnet) aligns with it.', nl: 'De kern van de Aarde bevat vloeibaar ijzer dat een magnetisch veld creëert. Dit veld heeft een noord- en zuidpool, en de kompasnaald (een kleine magneet) aligneert zich ermee.' }
        },
        {
          question: { en: 'Wrapping wire around a nail and connecting it to a battery makes the nail magnetic. What is this device called?', nl: 'Draad om een spijker winden en verbinden met een batterij maakt de spijker magnetisch. Hoe heet dit apparaat?' },
          options: [
            { en: 'Electromagnet', nl: 'Elektromagneet' },
            { en: 'Generator', nl: 'Generator' },
            { en: 'Capacitor', nl: 'Capacitor' },
            { en: 'Resistor', nl: 'Weerstand' },
          ],
          correct: 0,
          explanation: { en: 'An electromagnet uses electric current flowing through a coil of wire to create a magnetic field. The iron nail amplifies the field. Disconnect the wire and the magnetism disappears.', nl: 'Een elektromagneet gebruikt elektrische stroom door een spoel draad om een magnetisch veld te creëren. De ijzeren spijker versterkt het veld. De draad loskoppelen en het magnetisme verdwijnt.' }
        },
        {
          question: { en: 'When you flip a homopolar motor\'s magnet over, the wire spins in the opposite direction. Why?', nl: 'Wanneer je de magneet van een homopolair motor omdraait, draait de draad de andere kant op. Waarom?' },
          options: [
            { en: 'The magnetic field direction reversed, so the force direction reversed too', nl: 'De richting van het magnetisch veld keerde om, dus de richting van de kracht keerde ook om' },
            { en: 'The battery polarity changed', nl: 'De poolheid van de batterij veranderde' },
            { en: 'The wire became shorter', nl: 'De draad werd korter' },
            { en: 'Friction increased', nl: 'Wrijving nam toe' },
          ],
          correct: 0,
          explanation: { en: 'The spinning is caused by the interaction between the electric current and the magnetic field. Flipping the magnet reverses the magnetic field direction, which reverses the resulting force (Lorentz force).', nl: 'Het draaien wordt veroorzaakt door de wisselwerking tussen de elektrische stroom en het magnetisch veld. De magneet omdraaien keert de richting van het magnetisch veld om, wat de resulterende kracht keert (Lorentz-kracht).' }
        },
      ],
      practice: {
        en: 'Find every magnetic and non-magnetic object in one room of your house. Make a chart. What do the magnetic objects have in common?',
        nl: 'Vind elk magnetisch en niet-magnetisch object in één kamer van je huis. Maak een tabel. Wat hebben de magnetische objecten gemeen?',
      }
    },
  ]
}

// ── All Built-in Paths ──

export const BUILT_IN_PATHS = [CHARTS_PATH, FRACTIONS_PATH, PHYSICS_PATH]
