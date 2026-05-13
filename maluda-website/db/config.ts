import { defineDb, defineTable, column } from 'astro:db';

const Courses = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    slug: column.text(),
    titleRu: column.text(),
    titleEn: column.text({ optional: true }),
    descriptionRu: column.text(),
    descriptionEn: column.text({ optional: true }),
    bestForRu: column.text({ optional: true }),
    outcomesJson: column.text({ optional: true }),
    instructor: column.text(),
    priceMonthly: column.number(),
    priceTotal: column.number(),
    priceLabel: column.text({ optional: true }),
    durationLabel: column.text({ optional: true }),
    hoursLabel: column.text({ optional: true }),
    durationWeeks: column.number(),
    sessionsPerWeek: column.number(),
    hoursPerSession: column.number(),
    totalHours: column.number(),
    level: column.text(),
    accentColor: column.text(),
    category: column.text({ default: 'full' }),
    sortOrder: column.number(),
    isActive: column.boolean({ default: true }),
  },
});

const Registrations = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    fullName: column.text(),
    email: column.text(),
    phone: column.text(),
    courseInterest: column.text(),
    source: column.text({ optional: true }),
    occupation: column.text({ optional: true }),
    goal: column.text({ optional: true }),
    referralCode: column.text({ optional: true }),
    registrationType: column.text({ default: 'general' }),
    status: column.text({ default: 'new' }),
    notes: column.text({ optional: true }),
    createdAt: column.date(),
  },
});

const Events = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    titleRu: column.text(),
    titleEn: column.text({ optional: true }),
    descriptionRu: column.text(),
    descriptionEn: column.text({ optional: true }),
    bannerLabelRu: column.text({ optional: true }),
    eventDate: column.date(),
    location: column.text(),
    price: column.number(),
    capacity: column.number(),
    isActive: column.boolean({ default: true }),
  },
});

// Media: pointers to /public assets so hero/sections can be swapped without redeploy.
// Files stay on disk (fast streaming); this table only holds URLs + metadata.
// For prod build use `astro build --remote` once Turso credentials are set up.
const Media = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    slot: column.text(),
    src: column.text(),
    reverseSrc: column.text({ optional: true }),
    poster: column.text(),
    alt: column.text(),
    isActive: column.boolean({ default: true }),
  },
});

// Quiz questions — pulled at runtime so they can be edited without redeploy.
// `optionsJson` is a JSON array of strings; `correctIndex` points into it.
const QuizQuestions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    question: column.text(),
    optionsJson: column.text(),
    correctIndex: column.number(),
    funFact: column.text(),
    tag: column.text({ optional: true }),
    sortOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
  },
});

// FAQ items — surfaced on /faq.
const FaqItems = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    question: column.text(),
    answer: column.text(),
    sortOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
  },
});

// Team members — surfaced on /about.
const TeamMembers = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    role: column.text(),
    bio: column.text(),
    accentColor: column.text(),
    sortOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
  },
});

// Gamification rewards — unlocked at scroll-XP milestones.
const Rewards = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    xpThreshold: column.number(),
    type: column.text(),
    title: column.text(),
    description: column.text(),
    icon: column.text(),
    isActive: column.boolean({ default: true }),
  },
});

// Quiz score-bucket assessments. Each row covers a percentage band [maxPctInclusive].
// The Quiz picks the FIRST row (sorted by maxPctInclusive ascending) where
// (score / total) <= maxPctInclusive — same selection rule as the original
// hardcoded ladder (0.3 → 0.6 → 0.85 → 1.0).
const QuizAssessments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    maxPctInclusive: column.number(),
    level: column.text(),
    title: column.text(),
    description: column.text(),
    cta: column.text(),
    ctaHref: column.text(),
    color: column.text(),
    nudge: column.text(),
    sortOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
  },
});

export default defineDb({
  tables: {
    Courses,
    Registrations,
    Events,
    Media,
    QuizQuestions,
    FaqItems,
    TeamMembers,
    Rewards,
    QuizAssessments,
  },
});
