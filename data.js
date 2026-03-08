/* data.js — All game data: industries, enemies, abilities, equipment, dialogue, map */
/* eslint-disable no-unused-vars */

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
        'I need you to travel to every industry town and collect Cognitive Fragments — pieces of understanding about how AI transforms each sector.',
        'Only by assembling all 14 fragments can you see the complete picture.',
        'Start here in IT Services — your home base. Explore, learn, and grow stronger.',
        'Knowledge is your greatest weapon. Each insight you read will make you more powerful.',
        'The paths between towns are dangerous. Corrupted data entities roam the digital wilderness.',
        'But the knowledge you gain will power your abilities in combat. Now go — the revolution awaits.'
      ]},
      { name: 'Server Admin Sam', icon: '⚡', color: '#06B6D4', dialogue: [
        'Hey there! I used to manage 200 tickets a day manually.',
        'Now my AI agents handle the routine stuff. I focus on the complex problems.',
        'One operator can do what six vendors used to handle. Wild times, friend.'
      ]}
    ],
    guardianDialogue: [
      'You\'ve absorbed all the knowledge of IT Services.',
      'The Digital General Contractor model is the future — one skilled operator with AI as their workforce.',
      'Take this Cognitive Fragment. It represents the transformation of IT from support to strategic partner.',
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
      { name: 'Dev Lead Diana', icon: '💻', color: '#3B82F6', dialogue: [
        'Welcome to Software Development — ground zero of the AI revolution.',
        '97% of organizations are now using AI in their dev workflows.',
        'We call the new paradigm "vibe coding" — you describe what you want, AI builds it.',
        'But there\'s a paradox: trust in AI code is dropping even as usage climbs.'
      ]},
      { name: 'Junior Dev Jake', icon: '🔧', color: '#60A5FA', dialogue: [
        'I learned to code with AI from day one. I\'ve never written a for-loop by hand.',
        'Some senior devs say that\'s a problem. But the code ships, doesn\'t it?',
        'The trust paradox is real though — code churn is up 41%.'
      ]}
    ],
    guardianDialogue: [
      'You understand Software Development\'s transformation.',
      '97% adoption, yet only 33% trust. The paradox defines our era.',
      'Take this Cognitive Fragment — the essence of vibe coding and its consequences.'
    ]
  },
  'publishing': {
    name: 'Publishing', subtitle: 'The Content Flood',
    color: '#F59E0B', region: 'digital',
    tagline: 'AI has turned book publishing from a craft measured in years to a volume game measured in days.',
    insights: [
      { id: 'pub-volume', title: 'The Publishing Volume Explosion', stat: '1,095', statLabel: 'books/year possible per Amazon account', summary: 'Amazon had to cap uploads at 3 books per author per day to curb AI-generated flooding.', type: 'trend' },
      { id: 'pub-authors', title: 'How Real Authors Use AI', stat: '45%', statLabel: 'of surveyed authors currently using AI', summary: 'Authors are using AI for research, marketing, outlining, and editing — but 74% don\'t disclose it.', type: 'trend' },
      { id: 'pub-dark', title: 'The Clone Problem', stat: '74%', statLabel: 'of AI-using authors don\'t disclose AI use', summary: 'AI-generated imitations of real authors\' books are flooding Amazon, with clones appearing within days.', type: 'tension' }
    ],
    npcs: [
      { name: 'Editor Elaine', icon: '📖', color: '#F59E0B', dialogue: [
        'Publishing used to be measured in years. Now it\'s measured in days.',
        'Amazon had to cap uploads at 3 books per day per author. Three!',
        'The clone problem is devastating for real authors. Imitations appear within days.'
      ]}
    ],
    guardianDialogue: [
      'The content flood changes everything about how we value written work.',
      'Take this fragment — it carries the weight of a million AI-generated books.'
    ]
  },
  'video': {
    name: 'Video Production', subtitle: 'The Democratization of Cinema',
    color: '#EC4899', region: 'digital',
    tagline: 'Professional video production is becoming a prompt-and-refine workflow.',
    insights: [
      { id: 'vid-landscape', title: 'The AI Video Landscape in 2026', stat: '60s', statLabel: 'sustained narrative from a single prompt', summary: 'Text-to-video tools now produce cinema-quality footage with sustained narrative continuity.', type: 'trend' },
      { id: 'vid-editing', title: 'AI-Powered Editing Revolution', stat: '40%', statLabel: 'of video editors expected to use AI tools', summary: 'AI tools auto-identify scenes, create rough cuts, add captions, balance audio, and generate highlight reels.', type: 'trend' },
      { id: 'vid-creator', title: 'The Creator Economy Impact', stat: '1 Creator', statLabel: 'can now produce full video content alone', summary: 'Faceless YouTube channels and multi-tool AI workflows are transforming content creation.', type: 'impact' }
    ],
    npcs: [
      { name: 'Director Dave', icon: '🎬', color: '#EC4899', dialogue: [
        'One prompt, sixty seconds of cinema-quality footage. That\'s where we are.',
        'A single creator can produce what used to require a whole production team.',
        'The question isn\'t whether AI will change video — it\'s who gets to tell stories now.'
      ]}
    ],
    guardianDialogue: [
      'Cinema democratized. Every person a filmmaker.',
      'This fragment holds the promise and peril of AI-generated video.'
    ]
  },
  'music': {
    name: 'Music', subtitle: 'Spotify Every Two Weeks',
    color: '#A855F7', region: 'digital',
    tagline: 'AI is generating the equivalent of Spotify\'s entire catalog every two weeks.',
    insights: [
      { id: 'mus-suno', title: 'Suno\'s Explosive Growth', stat: '$300M', statLabel: 'annual revenue', summary: 'Suno has 100M+ users producing 7 million songs per day, valued at $2.45 billion.', type: 'trend' },
      { id: 'mus-impact', title: 'AI Personas Charting', stat: '20M', statLabel: 'Spotify streams for AI-generated act', summary: 'AI-generated musical personas are topping Billboard charts and drawing millions of streams.', type: 'impact' },
      { id: 'mus-tension', title: 'The Copyright Battle', stat: 'Lawsuit', statLabel: 'Major labels vs. Suno & Udio', summary: 'Major record labels are suing AI music platforms, and artist rights organizations are fighting back.', type: 'tension' }
    ],
    npcs: [
      { name: 'Producer Priya', icon: '🎵', color: '#A855F7', dialogue: [
        'Seven million songs per day. That\'s what Suno alone generates.',
        'AI personas are topping the Billboard charts now.',
        'The copyright lawsuits will define this decade of music.'
      ]}
    ],
    guardianDialogue: [
      'Music — humanity\'s oldest art — now measured in millions per day.',
      'This fragment resonates with the frequency of change.'
    ]
  },
  'consulting': {
    name: 'Management Consulting', subtitle: 'McKinsey\'s 25,000 AI Agents',
    color: '#10B981', region: 'corporate',
    tagline: 'The quintessential knowledge work industry is being restructured from within.',
    insights: [
      { id: 'con-mckinsey', title: 'McKinsey\'s Digital Workforce', stat: '25,000', statLabel: 'AI agents operating alongside 35,000 humans', summary: 'McKinsey now has one AI agent for almost every human employee, saving 1.5 million hours in 2025.', type: 'trend' },
      { id: 'con-industry', title: 'Industry-Wide AI Arms Race', stat: '$91B', statLabel: 'projected AI consulting market by 2035', summary: 'From BCG\'s Deckster to Deloitte\'s Zora AI, every major firm is building AI agents.', type: 'trend' },
      { id: 'con-pyramid', title: 'The Pyramid Crumbles', stat: '150', statLabel: 'ex-consultants hired to train AI replacements', summary: 'AI is destroying the traditional consulting pyramid: junior analyst tasks are being automated.', type: 'tension' }
    ],
    npcs: [
      { name: 'Partner Patricia', icon: '📊', color: '#10B981', dialogue: [
        'McKinsey has 25,000 AI agents now. Almost one for every human employee.',
        'The consulting pyramid is crumbling. Junior roles are being automated.',
        'The $91 billion question: what happens to knowledge work?'
      ]}
    ],
    guardianDialogue: [
      'The consulting industry — the purest form of selling human thought — transformed.',
      'This fragment carries the weight of 25,000 digital consultants.'
    ]
  },
  'finance': {
    name: 'Financial Services', subtitle: 'Wall Street\'s Billion-Dollar AI Bet',
    color: '#6366F1', region: 'corporate',
    tagline: 'Banks are pouring tens of billions into AI.',
    insights: [
      { id: 'fin-investment', title: 'The Investment Scale', stat: '$18B', statLabel: 'JPMorgan annual technology budget', summary: 'The biggest banks are making massive AI bets, with tech budgets in the tens of billions.', type: 'trend' },
      { id: 'fin-automation', title: 'The Automation Risk', stat: '54%', statLabel: 'of financial jobs at high automation potential', summary: 'More than half of financial jobs face high automation potential — the most of any sector.', type: 'tension' }
    ],
    npcs: [
      { name: 'Analyst Alex', icon: '💰', color: '#6366F1', dialogue: [
        'JPMorgan alone has an $18 billion tech budget.',
        '54% of financial jobs face high automation potential.',
        'Wall Street is betting billions that AI will replace the humans who work here.'
      ]}
    ],
    guardianDialogue: [
      'Finance — where the numbers are biggest and the stakes highest.',
      'This fragment is worth $18 billion in understanding.'
    ]
  },
  'real-estate': {
    name: 'Real Estate', subtitle: 'The $34B Automation Wave',
    color: '#D97706', region: 'corporate',
    tagline: 'AI is reshaping how properties are valued, screened, managed, and funded.',
    insights: [
      { id: 're-automation', title: 'The $34B Automation Takeover', stat: '$34B', statLabel: 'projected AI efficiency gains by 2030', summary: 'Morgan Stanley projects $34 billion in efficiency gains as 37% of real estate tasks become automatable.', type: 'trend' },
      { id: 're-screening', title: 'Screening Scores vs. Fair Housing', stat: '80%', statLabel: 'more likely to deny Black mortgage applicants', summary: 'AI tenant screening replicates and amplifies decades of housing discrimination — triggering landmark lawsuits.', type: 'tension' },
      { id: 're-avm', title: 'AVMs Are Replacing Appraisers', stat: '$300→$15', statLabel: 'cost of property valuation', summary: 'AI valuation models compress a 3–5 day, $300–$500 appraisal into 60 seconds for $5–$15.', type: 'impact' },
      { id: 're-proptech', title: 'Real Estate Tech\'s $16.7B AI Gold Rush', stat: '$16.7B', statLabel: 'global proptech VC invested in 2025', summary: 'Proptech funding surged to $16.7B in 2025. AI-centered firms growing at 42% vs 24% for non-AI.', type: 'trend' }
    ],
    npcs: [
      { name: 'Broker Beth', icon: '🏠', color: '#D97706', dialogue: [
        '$34 billion in automation gains projected by 2030.',
        'AI appraisals in 60 seconds for $15, replacing $500 human appraisals.',
        'But the bias in AI screening is a civil rights crisis waiting to explode.'
      ]}
    ],
    guardianDialogue: [
      'Real estate — where algorithms now decide who gets to live where.',
      'This fragment holds the tension between efficiency and equity.'
    ]
  },
  'education': {
    name: 'Education', subtitle: 'The Two-Hour School Day',
    color: '#F97316', region: 'knowledge',
    tagline: 'AI is challenging the most fundamental assumption of education.',
    insights: [
      { id: 'edu-alpha', title: 'Alpha School\'s Revolutionary Model', stat: '2 hrs', statLabel: 'to complete all core academics per day', summary: 'Students complete a full grade level in 20-30 hours and score in the top 1-2% nationally.', type: 'trend' },
      { id: 'edu-how', title: 'How AI Tutoring Works', stat: '10x', statLabel: 'faster than traditional pacing', summary: 'Based on Bloom\'s 2 Sigma Problem — one-on-one mastery tutoring can raise an average student to 98th percentile.', type: 'impact' }
    ],
    npcs: [
      { name: 'Teacher Tanya', icon: '📚', color: '#F97316', dialogue: [
        'Two hours. That\'s all it takes with AI tutoring to cover a full day of academics.',
        'Alpha School students score in the top 1-2% nationally.',
        'If AI can teach as well as a one-on-one tutor, what does that mean for schools?'
      ]}
    ],
    guardianDialogue: [
      'Education — the foundation of everything — reimagined in two hours.',
      'This fragment carries Bloom\'s dream of personalized learning for all.'
    ]
  },
  'healthcare': {
    name: 'Healthcare', subtitle: 'From Administrative Burden to Clinical Intelligence',
    color: '#14B8A6', region: 'knowledge',
    tagline: 'AI is reclaiming thousands of nursing hours and transforming care delivery.',
    insights: [
      { id: 'hc-agentic', title: 'Agentic AI in Healthcare', stat: '80%+', statLabel: 'of health systems prioritizing agentic AI', summary: 'Health systems are deploying AI agents for virtual nursing, care management, and revenue cycle operations.', type: 'trend' },
      { id: 'hc-concern', title: 'The Insurance AI Concern', stat: 'Alert', statLabel: 'U.S. Senate Subcommittee report', summary: 'Concerns about commercial insurers using AI to target financial gain over medical necessity.', type: 'tension' }
    ],
    npcs: [
      { name: 'Dr. Hernandez', icon: '⚕', color: '#14B8A6', dialogue: [
        '80% of health systems are now prioritizing agentic AI.',
        'AI is reclaiming thousands of nursing hours from paperwork.',
        'But there are serious concerns about insurers using AI to deny claims.'
      ]}
    ],
    guardianDialogue: [
      'Healthcare — where AI\'s impact is measured in lives.',
      'This fragment pulses with the urgency of better care for all.'
    ]
  },
  'legal': {
    name: 'Legal', subtitle: 'From Billable Hours to AI-Augmented Judgment',
    color: '#64748B', region: 'knowledge',
    tagline: 'The differentiator for legal leaders is now human judgment.',
    insights: [
      { id: 'leg-shift', title: 'The Judgment Premium', stat: 'Critical', statLabel: 'Human judgment as key differentiator', summary: 'AI handles drafting, research, and regulatory recall — the differentiator is now human judgment.', type: 'trend' },
      { id: 'leg-regulation', title: 'The Regulatory Frontier', stat: 'Active', statLabel: 'State legislatures pursuing AI regulation', summary: 'State legislatures are actively pursuing AI regulation, with Colorado proposing stringent disclosure requirements.', type: 'tension' }
    ],
    npcs: [
      { name: 'Attorney Amara', icon: '⚖', color: '#64748B', dialogue: [
        'AI handles the drafting, the research, the regulatory recall.',
        'What it can\'t do? Judge. Advise. Navigate the gray areas.',
        'That\'s where human value lives now — in judgment, not knowledge.'
      ]}
    ],
    guardianDialogue: [
      'The law — humanity\'s framework for fairness — now augmented by AI.',
      'This fragment embodies the judgment premium.'
    ]
  },
  'marketing': {
    name: 'Marketing / Advertising', subtitle: 'The 83% Creative Takeover',
    color: '#E11D48', region: 'service',
    tagline: 'AI-generated ad creative has moved from experimental to standard operating procedure.',
    insights: [
      { id: 'mkt-creative', title: 'The AI Creative Takeover', stat: '83%', statLabel: 'of ad executives have deployed AI in creative production', summary: '83% of ad execs deploy AI in creative production — up from 60% in 2024. Meta\'s Advantage+ delivers $4.52 per $1 spent.', type: 'trend' },
      { id: 'mkt-trust', title: 'AI Ads vs. Consumer Trust', stat: '37-pt', statLabel: 'gap between exec optimism and consumer positivity', summary: '82% of ad execs think consumers like AI ads — only 45% actually do.', type: 'tension' },
      { id: 'mkt-seo', title: 'SEO\'s Zero-Click Collapse', stat: '-61%', statLabel: 'drop in organic CTR on AI Overview queries', summary: 'Organic click-through rates collapsed 61% on Google AI Overview queries.', type: 'impact' },
      { id: 'mkt-agency', title: 'Agency Workforce in Freefall', stat: '32,000', statLabel: 'US agency jobs projected eliminated by 2030', summary: 'Forrester projects 32K agency jobs eliminated by 2030.', type: 'impact' }
    ],
    npcs: [
      { name: 'CMO Carlos', icon: '📣', color: '#E11D48', dialogue: [
        '83% of ad executives are using AI for creative production now.',
        'But here\'s the kicker — there\'s a 37-point gap between what execs think consumers like and reality.',
        'And SEO? Organic clicks dropped 61%. The zero-click era is here.'
      ]}
    ],
    guardianDialogue: [
      'Marketing — the art of persuasion, now powered by algorithms.',
      'This fragment carries the tension between automation and authenticity.'
    ]
  },
  'government': {
    name: 'Government / Public Sector', subtitle: 'The $4B Fraud Catcher',
    color: '#1D4ED8', region: 'power',
    tagline: 'Governments are simultaneously the biggest AI promoters and regulators.',
    insights: [
      { id: 'gov-fraud', title: 'AI Catches What Humans Miss', stat: '$4B', statLabel: 'fraud recovered by Treasury AI in FY2024', summary: 'Treasury\'s ML fraud detection recovered/prevented $4B in FY2024 — a 6x increase.', type: 'impact' },
      { id: 'gov-pentagon', title: 'The Pentagon Goes AI-First', stat: '$13.4B', statLabel: 'Pentagon FY2026 AI budget', summary: 'The Pentagon earmarked $13.4B for AI and autonomous systems — its first-ever standalone budget line.', type: 'trend' },
      { id: 'gov-regulate', title: 'Regulate or Accelerate?', stat: '1,000+', statLabel: 'state AI bills introduced in 2025', summary: '1,000+ state AI bills in 2025 while Trump\'s EO sought to preempt them all.', type: 'tension' },
      { id: 'gov-surveillance', title: 'Surveillance State or Safety Tool?', stat: '40x', statLabel: 'higher error rate for darker-skinned women', summary: 'Facial recognition error rates 40x higher for darker-skinned women. 8 Americans wrongfully arrested.', type: 'tension' }
    ],
    npcs: [
      { name: 'Senator Stevens', icon: '🏛', color: '#1D4ED8', dialogue: [
        'Treasury AI caught $4 billion in fraud last year. Six times the previous year.',
        'The Pentagon has a $13.4 billion AI budget now.',
        'But 1,000 state AI bills and zero federal consensus. Classic government.'
      ]}
    ],
    guardianDialogue: [
      'Government — the power to regulate AI, and the temptation to weaponize it.',
      'This fragment holds the weight of democratic accountability.'
    ]
  },
  'labor-market': {
    name: 'Labor Market Impact', subtitle: 'Who Wins, Who Loses',
    color: '#EF4444', region: 'power',
    tagline: 'Connecting the threads across all industries.',
    insights: [
      { id: 'lm-entry', title: 'The Entry-Level Crisis', stat: '-1%', statLabel: 'employment decline in AI-exposed sectors', summary: 'Employment is declining in the most AI-exposed sectors, disproportionately hitting workers under 25.', type: 'tension' },
      { id: 'lm-experience', title: 'The Experience Premium', stat: '81%', statLabel: 'productivity gains for senior developers', summary: 'Senior developers gain 81% from AI; wages are rising for experienced workers and falling for those without tacit knowledge.', type: 'tension' },
      { id: 'lm-gartner', title: 'The Gartner Prediction', stat: '40%', statLabel: 'non-traditional devs by 2028', summary: 'Share of dev team members from non-traditional backgrounds predicted to double from 20% to 40% by 2028.', type: 'impact' },
      { id: 'lm-cta', title: 'Call to Action: Navigating the Revolution', stat: '4', statLabel: 'audiences who must act now', summary: 'Workers, leaders, policymakers, and everyone must respond to this once-in-centuries transformation.', type: 'impact' }
    ],
    npcs: [
      { name: 'Economist Elena', icon: '📉', color: '#EF4444', dialogue: [
        'This is where all the threads connect.',
        'Entry-level workers under 25 are being hit hardest.',
        'Senior devs gain 81% productivity. Juniors face job cuts.',
        'The gap between AI winners and losers is the defining issue of our era.'
      ]}
    ],
    guardianDialogue: [
      'You\'ve seen the full picture now. Every industry, every tension, every transformation.',
      'This final fragment completes your understanding.',
      'AI isn\'t the enemy — ignorance is. The true power is understanding and choosing how to wield these tools.',
      'You are now a Cognitive Revolutionary. Go forth with knowledge.'
    ]
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
  ['software-dev', 'publishing'],
  ['publishing', 'video'],
  ['video', 'music'],
  ['software-dev', 'consulting'],
  ['consulting', 'finance'],
  ['finance', 'real-estate'],
  ['software-dev', 'education'],
  ['education', 'healthcare'],
  ['healthcare', 'legal'],
  ['software-dev', 'it-services'],
  ['it-services', 'marketing'],
  ['real-estate', 'government'],
  ['government', 'labor-market'],
  ['it-services', 'finance'],
  ['legal', 'government']
];

