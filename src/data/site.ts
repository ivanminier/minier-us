export const site = {
  name: 'Ivan Minier',
  title: 'Ivan Minier — Founder & Product Builder',
  description:
    'Ivan Minier builds products and systems. Founder of Tideframe Labs and Business Administration student at the University of Vermont.',
  url: 'https://minier.us',
  locale: 'en_US',
  location: 'Vermont',
  school: 'University of Vermont',
  program: 'Business Administration',
  tagline: 'I turn messy systems into calm products.',
  lede: 'Founder of Tideframe Labs and Business Administration student at the University of Vermont. I design and build software, systems, and ideas.',
  ogImage: '/media/og/share.png',
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
  { label: 'Ideas', href: '/ideas' },
  { label: 'Contact', href: '/contact' },
] as const;

export const tideframe = {
  name: 'Tideframe Labs',
  descriptor: 'Independent software studio founded by Ivan Minier in Vermont.',
  url: 'https://tideframelabs.com',
  supportEmail: 'support@tideframelabs.com',
  generalEmail: 'hello@tideframelabs.com',
  line: 'Native software for Mac, iPhone, and iPad.',
} as const;
