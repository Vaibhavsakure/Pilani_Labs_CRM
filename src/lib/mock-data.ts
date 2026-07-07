// Mock data for PilaniLabs CRM

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  designation?: string;
  program?: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  source: string;
  value: number;
  lastContact: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: string;
  revenue: string;
  status: "active" | "prospect" | "churned";
  contacts: number;
  deals: number;
  location: string;
  logo?: string;
}

export interface PipelineDeal {
  id: string;
  title: string;
  company: string;
  designation?: string;
  value: number;
  stage: "new-lead" | "contacted" | "consultation-scheduled" | "consultation-done" | "proposal-sent" | "negotiation" | "won" | "lost";
  probability: number;
  owner: string;
  expectedClose: string;
  nextFollowUp?: string;
}

export interface Consultation {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  duration: string;
  type: "discovery" | "demo" | "strategy" | "review" | "training";
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  attendees: string[];
  notes?: string;
  outcome?: string;
  assignedConsultant?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "review" | "done";
  dueDate: string;
  relatedTo?: string;
  tags: string[];
}

export const leads: Lead[] = [
  {
    id: "L001",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@infosys.com",
    phone: "+91 98765 43210",
    company: "Infosys",
    title: "VP of Technology",
    designation: "VP of Technology",
    program: "Enterprise Private Program",
    status: "qualified",
    source: "LinkedIn",
    value: 250000,
    lastContact: "2026-07-05",
  },
  {
    id: "L002",
    name: "Priya Nair",
    email: "priya.nair@wipro.com",
    phone: "+91 98765 43211",
    company: "Wipro",
    title: "Chief Digital Officer",
    designation: "Chief Digital Officer",
    program: "Virtual Intensive",
    status: "proposal",
    source: "Conference",
    value: 480000,
    lastContact: "2026-07-04",
  },
  {
    id: "L003",
    name: "Amit Patel",
    email: "amit.patel@tcs.com",
    phone: "+91 98765 43212",
    company: "TCS",
    title: "Director of Innovation",
    designation: "Director of Innovation",
    program: "In-Person Intensive",
    status: "new",
    source: "Website",
    value: 150000,
    lastContact: "2026-07-06",
  },
  {
    id: "L004",
    name: "Sneha Gupta",
    email: "sneha.g@reliancejio.com",
    phone: "+91 98765 43213",
    company: "Reliance Jio",
    title: "Head of AI Strategy",
    designation: "Head of AI Strategy",
    program: "Enterprise Private Program",
    status: "negotiation",
    source: "Referral",
    value: 720000,
    lastContact: "2026-07-03",
  },
  {
    id: "L005",
    name: "Vikram Desai",
    email: "vikram.d@mahindra.com",
    phone: "+91 98765 43214",
    company: "Mahindra Group",
    title: "CTO",
    designation: "CTO",
    program: "In-Person Intensive",
    status: "contacted",
    source: "Email Campaign",
    value: 350000,
    lastContact: "2026-07-01",
  },
  {
    id: "L006",
    name: "Ananya Reddy",
    email: "ananya.r@hdfcbank.com",
    phone: "+91 98765 43215",
    company: "HDFC Bank",
    title: "SVP Digital Transformation",
    designation: "SVP Digital Transformation",
    program: "Enterprise Private Program",
    status: "won",
    source: "Partner",
    value: 890000,
    lastContact: "2026-06-28",
  },
  {
    id: "L007",
    name: "Karthik Iyer",
    email: "karthik.i@tatasteel.com",
    phone: "+91 98765 43216",
    company: "Tata Steel",
    title: "General Manager - IT",
    designation: "General Manager - IT",
    program: "Virtual Intensive",
    status: "qualified",
    source: "Webinar",
    value: 200000,
    lastContact: "2026-07-02",
  },
  {
    id: "L008",
    name: "Meera Joshi",
    email: "meera.j@adani.com",
    phone: "+91 98765 43217",
    company: "Adani Group",
    title: "VP - Strategic Initiatives",
    designation: "VP - Strategic Initiatives",
    program: "Enterprise Private Program",
    status: "proposal",
    source: "Cold Outreach",
    value: 560000,
    lastContact: "2026-07-05",
  },
  {
    id: "L009",
    name: "Rohan Kapoor",
    email: "rohan.k@bhartiairtel.com",
    phone: "+91 98765 43218",
    company: "Bharti Airtel",
    title: "Director of Engineering",
    designation: "Director of Engineering",
    program: "In-Person Intensive",
    status: "new",
    source: "LinkedIn",
    value: 180000,
    lastContact: "2026-07-06",
  },
  {
    id: "L010",
    name: "Deepika Menon",
    email: "deepika.m@icicibank.com",
    phone: "+91 98765 43219",
    company: "ICICI Bank",
    title: "Head of Innovation Lab",
    designation: "Head of Innovation Lab",
    program: "Virtual Intensive",
    status: "contacted",
    source: "Conference",
    value: 420000,
    lastContact: "2026-07-04",
  },
];