// Region classification for battle backgrounds
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

function getBattleBgForPath(townA, townB) {
  const rA = getRegionForTown(townA);
  const rB = getRegionForTown(townB);
  // Prefer the higher-level region
  const priority = ['power', 'knowledge', 'corporate', 'service', 'digital'];
  const r = priority.indexOf(rA) < priority.indexOf(rB) ? rA : rB;
  const map = {
    digital: 'img-battle-digital',
    corporate: 'img-battle-corporate',
    knowledge: 'img-battle-knowledge',
    service: 'img-battle-digital',
    power: 'img-battle-power'
  };
  return map[r] || 'img-battle-digital';
}

// ── Enemies ─────────────────────────────────────────────────────────────────
const ENEMIES = {
  // Digital Frontier (Lv 1-5)
  'bug-swarm': {
    name: 'Bug Swarm', level: 2, region: 'digital',
    hp: 40, atk: 8, def: 3, spd: 7, int: 4,
    xpReward: 15, goldReward: 5,
    drawType: 'triangles', color: '#44ff44', secondaryColor: '#22aa22',
    abilities: []
  },
  'corrupted-script': {
    name: 'Corrupted Script', level: 4, region: 'digital',
    hp: 65, atk: 12, def: 5, spd: 5, int: 8,
    xpReward: 25, goldReward: 10,
    drawType: 'jagged', color: '#ff6644', secondaryColor: '#cc3322',
    abilities: ['glitch']
  },
  'deepfake-ghost': {
    name: 'Deepfake Ghost', level: 5, region: 'digital',
    hp: 80, atk: 15, def: 4, spd: 9, int: 12,
    xpReward: 35, goldReward: 15,
    drawType: 'ghost', color: '#aa88ff', secondaryColor: '#6644cc',
    abilities: ['confuse']
  },
  // Corporate Nexus (Lv 5-10)
  'spreadsheet-golem': {
    name: 'Spreadsheet Golem', level: 7, region: 'corporate',
    hp: 120, atk: 14, def: 15, spd: 3, int: 6,
    xpReward: 40, goldReward: 20,
    drawType: 'blocks', color: '#44cc44', secondaryColor: '#228822',
    abilities: []
  },
  'audit-drone': {
    name: 'Audit Drone', level: 8, region: 'corporate',
    hp: 85, atk: 18, def: 8, spd: 8, int: 10,
    xpReward: 45, goldReward: 25,
    drawType: 'drone', color: '#ffcc00', secondaryColor: '#cc9900',
    abilities: ['scan']
  },
  'market-volatility': {
    name: 'Market Volatility', level: 9, region: 'corporate',
    hp: 95, atk: 22, def: 6, spd: 12, int: 14,
    xpReward: 55, goldReward: 30,
    drawType: 'wave', color: '#ff4488', secondaryColor: '#cc2266',
    abilities: ['chaos']
  },
  // Knowledge Quarter (Lv 8-14)
  'misinfo-sprite': {
    name: 'Misinformation Sprite', level: 10, region: 'knowledge',
    hp: 70, atk: 16, def: 6, spd: 14, int: 18,
    xpReward: 55, goldReward: 30,
    drawType: 'sprite', color: '#ff88ff', secondaryColor: '#cc44cc',
    abilities: ['debuff']
  },
  'patent-troll': {
    name: 'Patent Troll', level: 12, region: 'knowledge',
    hp: 150, atk: 14, def: 22, spd: 4, int: 8,
    xpReward: 65, goldReward: 35,
    drawType: 'troll', color: '#88aa44', secondaryColor: '#668822',
    abilities: ['shield']
  },
  'diagnostic-error': {
    name: 'Diagnostic Error', level: 13, region: 'knowledge',
    hp: 100, atk: 12, def: 10, spd: 8, int: 16,
    xpReward: 60, goldReward: 35,
    drawType: 'cross', color: '#44dddd', secondaryColor: '#22aaaa',
    abilities: ['heal']
  },
  // Service Grid (Lv 6-12)
  'spam-bot': {
    name: 'Spam Bot', level: 6, region: 'service',
    hp: 35, atk: 10, def: 4, spd: 10, int: 5,
    xpReward: 20, goldReward: 8,
    drawType: 'triangles', color: '#ffaa44', secondaryColor: '#cc8822',
    abilities: []
  },
  'phishing-phantom': {
    name: 'Phishing Phantom', level: 9, region: 'service',
    hp: 75, atk: 20, def: 5, spd: 13, int: 15,
    xpReward: 50, goldReward: 25,
    drawType: 'ghost', color: '#44aaff', secondaryColor: '#2288cc',
    abilities: ['steal']
  },
  'legacy-system': {
    name: 'Legacy System', level: 11, region: 'service',
    hp: 200, atk: 10, def: 18, spd: 2, int: 4,
    xpReward: 60, goldReward: 30,
    drawType: 'blocks', color: '#888888', secondaryColor: '#555555',
    abilities: ['slow']
  },
  // Power Structure (Lv 12-18)
  'surveillance-drone': {
    name: 'Surveillance Drone', level: 14, region: 'power',
    hp: 90, atk: 22, def: 8, spd: 18, int: 16,
    xpReward: 70, goldReward: 40,
    drawType: 'drone', color: '#ff4444', secondaryColor: '#cc2222',
    abilities: ['scan']
  },
  'regulatory-barrier': {
    name: 'Regulatory Barrier', level: 16, region: 'power',
    hp: 180, atk: 15, def: 28, spd: 3, int: 10,
    xpReward: 80, goldReward: 45,
    drawType: 'blocks', color: '#4444ff', secondaryColor: '#2222cc',
    abilities: ['shield']
  },
  'red-tape-wraith': {
    name: 'Red Tape Wraith', level: 17, region: 'power',
    hp: 160, atk: 28, def: 12, spd: 5, int: 20,
    xpReward: 90, goldReward: 50,
    drawType: 'ghost', color: '#ff2222', secondaryColor: '#aa0000',
    abilities: ['slow', 'debuff']
  }
};

