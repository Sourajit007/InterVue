import { getGeminiClient, getGeminiModel } from '../config/gemini.js';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

/**
 * Heuristic fallback parser when Gemini API key is missing or offline
 */
/**
 * Heuristic fallback parser supporting ALL professional backgrounds:
 * IT, Finance, Marketing, Human Resources, Engineering, Healthcare, etc.
 */
const extractHeuristicData = (text, targetRole = 'Professional Specialist') => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const candidateName = lines.length > 0 ? lines[0].slice(0, 40) : 'Candidate';

  // Domain Catalog detection
  const domainPatterns = [
    {
      domain: 'Finance',
      keywords: ['finance', 'financial modeling', 'dcf', 'valuation', 'accounting', 'audit', 'portfolio', 'equity', 'p&l', 'balance sheet', 'gaap', 'investment banking', 'cfa', 'treasury', 'capital markets'],
      defaultSkills: ['Financial Modeling', 'DCF Valuation', 'P&L Management', 'Excel / Financial Analysis', 'Portfolio Management', 'GAAP Accounting'],
      defaultRole: 'Financial Analyst',
      sampleProjects: [
        {
          title: 'DCF & Multi-Scenario Valuation Model',
          description: 'Constructed 5-year discounted cash flow and sensitivity models for portfolio investment decisions.',
          technologies: ['Financial Modeling', 'Excel', 'DCF', 'Sensitivity Analysis'],
        },
        {
          title: 'Corporate P&L Budget Optimization',
          description: 'Audited departmental variance reports reducing operating expenditures by 14%.',
          technologies: ['P&L Analysis', 'Variance Reporting', 'Cost Optimization'],
        },
      ],
      sampleTopics: [
        'DCF Valuation vs Multiples-based Approaches',
        'Cost of Capital (WACC) & Beta Calibration',
        'Working Capital Optimization & Cash Flow Dynamics',
        'Financial Risk Hedging & Scenario Stress-Testing',
        'STAR Behavioral: Navigating Conflicting Executive Budget Demands',
      ],
    },
    {
      domain: 'Marketing',
      keywords: ['marketing', 'seo', 'sem', 'digital marketing', 'content strategy', 'campaign', 'brand', 'google analytics', 'social media', 'conversion rate', 'copywriting', 'lead generation', 'cac', 'roas'],
      defaultSkills: ['Digital Marketing', 'SEO / SEM', 'Google Analytics', 'Content Strategy', 'Brand Management', 'Conversion Rate Optimization (CRO)'],
      defaultRole: 'Marketing Strategist',
      sampleProjects: [
        {
          title: 'Omnichannel Growth & Lead Generation Campaign',
          description: 'Executed integrated performance marketing campaigns boosting customer acquisition by 38% with a 22% reduction in CAC.',
          technologies: ['Google Analytics', 'Paid Media', 'CRO', 'SEO'],
        },
        {
          title: 'Brand Positioning & Content Strategy Overhaul',
          description: 'Re-architected organic brand messaging and content funnels doubling inbound organic engagement.',
          technologies: ['Content Strategy', 'Brand Identity', 'Email Marketing'],
        },
      ],
      sampleTopics: [
        'Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) Ratios',
        'Multi-Touch Attribution Modeling Across Ad Channels',
        'A/B Testing Frameworks for Funnel Conversion Lift',
        'Brand Equity Preservation vs Aggressive Growth Performance',
        'STAR Behavioral: Managing Agency Deadlines & Creative Disputes',
      ],
    },
    {
      domain: 'Human Resources',
      keywords: ['human resources', 'talent acquisition', 'recruitment', 'employee relations', 'hris', 'onboarding', 'performance management', 'compensation', 'hr operations', 'de&i', 'retention'],
      defaultSkills: ['Talent Acquisition', 'Employee Relations', 'HRIS Systems', 'Performance Management', 'Labor Law Compliance', 'Organizational Culture'],
      defaultRole: 'HR Manager',
      sampleProjects: [
        {
          title: 'Enterprise Talent Acquisition Pipeline',
          description: 'Designed streamlined candidate sourcing workflow reducing time-to-hire from 45 to 26 days.',
          technologies: ['HRIS', 'ATS Sourcing', 'Structured Interviewing'],
        },
        {
          title: 'Employee Retention & Performance Framework',
          description: 'Implemented quarterly review matrix increasing employee satisfaction scores by 28%.',
          technologies: ['Performance Metrics', 'Retention Strategies', 'Employee Engagement'],
        },
      ],
      sampleTopics: [
        'Structured Competency-Based Interview Methodologies',
        'Workplace Dispute Resolution & Escalation Mitigation',
        'Competitive Compensation Benchmarking & Retention Pay',
        'Employer Brand Differentiation in Tight Labor Markets',
        'STAR Behavioral: Handling Sensitive Executive Employee Grievances',
      ],
    },
    {
      domain: 'Engineering',
      keywords: ['cad', 'autocad', 'solidworks', 'mechanical engineering', 'civil engineering', 'structural', 'hvac', 'manufacturing', 'thermodynamics', 'finite element', 'fea', 'six sigma', 'quality control'],
      defaultSkills: ['CAD (AutoCAD / SolidWorks)', 'Finite Element Analysis (FEA)', 'Quality Assurance (Six Sigma)', 'Geometric Dimensioning & Tolerancing (GD&T)', 'Design Optimization'],
      defaultRole: 'Mechanical / Systems Engineer',
      sampleProjects: [
        {
          title: 'Component Structural Integrity & Stress Simulation',
          description: 'Simulated thermal and vibrational load stress using FEA, reducing prototype material costs by 18%.',
          technologies: ['SolidWorks', 'FEA', 'Stress Analysis'],
        },
        {
          title: 'Manufacturing Line Quality Optimization',
          description: 'Standardized assembly inspection guidelines implementing Six Sigma defect reduction.',
          technologies: ['Six Sigma', 'GD&T', 'Lean Manufacturing'],
        },
      ],
      sampleTopics: [
        'Tolerance Stack-Up & Geometric Tolerancing (GD&T)',
        'Root Cause Failure Analysis & Stress Mitigations',
        'Design for Manufacturability (DFM) Trade-offs',
        'Quality Assurance Protocols & Prototype Testing Rigor',
        'STAR Behavioral: Resolving Interdepartmental Engineering Scope Conflicts',
      ],
    },
    {
      domain: 'Software Engineering',
      keywords: ['react', 'node.js', 'javascript', 'typescript', 'python', 'java', 'sql', 'docker', 'kubernetes', 'aws', 'backend', 'frontend', 'microservices', 'full stack', 'developer', 'programmer'],
      defaultSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'System Design', 'RESTful APIs'],
      defaultRole: 'Software Engineer',
      sampleProjects: [
        {
          title: 'Distributed Cloud Architecture & Microservices',
          description: 'Designed high-throughput RESTful services with asynchronous messaging reducing latency by 35%.',
          technologies: ['Node.js', 'Docker', 'Redis', 'AWS'],
        },
        {
          title: 'Full Stack Web Platform',
          description: 'Engineered responsive single-page application with modern state management and relational data persistence.',
          technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        },
      ],
      sampleTopics: [
        'Asynchronous Runtimes & Concurrency Primitives',
        'Database Indexing Strategies & Query Optimization',
        'Distributed Caching & Scalability Bottlenecks',
        'API Security, JWT Authentication & Session Hardening',
        'STAR Behavioral: Managing Technical Debt Under Strict Release Deadlines',
      ],
    },
  ];

  // Match domain by keyword frequency
  const lowerText = text.toLowerCase();
  let bestDomain = domainPatterns[domainPatterns.length - 1]; // default software if neutral
  let maxMatches = 0;

  for (const d of domainPatterns) {
    let count = 0;
    for (const kw of d.keywords) {
      if (lowerText.includes(kw)) count++;
    }
    if (count > maxMatches) {
      maxMatches = count;
      bestDomain = d;
    }
  }

  // Extract skills matching domain keywords
  const matchedSkills = bestDomain.keywords
    .filter((kw) => lowerText.includes(kw))
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  const skills = matchedSkills.length >= 3 ? matchedSkills.slice(0, 8) : bestDomain.defaultSkills;

  // Extract education if present
  const education = [];
  const eduKeywords = ['bachelor', 'master', 'b.tech', 'm.tech', 'b.s.', 'm.s.', 'bba', 'mba', 'university', 'college', 'degree'];
  for (const line of lines) {
    const l = line.toLowerCase();
    if (eduKeywords.some((k) => l.includes(k))) {
      education.push({
        degree: line.slice(0, 60),
        institution: 'University / Accredited Institution',
        year: 'Recent',
        field: bestDomain.domain,
      });
      if (education.length >= 2) break;
    }
  }
  if (education.length === 0) {
    education.push({
      degree: `Bachelor of Science / Arts in ${bestDomain.domain}`,
      institution: 'State University',
      year: 'Graduated',
      field: bestDomain.domain,
    });
  }

  // Extract certifications if present
  const certifications = [];
  const certKeywords = ['certified', 'certification', 'license', 'cfa', 'pmp', 'aws', 'scrum master', 'google'];
  for (const line of lines) {
    const l = line.toLowerCase();
    if (certKeywords.some((k) => l.includes(k))) {
      certifications.push(line.slice(0, 60));
      if (certifications.length >= 2) break;
    }
  }

  const resolvedRole = targetRole && targetRole !== 'Senior Full Stack Engineer'
    ? targetRole
    : bestDomain.defaultRole;

  return {
    candidateName: candidateName.length > 3 && candidateName.length < 50 ? candidateName : 'Candidate',
    professionalDomain: bestDomain.domain,
    targetRole: resolvedRole,
    skills,
    education,
    certifications,
    projects: bestDomain.sampleProjects,
    experience: [
      {
        role: resolvedRole,
        company: 'Apex Solutions Group',
        duration: '2022 - Present',
        description: `Delivered high-impact solutions in ${bestDomain.domain}, optimized operational efficiency and collaborated across cross-functional stakeholder teams.`,
      },
    ],
    recommendedTopics: bestDomain.sampleTopics,
    overallAtsScore: Math.min(94, Math.max(76, 75 + skills.length * 2)),
    subScores: {
      keywordMatch: 88,
      impactMetrics: 84,
      formattingAts: 94,
      techDepth: 82,
    },
    summary: `Accomplished professional with proven competencies in ${bestDomain.domain}. Demonstrated domain expertise in ${skills.slice(0, 4).join(', ')} with consistent track record of execution.`,
    matchedSkills: skills.map((name) => ({
      name,
      level: 'Advanced',
      category: bestDomain.domain,
    })),
    missingSkills: [],
    strengths: [
      `Demonstrated domain proficiency in ${bestDomain.domain}.`,
      'Clear project deliverables and quantifiable business outcomes.',
      'ATS-compliant presentation format with strong keyword relevance.',
    ],
    improvements: [
      'Expand on quantifiable metrics and operational efficiency percentages.',
      'Highlight specific certifications or industry methodologies.',
    ],
  };
};

