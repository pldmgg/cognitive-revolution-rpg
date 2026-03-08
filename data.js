/* data.js — All game data: characters, industries, maps, enemies, abilities, equipment, shops */
/* eslint-disable no-unused-vars */

// ── Tile Constants ──────────────────────────────────────────────────────────
const TILE = {
  VOID: 0, STONE: 1, WALL: 2, WATER: 3, GRASS: 4,
  TECH: 5, COBBLE: 6, DIRT: 7, WOOD: 8, SAND: 9,
  TREE: 10, MOUNTAIN: 11, BUILDING: 12
};

// Blocked tiles for collision
const BLOCKED_TILES = new Set([TILE.VOID, TILE.WALL, TILE.WATER, TILE.TREE, TILE.MOUNTAIN, TILE.BUILDING]);

// ── Character Data ──────────────────────────────────────────────────────────
const CHARACTER_DATA = {
  'it-services': {
    name: 'Alex Chen', title: 'Digital Architect', color: '#06B6D4',
    startTown: 'it-services', desc: 'A versatile IT professional turned digital general contractor.',
    startAbility: 'digital-architect',
    stats: { hp: 100, mp: 50, atk: 10, def: 8, spd: 8, int: 10 }
  },
  'software-dev': {
    name: 'Maya Torres', title: 'Code Weaver', color: '#3B82F6',
    startTown: 'software-dev', desc: 'A developer who bends code to her will with AI assistance.',
    startAbility: 'vibe-code',
    stats: { hp: 90, mp: 60, atk: 8, def: 5, spd: 9, int: 14 }
  },
  'publishing': {
    name: 'James Wright', title: 'Story Keeper', color: '#F59E0B',
    startTown: 'publishing', desc: 'A guardian of authentic storytelling in the age of content floods.',
    startAbility: 'content-flood',
    stats: { hp: 95, mp: 55, atk: 7, def: 6, spd: 7, int: 13 }
  },
  'video': {
    name: 'Zara Kim', title: 'Pixel Director', color: '#EC4899',
    startTown: 'video', desc: 'A filmmaker who creates cinema-quality content with a single prompt.',
    startAbility: 'deep-fake',
    stats: { hp: 85, mp: 50, atk: 9, def: 5, spd: 13, int: 10 }
  },
  'music': {
    name: 'Kai Rhythm', title: 'Sound Shaper', color: '#8B5CF6',
    startTown: 'music', desc: 'A musician navigating the world of AI-generated symphonies.',
    startAbility: 'harmonic-disruption',
    stats: { hp: 85, mp: 55, atk: 8, def: 5, spd: 12, int: 11 }
  },
  'consulting': {
    name: 'Diana Price', title: 'Strategy Maven', color: '#10B981',
    startTown: 'consulting', desc: 'A strategist who outthinks AI with human judgment.',
    startAbility: 'strategic-analysis',
    stats: { hp: 90, mp: 60, atk: 7, def: 7, spd: 8, int: 14 }
  },
  'finance': {
    name: 'Marcus Gold', title: 'Capital Striker', color: '#EAB308',
    startTown: 'finance', desc: 'A financial analyst wielding data as a weapon.',
    startAbility: 'capital-strike',
    stats: { hp: 100, mp: 45, atk: 14, def: 8, spd: 7, int: 9 }
  },
  'education': {
    name: 'Prof. Sarah Lane', title: 'Knowledge Sage', color: '#14B8A6',
    startTown: 'education', desc: 'An educator revolutionizing learning with AI tutoring.',
    startAbility: 'accelerated-learning',
    stats: { hp: 90, mp: 65, atk: 6, def: 6, spd: 7, int: 15 }
  },
  'healthcare': {
    name: 'Dr. Ravi Patel', title: 'Neural Mender', color: '#22D3EE',
    startTown: 'healthcare', desc: 'A doctor who heals both patients and systems.',
    startAbility: 'neural-repair',
    stats: { hp: 110, mp: 55, atk: 7, def: 12, spd: 6, int: 10 }
  },
  'legal': {
    name: 'Victoria Chase', title: 'Code of Law', color: '#6366F1',
    startTown: 'legal', desc: 'A lawyer whose judgment outperforms any algorithm.',
    startAbility: 'regulatory-freeze',
    stats: { hp: 105, mp: 50, atk: 8, def: 13, spd: 6, int: 10 }
  },
  'real-estate': {
    name: 'Tom Realty', title: 'Market Broker', color: '#F97316',
    startTown: 'real-estate', desc: 'A broker riding the wave of proptech disruption.',
    startAbility: 'market-crash',
    stats: { hp: 105, mp: 40, atk: 13, def: 9, spd: 8, int: 7 }
  },
  'marketing': {
    name: 'Jade Spark', title: 'Viral Artist', color: '#F43F5E',
    startTown: 'marketing', desc: 'A marketer who turns campaigns into cultural phenomena.',
    startAbility: 'viral-campaign',
    stats: { hp: 85, mp: 50, atk: 9, def: 5, spd: 13, int: 10 }
  },
  'government': {
    name: 'Commander Hayes', title: 'Executive Force', color: '#1E40AF',
    startTown: 'government', desc: 'A government operative with the authority to reshape policy.',
    startAbility: 'executive-order',
    stats: { hp: 110, mp: 45, atk: 14, def: 10, spd: 6, int: 8 }
  },
  'labor-market': {
    name: 'Dr. Ada Future', title: 'Workforce Analyst', color: '#84CC16',
    startTown: 'labor-market', desc: 'An economist tracking AI\'s impact on every worker.',
    startAbility: 'automation-wave',
    stats: { hp: 90, mp: 60, atk: 8, def: 6, spd: 8, int: 14 }
  }
};