export const companies: Company[] = [
  {
    id: "C001",
    name: "Infosys",
    industry: "IT Services",
    employees: "300,000+",
    revenue: "$18.2B",
    status: "active",
    contacts: 4,
    deals: 2,
    location: "Bengaluru, India",
  },
  {
    id: "C002",
    name: "Wipro",
    industry: "IT Services",
    employees: "250,000+",
    revenue: "$11.3B",
    status: "active",
    contacts: 3,
    deals: 1,
    location: "Bengaluru, India",
  },
  {
    id: "C003",
    name: "TCS",
    industry: "IT Services",
    employees: "600,000+",
    revenue: "$28.1B",
    status: "prospect",
    contacts: 2,
    deals: 0,
    location: "Mumbai, India",
  },
  {
    id: "C004",
    name: "Reliance Jio",
    industry: "Telecommunications",
    employees: "50,000+",
    revenue: "$12.5B",
    status: "active",
    contacts: 5,
    deals: 3,
    location: "Mumbai, India",
  },
  {
    id: "C005",
    name: "Mahindra Group",
    industry: "Conglomerate",
    employees: "260,000+",
    revenue: "$19.4B",
    status: "prospect",
    contacts: 2,
    deals: 1,
    location: "Mumbai, India",
  },
  {
    id: "C006",
    name: "HDFC Bank",
    industry: "Banking & Finance",
    employees: "170,000+",
    revenue: "$22.8B",
    status: "active",
    contacts: 6,
    deals: 2,
    location: "Mumbai, India",
  },
  {
    id: "C007",
    name: "Tata Steel",
    industry: "Manufacturing",
    employees: "80,000+",
    revenue: "$30.3B",
    status: "prospect",
    contacts: 1,
    deals: 0,
    location: "Jamshedpur, India",
  },
  {
    id: "C008",
    name: "Adani Group",
    industry: "Conglomerate",
    employees: "45,000+",
    revenue: "$25.7B",
    status: "active",
    contacts: 3,
    deals: 1,
    location: "Ahmedabad, India",
  },
];

export const pipelineDeals: PipelineDeal[] = [
  {
    id: "D001",
    title: "Executive AI Leadership Program",
    company: "Infosys",
    designation: "VP of Technology",
    value: 250000,
    stage: "proposal-sent",
    probability: 60,
    owner: "Arjun Mehta",
    expectedClose: "2026-08-15",
    nextFollowUp: "2026-07-09",
  },
  {
    id: "D002",
    title: "Enterprise AI Transformation Workshop",
    company: "Wipro",
    designation: "Chief Digital Officer",
    value: 480000,
    stage: "negotiation",
    probability: 75,
    owner: "Arjun Mehta",
    expectedClose: "2026-07-30",
    nextFollowUp: "2026-07-08",
  },
  {
    id: "D003",
    title: "AI Strategy Bootcamp",
    company: "Reliance Jio",
    designation: "Head of AI Strategy",
    value: 720000,
    stage: "negotiation",
    probability: 80,
    owner: "Neha Verma",
    expectedClose: "2026-07-25",
    nextFollowUp: "2026-07-10",
  },
  {
    id: "D004",
    title: "Board-Level AI Readiness",
    company: "HDFC Bank",
    designation: "SVP Digital Transformation",
    value: 890000,
    stage: "won",
    probability: 100,
    owner: "Neha Verma",
    expectedClose: "2026-06-28",
  },
  {
    id: "D005",
    title: "C-Suite AI Immersion",
    company: "Adani Group",
    designation: "VP - Strategic Initiatives",
    value: 560000,
    stage: "proposal-sent",
    probability: 45,
    owner: "Arjun Mehta",
    expectedClose: "2026-09-01",
    nextFollowUp: "2026-07-11",
  },
  {
    id: "D006",
    title: "AI Governance Training",
    company: "Mahindra Group",
    designation: "CTO",
    value: 350000,
    stage: "consultation-scheduled",
    probability: 30,
    owner: "Sanya Kapoor",
    expectedClose: "2026-09-15",
    nextFollowUp: "2026-07-15",
  },
  {
    id: "D007",
    title: "GenAI for Leaders Workshop",
    company: "TCS",
    designation: "Director of Innovation",
    value: 150000,
    stage: "new-lead",
    probability: 20,
    owner: "Sanya Kapoor",
    expectedClose: "2026-10-01",
    nextFollowUp: "2026-07-08",
  },
  {
    id: "D008",
    title: "Digital Leadership Accelerator",
    company: "ICICI Bank",
    designation: "Head of Innovation Lab",
    value: 420000,
    stage: "contacted",
    probability: 50,
    owner: "Neha Verma",
    expectedClose: "2026-08-20",
    nextFollowUp: "2026-07-12",
  },
  {
    id: "D009",
    title: "AI Ethics & Compliance Program",
    company: "Bharti Airtel",
    designation: "Director of Engineering",
    value: 180000,
    stage: "consultation-done",
    probability: 15,
    owner: "Arjun Mehta",
    expectedClose: "2026-10-15",
    nextFollowUp: "2026-07-14",
  },
  {
    id: "D010",
    title: "AI Innovation Lab Setup",
    company: "Tata Steel",
    designation: "General Manager - IT",
    value: 200000,
    stage: "consultation-scheduled",
    probability: 25,
    owner: "Sanya Kapoor",
    expectedClose: "2026-09-30",
    nextFollowUp: "2026-07-18",
  },
];