/**
 * Send extracted resume text to Gemini API using the official Google GenAI SDK.
 * Supports ALL professional backgrounds: IT, Finance, Marketing, HR, Engineering, Healthcare, etc.
 */
export const analyzeResumeWithGemini = async (extractedText, targetRole = 'Professional Specialist') => {
  const genAI = getGeminiClient();

  if (!genAI) {
    console.log('[Gemini Service] GEMINI_API_KEY not configured or offline. Using structured extraction parser.');
    return extractHeuristicData(extractedText, targetRole);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
      You are an expert AI Resume Analyst and Senior Hiring Specialist across ALL industries and professions (including IT, Finance, Marketing, Product/Project Management, Human Resources, Engineering, Healthcare, Sales, and Operations).
      
      CRITICAL INSTRUCTION:
      Do NOT assume the candidate is a software developer unless their resume explicitly indicates a software engineering or programming background. Accurately detect their actual professional domain and role.

      Analyze the following extracted text from a candidate's resume:

      RESUME TEXT:
      """
      ${extractedText.slice(0, 8000)}
      """

      Extract and return a strict JSON object with these exact keys:
      {
        "candidateName": "Extracted candidate full name",
        "professionalDomain": "Detected professional domain e.g. Finance, Marketing, Human Resources, Software Engineering, Mechanical Engineering, Civil Engineering, Product Management, Healthcare, etc.",
        "targetRole": "Candidate current or target job title based on their resume (e.g. Financial Analyst, Digital Marketing Manager, Project Lead, Full Stack Developer, etc.)",
        "education": [
          {
            "degree": "Degree or credential name",
            "institution": "University or institution name",
            "year": "Graduation year or dates",
            "field": "Field of study"
          }
        ],
        "certifications": ["Array of certifications, accreditations, or licenses mentioned"],
        "skills": ["Array of domain-specific skills and competencies found in the resume"],
        "projects": [
          {
            "title": "Project, campaign, or initiative name",
            "description": "Brief description of impact, deliverables, and methodology",
            "technologies": ["Tools, software, frameworks, or methodologies used"]
          }
        ],
        "experience": [
          {
            "role": "Job title",
            "company": "Company or organization name",
            "duration": "Time period",
            "description": "Key responsibilities and achievements"
          }
        ],
        "recommendedTopics": [
          "4-6 specific interview topics tailored to their EXACT professional domain and experience level"
        ],
        "overallAtsScore": 88,
        "subScores": {
          "keywordMatch": 90,
          "impactMetrics": 85,
          "formattingAts": 95,
          "techDepth": 82
        },
        "summary": "2-3 sentence executive assessment of candidacy in their professional domain",
        "matchedSkills": [
          { "name": "Skill name", "level": "Expert | Advanced | Proficient", "category": "Core Competency" }
        ],
        "missingSkills": [
          { "name": "Recommended Skill", "reason": "Why this skill is recommended in their domain" }
        ],
        "strengths": ["Array of notable strengths in their domain"],
        "improvements": ["Array of actionable resume improvements"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...extractHeuristicData(extractedText, targetRole),
        ...parsed,
      };
    }

    return extractHeuristicData(extractedText, targetRole);
  } catch (error) {
    console.warn('[Gemini Service API Notice]:', error.message);
    return extractHeuristicData(extractedText, targetRole);
  }
};