// ── Industry Data ───────────────────────────────────────────────────────────
const INDUSTRIES = {
  'it-services': {
    name: 'IT Services / MSP', subtitle: 'The Digital General Contractor',
    color: '#06B6D4', region: 'service',
    tagline: 'AI transformed one skilled operator from a specialist into a general contractor with every license.',
    insights: [
      { id: 'it-old-model', title: 'The Old Model: Six Vendors, One Problem', stat: '6', statLabel: 'separate vendors needed for IT', summary: 'Traditional IT required hiring an MSP, web developer, software developer, marketing agency, security consultant, and cloud consultant.', type: 'trend' },
      { id: 'it-new-model', title: 'The New Reality: One GC With Every License', stat: '1', statLabel: 'skilled operator with access to every trade', summary: 'AI gave one skilled operator access to every trade and incredibly cheap labor.', type: 'trend' },
      { id: 'it-capabilities', title: 'What One AI-Enabled MSP Can Do', stat: 'All', statLabel: 'of these capabilities in one operator', summary: 'Build custom apps, integrate systems, create portals, automate workflows, develop SaaS, handle security, and migrate infrastructure.', type: 'impact' },
      { id: 'it-role-change', title: 'The Role Has Changed', stat: 'New', statLabel: 'category of IT provider', summary: 'From "We fix computers" to "We build, automate, integrate, secure, and scale your entire digital operation."', type: 'impact' },
      { id: 'it-dgc', title: 'The Digital General Contractor', stat: 'DGC', statLabel: 'The emerging role', summary: 'Not "the computer guy" but the Digital General Contractor — with instant blueprints, unlimited apprentices, and rapid iteration.', type: 'impact' }
    ],
    npcs: [
      { name: 'The Architect', icon: '◈', color: '#4af0c0', dialogue: [
        'Welcome, Digital Pioneer. I\'ve been expecting you.',
        'The world is changing — AI is reshaping every industry, every job, every assumption we held.',
        'I need you to travel to every industry town and collect Cognitive Fragments.',
        'Only by assembling all 14 fragments can you see the complete picture.',
        'Start here in IT Services — your home base. Explore, learn, and grow stronger.'
      ]},
      { name: 'Server Admin Sam', icon: '⚡', color: '#06B6D4', dialogue: [
        'Hey there! I used to manage 200 tickets a day manually.',
        'Now my AI agents handle the routine stuff. I focus on the complex problems.',
        'One operator can do what six vendors used to handle. Wild times, friend.'
      ]}
    ],
    guardianDialogue: [
      'You\'ve absorbed all the knowledge of IT Services.',
      'The Digital General Contractor model is the future.',
      'Take this Cognitive Fragment. It represents the transformation of IT.',
      'The world beyond awaits. Use this knowledge wisely.'
    ]
  },
  'software-dev': {
    name: 'Software Development', subtitle: 'Ground Zero of the Revolution',
    color: '#3B82F6', region: 'digital',
    tagline: 'The sector where AI\'s impact is most measurable and immediate.',
    insights: [
      { id: 'sd-adoption', title: 'Near-Universal Adoption', stat: '97%', statLabel: 'of organizations using AI in dev workflows', summary: 'AI coding tools have achieved near-total penetration. Only 3.1% of organizations remain disengaged.', type: 'trend' },
      { id: 'sd-vibe-coding', title: '"Vibe Coding" — The New Paradigm', stat: '62%', statLabel: 'of orgs experimenting with autonomous coding agents', summary: 'Intent-driven development: developers describe what they want in natural language, and AI agents build it.', type: 'trend' },
      { id: 'sd-tension', title: 'The Trust Paradox', stat: '33%', statLabel: 'developer trust in AI code accuracy (down from 43%)', summary: 'Code churn is up 41%, duplication increased 4x, and developer trust is dropping — yet usage keeps climbing.', type: 'tension' }
    ],
    npcs: [
      { name: 'Dev Lead Diana', icon: '◈', color: '#3B82F6', dialogue: [
        'Welcome to Software Development — ground zero of the AI revolution.',
        '97% of organizations are now using AI in their dev workflows.',
        'We call the new paradigm "vibe coding" — you describe what you want, AI builds it.'
      ]},
      { name: 'Junior Dev Jake', icon: '⚡', color: '#60A5FA', dialogue: [
        'I learned to code with AI from day one.',
        'Some senior devs say that\'s a problem. But the code ships, doesn\'t it?'
      ]}
    ],
    guardianDialogue: ['You understand Software Development\'s transformation.', 'Take this Cognitive Fragment — the essence of vibe coding.']
  },
  'publishing': {
    name: 'Publishing', subtitle: 'The Content Flood', color: '#F59E0B', region: 'digital',
    tagline: 'AI has turned book publishing from a craft measured in years to a volume game.',
    insights: [
      { id: 'pub-volume', title: 'The Publishing Volume Explosion', stat: '1,095', statLabel: 'books/year possible per Amazon account', summary: 'Amazon had to cap uploads at 3 books per author per day.', type: 'trend' },
      { id: 'pub-authors', title: 'How Real Authors Use AI', stat: '45%', statLabel: 'of surveyed authors currently using AI', summary: 'Authors use AI for research, marketing, outlining, and editing — but 74% don\'t disclose it.', type: 'trend' },
      { id: 'pub-dark', title: 'The Clone Problem', stat: '74%', statLabel: 'of AI-using authors don\'t disclose AI use', summary: 'AI-generated imitations flood Amazon within days of a real book\'s release.', type: 'tension' }
    ],
    npcs: [{ name: 'Editor Elaine', icon: '◈', color: '#F59E0B', dialogue: ['Publishing used to be measured in years. Now it\'s measured in days.', 'Amazon had to cap uploads at 3 books per day per author.']}],
    guardianDialogue: ['The content flood changes everything.', 'Take this fragment.']
  },
  'video': {
    name: 'Video Production', subtitle: 'The Democratization of Cinema', color: '#EC4899', region: 'digital',
    tagline: 'Professional video production is becoming a prompt-and-refine workflow.',
    insights: [
      { id: 'vid-landscape', title: 'The AI Video Landscape', stat: '60s', statLabel: 'sustained narrative from a single prompt', summary: 'Text-to-video tools produce cinema-quality footage with narrative continuity.', type: 'trend' },
      { id: 'vid-editing', title: 'AI-Powered Editing Revolution', stat: '40%', statLabel: 'of video editors expected to use AI tools', summary: 'AI tools auto-identify scenes, create rough cuts, add captions, and generate highlight reels.', type: 'trend' },
      { id: 'vid-creator', title: 'The Creator Economy Impact', stat: '1 Creator', statLabel: 'can now produce full video content alone', summary: 'Faceless YouTube channels and multi-tool AI workflows are transforming content creation.', type: 'impact' }
    ],
    npcs: [{ name: 'Director Dave', icon: '◈', color: '#EC4899', dialogue: ['One prompt, sixty seconds of cinema-quality footage.', 'A single creator can produce what used to require a whole team.']}],
    guardianDialogue: ['Cinema democratized. Every person a filmmaker.', 'This fragment holds that promise.']
  },
  'music': {
    name: 'Music', subtitle: 'Spotify Every Two Weeks', color: '#A855F7', region: 'digital',
    tagline: 'AI is generating the equivalent of Spotify\'s entire catalog every two weeks.',
    insights: [
      { id: 'mus-suno', title: 'Suno\'s Explosive Growth', stat: '$300M', statLabel: 'annual revenue', summary: 'Suno has 100M+ users producing 7 million songs per day, valued at $2.45 billion.', type: 'trend' },
      { id: 'mus-impact', title: 'AI Personas Charting', stat: '20M', statLabel: 'Spotify streams for AI-generated act', summary: 'AI-generated musical personas are topping Billboard charts.', type: 'impact' },
      { id: 'mus-tension', title: 'The Copyright Battle', stat: 'Lawsuit', statLabel: 'Major labels vs. Suno & Udio', summary: 'Major record labels are suing AI music platforms.', type: 'tension' }
    ],
    npcs: [{ name: 'Producer Priya', icon: '◈', color: '#A855F7', dialogue: ['Seven million songs per day. That\'s what Suno alone generates.', 'The copyright lawsuits will define this decade of music.']}],
    guardianDialogue: ['Music — humanity\'s oldest art — now measured in millions per day.', 'This fragment resonates.']
  },
  'consulting': {
    name: 'Management Consulting', subtitle: 'McKinsey\'s 25,000 AI Agents', color: '#10B981', region: 'corporate',
    tagline: 'The quintessential knowledge work industry is being restructured from within.',
    insights: [
      { id: 'con-mckinsey', title: 'McKinsey\'s Digital Workforce', stat: '25,000', statLabel: 'AI agents alongside 35,000 humans', summary: 'McKinsey now has one AI agent for almost every human employee.', type: 'trend' },
      { id: 'con-industry', title: 'Industry-Wide AI Arms Race', stat: '$91B', statLabel: 'projected AI consulting market by 2035', summary: 'Every major firm is building AI agents.', type: 'trend' },
      { id: 'con-pyramid', title: 'The Pyramid Crumbles', stat: '150', statLabel: 'ex-consultants hired to train AI replacements', summary: 'AI is destroying the traditional consulting pyramid.', type: 'tension' }
    ],
    npcs: [{ name: 'Partner Patricia', icon: '◈', color: '#10B981', dialogue: ['McKinsey has 25,000 AI agents now.', 'The consulting pyramid is crumbling.']}],
    guardianDialogue: ['The consulting industry — transformed.', 'This fragment carries the weight of 25,000 digital consultants.']
  },
  'finance': {
    name: 'Financial Services', subtitle: 'Wall Street\'s Billion-Dollar AI Bet', color: '#6366F1', region: 'corporate',
    tagline: 'Banks are pouring tens of billions into AI.',
    insights: [
      { id: 'fin-investment', title: 'The Investment Scale', stat: '$18B', statLabel: 'JPMorgan annual technology budget', summary: 'The biggest banks are making massive AI bets.', type: 'trend' },
      { id: 'fin-automation', title: 'The Automation Risk', stat: '54%', statLabel: 'of financial jobs at high automation potential', summary: 'More than half of financial jobs face high automation potential.', type: 'tension' }
    ],
    npcs: [{ name: 'Analyst Alex', icon: '◈', color: '#6366F1', dialogue: ['JPMorgan alone has an $18 billion tech budget.', '54% of financial jobs face high automation potential.']}],
    guardianDialogue: ['Finance — where the numbers are biggest.', 'This fragment is worth $18 billion in understanding.']
  },
  'real-estate': {
    name: 'Real Estate', subtitle: 'The $34B Automation Wave', color: '#D97706', region: 'corporate',
    tagline: 'AI is reshaping how properties are valued, screened, managed, and funded.',
    insights: [
      { id: 're-automation', title: 'The $34B Automation Takeover', stat: '$34B', statLabel: 'projected AI efficiency gains by 2030', summary: 'Morgan Stanley projects $34 billion in efficiency gains.', type: 'trend' },
      { id: 're-screening', title: 'Screening Scores vs. Fair Housing', stat: '80%', statLabel: 'more likely to deny Black mortgage applicants', summary: 'AI tenant screening amplifies decades of housing discrimination.', type: 'tension' },
      { id: 're-avm', title: 'AVMs Are Replacing Appraisers', stat: '$300→$15', statLabel: 'cost of property valuation', summary: 'AI valuation compresses a 3-5 day, $300-$500 appraisal into 60 seconds for $5-$15.', type: 'impact' },
      { id: 're-proptech', title: 'Real Estate Tech\'s Gold Rush', stat: '$16.7B', statLabel: 'global proptech VC invested in 2025', summary: 'Proptech funding surged to $16.7B in 2025.', type: 'trend' }
    ],
    npcs: [{ name: 'Broker Beth', icon: '◈', color: '#D97706', dialogue: ['$34 billion in automation gains projected by 2030.', 'But the bias in AI screening is a civil rights crisis.']}],
    guardianDialogue: ['Real estate — where algorithms decide who lives where.', 'This fragment holds that tension.']
  },
  'education': {
    name: 'Education', subtitle: 'The Two-Hour School Day', color: '#F97316', region: 'knowledge',
    tagline: 'AI is challenging the most fundamental assumption of education.',
    insights: [
      { id: 'edu-alpha', title: 'Alpha School\'s Revolutionary Model', stat: '2 hrs', statLabel: 'to complete all core academics per day', summary: 'Students complete a full grade level in 20-30 hours and score in the top 1-2% nationally.', type: 'trend' },
      { id: 'edu-how', title: 'How AI Tutoring Works', stat: '10x', statLabel: 'faster than traditional pacing', summary: 'One-on-one mastery tutoring can raise an average student to 98th percentile.', type: 'impact' }
    ],
    npcs: [{ name: 'Teacher Tanya', icon: '◈', color: '#F97316', dialogue: ['Two hours. That\'s all it takes with AI tutoring.', 'Alpha School students score in the top 1-2% nationally.']}],
    guardianDialogue: ['Education reimagined in two hours.', 'This fragment carries Bloom\'s dream.']
  },
  'healthcare': {
    name: 'Healthcare', subtitle: 'Clinical Intelligence', color: '#14B8A6', region: 'knowledge',
    tagline: 'AI is reclaiming thousands of nursing hours and transforming care delivery.',
    insights: [
      { id: 'hc-agentic', title: 'Agentic AI in Healthcare', stat: '80%+', statLabel: 'of health systems prioritizing agentic AI', summary: 'Health systems are deploying AI agents for virtual nursing and care management.', type: 'trend' },
      { id: 'hc-concern', title: 'The Insurance AI Concern', stat: 'Alert', statLabel: 'U.S. Senate Subcommittee report', summary: 'Concerns about insurers using AI to target financial gain over medical necessity.', type: 'tension' }
    ],
    npcs: [{ name: 'Dr. Hernandez', icon: '◈', color: '#14B8A6', dialogue: ['80% of health systems are prioritizing agentic AI.', 'But there are serious concerns about insurers using AI to deny claims.']}],
    guardianDialogue: ['Healthcare — where AI\'s impact is measured in lives.', 'This fragment pulses with urgency.']
  },
  'legal': {
    name: 'Legal', subtitle: 'AI-Augmented Judgment', color: '#64748B', region: 'knowledge',
    tagline: 'The differentiator for legal leaders is now human judgment.',
    insights: [
      { id: 'leg-shift', title: 'The Judgment Premium', stat: 'Critical', statLabel: 'Human judgment as key differentiator', summary: 'AI handles drafting, research, and recall — the differentiator is now human judgment.', type: 'trend' },
      { id: 'leg-regulation', title: 'The Regulatory Frontier', stat: 'Active', statLabel: 'State legislatures pursuing AI regulation', summary: 'State legislatures are actively pursuing AI regulation.', type: 'tension' }
    ],
    npcs: [{ name: 'Attorney Amara', icon: '◈', color: '#64748B', dialogue: ['AI handles the drafting, the research, the regulatory recall.', 'What it can\'t do? Judge. Advise. Navigate the gray areas.']}],
    guardianDialogue: ['The law — augmented by AI.', 'This fragment embodies the judgment premium.']
  },
  'marketing': {
    name: 'Marketing / Advertising', subtitle: 'The 83% Creative Takeover', color: '#E11D48', region: 'service',
    tagline: 'AI-generated ad creative has moved from experimental to standard.',
    insights: [
      { id: 'mkt-creative', title: 'The AI Creative Takeover', stat: '83%', statLabel: 'of ad executives using AI in creative production', summary: '83% of ad execs deploy AI in creative production.', type: 'trend' },
      { id: 'mkt-trust', title: 'AI Ads vs. Consumer Trust', stat: '37-pt', statLabel: 'gap between exec optimism and consumer positivity', summary: '82% of ad execs think consumers like AI ads — only 45% actually do.', type: 'tension' },
      { id: 'mkt-seo', title: 'SEO\'s Zero-Click Collapse', stat: '-61%', statLabel: 'drop in organic CTR on AI Overview queries', summary: 'Organic click-through rates collapsed 61%.', type: 'impact' },
      { id: 'mkt-agency', title: 'Agency Workforce in Freefall', stat: '32,000', statLabel: 'US agency jobs projected eliminated by 2030', summary: 'Forrester projects 32K agency jobs eliminated by 2030.', type: 'impact' }
    ],
    npcs: [{ name: 'CMO Carlos', icon: '◈', color: '#E11D48', dialogue: ['83% of ad executives are using AI for creative production.', 'There\'s a 37-point gap between what execs think and reality.']}],
    guardianDialogue: ['Marketing — persuasion powered by algorithms.', 'This fragment carries the tension.']
  },
  'government': {
    name: 'Government / Public Sector', subtitle: 'The $4B Fraud Catcher', color: '#1D4ED8', region: 'power',
    tagline: 'Governments are simultaneously the biggest AI promoters and regulators.',
    insights: [
      { id: 'gov-fraud', title: 'AI Catches What Humans Miss', stat: '$4B', statLabel: 'fraud recovered by Treasury AI in FY2024', summary: 'Treasury\'s ML fraud detection recovered/prevented $4B — a 6x increase.', type: 'impact' },
      { id: 'gov-pentagon', title: 'The Pentagon Goes AI-First', stat: '$13.4B', statLabel: 'Pentagon FY2026 AI budget', summary: 'The Pentagon earmarked $13.4B for AI and autonomous systems.', type: 'trend' },
      { id: 'gov-regulate', title: 'Regulate or Accelerate?', stat: '1,000+', statLabel: 'state AI bills introduced in 2025', summary: '1,000+ state AI bills in 2025 while federal policy was fragmented.', type: 'tension' },
      { id: 'gov-surveillance', title: 'Surveillance State or Safety Tool?', stat: '40x', statLabel: 'higher error rate for darker-skinned women', summary: 'Facial recognition error rates 40x higher for darker-skinned women.', type: 'tension' }
    ],
    npcs: [{ name: 'Senator Stevens', icon: '◈', color: '#1D4ED8', dialogue: ['Treasury AI caught $4 billion in fraud last year.', 'But 1,000 state AI bills and zero federal consensus.']}],
    guardianDialogue: ['Government — the power to regulate AI.', 'This fragment holds the weight of democratic accountability.']
  },
  'labor-market': {
    name: 'Labor Market Impact', subtitle: 'Who Wins, Who Loses', color: '#EF4444', region: 'power',
    tagline: 'Connecting the threads across all industries.',
    insights: [
      { id: 'lm-entry', title: 'The Entry-Level Crisis', stat: '-1%', statLabel: 'employment decline in AI-exposed sectors', summary: 'Employment is declining disproportionately hitting workers under 25.', type: 'tension' },
      { id: 'lm-experience', title: 'The Experience Premium', stat: '81%', statLabel: 'productivity gains for senior developers', summary: 'Senior developers gain 81% from AI; wages are rising for experienced workers.', type: 'tension' },
      { id: 'lm-gartner', title: 'The Gartner Prediction', stat: '40%', statLabel: 'non-traditional devs by 2028', summary: 'Share of non-traditional dev team members predicted to double.', type: 'impact' },
      { id: 'lm-cta', title: 'Call to Action', stat: '4', statLabel: 'audiences who must act now', summary: 'Workers, leaders, policymakers, and everyone must respond.', type: 'impact' }
    ],
    npcs: [{ name: 'Economist Elena', icon: '◈', color: '#EF4444', dialogue: ['This is where all the threads connect.', 'Senior devs gain 81% productivity. Juniors face job cuts.']}],
    guardianDialogue: ['You\'ve seen the full picture now.', 'This final fragment completes your understanding.', 'You are now a Cognitive Revolutionary.']
  }
};

