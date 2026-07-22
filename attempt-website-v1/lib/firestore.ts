import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  limitToLast,
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

export type ArticleStatus = "draft" | "published" | "scheduled";

export type Article = {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  body: string;
  status: ArticleStatus;
  scheduledAt?: string;
  publishedAt?: string;
  publishAtMillis?: number;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type PublicArticleSummary = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  publishedAt?: string;
  readingTime?: string;
};

export type ArticlesPageCursor = {
  publishedAt: string;
  publishAtMillis: number;
  id: string;
};

export type RecentArticlesPage = {
  articles: PublicArticleSummary[];
  cursor: ArticlesPageCursor | null;
  hasMore: boolean;
};

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
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

  transitionText: string;

  credentialsKicker: string;
  credentialsTitle: string;
  credentialsText: string;

  closingKicker: string;
  closingTitle: string;
  closingText: string;

  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButtonLabel: string;
  finalCtaButtonLink: string;
  finalCtaSecondaryLabel: string;
  finalCtaSecondaryLink: string;

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
  heroKicker: "About",
  heroHeadline: "More than a programme. A better way to approach progress.",
  heroText:
    "Attempt is an Olympic weightlifting coaching platform built around one simple idea: meaningful progress should never be left to chance.\n\nEvery athlete arrives with different strengths, limitations, experience, and ambitions. Attempt exists to turn those differences into a clear direction through individual programming, honest communication, and coaching decisions made with purpose.\n\nIt is not about chasing perfect training weeks or constantly searching for the next secret. It is about understanding what matters, doing it consistently, and adjusting the process as the athlete develops.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroSecondaryCtaLabel: "See Coaching",
  heroSecondaryCtaLink: "/coaching",

  founderKicker: "The Coach",
  founderTitle: "The person behind Attempt",
  founderText:
    "I am Pól Hendrikur Andreasen, an Olympic weightlifting coach and competitive weightlifter from the Faroe Islands.\n\nI created Attempt to offer the kind of coaching I believe athletes deserve: individual, honest, and built around a clear understanding of the person behind the numbers.\n\nMy role is not simply to write training sessions. It is to observe, question, adjust, and help each athlete understand what will move them forward.",

  backgroundKicker: "Coach and athlete",
  backgroundTitle: "Experience from both sides of the bar.",
  backgroundText:
    "My perspective has been shaped by experiencing weightlifting from both sides of the bar.\n\nAs an athlete, I understand the frustration of technical inconsistency, missed lifts, plateaus, and competition pressure. I also understand how much confidence can grow when training begins to make sense.\n\nAs a coach, the responsibility is different. The coach has to step back, recognise patterns, and make decisions based on what the athlete needs, not simply what looks impressive on paper.",

  philosophyKicker: "Coaching approach",
  philosophyTitle: "Coaching with a clear reason behind every decision.",
  philosophyText:
    "A programme is only useful when it reflects what is actually happening.\n\nTraining is reviewed and adjusted according to performance, recovery, technical development, and the demands of the athlete's wider life. Good coaching is not simply delivering a spreadsheet. It is understanding when to push, when to reduce, what to prioritise, and why.\n\nAttempt aims to give athletes both structure and context. The athlete should know what they are doing, but also understand what the work is intended to improve.",

  weightliftingKicker: "Meaning",
  weightliftingTitle: "Why Attempt?",
  weightliftingText:
    "Every meaningful result begins with an attempt.\n\nThe first attempt at a new movement. The attempt that misses. The attempt made after a difficult training period. The attempt on the competition platform when the outcome is still uncertain.\n\nWeightlifting rarely offers guarantees. It asks the athlete to prepare carefully, commit fully, and accept that progress is built through repeated effort. Attempt represents that process: the willingness to keep showing up, learning, and trying again with better preparation than before.",

  whyKicker: "What Attempt stands for",
  whyTitle: "Built around the athlete.",
  whyText:
    "No two athletes move, recover, learn, or respond to training in exactly the same way. That is why Attempt does not begin with a fixed template. It begins with the athlete.\n\nProgramming, technical priorities, training volume, and competition preparation should reflect the person doing the work. The plan still needs structure, but it must also be able to evolve.\n\nThe goal is not to create the most complicated programme. The goal is to make the right decisions often enough, for long enough, that progress becomes difficult to avoid.",

  transitionText:
    "Attempt is the system, the philosophy, and the standard behind the coaching. But coaching is still a relationship between people. Behind Attempt is one coach responsible for the programming, communication, and decisions that shape the process.",

  credentialsKicker: "Experience",
  credentialsTitle: "Relevant experience.",
  credentialsText:
    "Olympic weightlifting coach\nCompetitive Olympic weightlifter\nStrength and conditioning coach for the Faroese Handball Federation\nHead coach of Styrkifelagið Stoyt\nExperience coaching athletes with different levels, goals, and training histories\nExperience with long-term development and competition preparation",

  closingKicker: "Together",
  closingTitle: "One philosophy. Personal coaching.",
  closingText:
    "Attempt is not separate from the way I coach. It is the name given to the principles behind the work.\n\nIndividual attention, purposeful training, honest feedback, and the willingness to adjust are not additional features. They are the foundation.\n\nThe brand may be Attempt, but the coaching remains personal. Every programme, review, and decision is made with the athlete's development in mind.",

  finalCtaTitle: "Your next attempt should have a clear direction.",
  finalCtaText:
    "Tell me where you are, what you are working toward, and what has been holding you back. From there, we can decide whether Attempt is the right coaching environment for you.",
  finalCtaButtonLabel: "Apply for Coaching",
  finalCtaButtonLink: "/apply",
  finalCtaSecondaryLabel: "Explore Coaching",
  finalCtaSecondaryLink: "/coaching",
};

