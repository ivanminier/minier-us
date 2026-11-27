import { laundryLink } from "./laundrylink";
import laundryMedia from "./laundrylink-media.json";
import lineupMedia from "./lineup-current-media.json";
import rentalMedia from "./rental-record-media.json";
import sameMinuteMedia from "./same-minute-media.json";
import trinityMedia from "./trinity-media.json";
export type ProjectStatus = "in-development" | "available" | "independent";
export type Studio = "tideframe" | "independent";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * How an image relates to its container, which decides the `sizes` hint.
 * `device` and `tablet` are capped portrait screenshots; `screen` and
 * `editorial` fill the wide container.
 */
export type MediaPresentation =
  "device" | "tablet" | "screen" | "editorial" | "tv";

export interface ProjectMedia {
  src: string;
  srcset?: string;
  /** Must match the real pixel dimensions of `src`, or the browser reserves the wrong box. */
  width: number;
  height: number;
  alt: string;
  caption?: string;
  presentation?: MediaPresentation;
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
  /** Extra device shots for the multi-device row, kept out of the gallery so nothing repeats. */
  devices?: { tablet?: ProjectMedia; desktop?: ProjectMedia };
  oneLiner: string;
  summary: string;
  href: string;
  accent: string;
  theme: "cinematic" | "paper" | "mac" | "editorial" | "campus";
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
    slug: "lineup",
    name: "Lineup",
    shortName: "Lineup",
    category: "Television software",
    year: "2026",
    status: "in-development",
    statusLabel: "Submitted for App Review",
    studio: "tideframe",
    studioLabel: "Tideframe Labs",
    platforms: ["iPhone", "iPad", "Apple TV"],
    creator: "Ivan Minier",
    role: "Creator — product, interface, and engineering",
    officialHome: {
      label: "Lineup — Tideframe Labs",
      href: "https://tideframelabs.com/lineup",
      external: true,
    },
    oneLiner:
      "Your provider gives you channels. Lineup turns them into television.",
    summary:
      "Lineup organizes user-supplied Xtream and M3U sources into live TV, movies, series, and a program guide. It brings profiles, saved collections, and playback diagnostics to iPhone, iPad, and Apple TV.",
    href: "/work/lineup",
    accent: "#1f8a6e",
    theme: "cinematic",
    icon: "/media/lineup/icon-256.webp",
    hero: { ...lineupMedia.tv, presentation: "tv" },
    devices: { tablet: { ...lineupMedia.guide, presentation: "screen" } },
    gallery: [
      { ...lineupMedia.multiview, presentation: "tv" },
      { ...lineupMedia.review, presentation: "screen" },
      { ...lineupMedia.series, presentation: "device" },
      { ...lineupMedia.signal, presentation: "device" },
      { ...lineupMedia.duo, presentation: "screen" },
    ],
    links: [
      {
        label: "Lineup on Tideframe Labs",
        href: "https://tideframelabs.com/lineup",
        external: true,
      },
    ],
    problem:
      "Most IPTV sources arrive as a pile of names, categories, missing logos, and half-matched guide data. The player usually just plays whatever it is given.",
    approach:
      "Lineup treats the provider feed as evidence, not as the interface. It keeps the original catalog intact, then derives cleaner names, categories, order, and guide matches. The person watching television should not have to decode a playlist.",
    capabilities: [
      {
        title: "Smart names and categories",
        body: "Cluttered provider labels become readable channel names. Categories can be simplified, renamed, hidden, or reordered without rewriting the source.",
      },
      {
        title: "Guide matching",
        body: "Lineup automatically matches program schedules to channels for Xtream and M3U sources. Any additional guide catalog is optional, licensed, and never enabled by default.",
      },
      {
        title: "Reversible organization",
        body: "Smart Lineup groups duplicate streams and cleans names with a Review Changes step before anything is applied; grouping can be undone. Best Source and Signal Check help pick, and diagnose, the stream that actually plays.",
      },
      {
        title: "Home, movies, series, and My Lineup",
        body: "The same organized catalog becomes Home, Live TV, Movies, Series, a program guide, Multiview, and My Lineup — the favorites, watchlist, and collections people actually use.",
      },
      {
        title: "User-supplied sources only",
        body: "Lineup is a player and organizer. It does not provide, host, sell, or recommend channels, movies, series, or subscriptions.",
      },
    ],
    reasoning:
      "The hard problem is not another play button. It is turning a raw catalog into something a person can actually watch, and trust while it is being reorganized. Lineup Intelligence exists so the product can do that work once, show its work, and then stay out of the way.",
    nextSlug: "trinity-redistricting",
  },
  {
    slug: "rental-record",
    name: "Rental Record by Tideframe",
    shortName: "Rental Record",
    category: "Rental documentation",
    year: "2026",
    status: "available",
    statusLabel: "On the App Store",
    studio: "tideframe",
    studioLabel: "Tideframe Labs",
    platforms: ["iPhone", "iPad", "Mac"],
    creator: "Ivan Minier",
    role: "Creator — product, interface, and engineering",
    officialHome: {
      label: "App Store",
      href: "https://apps.apple.com/us/app/tideframe-rental-record/id6796366130",
      external: true,
    },
    oneLiner:
      "A structured rental record instead of a camera roll full of disconnected photos.",
    summary:
      "Rental Record by Tideframe keeps room inspections, photos, observations, and handoff details together. Compare conditions over a tenancy and turn the record into a readable PDF.",
    href: "/work/rental-record",
    accent: "#2b6d93",
    theme: "paper",
    icon: "/media/rental-record/refresh/icon.webp",
    hero: { ...rentalMedia.cases, presentation: "device" },
    gallery: [
      { ...rentalMedia.room, presentation: "device" },
      { ...rentalMedia.evidence, presentation: "device" },
      { ...rentalMedia.space, presentation: "device" },
      { ...rentalMedia.handoff, presentation: "tablet" },
      { ...rentalMedia.contacts, presentation: "screen" },
      { ...rentalMedia.report, presentation: "screen" },
    ],
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/tideframe-rental-record/id6796366130",
        external: true,
      },
      {
        label: "Tideframe product page",
        href: "https://tideframelabs.com/rental-record",
        external: true,
      },
    ],
    problem:
      "Move-in photos disappear into a camera roll. Months later, nobody can tell which room a photo belonged to, what it was meant to show, or whether anything changed.",
    approach:
      "Rental Record walks through rooms, checklists, wide and close-up photos, observations, and later comparisons. The record stays local and private unless someone chooses to export it.",
    capabilities: [
      {
        title: "Guided inspections",
        body: "Move-in, move-out, and follow-up records with room checklists, photos, and written observations. Reuse inspection templates and compare conditions over time.",
      },
      {
        title: "Evidence that stays together",
        body: "Photos, notes, maintenance, communications, attachments, and appliance details belong to the rental, not to a pile of unmarked images.",
      },
      {
        title: "Reports and packages",
        body: "PDF reports and evidence packages, including local file hashes for integrity checking. Hashes help compare files. They do not prove legal facts.",
      },
      {
        title: "Private by default",
        body: "No app account and no developer-operated evidence server. Optional private iCloud backup is available. Exporting is explicit.",
      },
    ],
    reasoning:
      "A rental record is useful only if it is complete, reviewable, and still understandable later. The product is an organizational tool, not a legal service.",
    nextSlug: "modeboard",
  },
  {
    slug: "same-minute",
    name: "Same Minute by Tideframe",
    shortName: "Same Minute",
    category: "Focus timer",
    year: "2026",
    status: "available",
    statusLabel: "On the App Store",
    studio: "tideframe",
    studioLabel: "Tideframe Labs",
    platforms: ["iPhone", "iPad", "Apple Watch"],
    creator: "Ivan Minier",
    role: "Creator — product, interface, and engineering",
    officialHome: {
      label: "App Store",
      href: "https://apps.apple.com/us/app/same-minute-by-tideframe/id6838133122",
      external: true,
    },
    oneLiner: "Keep one focus countdown with someone in another room or another city.",
    summary:
      "Same Minute by Tideframe is a focus timer for two. Run a solo timer or invite someone to a private room and share one countdown.",
    href: "/work/same-minute",
    accent: "#247b67",
    theme: "paper",
    icon: "/media/same-minute/refresh/icon.webp",
    hero: { ...sameMinuteMedia.together, presentation: "device" },
    devices: { tablet: { ...sameMinuteMedia.ipad, presentation: "tablet" } },
    gallery: [
      { ...sameMinuteMedia.solo, presentation: "device" },
      { ...sameMinuteMedia.break, presentation: "device" },
      { ...sameMinuteMedia.watch, presentation: "device" },
    ],
    links: [
      {
        label: "Tideframe product page",
        href: "https://tideframelabs.com/same-minute",
        external: true,
      },
    ],
    problem:
      "My mom and I wanted to do Pomodoros together from different cities. Starting two timers at once was easy. Staying in the same session after a pause or a late join was harder.",
    approach:
      "Together mode gives both people the same end time. A late join starts with the time that’s left, and either person can start, pause, or end the shared timer.",
    capabilities: [
      {
        title: "Start solo",
        body: "Start a focus interval without an account or connection. Set your own focus, short break, and long break lengths.",
      },
      {
        title: "Share one countdown",
        body: "Invite one person to a private room using iCloud. Return to the same room the next time you want to work together.",
      },
      {
        title: "Take the break when you’re ready",
        body: "Same Minute offers the next interval when the timer ends. You choose when to start it.",
      },
    ],
    reasoning:
      "I wanted the experience of working alongside someone to take about as much effort as setting a kitchen timer.",
    nextSlug: "rental-record",
  },
  {
    slug: "modeboard",
    name: "Modeboard",
    shortName: "Modeboard",
    category: "Mac workspace",
    year: "2026",
    status: "available",
    statusLabel: "Available for Mac",
    studio: "tideframe",
    studioLabel: "Tideframe Labs",
    platforms: ["Mac"],
    creator: "Ivan Minier",
    role: "Creator — product, interface, and engineering",
    officialHome: {
      label: "tideframelabs.com/modeboard",
      href: "https://tideframelabs.com/modeboard",
      external: true,
    },
    oneLiner: "Switch your whole Mac workspace with one profile.",
    summary:
      "Modeboard is a native Mac utility that turns a named profile into a complete workspace. Apps, files, Dock, wallpaper, appearance, Desktop, menu bar, Shortcuts, and a Focus Filter can move together.",
    href: "/work/modeboard",
    accent: "#2b6d93",
    theme: "mac",
    icon: "/media/modeboard/icon.webp",
    hero: {
      src: "/media/modeboard/profile-overview.webp",
      srcset:
        "/media/modeboard/profile-overview-sm.webp 760w, /media/modeboard/profile-overview.webp 1436w",
      width: 1436,
      height: 1046,
      alt: "Modeboard profile editor with Default, Do Not Disturb, Work, Sleep, Travel, and College profiles.",
      presentation: "screen",
    },
    gallery: [
      {
        src: "/media/modeboard/appearance-dock.webp",
        srcset:
          "/media/modeboard/appearance-dock-sm.webp 760w, /media/modeboard/appearance-dock.webp 1436w",
        width: 1436,
        height: 1046,
        alt: "Modeboard appearance and Dock settings for a workspace profile.",
        caption:
          "Appearance and Dock — light or dark, accent colour, tile size, position, and Dock pins.",
        presentation: "screen",
      },
      {
        src: "/media/modeboard/menu-bar.webp",
        srcset:
          "/media/modeboard/menu-bar-sm.webp 760w, /media/modeboard/menu-bar.webp 1436w",
        width: 1436,
        height: 1046,
        alt: "Modeboard menu bar and Desktop settings.",
        caption:
          "Menu bar and Desktop — per-profile visibility for supported items, and Desktop icon state.",
        presentation: "screen",
      },
      {
        src: "/media/modeboard/backups-restore.webp",
        srcset:
          "/media/modeboard/backups-restore-sm.webp 760w, /media/modeboard/backups-restore.webp 1436w",
        width: 1436,
        height: 1046,
        alt: "Modeboard backups and restore history.",
        caption:
          "Backups and restore — a verified backup before relevant changes, plus Emergency Restore.",
        presentation: "screen",
      },
      {
        src: "/media/modeboard/getting-started.webp",
        srcset:
          "/media/modeboard/getting-started-sm.webp 760w, /media/modeboard/getting-started.webp 1436w",
        width: 1436,
        height: 1046,
        alt: "Modeboard Getting Started page explaining how to create, apply, and switch profiles.",
        caption:
          "Getting Started — create a profile, apply it, then switch from the app, the menu bar, Shortcuts, or a Focus Filter.",
        presentation: "screen",
      },
      {
        src: "/media/modeboard/onboarding-focus.webp",
        srcset:
          "/media/modeboard/onboarding-focus-sm.webp 760w, /media/modeboard/onboarding-focus.webp 1436w",
        width: 1436,
        height: 1046,
        alt: "Modeboard onboarding explaining Focus Filter integration.",
        caption:
          "Focus Filter — macOS owns the Focus. Modeboard supplies the profile it should apply.",
        presentation: "screen",
      },
    ],
    links: [
      {
        label: "Tideframe product page",
        href: "https://tideframelabs.com/modeboard",
        external: true,
      },
    ],
    problem:
      "A Mac is usually one arrangement trying to serve every part of the day. Work, study, and everything else share the same Dock, wallpaper, Desktop, and open apps.",
    approach:
      "A named profile can change the parts of the Mac that belong to that moment. Apply it from Modeboard, the menu bar, Apple Shortcuts, or a macOS Focus Filter.",
    capabilities: [
      {
        title: "Workspace profiles",
        body: "Open selected apps, files, and folders. Change Dock layout, wallpaper, appearance, Desktop items, and supported menu-bar state.",
      },
      {
        title: "Apply it your way",
        body: "Switch from the app, the menu bar, Shortcuts, or a Focus Filter. Modeboard does not create Focus modes. macOS does.",
      },
      {
        title: "Backed up first",
        body: "Modeboard creates a verified backup before relevant changes, with restore and Emergency Restore for supported settings.",
      },
    ],
    reasoning:
      "The product should feel like a native Mac utility: quiet, specific, and reversible. It changes what you ask it to change, then gets out of the way.",
    nextSlug: "lineup",
  },
  {
    slug: "trinity-redistricting",
    name: "Trinity Redistricting",
    shortName: "Trinity",
    category: "Housing & development",
    year: "2026",
    status: "independent",
    statusLabel: "Independent student vision",
    studio: "independent",
    studioLabel: "Independent project",
    platforms: ["Web"],
    creator: "Ivan Minier",
    role: "Originator & author — research, planning, writing, visual direction, and the public site",
    officialHome: {
      label: "trinityredistricting.com",
      href: "https://trinityredistricting.com",
      external: true,
    },
    oneLiner:
      "An independent, concept-stage housing feasibility proposal for UVM’s Trinity Campus.",
    summary:
      "An independent student proposal to replace aging housing at UVM’s Trinity Campus, renew Northside Dining, and study whether apartment-style housing would meet upperclass demand.",
    href: "/work/trinity-redistricting",
    accent: "#046a48",
    theme: "editorial",
    icon: "/media/trinity/logo.webp",
    hero: { ...trinityMedia.district, presentation: "editorial" },
    gallery: [
      { ...trinityMedia.massing, presentation: "editorial" },
      { ...trinityMedia.peaks, presentation: "editorial" },
      { ...trinityMedia.rise, presentation: "editorial" },
      { ...trinityMedia.way, presentation: "editorial" },
      { ...trinityMedia.phasing, presentation: "editorial" },
    ],
    links: [
      {
        label: "trinityredistricting.com",
        href: "https://trinityredistricting.com",
        external: true,
      },
      {
        label: "Documents",
        href: "https://trinityredistricting.com/documents",
        external: true,
      },
      {
        label: "Trinity AI",
        href: "https://trinityredistricting.com/trinity-ai",
        external: true,
      },
    ],
    problem:
      "UVM needs more housing. Burlington already feels the pressure when students leave campus. Trinity is a large university-owned site with aging capacity, but the future of the district is easy to treat as either a rendering or a political argument.",
    approach:
      "The project treats Trinity as a planning problem: replacement beds, net-new capacity, zoning, cost assumptions, preservation, phasing, resident continuity, and public benefit. The ask is a formal feasibility review, not adoption of a finished design.",
    capabilities: [
      {
        title: "A district, not a single building",
        body: "Trinity Peaks, Trinity Rise, Trinity Way, Northside Dining, and the Cottages are pieces of one housing-relief argument.",
      },
      {
        title: "Feasibility before commitment",
        body: "Capital assumptions, zoning and policy research, implementation phasing, and resident-protection thinking sit alongside the visual work.",
      },
      {
        title: "Public documents and Trinity AI",
        body: "The site publishes briefs, accessible companions, and a project-specific assistant for asking the proposal questions.",
      },
    ],
    reasoning:
      "A student proposal is only useful if it can survive review. The work is meant to make Trinity discussable as a housing-relief opportunity, not to pretend a campus has already been approved.",
    nextSlug: "uvm-laundrylink",
  },
  {
    slug: "uvm-laundrylink",
    name: laundryLink.name,
    shortName: laundryLink.name,
    category: "Independent campus utility",
    year: laundryLink.dates,
    status: "available",
    statusLabel: laundryLink.status,
    studio: "independent",
    studioLabel: laundryLink.context,
    platforms: ["Mobile-first web app", "Installable PWA"],
    creator: "Ivan Minier",
    role: laundryLink.role,
    officialHome: { label: "UVMLaundry.com", href: laundryLink.url, external: true },
    oneLiner: laundryLink.oneLiner,
    summary: laundryLink.description,
    href: "/work/uvm-laundrylink",
    accent: "#154734",
    theme: "campus",
    icon: "/media/laundrylink/app-icon.webp",
    hero: { ...laundryMedia.hero, presentation: "editorial" },
    gallery: [laundryMedia.picker, laundryMedia.favorites, laundryMedia.peak, laundryMedia.alerts],
    links: [
      { label: "Visit UVMLaundry.com", href: laundryLink.url, external: true },
      { label: "Residence hall directory", href: laundryLink.url + "residence-halls/", external: true },
      { label: "Information & FAQ", href: laundryLink.url + "information/", external: true },
      { label: "Service status", href: laundryLink.url + "status/", external: true },
      { label: "Source on GitHub", href: laundryLink.source, external: true },
    ],
    problem:
      "A full laundry room can mean carrying a load down several floors or across campus for nothing. The first question is simple: is there a washer or dryer free in the room I use?",
    approach:
      "The directory puts that room one search or a few taps away. Open the tracker to check the provider’s latest report, or favorite the room so it’s easier to check the next time.",
    capabilities: [
      { title: "Room discovery", body: "Search hall and complex names, campus areas, and common abbreviations, or jump directly to a campus in the directory." },
      { title: "Machine status", body: "Check reported washer and dryer availability and remaining cycle time when the provider supplies it." },
      { title: "Alerts", body: "Manage cycle completion and next-available washer or dryer push alerts in My Laundry." },
    ],
    reasoning:
      "The interface shows when status was checked and labels the last saved snapshot if a refresh fails.",
    nextSlug: "same-minute",
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
  "trinity-redistricting",
  "uvm-laundrylink",
  "same-minute",
  "rental-record",
  "modeboard",
  "lineup",
] as const;

export const featuredProjects = featuredOrder
  .map((slug) => getProject(slug))
  .filter((project): project is Project => Boolean(project));