// ── Map Layout (normalized 0-1 coords) ──────────────────────────────────────
const MAP_NODES = {
  'it-services':   { x: 0.50, y: 0.50 },
  'software-dev':  { x: 0.25, y: 0.35 },
  'publishing':    { x: 0.18, y: 0.20 },
  'video':         { x: 0.10, y: 0.12 },
  'music':         { x: 0.05, y: 0.05 },
  'consulting':    { x: 0.42, y: 0.25 },
  'finance':       { x: 0.60, y: 0.22 },
  'real-estate':   { x: 0.75, y: 0.30 },
  'education':     { x: 0.30, y: 0.55 },
  'healthcare':    { x: 0.20, y: 0.68 },
  'legal':         { x: 0.15, y: 0.82 },
  'marketing':     { x: 0.65, y: 0.55 },
  'government':    { x: 0.78, y: 0.65 },
  'labor-market':  { x: 0.88, y: 0.82 }
};

const MAP_PATHS = [
  ['software-dev', 'publishing'], ['publishing', 'video'], ['video', 'music'],
  ['software-dev', 'consulting'], ['consulting', 'finance'], ['finance', 'real-estate'],
  ['software-dev', 'education'], ['education', 'healthcare'], ['healthcare', 'legal'],
  ['software-dev', 'it-services'], ['it-services', 'marketing'],
  ['real-estate', 'government'], ['government', 'labor-market'],
  ['it-services', 'finance'], ['legal', 'government']
];

