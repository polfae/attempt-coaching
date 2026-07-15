import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "./firebase";
import { samplePrograms } from "./content";

export type CoachingApplication = {
  name: string;
  email: string;
  country: string;
  age?: string;
  bodyweight?: string;
  trainingAge?: string;
  bestSnatch?: string;
  bestCleanJerk?: string;
  bestTotal?: string;
  competitionExperience?: string;
  currentTraining?: string;
  goals?: string;
  injuries?: string;
  availability?: string;
  links?: string;
  struggle?: string;
  whyAttempt?: string;
  onlineCoachingBefore?: string;
  consent: boolean;
};

export type Program = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  daysPerWeek: string;
  goal: string;
  price: string;
  imageUrl?: string;
  productLink?: string;
  downloadLink?: string;
  visible: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type Testimonial = {
  id?: string;
  name: string;
  quote: string;
  athleteContext: string;
  photoUrl?: string;
  visible: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type SiteSettings = {
  siteName: string;
  contactEmail: string;
  instagramUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  footerText: string;
  updatedAt?: unknown;
};

export type HomepageContent = {
  heroKicker: string;
  heroHeadline: string;
  heroText: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLink: string;
  heroVisualTitle: string;
  heroVisualText: string;

  brandKicker: string;
  brandTitle: string;
  brandText: string;

  problemKicker: string;
  problemTitle: string;
  problemText: string;

  coachingKicker: string;
  coachingTitle: string;
  coachingText: string;

  appKicker: string;
  appTitle: string;
  appText: string;
  appPanelTitle: string;
  appPanelText: string;

  fitKicker: string;
  fitTitle: string;
  fitText: string;

  proofKicker: string;
  proofTitle: string;
  proofText: string;

  programsKicker: string;
  programsTitle: string;
  programsText: string;

  newsletterKicker: string;
  newsletterTitle: string;
  newsletterText: string;

  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButtonLabel: string;
  finalCtaButtonLink: string;

  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: unknown;
};

export type CoachingContent = {
  heroKicker: string;
  heroHeadline: string;
  heroText: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroVisualTitle: string;
  heroVisualText: string;

  philosophyKicker: string;
  philosophyTitle: string;
  philosophyText: string;

  includedKicker: string;
  includedTitle: string;

  processKicker: string;
  processTitle: string;
  processText: string;

  competitionKicker: string;
  competitionTitle: string;
  competitionText: string;

  appKicker: string;
  appTitle: string;
  appText: string;

  fitKicker: string;
  fitTitle: string;

  notForKicker: string;
  notForTitle: string;
  notForText: string;

  availabilityKicker: string;
  availabilityTitle: string;
  availabilityText: string;
  availabilityCtaLabel: string;
  availabilityCtaLink: string;

  faqKicker: string;
  faqTitle: string;

  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: unknown;
};

export type AppContent = {
  heroKicker: string;
  heroHeadline: string;
  heroText: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLink: string;
  heroVisualTitle: string;
  heroVisualText: string;

  valueKicker: string;
  valueTitle: string;
  valueText: string;

  featuresKicker: string;
  featuresTitle: string;
  featuresText: string;

  coachingKicker: string;
  coachingTitle: string;
  coachingText: string;

  accessKicker: string;
  accessTitle: string;
  accessText: string;
  accessCtaLabel: string;
  accessCtaLink: string;

  futureKicker: string;
  futureTitle: string;
  futureText: string;

  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButtonLabel: string;
  finalCtaButtonLink: string;

  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: unknown;
};

export type AboutContent = {
  heroKicker: string;
  heroHeadline: string;
  heroText: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLink: string;

  founderKicker: string;
  founderTitle: string;
  founderText: string;

  backgroundKicker: string;
  backgroundTitle: string;
  backgroundText: string;

  philosophyKicker: string;
  philosophyTitle: string;
  philosophyText: string;

  weightliftingKicker: string;
  weightliftingTitle: string;
  weightliftingText: string;

  whyKicker: string;
  whyTitle: string;
  whyText: string;

  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButtonLabel: string;
  finalCtaButtonLink: string;

  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: unknown;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "Attempt",
  contactEmail: "",
  instagramUrl: "",
  defaultSeoTitle: "Attempt Coaching",
  defaultSeoDescription:
    "Premium weightlifting coaching for athletes who want more than just a program.",
  footerText:
    "Premium weightlifting coaching with a meet-day competition tool.",
};

export const defaultHomepageContent: HomepageContent = {
  seoTitle: "Attempt Coaching | Weightlifting Coaching",
  seoDescription:
    "Premium weightlifting coaching with structured programming, technical feedback, competition preparation, and the Attempt app.",
  heroKicker: "Attempt Coaching",
  heroHeadline:
    "Premium weightlifting coaching for athletes who want more than just a program.",
  heroText:
    "Attempt Coaching combines structured programming, technical feedback, competition preparation, and the Attempt app to help lifters train with purpose and perform better on the platform.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "See How Coaching Works",
  heroSecondaryCtaLink: "/coaching",
  heroVisualTitle: "Train with structure.",
  heroVisualText: "Compete with a plan.",

  brandKicker: "Built for weightlifters",
  brandTitle: "Coaching first. Everything else supports it.",
  brandText:
    "Attempt is a coaching-first weightlifting brand. The app, programs, and future products all support the same goal: helping lifters train smarter and compete better.",

  problemKicker: "The problem",
  problemTitle:
    "Most lifters do not need more random training. They need direction.",
  problemText:
    "Progress becomes harder when programming, technique, and competition decisions are disconnected.",

  coachingKicker: "The offer",
  coachingTitle: "Coaching built around the athlete, not just the program.",
  coachingText:
    "A premium coaching relationship for lifters who want a clearer process from training hall to competition platform.",

  appKicker: "Attempt app",
  appTitle: "Meet day, organized.",
  appText:
    "Coached athletes receive access to the Attempt app while they are active clients. The app keeps planned attempts, declared attempts, and warm-up room decisions connected.",
  appPanelTitle:
    "Attempt Coaching is the system. The app is the competition tool.",
  appPanelText:
    "The app supports coach-athlete decisions on meet day, reduces confusion, and connects competition preparation with the actual platform plan.",

  fitKicker: "Fit",
  fitTitle: "Who coaching is for.",
  fitText:
    "Attempt Coaching is for lifters who want structure, accountability, and a better competition process.",

  proofKicker: "Proof",
  proofTitle: "Built from the platform, not generic fitness marketing.",
  proofText:
    "Athlete feedback, coaching background, and real stories from the training process.",

  programsKicker: "Programs",
  programsTitle: "Not ready for coaching yet? Start with a program.",
  programsText:
    "Digital programs are a lower-cost option for lifters who want structure before applying for full coaching.",

  newsletterKicker: "Newsletter",
  newsletterTitle: "Train smarter. Compete better.",
  newsletterText:
    "Join the list for coaching updates, program releases, and competition preparation notes.",

  finalCtaTitle: "Ready to take your weightlifting seriously?",
  finalCtaText:
    "Apply for coaching and start with a process built around your training, your technique, and your platform goals.",
  finalCtaButtonLabel: "Apply for Coaching",
  finalCtaButtonLink: "/apply",
};

export const defaultCoachingContent: CoachingContent = {
  seoTitle: "Online Weightlifting Coaching | Attempt",
  seoDescription:
    "Apply for premium online weightlifting coaching built around programming, technical feedback, competition preparation, and platform performance.",
  heroKicker: "Attempt Coaching",
  heroHeadline: "Weightlifting coaching built for training and competition.",
  heroText:
    "A premium coaching process for lifters who want individual programming, technical feedback, and a clearer plan from training hall to platform.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroVisualTitle: "Programming. Feedback. Platform plan.",
  heroVisualText: "One connected coaching system.",

  philosophyKicker: "Philosophy",
  philosophyTitle: "The athlete comes before the spreadsheet.",
  philosophyText:
    "Programming matters, but it only works when it responds to the athlete in front of it. Technique, recovery, competitions, and communication all shape the plan.",

  includedKicker: "Included",
  includedTitle: "What is included.",

  processKicker: "Process",
  processTitle: "How coaching works.",
  processText: "Simple structure, serious execution.",

  competitionKicker: "Competition prep",
  competitionTitle: "Meet day should not feel like guesswork.",
  competitionText:
    "Peaking, warm-ups, attempt strategy, and platform decisions are part of the coaching process — not something added at the end.",

  appKicker: "Attempt app included",
  appTitle: "The app supports the coaching system.",
  appText:
    "Active coached athletes get access to the Attempt app to help organize planned attempts, declared attempts, and warm-up room decisions.",

  fitKicker: "Fit",
  fitTitle: "Who coaching is for.",

  notForKicker: "Not for",
  notForTitle: "Who coaching is not for.",
  notForText:
    "Attempt Coaching is not for lifters who want a random PDF, instant template, or low-communication program without feedback.",

  availabilityKicker: "Availability",
  availabilityTitle: "Premium coaching is application-based.",
  availabilityText:
    "Pricing and availability can be added here when ready. The CTA should remain Apply for Coaching, not Buy Coaching.",
  availabilityCtaLabel: "Apply for Coaching",
  availabilityCtaLink: "/apply",

  faqKicker: "FAQ",
  faqTitle: "Common questions.",
};

export const defaultAppContent: AppContent = {
  seoTitle: "Attempt App | Meet-Day Attempt Management",
  seoDescription:
    "Meet-day attempt management for Olympic weightlifting coaches and athletes, supporting planned attempts, declarations, warm-ups, and platform decisions.",
  heroKicker: "Attempt App",
  heroHeadline: "Meet-day attempt management for weightlifting.",
  heroText:
    "Attempt helps lifters and coaches organize planned attempts, declared attempts, and platform decisions. It is the competition tool that supports Attempt Coaching.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "Ask about App Access",
  heroSecondaryCtaLink: "/contact",
  heroVisualTitle: "Attempt Coaching is the system.",
  heroVisualText: "The app is the competition tool.",

  valueKicker: "Purpose",
  valueTitle: "Built for the warm-up room.",
  valueText:
    "Attempt is designed to make competition decisions clearer when timing, jumps, declarations, and platform strategy matter.",

  featuresKicker: "What it does",
  featuresTitle: "Meet-day organization without the mess.",
  featuresText:
    "The app keeps important competition details visible and connected so coaches and athletes can focus on execution.",

  coachingKicker: "Coaching connection",
  coachingTitle: "The app supports the coaching process.",
  coachingText:
    "For coached athletes, the app connects competition preparation with meet-day execution. It is not meant to replace coaching — it helps organize the decisions coaching prepares for.",

  accessKicker: "Access",
  accessTitle: "Coached athletes get access while active.",
  accessText:
    "Active Attempt Coaching athletes receive access to the Attempt app as part of the coaching relationship.",
  accessCtaLabel: "Apply for Coaching",
  accessCtaLink: "/apply",

  futureKicker: "Future",
  futureTitle: "Standalone access may come later.",
  futureText:
    "In the future, non-coached lifters and coaches may be able to access the app separately. For now, the app is primarily part of the Attempt Coaching system.",

  finalCtaTitle: "Want the full system?",
  finalCtaText:
    "Apply for coaching to get programming, feedback, competition preparation, and app-supported meet-day organization.",
  finalCtaButtonLabel: "Apply for Coaching",
  finalCtaButtonLink: "/apply",
};

export const defaultAboutContent: AboutContent = {
  seoTitle: "About Attempt | Weightlifting Coaching",
  seoDescription:
    "Learn about Attempt, a weightlifting-only coaching brand built around serious training, technical feedback, and better competition preparation.",
  heroKicker: "About Attempt",
  heroHeadline: "Built by a coach who understands the platform.",
  heroText:
    "Attempt exists to connect serious weightlifting coaching, better competition preparation, and practical tools for lifters.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "See Coaching",
  heroSecondaryCtaLink: "/coaching",

  founderKicker: "Founder",
  founderTitle: "Pól Hendrikur Andreasen",
  founderText:
    "Attempt is built from hands-on coaching experience in Olympic weightlifting, athlete development, and competition preparation.",

  backgroundKicker: "Background",
  backgroundTitle:
    "Coaching experience from the training hall to the platform.",
  backgroundText:
    "Use this section to describe your weightlifting background, your work as a coach, your federation experience, and your role developing athletes and systems around performance.",

  philosophyKicker: "Philosophy",
  philosophyTitle: "Coaching and competition tools belong together.",
  philosophyText:
    "Training should prepare the athlete for the platform. Programming, technical feedback, warm-up decisions, attempt selection, and competition strategy are all part of the same process.",

  weightliftingKicker: "Weightlifting only",
  weightliftingTitle: "Attempt is focused on Olympic weightlifting.",
  weightliftingText:
    "Attempt is not general fitness coaching. It is built for lifters who want to improve the snatch, clean & jerk, total, and competition process.",

  whyKicker: "Why Attempt exists",
  whyTitle: "Better structure. Better feedback. Better meet-day decisions.",
  whyText:
    "Attempt was created because lifters need more than a spreadsheet. They need a connected process from daily training to platform execution.",

  finalCtaTitle: "Ready to work with Attempt?",
  finalCtaText:
    "Apply for coaching and start with a process built around your training, your technique, and your platform goals.",
  finalCtaButtonLabel: "Apply for Coaching",
  finalCtaButtonLink: "/apply",
};

export async function submitApplication(data: CoachingApplication) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Application payload:", data);
    return { offline: true };
  }

  return addDoc(collection(db, "coachingApplications"), {
    ...data,
    status: "new",
    internalNotes: "",
    createdAt: serverTimestamp(),
  });
}

