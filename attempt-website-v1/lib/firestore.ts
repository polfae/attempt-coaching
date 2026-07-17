import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
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
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  dateOfBirth: string;
  gender: "female" | "male";
  country: string;
  countryCode: string;
  bodyweightKg: number;
  weightClass: string;
  weightliftingTrainingYears: number;
  competitionExperience:
    | "never_competed"
    | "local"
    | "national"
    | "international";
  lifts: {
    snatch: number;
    cleanAndJerk: number;
    total?: number;
    clean: number;
    jerk: number;
    backSquat: number;
    frontSquat: number;
  };
  trainingDaysPerWeek: number;
  mainGoals: string[];
  otherGoal?: string;
  goalsDescription: string;
  struggle: string;
  hasInjuries: boolean;
  injuryDescription?: string;
  whyAttempt?: string;
  coachExpectations: string;
  hadOnlineCoach: boolean;
  preparingForCompetition: boolean;
  competitionName?: string;
  competitionDate?: string;
  consent: boolean;

  // Legacy fields retained so older applications still render in the CMS.
  age?: string;
  bodyweight?: string;
  trainingAge?: string;
  coachingPriority?: string;
  readiness?: string;
  nextCompetition?: string;
  bestSnatch?: string;
  bestCleanJerk?: string;
  bestTotal?: string;
  competitionExperienceText?: string;
  currentTraining?: string;
  goals?: string;
  injuries?: string;
  availability?: string;
  links?: string;
  onlineCoachingBefore?: string;
};

export type Program = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  days?: string;
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

export type MediaAsset = {
  id?: string;
  title: string;
  altText?: string;
  usage?: string;
  fileName: string;
  fileType: string;
  size: number;
  url: string;
  storagePath: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AnalyticsEvent = {
  id?: string;
  type: "page_view";
  path: string;
  title?: string;
  referrer?: string;
  source?: string;
  device?: "desktop" | "tablet" | "mobile";
  country?: string;
  timezone?: string;
  locale?: string;
  visitorId: string;
  sessionId: string;
  engaged?: boolean;
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
    "Weightlifting coaching for lifters who want a real plan.",
  heroText:
    "Attempt connects individual programming, technical feedback, competition preparation, and meet-day strategy so your training has direction from the first warm-up to the platform.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "See How Coaching Works",
  heroSecondaryCtaLink: "/coaching",
  heroVisualTitle: "Train with structure.",
  heroVisualText: "Compete with a plan.",

  brandKicker: "Built for weightlifters",
  brandTitle: "A coaching system, not another spreadsheet.",
  brandText:
    "The work starts with the athlete: how you move, how you recover, what you are preparing for, and what decisions need to improve. The app, programs, and future tools all support that same coaching process.",

  problemKicker: "The problem",
  problemTitle:
    "Most lifters do not need more random training. They need better decisions.",
  problemText:
    "Progress slows when programming, technique, recovery, and competition strategy are treated as separate problems. Attempt brings them back into one system.",

  coachingKicker: "The offer",
  coachingTitle: "Coaching built around the athlete in front of me.",
  coachingText:
    "A premium online coaching relationship for lifters who want structure, feedback, and a clearer process from training hall to competition platform.",

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
  proofTitle: "Built for lifters who care about the platform.",
  proofText:
    "The coaching process is grounded in weightlifting-specific training, athlete feedback, and the practical decisions that decide competition performance.",

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
    "Apply for coaching and start with a process built around your training, your technique, your schedule, and your platform goals.",
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
    "Attempt exists to connect serious weightlifting coaching, better competition preparation, and practical tools for lifters who want clearer decisions in training and on meet day.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "See Coaching",
  heroSecondaryCtaLink: "/coaching",

  founderKicker: "Founder",
  founderTitle: "Pól Hendrikur Andreasen",
  founderText:
    "Attempt is built around hands-on coaching in Olympic weightlifting, athlete development, and competition preparation. The goal is simple: help lifters train with more direction and compete with more clarity.",

  backgroundKicker: "Background",
  backgroundTitle:
    "Coaching experience from the training hall to the platform.",
  backgroundText:
    "Use this section to describe your weightlifting background, your work as a coach, your federation experience, and your role developing athletes and systems around performance. The stronger this gets, the more trust the site will carry.",

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
    "Apply for coaching if you want a structured process for your training, your technique, and your platform goals.",
  finalCtaButtonLabel: "Apply for Coaching",
  finalCtaButtonLink: "/apply",
};

async function readWithFallback<T>(
  label: string,
  fallback: T,
  read: (activeDb: NonNullable<typeof db>) => Promise<T>,
): Promise<T> {
  if (!hasFirebaseConfig || !db) return fallback;

  try {
    return await read(db);
  } catch (error) {
    console.warn(
      `Unable to read ${label} from Firestore. Using fallback.`,
      error,
    );
    return fallback;
  }
}

export async function submitApplication(data: CoachingApplication) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Application payload:", data);
    return { offline: true };
  }

  return addDoc(collection(db, "coachingApplications"), {
    ...data,
    status: "New",
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
  return readWithFallback("newsletter signups", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "newsletterSignups"),
        orderBy("createdAt", "desc"),
      ),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  });
}