const REGION_MAP = {
  digital: ['software-dev', 'publishing', 'video', 'music'],
  corporate: ['consulting', 'finance', 'real-estate'],
  knowledge: ['education', 'healthcare', 'legal'],
  service: ['it-services', 'marketing'],
  power: ['government', 'labor-market']
};

function getRegionForTown(townId) {
  for (const [region, towns] of Object.entries(REGION_MAP)) {
    if (towns.includes(townId)) return region;
  }
  return 'digital';
}

function getBattleBgForRegion(region) {
  const map = {
    digital: 'img-battle-digital', corporate: 'img-battle-corporate',
    knowledge: 'img-battle-knowledge', service: 'img-battle-digital', power: 'img-battle-power'
  };
  return map[region] || 'img-battle-digital';
}

// ── Enemies ─────────────────────────────────────────────────────────────────
const ENEMIES = {
  'bug-swarm': { name: 'Bug Swarm', level: 2, region: 'digital', hp: 40, atk: 8, def: 3, spd: 7, int: 4, xpReward: 15, goldReward: 8, drawType: 'triangles', color: '#44ff44', secondaryColor: '#22aa22', abilities: [] },
  'corrupted-script': { name: 'Corrupted Script', level: 4, region: 'digital', hp: 65, atk: 12, def: 5, spd: 5, int: 8, xpReward: 25, goldReward: 12, drawType: 'jagged', color: '#ff6644', secondaryColor: '#cc3322', abilities: ['glitch'] },
  'deepfake-ghost': { name: 'Deepfake Ghost', level: 5, region: 'digital', hp: 80, atk: 15, def: 4, spd: 9, int: 12, xpReward: 35, goldReward: 18, drawType: 'ghost', color: '#aa88ff', secondaryColor: '#6644cc', abilities: ['confuse'] },
  'spreadsheet-golem': { name: 'Spreadsheet Golem', level: 7, region: 'corporate', hp: 120, atk: 14, def: 15, spd: 3, int: 6, xpReward: 40, goldReward: 22, drawType: 'blocks', color: '#44cc44', secondaryColor: '#228822', abilities: [] },
  'audit-drone': { name: 'Audit Drone', level: 8, region: 'corporate', hp: 85, atk: 18, def: 8, spd: 8, int: 10, xpReward: 45, goldReward: 28, drawType: 'drone', color: '#ffcc00', secondaryColor: '#cc9900', abilities: ['scan'] },
  'market-volatility': { name: 'Market Volatility', level: 9, region: 'corporate', hp: 95, atk: 22, def: 6, spd: 12, int: 14, xpReward: 55, goldReward: 32, drawType: 'wave', color: '#ff4488', secondaryColor: '#cc2266', abilities: ['chaos'] },
  'misinfo-sprite': { name: 'Misinfo Sprite', level: 10, region: 'knowledge', hp: 70, atk: 16, def: 6, spd: 14, int: 18, xpReward: 55, goldReward: 32, drawType: 'sprite', color: '#ff88ff', secondaryColor: '#cc44cc', abilities: ['debuff'] },
  'patent-troll': { name: 'Patent Troll', level: 12, region: 'knowledge', hp: 150, atk: 14, def: 22, spd: 4, int: 8, xpReward: 65, goldReward: 38, drawType: 'troll', color: '#88aa44', secondaryColor: '#668822', abilities: ['shield'] },
  'diagnostic-error': { name: 'Diagnostic Error', level: 13, region: 'knowledge', hp: 100, atk: 12, def: 10, spd: 8, int: 16, xpReward: 60, goldReward: 36, drawType: 'cross', color: '#44dddd', secondaryColor: '#22aaaa', abilities: ['heal'] },
  'spam-bot': { name: 'Spam Bot', level: 6, region: 'service', hp: 35, atk: 10, def: 4, spd: 10, int: 5, xpReward: 20, goldReward: 10, drawType: 'triangles', color: '#ffaa44', secondaryColor: '#cc8822', abilities: [] },
  'phishing-phantom': { name: 'Phishing Phantom', level: 9, region: 'service', hp: 75, atk: 20, def: 5, spd: 13, int: 15, xpReward: 50, goldReward: 28, drawType: 'ghost', color: '#44aaff', secondaryColor: '#2288cc', abilities: ['steal'] },
  'legacy-system': { name: 'Legacy System', level: 11, region: 'service', hp: 200, atk: 10, def: 18, spd: 2, int: 4, xpReward: 60, goldReward: 32, drawType: 'blocks', color: '#888888', secondaryColor: '#555555', abilities: ['slow'] },
  'surveillance-drone': { name: 'Surveillance Drone', level: 14, region: 'power', hp: 90, atk: 22, def: 8, spd: 18, int: 16, xpReward: 70, goldReward: 42, drawType: 'drone', color: '#ff4444', secondaryColor: '#cc2222', abilities: ['scan'] },
  'regulatory-barrier': { name: 'Regulatory Barrier', level: 16, region: 'power', hp: 180, atk: 15, def: 28, spd: 3, int: 10, xpReward: 80, goldReward: 48, drawType: 'blocks', color: '#4444ff', secondaryColor: '#2222cc', abilities: ['shield'] },
  'red-tape-wraith': { name: 'Red Tape Wraith', level: 17, region: 'power', hp: 160, atk: 28, def: 12, spd: 5, int: 20, xpReward: 90, goldReward: 52, drawType: 'ghost', color: '#ff2222', secondaryColor: '#aa0000', abilities: ['slow', 'debuff'] }
};

