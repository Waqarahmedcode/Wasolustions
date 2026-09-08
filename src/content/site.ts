export const site = {
  name: "WASO",
  legalName: "WASO Studio",
  tagline: "AI, film, and technology for brands that refuse to be ordinary.",
  email: "hello@waso.studio",
  location: "Dubai · London · Remote",
  nav: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Vimeo", href: "https://vimeo.com" },
    { label: "X", href: "https://x.com" },
  ],
};

export const hero = {
  eyebrow: "Creative studio · Est. 2024",
  headline: "We Create The Future Of Digital Experiences",
  sub: "AI commercials, brand films, and immersive 3D built by a studio that treats every frame like the final cut.",
  primaryCta: { label: "Start A Project", href: "#contact" },
  secondaryCta: { label: "View Our Work", href: "#work" },
  stats: [
    { value: "120+", label: "Campaigns shipped" },
    { value: "38", label: "Brands worldwide" },
    { value: "14", label: "Industry awards" },
  ],
};

export type Service = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  detail: string;
  tags: string[];
};

export const services: Service[] = [
  {
    id: "ai-commercials",
    index: "01",
    title: "AI Commercials",
    blurb: "Cinematic spots generated, directed, and finished with human taste.",
    detail:
      "We combine generative video pipelines with real directors and colorists. The result is broadcast-ready in days, not months.",
    tags: ["Generative video", "Direction", "Finishing"],
  },
  {
    id: "ugc-ads",
    index: "02",
    title: "UGC Ads",
    blurb: "Native-feeling creative built to stop the scroll and convert.",
    detail:
      "Hooks tested in batches, creators cast for the audience, every variant cut for the platform it lives on.",
    tags: ["Creators", "Hooks", "Variants"],
  },
  {
    id: "brand-films",
    index: "03",
    title: "Brand Films",
    blurb: "Stories with weight. Films people remember and share.",
    detail:
      "From treatment to premiere. We write, shoot, score, and deliver films that define how a brand is felt.",
    tags: ["Narrative", "Production", "Score"],
  },
  {
    id: "product-videos",
    index: "04",
    title: "Product Videos",
    blurb: "Every surface, every detail, lit like it costs a fortune.",
    detail:
      "Macro, CGI, and hybrid product films that make the object the hero and the feature list disappear.",
    tags: ["Macro", "CGI", "Hybrid"],
  },
  {
    id: "3d-animation",
    index: "05",
    title: "3D Animation",
    blurb: "Worlds, objects, and motion that cannot be filmed.",
    detail:
      "Real-time and offline pipelines for launch films, spatial experiences, and interactive web scenes.",
    tags: ["Real-time", "Offline render", "WebGL"],
  },
  {
    id: "creative-direction",
    index: "06",
    title: "Creative Direction",
    blurb: "The idea before the pixels. Strategy that earns attention.",
    detail:
      "Positioning, campaign architecture, and performance planning so creative work has somewhere to go.",
    tags: ["Strategy", "Campaigns", "Performance"],
  },
];

export type ProjectCategory = "All" | "AI" | "Film" | "UGC" | "3D";

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: Exclude<ProjectCategory, "All">;
  services: string[];
  summary: string;
  result: string;
  palette: [string, string, string];
  video?: string;
  poster?: string;
  aspect: "wide" | "tall" | "square";
};

export const projectCategories: ProjectCategory[] = ["All", "AI", "Film", "UGC", "3D"];