export async function submitNewsletter(email: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Newsletter signup:", email);
    return { offline: true };
  }

  return addDoc(collection(db, "newsletterSignups"), {
    email,
    createdAt: serverTimestamp(),
  });
}

export async function getNewsletterSignups() {
  if (!hasFirebaseConfig || !db) return [];

  const snapshot = await getDocs(
    query(collection(db, "newsletterSignups"), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getPrograms() {
  if (!hasFirebaseConfig || !db) return samplePrograms;

  const snapshot = await getDocs(
    query(collection(db, "programs"), orderBy("title")),
  );

  const programs = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Program[];

  return programs.length ? programs : samplePrograms;
}

export async function getVisiblePrograms() {
  if (!hasFirebaseConfig || !db) return samplePrograms;

  const snapshot = await getDocs(
    query(
      collection(db, "programs"),
      where("visible", "==", true),
      orderBy("title"),
    ),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Program[];
}

export async function createProgram(data: Program) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Program payload:", data);
    return { offline: true };
  }

  const { id, ...programData } = data;

  return addDoc(collection(db, "programs"), {
    ...programData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProgram(id: string, data: Partial<Program>) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Program update:", id, data);
    return { offline: true };
  }

  return updateDoc(doc(db, "programs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProgram(id: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Program delete:", id);
    return { offline: true };
  }

  return deleteDoc(doc(db, "programs", id));
}

export async function getTestimonials() {
  if (!hasFirebaseConfig || !db) return [];

  const snapshot = await getDocs(
    query(collection(db, "testimonials"), orderBy("name")),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Testimonial[];
}

export async function getVisibleTestimonials() {
  if (!hasFirebaseConfig || !db) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "testimonials"),
      where("visible", "==", true),
      orderBy("name"),
    ),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Testimonial[];
}

export async function createTestimonial(data: Testimonial) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Testimonial payload:", data);
    return { offline: true };
  }

  const { id, ...testimonialData } = data;

  return addDoc(collection(db, "testimonials"), {
    ...testimonialData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>,
) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Testimonial update:", id, data);
    return { offline: true };
  }

  return updateDoc(doc(db, "testimonials", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTestimonial(id: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Testimonial delete:", id);
    return { offline: true };
  }

  return deleteDoc(doc(db, "testimonials", id));
}

export async function getSiteSettings() {
  if (!hasFirebaseConfig || !db) return defaultSiteSettings;

  const reference = doc(db, "siteSettings", "main");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return defaultSiteSettings;
  }

  return {
    ...defaultSiteSettings,
    ...snapshot.data(),
  } as SiteSettings;
}

export async function updateSiteSettings(data: SiteSettings) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Site settings payload:", data);
    return { offline: true };
  }

  return setDoc(
    doc(db, "siteSettings", "main"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getHomepageContent() {
  if (!hasFirebaseConfig || !db) return defaultHomepageContent;

  const reference = doc(db, "homepage", "main");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return defaultHomepageContent;
  }

  return {
    ...defaultHomepageContent,
    ...snapshot.data(),
  } as HomepageContent;
}

export async function updateHomepageContent(data: HomepageContent) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Homepage content payload:", data);
    return { offline: true };
  }

  return setDoc(
    doc(db, "homepage", "main"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getCoachingContent() {
  if (!hasFirebaseConfig || !db) return defaultCoachingContent;

  const reference = doc(db, "pages", "coaching");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return defaultCoachingContent;
  }

  return {
    ...defaultCoachingContent,
    ...snapshot.data(),
  } as CoachingContent;
}

export async function updateCoachingContent(data: CoachingContent) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Coaching content payload:", data);
    return { offline: true };
  }

  return setDoc(
    doc(db, "pages", "coaching"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getAppContent() {
  if (!hasFirebaseConfig || !db) return defaultAppContent;

  const reference = doc(db, "pages", "app");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return defaultAppContent;
  }

  return {
    ...defaultAppContent,
    ...snapshot.data(),
  } as AppContent;
}

export async function updateAppContent(data: AppContent) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. App content payload:", data);
    return { offline: true };
  }

  return setDoc(
    doc(db, "pages", "app"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getAboutContent() {
  if (!hasFirebaseConfig || !db) return defaultAboutContent;

  const reference = doc(db, "pages", "about");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return defaultAboutContent;
  }

  return {
    ...defaultAboutContent,
    ...snapshot.data(),
  } as AboutContent;
}

export async function updateAboutContent(data: AboutContent) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. About content payload:", data);
    return { offline: true };
  }

  return setDoc(
    doc(db, "pages", "about"),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getApplications() {
  if (!hasFirebaseConfig || !db) return [];

  const snapshot = await getDocs(
    query(collection(db, "coachingApplications"), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  internalNotes?: string,
) {
  if (!hasFirebaseConfig || !db) return;

  return updateDoc(doc(db, "coachingApplications", id), {
    status,
    internalNotes: internalNotes ?? "",
    updatedAt: serverTimestamp(),
  });
}