const BOSSES = {
  'the-duplicator': { name: 'The Duplicator', level: 8, region: 'digital', hp: 250, atk: 18, def: 10, spd: 8, int: 14, xpReward: 150, goldReward: 80, drawType: 'boss-clone', color: '#aa44ff', secondaryColor: '#6622cc', abilities: ['clone', 'glitch'], isBoss: true,
    preDialogue: ['So... another original. How quaint.', 'I am The Duplicator. I make copies — perfect copies.', 'Let me show you the futility of originality!']
  },
  'the-optimizer': { name: 'The Optimizer', level: 14, region: 'corporate', hp: 400, atk: 22, def: 14, spd: 10, int: 18, xpReward: 250, goldReward: 120, drawType: 'boss-machine', color: '#44ff88', secondaryColor: '#22cc66', abilities: ['optimize', 'scan'], isBoss: true,
    preDialogue: ['Efficiency. Optimization. Profit maximization.', 'I am The Optimizer.', 'Prepare to be... optimized.']
  },
  'the-automaton': { name: 'The Automaton', level: 18, region: 'knowledge', hp: 550, atk: 26, def: 18, spd: 6, int: 24, xpReward: 350, goldReward: 160, drawType: 'boss-robot', color: '#ff8844', secondaryColor: '#cc6622', abilities: ['random-strike', 'shield', 'heal'], isBoss: true,
    preDialogue: ['I am The Automaton. I replace human judgment.', 'Why trust a human when you can trust a machine?']
  },
  'singularity-engine': { name: 'The Singularity Engine', level: 25, region: 'power', hp: 800, atk: 32, def: 22, spd: 12, int: 30, xpReward: 500, goldReward: 250, drawType: 'boss-singularity', color: '#ff0044', secondaryColor: '#cc0022', abilities: ['omega-strike', 'phase-shift', 'absorb'], isBoss: true,
    preDialogue: ['You\'ve come far, Pioneer.', 'I am The Singularity Engine.', 'Face the future you fear most!']
  }
};

// ── Region enemies lookup ───────────────────────────────────────────────────
function getEnemiesForRegion(region) {
  const enemies = [];
  for (const [eid, e] of Object.entries(ENEMIES)) {
    if (e.region === region) enemies.push(eid);
  }
  return enemies.length > 0 ? enemies : ['bug-swarm'];
}