export const consultations: Consultation[] = [
  {
    id: "CN001",
    title: "AI Strategy Discovery Call",
    client: "Infosys",
    date: "2026-07-08",
    time: "10:00 AM",
    duration: "60 min",
    type: "discovery",
    status: "scheduled",
    attendees: ["Rajesh Sharma", "Arjun Mehta"],
    assignedConsultant: "Arjun Mehta",
  },
  {
    id: "CN002",
    title: "Platform Demo - Executive Dashboard",
    client: "Wipro",
    date: "2026-07-08",
    time: "2:00 PM",
    duration: "45 min",
    type: "demo",
    status: "scheduled",
    attendees: ["Priya Nair", "Neha Verma", "Sanya Kapoor"],
    assignedConsultant: "Neha Verma",
  },
  {
    id: "CN003",
    title: "Quarterly Business Review",
    client: "HDFC Bank",
    date: "2026-07-09",
    time: "11:00 AM",
    duration: "90 min",
    type: "review",
    status: "scheduled",
    attendees: ["Ananya Reddy", "Neha Verma"],
    assignedConsultant: "Neha Verma",
  },
  {
    id: "CN004",
    title: "AI Transformation Roadmap",
    client: "Reliance Jio",
    date: "2026-07-07",
    time: "3:00 PM",
    duration: "60 min",
    type: "strategy",
    status: "completed",
    attendees: ["Sneha Gupta", "Arjun Mehta", "Neha Verma"],
    notes: "Discussed 3-phase rollout plan. Client very interested in GenAI modules.",
    outcome: "Proceed to Proposal",
    assignedConsultant: "Arjun Mehta",
  },
  {
    id: "CN005",
    title: "Executive AI Training Session 1",
    client: "Adani Group",
    date: "2026-07-10",
    time: "9:00 AM",
    duration: "120 min",
    type: "training",
    status: "scheduled",
    attendees: ["Meera Joshi", "Sanya Kapoor"],
    assignedConsultant: "Sanya Kapoor",
  },
  {
    id: "CN006",
    title: "Follow-up: AI Governance Framework",
    client: "Mahindra Group",
    date: "2026-07-06",
    time: "4:00 PM",
    duration: "30 min",
    type: "strategy",
    status: "completed",
    attendees: ["Vikram Desai", "Arjun Mehta"],
    notes: "Need to prepare detailed proposal by next week.",
    outcome: "Needs internal review",
    assignedConsultant: "Arjun Mehta",
  },
];