export const projects: Project[] = [
  {
    id: "orbit",
    title: "Orbit",
    client: "Lumen Audio",
    year: "2026",
    category: "AI",
    services: ["AI commercial", "Sound design"],
    summary:
      "A 45-second launch spot for a spatial headphone, generated shot by shot and finished by a human colorist.",
    result: "3.1x lift in pre-orders during launch week.",
    palette: ["#0b1a2b", "#1a5fb4", "#8be9ff"],
    aspect: "wide",
  },
  {
    id: "afterglow",
    title: "Afterglow",
    client: "Meridian Hotels",
    year: "2025",
    category: "Film",
    services: ["Brand film", "Original score"],
    summary:
      "A four-minute brand film shot across three continents about what it feels like to arrive.",
    result: "Featured at two international advertising festivals.",
    palette: ["#2a1608", "#b4561a", "#ffb86b"],
    aspect: "tall",
  },
  {
    id: "pulse",
    title: "Pulse",
    client: "Kite Fitness",
    year: "2026",
    category: "UGC",
    services: ["UGC ads", "Creator casting"],
    summary:
      "Sixty creator-led variants tested across four platforms in twelve days.",
    result: "Cost per acquisition down 41% versus the prior quarter.",
    palette: ["#1a0b2b", "#7a3fd1", "#c9a0ff"],
    aspect: "square",
  },
  {
    id: "monolith",
    title: "Monolith",
    client: "Vanta Watches",
    year: "2025",
    category: "3D",
    services: ["3D product film", "WebGL configurator"],
    summary:
      "A fully CGI product film and an interactive web configurator for a titanium chronograph.",
    result: "Average session time on the product page rose to six minutes.",
    palette: ["#0a0f0c", "#2f7a5a", "#9cf5c8"],
    aspect: "wide",
  },
  {
    id: "signal",
    title: "Signal",
    client: "Northwind Mobility",
    year: "2026",
    category: "AI",
    services: ["AI commercial", "Motion graphics"],
    summary:
      "A city-scale campaign where every billboard variant was generated from one master prompt system.",
    result: "220 localized executions from a single production.",
    palette: ["#2b0b12", "#b41a4a", "#ff8bb3"],
    aspect: "square",
  },
  {
    id: "still-water",
    title: "Still Water",
    client: "Aire Skincare",
    year: "2025",
    category: "Film",
    services: ["Brand film", "Product video"],
    summary:
      "Macro cinematography and a whispering voiceover for a fragrance-free skincare line.",
    result: "Became the brand's most-watched asset within a month.",
    palette: ["#0b1f22", "#1a8a94", "#8bfff0"],
    aspect: "tall",
  },
];

export const process = [
  {
    step: "01",
    title: "Discovery",
    text: "We listen first. Audience, market, constraints, and the one thing the brand needs people to feel.",
    duration: "1 to 2 weeks",
  },
  {
    step: "02",
    title: "Strategy",
    text: "Positioning, creative territories, and a campaign architecture with measurable goals attached.",
    duration: "2 weeks",
  },
  {
    step: "03",
    title: "Production",
    text: "Direction, generation, shooting, animation, and sound. Reviewed daily, refined obsessively.",
    duration: "3 to 6 weeks",
  },
  {
    step: "04",
    title: "Delivery",
    text: "Every format, every platform, every language. Then we measure and iterate on what performs.",
    duration: "1 week",
  },
];

export const about = {
  eyebrow: "About the studio",
  headline: "Built by filmmakers. Powered by machines. Judged by feeling.",
  paragraphs: [
    "WASO started in a rented edit suite with one belief: technology should make work more human, not less. We use AI the way a cinematographer uses light. It is a tool, and taste decides everything.",
    "Today we are a team of directors, strategists, 3D artists, and engineers working across time zones. We move fast, we finish properly, and we only take on work we would be proud to sign.",
  ],
  pillars: [
    { label: "Taste over trend", text: "We chase the timeless frame, not the format of the month." },
    { label: "Craft at speed", text: "Pipelines that compress weeks into days without losing polish." },
    { label: "Measured impact", text: "Every campaign ships with a number we are accountable for." },
  ],
};

export const testimonials = [
  {
    quote:
      "They turned a launch we were nervous about into the most confident thing our brand has ever put out.",
    name: "Sofia Marchetti",
    role: "CMO, Lumen Audio",
  },
  {
    quote:
      "The speed was surprising. The craft was the part that made us extend the contract.",
    name: "Daniel Okafor",
    role: "Head of Brand, Meridian Hotels",
  },
  {
    quote:
      "We had sixty ad variants in under two weeks and the performance team is still talking about it.",
    name: "Priya Raman",
    role: "Growth Lead, Kite Fitness",
  },
  {
    quote:
      "Every review call felt like a screening. That is a rare thing in an agency relationship.",
    name: "Jonas Lindqvist",
    role: "Founder, Vanta Watches",
  },
];

export const contact = {
  headline: "Have an idea? Let's create something unforgettable.",
  sub: "Tell us what you are launching. We reply within two working days.",
  budgets: ["Under $25k", "$25k to $75k", "$75k to $200k", "$200k+"],
};