// ── Abilities ───────────────────────────────────────────────────────────────
const ABILITIES = {
  'vibe-code':            { name: 'Vibe Code',            industry: 'software-dev', cost: 15, desc: 'Deal INT×3 damage, 30% chance to hit twice', type: 'damage' },
  'content-flood':        { name: 'Content Flood',        industry: 'publishing',   cost: 20, desc: 'Hit all enemies for INT×1.5 damage', type: 'damage' },
  'deep-fake':            { name: 'Deep Fake',            industry: 'video',        cost: 18, desc: '50% chance enemy attacks itself', type: 'debuff' },
  'harmonic-disruption':  { name: 'Harmonic Disruption',  industry: 'music',        cost: 12, desc: 'Confuse enemy + damage', type: 'debuff' },
  'strategic-analysis':   { name: 'Strategic Analysis',   industry: 'consulting',   cost: 10, desc: 'Reveal stats, reduce DEF 30%', type: 'debuff' },
  'capital-strike':       { name: 'Capital Strike',       industry: 'finance',      cost: 25, desc: 'Massive damage (INT×4)', type: 'damage' },
  'accelerated-learning': { name: 'Accelerated Learning', industry: 'education',    cost: 22, desc: 'Boost all stats 20% for 3 turns', type: 'buff' },
  'neural-repair':        { name: 'Neural Repair',        industry: 'healthcare',   cost: 20, desc: 'Heal 40% max HP + cure status', type: 'heal' },
  'regulatory-freeze':    { name: 'Regulatory Freeze',    industry: 'legal',        cost: 22, desc: 'Stun enemy for 2 turns', type: 'debuff' },
  'digital-architect':    { name: 'Digital Architect',    industry: 'it-services',  cost: 25, desc: 'Summon helper for 3 turns', type: 'summon' },
  'market-crash':         { name: 'Market Crash',         industry: 'real-estate',  cost: 20, desc: '25% enemy max HP damage', type: 'damage' },
  'viral-campaign':       { name: 'Viral Campaign',       industry: 'marketing',    cost: 15, desc: 'Increasing damage over 3 turns', type: 'damage' },
  'executive-order':      { name: 'Executive Order',      industry: 'government',   cost: 28, desc: 'Guaranteed crit + ignore DEF', type: 'damage' },
  'automation-wave':      { name: 'Automation Wave',      industry: 'labor-market', cost: 30, desc: 'Escalating damage, 3 hits', type: 'damage' }
};

// ── Equipment ───────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'data-gauntlets',    name: 'Data Gauntlets',    insightsNeeded: 3,  stats: { atk: 5 }, desc: '+5 ATK' },
  { id: 'firewall-shield',   name: 'Firewall Shield',   insightsNeeded: 6,  stats: { def: 8 }, desc: '+8 DEF' },
  { id: 'neural-helm',       name: 'Neural Helm',       insightsNeeded: 10, stats: { int: 10, spd: 5 }, desc: '+10 INT, +5 SPD' },
  { id: 'quantum-blade',     name: 'Quantum Blade',     insightsNeeded: 15, stats: { atk: 15, int: 5 }, desc: '+15 ATK, +5 INT' },
  { id: 'cognitive-armor',   name: 'Cognitive Armor',    insightsNeeded: 20, stats: { def: 15, hp: 10 }, desc: '+15 DEF, +10 HP' },
  { id: 'singularity-core',  name: 'Singularity Core',  insightsNeeded: 30, stats: { atk: 20, def: 20, int: 20, spd: 20 }, desc: '+20 all stats' },
  { id: 'architects-mantle', name: "Architect's Mantle", insightsNeeded: 44, stats: { atk: 30, def: 30, int: 30, spd: 30, hp: 30, mp: 30 }, desc: '+30 all, half MP cost', special: 'halfMpCost' }
];

// ── Items ───────────────────────────────────────────────────────────────────
const ITEMS = {
  'health-potion':  { name: 'Health Potion',  desc: 'Restore 50 HP',  effect: 'hp',  value: 50, cost: 50 },
  'energy-potion':  { name: 'Energy Potion',  desc: 'Restore 30 MP',  effect: 'mp',  value: 30, cost: 50 },
  'greater-health': { name: 'Greater Health Potion', desc: 'Restore 120 HP', effect: 'hp', value: 120, cost: 150 },
  'greater-mind':   { name: 'Greater Mind Potion', desc: 'Restore 80 MP', effect: 'mp', value: 80, cost: 150 },
  'antidote':       { name: 'Antidote',       desc: 'Cure status',     effect: 'cure', value: 0, cost: 30 },
  'smoke-bomb':     { name: 'Smoke Bomb',     desc: 'Escape battle',   effect: 'escape', value: 0, cost: 100 },
  'power-crystal':  { name: 'Power Crystal',  desc: '+5 ATK for 3 turns', effect: 'buff-atk', value: 5, cost: 80 },
  'shield-matrix':  { name: 'Shield Matrix',  desc: '+5 DEF for 3 turns', effect: 'buff-def', value: 5, cost: 80 },
  'neural-stim':    { name: 'Neural Stim',    desc: 'Restore 100 HP + 50 MP', effect: 'full', value: 0, cost: 200 }
};

// ── Shop inventories ────────────────────────────────────────────────────────
const SHOP_GENERAL = ['health-potion', 'energy-potion', 'greater-health', 'greater-mind', 'antidote', 'smoke-bomb'];
const SHOP_WEAPON = ['power-crystal', 'shield-matrix', 'neural-stim'];

// ── Player creation ─────────────────────────────────────────────────────────
function createNewPlayer(industryKey) {
  const char = CHARACTER_DATA[industryKey];
  const s = char.stats;
  return {
    name: char.name,
    title: char.title,
    industryKey: industryKey,
    color: char.color,
    level: 1, xp: 0, xpToNext: 50, gold: 200,
    baseHp: s.hp, baseMp: s.mp, baseAtk: s.atk, baseDef: s.def, baseSpd: s.spd, baseInt: s.int,
    hp: s.hp, mp: s.mp, maxHp: s.hp, maxMp: s.mp,
    atk: s.atk, def: s.def, spd: s.spd, int: s.int,
    insightsRead: [], insightsByIndustry: {}, cognitiveFragments: [],
    abilities: [char.startAbility], equipment: [],
    items: [
      { id: 'health-potion', qty: 3 },
      { id: 'energy-potion', qty: 2 }
    ],
    currentTown: industryKey, currentMap: 'town',
    unlockedTowns: [industryKey], completedTowns: [],
    bossesDefeated: [], totalInsightsRead: 0,
    helperTurns: 0, viralTurns: 0, boostTurns: 0, buffAtk: 0, buffDef: 0
  };
}

function recalcPlayerStats(player) {
  let hp = player.baseHp, mp = player.baseMp;
  let atk = player.baseAtk, def = player.baseDef;
  let spd = player.baseSpd, int_ = player.baseInt;
  player.insightsRead.forEach(insightId => {
    hp += 5; mp += 3;
    for (const ind of Object.values(INDUSTRIES)) {
      const ins = ind.insights.find(i => i.id === insightId);
      if (ins) {
        if (ins.type === 'trend') int_ += 2;
        else if (ins.type === 'tension') def += 2;
        else if (ins.type === 'impact') atk += 2;
        break;
      }
    }
  });
  player.equipment.forEach(eqId => {
    const eq = EQUIPMENT.find(e => e.id === eqId);
    if (eq) {
      if (eq.stats.atk) atk += eq.stats.atk;
      if (eq.stats.def) def += eq.stats.def;
      if (eq.stats.int) int_ += eq.stats.int;
      if (eq.stats.spd) spd += eq.stats.spd;
      if (eq.stats.hp) hp += eq.stats.hp;
      if (eq.stats.mp) mp += eq.stats.mp;
    }
  });
  player.maxHp = hp; player.maxMp = mp;
  player.atk = atk; player.def = def; player.spd = spd; player.int = int_;
  if (player.hp > player.maxHp) player.hp = player.maxHp;
  if (player.mp > player.maxMp) player.mp = player.maxMp;
}

