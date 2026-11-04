// ─────────────────────────────────────────────────────────────────────────────
// NOLO — content. Everything the site shows lives here.
// To add a render: drop the .webp in /public/renders and add one line to RENDERS.
// To add a website: drop a tall screenshot in /public/sites and add one object to SITES.
// To add a film: add one object to FILMS (Vimeo id + start second of the fragment).
// ─────────────────────────────────────────────────────────────────────────────

window.NOLO = {
  contact: {
    whatsapp: "https://wa.me/573017864636?text=" + encodeURIComponent("Hi Manuel, I saw your showreel and I'd like to talk."),
    email: "mailto:m4nuelrpo@gmail.com?subject=" + encodeURIComponent("Project inquiry — via nolo"),
    emailLabel: "m4nuelrpo@gmail.com",
    // Replace with a Cal.com / Calendly / Google booking link when it exists.
    call: "https://wa.me/573017864636?text=" + encodeURIComponent("Hi Manuel, I'd like to schedule a call. These times work for me: "),
    phoneLabel: "+57 301 786 4636",
  },

  // Architectural & BIM Development — renders taken from concept to a mature design stage.
  RENDERS: [
    { src: "renders/summit-club-01.webp",     project: "Summit Club",     year: 2025, note: "Indoor golf club · concept, design, visualization" },
    { src: "renders/pinewood-house-01.webp",  project: "Pinewood House",  year: 2024, note: "House among pines · design, visualization" },
    { src: "renders/nordic-house-01.webp",    project: "Nordic House",    year: 2024, note: "Board-formed concrete · design, visualization" },
    { src: "renders/punta-guaca-01.webp",     project: "Punta Guaca",     year: 2026, note: "Retreats on stilts · concept, design, visualization" },
    { src: "renders/alameda-house-01.webp",   project: "Alameda House",   year: 2024, note: "Brick residential building · design, visualization" },
    { src: "renders/padel-pavilion-01.webp",  project: "Padel Pavilion",  year: 2025, note: "Two gabled halls · concept, design, visualization" },
    { src: "renders/amber-house-01.webp",     project: "Amber House",     year: 2024, note: "Continuous interior · design, visualization" },
    { src: "renders/walnut-house-01.webp",    project: "Walnut House",    year: 2026, note: "Walnut and dark stone · design, visualization" },
    { src: "renders/olive-house-01.webp",     project: "Olive House",     year: 2025, note: "Open-plan apartment · design, visualization" },
    { src: "renders/summit-club-02.webp",     project: "Summit Club",     year: 2025, note: "Lounge interior" },
    { src: "renders/pinewood-house-02.webp",  project: "Pinewood House",  year: 2024, note: "Living room" },
    { src: "renders/nordic-house-02.webp",    project: "Nordic House",    year: 2024, note: "Bathroom, warm plaster and timber" },
    { src: "renders/punta-guaca-02.webp",     project: "Punta Guaca",     year: 2026, note: "Cabins over the water" },
    { src: "renders/alameda-house-02.webp",   project: "Alameda House",   year: 2024, note: "Apartment living room" },
    { src: "renders/amber-house-02.webp",     project: "Amber House",     year: 2024, note: "Kitchen" },
    { src: "renders/walnut-house-02.webp",    project: "Walnut House",    year: 2026, note: "Kitchen island" },
    { src: "renders/olive-house-02.webp",     project: "Olive House",     year: 2025, note: "Living room" },
  ],

  // Website Development
  SITES: [
    {
      name: "FORM — Design Studio",
      url: "https://formwrks.co/",
      shot: "sites/formwrks.webp",
      blurb: "The site of my architecture and design studio. A single scroll that sells spaces the way a film would: projects first, words second.",
      stack: "React · GSAP · Vercel",
      services: ["Art direction", "Web design", "Development", "CMS"],
      year: 2026,
    },
    {
      name: "FORM — Technology",
      url: "https://tech.formwrks.co/",
      shot: "sites/tech-formwrks.webp",
      blurb: "The technology face of the studio: Revit plugins, BIM automation and internal software, explained for the people who buy them.",
      stack: "Static · Vercel",
      services: ["Positioning", "Web design", "Development"],
      year: 2026,
    },
    {
      name: "NOPE Studios",
      url: "https://www.nopestudios.co/",
      shot: "sites/nopestudios.webp",
      blurb: "A production company that lets the films speak. Built around the Vimeo library, with a private back office behind the same door.",
      stack: "TanStack Start · Supabase · Vercel",
      services: ["Brand", "Web design", "Development", "Back office"],
      year: 2026,
    },
  ],

  // Brand and Apps Development — internal demos, shown by their marks only.
  APPS: [
    { name: "Raven",  logo: "logos/raven.svg", line: "An AI project manager for construction that reads the site's WhatsApp groups and keeps the work on track.", kind: "Product · Brand" },
    { name: "Meka",   logo: "logos/meka.svg",  line: "A copilot for motorcycle service advisors: four photos and a voice note become a signed work order.", kind: "Product · Brand" },
    { name: "Melo",   logo: "logos/melo.svg",  line: "On-call crew booking for film productions — who is free today, confirmed in one tap.", kind: "Product · Brand" },
    { name: "FORM Internal", logo: "logos/form.svg", line: "The studio's operating system: CRM, quotes, contracts, schedules and a wiki, with AI agents inside.", kind: "Internal platform" },
    { name: "NOPE Internal", logo: "logos/nope.svg", line: "The back office of a production company: projects, quotes and the film library in one place.", kind: "Internal platform" },
  ],

  // Video Development — Director's showreel. `start` = second where the fragment begins.
  FILMS: [
    { title: "Inevitable", client: "Signa",               type: "Music video", year: 2026, length: "02:53", vimeo: "1201883690", start: 30, brief: "What is going to happen has already happened: a piece built backwards.", poster: "https://i.vimeocdn.com/video/2169340500-055abd79318955aad23ce57886883cc392db4eeb053c14263a2688aaee1dffad-d_1280x720" },
    { title: "Borrachita", client: "CNCO ft. Symon Dyce", type: "Music video", year: 2026, length: "02:46", vimeo: "1201882403", start: 40, brief: "A heartbreak sung by two voices, filmed like a night that refuses to end.", poster: "https://i.vimeocdn.com/video/2169340631-7f3687647710b71d5274e2b2529511dbea417a30203aed3d04af29fba1ea7ade-d_1280x720" },
    { title: "Cartier",    client: "Signa",               type: "Music video", year: 2026, length: "03:02", vimeo: "1201880546", start: 20, brief: "Shine, status and the distance between what you show and what you have.", poster: "https://i.vimeocdn.com/video/2169337847-0d7cf072efe094cb3d34e801d75bfc9c6034b81cafa6685b8e2302fad9dc9f9a-d_1280x720" },
    { title: "Fear of Us", client: "Justin Mira",         type: "Music video", year: 2026, length: "03:13", vimeo: "1201882085", start: 30, brief: "About the fear of what two people build together.", poster: "https://i.vimeocdn.com/video/2169338926-909f3108757321843d6043a9ab337f0b09b1bef1276265dd5786c2b6429dea86-d_1280x720" },
    { title: "Sexpecial",  client: "Signa",               type: "Music video", year: 2026, length: "01:00", vimeo: "1201891029", start: 8,  brief: "Desire filmed from a distance, not from the heat.", poster: "https://i.vimeocdn.com/video/2169345911-039d8426f9666e01a774f586cf84bae3b5fcf0b0dc2d60a2e59f4277f6087636-d_1280x720" },
    { title: "Acuérdate",  client: "Dany V",              type: "Music video", year: 2026, length: "02:05", vimeo: "1201880514", start: 25, brief: "Memory and repetition: the same scene, different every time.", poster: "https://i.vimeocdn.com/video/2169333615-99b39d59c195e496afc193f088953ba6ee173c3bc8b242b0700bc5b809735511-d_1280x720" },
  ],
};