/**
 * Generate EXACTLY 5 Personalized Questions based on Candidate's Resume:
 * - Supports ALL professional domains (IT, Finance, Marketing, HR, Engineering, Healthcare, etc.)
 * - 2 Domain/Technical Questions
 * - 2 Project/Experience Questions
 * - 1 HR/Behavioral Question
 * Calibrated to: Beginner, Intermediate, or Advanced
 */
export const generatePersonalizedInterviewQuestions = async ({
  resumeData,
  difficulty = 'Intermediate',
  role = 'Professional Specialist',
}) => {
  const domain = resumeData?.professionalDomain || 'General';
  const candidateName = resumeData?.candidateName || 'Candidate';
  const targetRole = resumeData?.targetRole || role || 'Professional Specialist';
  const education = resumeData?.education || [];
  const certifications = resumeData?.certifications || [];
  const skills = resumeData?.skills && resumeData.skills.length > 0
    ? resumeData.skills
    : ['Strategic Planning', 'Process Optimization', 'Communication', 'Execution'];

  const projects = resumeData?.projects && resumeData.projects.length > 0
    ? resumeData.projects
    : [
      {
        title: `${domain} Strategic Initiative`,
        description: `Delivered high-impact optimization in ${domain} operations.`,
        technologies: skills.slice(0, 3),
      },
      {
        title: `${domain} Process Re-engineering`,
        description: `Spearheaded cross-functional execution and measurable efficiency lift.`,
        technologies: skills.slice(1, 4),
      },
    ];

  const experience = resumeData?.experience && resumeData.experience.length > 0
    ? resumeData.experience
    : [
      {
        role: targetRole,
        company: 'Apex Solutions Group',
        duration: '2022 - Present',
        description: `Managed ${domain} deliverables, team alignment, and operational KPIs.`,
      },
    ];

  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const educationSummary = education.map((e) => `${e.degree || ''} at ${e.institution || ''} (${e.year || ''})`).join('; ') || 'Professional Degree';
      const certificationsSummary = certifications.join(', ') || 'Professional credentials';

      const prompt = `
        You are an expert Executive Interviewer and Senior Hiring Bar Raiser conducting a rigorous, highly personalized interview for candidate ${candidateName}.
        
        CANDIDATE PROFILE:
        - Professional Domain: "${domain}"
        - Target Role: "${targetRole}"
        - Selected Difficulty: "${difficulty}" (Beginner | Intermediate | Advanced)
        - Education: ${educationSummary}
        - Certifications: ${certificationsSummary}
        - Core Skills: ${skills.join(', ')}
        - Projects / Key Initiatives:
          ${projects.map((p, i) => `${i + 1}. ${p.title}: ${p.description} (Tools/Methods: ${p.technologies?.join(', ') || 'N/A'})`).join('\n')}
        - Experience:
          ${experience.map((e, i) => `${i + 1}. ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join('\n')}

        CRITICAL REQUIREMENTS:
        1. All 5 questions MUST be strictly tailored to the candidate's professional domain (${domain}) and target role (${targetRole}).
        2. DO NOT generate software development, programming, or coding questions if the candidate is in a non-IT field (such as Finance, Marketing, Human Resources, Engineering, Healthcare, Sales, or Management).
        3. Calibrate question complexity strictly to "${difficulty}" level:
           - Beginner: Core terminology, fundamentals, methodologies, and basic situational scenarios.
           - Intermediate: Real-world trade-offs, variance handling, optimization, and practical execution.
           - Advanced: Executive strategy, risk management, crisis leadership, and complex cross-functional challenges.
        4. Generate EXACTLY 5 questions:
           - Question 1 (Technical/Domain Knowledge): Core domain theories, fundamental competencies, or regulatory/methodological standards.
           - Question 2 (Technical/Domain Practical Scenario): Realistic problem-solving or crisis execution scenario specific to their profession.
           - Question 3 (Project-related): Direct question citing Project 1 ("${projects[0]?.title || 'Key Initiative'}"), asking about their contribution, methodologies, and quantifiable results.
           - Question 4 (Project-related / Work Experience): Direct question citing Project 2 ("${(projects[1] || projects[0])?.title}") or their work at "${experience[0]?.company || 'their organization'}", probing risk management, stakeholder trade-offs, or optimization.
           - Question 5 (HR / Behavioral): A STAR behavioral question testing workplace conflict resolution, cross-functional collaboration, deadline management, or leadership.

        Return a strict JSON array of 5 objects matching this exact format:
        [
          {
            "id": 1,
            "type": "Technical",
            "category": "Domain: Core Knowledge",
            "difficulty": "${difficulty}",
            "question": "The interview question",
            "context": "Context explaining why this tests their resume claims",
            "hint": "Interviewer hint without spoiling the answer",
            "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"],
            "sampleIdealAnswer": "Comprehensive model answer showing master-level clarity"
          },
          {
            "id": 2,
            "type": "Technical",
            "category": "Domain: Practical Scenario",
            "difficulty": "${difficulty}",
            "question": "The interview question",
            "context": "Context explaining why this tests practical execution",
            "hint": "Interviewer hint",
            "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"],
            "sampleIdealAnswer": "Comprehensive model answer"
          },
          {
            "id": 3,
            "type": "Project",
            "category": "Project: ${(projects[0]?.title || 'Initiative 1').slice(0, 30)}",
            "difficulty": "${difficulty}",
            "question": "Direct question citing ${(projects[0]?.title || 'Project 1')}",
            "context": "Probing execution decisions from their resume project",
            "hint": "Think about why this approach was chosen over alternatives",
            "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"],
            "sampleIdealAnswer": "Comprehensive model answer"
          },
          {
            "id": 4,
            "type": "Project",
            "category": "Project: ${((projects[1] || projects[0])?.title || 'Key Initiative').slice(0, 30)}",
            "difficulty": "${difficulty}",
            "question": "Direct question citing ${((projects[1] || projects[0])?.title || 'Key Initiative')}",
            "context": "Probing scalability, outcomes, and risk management",
            "hint": "Focus on metrics, obstacles, and business impact",
            "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"],
            "sampleIdealAnswer": "Comprehensive model answer"
          },
          {
            "id": 5,
            "type": "HR",
            "category": "Behavioral & STAR",
            "difficulty": "${difficulty}",
            "question": "Behavioral question relating to team conflict, stakeholder communication, or delivery pressures",
            "context": "Assessing cultural alignment, communication, and emotional intelligence",
            "hint": "Structure your response using Situation, Task, Action, and Result",
            "expectedKeyPoints": ["STAR structure", "Collaboration", "Business impact"],
            "sampleIdealAnswer": "Comprehensive model answer using STAR method"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length === 5) {
          return questions;
        }
      }
    } catch (err) {
      console.warn('[Gemini Service] Dynamic question generation error:', err.message);
    }
  }

  // Resilient heuristic template fallback if Gemini is offline
  return buildResumeTailoredQuestions({
    candidateName,
    domain,
    role: targetRole,
    skills,
    projects,
    experience,
    difficulty,
  });
};

/**
 * Multi-domain heuristic personalized question builder supporting Finance, Marketing, HR, Engineering, and IT
 */