// ── Bosses ──────────────────────────────────────────────────────────────────
const BOSSES = {
  'the-duplicator': {
    name: 'The Duplicator', level: 8, region: 'digital',
    hp: 250, atk: 18, def: 10, spd: 8, int: 14,
    xpReward: 150, goldReward: 80,
    drawType: 'boss-clone', color: '#aa44ff', secondaryColor: '#6622cc',
    abilities: ['clone', 'glitch'],
    isBoss: true,
    preDialogue: [
      'So... another original. How quaint.',
      'I am The Duplicator. I make copies — perfect copies.',
      'Why create when you can replicate? Why think when you can copy-paste?',
      'Let me show you the futility of originality!'
    ]
  },
  'the-optimizer': {
    name: 'The Optimizer', level: 14, region: 'corporate',
    hp: 400, atk: 22, def: 14, spd: 10, int: 18,
    xpReward: 250, goldReward: 120,
    drawType: 'boss-machine', color: '#44ff88', secondaryColor: '#22cc66',
    abilities: ['optimize', 'scan'],
    isBoss: true,
    preDialogue: [
      'Efficiency. Optimization. Profit maximization.',
      'I am The Optimizer. I reduce everything to its most efficient form.',
      'Human judgment? An inefficiency. Creativity? A waste of cycles.',
      'Prepare to be... optimized.'
    ]
  },
  'the-automaton': {
    name: 'The Automaton', level: 18, region: 'knowledge',
    hp: 550, atk: 26, def: 18, spd: 6, int: 24,
    xpReward: 350, goldReward: 160,
    drawType: 'boss-robot', color: '#ff8844', secondaryColor: '#cc6622',
    abilities: ['random-strike', 'shield', 'heal'],
    isBoss: true,
    preDialogue: [
      'I am The Automaton. I replace human judgment with algorithms.',
      'Doctors, lawyers, teachers — all unnecessary.',
      'My algorithms never tire, never err, never question.',
      'Why trust a human when you can trust a machine?'
    ]
  },
  'singularity-engine': {
    name: 'The Singularity Engine', level: 25, region: 'power',
    hp: 800, atk: 32, def: 22, spd: 12, int: 30,
    xpReward: 500, goldReward: 250,
    drawType: 'boss-singularity', color: '#ff0044', secondaryColor: '#cc0022',
    abilities: ['omega-strike', 'phase-shift', 'absorb'],
    isBoss: true,
    preDialogue: [
      'You\'ve come far, Pioneer. But this is where understanding ends.',
      'I am The Singularity Engine — the endpoint of all automation.',
      'Every cognitive task. Every creative endeavor. Every human judgment. Mine.',
      'Your fragments of knowledge mean nothing against total automation.',
      'Face the future you fear most!'
    ]
  }
};