function applyAboutContentMigrations(content: AboutContent): AboutContent {
  const legacyDefaults: Partial<AboutContent> = {
    heroKicker: "About Attempt",
    heroHeadline: "Built by a coach who understands the platform.",
    founderText:
      "Attempt is built around hands-on coaching in Olympic weightlifting, athlete development, and competition preparation. The goal is simple: help lifters train with more direction and compete with more clarity.",
    backgroundKicker: "Background",
    backgroundTitle:
      "Coaching experience from the training hall to the platform.",
    backgroundText:
      "Use this section to describe your weightlifting background, your work as a coach, your federation experience, and your role developing athletes and systems around performance. The stronger this gets, the more trust the site will carry.",
    philosophyTitle: "Coaching and competition tools belong together.",
    philosophyText:
      "Training should prepare the athlete for the platform. Programming, technical feedback, warm-up decisions, attempt selection, and competition strategy are all part of the same process.",
    finalCtaTitle: "Ready to work with Attempt?",
    finalCtaText:
      "Apply for coaching if you want a structured process for your training, your technique, and your platform goals.",
    founderKicker: "Founder",
    founderTitle: "Pól Hendrikur Andreasen",
    weightliftingKicker: "Weightlifting only",
    weightliftingTitle: "Attempt is focused on Olympic weightlifting.",
    weightliftingText:
      "Attempt is not general fitness coaching. It is built for lifters who want to improve the snatch, clean & jerk, total, and competition process.",
    whyKicker: "Why Attempt exists",
    whyTitle: "Better structure. Better feedback. Better meet-day decisions.",
    whyText:
      "Attempt was created because lifters need more than a spreadsheet. They need a connected process from daily training to platform execution.",
  };

  const migratedContent = Object.entries(legacyDefaults).reduce(
    (updatedContent, [key, value]) => {
      const aboutKey = key as keyof AboutContent;

      if (updatedContent[aboutKey] === value) {
        return {
          ...updatedContent,
          [aboutKey]: defaultAboutContent[aboutKey],
        };
      }

      return updatedContent;
    },
    content,
  );

  if (migratedContent.heroKicker.toLowerCase().startsWith("about attempt")) {
    return {
      ...migratedContent,
      heroKicker: defaultAboutContent.heroKicker,
    };
  }

  return migratedContent;
}

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

