/* GameData.js — All game constants, industry data, characters, enemies, items, towns */
/* eslint-disable no-unused-vars */

// ── Tile Constants ─────────────────────────────────────────────────────────
const TILE = {
  VOID: 0, STONE: 1, WALL: 2, WATER: 3, GRASS: 4,
  TECH: 5, COBBLE: 6, DIRT: 7, WOOD: 8, SAND: 9,
  TREE: 10, MOUNTAIN: 11, BUILDING: 12, ROAD: 13
};
const BLOCKED_TILES = new Set([TILE.VOID, TILE.WALL, TILE.WATER, TILE.TREE, TILE.MOUNTAIN, TILE.BUILDING]);

// ── Character Definitions ──────────────────────────────────────────────────
const CHARACTER_DATA = {
  'it-services': {
    name: 'Alex Chen', title: 'Digital Architect', color: '#06B6D4',
    portrait: 'alex-chen',
    startTown: 'it-services', desc: 'A versatile IT professional turned digital general contractor.',
    backstory: 'Once just "the computer guy," Alex now wields AI as a full digital toolset — building, securing, and scaling entire digital operations solo.',
    startAbility: 'digital-architect',
    stats: { hp: 100, mp: 50, atk: 10, def: 8, spd: 8, int: 10 }
  },
  'software-dev': {
    name: 'Maya Torres', title: 'Code Weaver', color: '#3B82F6',
    portrait: 'maya-torres',
    startTown: 'software-dev', desc: 'A developer who bends code to her will with AI assistance.',
    backstory: 'Maya embraced "vibe coding" early — she describes what she wants in plain language and AI builds it. 97% of her peers already do this.',
    startAbility: 'vibe-code',
    stats: { hp: 90, mp: 60, atk: 8, def: 5, spd: 9, int: 14 }
  },
  'publishing': {
    name: 'James Wright', title: 'Story Keeper', color: '#F59E0B',
    portrait: 'james-wright',
    startTown: 'publishing', desc: 'A guardian of authentic storytelling in the age of content floods.',
    backstory: 'Amazon now limits 3 books/day per author to fight AI flooding. James fights for the signal in the noise.',
    startAbility: 'content-flood',
    stats: { hp: 95, mp: 55, atk: 7, def: 6, spd: 7, int: 13 }
  },
  'video': {
    name: 'Zara Kim', title: 'Pixel Director', color: '#EC4899',
    portrait: 'zara-kim',
    startTown: 'video', desc: 'A filmmaker creating cinema-quality content with a single prompt.',
    backstory: 'Text-to-video tools now produce 60-second cinema-quality footage. Zara leads what was once a 50-person production team — alone.',
    startAbility: 'deep-fake',
    stats: { hp: 85, mp: 50, atk: 9, def: 5, spd: 13, int: 10 }
  },
  'music': {
    name: 'Kai Rhythm', title: 'Sound Shaper', color: '#8B5CF6',
    portrait: 'kai-rhythm',
    startTown: 'music', desc: 'A musician navigating AI-generated symphonies at 7M songs per day.',
    backstory: 'Suno generates 7 million songs a day — the equivalent of Spotify\'s entire catalog every two weeks. Kai finds beauty in the chaos.',
    startAbility: 'harmonic-disruption',
    stats: { hp: 85, mp: 55, atk: 8, def: 5, spd: 12, int: 11 }
  },
  'consulting': {
    name: 'Diana Price', title: 'Strategy Maven', color: '#10B981',
    portrait: 'diana-price',
    startTown: 'consulting', desc: 'A strategist who outthinks AI with human judgment.',
    backstory: 'McKinsey has 25,000 AI agents alongside 35,000 humans. Diana ensures human insight still matters at the top.',
    startAbility: 'strategic-analysis',
    stats: { hp: 90, mp: 60, atk: 7, def: 7, spd: 8, int: 14 }
  },
  'finance': {
    name: 'Marcus Gold', title: 'Capital Striker', color: '#EAB308',
    portrait: 'marcus-gold',
    startTown: 'finance', desc: 'A financial analyst wielding data as a weapon.',
    backstory: 'JPMorgan\'s $18B tech budget makes Wall Street the biggest AI investor. Marcus rides the wave and shapes it.',
    startAbility: 'capital-strike',
    stats: { hp: 100, mp: 45, atk: 14, def: 8, spd: 7, int: 9 }
  },
  'education': {
    name: 'Prof. Sarah Lane', title: 'Knowledge Sage', color: '#14B8A6',
    portrait: 'sarah-lane',
    startTown: 'education', desc: 'An educator revolutionizing learning with AI tutoring.',
    backstory: 'Alpha School students complete all academics in 2 hours using AI, then spend afternoons on real-world projects. Sarah shows how.',
    startAbility: 'accelerated-learning',
    stats: { hp: 90, mp: 65, atk: 6, def: 6, spd: 7, int: 15 }
  },
  'healthcare': {
    name: 'Dr. Ravi Patel', title: 'Neural Mender', color: '#22D3EE',
    portrait: 'ravi-patel',
    startTown: 'healthcare', desc: 'A doctor who heals both patients and systems.',
    backstory: '80%+ of health systems prioritize agentic AI. Ravi deploys AI for virtual nursing while safeguarding medical judgment.',
    startAbility: 'neural-repair',
    stats: { hp: 110, mp: 55, atk: 7, def: 12, spd: 6, int: 10 }
  },
  'legal': {
    name: 'Victoria Chase', title: 'Code of Law', color: '#6366F1',
    portrait: 'victoria-chase',
    startTown: 'legal', desc: 'A lawyer whose judgment outperforms any algorithm.',
    backstory: 'AI handles drafting and research. Victoria\'s differentiator is human judgment, strategic partnership, and knowing when the AI is wrong.',
    startAbility: 'regulatory-freeze',
    stats: { hp: 105, mp: 50, atk: 8, def: 13, spd: 6, int: 10 }
  },
  'real-estate': {
    name: 'Tom Realty', title: 'Market Broker', color: '#F97316',
    portrait: 'tom-realty',
    startTown: 'real-estate', desc: 'A broker riding the wave of proptech disruption.',
    backstory: '$34B in AI efficiency gains by 2030. AVMs compress 5-day appraisals to 60 seconds. Tom pivots faster than the market.',
    startAbility: 'market-crash',
    stats: { hp: 105, mp: 40, atk: 13, def: 9, spd: 8, int: 7 }
  },
  'marketing': {
    name: 'Jade Spark', title: 'Viral Artist', color: '#F43F5E',
    portrait: 'jade-spark',
    startTown: 'marketing', desc: 'A marketer who turns campaigns into cultural phenomena.',
    backstory: '83% of ad execs use AI creative. 32,000 agency jobs disappear by 2030. Jade is one of the AI-skilled who command a 43% salary premium.',
    startAbility: 'viral-campaign',
    stats: { hp: 85, mp: 50, atk: 9, def: 5, spd: 13, int: 10 }
  },
  'government': {
    name: 'Commander Hayes', title: 'Executive Force', color: '#1E40AF',
    portrait: 'commander-hayes',
    startTown: 'government', desc: 'A government operative reshaping policy in the AI age.',
    backstory: 'Treasury AI caught $4B in fraud. The Pentagon earmarked $13.4B for AI warfare. Commander Hayes operates at the intersection of power and technology.',
    startAbility: 'executive-order',
    stats: { hp: 110, mp: 45, atk: 14, def: 10, spd: 6, int: 8 }
  },
  'labor-market': {
    name: 'Dr. Ada Future', title: 'Workforce Analyst', color: '#84CC16',
    portrait: 'ada-future',
    startTown: 'labor-market', desc: 'An economist tracking AI\'s impact on every worker.',
    backstory: 'Entry-level hiring down 50%. Senior devs gain 81% from AI. Ada charts the path through the greatest labor transformation in history.',
    startAbility: 'automation-wave',
    stats: { hp: 90, mp: 60, atk: 8, def: 6, spd: 8, int: 14 }
  }
};