export async function getPrograms() {
  return readWithFallback(
    "programs",
    samplePrograms as Program[],
    async (activeDb) => {
      const snapshot = await getDocs(
        query(collection(activeDb, "programs"), orderBy("title")),
      );

      const programs = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Program[];

      return programs.length ? programs : samplePrograms;
    },
  );
}

export async function getVisiblePrograms() {
  return readWithFallback(
    "visible programs",
    samplePrograms as Program[],
    async (activeDb) => {
      const snapshot = await getDocs(
        query(
          collection(activeDb, "programs"),
          where("visible", "==", true),
          orderBy("title"),
        ),
      );

      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Program[];
    },
  );
}

export async function getProgramBySlug(slug: string) {
  const fallbackProgram =
    (samplePrograms as Program[]).find((program) => program.slug === slug) ??
    null;

  return readWithFallback("program by slug", fallbackProgram, async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "programs"),
        where("slug", "==", slug),
        where("visible", "==", true),
      ),
    );

    const program = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }))[0] as Program | undefined;

    if (!program || program.visible === false) {
      return fallbackProgram;
    }

    return program;
  });
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
  return readWithFallback("testimonials", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(collection(activeDb, "testimonials"), orderBy("name")),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Testimonial[];
  });
}

export async function getVisibleTestimonials() {
  return readWithFallback("visible testimonials", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "testimonials"),
        where("visible", "==", true),
        orderBy("name"),
      ),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Testimonial[];
  });
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

export async function getMediaAssets() {
  return readWithFallback("media assets", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(collection(activeDb, "media"), orderBy("createdAt", "desc")),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as MediaAsset[];
  });
}

export async function createMediaAsset(data: MediaAsset) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Media asset payload:", data);
    return { offline: true };
  }

  const { id, ...assetData } = data;

  return addDoc(collection(db, "media"), {
    ...assetData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMediaAsset(id: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Media asset delete:", id);
    return { offline: true };
  }

  return deleteDoc(doc(db, "media", id));
}

export async function createAnalyticsEvent(data: AnalyticsEvent) {
  if (!hasFirebaseConfig || !db) {
    return { offline: true };
  }

  const { id, ...eventData } = data;

  return addDoc(collection(db, "analyticsEvents"), {
    ...eventData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function markAnalyticsEventEngaged(id: string) {
  if (!hasFirebaseConfig || !db) return;

  return updateDoc(doc(db, "analyticsEvents", id), {
    engaged: true,
    updatedAt: serverTimestamp(),
  });
}

export async function getAnalyticsEvents(maxEvents = 1000) {
  return readWithFallback("analytics events", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "analyticsEvents"),
        orderBy("createdAt", "desc"),
        limit(maxEvents),
      ),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as AnalyticsEvent[];
  });
}

export async function getSiteSettings() {
  return readWithFallback(
    "site settings",
    defaultSiteSettings,
    async (activeDb) => {
      const reference = doc(activeDb, "siteSettings", "main");
      const snapshot = await getDoc(reference);

      if (!snapshot.exists()) {
        return defaultSiteSettings;
      }

      return {
        ...defaultSiteSettings,
        ...snapshot.data(),
      } as SiteSettings;
    },
  );
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
  return readWithFallback(
    "homepage content",
    defaultHomepageContent,
    async (activeDb) => {
      const reference = doc(activeDb, "homepage", "main");
      const snapshot = await getDoc(reference);

      if (!snapshot.exists()) {
        return defaultHomepageContent;
      }

      return {
        ...defaultHomepageContent,
        ...snapshot.data(),
      } as HomepageContent;
    },
  );
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
  return readWithFallback(
    "coaching content",
    defaultCoachingContent,
    async (activeDb) => {
      const reference = doc(activeDb, "pages", "coaching");
      const snapshot = await getDoc(reference);

      if (!snapshot.exists()) {
        return defaultCoachingContent;
      }

      return {
        ...defaultCoachingContent,
        ...snapshot.data(),
      } as CoachingContent;
    },
  );
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
  return readWithFallback("app content", defaultAppContent, async (activeDb) => {
    const reference = doc(activeDb, "pages", "app");
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return defaultAppContent;
    }

    return {
      ...defaultAppContent,
      ...snapshot.data(),
    } as AppContent;
  });
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
  return readWithFallback(
    "about content",
    defaultAboutContent,
    async (activeDb) => {
      const reference = doc(activeDb, "pages", "about");
      const snapshot = await getDoc(reference);

      if (!snapshot.exists()) {
        return defaultAboutContent;
      }

      return {
        ...defaultAboutContent,
        ...snapshot.data(),
      } as AboutContent;
    },
  );
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
  return readWithFallback("coaching applications", [], async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "coachingApplications"),
        orderBy("createdAt", "desc"),
      ),
    );

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  });
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