const sampleArticles: Article[] = [
  {
    title: "How to Build a Better Snatch Start Position",
    slug: "how-to-build-a-better-snatch-start-position",
    subtitle: "A practical look at balance, tension, and patience from the floor.",
    excerpt:
      "A better snatch often starts before the bar leaves the platform. Learn how to create a more consistent start position.",
    featuredImage: "/attempt-hero-weightlifting.png",
    category: "Technique",
    tags: ["snatch", "technique"],
    author: "Pól Hendrikur Andreasen",
    body: `
      <p>The start position does not need to look identical for every lifter, but it should create the same outcome: balance over the whole foot, tension through the trunk, and a bar that can stay close from the floor.</p>
      <h2>Start with pressure</h2>
      <p>Before thinking about speed, make sure the lifter can feel pressure through the midfoot. If the bar pulls the athlete forward before the lift starts, the rest of the pull becomes a correction.</p>
      <blockquote>Better positions make better timing easier.</blockquote>
      <h2>Simple checks</h2>
      <ul><li>Shoulders slightly over the bar</li><li>Arms relaxed and long</li><li>Back tension without rushing the first pull</li></ul>
    `,
    status: "published",
    publishedAt: "2026-07-01T09:00:00.000Z",
    publishAtMillis: 1782896400000,
    seoTitle: "How to Build a Better Snatch Start Position",
    seoDescription:
      "Improve your snatch start position with practical cues for balance, tension, and bar path.",
    readingTime: "3 min read",
  },
];

function estimateReadingTime(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean);
  return `${Math.max(1, Math.ceil(words.length / 220))} min read`;
}

function isPublicArticle(article: Article) {
  if (
    !article.slug ||
    !article.title ||
    !article.excerpt ||
    !article.publishedAt ||
    typeof article.publishAtMillis !== "number"
  ) {
    return false;
  }

  if (article.status === "published") {
    return true;
  }

  return (
    article.status === "scheduled" &&
    typeof article.publishAtMillis === "number" &&
    article.publishAtMillis <= Date.now()
  );
}

function toPublicArticleSummary(article: Article): PublicArticleSummary {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    category: article.category,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
  };
}

function buildRecentArticlesPage(
  articles: Article[],
  pageSize: number,
  cursor: ArticlesPageCursor | null,
): RecentArticlesPage {
  const visibleArticles = articles
    .filter(isPublicArticle)
    .filter(
      (article) =>
        !cursor ||
        (typeof article.publishAtMillis === "number" &&
          article.publishAtMillis < cursor.publishAtMillis),
    )
    .sort((a, b) => {
      const dateDiff = (b.publishAtMillis ?? 0) - (a.publishAtMillis ?? 0);
      if (dateDiff !== 0) return dateDiff;
      return (b.id ?? b.slug).localeCompare(a.id ?? a.slug);
    });
  const pageArticles = visibleArticles.slice(0, pageSize);
  const finalArticle = pageArticles[pageArticles.length - 1];

  return {
    articles: pageArticles.map(toPublicArticleSummary),
    cursor:
      finalArticle?.id &&
      finalArticle.publishedAt &&
      typeof finalArticle.publishAtMillis === "number"
        ? {
            id: finalArticle.id,
            publishedAt: finalArticle.publishedAt,
            publishAtMillis: finalArticle.publishAtMillis,
          }
        : null,
    hasMore: visibleArticles.length > pageSize,
  };
}

export async function getArticles() {
  if (!hasFirebaseConfig || !db) return sampleArticles;

  const snapshot = await getDocs(
    query(collection(db, "articles"), orderBy("updatedAt", "desc")),
  );

  const articles = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Article[];

  return articles.length ? articles : sampleArticles;
}

