export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/coaching", label: "Coaching" },
  { href: "/app", label: "App" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const coachingFeatures: [string, string][] = [
  [
    "Individual Programming",
    "Training built around your level, schedule, goals, and competition calendar.",
  ],
  [
    "Technical Feedback",
    "Video review and clear technical priorities for the snatch and clean & jerk.",
  ],
  [
    "Competition Preparation",
    "Peaking, attempt strategy, warm-up planning, and meet-day decision making.",
  ],
  [
    "Long-Term Development",
    "Progression that respects the athlete, not just the next training block.",
  ],
  [
    "Communication",
    "Regular coach-athlete feedback so the plan can adapt when training changes.",
  ],
  [
    "Attempt App Access",
    "Active coached athletes get access to the Attempt app for meet-day planning.",
  ],
];

export const problems: string[] = [
  "Training without a clear plan",
  "Repeating the same technical errors",
  "Generic programs that ignore the athlete",
  "Poor peaking and unclear attempt selection",
  "Bad warm-up room organization",
  "Lack of feedback between sessions",
];

export const coachingFor: string[] = [
  "Lifters who want structured online coaching",
  "Beginners who want to learn the lifts properly",
  "Intermediate lifters who feel stuck",
  "Competitive lifters preparing for meets",
  "Masters athletes who need smarter training",
  "Athletes who want better technical feedback",
];

export const samplePrograms = [
  {
    title: "Beginner Weightlifting Program",
    slug: "beginner-weightlifting-program",
    level: "Beginner",
    duration: "12 weeks",
    days: "3 days / week",
    daysPerWeek: "3 days / week",
    goal: "Build technical foundations",
    price: "Coming soon",
    visible: true,
    featured: true,
    description:
      "A structured starting point for lifters learning the snatch, clean & jerk, squats, pulls, and basic training rhythm.",
  },
  {
    title: "Snatch Specialization",
    slug: "snatch-specialization",
    level: "Intermediate",
    duration: "8 weeks",
    days: "4 days / week",
    daysPerWeek: "4 days / week",
    goal: "Improve snatch consistency",
    price: "Coming soon",
    visible: true,
    featured: false,
    description:
      "Focused technical and strength work for lifters who need a more reliable snatch.",
  },
  {
    title: "Competition Peak",
    slug: "competition-peak",
    level: "Intermediate+",
    duration: "6 weeks",
    days: "4 days / week",
    daysPerWeek: "4 days / week",
    goal: "Prepare for meet day",
    price: "Coming soon",
    visible: true,
    featured: false,
    description:
      "A focused peaking cycle for lifters preparing to total on the platform.",
  },
];

export const testimonials = [
  {
    name: "Competitive lifter",
    context: "Online coaching athlete",
    quote:
      "The biggest difference was having a clear plan and knowing why each week looked the way it did.",
  },
  {
    name: "Meet-day athlete",
    context: "Competition preparation",
    quote:
      "Attempts, warm-ups, and decisions felt organized instead of rushed.",
  },
];

export const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview, quick links, and website status.",
  },
  {
    href: "/admin/homepage",
    label: "Homepage",
    description: "Edit the main landing page and homepage sections.",
  },
  {
    href: "/admin/coaching",
    label: "Coaching",
    description: "Edit the public coaching page content.",
  },
  {
    href: "/admin/app",
    label: "App",
    description: "Edit the Attempt app page content.",
  },
  {
    href: "/admin/about",
    label: "About",
    description: "Edit founder, background, and brand story content.",
  },
  {
    href: "/admin/programs",
    label: "Programs",
    description: "Create, edit, hide, and feature digital programs.",
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    description: "Manage athlete stories and homepage proof.",
  },
  {
    href: "/admin/applications",
    label: "Applications",
    description: "Review coaching applications and update status.",
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    description: "View newsletter signups and copy email lists.",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Edit site name, contact links, footer, and default SEO.",
  },
];