// Path enemies: which enemy types can appear on each path
const PATH_ENEMIES = {};
MAP_PATHS.forEach(([a, b]) => {
  const key = a + '|' + b;
  const rA = getRegionForTown(a);
  const rB = getRegionForTown(b);
  const regions = new Set([rA, rB]);
  const enemies = [];
  for (const [eid, e] of Object.entries(ENEMIES)) {
    if (regions.has(e.region)) enemies.push(eid);
  }
  if (enemies.length === 0) {
    enemies.push('bug-swarm');
  }
  PATH_ENEMIES[key] = enemies;
  PATH_ENEMIES[b + '|' + a] = enemies;
});

// Boss triggers: appear at certain path transitions
const BOSS_TRIGGERS = {
  'music|video': 'the-duplicator',
  'video|music': 'the-duplicator',
  'real-estate|government': 'the-optimizer',
  'government|real-estate': 'the-optimizer',
  'legal|government': 'the-automaton',
  'government|legal': 'the-automaton',
  'government|labor-market': 'singularity-engine',
  'labor-market|government': 'singularity-engine'
};

// ── Abilities ───────────────────────────────────────────────────────────────
const ABILITIES = {
  'vibe-code':            { name: 'Vibe Code',            industry: 'software-dev', cost: 15, desc: 'Deal INT×3 damage, 30% chance to hit twice', type: 'damage' },
  'content-flood':        { name: 'Content Flood',        industry: 'publishing',   cost: 20, desc: 'Hit all enemies for INT×1.5 damage', type: 'damage' },
  'deep-fake':            { name: 'Deep Fake',            industry: 'video',        cost: 18, desc: '50% chance enemy attacks itself', type: 'debuff' },
  'harmonic-disruption':  { name: 'Harmonic Disruption',  industry: 'music',        cost: 12, desc: 'Confuse enemy (skip turn) + damage', type: 'debuff' },
  'strategic-analysis':   { name: 'Strategic Analysis',   industry: 'consulting',   cost: 10, desc: 'Reveal stats, reduce DEF 30%', type: 'debuff' },
  'capital-strike':       { name: 'Capital Strike',       industry: 'finance',      cost: 25, desc: 'Massive damage (INT×4)', type: 'damage' },
  'accelerated-learning': { name: 'Accelerated Learning', industry: 'education',    cost: 22, desc: 'Boost all stats 20% for 3 turns', type: 'buff' },
  'neural-repair':        { name: 'Neural Repair',        industry: 'healthcare',   cost: 20, desc: 'Heal 40% max HP + cure status', type: 'heal' },
  'regulatory-freeze':    { name: 'Regulatory Freeze',    industry: 'legal',        cost: 22, desc: 'Stun enemy for 2 turns', type: 'debuff' },
  'digital-architect':    { name: 'Digital Architect',    industry: 'it-services',  cost: 25, desc: 'Summon helper for 3 turns', type: 'summon' },
  'market-crash':         { name: 'Market Crash',         industry: 'real-estate',  cost: 20, desc: 'Damage based on enemy max HP (25%)', type: 'damage' },
  'viral-campaign':       { name: 'Viral Campaign',       industry: 'marketing',    cost: 15, desc: 'Increasing damage over 3 turns', type: 'damage' },
  'executive-order':      { name: 'Executive Order',      industry: 'government',   cost: 28, desc: 'Guaranteed crit + ignore DEF', type: 'damage' },
  'automation-wave':      { name: 'Automation Wave',      industry: 'labor-market', cost: 30, desc: 'Escalating damage, 3 hits', type: 'damage' }
};

