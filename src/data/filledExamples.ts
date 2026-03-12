import type { ResumeData } from '../types/resume'

function id(): string {
  return crypto.randomUUID()
}

/**
 * Rich preview example: fills template cards well so layouts look complete.
 * Dense enough to minimize empty space; overflow-hidden on templates handles edge cases.
 */
const previewExample: ResumeData = {
  jobTarget: 'Project Manager',
  contact: {
    fullName: 'Jordan Taylor',
    firstName: 'Jordan',
    lastName: 'Taylor',
    email: 'jordan.taylor@email.com',
    phone: '(555) 321-6543',
    location: 'Denver, CO',
    address: '72 Firestview',
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    website: '',
    linkedin: 'linkedin.com/in/jordantaylor',
  },
  summary:
    'Project manager with 6+ years leading cross-functional teams and delivering on time and within budget. Strong in Agile, stakeholder communication, and risk management. Proven track record of improving processes and team productivity.',
  experience: [
    {
      id: id(),
      jobTitle: 'Senior Project Manager',
      company: 'Tech Solutions Inc.',
      location: 'Denver, CO',
      startDate: '2020',
      endDate: 'Present',
      current: true,
      description:
        'Lead delivery of software and operations projects; manage scope, schedule, and budget.\nCoordinate with engineering, design, and product teams; run sprint planning and retrospectives.\nImproved release cycle time by 30% through process improvements.\nMentor junior project managers and support resource planning.',
    },
    {
      id: id(),
      jobTitle: 'Project Manager',
      company: 'Global Services Co.',
      location: 'Denver, CO',
      startDate: '2017',
      endDate: '2020',
      current: false,
      description:
        'Managed multiple client projects from kickoff to closure; tracked risks and issues.\nFacilitated workshops and status meetings; prepared reports for leadership.\nDelivered 95% of projects on time and within budget.',
    },
    {
      id: id(),
      jobTitle: 'Project Coordinator',
      company: 'Startup Labs',
      location: 'Boulder, CO',
      startDate: '2015',
      endDate: '2017',
      current: false,
      description:
        'Supported project leads with scheduling, documentation, and stakeholder updates.\nMaintained project dashboards and assisted with resource allocation.\nCoordinated cross-team communication and status reporting.',
    },
  ],
  education: [
    {
      id: id(),
      degree: 'MBA',
      school: 'University of Colorado',
      location: 'Denver, CO',
      startDate: '2013',
      endDate: '2015',
      description: 'Focus on operations and strategy.',
    },
    {
      id: id(),
      degree: 'BA Business Administration',
      school: 'University of Colorado',
      location: 'Boulder, CO',
      startDate: '2009',
      endDate: '2013',
      description: '',
    },
  ],
  skills: ['Project Management', 'Agile', 'Stakeholder Management', 'Risk Management', 'Jira', 'Budgeting', 'Cross-functional Leadership', 'Reporting', 'Scrum'],
  references: [
    { name: 'Sam Tech', affiliation: 'Tech Solutions Inc.', email: 's.tech@techsolutions.com', phone: '(555) 100-2000' },
    { name: 'Alex Global', affiliation: 'Global Services Co.', email: 'a.global@globalservices.com', phone: '(555) 200-3000' },
    { name: 'Casey Startup', affiliation: 'Startup Labs', email: 'c.startup@startuplabs.io', phone: '(555) 300-4000' },
  ],
}