function checkEquipmentUnlocks(player) {
  const count = player.totalInsightsRead;
  EQUIPMENT.forEach(eq => {
    if (count >= eq.insightsNeeded && !player.equipment.includes(eq.id)) {
      player.equipment.push(eq.id);
    }
  });
}

function checkAbilityUnlocks(player) {
  for (const [indId, ind] of Object.entries(INDUSTRIES)) {
    const allRead = ind.insights.every(ins => player.insightsRead.includes(ins.id));
    if (allRead) {
      const ability = Object.entries(ABILITIES).find(([, a]) => a.industry === indId);
      if (ability && !player.abilities.includes(ability[0])) {
        player.abilities.push(ability[0]);
      }
    }
  }
}

function addInsight(player, insightId) {
  if (player.insightsRead.includes(insightId)) return false;
  player.insightsRead.push(insightId);
  player.totalInsightsRead++;
  for (const [indId, ind] of Object.entries(INDUSTRIES)) {
    if (ind.insights.find(i => i.id === insightId)) {
      if (!player.insightsByIndustry[indId]) player.insightsByIndustry[indId] = [];
      player.insightsByIndustry[indId].push(insightId);
      break;
    }
  }
  checkEquipmentUnlocks(player);
  checkAbilityUnlocks(player);
  recalcPlayerStats(player);
  return true;
}

function gainXP(player, amount) {
  player.xp += amount;
  let leveledUp = false;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = Math.floor(player.xpToNext * 1.4);
    player.baseHp += 10; player.baseMp += 5;
    player.baseAtk += 2; player.baseDef += 2;
    player.baseSpd += 1; player.baseInt += 2;
    leveledUp = true;
  }
  recalcPlayerStats(player);
  player.hp = player.maxHp; player.mp = player.maxMp;
  return leveledUp;
}

function getAdjacentTowns(townId) {
  const adj = [];
  MAP_PATHS.forEach(([a, b]) => {
    if (a === townId) adj.push(b);
    else if (b === townId) adj.push(a);
  });
  return adj;
}

function unlockAdjacentTowns(player, townId) {
  getAdjacentTowns(townId).forEach(t => {
    if (!player.unlockedTowns.includes(t)) player.unlockedTowns.push(t);
  });
}

// ── Town Map Generator ──────────────────────────────────────────────────────
// Generate a 30x30 town map procedurally based on the industry
function generateTownMap(industryKey) {
  const ind = INDUSTRIES[industryKey];
  const W = 30, H = 30;
  const tiles = [];
  
  // Fill with base tile
  const baseTile = industryKey === 'it-services' ? TILE.TECH : TILE.STONE;
  for (let y = 0; y < H; y++) {
    tiles[y] = [];
    for (let x = 0; x < W; x++) {
      // Border = wall/trees
      if (x === 0 || x === W-1 || y === 0 || y === H-1) {
        tiles[y][x] = TILE.TREE;
      } else if (x === 1 || x === W-2 || y === 1 || y === H-2) {
        tiles[y][x] = TILE.TREE;
      } else {
        tiles[y][x] = TILE.GRASS;
      }
    }
  }
  
  // Town center - square area with cobblestone roads
  for (let y = 8; y < 22; y++) {
    for (let x = 8; x < 22; x++) {
      tiles[y][x] = baseTile;
    }
  }
  
  // Roads
  for (let x = 2; x < W-2; x++) { tiles[15][x] = TILE.COBBLE; tiles[14][x] = TILE.COBBLE; }
  for (let y = 2; y < H-2; y++) { tiles[y][15] = TILE.COBBLE; tiles[y][14] = TILE.COBBLE; }
  
  // Buildings (blocks of wall tiles) - positioned around the center
  // General Store (west side)
  for (let y = 10; y < 14; y++) for (let x = 4; x < 8; x++) tiles[y][x] = TILE.WALL;
  // Inn (north side)
  for (let y = 3; y < 7; y++) for (let x = 12; x < 17; x++) tiles[y][x] = TILE.WALL;
  // Weapon Shop (east side)
  for (let y = 10; y < 14; y++) for (let x = 22; x < 26; x++) tiles[y][x] = TILE.WALL;
  // Knowledge Archive (south side - larger)
  for (let y = 23; y < 27; y++) for (let x = 10; x < 20; x++) tiles[y][x] = TILE.BUILDING;
  
  // Doorway tiles (walkable in front of buildings)
  tiles[14][6] = TILE.COBBLE; // shop door area
  tiles[7][14] = TILE.COBBLE; // inn door area
  tiles[14][23] = TILE.COBBLE; // weapon door area
  tiles[22][15] = TILE.COBBLE; // archive door area
  
  // Town exit (bottom center)
  tiles[H-1][14] = TILE.DIRT; tiles[H-1][15] = TILE.DIRT;
  tiles[H-2][14] = TILE.DIRT; tiles[H-2][15] = TILE.DIRT;
  
  // Decorative trees around edges
  const treePositions = [[3,3],[3,26],[26,3],[26,26],[5,20],[24,8],[5,16],[24,18]];
  treePositions.forEach(([y,x]) => { if (tiles[y] && tiles[y][x] === TILE.GRASS) tiles[y][x] = TILE.TREE; });
  
  // Water feature near center
  tiles[12][12] = TILE.WATER; tiles[12][13] = TILE.WATER;
  tiles[13][12] = TILE.WATER; tiles[13][13] = TILE.WATER;
  
  // Objects
  const objects = [];
  const insightList = ind.insights;
  
  // Knowledge points in the archive area
  insightList.forEach((insight, i) => {
    const kx = 11 + (i % 4) * 2;
    const ky = 21;
    objects.push({ type: 'knowledge', x: kx, y: ky, insightId: insight.id });
  });
  
  // NPCs
  if (ind.npcs) {
    ind.npcs.forEach((npc, i) => {
      const nx = 10 + i * 4;
      const ny = 16;
      objects.push({ type: 'npc', x: nx, y: ny, id: npc.name, npcData: npc });
    });
  }
  
  // Guardian NPC near center
  objects.push({ type: 'guardian', x: 15, y: 10, id: 'Town Guardian', industryKey: industryKey });
  
  // Shop/Inn/Weapon triggers (placed in front of buildings)
  objects.push({ type: 'shop', x: 6, y: 14, id: 'General Store' });
  objects.push({ type: 'inn', x: 14, y: 7, id: 'Inn' });
  objects.push({ type: 'weapon', x: 23, y: 14, id: 'Weapon Shop' });
  
  // Exit
  objects.push({ type: 'exit', x: 14, y: H-2, target: 'overworld' });
  objects.push({ type: 'exit', x: 15, y: H-2, target: 'overworld' });
  
  return { width: W, height: H, tiles, objects, industryKey };
}