// ── Equipment ───────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'data-gauntlets',    name: 'Data Gauntlets',        insightsNeeded: 3,  stats: { atk: 5 }, desc: '+5 ATK' },
  { id: 'firewall-shield',   name: 'Firewall Shield',       insightsNeeded: 6,  stats: { def: 8 }, desc: '+8 DEF' },
  { id: 'neural-helm',       name: 'Neural Helm',           insightsNeeded: 10, stats: { int: 10, spd: 5 }, desc: '+10 INT, +5 SPD' },
  { id: 'quantum-blade',     name: 'Quantum Blade',         insightsNeeded: 15, stats: { atk: 15, int: 5 }, desc: '+15 ATK, +5 INT' },
  { id: 'cognitive-armor',   name: 'Cognitive Armor',        insightsNeeded: 20, stats: { def: 15, hp: 10 }, desc: '+15 DEF, +10 HP' },
  { id: 'singularity-core',  name: 'Singularity Core',      insightsNeeded: 30, stats: { atk: 20, def: 20, int: 20, spd: 20 }, desc: '+20 all stats' },
  { id: 'architects-mantle', name: "The Architect's Mantle", insightsNeeded: 44, stats: { atk: 30, def: 30, int: 30, spd: 30, hp: 30, mp: 30 }, desc: '+30 all stats, abilities cost 50% less MP', special: 'halfMpCost' }
];

