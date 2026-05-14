import {
  db,
  Courses,
  Events,
  Media,
  QuizQuestions,
  FaqItems,
  TeamMembers,
  Rewards,
  QuizAssessments,
} from 'astro:db';

export default async function seed() {
  await db.insert(Courses).values([
    {
      id: 'masterclass',
      slug: 'masterclass',
      titleRu: 'Мастер-класс: Введение в IT',
      titleEn: 'IT Masterclass Intro',
      descriptionRu:
        'Однодневный интенсив для знакомства с ключевыми направлениями в IT.',
      descriptionEn:
        'One-day intensive intro to the key directions in IT.',
      bestForRu:
        'Все, кто хочет быстро разобраться, что такое IT, и выбрать свое направление.',
      outcomesJson: JSON.stringify([
        'Введение в Vibe Coding и AI',
        'Основы управления базами данных',
        'Основы современной веб-разработки',
        'Автоматизация простых задач',
      ]),
      instructor: 'martin',
      priceMonthly: 0,
      priceTotal: 25,
      priceLabel: 'за курс',
      durationLabel: '1 день',
      hoursLabel: '4 часа',
      durationWeeks: 0,
      sessionsPerWeek: 1,
      hoursPerSession: 4,
      totalHours: 4,
      level: 'beginner',
      accentColor: '#F43F5E',
      category: 'event',
      sortOrder: 0,
      isActive: true,
    },
    {
      id: 'python-sql',
      slug: 'python-sql',
      titleRu: 'Python + SQL',
      titleEn: 'Python + SQL Fundamentals',
      descriptionRu:
        'Фундамент современных технологий. Научись писать код, работать с базами данных и автоматизировать задачи.',
      descriptionEn:
        'The foundation of modern tech. Learn to write code, work with databases, and automate tasks.',
      bestForRu:
        'Полные новички, которые хотят стать разработчиками, аналитиками данных или специалистами по автоматизации.',
      outcomesJson: JSON.stringify([
        'Основы Python (переменные, функции, циклы, структуры данных)',
        'SQL для запросов и управления базами данных',
        'Создание скриптов и мини-приложений',
        'Контроль версий с Git',
      ]),
      instructor: 'martin',
      priceMonthly: 170,
      priceTotal: 340,
      priceLabel: '/мес',
      durationLabel: '8 дней',
      hoursLabel: '32 часа',
      durationWeeks: 8,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      totalHours: 32,
      level: 'beginner',
      accentColor: '#3B82F6',
      category: 'full',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'data-analysis',
      slug: 'data-analysis',
      titleRu: 'Data Analysis',
      titleEn: 'Data Analysis',
      descriptionRu:
        'Превращай данные в решения. Анализируй датасеты, строй дашборды и рассказывай истории с помощью цифр.',
      descriptionEn:
        'Turn data into decisions. Analyze datasets, build dashboards, and tell stories with numbers.',
      bestForRu:
        'Те, кто любит паттерны и цифры — будущие аналитики и BI-специалисты.',
      outcomesJson: JSON.stringify([
        'Анализ данных на Python (Pandas, NumPy)',
        'Визуализация данных (графики, дашборды)',
        'Статистическое мышление и бизнес-метрики',
        'Работа с реальными «грязными» данными',
      ]),
      instructor: 'martin',
      priceMonthly: 170,
      priceTotal: 340,
      priceLabel: '/мес',
      durationLabel: '8 дней',
      hoursLabel: '32 часа',
      durationWeeks: 8,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      totalHours: 32,
      level: 'intermediate',
      accentColor: '#10B981',
      category: 'full',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'devops-cloud',
      slug: 'devops-cloud',
      titleRu: 'DevOps & Cloud',
      titleEn: 'DevOps & Cloud (AWS)',
      descriptionRu:
        'Поддерживай системы и деплой код в масштабе. Самый востребованный и высокооплачиваемый навык в IT.',
      descriptionEn:
        'Keep systems running and deploy code at scale. The most in-demand skill in tech.',
      bestForRu:
        'Люди с техническим бэкграундом, которые хотят специализироваться в инфраструктуре.',
      outcomesJson: JSON.stringify([
        'Linux и командная строка',
        'Docker и контейнеризация',
        'CI/CD пайплайны',
        'Облачные платформы (AWS)',
      ]),
      instructor: 'martin',
      priceMonthly: 220,
      priceTotal: 440,
      priceLabel: '/мес',
      durationLabel: '8 дней',
      hoursLabel: '32 часа',
      durationWeeks: 8,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      totalHours: 32,
      level: 'intermediate',
      accentColor: '#8B5CF6',
      category: 'full',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'vibe-coding',
      slug: 'vibe-coding',
      titleRu: 'Vibe Coding & AI Content',
      titleEn: 'Vibe Coding & AI Content Creation',
      descriptionRu:
        'Создавай приложения и контент с помощью AI. Antigravity, Claude, Gemini, ComfyUI и Hugging Face — твой арсенал будущего.',
      descriptionEn:
        'Create apps and content with AI. Antigravity, Claude, Gemini, ComfyUI and Hugging Face — your future toolkit.',
      bestForRu:
        'Маркетологи, контент-мейкеры, предприниматели и все, кто хочет создавать с помощью AI без глубоких знаний кода.',
      outcomesJson: JSON.stringify([
        'Prompt engineering и AI-ассистенты',
        'Vibe coding с Antigravity и Claude',
        'Генерация контента: текст, изображения, видео',
        'ComfyUI, Hugging Face и no-code AI инструменты',
      ]),
      instructor: 'martin',
      priceMonthly: 440,
      priceTotal: 880,
      priceLabel: '/мес',
      durationLabel: '12 дней',
      hoursLabel: '48 часов',
      durationWeeks: 12,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      totalHours: 48,
      level: 'beginner',
      accentColor: '#F59E0B',
      category: 'full',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 'claude-code',
      slug: 'claude-code',
      titleRu: 'Claude Code: Автоматизация',
      titleEn: 'Claude Code: Automate Everything',
      descriptionRu:
        'Автоматизируй всё, что можно автоматизировать. Полный курс по Claude Code — от скриптов до AI-агентов и сложных workflow.',
      descriptionEn:
        'Automate everything that can be automated. Full Claude Code course — from scripts to AI agents and complex workflows.',
      bestForRu:
        'Разработчики, технические специалисты и power users, которые хотят 10x свою продуктивность через AI-автоматизацию.',
      outcomesJson: JSON.stringify([
        'Claude Code для разработки и автоматизации',
        'Создание AI-агентов и пайплайнов',
        'Автоматизация рабочих процессов',
        'Capstone: полностью автоматизированный workflow',
      ]),
      instructor: 'martin',
      priceMonthly: 1000,
      priceTotal: 2000,
      priceLabel: '/мес',
      durationLabel: '12 дней',
      hoursLabel: '48 часов',
      durationWeeks: 12,
      sessionsPerWeek: 2,
      hoursPerSession: 2,
      totalHours: 48,
      level: 'advanced',
      accentColor: '#EC4899',
      category: 'full',
      sortOrder: 5,
      isActive: true,
    },
  ]);

  await db.insert(Events).values([
    {
      id: 'three-pillars-apr-2026',
      titleRu: '3 столпа IT: Data, Dev, AI',
      titleEn: '3 Pillars of IT: Data, Dev, AI',
      descriptionRu:
        'Узнай, как на самом деле выглядят аналитика данных, разработка и искусственный интеллект — и какой путь подходит именно тебе.',
      descriptionEn:
        'Learn what Data Analytics, Development, and AI really look like — and which path is right for you.',
      bannerLabelRu:
        '«3 столпа IT: Data, Dev, AI» — Батуми, регистрация открыта',
      eventDate: new Date('2026-04-11T18:00:00'),
      location: 'Батуми, центр города, рядом с площадью Европы',
      price: 0,
      capacity: 50,
      isActive: true,
    },
  ]);

  await db.insert(Media).values([
    {
      id: 'hero',
      slot: 'hero',
      // Pre-rendered boomerang: forward+reverse concatenated and slowed at
      // encode time, so the browser plays it natively at rate 1.0 with <video loop>.
      // No JS source-swap, no decoder reset. The reverseSrc column is intentionally
      // null now — kept on schema for future hero swaps if needed.
      src: '/secondary-loop.mp4',
      reverseSrc: null,
      poster: '/secondary-bg.jpg',
      alt: 'Silver ribbons with cyan light glow — MaLuDa hero atmosphere',
      isActive: true,
    },
    {
      id: 'register-bg',
      slot: 'register',
      src: '/secondary-bg.mp4',
      poster: '/secondary-bg.jpg',
      alt: 'Registration section background',
      isActive: true,
    },
  ]);

  await db.insert(QuizQuestions).values([
    { id: 'q01', question: 'Какой язык программирования самый популярный в 2026 году?', optionsJson: JSON.stringify(['Java', 'Python', 'JavaScript', 'Rust']), correctIndex: 1, funFact: 'Python — №1 уже 5 лет подряд! Это первый курс в MaLuDa — и не случайно.', tag: 'tech', sortOrder: 1, isActive: true },
    { id: 'q02', question: 'Первый программист в истории — это...', optionsJson: JSON.stringify(['Алан Тьюринг', 'Ада Лавлейс', 'Чарльз Бэббидж', 'Деннис Ритчи']), correctIndex: 1, funFact: 'Ада Лавлейс написала первый алгоритм в 1843 году — за 100 лет до первого компьютера!', tag: 'history', sortOrder: 2, isActive: true },
    { id: 'q03', question: 'Сколько строк кода в Google?', optionsJson: JSON.stringify(['500 тысяч', '86 миллионов', '2 миллиарда', 'Никто не считал']), correctIndex: 2, funFact: 'Google содержит более 2 млрд строк кода. Это как 40 000 книг «Война и мир».', tag: 'tech', sortOrder: 3, isActive: true },
    { id: 'q04', question: 'Что означает SQL?', optionsJson: JSON.stringify(['Simple Query Library', 'Structured Query Language', 'System Quality Logic', 'Sequential Queue List']), correctIndex: 1, funFact: 'SQL — Structured Query Language. Создан IBM в 1970-х и до сих пор правит миром данных.', tag: 'tech', sortOrder: 4, isActive: true },
    { id: 'q05', question: 'Сколько данных человечество создаёт каждый день?', optionsJson: JSON.stringify(['1 гигабайт', '120 терабайт', '2.5 квинтиллиона байт', '500 петабайт']), correctIndex: 2, funFact: '2.5 квинтиллиона байт в день! 90% всех данных в мире созданы за последние 2 года.', tag: 'data', sortOrder: 5, isActive: true },
    { id: 'q06', question: 'Какой процент IT-специалистов — самоучки?', optionsJson: JSON.stringify(['12%', '31%', '58%', '72%']), correctIndex: 2, funFact: '58% разработчиков самоучки по данным Stack Overflow. Диплом — не обязательное условие.', tag: 'career', sortOrder: 6, isActive: true },
    { id: 'q07', question: 'Что такое DevOps?', optionsJson: JSON.stringify(['Язык программирования', 'Методология сотрудничества разработки и эксплуатации', 'База данных', 'Инструмент тестирования']), correctIndex: 1, funFact: 'DevOps объединяет разработку и операции. Компании с DevOps деплоят код в 200× чаще.', tag: 'tech', sortOrder: 7, isActive: true },
    { id: 'q08', question: 'Сколько зарабатывает junior Data Analyst в Европе?', optionsJson: JSON.stringify(['€800/мес', '€1500/мес', '€2500/мес', '€5000/мес']), correctIndex: 2, funFact: 'Junior Data Analyst в Европе стартует от €2000–3000/мес. Это реальная цель после нашего курса.', tag: 'career', sortOrder: 8, isActive: true },
    { id: 'q09', question: 'Что такое Docker?', optionsJson: JSON.stringify(['Текстовый редактор', 'Платформа контейнеризации приложений', 'Язык разметки', 'Система управления версиями']), correctIndex: 1, funFact: 'Docker позволяет упаковать приложение с его зависимостями в контейнер. Используется в 90% облачных проектов.', tag: 'tech', sortOrder: 9, isActive: true },
    { id: 'q10', question: 'Что такое ChatGPT?', optionsJson: JSON.stringify(['Поисковик', 'Языковая модель ИИ', 'Операционная система', 'Браузер']), correctIndex: 1, funFact: 'ChatGPT — языковая модель от OpenAI. Набрал 100 млн пользователей за 2 месяца — быстрее любого продукта в истории.', tag: 'ai', sortOrder: 10, isActive: true },
    { id: 'q11', question: 'Какой инструмент Data-аналитика используется чаще всего?', optionsJson: JSON.stringify(['Excel', 'Python + Pandas', 'Tableau', 'Power BI']), correctIndex: 1, funFact: 'Python обошёл Excel в 2023 году по популярности у аналитиков. Pandas обрабатывает миллионы строк за секунды.', tag: 'data', sortOrder: 11, isActive: true },
    { id: 'q12', question: 'Что такое CI/CD?', optionsJson: JSON.stringify(['Программа для дизайна', 'Непрерывная интеграция и доставка кода', 'Язык запросов', 'Тип базы данных']), correctIndex: 1, funFact: 'CI/CD автоматизирует тестирование и деплой. Компании с CI/CD восстанавливаются после сбоев в 24× быстрее.', tag: 'tech', sortOrder: 12, isActive: true },
    { id: 'q13', question: 'Что такое Prompt Engineering?', optionsJson: JSON.stringify(['Строительная профессия', 'Написание эффективных запросов к ИИ', 'Тип алгоритма', 'Сетевой протокол']), correctIndex: 1, funFact: 'Prompt Engineering — навык формулировки запросов к ИИ. Специалисты зарабатывают $50–150k/год.', tag: 'ai', sortOrder: 13, isActive: true },
    { id: 'q14', question: 'Сколько времени нужно, чтобы стать junior-разработчиком?', optionsJson: JSON.stringify(['1 неделю', '6–12 месяцев', '4 года', 'Минимум 10 лет']), correctIndex: 1, funFact: 'При правильном подходе 6–12 месяцев достаточно для первой работы. В MaLuDa мы делаем это за 2–3 месяца.', tag: 'career', sortOrder: 14, isActive: true },
    { id: 'q15', question: 'Что происходит с данными без Data Analyst?', optionsJson: JSON.stringify(['Всё идёт само', 'Данные хранятся и никто их не читает', 'Они удаляются автоматически', 'Анализирует ИИ сам']), correctIndex: 1, funFact: '73% корпоративных данных никогда не используются. Data Analyst превращает шум в решения.', tag: 'data', sortOrder: 15, isActive: true },
    { id: 'q16', question: 'Что такое Kubernetes?', optionsJson: JSON.stringify(['Греческое блюдо', 'Система оркестрации контейнеров', 'Язык программирования', 'Протокол шифрования']), correctIndex: 1, funFact: 'Kubernetes управляет тысячами контейнеров Docker. Используется в Netflix, Google, Airbnb.', tag: 'tech', sortOrder: 16, isActive: true },
    { id: 'q17', question: 'Какой навык рекрутеры ищут чаще всего в 2026 году?', optionsJson: JSON.stringify(['Java-разработка', 'Работа с данными и ИИ', 'HTML/CSS', 'Тестирование ПО']), correctIndex: 1, funFact: 'По данным LinkedIn, навыки работы с данными и ИИ — самые востребованные 3 года подряд.', tag: 'career', sortOrder: 17, isActive: true },
    { id: 'q18', question: "Что значит 'облако' в IT?", optionsJson: JSON.stringify(['Графика в видеоиграх', 'Серверы в интернете, доступные удалённо', 'Тип базы данных', 'Операционная система']), correctIndex: 1, funFact: 'Облако — это чужие серверы. AWS, Google Cloud и Azure обслуживают 95% интернет-трафика.', tag: 'tech', sortOrder: 18, isActive: true },
    { id: 'q19', question: 'Сколько программистов не хватает в мире к 2030 году?', optionsJson: JSON.stringify(['50 тысяч', '500 тысяч', '4 миллиона', '85 миллионов']), correctIndex: 3, funFact: 'По прогнозу Korn Ferry — дефицит 85 млн IT-специалистов к 2030 году. Твоё место уже ждёт.', tag: 'career', sortOrder: 19, isActive: true },
    { id: 'q20', question: 'Что такое Git?', optionsJson: JSON.stringify(['Тип компьютера', 'Система контроля версий кода', 'База данных', 'Протокол интернета']), correctIndex: 1, funFact: 'Git создал Линус Торвальдс (создатель Linux) за 10 дней. Сейчас используется в 95% IT-команд.', tag: 'tech', sortOrder: 20, isActive: true },
    { id: 'q21', question: 'Что изучают на курсе Data Analysis?', optionsJson: JSON.stringify(['Веб-дизайн', 'Pandas, SQL, визуализация данных', 'Создание игр', 'Кибербезопасность']), correctIndex: 1, funFact: 'Data Analysis включает Python, Pandas, SQL и Tableau. Это базовый стек аналитика данных.', tag: 'data', sortOrder: 21, isActive: true },
    { id: 'q22', question: 'Какой процент компаний используют облако в 2026?', optionsJson: JSON.stringify(['40%', '62%', '81%', '94%']), correctIndex: 3, funFact: '94% предприятий используют облачные сервисы. DevOps-специалисты — главные строители этой инфраструктуры.', tag: 'tech', sortOrder: 22, isActive: true },
    { id: 'q23', question: 'Что такое Vibe Coding?', optionsJson: JSON.stringify(['Кодинг под музыку', 'Создание ПО с помощью ИИ-подсказок без глубокого знания синтаксиса', 'Игровая разработка', 'Тип тестирования']), correctIndex: 1, funFact: 'Vibe Coding — термин 2024 года. Andrej Karpathy (экс-Tesla AI) ввёл его для описания ИИ-ассистированного программирования.', tag: 'ai', sortOrder: 23, isActive: true },
    { id: 'q24', question: 'Сколько времени занимает курс в MaLuDa?', optionsJson: JSON.stringify(['3 дня', '8 недель', '1 год', '2 месяца']), correctIndex: 1, funFact: 'Курсы в MaLuDa — 8 недель интенсивной практики. Живые занятия, малые группы, реальные проекты.', tag: 'maluda', sortOrder: 24, isActive: true },
    { id: 'q25', question: 'Что отличает MaLuDa от онлайн-курсов?', optionsJson: JSON.stringify(['Дешевле', 'Живые занятия, преподаватель рядом, практические проекты', 'Больше видеолекций', 'Автоматическая проверка']), correctIndex: 1, funFact: 'В MaLuDa ты не один. Преподаватель видит тебя, отвечает на вопросы и не даёт бросить.', tag: 'maluda', sortOrder: 25, isActive: true },
  ]);

  await db.insert(FaqItems).values([
    { id: 'faq-01', question: 'Нужен ли мне предыдущий опыт?', answer: 'Нет. Курсы Python+SQL, Data Analysis и Vibe Coding начинаются с абсолютного нуля. Курс DevOps предполагает базовое знакомство с командной строкой. Курс Claude Code Automation — для тех, кто уже работает в IT.', sortOrder: 1, isActive: true },
    { id: 'faq-02', question: 'На каком языке ведутся занятия?', answer: 'Английский с поддержкой на русском. Если ты владеешь любым из этих языков — всё будет хорошо.', sortOrder: 2, isActive: true },
    { id: 'faq-03', question: 'Сколько часов в неделю нужно уделять?', answer: 'Занятия (2-3 раза в неделю по 1,5-2 часа) плюс 3-5 часов на домашку и практику. Итого: около 8-12 часов в неделю.', sortOrder: 3, isActive: true },
    { id: 'faq-04', question: 'Занятия в офлайне или онлайн?', answer: 'Офлайн, в центре Батуми, рядом с площадью Европы. Мы верим, что живой формат — ключевая часть того, что делает MaLuDa эффективной.', sortOrder: 4, isActive: true },
    { id: 'faq-05', question: 'Сколько это стоит?', answer: 'От $150 до $1000 за курс в зависимости от программы. Базовые курсы — $150/мес, AI-курсы — от $440. Никаких долгосрочных контрактов.', sortOrder: 5, isActive: true },
    { id: 'faq-06', question: 'Что если я не могу себе это позволить?', answer: 'Поговори с нами. Мы лучше найдём решение, чем потеряем мотивированного студента.', sortOrder: 6, isActive: true },
    { id: 'faq-07', question: 'Как долго длятся курсы?', answer: 'От 8 недель до 3 месяцев в зависимости от программы. К концу у тебя будет полноценный набор навыков и проект для портфолио.', sortOrder: 7, isActive: true },
    { id: 'faq-08', question: 'Поможет ли это найти работу?', answer: 'Мы учим навыкам, за которые нанимают, и ты создашь проекты для портфолио. Но мы — образовательная компания, не агентство по трудоустройству. Твои результаты зависят от твоих усилий.', sortOrder: 8, isActive: true },
    { id: 'faq-09', question: 'Что если я начну и пойму, что это не моё?', answer: 'После первых двух недель мы сами спросим. Если курс не подходит — поможем найти лучший путь или ты можешь остановиться.', sortOrder: 9, isActive: true },
    { id: 'faq-10', question: 'Чем MaLuDa отличается от буткемпа?', answer: 'Буткемпы — интенсивные, дорогие и часто онлайн. MaLuDa устойчивее — вписывается в твою жизнь, значительно дешевле и проходит вживую в твоём городе.', sortOrder: 10, isActive: true },
  ]);

  await db.insert(TeamMembers).values([
    { id: 'martin', name: 'Мартин', role: 'Co-founder · Data Science & AI Stack', bio: 'Эксперт в области анализа данных и искусственного интеллекта. Специализируется на разработке сложных аналитических систем и внедрении AI-решений в бизнес-процессы.', accentColor: '#041627', sortOrder: 1, isActive: true },
    { id: 'sasha', name: 'Саша', role: 'Co-founder · DevOps & AI Stack', bio: 'Специалист по облачной инфраструктуре и автоматизации. Фокусируется на создании масштабируемых систем и интеграции AI-инструментов в современные DevOps-пайплайны.', accentColor: '#006B5F', sortOrder: 2, isActive: true },
    { id: 'dato', name: 'Дато', role: 'Co-founder · Ambassador & Community', bio: 'Помогает MaLuDa расти и развиваться в Батуми. Связывает школу с локальным IT-сообществом и бизнесом.', accentColor: '#3B82F6', sortOrder: 3, isActive: true },
  ]);

  await db.insert(Rewards).values([
    { id: 'reward-300', xpThreshold: 300, type: 'quiz', title: 'Достижение: Любознательный!', description: 'Открыт доступ к мини-тесту: "Какая сфера IT подходит именно тебе?"', icon: '🧩', isActive: true },
    { id: 'reward-500', xpThreshold: 500, type: 'pdf', title: 'Достижение: Продвинутый!', description: 'Получите PDF-гайд: "Основы Vibe Coding и AI-автоматизации 2026"', icon: '📚', isActive: true },
    { id: 'reward-750', xpThreshold: 750, type: 'discount', title: 'Достижение: Эксперт!', description: 'Ваш промокод на первый воркшоп (10%): MALUDA_SOTA', icon: '💎', isActive: true },
    { id: 'reward-1000', xpThreshold: 1000, type: 'badge', title: 'Достижение: Мастер Батуми!', description: 'Вы получили цифровой значок Основателя. Покажите его на встрече!', icon: '🏆', isActive: true },
  ]);

  await db.insert(QuizAssessments).values([
    {
      id: 'beginner',
      maxPctInclusive: 0.3,
      level: 'Новичок',
      title: 'Ты только начинаешь свой путь',
      description:
        'Именно для этого и существует MaLuDa. Ты попал в правильное место — здесь учат с нуля.',
      cta: 'Начни с Python + SQL',
      ctaHref: '/#register',
      color: '#006b5f',
      nudge: 'Не знать — не стыдно. Не начать — вот в чём риск.',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'curious',
      maxPctInclusive: 0.6,
      level: 'Любознательный',
      title: 'У тебя есть база — теперь дай ей направление',
      description:
        'Ты уже знаешь больше, чем думаешь. Но без структуры знания остаются разрозненными. Мы это исправим.',
      cta: 'Выбрать подходящий курс',
      ctaHref: '/#register',
      color: '#006b5f',
      nudge: '85 миллионов IT-специалистов не хватает к 2030 году. Твоё место свободно.',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'advanced',
      maxPctInclusive: 0.85,
      level: 'Продвинутый',
      title: 'Ты явно следишь за индустрией',
      description:
        'Хорошие знания — это старт. Практика в реальных проектах с преподавателем — это карьера.',
      cta: 'Перейти к курсам уровня Advanced',
      ctaHref: '/#register',
      color: '#041627',
      nudge: 'Знания без практики — теория. Практика в MaLuDa — это твоё портфолио.',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'expert',
      maxPctInclusive: 1.0,
      level: 'Эксперт',
      title: 'Ты знаешь больше 85% людей в этой комнате',
      description:
        'Впечатляет. Тебе нужен не курс — тебе нужна среда с равными по уровню. Приходи к нам.',
      cta: 'DevOps & Cloud или Vibe Coding',
      ctaHref: '/#register',
      color: '#041627',
      nudge: 'Экспертам платят в 3× больше. Следующий уровень — за тобой.',
      sortOrder: 4,
      isActive: true,
    },
  ]);
}
