export type ProjectStatus = 'in-development' | 'available' | 'independent';
export type Studio = 'tideframe' | 'independent';

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ProjectMedia {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  year: string;
  status: ProjectStatus;
  statusLabel: string;
  studio: Studio;
  studioLabel: string;
  platforms: string[];
  platformsPlanned?: string;
  platformsNote?: string;
  creator: string;
  role: string;
  officialHome?: ProjectLink;
  oneLiner: string;
  summary: string;
  href: string;
  accent: string;
  theme: 'cinematic' | 'paper' | 'mac' | 'editorial' | 'campus';
  icon?: string;
  hero: ProjectMedia;
  gallery: ProjectMedia[];
  links: ProjectLink[];
  problem: string;
  approach: string;
  capabilities: { title: string; body: string }[];
  reasoning: string;
  nextSlug: string;
}

export const projects: Project[] = [
  {
    slug: 'lineup',
    name: 'Lineup',
    shortName: 'Lineup',
    category: 'Television software',
    year: '2026',
    status: 'in-development',
    statusLabel: 'In development',
    studio: 'tideframe',
    studioLabel: 'Tideframe Labs',
    platforms: ['iPhone', 'iPad', 'Apple TV'],
    platformsPlanned: 'Mac planned',
    platformsNote:
      'Public 1.0 is being built for iPhone, iPad, and Apple TV. A native Mac app is planned on the same engine and is not shipping yet.',
    creator: 'Ivan Minier',
    role: 'Creator — product, interface, and engineering',
    officialHome: { label: 'Tideframe Labs', href: 'https://tideframelabs.com', external: true },
    oneLiner: 'Your provider gives you channels. Lineup turns them into television.',
    summary:
      'Lineup is an Apple-native player and organizer for lawful, user-supplied IPTV sources. It takes Xtream and M3U catalogs and turns them into Live TV, movies, series, and a usable guide.',
    href: '/work/lineup',
    accent: '#1f8a6e',
    theme: 'cinematic',
    icon: '/media/lineup/icon.webp',
    hero: {
      src: '/media/lineup/home.webp',
      srcset: '/media/lineup/home-sm.webp 480w, /media/lineup/home.webp 900w',
      width: 900,
      height: 1950,
      alt: 'Lineup Home on iPhone showing the fictional demo catalog, with Live Now channels and recently added movies.',
    },
    gallery: [
      {
        src: '/media/lineup/welcome.webp',
        width: 900,
        height: 1950,
        alt: 'Lineup welcome screen: Your channels, movies, and shows—beautifully organized.',
      },
      {
        src: '/media/lineup/sources.webp',
        width: 900,
        height: 1950,
        alt: 'Lineup source setup with M3U, Xtream, local playlist file, and a fictional demo catalog.',
      },
      {
        src: '/media/lineup/edit-home.webp',
        width: 900,
        height: 1950,
        alt: 'Lineup Edit Home screen with Live Now, Movies, Series, and Watchlist sections.',
      },
      {
        src: '/media/lineup/profile.webp',
        width: 900,
        height: 1950,
        alt: 'Lineup profile setup with standard and child profile types.',
      },
    ],
    links: [
      { label: 'Tideframe Labs', href: 'https://tideframelabs.com', external: true },
    ],
    problem:
      'Most IPTV sources arrive as a pile of names, categories, missing logos, and half-matched guide data. The player usually just plays whatever it is given.',
    approach:
      'Lineup treats the provider feed as evidence, not as the interface. It keeps the original catalog intact, then derives cleaner names, categories, logos, order, and guide matches. The person watching television should not have to decode a playlist.',
    capabilities: [
      {
        title: 'Smart names and categories',
        body: 'Cluttered provider labels become readable channel names. Categories can be simplified, renamed, hidden, or reordered without rewriting the source.',
      },
      {
        title: 'Logos and guide matching',
        body: 'Missing artwork can be filled from verified sources. Lineup matches schedules to channels, including automatic guide support for Xtream and M3U, with optional external guide sources such as EPGShare01.',
      },
      {
        title: 'Live, movies, series, and watchlists',
        body: 'The same organized catalog becomes Home, Live TV, Movies, Series, a program guide, and the lists people actually use.',
      },
      {
        title: 'User-supplied sources only',
        body: 'Lineup is a player and organizer. It does not provide, host, sell, or recommend channels, movies, series, or subscriptions.',
      },
    ],
    reasoning:
      'The hard problem is not another play button. It is turning a raw catalog into something a person can actually watch. Lineup Intelligence exists so the product can do that work once, then stay out of the way.',
    nextSlug: 'rental-record',
  },
  {
    slug: 'rental-record',
    name: 'Tideframe Rental Record',
    shortName: 'Rental Record',
    category: 'Rental documentation',
    year: '2026',
    status: 'available',
    statusLabel: 'On the App Store',
    studio: 'tideframe',
    studioLabel: 'Tideframe Labs',
    platforms: ['iPhone', 'iPad', 'Mac'],
    creator: 'Ivan Minier',
    role: 'Creator — product, interface, and engineering',
    officialHome: {
      label: 'App Store',
      href: 'https://apps.apple.com/us/app/tideframe-rental-record/id6796366130',
      external: true,
    },
    oneLiner: 'A structured rental record instead of a camera roll full of disconnected photos.',
    summary:
      'Tideframe Rental Record is a private, guided app for move-in, move-out, and follow-up condition records. Photos, notes, rooms, and reports stay together on the device.',
    href: '/work/rental-record',
    accent: '#2b6d93',
    theme: 'paper',
    icon: '/media/rental-record/icon.webp',
    hero: {
      src: '/media/rental-record/iphone-cases.webp',
      srcset: '/media/rental-record/iphone-cases-sm.webp 440w, /media/rental-record/iphone-cases.webp 880w',
      width: 880,
      height: 1912,
      alt: 'Rental Record Cases screen on iPhone using fictional rental data.',
    },
    gallery: [
      {
        src: '/media/rental-record/iphone-room.webp',
        width: 880,
        height: 1912,
        alt: 'Rental Record living-room checklist on iPhone using fictional rental data.',
      },
      {
        src: '/media/rental-record/iphone-evidence.webp',
        width: 880,
        height: 1912,
        alt: 'Rental Record evidence and observations on iPhone using fictional rental data.',
      },
      {
        src: '/media/rental-record/iphone-report.webp',
        width: 880,
        height: 1912,
        alt: 'Rental Record PDF report preview on iPhone using fictional rental data.',
      },
      {
        src: '/media/rental-record/ipad-overview.webp',
        width: 1032,
        height: 1376,
        alt: 'Rental Record Cases overview on iPad using fictional rental data.',
      },
      {
        src: '/media/rental-record/mac-cases.webp',
        srcset: '/media/rental-record/mac-cases-sm.webp 960w, /media/rental-record/mac-cases.webp 1440w',
        width: 1440,
        height: 900,
        alt: 'Rental Record Cases window on Mac using fictional rental data.',
      },
      {
        src: '/media/rental-record/mac-inspection.webp',
        width: 1440,
        height: 900,
        alt: 'Rental Record move-in inspection overview on Mac using fictional rental data.',
      },
    ],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/us/app/tideframe-rental-record/id6796366130',
        external: true,
      },
      {
        label: 'Tideframe product page',
        href: 'https://tideframelabs.com/rental-record',
        external: true,
      },
    ],
    problem:
      'Move-in photos disappear into a camera roll. Months later, nobody can tell which room a photo belonged to, what it was meant to show, or whether anything changed.',
    approach:
      'Rental Record walks through rooms, checklists, wide and close-up photos, observations, and later comparisons. The record stays local and private unless someone chooses to export it.',
    capabilities: [
      {
        title: 'Guided inspections',
        body: 'Move-in, move-out, and follow-up records with room checklists, wide and close-up photos, and written observations.',
      },
      {
        title: 'Evidence that stays together',
        body: 'Photos, notes, maintenance, communications, attachments, and appliance details belong to the rental, not to a pile of unmarked images.',
      },
      {
        title: 'Reports and packages',
        body: 'PDF reports and evidence packages, including local file hashes for integrity checking. Hashes help compare files. They do not prove legal facts.',
      },
      {
        title: 'Private by default',
        body: 'No app account and no developer-operated evidence server. Optional private iCloud backup is available. Exporting is explicit.',
      },
    ],
    reasoning:
      'A rental record is useful only if it is complete, reviewable, and still understandable later. The product is an organizational tool, not a legal service.',
    nextSlug: 'modeboard',
  },
  {
    slug: 'modeboard',
    name: 'Modeboard',
    shortName: 'Modeboard',
    category: 'Mac workspace',
    year: '2026',
    status: 'available',
    statusLabel: 'Available for Mac',
    studio: 'tideframe',
    studioLabel: 'Tideframe Labs',
    platforms: ['Mac'],
    creator: 'Ivan Minier',
    role: 'Creator — product, interface, and engineering',
    officialHome: { label: 'tideframelabs.com/modeboard', href: 'https://tideframelabs.com/modeboard', external: true },
    oneLiner: 'Switch your whole Mac workspace with one profile.',
    summary:
      'Modeboard is a native Mac utility that turns a named profile into a complete workspace. Apps, files, Dock, wallpaper, appearance, Desktop, menu bar, Shortcuts, and a Focus Filter can move together.',
    href: '/work/modeboard',
    accent: '#2b6d93',
    theme: 'mac',
    icon: '/media/modeboard/icon.webp',
    hero: {
      src: '/media/modeboard/profile-overview.webp',
      srcset:
        '/media/modeboard/profile-overview-sm.webp 800w, /media/modeboard/profile-overview.webp 1400w',
      width: 1400,
      height: 1056,
      alt: 'Modeboard profile editor with Default, Do Not Disturb, Work, Sleep, Travel, and College profiles.',
    },
    gallery: [
      {
        src: '/media/modeboard/appearance-dock.webp',
        width: 1400,
        height: 1056,
        alt: 'Modeboard appearance and Dock settings for a workspace profile.',
      },
      {
        src: '/media/modeboard/menu-bar.webp',
        width: 1400,
        height: 1056,
        alt: 'Modeboard menu bar and Desktop settings.',
      },
      {
        src: '/media/modeboard/backups-restore.webp',
        width: 1400,
        height: 1056,
        alt: 'Modeboard backups and restore history.',
      },
      {
        src: '/media/modeboard/onboarding-focus.webp',
        width: 1400,
        height: 1056,
        alt: 'Modeboard onboarding explaining Focus Filter integration.',
      },
    ],
    links: [
      {
        label: 'Tideframe product page',
        href: 'https://tideframelabs.com/modeboard',
        external: true,
      },
    ],
    problem:
      'A Mac is usually one arrangement trying to serve every part of the day. Work, study, and everything else share the same Dock, wallpaper, Desktop, and open apps.',
    approach:
      'A named profile can change the parts of the Mac that belong to that moment. Apply it from Modeboard, the menu bar, Apple Shortcuts, or a macOS Focus Filter.',
    capabilities: [
      {
        title: 'Workspace profiles',
        body: 'Open selected apps, files, and folders. Change Dock layout, wallpaper, appearance, Desktop items, and supported menu-bar state.',
      },
      {
        title: 'Apply it your way',
        body: 'Switch from the app, the menu bar, Shortcuts, or a Focus Filter. Modeboard does not create Focus modes. macOS does.',
      },
      {
        title: 'Backed up first',
        body: 'Modeboard creates a verified backup before relevant changes, with restore and Emergency Restore for supported settings.',
      },
    ],
    reasoning:
      'The product should feel like a native Mac utility: quiet, specific, and reversible. It changes what you ask it to change, then gets out of the way.',
    nextSlug: 'trinity-redistricting',
  },
  {
    slug: 'trinity-redistricting',
    name: 'Trinity Redistricting',
    shortName: 'Trinity',
    category: 'Campus planning',
    year: '2026',
    status: 'independent',
    statusLabel: 'Independent student vision',
    studio: 'independent',
    studioLabel: 'Independent project',
    platforms: ['Web'],
    creator: 'Ivan Minier',
    role: 'Author — research, planning, writing, and the public site',
    officialHome: { label: 'trinityredistricting.com', href: 'https://trinityredistricting.com', external: true },
    oneLiner: 'A student-led feasibility vision for housing on UVM’s Trinity Campus.',
    summary:
      'Trinity Redistricting is an independent concept and feasibility study for turning UVM’s Trinity District into a more complete residential campus. It is not an official University of Vermont or City of Burlington plan.',
    href: '/work/trinity-redistricting',
    accent: '#046a48',
    theme: 'editorial',
    icon: '/media/trinity/logo.webp',
    hero: {
      src: '/media/trinity/home-hero.webp',
      srcset: '/media/trinity/home-hero-sm.webp 800w, /media/trinity/home-hero.webp 1600w',
      width: 1600,
      height: 1000,
      alt: 'Concept visualization of the Trinity district residential vision.',
    },
    gallery: [
      {
        src: '/media/trinity/map.webp',
        width: 1400,
        height: 900,
        alt: 'District plan concept map for Trinity Redistricting.',
      },
      {
        src: '/media/trinity/peaks.webp',
        width: 1400,
        height: 900,
        alt: 'Trinity Peaks residence hall concept visualization.',
      },
      {
        src: '/media/trinity/rise.webp',
        width: 1400,
        height: 900,
        alt: 'Trinity Rise upperclass apartment-style concept visualization.',
      },
      {
        src: '/media/trinity/cottages.webp',
        width: 1400,
        height: 900,
        alt: 'Cottages preservation and adaptive reuse concept.',
      },
    ],
    links: [
      { label: 'trinityredistricting.com', href: 'https://trinityredistricting.com', external: true },
      { label: 'Documents', href: 'https://trinityredistricting.com/documents.html', external: true },
      { label: 'Trinity AI', href: 'https://trinityredistricting.com/trinity-ai.html', external: true },
    ],
    problem:
      'UVM needs more housing. Burlington already feels the pressure when students leave campus. Trinity is a large university-owned site with aging capacity, but the future of the district is easy to treat as either a rendering or a political argument.',
    approach:
      'The project treats Trinity as a planning problem: replacement beds, net-new capacity, zoning, cost assumptions, preservation, phasing, resident continuity, and public benefit. The ask is a formal feasibility review, not adoption of a finished design.',
    capabilities: [
      {
        title: 'A district, not a single building',
        body: 'Trinity Peaks, Trinity Rise, Trinity Way, Northside Dining, and the Cottages are pieces of one housing-relief argument.',
      },
      {
        title: 'Feasibility before commitment',
        body: 'Capital assumptions, zoning and policy research, implementation phasing, and resident-protection thinking sit alongside the visual work.',
      },
      {
        title: 'Public documents and Trinity AI',
        body: 'The site publishes briefs, accessible companions, and a project-specific assistant for asking the proposal questions.',
      },
    ],
    reasoning:
      'A student proposal is only useful if it can survive review. The work is meant to make Trinity discussable as a housing-relief opportunity, not to pretend a campus has already been approved.',
    nextSlug: 'uvm-laundrylink',
  },
  {
    slug: 'uvm-laundrylink',
    name: 'UVM LaundryLink',
    shortName: 'LaundryLink',
    category: 'Campus utility',
    year: '2025',
    status: 'independent',
    statusLabel: 'Campus project',
    studio: 'independent',
    studioLabel: 'Independent project',
    platforms: ['Web'],
    creator: 'Ivan Minier',
    role: 'Creator — product and engineering',
    officialHome: { label: 'uvmlaundry.com', href: 'https://uvmlaundry.com', external: true },
    oneLiner: 'See which washers and dryers are actually open before you walk across campus.',
    summary:
      'UVM LaundryLink is a mobile-first campus tool for finding laundry rooms, checking machine status, saving favorites, and setting availability alerts.',
    href: '/work/uvm-laundrylink',
    accent: '#154734',
    theme: 'campus',
    icon: '/media/laundrylink/logo.webp',
    hero: {
      src: '/media/laundrylink/app.webp',
      srcset: '/media/laundrylink/app-sm.webp 400w, /media/laundrylink/app.webp 780w',
      width: 780,
      height: 1694,
      alt: 'UVM LaundryLink on a phone: room search, favorites, and the live campus interface.',
    },
    gallery: [
      {
        src: '/media/laundrylink/app.webp',
        srcset: '/media/laundrylink/app-sm.webp 400w, /media/laundrylink/app.webp 780w',
        width: 780,
        height: 1694,
        alt: 'LaundryLink home with search and favorites. Live machine data depends on the campus source.',
      },
    ],
    links: [{ label: 'uvmlaundry.com', href: 'https://uvmlaundry.com', external: true }],
    problem:
      'Campus laundry is a small system that wastes a surprising amount of time. Students walk to a room, find every machine running, and walk back.',
    approach:
      'LaundryLink puts room discovery, machine status, search, favorites, and SMS alerts on a phone-sized page so the trip is only worth making when a machine is actually available.',
    capabilities: [
      {
        title: 'Room discovery',
        body: 'Browse UVM residence-hall laundry rooms and open a specific room without guessing which building to try.',
      },
      {
        title: 'Machine status',
        body: 'See washers and dryers as available, in use, finishing soon, cycle finished, or out of order, with remaining time when the source provides it.',
      },
      {
        title: 'Favorites, search, and alerts',
        body: 'Save rooms, filter machines, and set an SMS alert when a running machine should become available.',
      },
    ],
    reasoning:
      'This was an earlier campus project, and it is the same pattern as the later work: take a frustrating everyday system and make the useful state obvious.',
    nextSlug: 'lineup',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const current = getProject(slug) ?? projects[0];
  return getProject(current.nextSlug) ?? projects[0];
}

export const featuredOrder = [
  'lineup',
  'rental-record',
  'modeboard',
  'trinity-redistricting',
  'uvm-laundrylink',
] as const;

export const featuredProjects = featuredOrder
  .map((slug) => getProject(slug))
  .filter((project): project is Project => Boolean(project));
