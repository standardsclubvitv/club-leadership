import { Position } from '@/types';

export const defaultPositions: Position[] = [
  {
    id: 'chairperson',
    title: 'Chairperson',
    description:
      'Lead the BIS Standards Club VIT as the primary representative. Oversee all club operations, strategic planning, and ensure the club achieves its goals and objectives.',
    questions: [
      'Why do you want to be the Chairperson of BIS Standards Club? What vision do you have for the club? (300-500 words)',
      'Describe your leadership experience. How have you handled challenging situations as a leader?',
      'How would you ensure effective coordination between all club departments and members?',
      'What initiatives would you propose to enhance the club\'s reputation and impact at VIT?',
    ],
    isActive: true,
  },
  {
    id: 'vice-chairperson',
    title: 'Vice Chairperson',
    description:
      'Support the Chairperson in leading the club. Assist in strategic decision-making, represent the club in the Chairperson\'s absence, and help coordinate cross-functional activities.',
    questions: [
      'Why do you want to be the Vice Chairperson of BIS Standards Club? (300-500 words)',
      'How would you support the Chairperson while bringing your own ideas to the table?',
      'Describe a situation where you successfully collaborated with others to achieve a common goal.',
      'What qualities do you believe are essential for a Vice Chairperson, and how do you embody them?',
    ],
    isActive: true,
  },
  {
    id: 'secretary',
    title: 'Secretary',
    description:
      'Manage official club communications, maintain records, coordinate meetings, and ensure smooth administrative operations of the club.',
    questions: [
      'Why do you want to be the Secretary of BIS Standards Club? (300-500 words)',
      'Describe your experience with administrative tasks, documentation, and organizational skills.',
      'How would you ensure effective communication within the club and with external stakeholders?',
      'What systems would you implement to streamline club operations and record-keeping?',
    ],
    isActive: true,
  },
  {
    id: 'co-secretary',
    title: 'Co-Secretary',
    description:
      'Assist the Secretary in managing communications, documentation, and administrative tasks. Help coordinate between different departments.',
    questions: [
      'Why do you want to be the Co-Secretary of BIS Standards Club? (300-500 words)',
      'How would you support the Secretary in managing club operations?',
      'Describe your attention to detail and organizational capabilities with examples.',
      'What ideas do you have to improve internal communication within the club?',
    ],
    isActive: true,
  },
  {
    id: 'technical-head',
    title: 'Technical Head',
    description:
      'Lead technical initiatives, oversee development projects, conduct technical workshops, and mentor team members in technical skills.',
    questions: [
      'Why do you want to be the Technical Head of BIS Standards Club? (300-500 words)',
      'What technical skills and programming languages are you proficient in? Describe a project you have led or contributed significantly to.',
      'How would you approach mentoring junior members and conducting technical workshops?',
      'What innovative technical initiatives would you propose for the club?',
    ],
    isActive: true,
  },
  {
    id: 'creative-head',
    title: 'Creative Head',
    description:
      'Drive creative direction for all club activities. Conceptualize innovative ideas for events, campaigns, and content that engage the audience.',
    questions: [
      'Why do you want to be the Creative Head of BIS Standards Club? (300-500 words)',
      'Share examples of creative projects or campaigns you have conceptualized or executed.',
      'How would you ensure fresh and innovative ideas for club activities throughout the year?',
      'Describe your creative process when brainstorming for a major event or campaign.',
    ],
    isActive: true,
  },
  {
    id: 'design-head',
    title: 'Design Head',
    description:
      'Create visual designs for events, social media, and promotional materials. Maintain brand consistency and lead the design team.',
    questions: [
      'Why do you want to be the Design Head of BIS Standards Club? (300-500 words)',
      'What design tools are you proficient in? Share your portfolio or examples of your design work.',
      'How would you ensure brand consistency across all club materials?',
      'Describe your design process when creating materials for a major event.',
    ],
    isActive: true,
  },
  {
    id: 'events-head',
    title: 'Events Head',
    description:
      'Plan, organize, and execute club events, workshops, and seminars. Coordinate logistics, manage timelines, and ensure successful event delivery.',
    questions: [
      'Why do you want to be the Events Head of BIS Standards Club? (300-500 words)',
      'Describe your previous experience in event management or organizing activities.',
      'How would you plan and execute a large-scale technical event with 500+ attendees?',
      'What creative event ideas would you bring to the club?',
    ],
    isActive: true,
  },
  {
    id: 'management-head',
    title: 'Management Head',
    description:
      'Oversee club operations, resource allocation, and project management. Ensure efficient workflow and coordination between departments.',
    questions: [
      'Why do you want to be the Management Head of BIS Standards Club? (300-500 words)',
      'Describe your experience with project management and team coordination.',
      'How would you handle resource constraints while managing multiple club activities?',
      'What management frameworks or tools would you implement to improve club efficiency?',
    ],
    isActive: true,
  },
  {
    id: 'projects-head',
    title: 'Projects Head',
    description:
      'Lead and manage club projects from conception to completion. Coordinate with technical and non-technical teams to deliver impactful projects.',
    questions: [
      'Why do you want to be the Projects Head of BIS Standards Club? (300-500 words)',
      'Describe a project you have successfully led or been a key contributor to.',
      'How would you prioritize and manage multiple ongoing projects simultaneously?',
      'What types of projects would you propose to enhance the club\'s portfolio?',
    ],
    isActive: true,
  },
  {
    id: 'hr-head',
    title: 'HR Head',
    description:
      'Manage member recruitment, onboarding, and retention. Foster a positive club culture and handle member-related concerns.',
    questions: [
      'Why do you want to be the HR Head of BIS Standards Club? (300-500 words)',
      'How would you approach recruiting and onboarding new members effectively?',
      'Describe strategies you would implement to maintain high member engagement and morale.',
      'How would you handle conflicts or issues among club members?',
    ],
    isActive: true,
  },
  {
    id: 'outreach-head',
    title: 'Outreach Head',
    description:
      'Build and maintain relationships with sponsors, partners, and other organizations. Expand the club\'s network and collaboration opportunities.',
    questions: [
      'Why do you want to be the Outreach Head of BIS Standards Club? (300-500 words)',
      'Describe your networking and communication skills with examples.',
      'How would you approach potential sponsors and industry partners?',
      'What strategies would you use to expand the club\'s external collaborations?',
    ],
    isActive: true,
  },
  {
    id: 'editorial-head',
    title: 'Editorial Head',
    description:
      'Oversee all written content including newsletters, blogs, articles, and publications. Ensure high-quality and engaging written communication.',
    questions: [
      'Why do you want to be the Editorial Head of BIS Standards Club? (300-500 words)',
      'Share samples of your writing (blogs, articles, newsletters) or describe your writing experience.',
      'How would you create engaging content about technical standards and industry topics?',
      'What content strategy would you implement to enhance the club\'s written presence?',
    ],
    isActive: true,
  },
  {
    id: 'development-head',
    title: 'Development Head',
    description:
      'Lead software development initiatives, manage the club\'s digital platforms, and oversee technical product development.',
    questions: [
      'Why do you want to be the Development Head of BIS Standards Club? (300-500 words)',
      'What programming languages and frameworks are you proficient in? Share your GitHub profile or project portfolio.',
      'Describe a software project you have developed or contributed to significantly.',
      'What digital products or platforms would you propose to build for the club?',
    ],
    isActive: true,
  },
  {
    id: 'publicity-head',
    title: 'Publicity Head',
    description:
      'Manage social media accounts, develop marketing strategies, and increase brand visibility. Drive engagement and reach across platforms.',
    questions: [
      'Why do you want to be the Publicity Head of BIS Standards Club? (300-500 words)',
      'Describe your experience with social media management and marketing.',
      'How would you increase the club\'s reach and engagement on various platforms?',
      'What marketing campaign would you create to attract more members to the club?',
    ],
    isActive: true,
  },
  {
    id: 'finance-head',
    title: 'Finance Head',
    description:
      'Manage club finances, budgets, and transactions. Ensure transparent financial reporting and efficient resource allocation.',
    questions: [
      'Why do you want to be the Finance Head of BIS Standards Club? (300-500 words)',
      'Describe your experience with financial management, budgeting, or accounting.',
      'How would you ensure transparent and efficient management of club funds?',
      'What budget allocation strategy would you propose for various club activities?',
    ],
    isActive: true,
  },
];

export const yearOptions = [
  { value: '1st Year', label: '1st Year' },
  { value: '2nd Year', label: '2nd Year' },
  { value: '3rd Year', label: '3rd Year' },
  { value: '4th Year', label: '4th Year' },
];

export const branchOptions = [
  { value: 'CSE', label: 'Computer Science and Engineering' },
  { value: 'ECE', label: 'Electronics and Communication Engineering' },
  { value: 'EEE', label: 'Electrical and Electronics Engineering' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'Other', label: 'Other' },
];