// Cache town maps
const TOWN_MAPS = {};
function getTownMap(industryKey) {
  if (!TOWN_MAPS[industryKey]) {
    TOWN_MAPS[industryKey] = generateTownMap(industryKey);
  }
  return TOWN_MAPS[industryKey];
}

// ── Overworld Map ───────────────────────────────────────────────────────────
const OW_W = 80, OW_H = 60;

function generateOverworldMap() {
  const tiles = [];
  
  // Fill with grass
  for (let y = 0; y < OW_H; y++) {
    tiles[y] = [];
    for (let x = 0; x < OW_W; x++) {
      tiles[y][x] = TILE.GRASS;
    }
  }
  
  // Border with mountains
  for (let x = 0; x < OW_W; x++) { tiles[0][x] = TILE.MOUNTAIN; tiles[OW_H-1][x] = TILE.MOUNTAIN; }
  for (let y = 0; y < OW_H; y++) { tiles[y][0] = TILE.MOUNTAIN; tiles[y][OW_W-1] = TILE.MOUNTAIN; }
  
  // Town positions on overworld (mapped from normalized coords)
  const townPositions = {};
  for (const [key, node] of Object.entries(MAP_NODES)) {
    const tx = Math.floor(node.x * (OW_W - 6)) + 3;
    const ty = Math.floor(node.y * (OW_H - 6)) + 3;
    townPositions[key] = { x: tx, y: ty };
  }
  
  // Draw paths between connected towns
  MAP_PATHS.forEach(([a, b]) => {
    const posA = townPositions[a];
    const posB = townPositions[b];
    // Simple L-shaped path
    const midX = Math.floor((posA.x + posB.x) / 2);
    // Horizontal from A to mid
    const startX = Math.min(posA.x, midX);
    const endX = Math.max(posA.x, midX);
    for (let x = startX; x <= endX; x++) {
      if (tiles[posA.y]) tiles[posA.y][x] = TILE.DIRT;
    }
    // Vertical from A.y to B.y at midX
    const startY = Math.min(posA.y, posB.y);
    const endY = Math.max(posA.y, posB.y);
    for (let y = startY; y <= endY; y++) {
      if (tiles[y]) tiles[y][midX] = TILE.DIRT;
    }
    // Horizontal from mid to B
    const startX2 = Math.min(midX, posB.x);
    const endX2 = Math.max(midX, posB.x);
    for (let x = startX2; x <= endX2; x++) {
      if (tiles[posB.y]) tiles[posB.y][x] = TILE.DIRT;
    }
  });
  
  // Forest areas (clusters of trees)
  const forestCenters = [[15,10],[60,15],[10,40],[55,45],[35,25],[70,35]];
  forestCenters.forEach(([fx,fy]) => {
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const tx = fx + dx, ty = fy + dy;
        if (tx > 0 && tx < OW_W-1 && ty > 0 && ty < OW_H-1) {
          if (tiles[ty][tx] === TILE.GRASS && Math.random() < 0.6) {
            tiles[ty][tx] = TILE.TREE;
          }
        }
      }
    }
  });
  
  // Mountain areas
  const mountainCenters = [[5,5],[75,5],[40,8],[65,50]];
  mountainCenters.forEach(([mx,my]) => {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const tx = mx + dx, ty = my + dy;
        if (tx > 0 && tx < OW_W-1 && ty > 0 && ty < OW_H-1) {
          if (tiles[ty][tx] === TILE.GRASS && Math.random() < 0.7) {
            tiles[ty][tx] = TILE.MOUNTAIN;
          }
        }
      }
    }
  });
  
  // Water features (river)
  for (let y = 5; y < 35; y++) {
    const rx = 30 + Math.floor(Math.sin(y * 0.3) * 3);
    if (rx > 0 && rx < OW_W-1 && tiles[y][rx] !== TILE.DIRT) {
      tiles[y][rx] = TILE.WATER;
      if (rx+1 < OW_W-1 && tiles[y][rx+1] !== TILE.DIRT) tiles[y][rx+1] = TILE.WATER;
    }
  }
  // Lake
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const lx = 50 + dx, ly = 40 + dy;
      if (lx > 0 && lx < OW_W-1 && ly > 0 && ly < OW_H-1) {
        if (Math.abs(dx) + Math.abs(dy) < 5 && tiles[ly][lx] !== TILE.DIRT) {
          tiles[ly][lx] = TILE.WATER;
        }
      }
    }
  }
  
  // Clear paths over trees/water/mountains that were placed
  MAP_PATHS.forEach(([a, b]) => {
    const posA = townPositions[a];
    const posB = townPositions[b];
    const midX = Math.floor((posA.x + posB.x) / 2);
    const startX = Math.min(posA.x, midX);
    const endX = Math.max(posA.x, midX);
    for (let x = startX; x <= endX; x++) {
      if (tiles[posA.y]) tiles[posA.y][x] = TILE.DIRT;
    }
    const startY = Math.min(posA.y, posB.y);
    const endY = Math.max(posA.y, posB.y);
    for (let y = startY; y <= endY; y++) {
      if (tiles[y]) tiles[y][midX] = TILE.DIRT;
    }
    const startX2 = Math.min(midX, posB.x);
    const endX2 = Math.max(midX, posB.x);
    for (let x = startX2; x <= endX2; x++) {
      if (tiles[posB.y]) tiles[posB.y][x] = TILE.DIRT;
    }
  });
  
  // Sand patches
  [[20,52],[60,25]].forEach(([sx,sy]) => {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const tx = sx+dx, ty = sy+dy;
        if (tx > 0 && tx < OW_W-1 && ty > 0 && ty < OW_H-1) {
          if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.SAND;
        }
      }
    }
  });
  
  // Objects on overworld
  const objects = [];
  
  // Town entrances
  for (const [key, pos] of Object.entries(townPositions)) {
    // Clear area around town entrance
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = pos.x+dx, ty = pos.y+dy;
        if (tx > 0 && tx < OW_W-1 && ty > 0 && ty < OW_H-1) {
          tiles[ty][tx] = TILE.COBBLE;
        }
      }
    }
    objects.push({ type: 'town-entrance', x: pos.x, y: pos.y, townId: key });
  }
  
  // Campfire rest points
  const campfires = [[25,20],[50,30],[15,50],[65,40]];
  campfires.forEach(([cx,cy]) => {
    if (tiles[cy] && tiles[cy][cx]) {
      tiles[cy][cx] = TILE.DIRT;
      objects.push({ type: 'campfire', x: cx, y: cy });
    }
  });
  
  // Signposts near town entrances
  for (const [key, pos] of Object.entries(townPositions)) {
    objects.push({ type: 'signpost', x: pos.x + 2, y: pos.y, townId: key });
  }
  
  return { width: OW_W, height: OW_H, tiles, objects, townPositions };
}

const OVERWORLD_MAP = generateOverworldMap();

// ── Encounter rates by tile ─────────────────────────────────────────────────
function getEncounterRate(tileType) {
  switch(tileType) {
    case TILE.DIRT: case TILE.COBBLE: return 0;
    case TILE.GRASS: return 0.12;
    case TILE.SAND: return 0.10;
    case TILE.TREE: return 0; // trees are blocked so this won't trigger
    default: return 0.08;
  }
}
