export type SkillCategory =
  | 'all'
  | 'ai-ml'
  | 'data-science'
  | 'python-dsa'
  | 'fullstack'
  | 'databases-devops';

export type ProjectCategory = 'all' | 'fullstack' | 'realtime' | 'frontend';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  proficiency: string;
  quip: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'all'>;
  timeframe: string;
  teamLabel: string;
  summary: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl: string;
  architectureFlow: string[];
  impactMetric: string;
  featuredWide?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  detail: string;
}

export interface WeatherMoodPreset {
  id: string;
  weatherLabel: string;
  cityContext: string;
  trackTitle: string;
  artist: string;
  vibeNote: string;
  bpm: number;
}

export const HARSH_PROFILE = {
  name: 'Harsh Bhadoria',
  shortName: 'HB',
  role: 'Python Data Science & Full Stack Developer',
  location: 'Aditya Puram, Gwalior, MP, India',
  email: 'harshbhadoria6@gmail.com',
  phone: '+91 9399781973',
  phoneHref: 'tel:+919399781973',
  whatsappUrl: 'https://wa.me/919399781973?text=Hi%20Harsh%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect.',
  githubUrl: 'https://github.com/Harshbhadoria1',
  githubHandle: '@Harshbhadoria1',
  linkedinUrl: 'https://www.linkedin.com/in/harsh-bhadoria-a4aa17328/',
  linkedinHandle: 'in/harsh-bhadoria-a4aa17328',
  photoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_4.47.54_PM_23abf458.jpeg',
  resumeImageUrl: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_3.39.36_PM_28e1b3e4.jpeg',
  resumePdfUrl: '/Harsh_Bhadoria_Resume.pdf',
  resumeHtmlUrl: '/resume.html',
  heroBios: {
    serious:
      'Computer Science undergrad from Gwalior combining Python Data Science, Machine Learning, and Generative AI with full-stack MERN engineering. Experienced in building real-time, multilingual web applications, data-driven workflows, and scalable backends.',
    honest:
      'Lives somewhere between pandas.DataFrame.dropna(), wondering why my ML accuracy dropped from 98% to 52%, and celebrating like I won a hackathon whenever Docker actually builds on the first try.',
    gwalior:
      'Trained in Aditya Puram, Gwalior on strong masala chai and clean algorithms. Equally dangerous writing Python notebooks at 2 AM and shipping responsive React + Node products before sunrise.',
  },
};

export const PRELOADER_QUIPS = [
  'Importing pandas as pd & brewing Gwalior chai...',
  'Training neural layers on 3 hours of sleep...',
  'Untangling asynchronous promises & SQL joins...',
  'Polishing liquid glass shaders for Harsh Bhadoria...',
];

export const DEV_EXCUSES = [
  '“It’s not overfitting, the model just deeply respects the training set.”',
  '“Works in my Jupyter Notebook — production just needs better vibes.”',
  '“99% of my Data Science work is cleaning CSVs shaped like emotional trauma.”',
  '“I fixed the bug, broke CSS, fixed CSS, and now the Docker container is questioning life.”',
  '“My Git commit message said minor tweak — I rewrote 42 files.”',
  '“GenAI wrote the boilerplate, I spent 3 hours arguing with it about semicolon placement.”',
];