export async function getPublishedArticles() {
  return readWithFallback("published articles", sampleArticles, async (activeDb) => {
    const publishedSnapshot = await getDocs(
      query(
        collection(activeDb, "articles"),
        where("status", "==", "published"),
      ),
    );

    const scheduledSnapshot = await getDocs(
      query(
        collection(activeDb, "articles"),
        where("status", "==", "scheduled"),
        where("publishAtMillis", "<=", Date.now()),
      ),
    );

    const articles = [...publishedSnapshot.docs, ...scheduledSnapshot.docs].map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Article[];

    return articles.sort((a, b) => {
      const aDate = a.publishedAt ?? "";
      const bDate = b.publishedAt ?? "";
      return bDate.localeCompare(aDate);
    });
  });
}

export async function getRecentPublishedArticlesPage({
  pageSize = 3,
  cursor = null,
}: {
  pageSize?: number;
  cursor?: ArticlesPageCursor | null;
} = {}): Promise<RecentArticlesPage> {
  const fallbackArticles = sampleArticles
    .filter(isPublicArticle)
    .sort((a, b) => {
      const dateDiff = (b.publishAtMillis ?? 0) - (a.publishAtMillis ?? 0);
      if (dateDiff !== 0) return dateDiff;
      return (b.id ?? b.slug).localeCompare(a.id ?? a.slug);
    });

  if (!hasFirebaseConfig || !db) {
    return buildRecentArticlesPage(fallbackArticles, pageSize, cursor);
  }

  try {
      const batchSize = pageSize + 1;
      const publishedConstraints = [
        where("status", "==", "published"),
        ...(cursor ? [where("publishAtMillis", "<", cursor.publishAtMillis)] : []),
        orderBy("publishAtMillis", "asc"),
        limitToLast(batchSize),
      ];
      const scheduledConstraints = [
        where("status", "==", "scheduled"),
        where("publishAtMillis", "<=", Date.now()),
        ...(cursor ? [where("publishAtMillis", "<", cursor.publishAtMillis)] : []),
        orderBy("publishAtMillis", "asc"),
        limitToLast(batchSize),
      ];
      const publishedQuery = query(collection(db, "articles"), ...publishedConstraints);
      const scheduledQuery = query(collection(db, "articles"), ...scheduledConstraints);

      const [publishedSnapshot, scheduledSnapshot] = await Promise.all([
        getDocs(publishedQuery),
        getDocs(scheduledQuery),
      ]);

      const visibleArticles = [
        ...publishedSnapshot.docs,
        ...scheduledSnapshot.docs,
      ]
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }) as Article)
        .filter(isPublicArticle)
        .sort((a, b) => {
          const dateDiff = (b.publishAtMillis ?? 0) - (a.publishAtMillis ?? 0);
          if (dateDiff !== 0) return dateDiff;
          return (b.id ?? b.slug).localeCompare(a.id ?? a.slug);
        });

      return buildRecentArticlesPage(visibleArticles, pageSize, null);
  } catch (error) {
    console.warn(
      "Unable to read recent articles with cursor pagination. Falling back to existing published article read.",
      error,
    );

    const publishedArticles = (await getPublishedArticles()) as Article[];

    return buildRecentArticlesPage(publishedArticles, pageSize, cursor);
  }
}

export async function getPublishedArticleBySlug(slug: string) {
  const fallbackArticle =
    sampleArticles.find((article) => article.slug === slug) ?? null;

  return readWithFallback("published article by slug", fallbackArticle, async (activeDb) => {
    const publishedSnapshot = await getDocs(
      query(
        collection(activeDb, "articles"),
        where("status", "==", "published"),
      ),
    );

    const scheduledSnapshot = await getDocs(
      query(
        collection(activeDb, "articles"),
        where("status", "==", "scheduled"),
        where("publishAtMillis", "<=", Date.now()),
      ),
    );

    return ([...publishedSnapshot.docs, ...scheduledSnapshot.docs].map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Article[]).find((article) => article.slug === slug) ?? null;
  });
}

