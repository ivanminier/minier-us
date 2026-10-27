export const site = {
  name: 'Ivan Minier',
  title: 'Ivan Minier — Founder & Product Builder',
  description:
    'Ivan Minier builds products and systems. Founder of Tideframe Labs and a Public Communication student at the University of Vermont.',
  url: 'https://minier.us',
  locale: 'en_US',
  location: 'Vermont',
  school: 'University of Vermont',
  program: 'Public Communication',
  programDetail:
    'Department of Community Development and Applied Economics (CDAE), College of Agriculture and Life Sciences, University of Vermont',
  tagline: 'I turn messy systems into calm products.',
  lede: 'I’m Ivan Minier, founder of Tideframe Labs and a Public Communication student at the University of Vermont. I work across research, writing, design, and software to make complex systems easier to understand and use.',
  currently: 'Building Lineup · Running Tideframe Labs · Studying Public Communication at UVM',
  ogImage: '/media/og/home.png',
  copyrightName: 'Ivan Minier',
} as const;

export const emails = {
  primary: {
    label: 'Email',
    address: 'ivan@minier.us',
    href: 'mailto:ivan@minier.us',
    note: 'Best place to reach me',
  },
  school: {
    label: 'School',
    address: 'ivan.minier@uvm.edu',
    href: 'mailto:ivan.minier@uvm.edu',
    note: 'University of Vermont',
  },
  personal: {
    label: 'Personal',
    address: 'ivanfminier@gmail.com',
    href: 'mailto:ivanfminier@gmail.com',
    note: 'Also fine',
  },
} as const;

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Tideframe', href: '/tideframe' },
  { label: 'About', href: '/about' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Ideas', href: '/ideas' },
  { label: 'Contact', href: '/contact' },
] as const;

export const tideframe = {
  name: 'Tideframe Labs',
  descriptor: 'Independent software studio founded by Ivan Minier in Vermont.',
  url: 'https://tideframelabs.com',
  supportEmail: 'support@tideframelabs.com',
  generalEmail: 'hello@tideframelabs.com',
  line: 'Native software for Apple platforms.',
} as const;