export const SKILLS_DATA: SkillItem[] = [
  // AI, ML & GenAI
  {
    id: 'genai',
    name: 'Generative AI (GenAI)',
    category: 'ai-ml',
    proficiency: 'LLM Apps · Prompt Engineering · RAG',
    quip: 'Turning unstructured prompts into reliable, context-aware workflows.',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'ai-ml',
    proficiency: 'Regression · Classification · Clustering',
    quip: 'Teaching computers patterns so they make smarter mistakes faster than me.',
  },
  {
    id: 'sklearn',
    name: 'Scikit-learn',
    category: 'ai-ml',
    proficiency: 'Pipelines · Cross-Validation · Metrics',
    quip: 'fit(), predict(), score() — the cleanest three-line magic in Python.',
  },
  {
    id: 'dl',
    name: 'Deep Learning Basics',
    category: 'ai-ml',
    proficiency: 'Neural Nets · Gradient Descent',
    quip: 'Watching loss go down gives me more dopamine than social media.',
  },

  // Data Science & Analytics
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'data-science',
    proficiency: 'EDA · Hypothesis Testing · Modeling',
    quip: 'Finding the actual story hiding inside 50,000 noisy rows.',
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    category: 'data-science',
    proficiency: 'KPI Insights · Cleaning · Dashboards',
    quip: 'Because raw spreadsheets deserve better than pie charts.',
  },
  {
    id: 'pandas',
    name: 'Pandas',
    category: 'data-science',
    proficiency: 'DataFrames · GroupBy · Wrangling',
    quip: 'df.head() is basically my morning newspaper.',
  },
  {
    id: 'numpy',
    name: 'NumPy',
    category: 'data-science',
    proficiency: 'Vectorized Arrays · Linear Algebra',
    quip: 'Replacing nested Python loops with C-speed matrix math.',
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib & Seaborn',
    category: 'data-science',
    proficiency: 'Statistical Plots · Heatmaps',
    quip: 'Making correlation matrices look like modern gallery art.',
  },
  {
    id: 'scipy-plotly',
    name: 'SciPy & Plotly',
    category: 'data-science',
    proficiency: 'Statistical Modeling · Interactive Charts',
    quip: 'Interactive graphs that make stakeholders actually zoom in.',
  },

  // Python, Frameworks & DSA
  {
    id: 'python',
    name: 'Python',
    category: 'python-dsa',
    proficiency: 'Scripting · Automation · Data Pipelines',
    quip: 'Reads like English, solves problems like a Swiss Army knife.',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'python-dsa',
    proficiency: 'Async ML APIs · Pydantic Docs',
    quip: 'Serving ML models with automatic Swagger docs before tea cools down.',
  },
  {
    id: 'flask-streamlit',
    name: 'Flask & Streamlit',
    category: 'python-dsa',
    proficiency: 'Rapid ML Web Apps · Prototypes',
    quip: 'From Python script to shareable interactive demo in 20 lines.',
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'python-dsa',
    proficiency: 'Trees · Graphs · DP · Complexity',
    quip: 'Optimizing O(n²) midnight hacks into O(n log n) confidence.',
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'python-dsa',
    proficiency: 'STL · Competitive Problem Solving',
    quip: 'Pointers keep my ego humble and my memory management honest.',
  },

  // Full Stack Web
  {
    id: 'react',
    name: 'React.js',
    category: 'fullstack',
    proficiency: 'Hooks · State Architecture · Motion UI',
    quip: 'Turning complex application state into buttery 60fps interfaces.',
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express.js',
    category: 'fullstack',
    proficiency: 'REST APIs · Middleware · Auth',
    quip: 'req, res, next — moving JSON at lightning speed.',
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES2024)',
    category: 'fullstack',
    proficiency: 'Async/Await · DOM · Type Safety',
    quip: 'Weird coercion rules, undefeated browser superpower.',
  },
  {
    id: 'html-css',
    name: 'HTML5, CSS3 & Tailwind',
    category: 'fullstack',
    proficiency: 'Glassmorphism · Responsive Systems',
    quip: 'Centered a div horizontally and vertically on the first try once.',
  },

  // Databases & DevOps
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'databases-devops',
    proficiency: 'Normalized Schemas · Joins · Indexing',
    quip: 'Always double-checking the WHERE clause before hitting Enter.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases-devops',
    proficiency: 'ACID Transactions · Analytic Queries',
    quip: 'Window functions and CTEs that feel like database magic.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'databases-devops',
    proficiency: 'NoSQL Documents · Aggregations',
    quip: 'Schemas flexible enough to forgive 2 AM hackathon feature pivots.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'databases-devops',
    proficiency: 'Containers · Reproducible Environments',
    quip: 'Officially retired the excuse “but it works on my machine.”',
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'databases-devops',
    proficiency: 'Branching · PRs · Collaboration',
    quip: 'git commit -m "tested before pushing this time, promise."',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'agrinext',
    title: 'AgriNext',
    subtitle: 'Agriculture E-Commerce & Multilingual Marketplace',
    category: 'fullstack',
    timeframe: '10 Mar 2025 – 16 Mar 2025',
    teamLabel: 'Team of 4',
    summary:
      'A full-stack MERN agriculture commerce platform built with multilingual accessibility, real-time stock inventory updates, and an intuitive seller & admin management console.',
    highlights: [
      'Architected end-to-end MERN storefront and admin dashboard for agricultural products and live stock tracking.',
      'Implemented multilingual support so regional farmers and buyers can browse seamlessly in their preferred language.',
      'Built real-time inventory synchronization preventing overselling during peak order spikes.',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Multilingual UI'],
    liveUrl: 'https://agrinext-frontend.vercel.app',
    repoUrl: 'https://github.com/Harshbhadoria1',
    architectureFlow: ['React Storefront', 'i18n Locale Layer', 'Express REST API', 'MongoDB Live Stock'],
    impactMetric: 'Multilingual MERN Commerce · Live on Vercel',
    featuredWide: true,
  },
  {
    id: 'weather-fm',
    title: 'Weather-fm',
    subtitle: 'Weather-Reactive Music Discovery Engine',
    category: 'frontend',
    timeframe: '24 Oct 2024 – 28 Oct 2024',
    teamLabel: 'Solo Build',
    summary:
      'An atmospheric web app that reads a city’s live weather conditions and recommends matching tracks with direct Spotify listening links inside a fluid, responsive interface.',
    highlights: [
      'Mapped real-time meteorological states (rain, clear skies, mist, heatwaves) to curated sonic mood profiles.',
      'Integrated direct Spotify deep links for frictionless music playback from any city search.',
      'Crafted a clean, responsive glass interface tuned for fast mobile and desktop browsing.',
    ],
    stack: ['React.js', 'Weather API', 'Spotify Links', 'JavaScript', 'Responsive CSS'],
    liveUrl: 'https://wheather-fm.vercel.app',
    repoUrl: 'https://github.com/Harshbhadoria1',
    architectureFlow: ['City Weather Fetch', 'Mood Classifier', 'Spotify Track Matcher', 'Fluid Audio UI'],
    impactMetric: 'Live City Moods · Deployed on Vercel',
  },
  {
    id: 'jeevanmarg',
    title: 'JeevanMarg',
    subtitle: 'Real-Time Emergency Shelter Locator & Bed Manager',
    category: 'realtime',
    timeframe: '17 Apr 2025 – 21 Apr 2025',
    teamLabel: 'Solo Build',
    summary:
      'A crisis-response web application that locates the nearest available emergency shelters in real time, tracks live bed capacity, supports multiple languages, and includes an admin panel.',
    highlights: [
      'Engineered nearest-shelter lookup and live bed availability management during high-urgency situations.',
      'Added multilingual support to keep critical shelter guidance readable for diverse communities.',
      'Built an operational admin panel enabling instant shelter registration, bed counts, and status updates.',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Admin Console'],
    repoUrl: 'https://github.com/Harshbhadoria1',
    architectureFlow: ['Locator UI', 'Multilingual Switcher', 'Express Shelter API', 'Real-Time Bed Store'],
    impactMetric: 'Real-Time Crisis Routing · Admin Panel',
  },
  {
    id: 'gwalior-dev-lab',
    title: 'Neural Data & Web Sandbox',
    subtitle: 'Interactive ML Loss Curve, Bug Squasher & Gmail Relay',
    category: 'fullstack',
    timeframe: '2025 – 2026',
    teamLabel: 'Solo Build',
    summary:
      'Interactive glassmorphic portfolio architecture featuring a neural constellation canvas, Python ML epoch simulator, Weather-fm audio preview, and live Express-to-Gmail delivery.',
    highlights: [
      'Built an interactive Neural Constellation background canvas responding dynamically to pointer motion.',
      'Created a live ML Epoch & Chai training simulator plus playable Bug Squasher arcade.',
      'Integrated Express backend routes for contact validation, persistence, and direct Gmail forwarding.',
    ],
    stack: ['React 19', 'TypeScript', 'Canvas Physics', 'Express.js', 'Motion'],
    repoUrl: 'https://github.com/Harshbhadoria1/portfolio',
    architectureFlow: ['Neural Canvas', 'Motion Glass UI', 'Interactive Simulators', 'Express Gmail Relay'],
    impactMetric: 'Interactive Showcase · 60fps Motion',
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'itm-gwalior',
    institution: 'ITM University, Gwalior',
    degree: 'B.Tech. — Computer Science & Engineering',
    period: 'Aug 2022 – Present',
    location: 'Gwalior, Madhya Pradesh',
    detail:
      'Focusing on Python Data Science, Machine Learning, Generative AI, Data Structures & Algorithms, SQL/NoSQL Databases, and building real-time full-stack web applications.',
  },
  {
    id: 'greenwood-12',
    institution: 'Greenwood Public School, Gwalior',
    degree: 'Class XII (CBSE) · Score: 68 / 100',
    period: 'Apr 2021 – May 2022',
    location: 'Gwalior, Madhya Pradesh',
    detail:
      'Senior secondary education building analytical foundations in Mathematics, Physics, and foundational programming logic.',
  },
  {
    id: 'greenwood-10',
    institution: 'Greenwood Public School, Gwalior',
    degree: 'Class X (CBSE) · Score: 78 / 100',
    period: 'Apr 2019 – Mar 2020',
    location: 'Gwalior, Madhya Pradesh',
    detail:
      'Completed secondary education with strong fundamentals in science, mathematics, and early curiosity for software systems.',
  },
];

