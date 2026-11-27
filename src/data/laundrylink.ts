export const laundryLink = {
  name: "UVM LaundryLink",
  dates: "May 2025–Present",
  status: "Live · In maintenance",
  context: "Independent student project",
  role: "Creator · Product direction, interface design, and AI-assisted engineering",
  description: "An independent University of Vermont laundry tracker for checking reported washer and dryer availability across 44 campus laundry rooms.",
  oneLiner: "Check reported washer and dryer availability before making the trip.",
  socialImage: "/media/og/laundrylink-showcase.png",
  socialImageAlt: "UVM LaundryLink residence hall directory and mobile room tracker.",
  url: "https://uvmlaundry.com/",
  source: "https://github.com/ivanminier/uvm-laundry-link",
  coverage: { rooms: 44, hallGroups: 30, areas: 4, feeds: 43, publicPages: 53 },
  release: {
    date: "November 27, 2026",
    tests: 20,
    workflow: "https://github.com/ivanminier/uvm-laundry-link/actions/runs/45988068598",
  },
} as const;