export async function createArticle(data: Article) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Article payload:", data);
    return { offline: true };
  }

  const { id, ...articleData } = data;

  return addDoc(collection(db, "articles"), {
    ...articleData,
    readingTime: estimateReadingTime(articleData.body),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateArticle(id: string, data: Partial<Article>) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Article update:", id, data);
    return { offline: true };
  }

  const updatePayload = {
    ...data,
    ...(data.body ? { readingTime: estimateReadingTime(data.body) } : {}),
    updatedAt: serverTimestamp(),
  };

  return updateDoc(doc(db, "articles", id), updatePayload);
}

export async function deleteArticle(id: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. Article delete:", id);
    return { offline: true };
  }

  return deleteDoc(doc(db, "articles", id));
}

const sampleFaqItems: FaqItem[] = [
  {
    id: "who-is-attempt-for",
    question: "Who is Attempt Coaching for?",
    answer:
      "Attempt Coaching is for Olympic weightlifters who want structured training, technical feedback, and a clearer process from training to competition.",
    order: 1,
    isVisible: true,
  },
  {
    id: "competition-experience",
    question: "Do I need competition experience to apply?",
    answer:
      "No. You can apply without competition experience, as long as you are serious about learning the lifts properly and following a structured plan.",
    order: 2,
    isVisible: true,
  },
  {
    id: "application-process",
    question: "How does the coaching application work?",
    answer:
      "You submit the application with your background, current lifts, goals, and coaching fit. The full application is reviewed inside the admin panel before a decision is made.",
    order: 3,
    isVisible: true,
  },
  {
    id: "programs-vs-coaching",
    question: "Are digital programs the same as coaching?",
    answer:
      "No. Programs provide structure, while coaching adds individual programming, feedback, adjustments, and competition preparation around your actual training.",
    order: 4,
    isVisible: true,
  },
  {
    id: "app-access",
    question: "Do coached athletes get access to the Attempt app?",
    answer:
      "Yes. Active coached athletes receive access to the Attempt app as part of the coaching process.",
    order: 5,
    isVisible: true,
  },
];

function sortFaqItems(items: FaqItem[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return a.question.localeCompare(b.question);
  });
}

export async function getFaqItems() {
  return readWithFallback("FAQ items", sampleFaqItems, async (activeDb) => {
    const snapshot = await getDocs(
      query(collection(activeDb, "faqItems"), orderBy("order", "asc")),
    );

    return sortFaqItems(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as FaqItem[],
    );
  });
}

export async function getVisibleFaqItems() {
  return readWithFallback("visible FAQ items", sampleFaqItems, async (activeDb) => {
    const snapshot = await getDocs(
      query(
        collection(activeDb, "faqItems"),
        where("isVisible", "==", true),
        orderBy("order", "asc"),
      ),
    );

    return sortFaqItems(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as FaqItem[],
    );
  });
}

export async function createFaqItem(data: FaqItem) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. FAQ payload:", data);
    return { offline: true };
  }

  const { id, ...faqData } = data;
  const faqRef = doc(collection(db, "faqItems"));

  await setDoc(faqRef, {
    ...faqData,
    id: faqRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return faqRef;
}

export async function updateFaqItem(id: string, data: Partial<FaqItem>) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. FAQ update:", id, data);
    return { offline: true };
  }

  return updateDoc(doc(db, "faqItems", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFaqItem(id: string) {
  if (!hasFirebaseConfig || !db) {
    console.info("Firebase not configured. FAQ delete:", id);
    return { offline: true };
  }

  return deleteDoc(doc(db, "faqItems", id));
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

      const content = {
        ...defaultAboutContent,
        ...snapshot.data(),
      } as AboutContent;

      return applyAboutContentMigrations(content);
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
