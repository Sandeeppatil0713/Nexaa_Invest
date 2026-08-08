export const growthData = [
  { month: "Jan", investment: 120000, roi: 8400, wallet: 32000, referral: 4200 },
  { month: "Feb", investment: 180000, roi: 12600, wallet: 41000, referral: 6100 },
  { month: "Mar", investment: 240000, roi: 17400, wallet: 56000, referral: 9300 },
  { month: "Apr", investment: 310000, roi: 23100, wallet: 68000, referral: 12800 },
  { month: "May", investment: 420000, roi: 31600, wallet: 84000, referral: 18400 },
  { month: "Jun", investment: 500000, roi: 42800, wallet: 97000, referral: 26900 },
  { month: "Jul", investment: 580000, roi: 61200, wallet: 112000, referral: 38200 },
  { month: "Aug", investment: 620000, roi: 96480, wallet: 124800, referral: 48600 },
];

export const roiTrend = [
  { day: "Mon", roi: 1840 },
  { day: "Tue", roi: 1920 },
  { day: "Wed", roi: 1890 },
  { day: "Thu", roi: 2010 },
  { day: "Fri", roi: 2080 },
  { day: "Sat", roi: 2110 },
  { day: "Sun", roi: 2140 },
];

export const investments = [
  { id: "INV-10241", plan: "Enterprise", amount: "₹5,00,000", daily: "1.8%", start: "12 Feb 2026", end: "11 Aug 2026", status: "Active" },
  { id: "INV-10188", plan: "Professional", amount: "₹1,00,000", daily: "1.5%", start: "04 Jan 2026", end: "03 May 2026", status: "Completed" },
  { id: "INV-10102", plan: "Professional", amount: "₹50,000", daily: "1.5%", start: "22 Mar 2026", end: "20 Jul 2026", status: "Active" },
  { id: "INV-10077", plan: "Starter", amount: "₹20,000", daily: "1.0%", start: "18 Apr 2026", end: "17 Jul 2026", status: "Active" },
];

export const roiHistory = [
  { date: "03 Aug 2026", investment: "INV-10241", amount: "₹9,000", status: "Credited" },
  { date: "03 Aug 2026", investment: "INV-10102", amount: "₹750", status: "Credited" },
  { date: "02 Aug 2026", investment: "INV-10241", amount: "₹9,000", status: "Credited" },
  { date: "02 Aug 2026", investment: "INV-10077", amount: "₹200", status: "Credited" },
  { date: "01 Aug 2026", investment: "INV-10241", amount: "₹9,000", status: "Credited" },
];

export const referralIncome = [
  { user: "Ravi Kumar", level: "Level 1", amount: "₹2,500", date: "03 Aug 2026" },
  { user: "Neha Shah", level: "Level 2", amount: "₹900", date: "02 Aug 2026" },
  { user: "Tom Alvarez", level: "Level 1", amount: "₹5,000", date: "01 Aug 2026" },
  { user: "Ishita Bose", level: "Level 3", amount: "₹400", date: "31 Jul 2026" },
  { user: "Karan Vora", level: "Level 4", amount: "₹150", date: "30 Jul 2026" },
];

export const transactions = [
  { ref: "TXN-88213", type: "ROI Credit", amount: "+₹9,750", date: "03 Aug 2026", status: "Success" },
  { ref: "TXN-88190", type: "Referral Income", amount: "+₹2,500", date: "03 Aug 2026", status: "Success" },
  { ref: "TXN-88104", type: "Investment", amount: "-₹50,000", date: "22 Mar 2026", status: "Success" },
  { ref: "TXN-88061", type: "Withdrawal", amount: "-₹25,000", date: "18 Mar 2026", status: "Processed" },
];

export const referralTree = [
  {
    name: "Ravi Kumar",
    invested: "₹1,00,000",
    children: [
      { name: "Neha Shah", invested: "₹40,000", children: [{ name: "Ishita Bose", invested: "₹20,000", children: [] }] },
      { name: "Arjun Iyer", invested: "₹25,000", children: [] },
    ],
  },
  {
    name: "Tom Alvarez",
    invested: "₹2,00,000",
    children: [{ name: "Karan Vora", invested: "₹15,000", children: [] }],
  },
];

export type TreeNode = (typeof referralTree)[number];