// ── Industry Data ──────────────────────────────────────────────────────────
const INDUSTRIES = {
  'it-services': {
    name: 'IT Services / MSP', subtitle: 'The Digital General Contractor',
    color: '#06B6D4', region: 'service',
    tagline: 'AI transformed one skilled operator from a specialist into a general contractor with every license.',
    insights: [
      { id: 'it-old-model', title: 'The Old Model: Six Vendors', stat: '6', statLabel: 'separate vendors needed for IT', summary: 'Traditional IT required hiring an MSP, web developer, software developer, marketing agency, security consultant, and cloud consultant.', type: 'trend' },
      { id: 'it-new-model', title: 'The New Reality: One GC', stat: '1', statLabel: 'skilled operator with access to every trade', summary: 'AI gave one skilled operator access to every trade and incredibly cheap labor. The Digital General Contractor model is born.', type: 'trend' },
      { id: 'it-capabilities', title: 'What One AI-Enabled MSP Can Do', stat: 'All', statLabel: 'of these capabilities in one operator', summary: 'Build custom apps, integrate systems, create portals, automate workflows, develop SaaS, handle security, and migrate infrastructure.', type: 'impact' },
      { id: 'it-role-change', title: 'The Role Has Changed', stat: 'New', statLabel: 'category of IT provider', summary: 'From "We fix computers" to "We build, automate, integrate, secure, and scale your entire digital operation."', type: 'impact' },
      { id: 'it-dgc', title: 'The Digital General Contractor', stat: 'DGC', statLabel: 'The emerging role', summary: 'Not "the computer guy" but the Digital General Contractor — with instant blueprints, unlimited apprentices, and rapid iteration.', type: 'impact' }
    ],
    guardianDialogue: ['You have mastered the art of the Digital General Contractor.', 'In the old world, six vendors served one client.', 'Now one AI-empowered operator serves them all.', 'Take this Cognitive Fragment — the essence of digital transformation.'],
    npcs: [
      { name: 'The Architect', color: '#4af0c0', dialogue: ['Welcome, Digital Pioneer. Six vendors once blocked this door.', 'Now AI gives you every key. Use them wisely.'] },
      { name: 'Old IT Guy', color: '#8888a0', dialogue: ['Back in my day, we needed a whole team to do what one person does now...', 'I\'m not complaining — I just had to learn some new tricks.'] },
      { name: 'Network Admin', color: '#06B6D4', dialogue: ['AI autocompletes my entire firewall configs now.', 'Still, someone has to understand what it\'s writing.'] }
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
    guardianDialogue: ['You understand Software Development\'s transformation.', 'Vibe coding is real — 62% of orgs are experimenting with AI agents that write entire systems.', 'Take this Cognitive Fragment — the essence of vibe coding.'],
    npcs: [
      { name: 'Senior Dev', color: '#3B82F6', dialogue: ['I used to spend hours debugging. Now I describe the bug and AI finds it in seconds.', 'The trust paradox is real though — 33% trust AI code. Yet we all keep using it.'] },
      { name: 'Junior Dev', color: '#8888a0', dialogue: ['Entry-level hiring is down 50%... hard to get your foot in the door.', 'AI can write the code, but it still can\'t replace experience. I hope.'] },
      { name: 'Tech Lead', color: '#4af0c0', dialogue: ['Code churn is up 41% since AI tools. More code, more bugs, more cleanup.', 'The velocity is intoxicating but the debt is real.'] }
    ]
  },
  'publishing': {
    name: 'Publishing', subtitle: 'The Content Flood',
    color: '#F59E0B', region: 'knowledge',
    tagline: 'AI has turned book publishing from a craft measured in years to a volume game measured in days.',
    insights: [
      { id: 'pub-volume', title: 'The Publishing Volume Explosion', stat: '1,095', statLabel: 'books/year possible per Amazon account', summary: 'Amazon had to cap uploads at 3 books per author per day to curb AI-generated flooding.', type: 'trend' },
      { id: 'pub-authors', title: 'How Real Authors Use AI', stat: '45%', statLabel: 'of surveyed authors currently using AI', summary: 'Authors are using AI for research, marketing, outlining, and editing — but 74% don\'t disclose it.', type: 'trend' },
      { id: 'pub-dark', title: 'The Clone Problem', stat: '74%', statLabel: 'of AI-using authors don\'t disclose AI use', summary: 'AI-generated imitations of real authors\' books are flooding Amazon, with clones appearing within days of a bestseller.', type: 'tension' }
    ],
    guardianDialogue: ['The content flood changes everything.', '1,095 books per author per year... Amazon had to cap it at 3 per day.', 'Take this fragment — the power of authentic voice.'],
    npcs: [
      { name: 'Indie Author', color: '#F59E0B', dialogue: ['I use AI to outline and research, but the voice — that\'s still mine.', 'The readers who matter can tell the difference.'] },
      { name: 'Publisher', color: '#8888a0', dialogue: ['Slush pile has gone from bad to apocalyptic.', 'We now filter for authenticity as our primary quality signal.'] }
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
    guardianDialogue: ['Cinema democratized. Every person a filmmaker.', 'One creator can now produce what required a 50-person team.', 'This fragment holds the power of creation.'],
    npcs: [
      { name: 'Video Editor', color: '#EC4899', dialogue: ['I used to spend 8 hours on a rough cut. AI does it in 20 minutes.', 'My job is now directing AI rather than editing manually.'] },
      { name: 'Content Creator', color: '#8888a0', dialogue: ['Started a faceless YouTube channel last month. 10K subscribers already.', 'AI handles scripting, voiceover, and editing. I handle strategy.'] }
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
    guardianDialogue: ['Music — humanity\'s oldest art — now measured in millions per day.', 'Suno generates 7 million songs per day. All of Spotify\'s catalog every two weeks.', 'This fragment resonates with both human and machine.'],
    npcs: [
      { name: 'Musician', color: '#A855F7', dialogue: ['I\'ve been playing guitar for 20 years. AI can\'t replicate my soul... yet.', 'But I use AI for production work. Time is money.'] },
      { name: 'Record Label Rep', color: '#8888a0', dialogue: ['We\'re in court with Suno right now. Training on copyrighted music without permission.', 'But we also secretly use AI ourselves. It\'s complicated.'] }
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
    guardianDialogue: ['The consulting pyramid crumbles as AI replaces junior analysts.', 'McKinsey: 25,000 AI agents, 35,000 humans. Almost 1:1.', 'Take this fragment — the power of strategic judgment.'],
    npcs: [
      { name: 'Senior Partner', color: '#10B981', dialogue: ['We hired 150 ex-consultants to train our AI. They trained their own replacements.', 'The irony isn\'t lost on any of us.'] },
      { name: 'Junior Analyst', color: '#8888a0', dialogue: ['I thought this was a safe career. Knowledge work can\'t be automated, they said.', '...They said that.'] }
    ]
  },
  'finance': {
    name: 'Financial Services', subtitle: 'Wall Street\'s Billion-Dollar AI Bet',
    color: '#6366F1', region: 'corporate',
    tagline: 'Banks are pouring tens of billions into AI, reshaping everything.',
    insights: [
      { id: 'fin-investment', title: 'The Investment Scale', stat: '$18B', statLabel: 'JPMorgan annual technology budget', summary: 'The biggest banks are making massive AI bets, with tech budgets in the tens of billions.', type: 'trend' },
      { id: 'fin-automation', title: 'The Automation Risk', stat: '54%', statLabel: 'of financial jobs at high automation potential', summary: 'More than half of financial jobs face high automation potential — the most of any sector.', type: 'tension' }
    ],
    guardianDialogue: ['Wall Street\'s AI bet is the biggest in history.', '$18B at JPMorgan alone. 54% of finance jobs at high automation risk.', 'Take this fragment — the power of capital intelligence.'],
    npcs: [
      { name: 'Trader', color: '#EAB308', dialogue: ['Algorithms execute 70% of trades now. I supervise the machines.', 'If you can\'t beat them, learn to direct them.'] },
      { name: 'Analyst', color: '#8888a0', dialogue: ['I used to build models for 3 days. AI does it in 3 hours.', 'My value is now interpretation, not computation.'] }
    ]
  },
  'education': {
    name: 'Education', subtitle: 'The Two-Hour School Day',
    color: '#F97316', region: 'service',
    tagline: 'AI is challenging the most fundamental assumption of education.',
    insights: [
      { id: 'edu-alpha', title: 'Alpha School\'s Revolutionary Model', stat: '2 hrs', statLabel: 'to complete all core academics per day', summary: 'Students complete a full grade level in 20-30 hours and score in the top 1-2% nationally.', type: 'trend' },
      { id: 'edu-how', title: 'How AI Tutoring Works', stat: '10x', statLabel: 'faster than traditional pacing', summary: 'Based on Bloom\'s 2 Sigma Problem — one-on-one mastery tutoring can raise an average student to 98th percentile.', type: 'impact' }
    ],
    guardianDialogue: ['The 2-hour school day is not a shortcut — it\'s mastery learning at scale.', 'Alpha School students complete a full grade level in 20 hours.', 'Take this fragment — the power of accelerated knowledge.'],
    npcs: [
      { name: 'Teacher', color: '#14B8A6', dialogue: ['AI tutors each student individually. I focus on what AI can\'t: mentorship.', 'Bloom\'s 2 Sigma Problem is finally solved.'] },
      { name: 'Parent', color: '#8888a0', dialogue: ['My kid finishes academics by 10am. Spends afternoons on real projects.', 'The old model wasted so much time.'] }
    ]
  },
  'healthcare': {
    name: 'Healthcare', subtitle: 'From Administrative Burden to Clinical Intelligence',
    color: '#14B8A6', region: 'service',
    tagline: 'AI is reclaiming thousands of nursing hours and transforming care delivery.',
    insights: [
      { id: 'hc-agentic', title: 'Agentic AI in Healthcare', stat: '80%+', statLabel: 'of health systems prioritizing agentic AI', summary: 'Health systems are deploying AI agents for virtual nursing, care management, and revenue cycle operations.', type: 'trend' },
      { id: 'hc-concern', title: 'The Insurance AI Concern', stat: 'Alert', statLabel: 'U.S. Senate Subcommittee report', summary: 'Concerns about commercial insurers using AI to target financial gain over medical necessity.', type: 'tension' }
    ],
    guardianDialogue: ['80% of health systems prioritize agentic AI now.', 'AI handles the administrative burden so humans can handle the human moments.', 'Take this fragment — the essence of healing intelligence.'],
    npcs: [
      { name: 'Nurse', color: '#22D3EE', dialogue: ['AI handles patient monitoring. I spend my time actually with patients.', 'That\'s what nursing was supposed to be.'] },
      { name: 'Doctor', color: '#8888a0', dialogue: ['AI diagnosed that rare condition before I did. I wasn\'t offended — I was relieved.', 'Better outcomes are what matter.'] }
    ]
  },
  'legal': {
    name: 'Legal', subtitle: 'From Billable Hours to AI-Augmented Judgment',
    color: '#64748B', region: 'corporate',
    tagline: 'The differentiator for legal leaders is now human judgment.',
    insights: [
      { id: 'leg-shift', title: 'The Judgment Premium', stat: 'Critical', statLabel: 'Human judgment as key differentiator', summary: 'AI handles drafting, research, and regulatory recall — the differentiator is now human judgment.', type: 'trend' },
      { id: 'leg-regulation', title: 'The Regulatory Frontier', stat: 'Active', statLabel: 'State legislatures pursuing AI regulation', summary: 'State legislatures are actively pursuing AI regulation, with Colorado proposing stringent disclosure requirements.', type: 'tension' }
    ],
    guardianDialogue: ['AI handles the research. Judgment remains human.', 'The regulatory frontier is contested ground — 1,000+ state AI bills in 2025.', 'Take this fragment — the power of reasoned judgment.'],
    npcs: [
      { name: 'Attorney', color: '#6366F1', dialogue: ['I used to spend 20 hours on legal research. Now 20 minutes.', 'The real skill is knowing when the AI is wrong.'] },
      { name: 'Law Clerk', color: '#8888a0', dialogue: ['First-year associate work is gone. AI does it in seconds.', 'The survivors are the ones who develop judgment, not just research skills.'] }
    ]
  },
  'real-estate': {
    name: 'Real Estate', subtitle: 'The $34B Automation Wave',
    color: '#D97706', region: 'corporate',
    tagline: 'AI is reshaping how properties are valued, screened, managed, and funded.',
    insights: [
      { id: 're-automation', title: 'The $34B Automation Takeover', stat: '$34B', statLabel: 'projected AI efficiency gains for real estate by 2030', summary: 'Morgan Stanley projects $34 billion in efficiency gains as 37% of real estate tasks become automatable.', type: 'trend' },
      { id: 're-screening', title: 'Screening Scores vs. Fair Housing', stat: '80%', statLabel: 'more likely to deny Black mortgage applicants vs. comparable White applicants', summary: 'AI tenant screening replicates and amplifies decades of housing discrimination — triggering landmark lawsuits and federal intervention.', type: 'tension' },
      { id: 're-avm', title: 'AVMs Are Replacing Appraisers', stat: '$300→$15', statLabel: 'cost of property valuation: traditional vs AI', summary: 'AI valuation models compress a 3–5 day, $300–$500 appraisal into 60 seconds for $5–$15, covering 116 million homes.', type: 'impact' },
      { id: 're-proptech', title: 'Real Estate Tech\'s $16.7B AI Gold Rush', stat: '$16.7B', statLabel: 'global proptech VC invested in 2025 — up 67.9% year-over-year', summary: 'Proptech funding surged to $16.7B in 2025. AI-centered firms growing at 42% vs 24% for non-AI.', type: 'trend' }
    ],
    guardianDialogue: ['$34B in efficiency gains by 2030. The market is never static.', 'AVMs compress 5-day appraisals to 60 seconds. 116 million homes in the model.', 'Take this fragment — the power of market intelligence.'],
    npcs: [
      { name: 'Real Estate Agent', color: '#F97316', dialogue: ['One REIT already cut headcount 15%. The disruption is accelerating.', 'But AI can\'t replace relationships. Buyers still want human guidance.'] },
      { name: 'Appraiser', color: '#8888a0', dialogue: ['AVMs do in 60 seconds what took me 5 days. I had to specialize in complex properties.', 'The $300-$500 appraisal is dying. The $3,000 expert appraisal survives.'] }
    ]
  },
  'marketing': {
    name: 'Marketing / Advertising', subtitle: 'The 83% Creative Takeover',
    color: '#E11D48', region: 'service',
    tagline: 'AI-generated ad creative has moved from experimental to standard operating procedure.',
    insights: [
      { id: 'mkt-creative', title: 'The AI Creative Takeover', stat: '83%', statLabel: 'of ad executives have deployed AI in creative production', summary: '83% of ad execs deploy AI in creative production — up from 60% in 2024. Meta\'s Advantage+ delivers $4.52 per $1 spent.', type: 'trend' },
      { id: 'mkt-trust', title: 'AI Ads vs. Consumer Trust', stat: '37-pt', statLabel: 'gap between exec optimism (82%) and consumer positivity (45%)', summary: '82% of ad execs think consumers like AI ads — only 45% actually do. Gen Z backlash is sharpest.', type: 'tension' },
      { id: 'mkt-seo', title: 'SEO\'s Zero-Click Collapse', stat: '-61%', statLabel: 'drop in organic CTR on Google AI Overview queries', summary: 'Organic click-through rates collapsed 61% on Google AI Overview queries. 60% of all Google searches now end in zero clicks.', type: 'impact' },
      { id: 'mkt-agency', title: 'Agency Workforce in Freefall', stat: '32,000', statLabel: 'US agency jobs projected eliminated by 2030', summary: 'Forrester projects 32K agency jobs eliminated by 2030. BlueFocus fired its entire human creative team.', type: 'impact' }
    ],
    guardianDialogue: ['83% of ad execs use AI creative. 32,000 jobs gone by 2030.', 'But consumers still trust humans 37 points more than they trust AI ads.', 'Take this fragment — the power of authentic creativity.'],
    npcs: [
      { name: 'Creative Director', color: '#E11D48', dialogue: ['BlueFocus fired their entire human creative team. I survived by learning to direct AI.', 'The ones who thrive are prompt engineers who understand brand.'] },
      { name: 'SEO Specialist', color: '#8888a0', dialogue: ['60% of Google searches end in zero clicks now. My entire field is restructuring.', 'AI Overviews answer the question before users reach our site.'] }
    ]
  },
  'government': {
    name: 'Government / Public Sector', subtitle: 'The $4B Fraud Catcher',
    color: '#1D4ED8', region: 'power',
    tagline: 'Governments are simultaneously the biggest AI promoters and the entities most responsible for regulating its risks.',
    insights: [
      { id: 'gov-fraud', title: 'AI Catches What Humans Miss', stat: '$4B', statLabel: 'fraud recovered/prevented by Treasury AI in FY2024', summary: 'Treasury\'s ML fraud detection recovered/prevented $4B in FY2024 — a 6x increase from $652M the prior year.', type: 'impact' },
      { id: 'gov-pentagon', title: 'The Pentagon Goes AI-First', stat: '$13.4B', statLabel: 'Pentagon FY2026 AI & autonomous systems budget', summary: 'The Pentagon earmarked $13.4B for AI and autonomous systems — its first-ever standalone budget line.', type: 'trend' },
      { id: 'gov-regulate', title: 'Regulate or Accelerate?', stat: '1,000+', statLabel: 'state AI bills introduced in the U.S. in 2025', summary: '1,000+ state AI bills in 2025 while Trump\'s EO sought to preempt them all. Only 1 AI-specific federal statute enacted.', type: 'tension' },
      { id: 'gov-surveillance', title: 'Surveillance State or Safety Tool?', stat: '40x', statLabel: 'higher facial recognition error rate for darker-skinned women', summary: 'Facial recognition error rates 40x higher for darker-skinned women. 8 Americans wrongfully arrested. Milwaukee banned it entirely.', type: 'tension' }
    ],
    guardianDialogue: ['$4B in fraud caught. $13.4B in AI warfare. 1,000+ regulatory bills.', 'Government is both the biggest AI user and its most powerful regulator.', 'Take this fragment — the power of institutional authority.'],
    npcs: [
      { name: 'Treasury Analyst', color: '#1D4ED8', dialogue: ['Our AI caught $4B in fraud last year. 6x more than humans did the year before.', 'It sees patterns humans literally can\'t process.'] },
      { name: 'Regulator', color: '#8888a0', dialogue: ['1,000+ state AI bills in 2025. Only 1 became federal law.', 'The gap between legislative speed and AI speed is widening every day.'] }
    ]
  },
  'labor-market': {
    name: 'Labor Market Impact', subtitle: 'Who Wins, Who Loses',
    color: '#EF4444', region: 'power',
    tagline: 'Connecting the threads across all industries.',
    insights: [
      { id: 'lm-entry', title: 'The Entry-Level Crisis', stat: '-1%', statLabel: 'employment decline in most AI-exposed sectors', summary: 'Employment is declining in the most AI-exposed sectors, disproportionately hitting workers under 25.', type: 'tension' },
      { id: 'lm-experience', title: 'The Experience Premium', stat: '81%', statLabel: 'productivity gains for senior developers', summary: 'Senior developers gain 81% from AI; wages are rising for experienced workers and falling for those without tacit knowledge.', type: 'tension' },
      { id: 'lm-gartner', title: 'The Gartner Prediction', stat: '40%', statLabel: 'non-traditional devs by 2028 (up from 20%)', summary: 'Share of dev team members from non-traditional backgrounds predicted to double from 20% to 40% by 2028.', type: 'impact' },
      { id: 'lm-cta', title: 'Call to Action: Navigating the Revolution', stat: '4', statLabel: 'audiences who must act now', summary: 'Workers, leaders, policymakers, and everyone must respond to this once-in-centuries transformation.', type: 'impact' }
    ],
    guardianDialogue: ['The labor market connects all threads of the AI revolution.', 'Senior workers gain 81%. Entry-level workers face -50% hiring in some sectors.', 'Take this final fragment — the power of adaptation.'],
    npcs: [
      { name: 'Economist', color: '#84CC16', dialogue: ['The labor market bifurcation is accelerating. Top earners gain; entry-level suffers.', 'The policy response has been... inadequate.'] },
      { name: 'Career Counselor', color: '#8888a0', dialogue: ['Every student I counsel faces the same question: will AI take my job?', 'The honest answer: probably some of it. So let\'s plan for that.'] }
    ]
  }
};

// Map paths (which towns connect on overworld)
const MAP_PATHS = [
  ['it-services', 'software-dev'], ['software-dev', 'publishing'],
  ['publishing', 'video'], ['video', 'music'],
  ['music', 'consulting'], ['consulting', 'finance'],
  ['finance', 'education'], ['education', 'healthcare'],
  ['healthcare', 'legal'], ['legal', 'real-estate'],
  ['real-estate', 'marketing'], ['marketing', 'government'],
  ['government', 'labor-market'], ['labor-market', 'it-services'],
  ['it-services', 'consulting'], ['software-dev', 'finance'],
  ['publishing', 'education'], ['video', 'marketing']
];

// ── Enemies ────────────────────────────────────────────────────────────────
const ENEMIES = {
  'bug-swarm':         { name: 'Bug Swarm',         level: 2,  region: 'digital',    maxHp: 40,  atk: 8,  def: 3,  spd: 7,  xpReward: 15, goldReward: 8,   color: 0x44ff44 },
  'corrupted-script':  { name: 'Corrupted Script',  level: 4,  region: 'digital',    maxHp: 65,  atk: 12, def: 5,  spd: 5,  xpReward: 25, goldReward: 12,  color: 0xff6644 },
  'deepfake-ghost':    { name: 'Deepfake Ghost',     level: 5,  region: 'digital',    maxHp: 80,  atk: 15, def: 4,  spd: 9,  xpReward: 35, goldReward: 18,  color: 0xaa88ff },
  'spreadsheet-golem': { name: 'Spreadsheet Golem', level: 7,  region: 'corporate',  maxHp: 120, atk: 14, def: 15, spd: 3,  xpReward: 40, goldReward: 22,  color: 0x44cc44 },
  'audit-drone':       { name: 'Audit Drone',        level: 8,  region: 'corporate',  maxHp: 85,  atk: 18, def: 8,  spd: 8,  xpReward: 45, goldReward: 28,  color: 0xffcc00 },
  'market-volatility': { name: 'Market Volatility',  level: 9,  region: 'corporate',  maxHp: 95,  atk: 22, def: 6,  spd: 12, xpReward: 55, goldReward: 32,  color: 0xff4488 },
  'misinfo-sprite':    { name: 'Misinfo Sprite',     level: 10, region: 'knowledge',  maxHp: 70,  atk: 16, def: 6,  spd: 14, xpReward: 55, goldReward: 32,  color: 0xff88ff },
  'patent-troll':      { name: 'Patent Troll',       level: 12, region: 'knowledge',  maxHp: 150, atk: 14, def: 22, spd: 4,  xpReward: 65, goldReward: 38,  color: 0x88aa44 },
  'diagnostic-error':  { name: 'Diagnostic Error',   level: 13, region: 'knowledge',  maxHp: 100, atk: 12, def: 10, spd: 8,  xpReward: 60, goldReward: 36,  color: 0x44dddd },
  'spam-bot':          { name: 'Spam Bot',            level: 6,  region: 'service',    maxHp: 35,  atk: 10, def: 4,  spd: 10, xpReward: 20, goldReward: 10,  color: 0xffaa44 },
  'phishing-phantom':  { name: 'Phishing Phantom',   level: 9,  region: 'service',    maxHp: 75,  atk: 20, def: 5,  spd: 13, xpReward: 50, goldReward: 28,  color: 0x44aaff },
  'legacy-system':     { name: 'Legacy System',      level: 11, region: 'service',    maxHp: 200, atk: 10, def: 18, spd: 2,  xpReward: 60, goldReward: 32,  color: 0x888888 },
  'surveillance-drone':{ name: 'Surveillance Drone', level: 14, region: 'power',      maxHp: 90,  atk: 22, def: 8,  spd: 18, xpReward: 70, goldReward: 42,  color: 0xff4444 },
  'regulatory-barrier':{ name: 'Regulatory Barrier', level: 16, region: 'power',      maxHp: 180, atk: 15, def: 28, spd: 3,  xpReward: 80, goldReward: 48,  color: 0x4444ff },
  'red-tape-wraith':   { name: 'Red Tape Wraith',    level: 17, region: 'power',      maxHp: 160, atk: 28, def: 12, spd: 5,  xpReward: 90, goldReward: 52,  color: 0xff2222 }
};

// ── Abilities ──────────────────────────────────────────────────────────────
const ABILITIES = {
  'vibe-code':            { name: 'Vibe Code',            industry: 'software-dev', cost: 15, desc: 'Deal INT×3 damage, 30% chance to hit twice', type: 'damage' },
  'content-flood':        { name: 'Content Flood',        industry: 'publishing',   cost: 20, desc: 'Overwhelm with INT×2 damage', type: 'damage' },
  'deep-fake':            { name: 'Deep Fake',            industry: 'video',        cost: 18, desc: '50% chance enemy attacks itself', type: 'debuff' },
  'harmonic-disruption':  { name: 'Harmonic Disruption',  industry: 'music',        cost: 12, desc: 'Confuse enemy, deal INT×2 damage', type: 'debuff' },
  'strategic-analysis':   { name: 'Strategic Analysis',   industry: 'consulting',   cost: 10, desc: 'Reduce enemy DEF 40%, deal INT damage', type: 'debuff' },
  'capital-strike':       { name: 'Capital Strike',       industry: 'finance',      cost: 25, desc: 'Massive INT×4 damage attack', type: 'damage' },
  'accelerated-learning': { name: 'Accelerated Learning', industry: 'education',    cost: 22, desc: 'Boost all stats 25% for 3 turns', type: 'buff' },
  'neural-repair':        { name: 'Neural Repair',        industry: 'healthcare',   cost: 20, desc: 'Heal 40% max HP + cure all status effects', type: 'heal' },
  'regulatory-freeze':    { name: 'Regulatory Freeze',    industry: 'legal',        cost: 22, desc: 'Stun enemy for 2 turns, deal DEF damage', type: 'debuff' },
  'digital-architect':    { name: 'Digital Architect',    industry: 'it-services',  cost: 25, desc: 'Summon helper bot for 3 turns (ATK×0.5/turn)', type: 'summon' },
  'market-crash':         { name: 'Market Crash',         industry: 'real-estate',  cost: 20, desc: 'Deal 25% of enemy\'s max HP as damage', type: 'damage' },
  'viral-campaign':       { name: 'Viral Campaign',       industry: 'marketing',    cost: 15, desc: 'Increasing damage over 3 turns (1x, 2x, 3x)', type: 'damage' },
  'executive-order':      { name: 'Executive Order',      industry: 'government',   cost: 28, desc: 'Guaranteed critical hit, ignores all DEF', type: 'damage' },
  'automation-wave':      { name: 'Automation Wave',      industry: 'labor-market', cost: 30, desc: 'Three rapid strikes (INT×1.5 each)', type: 'damage' }
};

// ── Equipment ──────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'data-gauntlets',    name: 'Data Gauntlets',     insightsNeeded: 3,  stats: { atk: 5 },                  desc: '+5 ATK' },
  { id: 'firewall-shield',   name: 'Firewall Shield',    insightsNeeded: 6,  stats: { def: 8 },                  desc: '+8 DEF' },
  { id: 'neural-helm',       name: 'Neural Helm',        insightsNeeded: 10, stats: { int: 10, spd: 5 },         desc: '+10 INT, +5 SPD' },
  { id: 'quantum-blade',     name: 'Quantum Blade',      insightsNeeded: 15, stats: { atk: 15, int: 5 },        desc: '+15 ATK, +5 INT' },
  { id: 'cognitive-armor',   name: 'Cognitive Armor',    insightsNeeded: 20, stats: { def: 15, hp: 10 },        desc: '+15 DEF, +10 HP' },
  { id: 'singularity-core',  name: 'Singularity Core',   insightsNeeded: 30, stats: { atk: 20, def: 20, int: 20, spd: 20 }, desc: '+20 all stats' },
  { id: 'architects-mantle', name: "Architect's Mantle", insightsNeeded: 44, stats: { atk: 30, def: 30, int: 30, spd: 30, hp: 30, mp: 30 }, desc: '+30 all stats' }
];

// ── Items ──────────────────────────────────────────────────────────────────
const ITEMS = {
  'health-potion':  { name: 'Health Potion',        desc: 'Restore 50 HP',           effect: 'hp',     value: 50,  cost: 50 },
  'energy-potion':  { name: 'Energy Potion',        desc: 'Restore 30 MP',           effect: 'mp',     value: 30,  cost: 50 },
  'greater-health': { name: 'Greater Health Potion', desc: 'Restore 120 HP',          effect: 'hp',     value: 120, cost: 150 },
  'greater-mind':   { name: 'Greater Mind Potion',  desc: 'Restore 80 MP',           effect: 'mp',     value: 80,  cost: 150 },
  'antidote':       { name: 'Antidote',             desc: 'Cure all status effects',  effect: 'cure',   value: 0,   cost: 30 },
  'smoke-bomb':     { name: 'Smoke Bomb',            desc: 'Escape from battle',      effect: 'escape', value: 0,   cost: 100 },
  'power-crystal':  { name: 'Power Crystal',        desc: '+8 ATK for 3 turns',      effect: 'buff-atk', value: 8, cost: 80 },
  'shield-matrix':  { name: 'Shield Matrix',        desc: '+8 DEF for 3 turns',      effect: 'buff-def', value: 8, cost: 80 },
  'neural-stim':    { name: 'Neural Stim',          desc: 'Restore 100 HP + 50 MP',  effect: 'full',   value: 0,   cost: 200 }
};

const SHOP_GENERAL = ['health-potion', 'energy-potion', 'greater-health', 'greater-mind', 'antidote', 'smoke-bomb'];
const SHOP_WEAPON  = ['power-crystal', 'shield-matrix', 'neural-stim'];

// ── Region / encounter helpers ─────────────────────────────────────────────
function getRegionForTown(townId) {
  const ind = INDUSTRIES[townId];
  return ind ? ind.region : 'digital';
}

function getBattleBgForRegion(region) {
  const map = { digital: 'battle-bg-digital', corporate: 'battle-bg-corporate', knowledge: 'battle-bg-knowledge', power: 'battle-bg-power', service: 'battle-bg-digital' };
  return map[region] || 'battle-bg-digital';
}

function getEnemiesForRegion(region) {
  const list = [];
  for (const [id, e] of Object.entries(ENEMIES)) {
    if (e.region === region) list.push(id);
  }
  return list.length > 0 ? list : ['bug-swarm'];
}

// ── Player Factory ─────────────────────────────────────────────────────────
function createNewPlayer(industryKey) {
  const char = CHARACTER_DATA[industryKey];
  const s = char.stats;
  return {
    name: char.name, title: char.title, industryKey,
    color: char.color, portrait: char.portrait,
    level: 1, xp: 0, xpToNext: 50, gold: 200,
    baseHp: s.hp, baseMp: s.mp, baseAtk: s.atk, baseDef: s.def, baseSpd: s.spd, baseInt: s.int,
    hp: s.hp, mp: s.mp, maxHp: s.hp, maxMp: s.mp,
    atk: s.atk, def: s.def, spd: s.spd, int: s.int,
    insightsRead: [], insightsByIndustry: {}, cognitiveFragments: [],
    abilities: [char.startAbility], equipment: [],
    items: [{ id: 'health-potion', qty: 3 }, { id: 'energy-potion', qty: 2 }],
    currentTown: industryKey, currentMap: 'town',
    unlockedTowns: [industryKey], completedTowns: [],
    bossesDefeated: [], totalInsightsRead: 0,
    statusEffect: null, statusTurns: 0,
    helperTurns: 0, viralTurns: 0, boostTurns: 0,
    buffAtk: 0, buffDef: 0
  };
}

function recalcStats(player) {
  let hp = player.baseHp, mp = player.baseMp;
  let atk = player.baseAtk, def = player.baseDef, spd = player.baseSpd, int_ = player.baseInt;
  player.insightsRead.forEach(() => { hp += 4; mp += 2; });
  player.insightsRead.forEach(insightId => {
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
  EQUIPMENT.forEach(eq => {
    if (player.equipment.includes(eq.id)) {
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
  // Check equipment unlocks
  EQUIPMENT.forEach(eq => {
    if (player.totalInsightsRead >= eq.insightsNeeded && !player.equipment.includes(eq.id)) {
      player.equipment.push(eq.id);
    }
  });
  // Check ability unlocks
  for (const [indId, ind] of Object.entries(INDUSTRIES)) {
    const allRead = ind.insights.every(ins => player.insightsRead.includes(ins.id));
    if (allRead) {
      const ab = Object.entries(ABILITIES).find(([, a]) => a.industry === indId);
      if (ab && !player.abilities.includes(ab[0])) player.abilities.push(ab[0]);
    }
  }
  recalcStats(player);
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
  recalcStats(player);
  player.hp = Math.min(player.hp + 20, player.maxHp);
  player.mp = Math.min(player.mp + 10, player.maxMp);
  return leveledUp;
}

// ── Town Map Generator ─────────────────────────────────────────────────────
function generateTownMap(industryKey) {
  const ind = INDUSTRIES[industryKey];
  const W = 30, H = 30;
  const tiles = [];
  for (let y = 0; y < H; y++) {
    tiles[y] = [];
    for (let x = 0; x < W; x++) {
      // Default tile depends on industry
      if (industryKey === 'healthcare' || industryKey === 'education') tiles[y][x] = TILE.STONE;
      else if (industryKey === 'real-estate' || industryKey === 'labor-market') tiles[y][x] = TILE.COBBLE;
      else if (industryKey === 'government') tiles[y][x] = TILE.STONE;
      else tiles[y][x] = TILE.STONE;
    }
  }

  // Roads (cross pattern + exit path)
  for (let x = 0; x < W; x++) { tiles[15][x] = TILE.COBBLE; tiles[16][x] = TILE.COBBLE; }
  for (let y = 0; y < H; y++) { tiles[y][14] = TILE.COBBLE; tiles[y][15] = TILE.COBBLE; }
  // Vertical road from center to exit
  for (let y = 16; y < H - 1; y++) { tiles[y][14] = TILE.COBBLE; tiles[y][15] = TILE.COBBLE; }
  // Vertical road from center upward
  for (let y = 1; y < 15; y++) { tiles[y][14] = TILE.COBBLE; tiles[y][15] = TILE.COBBLE; }

  // Border walls
  for (let x = 0; x < W; x++) { tiles[0][x] = TILE.WALL; tiles[H-1][x] = TILE.WALL; }
  for (let y = 0; y < H; y++) { tiles[y][0] = TILE.WALL; tiles[y][W-1] = TILE.WALL; }

  // Decorative grass patches (corners of town)
  for (let y = 2; y < 8; y++) {
    for (let x = 2; x < 8; x++) {
      if (x !== 14 && x !== 15) tiles[y][x] = TILE.GRASS;
    }
  }
  for (let y = 2; y < 6; y++) for (let x = 22; x < 27; x++) tiles[y][x] = TILE.GRASS;
  for (let y = 20; y < 27; y++) for (let x = 2; x < 8; x++) tiles[y][x] = TILE.GRASS;
  for (let y = 20; y < 27; y++) for (let x = 22; x < 27; x++) tiles[y][x] = TILE.GRASS;

  // Water feature for some industries
  if (['music','video','real-estate'].includes(industryKey)) {
    for (let x = 8; x < 13; x++) for (let y = 3; y < 6; y++) tiles[y][x] = TILE.WATER;
  }

  // Objects (NPCs, shops, etc.)
  const objects = [];

  // Buildings (shops) — placed adjacent to roads for easy access
  const townNpcs = ind ? (ind.npcs || []) : [];
  
  // Store (along horizontal road, left side)
  objects.push({ type: 'shop', x: 10, y: 13, label: 'Store' });
  
  // Inn (along horizontal road, right side)
  objects.push({ type: 'inn', x: 20, y: 13, label: 'Inn' });
  
  // Weapon shop (along vertical road, lower)
  objects.push({ type: 'weapon', x: 12, y: 20, label: 'Weapons' });
  
  // Knowledge archive (center, near crossroads)
  objects.push({ type: 'archive', x: 15, y: 12, label: 'Archive' });

  // Knowledge points (from industry insights)
  if (ind) {
    ind.insights.forEach((insight, i) => {
      const kx = 11 + (i % 3) * 3;
      const ky = 17 + Math.floor(i / 3) * 2;
      objects.push({ type: 'knowledge', x: kx, y: ky, insightId: insight.id, label: insight.title.substring(0, 20) });
    });
  }

  // Town Guardian (near archive)
  objects.push({ type: 'guardian', x: 17, y: 12, industryKey, label: 'Guardian' });

  // NPCs (placed along roads for easy encounter)
  const npcPositions = [{ x: 13, y: 16 }, { x: 17, y: 16 }, { x: 14, y: 20 }, { x: 18, y: 20 }, { x: 10, y: 18 }];
  townNpcs.slice(0, 5).forEach((npc, i) => {
    const pos = npcPositions[i] || { x: 10 + i * 3, y: 18 };
    objects.push({ type: 'npc', x: pos.x, y: pos.y, npcData: npc, label: npc.name });
  });

  // Exit markers (visual indicators at cardinal exits)
  objects.push({ type: 'exit', x: 14, y: 28, label: 'South Exit' });
  objects.push({ type: 'exit', x: 15, y: 28, label: 'South Exit' });
  objects.push({ type: 'exit', x: 1, y: 14, label: 'West Exit' });
  objects.push({ type: 'exit', x: 1, y: 15, label: 'West Exit' });
  objects.push({ type: 'exit', x: 28, y: 14, label: 'East Exit' });
  objects.push({ type: 'exit', x: 28, y: 15, label: 'East Exit' });
  objects.push({ type: 'exit', x: 14, y: 1, label: 'North Exit' });
  objects.push({ type: 'exit', x: 15, y: 1, label: 'North Exit' });

  return { width: W, height: H, tiles, objects, industryKey };
}

// ── Overworld Map ──────────────────────────────────────────────────────────
function generateOverworldMap() {
  const W = 60, H = 60;
  const tiles = [];
  for (let y = 0; y < H; y++) {
    tiles[y] = [];
    for (let x = 0; x < W; x++) {
      tiles[y][x] = TILE.GRASS;
    }
  }

  // Add terrain features
  // Mountains in corners
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) tiles[y][x] = TILE.MOUNTAIN;
  for (let y = 0; y < 8; y++) for (let x = W-8; x < W; x++) tiles[y][x] = TILE.MOUNTAIN;
  for (let y = H-8; y < H; y++) for (let x = 0; x < 8; x++) tiles[y][x] = TILE.MOUNTAIN;
  for (let y = H-8; y < H; y++) for (let x = W-8; x < W; x++) tiles[y][x] = TILE.MOUNTAIN;

  // Water body in center
  for (let y = 22; y < 32; y++) for (let x = 22; x < 38; x++) tiles[y][x] = TILE.WATER;

  // Forest patches
  [[5,15,15,22],[40,8,50,18],[8,40,18,52],[42,40,52,52],[15,25,20,35],[40,25,45,35]].forEach(([x1,y1,x2,y2]) => {
    for (let y = y1; y < y2; y++) for (let x = x1; x < x2; x++) tiles[y][x] = TILE.TREE;
  });

  // Main roads
  for (let x = 0; x < W; x++) { tiles[30][x] = TILE.ROAD; tiles[29][x] = TILE.ROAD; }
  for (let y = 0; y < H; y++) { tiles[y][30] = TILE.ROAD; tiles[y][29] = TILE.ROAD; }

  // Town positions (arranged around the map)
  const townPositions = {
    'it-services':   { x: 12, y: 12 },
    'software-dev':  { x: 30, y: 10 },
    'publishing':    { x: 48, y: 12 },
    'video':         { x: 50, y: 25 },
    'music':         { x: 48, y: 42 },
    'consulting':    { x: 38, y: 50 },
    'finance':       { x: 22, y: 50 },
    'education':     { x: 10, y: 44 },
    'healthcare':    { x: 8,  y: 32 },
    'legal':         { x: 8,  y: 22 },
    'real-estate':   { x: 18, y: 18 },
    'marketing':     { x: 40, y: 18 },
    'government':    { x: 42, y: 38 },
    'labor-market':  { x: 20, y: 38 }
  };

  // Draw roads between connected towns
  MAP_PATHS.forEach(([a, b]) => {
    const ta = townPositions[a], tb = townPositions[b];
    if (!ta || !tb) return;
    // Simple straight road
    let x = ta.x, y = ta.y;
    const dx = Math.sign(tb.x - ta.x), dy = Math.sign(tb.y - ta.y);
    let steps = 0;
    while ((x !== tb.x || y !== tb.y) && steps < 100) {
      if (x !== tb.x) x += dx;
      else if (y !== tb.y) y += dy;
      if (x >= 0 && x < W && y >= 0 && y < H && tiles[y][x] !== TILE.WATER) {
        tiles[y][x] = TILE.ROAD;
      }
      steps++;
    }
  });

  const objects = [];

  // Town entrances
  Object.entries(townPositions).forEach(([townId, pos]) => {
    objects.push({ type: 'town-entrance', x: pos.x, y: pos.y, townId });
  });

  // Campfires at crossroads
  [[30, 20],[15, 30],[45, 30],[30, 45]].forEach(([x, y]) => {
    if (tiles[y] && tiles[y][x] !== TILE.WATER) {
      objects.push({ type: 'campfire', x, y });
    }
  });

  // Signposts near towns
  Object.entries(townPositions).forEach(([townId, pos]) => {
    objects.push({ type: 'signpost', x: pos.x + 1, y: pos.y + 1, townId });
  });

  return { width: W, height: H, tiles, objects, townPositions };
}

const OVERWORLD_MAP = generateOverworldMap();

function getEncounterRate(tileType) {
  switch (tileType) {
    case TILE.GRASS:    return 0.20;
    case TILE.TREE:     return 0.30;
    case TILE.MOUNTAIN: return 0.25;
    case TILE.DIRT:     return 0.15;
    case TILE.ROAD:
    case TILE.COBBLE:   return 0.03;
    default:            return 0.10;
  }
}