export const WEATHER_MOOD_PRESETS: WeatherMoodPreset[] = [
  {
    id: 'monsoon',
    weatherLabel: 'Monsoon Drizzle · 23°C',
    cityContext: 'Gwalior Fort at Dusk',
    trackTitle: 'Midnight Monsoon Lo-Fi',
    artist: 'Weather-fm Curated Mix',
    vibeNote: 'Warm vinyl crackle + soft synth pads for rainy window coding.',
    bpm: 78,
  },
  {
    id: 'sunshine',
    weatherLabel: 'Golden Hour · 31°C',
    cityContext: 'Phoolbagh Morning',
    trackTitle: 'Solar Sprint Synthwave',
    artist: 'Weather-fm Upbeat',
    vibeNote: 'Crisp upbeat groove when your ML pipeline passes cross-validation.',
    bpm: 118,
  },
  {
    id: 'thunder',
    weatherLabel: 'Hackathon Storm · 19°C',
    cityContext: '3:00 AM Final Push',
    trackTitle: 'Deploy Or Bust Bassline',
    artist: 'Weather-fm Focus',
    vibeNote: 'High-focus electronic pulse for squashing last-minute bugs.',
    bpm: 128,
  },
  {
    id: 'breeze',
    weatherLabel: 'Clear Night Breeze · 21°C',
    cityContext: 'Aditya Puram Rooftop',
    trackTitle: 'Starlight Acoustic Echo',
    artist: 'Weather-fm Chill',
    vibeNote: 'Calm indie guitars for cleaning stubborn Pandas DataFrames.',
    bpm: 92,
  },
];