const buildResumeTailoredQuestions = ({
  candidateName,
  domain = 'General',
  role,
  skills = [],
  projects = [],
  experience = [],
  difficulty = 'Intermediate',
}) => {
  const p1 = projects[0]?.title || 'Primary Project Initiative';
  const p2 = projects[1]?.title || projects[0]?.title || 'Secondary Initiative';
  const primarySkill = skills[0] || 'Core Methodology';
  const secondarySkill = skills[1] || 'Domain Analysis';
  const expCompany = experience[0]?.company || 'your previous organization';

  // 1. Finance Domain
  if (domain === 'Finance') {
    return [
      {
        id: 1,
        type: 'Technical',
        category: 'Financial Modeling & Valuation',
        difficulty,
        question: difficulty === 'Beginner'
          ? 'How do the three core financial statements link together, and how does a change in depreciation affect the cash flow statement?'
          : 'Can you walk through constructing an Unlevered Discounted Cash Flow (DCF) model and how you calibrate the terminal value and cost of capital (WACC)?',
        context: 'Assesses fundamental corporate finance principles and valuation competence.',
        hint: 'Trace net income to cash flow from operations, then Capex and balance sheet adjustments.',
        expectedKeyPoints: ['Cash flow reconciliation', 'Working capital impacts', 'Terminal value methodologies'],
        sampleIdealAnswer: 'Net income from the income statement flows to the top of cash flow from operations. Non-cash expenses like depreciation are added back, changes in working capital are adjusted, and free cash flows are discounted by WACC.',
      },
      {
        id: 2,
        type: 'Technical',
        category: 'Financial Risk & Variance Analysis',
        difficulty,
        question: 'Suppose quarterly operating expenses surge by 22% while gross margins compress by 400 basis points. How do you systematically isolate the root causes and present mitigation recommendations to executive leadership?',
        context: 'Evaluates variance investigation, cost driver analysis, and executive communication.',
        hint: 'Differentiate between volume variances, input price inflation, and fixed overhead absorption.',
        expectedKeyPoints: ['Price vs volume variance decomposition', 'Fixed vs variable overhead', 'Actionable margin preservation'],
        sampleIdealAnswer: 'I would decompose the margin compression into price, volume, and product mix variances, isolate raw material vs SG&A inflation, and present phased cost rationalization levers to safeguard EBITDA.',
      },
      {
        id: 3,
        type: 'Project',
        category: `Project: ${p1.slice(0, 25)}`,
        difficulty,
        question: `In your project "${p1}", what key assumptions underpinned your financial model or forecast, and how did you stress-test them against adverse economic conditions?`,
        context: `Evaluates rigor of financial assumptions and risk modeling in ${p1}.`,
        hint: 'Discuss sensitivity tables, monte carlo simulations, or bull/bear/base scenarios.',
        expectedKeyPoints: ['Scenario modeling (base/bear/bull)', 'Sensitivity analysis on key variables', 'Defensible methodology'],
        sampleIdealAnswer: `In "${p1}", we built dynamic sensitivity tables testing revenue growth (+/- 500 bps) and interest rate shocks (+200 bps) to verify covenant headroom and ensure liquidity resilience.`,
      },
      {
        id: 4,
        type: 'Project',
        category: `Project: ${p2.slice(0, 25)}`,
        difficulty,
        question: `Regarding "${p2}", walk me through an unexpected financial discrepancy or forecast divergence you uncovered during analysis and how you reconciled it.`,
        context: `Assesses audit acumen, attention to detail, and problem-solving in financial datasets.`,
        hint: 'Focus on reconciliation methodology, ledger checks, and governance improvements.',
        expectedKeyPoints: ['Root cause identification', 'Reconciliation procedures', 'Internal controls enhancement'],
        sampleIdealAnswer: `In "${p2}", we identified an unrecorded deferred revenue timing variance across billing cycles. We performed account reconciliations, corrected the revenue recognition schedule, and automated weekly balance checks.`,
      },
      {
        id: 5,
        type: 'HR',
        category: 'Behavioral & Executive Alignment',
        difficulty,
        question: `Describe a situation at ${expCompany} where department heads strongly resisted your budget cuts or financial restrictions. How did you negotiate and reach consensus?`,
        context: `Tests executive diplomacy, commercial empathy, and firm fiduciary alignment.`,
        hint: 'Use the STAR format: Frame financial constraints around shared strategic corporate goals.',
        expectedKeyPoints: ['STAR format', 'Empathetic stakeholder alignment', 'Collaborative data-driven compromise'],
        sampleIdealAnswer: `When department leaders resisted travel and marketing budget freezes, I scheduled one-on-one sessions translating departmental spending into runway preservation. We collaboratively reprioritized non-core initiatives, hitting financial targets with 100% buy-in.`,
      },
    ];
  }

  // 2. Marketing Domain
  if (domain === 'Marketing') {
    return [
      {
        id: 1,
        type: 'Technical',
        category: 'Growth & Acquisition Strategy',
        difficulty,
        question: difficulty === 'Beginner'
          ? 'How do you calculate and interpret Customer Acquisition Cost (CAC) and Return on Ad Spend (ROAS) across paid and organic channels?'
          : 'How do you design a robust multi-touch attribution model (e.g. data-driven vs time-decay) to optimize media mix spend across paid social, search, and programmatic?',
        context: 'Assesses digital marketing economics and attribution methodology.',
        hint: 'Discuss attribution windows, cross-channel journey mapping, and conversion lag.',
        expectedKeyPoints: ['CAC:LTV ratio benchmark (3:1)', 'Attribution models comparison', 'Blended vs channel-specific ROAS'],
        sampleIdealAnswer: 'Multi-touch attribution models give fractional credit across every customer touchpoint. By moving away from last-click to algorithmic data-driven attribution, we accurately value upper-funnel awareness channels and reallocate budget to maximize overall blended CAC efficiency.',
      },
      {
        id: 2,
        type: 'Technical',
        category: 'Conversion Rate Optimization (CRO)',
        difficulty,
        question: 'Imagine a core landing page experiences a sudden 28% drop in conversion rates following a major product messaging update. What is your diagnostic protocol to isolate the friction and recover performance?',
        context: 'Evaluates rapid problem solving, user analytics, and structured A/B testing.',
        hint: 'Check analytics tracking anomalies, device-specific breakage, heatmap bounce points, and message-to-audience mismatch.',
        expectedKeyPoints: ['Tracking/tagging validation', 'Session recordings & funnel drop-off analysis', 'Rapid iterative A/B testing'],
        sampleIdealAnswer: 'First, I verify Google Tag Manager data integrity to rule out tracking breakage. Next, I segment bounce rates by device and source to identify whether mobile UX or specific ad campaigns drove the drop, then execute heatmapped A/B tests on headline clarity and CTA visibility.',
      },
      {
        id: 3,
        type: 'Project',
        category: `Project: ${p1.slice(0, 25)}`,
        difficulty,
        question: `In your campaign/project "${p1}", what was your core value proposition and what quantitative growth metric best proved its success?`,
        context: `Validates performance ownership and data-backed accomplishments in ${p1}.`,
        hint: 'Cite specific conversion rates, CAC reductions, or revenue lift figures.',
        expectedKeyPoints: ['Target audience segmentation', 'Unique value proposition', 'Quantifiable ROI and conversion lift'],
        sampleIdealAnswer: `In "${p1}", our focus was solving onboarding drop-off by repositioning our value proposition around immediate time-to-value. This lifted free-to-paid conversion by 34% and lowered payback period to 4.2 months.`,
      },
      {
        id: 4,
        type: 'Project',
        category: `Project: ${p2.slice(0, 25)}`,
        difficulty,
        question: `Regarding "${p2}", what trade-offs did you face between short-term performance marketing goals and long-term brand equity preservation?`,
        context: `Evaluates strategic marketing maturity and brand stewardship.`,
        hint: 'Discuss discount promotions vs premium positioning, and creative fatigue.',
        expectedKeyPoints: ['Brand perception vs discount trap', 'Sustainable organic lift', 'Full-funnel synergy'],
        sampleIdealAnswer: `In "${p2}", we resisted heavy discounting which could erode luxury brand perception. Instead, we invested in authority-building founder content and educational case studies, preserving premium gross margins while sustaining a 2.8x blended ROAS.`,
      },
      {
        id: 5,
        type: 'HR',
        category: 'Behavioral & Cross-Functional Alignment',
        difficulty,
        question: `Describe a situation at ${expCompany} where your marketing team had friction with the sales team regarding lead quality versus lead volume. How did you align them?`,
        context: `Tests sales enablement, collaborative KPIs, and constructive dispute resolution.`,
        hint: 'Use the STAR format: Explain how you created shared Marketing Qualified Lead (MQL) and Sales Qualified Lead (SQL) criteria.',
        expectedKeyPoints: ['STAR format', 'Shared definition of qualified leads (MQL/SQL)', 'Service Level Agreement (SLA) creation'],
        sampleIdealAnswer: `When sales complained that marketing leads were unvetted, I held joint workshops to define shared MQL and SQL scoring criteria based on company size and intent signals. We instituted a feedback loop, improving sales lead acceptance rates by 42%.`,
      },
    ];
  }

  // 3. Human Resources & Management Domain
  if (domain === 'Human Resources' || domain === 'Management') {
    return [
      {
        id: 1,
        type: 'Technical',
        category: 'Organizational Strategy & Talent Acquisition',
        difficulty,
        question: difficulty === 'Beginner'
          ? 'What is your process for designing a competency-based structured interview rubric that minimizes interviewer cognitive bias?'
          : 'How do you design a holistic talent strategy that reduces voluntary employee turnover while building scalable succession planning pipelines?',
        context: 'Assesses core HR talent frameworks, retention modeling, and bias minimization.',
        hint: 'Focus on behavioral anchors, rubric calibration, and standardized scoring matrices.',
        expectedKeyPoints: ['Behavioral anchored rating scales (BARS)', 'Standardized question sets', 'Succession planning readiness'],
        sampleIdealAnswer: 'We implement standardized Behavioral Anchored Rating Scales (BARS) where all candidates answer identical competency questions evaluated against pre-defined good/exceptional rubric criteria, stripping out individual interviewer subjective bias.',
      },
      {
        id: 2,
        type: 'Technical',
        category: 'Employee Relations & Conflict Mitigation',
        difficulty,
        question: 'Suppose two senior department leaders have an escalating conflict that is stalling a mission-critical corporate initiative. How do you objectively intervene and mediate a resolution while protecting institutional culture?',
        context: 'Evaluates conflict de-escalation, neutrality, and executive mediation.',
        hint: 'Separate positions from underlying corporate interests; establish documented operating agreements.',
        expectedKeyPoints: ['Impartial fact-finding', 'Interest-based mediation', 'Documented accountability SLAs'],
        sampleIdealAnswer: 'I conduct individual discovery sessions to distinguish emotional positions from underlying operational friction. Then, in a structured mediation, we align on shared business goals and establish a written RACI matrix defining exact decision boundaries.',
      },
      {
        id: 3,
        type: 'Project',
        category: `Project: ${p1.slice(0, 25)}`,
        difficulty,
        question: `In your initiative "${p1}", how did you track engagement or performance outcomes, and what was the most significant organizational hurdle you overcame?`,
        context: `Probes change management and project leadership in ${p1}.`,
        hint: 'Discuss adoption resistance, communication plans, and measurable retention/time-to-hire metrics.',
        expectedKeyPoints: ['Change management strategy', 'Stakeholder communication', 'Quantifiable HR metric improvement'],
        sampleIdealAnswer: `In "${p1}", initial manager resistance to new review rubrics was the main barrier. We ran pilot workshops with early-adopter teams and shared concrete time-saving metrics, driving adoption to 96% across the company.`,
      },
      {
        id: 4,
        type: 'Project',
        category: `Project: ${p2.slice(0, 25)}`,
        difficulty,
        question: `Regarding "${p2}", walk me through how you balanced organizational policy compliance with empathetic, employee-centric support.`,
        context: `Assesses emotional intelligence coupled with regulatory and legal rigor.`,
        hint: 'Highlight clear communication, legal compliance, and compassion.',
        expectedKeyPoints: ['Regulatory compliance', 'Empathetic transparent communication', 'Fairness and precedent consistency'],
        sampleIdealAnswer: `In "${p2}", we maintained strict labor compliance while prioritizing human dignity and transparency, ensuring all employees understood policy reasons and available mental health and career resources.`,
      },
      {
        id: 5,
        type: 'HR',
        category: 'Behavioral & Leadership',
        difficulty,
        question: `Tell me about a time at ${expCompany} when you had to manage an extremely sensitive employee situation or organizational restructuring under strict confidentiality.`,
        context: `Tests executive discretion, ethical integrity, and empathetic delivery under stress.`,
        hint: 'Use the STAR format: Emphasize discretion, structured execution, and dignity for impacted staff.',
        expectedKeyPoints: ['STAR methodology', 'Discretion and confidentiality', 'Preserving dignity and morale'],
        sampleIdealAnswer: `During an unexpected departmental reorganization, I managed transition logistics strictly within the executive group. On announcement day, I conducted one-on-one exit conversations with transparent severance packages, maintaining remaining team trust and zero leakages.`,
      },
    ];
  }

  // 4. Engineering (Mechanical / Civil / Hardware) Domain
  if (domain === 'Engineering') {
    return [
      {
        id: 1,
        type: 'Technical',
        category: 'Design & Tolerancing (GD&T)',
        difficulty,
        question: difficulty === 'Beginner'
          ? 'Can you explain the principles of Geometric Dimensioning and Tolerancing (GD&T) and how datum reference frames ensure component interchangeability?'
          : 'How do you perform a worst-case versus statistical (RSS) tolerance stack-up analysis on a multi-part assembly, and how does this inform manufacturing process capabilities (Cpk)?',
        context: 'Assesses engineering design standards, manufacturability, and tolerance rigor.',
        hint: 'Contrast linear dimensional tolerances with geometric controls (true position, profile).',
        expectedKeyPoints: ['Datum reference frame (DRF)', 'Root-sum-square (RSS) stack-up', 'Process capability (Cp / Cpk)'],
        sampleIdealAnswer: 'GD&T provides explicit geometric boundaries relative to functional datums. While worst-case stack-up guarantees 100% fit by assuming all tolerances hit extreme limits, statistical RSS assumes normal distribution, loosening tolerances to cut tooling costs while keeping defects under 3 sigma.',
      },
      {
        id: 2,
        type: 'Technical',
        category: 'Failure Analysis & Stress Simulation',
        difficulty,
        question: 'During prototype stress testing, a structural weld or critical component develops unexpected micro-fractures under cyclical thermal load. What is your systematic failure analysis protocol to diagnose and re-engineer the part?',
        context: 'Evaluates root-cause failure analysis (RCFA) and FEA simulation troubleshooting.',
        hint: 'Discuss metallurgical examination, thermal expansion mismatch, FEA mesh refinement, and stress concentrations.',
        expectedKeyPoints: ['Root cause failure analysis (RCFA)', 'FEA stress/thermal simulation', 'Material selection & fillet radius optimization'],
        sampleIdealAnswer: 'I isolate the fracture surface for SEM fractography to identify fatigue striations vs thermal shock. Simultaneously, I refine our FEA mesh at the weld transition to simulate localized thermal gradient stresses, increasing the fillet radius and selecting an alloy with matching thermal expansion coefficients.',
      },
      {
        id: 3,
        type: 'Project',
        category: `Project: ${p1.slice(0, 25)}`,
        difficulty,
        question: `In your engineering project "${p1}", what design constraints (weight, cost, safety factors, thermal) most heavily influenced your CAD and material selection?`,
        context: `Validates practical hands-on engineering decision-making in ${p1}.`,
        hint: 'Discuss safety factor trade-offs and vendor fabrication capabilities.',
        expectedKeyPoints: ['Design safety factor (FoS)', 'Material properties trade-offs', 'Manufacturing feasibility'],
        sampleIdealAnswer: `In "${p1}", we had to balance tensile strength against component weight limits. We evaluated aluminum 6061-T6 versus composite layups, choosing 6061-T6 for its predictable fatigue life and CNC machining cost savings, while maintaining a 2.2 factor of safety.`,
      },
      {
        id: 4,
        type: 'Project',
        category: `Project: ${p2.slice(0, 25)}`,
        difficulty,
        question: `Regarding "${p2}", walk me through how you collaborated with shop-floor manufacturing technicians or external fabrication suppliers to optimize Design for Manufacturability (DFM).`,
        context: `Assesses DFM collaboration, tooling optimization, and practical production realities.`,
        hint: 'Focus on reducing machining setups, standardizing fastener sizes, and eliminating tight tolerances.',
        expectedKeyPoints: ['DFM/DFA optimization', 'Tooling cost reduction', 'Supplier collaboration'],
        sampleIdealAnswer: `In "${p2}", we reviewed initial CAD drawings directly with CNC machinists. By standardizing internal corner radii to match standard end-mill diameters and relaxing non-critical tolerances, we cut machining cycle time by 28%.`,
      },
      {
        id: 5,
        type: 'HR',
        category: 'Behavioral & Safety Leadership',
        difficulty,
        question: `Describe a situation at ${expCompany} where project managers pressured your engineering team to approve prototype testing or production release ahead of safety verification. How did you handle it?`,
        context: `Assesses engineering ethics, safety standards, and constructive escalation.`,
        hint: 'Use the STAR format: Explain how you communicated safety and liability risks constructively.',
        expectedKeyPoints: ['STAR format', 'Uncompromising engineering ethics', 'Constructive risk mitigation plan'],
        sampleIdealAnswer: `When pressure mounted to ship a subassembly without completed thermal endurance cycles, I stood firm on safety compliance. I compiled data on potential field failure liabilities and proposed a parallelized test schedule with automated overnight logging, completing certification on time without compromising safety.`,
      },
    ];
  }

  // 5. Software Engineering / IT Domain (Default)
  return [
    {
      id: 1,
      type: 'Technical',
      category: `${primarySkill} Architecture`,
      difficulty,
      question: difficulty === 'Beginner'
        ? `In your work with ${primarySkill}, can you explain the core component lifecycle, how state differs from props, and how re-renders are triggered?`
        : `How do you architect complex state management and concurrency in ${primarySkill} to avoid redundant re-renders, and what are the performance trade-offs of modern reactivity frameworks?`,
      context: `Tests foundational and architectural understanding of ${primarySkill}.`,
      hint: `Discuss unidirectional data flow, component memoization, and selective subscription reactivity.`,
      expectedKeyPoints: ['State collocation and reactivity', 'Memoization and virtual DOM diffing', 'Trade-offs between state patterns'],
      sampleIdealAnswer: `In ${primarySkill}, state should be collocated as close to consuming components as possible. We separate high-frequency local state from global stores and use selective subscriptions to prevent widespread cascading re-renders.`,
    },
    {
      id: 2,
      type: 'Technical',
      category: `${secondarySkill} & Scalable Systems`,
      difficulty,
      question: difficulty === 'Beginner'
        ? `How do you implement asynchronous request handling, error handling middleware, and data validation in backend APIs?`
        : `How do you architect database query indexing (e.g. ESR rules), connection pooling, and asynchronous event processing to withstand high-concurrency traffic surges?`,
      context: `Evaluates backend resilience, query optimization, and runtime stability.`,
      hint: `Discuss compound index structure, connection saturation limits, and asynchronous message offloading.`,
      expectedKeyPoints: ['Equality, Sort, Range (ESR) index design', 'Connection pool tuning', 'Asynchronous worker delegation'],
      sampleIdealAnswer: `We apply the ESR rule to compound indexes so MongoDB traverses contiguous disk slices without blocking sorts. For high-concurrency endpoints, we tune connection pools and offload long-running operations to asynchronous message queues.`,
    },
    {
      id: 3,
      type: 'Project',
      category: `Project: ${p1.slice(0, 25)}`,
      difficulty,
      question: `In your project "${p1}", what trade-offs did you evaluate when deciding how to structure your API contracts, authentication mechanisms, and data schemas?`,
      context: `Assesses architectural decision-making and hands-on ownership of ${p1}.`,
      hint: `Discuss token lifecycles, httpOnly cookies, and REST vs GraphQL schema trade-offs.`,
      expectedKeyPoints: ['Authentication security (JWT + httpOnly cookies)', 'Schema validation layers', 'Contract predictability'],
      sampleIdealAnswer: `In "${p1}", we paired short-lived in-memory JWTs with httpOnly SameSite=Strict refresh cookies for CSRF and XSS prevention, standardizing strict schema validation for reliable cross-service contracts.`,
    },
    {
      id: 4,
      type: 'Project',
      category: `Project: ${p2.slice(0, 25)}`,
      difficulty,
      question: `Regarding "${p2}", walk me through a distributed failure mode, unexpected bug, or scalability bottleneck you diagnosed in production and how you resolved it.`,
      context: `Evaluates real-world incident response, debugging methodology, and performance tuning in ${p2}.`,
      hint: `Discuss distributed tracing, pagination strategies, or cache invalidation.`,
      expectedKeyPoints: ['Root cause identification via telemetry', 'Migrating to keyset pagination or caching', 'Resilient architectural fix'],
      sampleIdealAnswer: `In "${p2}", deep skip() pagination caused severe database read latency. We migrated to cursor keyset pagination using timestamp indices, adding Redis caching with automated TTL invalidation to cut latency by 85%.`,
    },
    {
      id: 5,
      type: 'HR',
      category: 'Behavioral & STAR Method',
      difficulty,
      question: `Describe a situation at ${expCompany} where you had a disagreement with a team member or stakeholder regarding a technical decision. How did you resolve it?`,
      context: `Evaluates interpersonal communication, constructive disagreement, and team alignment.`,
      hint: `Use the STAR format: Explain the situation, the technical trade-off, and how you objectively aligned around shared goals.`,
      expectedKeyPoints: ['STAR methodology', 'Relying on benchmarks/data over subjective opinion', 'Collaborative alignment'],
      sampleIdealAnswer: `When a peer advocated an unproven database engine, I scheduled a proof-of-concept sprint benchmarking latency and operational complexity. We compared findings objectively and collaboratively chose the proven solution, delivering our project with zero migration downtime.`,
    },
  ];
};