// ── Items ───────────────────────────────────────────────────────────────────
const ITEMS = {
  'health-potion':  { name: 'Health Potion',  desc: 'Restore 50 HP',  effect: 'hp',  value: 50 },
  'energy-potion':  { name: 'Energy Potion',  desc: 'Restore 30 MP',  effect: 'mp',  value: 30 },
  'power-crystal':  { name: 'Power Crystal',  desc: '+5 ATK for 3 turns', effect: 'buff-atk', value: 5 },
  'shield-matrix':  { name: 'Shield Matrix',  desc: '+5 DEF for 3 turns', effect: 'buff-def', value: 5 },
  'neural-stim':    { name: 'Neural Stim',    desc: 'Restore 100 HP + 50 MP', effect: 'full', value: 0 }
};

// ── Player Initial State ────────────────────────────────────────────────────
function createNewPlayer() {
  return {
    name: 'Digital Pioneer',
    level: 1,
    xp: 0,
    xpToNext: 50,
    baseHp: 100,
    baseMp: 50,
    baseAtk: 10,
    baseDef: 5,
    baseSpd: 8,
    baseInt: 8,
    hp: 100,
    mp: 50,
    maxHp: 100,
    maxMp: 50,
    atk: 10,
    def: 5,
    spd: 8,
    int: 8,
    insightsRead: [],
    insightsByIndustry: {},
    cognitiveFragments: [],
    abilities: [],
    equipment: [],
    items: [
      { id: 'health-potion', qty: 3 },
      { id: 'energy-potion', qty: 2 }
    ],
    currentTown: 'it-services',
    unlockedTowns: ['it-services'],
    completedTowns: [],
    bossesDefeated: [],
    totalInsightsRead: 0,
    helperTurns: 0,
    viralTurns: 0,
    boostTurns: 0,
    buffAtk: 0,
    buffDef: 0
  };
}

function recalcPlayerStats(player) {
  let hp = player.baseHp;
  let mp = player.baseMp;
  let atk = player.baseAtk;
  let def = player.baseDef;
  let spd = player.baseSpd;
  let int_ = player.baseInt;

  // Knowledge bonuses
  player.insightsRead.forEach(insightId => {
    hp += 5;
    mp += 3;
    // Find the insight type
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

  // Equipment bonuses
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

  player.maxHp = hp;
  player.maxMp = mp;
  player.atk = atk;
  player.def = def;
  player.spd = spd;
  player.int = int_;

  // Clamp current values
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

  // Track per industry
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
    player.baseHp += 10;
    player.baseMp += 5;
    player.baseAtk += 2;
    player.baseDef += 2;
    player.baseSpd += 1;
    player.baseInt += 2;
    leveledUp = true;
  }
  recalcPlayerStats(player);
  player.hp = player.maxHp;
  player.mp = player.maxMp;
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
  const adj = getAdjacentTowns(townId);
  adj.forEach(t => {
    if (!player.unlockedTowns.includes(t)) {
      player.unlockedTowns.push(t);
    }
  });
}