export const tasks: Task[] = [
  {
    id: "T001",
    title: "Prepare proposal for Wipro AI Workshop",
    description: "Draft comprehensive proposal including timeline, modules, and pricing for the Enterprise AI Transformation Workshop.",
    assignee: "Arjun Mehta",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-07-09",
    relatedTo: "Wipro",
    tags: ["proposal", "sales"],
  },
  {
    id: "T002",
    title: "Follow up with Reliance Jio on contract terms",
    description: "Send revised contract with updated payment terms as discussed in the last call.",
    assignee: "Neha Verma",
    priority: "urgent",
    status: "todo",
    dueDate: "2026-07-08",
    relatedTo: "Reliance Jio",
    tags: ["contract", "negotiation"],
  },
  {
    id: "T003",
    title: "Create case study from HDFC Bank engagement",
    description: "Document the HDFC Bank AI readiness program outcomes for marketing materials.",
    assignee: "Sanya Kapoor",
    priority: "medium",
    status: "todo",
    dueDate: "2026-07-12",
    relatedTo: "HDFC Bank",
    tags: ["marketing", "case-study"],
  },
  {
    id: "T004",
    title: "Update training curriculum for Q3",
    description: "Incorporate latest GenAI developments and new case studies into the executive training modules.",
    assignee: "Arjun Mehta",
    priority: "medium",
    status: "in-progress",
    dueDate: "2026-07-15",
    tags: ["curriculum", "content"],
  },
  {
    id: "T005",
    title: "Schedule demo for TCS innovation team",
    description: "Coordinate with Amit Patel to set up a demo of the AI Strategy platform.",
    assignee: "Sanya Kapoor",
    priority: "low",
    status: "todo",
    dueDate: "2026-07-10",
    relatedTo: "TCS",
    tags: ["demo", "outreach"],
  },
];

export const dashboardStats = {
  totalRevenue: 4200000,
  revenueGrowth: 23.5,
  activeDeals: 8,
  dealsGrowth: 12,
  conversionRate: 34.2,
  conversionGrowth: 5.8,
  avgDealSize: 425000,
  avgDealGrowth: -2.3,
  newLeads: 24,
  leadsGrowth: 18,
  consultationsThisWeek: 6,
  tasksDue: 5,
  pipelineValue: 3810000,
  totalLeads: 142,
  proposalsSent: 12,
  dealsWon: 28,
};

export const revenueData = [
  { month: "Jan", revenue: 280000, target: 300000 },
  { month: "Feb", revenue: 320000, target: 310000 },
  { month: "Mar", revenue: 380000, target: 350000 },
  { month: "Apr", revenue: 350000, target: 380000 },
  { month: "May", revenue: 420000, target: 400000 },
  { month: "Jun", revenue: 890000, target: 450000 },
  { month: "Jul", revenue: 560000, target: 500000 },
];

export const leadSourceData = [
  { name: "LinkedIn", value: 35, color: "#C8962E" },
  { name: "Conference", value: 22, color: "#1B2A4A" },
  { name: "Referral", value: 18, color: "#2D4A7A" },
  { name: "Website", value: 15, color: "#D5D0C7" },
  { name: "Email Campaign", value: 10, color: "#F5EDD6" },
];

export const weeklyActivity = [
  { day: "Mon", calls: 8, emails: 15, meetings: 3 },
  { day: "Tue", calls: 12, emails: 20, meetings: 5 },
  { day: "Wed", calls: 6, emails: 18, meetings: 2 },
  { day: "Thu", calls: 10, emails: 22, meetings: 4 },
  { day: "Fri", calls: 14, emails: 25, meetings: 6 },
  { day: "Sat", calls: 2, emails: 5, meetings: 0 },
  { day: "Sun", calls: 0, emails: 2, meetings: 0 },
];

export const followUps = [
  { id: "F1", name: "Rajesh Sharma", company: "Infosys", type: "Email", time: "Today, 2:00 PM" },
  { id: "F2", name: "Priya Nair", company: "Wipro", type: "Call", time: "Today, 4:30 PM" },
  { id: "F3", name: "Amit Patel", company: "TCS", type: "LinkedIn", time: "Tomorrow, 10:00 AM" },
];

export const lostReasons = [
  { reason: "Budget Constraints", percentage: 45, color: "#C8962E" },
  { reason: "Timing Not Right", percentage: 25, color: "#1B2A4A" },
  { reason: "Went with Competitor", percentage: 15, color: "#6B7280" },
  { reason: "No Authority", percentage: 10, color: "#D5D0C7" },
  { reason: "Other", percentage: 5, color: "#F5EDD6" },
];