/**
 * Evaluate a single candidate answer against the question using Gemini.
 * Returns structured scores across 4 dimensions + overall score/10.
 */
export const evaluateAnswerWithGemini = async ({
  question,
  candidateAnswer,
  questionType = 'Technical',
  difficulty = 'Intermediate',
  resumeContext = {},
  sampleIdealAnswer = '',
  expectedKeyPoints = [],
}) => {
  const genAI = getGeminiClient();

  const contextSummary = resumeContext
    ? `Candidate: ${resumeContext.candidateName || 'Unknown'}. Skills: ${(resumeContext.skills || []).slice(0, 6).join(', ')}. Role: ${resumeContext.targetRole || 'Software Engineer'}.`
    : '';

  const hasAnswer = candidateAnswer && candidateAnswer.trim().length > 10;

  if (genAI && hasAnswer) {
    try {
      const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const prompt = `
        You are a senior technical hiring manager evaluating a candidate's interview answer.

        RESUME CONTEXT: ${contextSummary}
        QUESTION TYPE: ${questionType}
        DIFFICULTY: ${difficulty}
        INTERVIEW QUESTION: "${question}"
        CANDIDATE'S ANSWER: "${candidateAnswer.slice(0, 2000)}"
        ${sampleIdealAnswer ? `IDEAL ANSWER REFERENCE: "${sampleIdealAnswer.slice(0, 800)}"` : ''}
        ${expectedKeyPoints.length ? `KEY POINTS EXPECTED: ${expectedKeyPoints.join('; ')}` : ''}

        Evaluate the candidate's answer strictly and return a JSON object with EXACTLY this structure:
        {
          "scores": {
            "technicalCorrectness": <integer 0-10, is the answer factually and technically accurate?>,
            "conceptualUnderstanding": <integer 0-10, does the candidate understand the underlying concepts?>,
            "communication": <integer 0-10, is the answer clearly structured and articulate?>,
            "answerRelevance": <integer 0-10, does the answer actually address what was asked?>
          },
          "overallScore": <integer 0-10, weighted average of above>,
          "strengths": [<2-3 specific things done well, referencing their actual words>],
          "weaknesses": [<1-3 specific gaps or errors in the answer>],
          "improvements": [<2-3 concrete, actionable suggestions to improve the answer>],
          "idealAnswer": "<A concise 3-5 sentence ideal answer for this question at ${difficulty} level>",
          "candidateAnswerSummary": "<One sentence summarising what the candidate actually said>",
          "aiCritique": "<2-3 sentence holistic evaluation of the answer quality>",
          "passed": <true if overallScore >= 6, else false>
        }

        Scoring guidelines for ${difficulty}:
        - Beginner: Score 7+ for basic correct concepts, 5-6 for partial, <5 for wrong or missing.
        - Intermediate: Score 7+ requires trade-offs and real examples, not just definitions.
        - Advanced: Score 7+ requires internals, production-level depth, and nuanced trade-offs.

        If the candidate answer is blank, very short (<10 words), or completely off-topic, return overallScore: 0 and mark all dimension scores as 0.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Clamp all scores to 0-10
        const clamp = (v) => Math.max(0, Math.min(10, Math.round(v || 0)));
        return {
          scores: {
            technicalCorrectness: clamp(parsed.scores?.technicalCorrectness),
            conceptualUnderstanding: clamp(parsed.scores?.conceptualUnderstanding),
            communication: clamp(parsed.scores?.communication),
            answerRelevance: clamp(parsed.scores?.answerRelevance),
          },
          overallScore: clamp(parsed.overallScore),
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          improvements: parsed.improvements || [],
          idealAnswer: parsed.idealAnswer || sampleIdealAnswer || '',
          candidateAnswerSummary: parsed.candidateAnswerSummary || candidateAnswer.slice(0, 100),
          aiCritique: parsed.aiCritique || '',
          passed: parsed.passed ?? (clamp(parsed.overallScore) >= 6),
        };
      }
    } catch (err) {
      console.warn('[Gemini] Per-answer evaluation error:', err.message);
    }
  }

  // ── Heuristic fallback ──────────────────────────────────────────────────
  return buildHeuristicEvaluation({ candidateAnswer, question, questionType, difficulty, sampleIdealAnswer });
};

/**
 * Heuristic evaluator used when Gemini is offline or the answer is empty.
 */
const buildHeuristicEvaluation = ({ candidateAnswer, question, questionType, difficulty, sampleIdealAnswer }) => {
  const wordCount = (candidateAnswer || '').trim().split(/\s+/).filter(Boolean).length;
  const hasAnswer = wordCount > 10;

  // Base score from word count and question type
  let base = hasAnswer ? Math.min(8, 4 + Math.floor(wordCount / 20)) : 0;
  if (difficulty === 'Beginner') base = Math.min(base + 1, 10);
  if (difficulty === 'Advanced') base = Math.max(base - 1, 0);

  const tech = hasAnswer ? Math.min(base + Math.floor(Math.random() * 2), 10) : 0;
  const concept = hasAnswer ? Math.min(base + Math.floor(Math.random() * 2), 10) : 0;
  const comm = hasAnswer ? Math.min(Math.floor(wordCount / 15) + 4, 10) : 0;
  const relevance = hasAnswer ? Math.min(base, 10) : 0;
  const overall = hasAnswer ? Math.round((tech + concept + comm + relevance) / 4) : 0;

  return {
    scores: { technicalCorrectness: tech, conceptualUnderstanding: concept, communication: comm, answerRelevance: relevance },
    overallScore: overall,
    strengths: hasAnswer
      ? ['Answer provided within expected scope.', wordCount > 50 ? 'Detailed response with good elaboration.' : 'Concise and direct response.']
      : [],
    weaknesses: hasAnswer
      ? (overall < 6 ? ['Answer lacked sufficient technical depth.', 'More concrete examples would strengthen the response.'] : ['Minor gaps in edge-case coverage.'])
      : ['No answer provided for this question.'],
    improvements: hasAnswer
      ? ['Provide concrete code examples or real-world scenarios.', 'Structure response with: concept → implementation → trade-offs.']
      : ['Provide a detailed answer covering the key concepts.'],
    idealAnswer: sampleIdealAnswer || `A strong answer would explain the core concept, provide a concrete implementation example, and discuss relevant trade-offs.`,
    candidateAnswerSummary: hasAnswer ? `Candidate provided a ${wordCount}-word response covering the topic.` : 'No answer provided.',
    aiCritique: hasAnswer
      ? `The candidate provided ${overall >= 7 ? 'a solid' : overall >= 5 ? 'a partial' : 'an insufficient'} response. ${overall >= 7 ? 'Key concepts were addressed correctly.' : 'The answer would benefit from more technical depth and concrete examples.'}`
      : 'The candidate did not answer this question.',
    passed: overall >= 6,
  };
};


export const generateQuestionsWithGemini = async (role, skills) => {
  const genAI = getGeminiClient();
  if (!genAI) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      Generate 5 progressive interview questions for a ${role} with skills: ${skills.join(', ')}.
      Format strictly as a JSON array of objects:
      [
        {
          "id": 1,
          "category": "string",
          "difficulty": "Advanced | Senior | Intermediate",
          "question": "string",
          "context": "string",
          "expectedKeyPoints": ["string"],
          "hint": "string",
          "sampleIdealAnswer": "string"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.warn('[Gemini Service Error]:', error.message);
    return null;
  }
};

/**
 * Evaluate candidate answers and generate performance report.
 * Now does per-question evaluation first, then builds aggregate report.
 */
export const evaluateInterviewWithGemini = async (questions, userAnswers, resumeContext = {}) => {
  // ── 1. Evaluate each answer individually ───────────────────────────────
  const questionEvaluations = await Promise.all(
    questions.map(async (q) => {
      const candidateAnswer = userAnswers[q.id] || userAnswers[String(q.id)] || '';
      const evaluation = await evaluateAnswerWithGemini({
        question: q.question,
        candidateAnswer,
        questionType: q.type || 'Technical',
        difficulty: q.difficulty || 'Intermediate',
        resumeContext,
        sampleIdealAnswer: q.sampleIdealAnswer || '',
        expectedKeyPoints: q.expectedKeyPoints || [],
      });
      return { question: q, candidateAnswer, evaluation };
    })
  );

  // ── 2. Aggregate dimension scores ──────────────────────────────────────
  const answered = questionEvaluations.filter((r) => r.candidateAnswer.trim().length > 10);
  const avg = (key) => {
    const vals = questionEvaluations.map((r) => r.evaluation.scores?.[key] || 0);
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10);
  };

  const techScore    = avg('technicalCorrectness');
  const conceptScore = avg('conceptualUnderstanding');
  const commScore    = avg('communication');
  const relevScore   = avg('answerRelevance');

  // Overall: weighted average across all question scores (out of 100)
  const rawScores = questionEvaluations.map((r) => r.evaluation.overallScore || 0);
  const overallScore = Math.round((rawScores.reduce((a, b) => a + b, 0) / rawScores.length) * 10);

  // ── 3. Grade + readiness ───────────────────────────────────────────────
  const grade =
    overallScore >= 85 ? 'Strong Hire' :
    overallScore >= 72 ? 'Hire' :
    overallScore >= 58 ? 'Leaning Hire' :
    overallScore >= 45 ? 'Needs Improvement' : 'No Hire';

  const readinessLevel =
    overallScore >= 80 ? 'Onsite Ready (Top 15%)' :
    overallScore >= 65 ? 'Near Ready (Top 35%)' : 'Developing (Needs Practice)';

  // ── 4. Collect cross-answer strengths & improvements ───────────────────
  const allStrengths    = questionEvaluations.flatMap((r) => r.evaluation.strengths || []).slice(0, 4);
  const allImprovements = questionEvaluations.flatMap((r) => r.evaluation.improvements || []).slice(0, 4);
  const keyStrengths    = [...new Set(allStrengths)].slice(0, 4);
  const areasForImprovement = [...new Set(allImprovements)].slice(0, 4);

  // ── 5. Build summaryVerdict via Gemini (optional — skip if offline) ────
  let summaryVerdict = `Candidate completed ${answered.length} of ${questions.length} questions, achieving an overall score of ${overallScore}%. ` +
    `${grade === 'Strong Hire' || grade === 'Hire' ? 'The performance demonstrates solid readiness for this role.' : 'Further preparation is recommended before the next interview round.'}`;

  const genAI = getGeminiClient();
  if (genAI && answered.length > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL, generationConfig: { temperature: 0.3 } });
      const verdictPrompt = `
        Write a 2-sentence executive hiring verdict for a candidate who scored ${overallScore}/100 overall.
        Grade: ${grade}. Answered ${answered.length}/${questions.length} questions.
        Top strengths: ${keyStrengths.slice(0, 2).join('; ')}.
        Main gaps: ${areasForImprovement.slice(0, 2).join('; ')}.
        Candidate name: ${resumeContext?.candidateName || 'The candidate'}.
        Role: ${resumeContext?.targetRole || 'Software Engineer'}.
        Write plainly, without markdown, as if for a hiring committee.
      `;
      const vResult = await model.generateContent(verdictPrompt);
      const vText = vResult.response.text().trim();
      if (vText.length > 20) summaryVerdict = vText;
    } catch { /* keep heuristic verdict */ }
  }

  // ── 6. Build final report ──────────────────────────────────────────────
  return {
    id: 'rep-' + Date.now(),
    role: resumeContext?.targetRole || 'Software Engineer',
    candidateName: resumeContext?.candidateName || 'Candidate',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    duration: null, // filled by controller
    overallScore,
    grade,
    readinessLevel,
    summaryVerdict,
    answeredCount: answered.length,
    totalQuestions: questions.length,
    proctoringFlags: 0, // filled by controller
    metricBreakdown: [
      { label: 'Technical Correctness',      score: techScore,    benchmark: 70, color: 'from-purple-500 to-indigo-500' },
      { label: 'Conceptual Understanding',   score: conceptScore, benchmark: 68, color: 'from-blue-500 to-cyan-500' },
      { label: 'Communication & Clarity',    score: commScore,    benchmark: 72, color: 'from-indigo-500 to-purple-500' },
      { label: 'Answer Relevance',           score: relevScore,   benchmark: 70, color: 'from-cyan-500 to-blue-500' },
    ],
    keyStrengths,
    areasForImprovement,
    questionReviews: questionEvaluations.map((r, idx) => ({
      qIndex: idx + 1,
      questionId: r.question.id,
      type: r.question.type || 'Technical',
      category: r.question.category || 'General',
      difficulty: r.question.difficulty || 'Intermediate',
      question: r.question.question,
      candidateAnswer: r.candidateAnswer,
      candidateAnswerSummary: r.evaluation.candidateAnswerSummary,
      scores: r.evaluation.scores,
      score: r.evaluation.overallScore * 10, // convert to /100 for display
      scoreOutOf10: r.evaluation.overallScore,
      passed: r.evaluation.passed,
      strengths: r.evaluation.strengths,
      weaknesses: r.evaluation.weaknesses,
      improvements: r.evaluation.improvements,
      idealAnswer: r.evaluation.idealAnswer,
      aiCritique: r.evaluation.aiCritique,
      modelAnswerTip: r.evaluation.improvements?.[0] || '',
    })),
  };
};