/** Fully filled resume examples (resume.io style) for each example category */
export const filledExamples: Record<string, ResumeData> = {
  preview: previewExample,

  accountant: {
    jobTarget: 'Accountant',
    contact: {
      fullName: 'Christopher Carter',
      firstName: 'Christopher',
      lastName: 'Carter',
      email: 'christopher.carter@email.com',
      phone: '(555) 123-4567',
      location: 'London, UK',
      address: '42 Baker Street, London',
      city: 'London',
      country: 'UK',
      website: '',
      linkedin: 'linkedin.com/in/christophercarter',
    },
    summary:
      'Detail-oriented accountant with over 8 years of experience in financial reporting, audit support, and process improvement. Proven track record of streamlining month-end close and ensuring compliance with GAAP and IFRS. Strong analytical skills and proficiency in Excel, SAP, and various ERP systems. Committed to accuracy, timeliness, and supporting business decisions with clear financial data. Experienced in cross-functional collaboration and delivering actionable insights to stakeholders.',
    experience: [
      {
        id: id(),
        jobTitle: 'Senior Accountant',
        company: 'Pentagram Group',
        location: 'London, UK',
        startDate: 'March 2019',
        endDate: 'Present',
        current: true,
        description:
          'Lead month-end close process for UK entity; prepare consolidated financial statements and management reports.\nOversee accounts payable and receivable; reconcile intercompany balances and resolve discrepancies.\nSupport external audit and implement new controls that reduced reconciliation errors by 25%.\nPrepare variance analysis and cash flow forecasts for senior management.\nTrain and mentor junior accountants on group policies and systems.\nCoordinate with tax and treasury teams on quarterly reporting and audit deliverables.',
      },
      {
        id: id(),
        jobTitle: 'Accountant',
        company: 'Gravity Agency',
        location: 'London, UK',
        startDate: 'June 2015',
        endDate: 'February 2019',
        current: false,
        description:
          'Managed full-cycle accounting for multiple client portfolios; prepared VAT returns and statutory accounts.\nImproved reporting turnaround time by 30% through process automation in Excel.\nLiaised with auditors and tax advisors; maintained accurate fixed-asset and depreciation records.\nProcessed payroll and supported budget preparation and quarterly reviews.\nPrepared management accounts and ad-hoc analysis for senior leadership.',
      },
      {
        id: id(),
        jobTitle: 'Junior Accountant',
        company: 'Chalkbot Studio',
        location: 'London, UK',
        startDate: 'September 2012',
        endDate: 'May 2015',
        current: false,
        description:
          'Processed invoices, maintained ledgers, and assisted with year-end audit preparation.\nSupported finance team with ad-hoc analysis and reconciliations.\nPrepared bank reconciliations and assisted with expense coding and approval workflows.\nUpdated financial spreadsheets and supported the implementation of a new accounting system.\nContributed to process documentation and training materials for new joiners.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'UX/UI Course',
        school: 'British Design High School',
        location: 'London, UK',
        startDate: '2011',
        endDate: '2012',
        description: 'Professional development in design and user experience; applied to internal reporting and dashboards. Completed modules in data visualisation and presentation best practice.',
      },
      {
        id: id(),
        degree: 'BA (Hons) Accounting & Finance',
        school: 'Institute of Art & Design',
        location: 'London, UK',
        startDate: '2008',
        endDate: '2011',
        description: 'First-class honours; relevant modules in financial reporting, audit, taxation, and corporate finance. Dissertation on IFRS adoption and comparative reporting.',
      },
    ],
    skills: [
      'Financial Reporting',
      'GAAP & IFRS',
      'Month-End Close',
      'SAP',
      'Excel',
      'Reconciliation',
      'Audit Support',
      'VAT & Tax',
      'Variance Analysis',
      'Cash Flow',
    ],
    references: [
      { name: 'Jane Walsh', affiliation: 'Pentagram Group', email: 'j.walsh@pentagram.com', phone: '(555) 111-2233' },
      { name: 'David Cole', affiliation: 'Gravity Agency', email: 'd.cole@gravityagency.co.uk', phone: '(555) 444-5566' },
      { name: 'Rachel Smith', affiliation: 'Chalkbot Studio', email: 'r.smith@chalkbot.co.uk', phone: '(555) 777-8899' },
    ],
  },

  engineer: {
    jobTarget: 'Software Engineer',
    contact: {
      fullName: 'James Mitchell',
      firstName: 'James',
      lastName: 'Mitchell',
      email: 'james.mitchell@email.com',
      phone: '(555) 234-5678',
      location: 'San Francisco, CA',
      address: '123 Tech Ave, San Francisco',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      website: 'jamesmitchell.dev',
      linkedin: 'linkedin.com/in/jamesmitchell',
    },
    summary:
      'Full-stack developer with 8+ years building scalable web applications. Led migration of legacy monolith to microservices; reduced deployment time by 60%. Strong in React, Node.js, TypeScript, and AWS. Passionate about clean code, testing, and mentoring junior engineers.',
    experience: [
      {
        id: id(),
        jobTitle: 'Lead Developer',
        company: 'DataFlow Inc.',
        location: 'San Francisco, CA',
        startDate: '2019',
        endDate: 'Present',
        current: true,
        description:
          'Lead architecture and implementation of customer-facing and internal platforms.\nMentor team of 5 engineers; establish code review and CI/CD practices.\nMigrated core services to AWS; improved system reliability to 99.9% uptime.\nDrive technical roadmap and evaluate new tools and frameworks.\nCollaborate with product and design on specs and feasibility.\nParticipate in hiring and technical interviews; contribute to engineering standards.',
      },
      {
        id: id(),
        jobTitle: 'Senior Software Engineer',
        company: 'CloudNine',
        location: 'San Francisco, CA',
        startDate: '2016',
        endDate: '2019',
        current: false,
        description:
          'Built and maintained React/Node.js applications serving 500K+ users.\nIntroduced automated testing; reduced production incidents by 40%.\nOwned key features from design through deployment and monitoring.\nParticipated in on-call rotation and post-incident reviews.',
      },
      {
        id: id(),
        jobTitle: 'Software Engineer',
        company: 'StartupLabs',
        location: 'Oakland, CA',
        startDate: '2013',
        endDate: '2016',
        current: false,
        description:
          'Developed features for SaaS product; collaborated with design and product teams.\nImproved API response times through caching and query optimization.\nWrote unit and integration tests; documented APIs and onboarding guides.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'BSc Computer Science',
        school: 'University of California',
        location: 'Berkeley, CA',
        startDate: '2009',
        endDate: '2013',
        description: 'Focus on systems and software engineering; coursework in databases and distributed systems.',
      },
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'CI/CD', 'REST APIs', 'System Design', 'Testing'],
    references: [
      { name: 'Emma DataFlow', affiliation: 'DataFlow Inc.', email: 'e.dataflow@dataflow.io', phone: '(555) 222-3344' },
      { name: 'Tom CloudNine', affiliation: 'CloudNine', email: 't.cloud@cloudnine.com', phone: '(555) 333-4455' },
      { name: 'Pat StartupLabs', affiliation: 'StartupLabs', email: 'p.labs@startuplabs.io', phone: '(555) 666-7788' },
    ],
  },

  marketing: {
    jobTarget: 'Marketing Manager',
    contact: {
      fullName: 'Sarah Chen',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@email.com',
      phone: '(555) 345-6789',
      location: 'New York, NY',
      address: '456 Madison Ave, New York',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      website: '',
      linkedin: 'linkedin.com/in/sarahchen',
    },
    summary:
      'Strategic marketing manager with 6+ years driving brand growth and demand generation. Expert in B2B campaigns, content strategy, and marketing analytics. Proven ability to increase pipeline and improve conversion through data-driven decisions.',
    experience: [
      {
        id: id(),
        jobTitle: 'Marketing Manager',
        company: 'ScaleUp SaaS',
        location: 'New York, NY',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        description:
          'Own end-to-end demand gen; manage paid, email, and content programs.\nGrew MQLs by 45% YoY; reduced CAC through channel optimization.\nLead cross-functional alignment with sales and product teams.\nPresent results to leadership and own quarterly planning and budget.',
      },
      {
        id: id(),
        jobTitle: 'Senior Marketing Specialist',
        company: 'Growth Labs',
        location: 'New York, NY',
        startDate: '2018',
        endDate: '2021',
        current: false,
        description:
          'Executed multi-channel campaigns; built nurture flows and landing pages.\nImproved email open rates by 25% through segmentation and A/B testing.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'MBA',
        school: 'Columbia Business School',
        location: 'New York, NY',
        startDate: '2016',
        endDate: '2018',
        description: 'Concentration in marketing and strategy.',
      },
      {
        id: id(),
        degree: 'BA Communications',
        school: 'NYU',
        location: 'New York, NY',
        startDate: '2012',
        endDate: '2016',
        description: '',
      },
    ],
    skills: ['Digital Marketing', 'Content Strategy', 'SEO/SEM', 'HubSpot', 'Google Analytics', 'Campaign Management', 'A/B Testing', 'Brand Strategy'],
    references: [
      { name: 'Chris ScaleUp', affiliation: 'ScaleUp SaaS', email: 'c.scaleup@scaleupsaas.com', phone: '(555) 888-9900' },
      { name: 'Jordan Growth', affiliation: 'Growth Labs', email: 'j.growth@growthlabs.com', phone: '(555) 999-0011' },
      { name: 'Sam Columbia', affiliation: 'Columbia Business School', email: 's.columbia@columbia.edu', phone: '(555) 000-1122' },
    ],
  },

  admin: {
    jobTarget: 'Freight & Logistics Analyst',
    contact: {
      fullName: 'Tiffany Giroux',
      firstName: 'Tiffany',
      lastName: 'Giroux',
      email: 'tiffgiroux@hotmail.com',
      phone: '001 415 570 5567',
      location: 'Orlando, Florida',
      address: '18 Harmony Drive, Orlando, Florida 27267',
      city: 'Orlando',
      state: 'Florida',
      country: 'USA',
      website: '',
      linkedin: '',
    },
    summary:
      'Logistics and Supply Chain professional with experience in freight audit, carrier management, and KPI reporting. Proven ability to drive process improvements and reduce costs. Strong analytical skills and experience presenting to senior leadership.',
    experience: [
      {
        id: id(),
        jobTitle: 'Freight Audit & Logistics Analyst',
        company: 'Ford',
        location: 'Detroit, USA',
        startDate: 'July 2014',
        endDate: 'Current',
        current: true,
        description:
          'Oversee data analysis and identify opportunities for operational process improvements.\nDevelop reporting and dashboards for logistics KPIs; present findings to leadership and validate carrier invoices.\nImproved efficiencies and achieved cost reductions of 13% across all freight activity.\nManaged vendor relationships and led cross-functional projects to optimize routing.',
      },
      {
        id: id(),
        jobTitle: 'Senior Logistics Business Analyst',
        company: 'Honda',
        location: 'Clermont, USA',
        startDate: 'May 2012',
        endDate: 'June 2014',
        current: false,
        description:
          'Analyzed logistics expenditure; prepared monthly metrics and reports and presented KPI data.\nCollaborated with operations and IT to implement new planning tools and reporting systems.\nSupported supply chain projects and warehouse teams with data and process documentation.',
      },
      {
        id: id(),
        jobTitle: 'Senior Logistics Coordinator',
        company: 'Honda',
        location: 'Clermont, USA',
        startDate: 'May 2011',
        endDate: 'May 2012',
        current: false,
        description:
          'Coordinated inbound and outbound shipments; maintained carrier relationships and resolved discrepancies.\nSupported freight audit and documentation; tracked claims and communicated ETAs to stakeholders.\nImplemented process improvements leading to savings of over 50 man hours per month.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'Postgraduate Diploma, Management Studies',
        school: 'University of Hertfordshire',
        location: 'Bedford',
        startDate: 'September 2009',
        endDate: 'September 2010',
        description: 'Advanced modules in operations and supply chain strategy.',
      },
      {
        id: id(),
        degree: 'Management Studies',
        school: 'University of Hertfordshire',
        location: 'Bedford',
        startDate: 'September 2007',
        endDate: 'September 2009',
        description: 'Foundation in business analysis and project management.',
      },
    ],
    skills: ['Freight Audit', 'Supply Chain', 'Data Analysis', 'Carrier Management', 'SAP', 'Excel', 'KPI Reporting', 'Process Improvement', 'Logistics Distribution', 'Vendor Management'],
    references: [
      { name: 'Michael Ford', affiliation: 'Ford Logistics', email: 'm.ford@ford.com', phone: '(313) 555-0100' },
      { name: 'Lisa Honda', affiliation: 'Honda NA', email: 'l.honda@honda.com', phone: '(513) 555-0200' },
      { name: 'Sarah Williams', affiliation: 'University of Hertfordshire', email: 's.williams@herts.ac.uk', phone: '+44 1707 555 000' },
    ],
  },

  retail: {
    jobTarget: 'Customer Service Representative',
    contact: {
      fullName: 'Sophie Walton',
      firstName: 'Sophie',
      lastName: 'Walton',
      email: 'bw12@yahoo.com',
      phone: '(206) 742-5187',
      location: 'Seattle, WA',
      address: '32600 42nd Ave SW, Seattle, WA 98116, United States',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      website: '',
      linkedin: '',
    },
    summary:
      'Dedicated Customer Service Representative with strong communication skills and a focus on building positive client relationships. Experienced in addressing customer needs, resolving issues, and maintaining up-to-date knowledge of products and services. Skilled in problem-solving, mediation, and cross-selling. Proven ability to effectively promote services while ensuring high customer satisfaction and retention.',
    experience: [
      {
        id: id(),
        jobTitle: 'Branch Customer Service Representative',
        company: 'AT&T Inc.',
        location: 'Seattle, WA',
        startDate: 'August 2014',
        endDate: 'September 2019',
        current: false,
        description:
          'Maintained up-to-date knowledge of products and services to assist customers effectively.\nHandled customer calls and responded to queries regarding plans, billing, and technical support.\nResolved escalations and worked with technical support to resolve complex issues.\nConsistently exceeded satisfaction targets; recognized as top performer in 2017 and 2018.\nTrained new hires on systems, policies, and best practices for first-call resolution.',
      },
      {
        id: id(),
        jobTitle: 'Customer Service Representative',
        company: 'Gold Coast Hotel',
        location: 'Seattle, WA',
        startDate: 'August 2012',
        endDate: 'August 2014',
        current: false,
        description:
          'Greeted customers with enthusiasm and provided exceptional service at front desk.\nHandled reservations, check-in/check-out, and customer inquiries.\nEffectively sold rooms to walk-in customers and promoted hotel amenities and packages.\nTrained new team members on systems and service standards; supported night audit when needed.',
      },
      {
        id: id(),
        jobTitle: 'Customer Sales Representative',
        company: "Macy's",
        location: 'Bellevue, WA',
        startDate: 'October 2010',
        endDate: 'May 2012',
        current: false,
        description:
          'Assisted shoppers with product selection and promotions; processed returns and exchanges.\nGreeted customers and provided product knowledge to drive sales and loyalty program sign-ups.\nAchieved sales goals while maintaining positive customer reviews and satisfaction scores.\nMaintained visual standards and restocked merchandise in assigned department.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'Bachelor of Communications',
        school: 'University of Seattle',
        location: 'Seattle, WA',
        startDate: '2010',
        endDate: '2014',
        description: 'Relevant coursework in interpersonal communication and business writing.',
      },
      {
        id: id(),
        degree: 'High School Diploma',
        school: 'Hartwick High School',
        location: 'Hartwick',
        startDate: 'September 2002',
        endDate: 'May 2007',
        description: 'Honor roll; member of student council.',
      },
    ],
    skills: [
      'Excellent Communication Skills',
      'Troubleshooting Skills',
      'Multitasking Skills',
      'Mediation and Negotiation Skills',
      'Marketing Strategies',
      'Customer Service',
    ],
    references: [
      { name: 'Marissa Leeds', affiliation: 'Gold Coast Hotel', email: 'm.leeds@goldcoasthotel.com', phone: '(206) 555-0123' },
      { name: 'George Kenny', affiliation: 'AT&T', email: 'g.kenny@att.com', phone: '(206) 555-0456' },
      { name: 'Dana Macy', affiliation: "Macy's", email: 'd.macy@macys.com', phone: '(206) 555-0789' },
    ],
  },

  nurse: {
    jobTarget: 'Registered Nurse',
    contact: {
      fullName: 'Emma Rodriguez',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '(555) 678-9012',
      location: 'Chicago, IL',
      address: '200 Health Blvd, Chicago',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      website: '',
      linkedin: 'linkedin.com/in/emmarodriguez',
    },
    summary:
      'Compassionate registered nurse with 7 years of experience in acute care and patient education. Skilled in assessment, care planning, and collaboration with multidisciplinary teams. BLS and ACLS certified; committed to patient safety and positive outcomes.',
    experience: [
      {
        id: id(),
        jobTitle: 'Registered Nurse, Medical-Surgical Unit',
        company: 'Metro General Hospital',
        location: 'Chicago, IL',
        startDate: '2019',
        endDate: 'Present',
        current: true,
        description:
          'Manage care for 5–6 patients per shift; administer medications and monitor vital signs.\nEducate patients and families on discharge planning; participate in quality improvement initiatives.\nAct as preceptor for new graduate nurses.',
      },
      {
        id: id(),
        jobTitle: 'Staff Nurse',
        company: 'Community Health Center',
        location: 'Chicago, IL',
        startDate: '2016',
        endDate: '2019',
        current: false,
        description:
          'Provided direct patient care in outpatient and inpatient settings.\nCoordinated with physicians and support staff; maintained accurate documentation.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'BSc Nursing',
        school: 'University of Illinois at Chicago',
        location: 'Chicago, IL',
        startDate: '2012',
        endDate: '2016',
        description: 'Dean\'s list; clinical rotations in med-surg, ICU, and pediatrics.',
      },
    ],
    skills: ['Patient Care', 'Assessment', 'Care Planning', 'BLS', 'ACLS', 'Documentation', 'Patient Education', 'Team Collaboration'],
  },

  teacher: {
    jobTarget: 'Elementary Teacher',
    contact: {
      fullName: 'Kathryn Brown',
      firstName: 'Kathryn',
      lastName: 'Brown',
      email: 'kathryn.brown@email.com',
      phone: '(555) 789-0123',
      location: 'Austin, TX',
      address: '300 School Lane, Austin',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      website: '',
      linkedin: 'linkedin.com/in/kathrynbrown',
    },
    summary:
      'Dedicated elementary teacher with 6 years of experience creating inclusive, engaging learning environments. Strong in curriculum design, differentiation, and parent communication. Committed to fostering a love of learning and supporting social-emotional development. Experienced in standards-based instruction and collaboration with specialists.',
    experience: [
      {
        id: id(),
        jobTitle: 'Third Grade Teacher',
        company: 'Austin Independent School District',
        location: 'Austin, TX',
        startDate: '2018',
        endDate: 'Present',
        current: true,
        description:
          'Plan and deliver standards-based lessons for 24 students; differentiate for diverse learning needs.\nLead parent conferences and collaborate with specialists (SPED, ELL).\nImplemented reading workshop model; improved class reading levels by one grade on average.\nServe on grade-level and campus committees; support after-school tutoring.\nParticipate in professional development and curriculum planning.',
      },
      {
        id: id(),
        jobTitle: 'Student Teacher, Grades 2–3',
        company: 'Travis Elementary',
        location: 'Austin, TX',
        startDate: '2016',
        endDate: '2017',
        current: false,
        description:
          'Co-taught with mentor teacher; designed and delivered lessons in ELA and math.\nAssessed students and supported small-group instruction.\nDeveloped and adapted materials to meet varied learning needs.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'MEd Elementary Education',
        school: 'University of Texas at Austin',
        location: 'Austin, TX',
        startDate: '2015',
        endDate: '2017',
        description: 'State certification in EC–6.',
      },
      {
        id: id(),
        degree: 'BA Psychology',
        school: 'University of Texas at Austin',
        location: 'Austin, TX',
        startDate: '2011',
        endDate: '2015',
        description: 'Relevant coursework in child development and educational psychology.',
      },
    ],
    skills: ['Curriculum Design', 'Differentiation', 'Classroom Management', 'Parent Communication', 'Literacy', 'Assessment', 'Collaboration', 'Social-Emotional Learning'],
    references: [
      { name: 'Maria Austin ISD', affiliation: 'Austin ISD', email: 'm.principal@austinisd.org', phone: '(512) 555-0100' },
      { name: 'Robert Travis', affiliation: 'Travis Elementary', email: 'r.travis@travis.edu', phone: '(512) 555-0200' },
      { name: 'Dr. Lynn UT', affiliation: 'UT Austin', email: 'l.education@utexas.edu', phone: '(512) 555-0300' },
    ],
  },

  student: {
    jobTarget: 'Internship / Entry Level',
    contact: {
      fullName: 'Alex Rivera',
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@email.com',
      phone: '(555) 890-1234',
      location: 'Boston, MA',
      address: '50 Campus Drive, Boston',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      website: 'alexrivera.dev',
      linkedin: 'linkedin.com/in/alexrivera',
    },
    summary:
      'Motivated computer science student seeking an internship to apply coursework in software development and data structures. Experience with Python, Java, and web technologies through class projects and a part-time campus role. Quick learner with strong problem-solving skills.',
    experience: [
      {
        id: id(),
        jobTitle: 'IT Support Assistant',
        company: 'University IT Services',
        location: 'Boston, MA',
        startDate: 'September 2023',
        endDate: 'Present',
        current: true,
        description:
          'Provide first-line support for students and staff; troubleshoot hardware and software issues.\nAssist with imaging machines and maintaining documentation.\nHelp maintain knowledge base and train new student workers.',
      },
      {
        id: id(),
        jobTitle: 'Project: Course Scheduler App',
        company: 'CS Capstone',
        location: 'Boston, MA',
        startDate: 'January 2024',
        endDate: 'May 2024',
        current: false,
        description:
          'Built a web app in React and Node.js to help students plan schedules; integrated with university API.\nWorked in a team of 4 using Agile practices.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'BS Computer Science (expected)',
        school: 'Boston University',
        location: 'Boston, MA',
        startDate: '2021',
        endDate: '2025',
        description: 'GPA 3.6; relevant courses: Data Structures, Algorithms, Databases, Web Development.',
      },
    ],
    skills: ['Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'Problem Solving', 'Teamwork'],
    references: [
      { name: 'Dr. Kim Boston', affiliation: 'Boston University', email: 'k.cs@bu.edu', phone: '(617) 555-0400' },
      { name: 'Jamie IT Services', affiliation: 'University IT', email: 'j.it@university.edu', phone: '(617) 555-0500' },
    ],
  },

  hr: {
    jobTarget: 'Human Resources Specialist',
    contact: {
      fullName: 'Jordan Lee',
      firstName: 'Jordan',
      lastName: 'Lee',
      email: 'jordan.lee@email.com',
      phone: '(555) 901-2345',
      location: 'Denver, CO',
      address: '400 HR Plaza, Denver',
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      website: '',
      linkedin: 'linkedin.com/in/jordanlee',
    },
    summary:
      'HR professional with 5 years of experience in recruitment, employee relations, and HRIS. Skilled in full-cycle hiring, onboarding, and policy implementation. Focus on fostering an inclusive culture and supporting organizational growth.',
    experience: [
      {
        id: id(),
        jobTitle: 'HR Specialist',
        company: 'Summit Corp',
        location: 'Denver, CO',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        description:
          'Manage recruitment for engineering and operations; conduct interviews and coordinate offers.\nMaintain HRIS (Workday); support performance review cycle and training programs.\nAdvise managers on ER issues and company policy.\nLead onboarding sessions and coordinate with benefits and payroll.',
      },
      {
        id: id(),
        jobTitle: 'HR Coordinator',
        company: 'Mountain View Inc.',
        location: 'Denver, CO',
        startDate: '2018',
        endDate: '2020',
        current: false,
        description:
          'Supported onboarding and offboarding; processed payroll changes and benefits enrollment.\nAssisted with job postings and candidate scheduling.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'BA Human Resources Management',
        school: 'University of Colorado',
        location: 'Boulder, CO',
        startDate: '2014',
        endDate: '2018',
        description: 'SHRM-CP certified.',
      },
    ],
    skills: ['Recruitment', 'Employee Relations', 'HRIS', 'Onboarding', 'Policy', 'Interviewing', 'Workday', 'Compliance'],
    references: [
      { name: 'Taylor Summit', affiliation: 'Summit Corp', email: 't.summit@summitcorp.com', phone: '(303) 555-0600' },
      { name: 'Casey Mountain', affiliation: 'Mountain View Inc.', email: 'c.mountain@mountainview.com', phone: '(303) 555-0700' },
    ],
  },

  legal: {
    jobTarget: 'Legal Assistant',
    contact: {
      fullName: 'Morgan Hayes',
      firstName: 'Morgan',
      lastName: 'Hayes',
      email: 'morgan.hayes@email.com',
      phone: '(555) 012-3456',
      location: 'Washington, DC',
      address: '500 Constitution Ave, Washington',
      city: 'Washington',
      state: 'DC',
      country: 'USA',
      website: '',
      linkedin: 'linkedin.com/in/morganhayes',
    },
    summary:
      'Detail-oriented legal assistant with 4 years of experience in litigation support and law firm administration. Proficient in document management, legal research, and client communication. Strong organizational skills and familiarity with court procedures and e-filing.',
    experience: [
      {
        id: id(),
        jobTitle: 'Legal Assistant',
        company: 'Smith & Associates LLP',
        location: 'Washington, DC',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        description:
          'Support attorneys in civil litigation; draft correspondence, manage discovery, and prepare filings.\nMaintain case files and calendars; coordinate with courts and opposing counsel.',
      },
      {
        id: id(),
        jobTitle: 'Legal Secretary',
        company: 'Downtown Law Group',
        location: 'Washington, DC',
        startDate: '2019',
        endDate: '2021',
        current: false,
        description:
          'Handled scheduling, billing, and document preparation; assisted with trial preparation and exhibit organization.',
      },
    ],
    education: [
      {
        id: id(),
        degree: 'Paralegal Certificate',
        school: 'Georgetown University',
        location: 'Washington, DC',
        startDate: '2018',
        endDate: '2019',
        description: '',
      },
      {
        id: id(),
        degree: 'BA English',
        school: 'American University',
        location: 'Washington, DC',
        startDate: '2014',
        endDate: '2018',
        description: '',
      },
    ],
    skills: ['Legal Research', 'Document Management', 'E-Filing', 'Discovery', 'Westlaw', 'Microsoft Office', 'Client Communication', 'Calendar Management'],
  },
}
