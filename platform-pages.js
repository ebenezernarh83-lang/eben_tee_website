(function () {
  "use strict";

  const store = window.BuildHubData;
  let settings = {};
  let posts = [];
  let portfolio = [];
  let properties = [];
  let testimonials = [];

  const pageConfigs = {
    about: {
      eyebrow: "About Eben Tee",
      title: "A modern Ghanaian entrepreneur connecting media, property, construction, technology, and investment.",
      intro:
        "Ebenezer Tetteh, known professionally as Eben Tee, works across drone media, YouTube storytelling, real estate marketing, construction project support, property management, and digital business tools in Ghana.",
      badge: "INSPIRE. EMPOWER. CREATE IMPACT.",
      actions: [
        ["Explore services", "/services"],
        ["Talk on WhatsApp", "#contactStrip", "secondary"],
        ["Watch YouTube", "https://www.youtube.com/@ebentee", "secondary"]
      ],
      stats: [
        ["Ghana focus", "Diaspora and local clients"],
        ["Core work", "Media, property, construction"],
        ["Brand values", "Faith, purpose, freedom"]
      ],
      highlights: [
        ["What I help people do", "See opportunities clearly, promote properties professionally, follow building progress remotely, and make better decisions in Ghana."],
        ["Who I serve", "Diaspora buyers, property owners, builders, businesses, developers, Airbnb hosts, young digital learners, and people who follow Ghana's growth."],
        ["How I work", "I combine drone visuals, clear communication, practical project knowledge, and digital systems so clients receive proof, updates, and direction."]
      ],
      processTitle: "Eben Tee platform areas",
      process: [
        ["Media", "Drone videos, documentaries, YouTube, video editing, and brand stories."],
        ["Property", "Land marketing, property tours, buyer support, Airbnb, and management."],
        ["Projects", "Construction supervision, site reports, progress clips, and documentation."],
        ["Digital", "Websites, software tools, digital products, and business systems."]
      ],
      spotlightTitle: "Main brand positioning",
      spotlightText: "Eben Tee helps people see, invest in, build, manage, and promote opportunities in Ghana.",
      spotlightList: ["Ghana market knowledge", "Drone and visual proof", "Diaspora-friendly updates", "Real estate and construction experience", "Technology-driven service"]
    },
    services: {
      eyebrow: "Eben Tee services",
      title: "One premium Ghana platform for drone media, property, construction, management, and digital growth.",
      intro:
        "Choose the service you need, then send a quick enquiry. Eben Tee can support one-off drone shoots, full property marketing, construction progress updates, Airbnb management, media projects, and digital business systems.",
      badge: "Premium Ghana services",
      actions: [
        ["Book a service", "/contact"],
        ["Book drone shoot", "/drone-services", "secondary"],
        ["Find property", "real-estate.html", "secondary"]
      ],
      stats: [
        ["6 service groups", "Media, property, projects, digital"],
        ["Best for", "Ghana and diaspora clients"],
        ["Output", "Clear visuals and practical support"]
      ],
      highlights: [
        ["Drone Services", "Drone photography, videography, real estate aerial videos, construction progress, site inspections, churches, events, hotels, resorts, and drone training."],
        ["Media and Content Creation", "YouTube documentaries, Ghana development stories, church and event coverage, real estate promos, editing, channel setup, social content, and brand documentaries."],
        ["Real Estate and Land Marketing", "Land sales promotion, house and apartment tours, buyer inspections, developer marketing, property sourcing, and investment opportunity presentation."],
        ["Construction and Project Management", "Site supervision, weekly photos and videos, material and labour tracking, cost monitoring, and diaspora progress reports."],
        ["Property and Airbnb Management", "Guest communication, check-in support, maintenance coordination, booking monitoring, furnished apartment promotion, and income reporting."],
        ["Digital Products and Software", "Websites, business systems, MoMo agent tools, construction trackers, property trackers, and digital products for Ghanaian businesses."]
      ],
      processTitle: "How to start",
      process: [
        ["Choose a service", "Tell Eben Tee what you need and where the work is located."],
        ["Share details", "Send photos, location, timeline, budget, or links if available."],
        ["Get a plan", "Receive the recommended service package, quote, and next step."],
        ["Execute and update", "Get clean visuals, clear communication, and documented progress."]
      ],
      spotlightTitle: "Need more than one service?",
      spotlightText: "Many clients need a combined package: drone footage, property marketing, site supervision, and digital reporting. Eben Tee can connect the pieces into one clear workflow.",
      spotlightList: ["Request a quote", "Book a site visit", "List your property", "Start your building project"]
    },
    "drone-services": {
      eyebrow: "Drone services in Ghana",
      title: "Aerial visuals for real estate, construction, land inspection, churches, events, tourism, and business promotion.",
      intro:
        "Book Eben Tee for clean drone photography and videography that shows the location, scale, access roads, surroundings, and story of a place with confidence.",
      badge: "Drone media and inspection",
      actions: [
        ["Book a drone shoot", "/contact"],
        ["View portfolio", "portfolio.html", "secondary"],
        ["Watch videos", "media.html", "secondary"]
      ],
      stats: [
        ["Use cases", "Land, estates, sites, events"],
        ["Output", "Photos, videos, shorts, YouTube"],
        ["Clients", "Owners, agents, builders, brands"]
      ],
      highlights: [
        ["Real estate aerial videos", "Show estates, houses, apartments, roads, neighbourhoods, landmarks, and project surroundings."],
        ["Construction progress updates", "Document foundation, block work, roofing, finishing, road works, and site progress for owners and investors."],
        ["Land inspection videos", "Support buyers abroad with drone views, access-road checks, nearby development, and visual proof."],
        ["Churches, events, resorts, hotels, and businesses", "Create promotional drone clips for church programmes, conferences, weddings, events, hospitality, tourism, schools, and brands."],
        ["Drone training", "Help beginners and young people understand practical drone use, safety, content workflow, and business opportunities."]
      ],
      processTitle: "Drone shoot workflow",
      process: [
        ["Brief", "Share the location, purpose, date, and what the video must show."],
        ["Plan", "Confirm access, timing, shot list, and deliverables."],
        ["Capture", "Drone footage, ground clips, photos, and useful site details."],
        ["Deliver", "Edited video, photos, thumbnails, social clips, or YouTube-ready content."]
      ],
      spotlightTitle: "Best for diaspora clients",
      spotlightText: "Drone footage helps people abroad understand a site before visiting, buying, building, or investing. It gives context normal photos cannot show.",
      spotlightList: ["Access roads", "Neighbourhood context", "Project scale", "Progress proof", "Marketing clips"],
      dynamic: "portfolio"
    },
    "real-estate": {
      eyebrow: "Real estate and properties",
      title: "Land, homes, apartments, property tours, and Ghana investment opportunities made easier to understand.",
      intro:
        "Eben Tee supports sellers, developers, agents, landlords, and diaspora buyers with property marketing, visual inspections, sourcing support, and clear enquiry routes.",
      badge: "Property desk",
      actions: [
        ["Find land in Ghana", "#propertyListings"],
        ["List your property", "/contact", "secondary"],
        ["Request inspection", "/contact", "secondary"]
      ],
      stats: [
        ["Property types", "Land, houses, apartments"],
        ["Buyer support", "Diaspora inspections"],
        ["Marketing", "Drone tours and listing visuals"]
      ],
      highlights: [
        ["Land sales and promotion", "Promote land with drone views, access roads, surroundings, location context, and professional listing descriptions."],
        ["House and apartment tours", "Show interiors, exteriors, neighbourhood, amenities, and selling points through photos and video."],
        ["Property sourcing support", "Help buyers identify opportunities, ask better questions, and request visual verification before decisions."],
        ["Developer marketing", "Create estate tours, sales videos, reels, YouTube features, and property campaigns for real estate teams."]
      ],
      processTitle: "Property enquiry flow",
      process: [
        ["Search or enquire", "Use the property section or contact form to describe what you need."],
        ["Verify details", "Confirm location, size, price, ownership documents, and inspection needs."],
        ["Document visually", "Use photos, drone video, walkthroughs, and location context."],
        ["Move forward", "Connect serious buyers and owners with clear next steps."]
      ],
      spotlightTitle: "For Ghanaians in the diaspora",
      spotlightText: "If you are abroad, visual inspection and clear communication help reduce confusion before you spend money on land, property, or building decisions.",
      spotlightList: ["Land inspection", "Property tour", "Access-road video", "Neighbourhood view", "WhatsApp updates"],
      dynamic: "properties"
    },
    construction: {
      eyebrow: "Construction and site supervision",
      title: "Build in Ghana with clearer updates, site documentation, and practical project monitoring.",
      intro:
        "Eben Tee supports building owners, diaspora clients, and project teams with construction supervision, photo and video updates, cost monitoring, labour tracking, and progress reports.",
      badge: "Diaspora building support",
      actions: [
        ["Request a site visit", "/contact"],
        ["View project desk", "/projects", "secondary"],
        ["Get construction updates", "/contact", "secondary"]
      ],
      stats: [
        ["Stages", "Foundation to finishing"],
        ["Updates", "Photos, videos, reports"],
        ["Clients", "Local and diaspora builders"]
      ],
      highlights: [
        ["Construction site supervision", "Monitor work progress, site condition, and key building stages with regular visual documentation."],
        ["Weekly photo and video updates", "Send practical updates that show what has been done and what needs attention."],
        ["Material and labour tracking", "Help clients follow materials, labour activity, and cost movement with clearer records."],
        ["Project documentation", "Create a useful archive of foundation, structural, roofing, plastering, finishing, and handover stages."]
      ],
      processTitle: "Project support flow",
      process: [
        ["Site brief", "Share the project location, stage, drawings, contractor details, and concerns."],
        ["Visit plan", "Agree on visit frequency, reporting style, and documentation needs."],
        ["Monitor", "Capture site photos, videos, progress notes, labour/material details, and issues."],
        ["Report", "Send clear updates for decision making and record keeping."]
      ],
      spotlightTitle: "Phase 2 client portal",
      spotlightText: "The website is prepared for a future client portal where diaspora construction clients can log in to see photos, videos, expenses, and reports.",
      spotlightList: ["Progress updates", "Expense reports", "Photo archive", "Video archive", "Customer dashboard"],
      dynamic: "projects"
    },
    "property-management": {
      eyebrow: "Property and Airbnb management",
      title: "Short-stay, furnished apartment, Airbnb, and property support for owners who need reliable management.",
      intro:
        "Eben Tee helps property owners promote, coordinate, and manage short-stay spaces with better visuals, guest communication, maintenance support, and income tracking.",
      badge: "Airbnb and property management",
      actions: [
        ["Manage my Airbnb", "/contact"],
        ["Promote property", "real-estate.html", "secondary"],
        ["Request quote", "/contact", "secondary"]
      ],
      stats: [
        ["Services", "Promotion, guests, maintenance"],
        ["Best for", "Airbnb and furnished apartments"],
        ["Goal", "Better bookings and smoother operations"]
      ],
      highlights: [
        ["Airbnb management", "Support guest communication, check-in flow, property readiness, and booking coordination."],
        ["Property maintenance coordination", "Help connect repair needs, cleaning, furnishing, and upkeep tasks with trusted follow-up."],
        ["Property promotion", "Use better photos, videos, and listing content to make the property look professional online."],
        ["Booking and income monitoring", "Track booking activity, enquiries, and simple income summaries for owners."]
      ],
      processTitle: "Management setup",
      process: [
        ["Review property", "Check location, condition, photos, furnishing, and guest experience."],
        ["Create promotion", "Prepare visuals, listing copy, and social content."],
        ["Manage flow", "Coordinate guest communication, check-in support, and maintenance."],
        ["Report", "Share updates about bookings, income, and issues."]
      ],
      spotlightTitle: "Good management starts with presentation",
      spotlightText: "Guests and renters trust properties that look clear, clean, and professionally presented. Visual content and communication matter.",
      spotlightList: ["Professional photos", "Short videos", "Guest-ready details", "Maintenance follow-up"]
    },
    media: {
      eyebrow: "Media / YouTube / Next Level GH",
      title: "Ghana stories, development videos, property tours, documentaries, and digital lessons.",
      intro:
        "Eben Tee creates media that documents Ghana's beauty, infrastructure, real estate growth, lifestyle, tourism, and opportunity for local and international audiences.",
      badge: "YouTube and content creation",
      actions: [
        ["Subscribe on YouTube", "https://www.youtube.com/@ebentee"],
        ["Start media project", "/contact", "secondary"],
        ["View videos", "#videoStories", "secondary"]
      ],
      stats: [
        ["Channel", "YouTube @ebentee"],
        ["Focus", "Ghana growth and opportunity"],
        ["Services", "Editing, setup, documentaries"]
      ],
      highlights: [
        ["YouTube documentary content", "Ghana development, infrastructure, real estate, culture, travel, and opportunity stories."],
        ["Real estate promotional videos", "Property tours, drone footage, walkthroughs, sales videos, and social-media clips."],
        ["Video editing and channel support", "Editing, thumbnails, YouTube setup, social formatting, and publishing guidance."],
        ["Brand documentaries", "Promotional videos for businesses, resorts, hotels, schools, churches, and local brands."]
      ],
      processTitle: "Content workflow",
      process: [
        ["Idea", "Clarify the story, target audience, and platform."],
        ["Capture", "Drone footage, ground visuals, interviews, and location context."],
        ["Edit", "Shape the video for YouTube, short-form, or business promotion."],
        ["Publish", "Prepare title, thumbnail, description, and sharing assets."]
      ],
      spotlightTitle: "Next Level GH direction",
      spotlightText: "The media side can grow into a Ghana-focused channel for opportunities, investment, places, projects, tourism, and digital learning.",
      spotlightList: ["Ghana development", "Infrastructure", "Real estate", "Tourism", "Digital skills"],
      dynamic: "media"
    },
    "digital-products": {
      eyebrow: "Digital products and software",
      title: "Websites, business systems, MoMo agent tools, trackers, and digital products for Ghanaian businesses.",
      intro:
        "Eben Tee also builds and promotes digital tools that help small businesses, construction clients, property owners, and young people work smarter online.",
      badge: "Digital entrepreneur",
      actions: [
        ["Request a system", "/contact"],
        ["Buy ebook", "/book", "secondary"],
        ["Discuss software", "/contact", "secondary"]
      ],
      stats: [
        ["Tools", "Websites and trackers"],
        ["Products", "Ebooks and training"],
        ["Audience", "Ghanaian businesses and learners"]
      ],
      highlights: [
        ["Website development", "Modern websites for brands, properties, services, ebooks, and business platforms."],
        ["Business management systems", "Simple tools for tracking customers, jobs, sales, expenses, and reports."],
        ["MoMo agent management software", "Tools for transaction tracking, cash flow, agent operations, and daily records."],
        ["Construction and property trackers", "Project progress, expenses, materials, property income, and task records."],
        ["Digital products", "Ebooks, guides, online income education, drone learning, and practical digital skills."]
      ],
      processTitle: "Digital project flow",
      process: [
        ["Problem", "Identify the business process or product idea."],
        ["Plan", "Map the pages, features, data, and workflow."],
        ["Build", "Create the website, tracker, dashboard, or product page."],
        ["Launch", "Publish, test, train, and improve based on real use."]
      ],
      spotlightTitle: "Available digital product",
      spotlightText: "The African Online Income Blueprint is available through the ebook page and Selar checkout.",
      spotlightList: ["Online income guide", "90-day plan", "Skill building", "Digital services", "Ethical opportunities"]
    },
    portfolio: {
      eyebrow: "Featured work and portfolio",
      title: "Drone visuals, construction projects, property tours, land videos, and Ghana development stories.",
      intro:
        "Browse work that shows the kind of visual documentation Eben Tee can create for real estate, construction, tourism, brands, and public project stories.",
      badge: "Client-ready media",
      actions: [
        ["Book project coverage", "/contact"],
        ["View drone services", "/drone-services", "secondary"],
        ["Open projects", "/projects", "secondary"]
      ],
      stats: [
        ["Portfolio", "Photos and videos"],
        ["Focus", "Drone, property, projects"],
        ["Output", "Marketing and documentation"]
      ],
      highlights: [
        ["Drone videos", "Aerial project context, road views, estate tours, land inspections, and social-ready clips."],
        ["Construction projects", "Progress visuals, site walkthroughs, stage updates, and project documentation."],
        ["Property tours", "Homes, apartments, estates, land, neighbourhoods, and investment opportunities."],
        ["Ghana infrastructure", "Roads, markets, public projects, community growth, and development stories."]
      ],
      processTitle: "Portfolio categories",
      process: [
        ["Drone media", "Aerial photos and videos."],
        ["Property tours", "Listings and buyer-focused visuals."],
        ["Construction", "Progress and supervision updates."],
        ["Stories", "YouTube, documentaries, and development news."]
      ],
      spotlightTitle: "Upload new work from admin",
      spotlightText: "Use the Portfolio tab in the admin dashboard to add drone pictures, videos, thumbnails, locations, client types, and descriptions.",
      spotlightList: ["Photos", "Videos", "YouTube links", "Client type", "Location"],
      dynamic: "portfolio"
    },
    blog: {
      eyebrow: "Blog / Ghana updates",
      title: "Ghana real estate, construction, infrastructure, investment, media, and digital opportunity updates.",
      intro:
        "Read Eben Tee updates about drone work, Ghana project news, construction progress, properties, infrastructure, media stories, and online business ideas.",
      badge: "Ghana updates",
      actions: [
        ["Read latest posts", "#blogPosts"],
        ["Suggest a story", "/contact", "secondary"],
        ["Watch YouTube", "media.html", "secondary"]
      ],
      stats: [
        ["Topics", "Property, construction, videos"],
        ["Audience", "Ghana and diaspora"],
        ["Format", "News, guides, project notes"]
      ],
      highlights: [
        ["Ghana development news", "Infrastructure, markets, roads, construction, and community growth stories."],
        ["Real estate guides", "Land, property, estate tours, buyer questions, and investment context."],
        ["Construction updates", "Building progress, site documentation, material tracking, and diaspora project lessons."],
        ["Digital business", "Online income, software, websites, drones, media, and practical technology ideas."]
      ],
      processTitle: "Use the admin blog",
      process: [
        ["Create post", "Add title, category, summary, body, cover, and tags."],
        ["Attach video", "Paste a YouTube link to use the video thumbnail automatically."],
        ["Publish", "Set status to published when ready."],
        ["Rank over time", "Keep posts useful, specific, and connected to real Ghana searches."]
      ],
      spotlightTitle: "Search-friendly content direction",
      spotlightText: "Posts should answer real searches like drone services in Ghana, land inspection for diaspora buyers, construction supervision in Ghana, or Airbnb management in Accra.",
      spotlightList: ["Ghana drone services", "Diaspora construction", "Land inspection", "Property tours", "Ghana investment"],
      dynamic: "blog"
    },
    contact: {
      eyebrow: "Contact / Book a Service",
      title: "Book a drone shoot, request a site visit, list property, start a project, or ask for a quote.",
      intro:
        "Tell Eben Tee what you need, where it is located, and how quickly you want support. The form can start WhatsApp or email so the conversation continues fast.",
      badge: "Fast enquiry",
      actions: [
        ["Chat on WhatsApp", "#contactFormPanel"],
        ["Call Eben Tee", "#contactFormPanel", "secondary"],
        ["Request quote", "#contactFormPanel", "secondary"]
      ],
      stats: [
        ["Services", "Drone, property, building"],
        ["Response", "WhatsApp-first"],
        ["Clients", "Local and diaspora"]
      ],
      highlights: [
        ["Book a drone shoot", "Send location, date, purpose, and the type of footage you need."],
        ["Request a site visit", "Share project stage, site location, photos, and the update you want."],
        ["Find or list property", "Describe the land, house, apartment, price, location, and ownership or enquiry details."],
        ["Request digital work", "Explain the website, software, tracker, or digital product you want to build."]
      ],
      processTitle: "What to include",
      process: [
        ["Your name and contact", "Use WhatsApp number or email."],
        ["Service needed", "Choose drone, property, construction, management, media, or digital."],
        ["Location", "Town, city, site location, or country if you are abroad."],
        ["Message and photos", "Add the important details and share images after WhatsApp opens."]
      ],
      spotlightTitle: "Ready to talk?",
      spotlightText: "Use the form below to prepare a clear message. If WhatsApp is connected in the admin settings, it will open with your enquiry.",
      spotlightList: ["Book now", "Request quote", "Site visit", "Property enquiry", "Drone shoot"],
      dynamic: "contact"
    },
    booking: {
      eyebrow: "Booking and quotes",
      title: "Book a drone shoot, site visit, property inspection, or digital project with clear next steps.",
      intro:
        "Use the booking page to prepare the details Eben Tee needs before quoting: service, location, date, deliverables, project stage, and contact details.",
      badge: "Booking foundation",
      actions: [
        ["Start booking", "#contactFormPanel"],
        ["Chat on WhatsApp", "#contactFormPanel", "secondary"],
        ["View services", "/services", "secondary"]
      ],
      stats: [
        ["Booking types", "Drone, property, site visits"],
        ["Flow", "Enquiry, quote, schedule"],
        ["Next phase", "Payments and calendars"]
      ],
      highlights: [
        ["Drone shoot booking", "Share location, date, purpose, shot list, and desired output for real estate, construction, events, or business promotion."],
        ["Site visit request", "Send project stage, concerns, contractor contact, and the type of progress update needed."],
        ["Property inspection", "Request location context, access-road visuals, neighbourhood media, and buyer-focused questions."],
        ["Digital project quote", "Describe the website, software, tracker, ebook page, or business system you want built."]
      ],
      processTitle: "Booking workflow",
      process: [
        ["Send request", "Use the form with service, location, date, and message."],
        ["Confirm scope", "Eben Tee clarifies deliverables, timing, and access."],
        ["Receive quote", "You get a practical quote and next step."],
        ["Schedule work", "The job is planned and tracked for delivery."]
      ],
      spotlightTitle: "Prepared for payments",
      spotlightText: "This page is ready for future payment links, booking calendars, drone training registration, and client dashboards.",
      spotlightList: ["Quote request", "Payment link ready", "Calendar ready", "Client portal ready"],
      dynamic: "contact"
    },
    brochures: {
      eyebrow: "Service brochures",
      title: "Download or request Eben Tee service packages for drone, property, construction, management, and digital work.",
      intro:
        "This page organizes the service offers clients commonly ask for so they can understand what to request before contacting Eben Tee.",
      badge: "Client sales assets",
      actions: [
        ["Request brochure", "/contact"],
        ["Book a quote", "booking.html", "secondary"],
        ["View services", "/services", "secondary"]
      ],
      stats: [
        ["Packages", "Drone, property, construction"],
        ["Audience", "Diaspora and Ghana clients"],
        ["Next phase", "PDF downloads"]
      ],
      highlights: [
        ["Drone media package", "Aerial photos, edited video, social clips, project walkthrough, and YouTube-ready output."],
        ["Diaspora construction update package", "Site visit, progress photos, video walkthrough, material/labour notes, and weekly report."],
        ["Property marketing package", "Drone tour, listing visuals, map context, description, and WhatsApp enquiry content."],
        ["Airbnb management package", "Property readiness, promotion, booking communication, maintenance coordination, and income notes."]
      ],
      processTitle: "How brochures work",
      process: [
        ["Choose package", "Select the closest service area."],
        ["Request details", "Ask for pricing and deliverables."],
        ["Customize", "Adjust by location, urgency, and project size."],
        ["Start", "Confirm the quote and begin delivery."]
      ],
      spotlightTitle: "PDF downloads can come next",
      spotlightText: "The page is ready for branded PDF brochures once final package pricing and service boundaries are confirmed.",
      spotlightList: ["Drone PDF", "Property PDF", "Construction PDF", "Digital services PDF"]
    },
    "client-portal": {
      eyebrow: "Client portal preview",
      title: "A future dashboard for diaspora clients building, investing, or managing property in Ghana.",
      intro:
        "The client portal foundation explains how future private dashboards can show progress updates, photos, videos, expenses, documents, and reports.",
      badge: "Phase 2 foundation",
      actions: [
        ["Request project updates", "booking.html"],
        ["Start building project", "construction.html", "secondary"],
        ["Contact Eben Tee", "/contact", "secondary"]
      ],
      stats: [
        ["Portal status", "Foundation ready"],
        ["Future data", "Photos, videos, costs"],
        ["Best for", "Diaspora clients"]
      ],
      highlights: [
        ["Progress timeline", "A private view of construction stage updates, photos, and video walkthroughs."],
        ["Expense and material notes", "Simple records of materials, labour activity, and key site observations."],
        ["Report archive", "Weekly or monthly updates stored in one place for owners abroad."],
        ["Customer dashboard", "Future login for active projects, property management, and digital service clients."]
      ],
      processTitle: "Portal roadmap",
      process: [
        ["Phase 1", "Public website, admin content, leads, analytics, and SEO routes."],
        ["Phase 2", "Client login, project records, uploads, and private reports."],
        ["Phase 3", "Payments, booking calendar, and customer dashboard."],
        ["Phase 4", "Advanced investment calculators and owner reports."]
      ],
      spotlightTitle: "No fake login yet",
      spotlightText: "This page is intentionally a preview until real authentication, privacy rules, and client data storage are implemented properly.",
      spotlightList: ["Private login planned", "Progress archive planned", "Payments planned", "Reports planned"]
    },
    "business-profile": {
      eyebrow: "Google Business Profile checklist",
      title: "Make Eben Tee easier to find for Ghana drone, real estate, construction, and property services.",
      intro:
        "Use this checklist to set up and maintain the public business presence that supports Google Search and Maps discovery.",
      badge: "Local search foundation",
      actions: [
        ["Open contact page", "/contact"],
        ["View SEO updates", "blog.html", "secondary"],
        ["Book service", "booking.html", "secondary"]
      ],
      stats: [
        ["Goal", "Search and Maps trust"],
        ["Focus", "Services and location"],
        ["Ongoing", "Photos, posts, reviews"]
      ],
      highlights: [
        ["Business identity", "Use Eben Tee, the official logo, accurate phone, WhatsApp, website, and Accra/Ghana service area."],
        ["Service categories", "Add drone photography, videography, real estate marketing, construction support, property management, and web services where available."],
        ["Photos and videos", "Upload real drone work, project visuals, property tours, and branded images regularly."],
        ["Reviews", "Ask real clients to review the service after drone shoots, property support, site updates, or Airbnb management."]
      ],
      processTitle: "Monthly local SEO routine",
      process: [
        ["Post update", "Share a new project, property, video, or service note."],
        ["Add media", "Upload fresh photos or video thumbnails."],
        ["Request reviews", "Ask satisfied clients for honest feedback."],
        ["Check accuracy", "Confirm phone, website, hours, and service areas."]
      ],
      spotlightTitle: "Google decides when changes appear",
      spotlightText: "The website can be optimized, but Google Search and favicon updates depend on crawling, indexing, and Search Console follow-up.",
      spotlightList: ["Submit sitemap", "Inspect URLs", "Use stable favicon", "Publish useful content"]
    }
  };

  const serviceLinks = [
    ["Drone Services", "/drone-services"],
    ["Real Estate and Properties", "real-estate.html"],
    ["Construction Supervision", "construction.html"],
    ["Property / Airbnb Management", "property-management.html"],
    ["Media / YouTube", "media.html"],
    ["Digital Products", "digital-products.html"]
  ];

  const proofBlocks = {
    "drone-services": [
      ["Safety planning", "Confirm location, access, timing, weather, privacy expectations, and safe take-off/landing points before flying."],
      ["Client deliverables", "Agree on photos, video length, orientation, social clips, thumbnails, and raw-footage needs before capture."],
      ["Compliance mindset", "Drone work is planned with safe operating distance, responsible location checks, and respect for restricted areas."]
    ],
    "real-estate": [
      ["Buyer clarity", "Every listing can show location, access roads, surroundings, price notes, size, media, and map context."],
      ["Diaspora support", "Buyers abroad can request visual inspection, drone views, and WhatsApp-ready decision updates."],
      ["Seller presentation", "Property owners get cleaner visuals and descriptions that make enquiries easier to qualify."]
    ],
    construction: [
      ["Progress proof", "Site updates can include stage, percentage, photos, video, labour/material notes, and next concerns."],
      ["Remote confidence", "Diaspora clients receive clearer evidence before sending money or making construction decisions."],
      ["Project records", "Updates build a timeline for foundation, structure, roofing, finishing, and handover."]
    ],
    "property-management": [
      ["Guest readiness", "Promotion, check-in flow, cleaning, maintenance, and owner communication can be tracked together."],
      ["Income visibility", "Owners can request simple booking and income monitoring for furnished and short-stay units."],
      ["Better presentation", "Professional visuals help Airbnb and short-stay spaces look more trustworthy online."]
    ],
    media: [
      ["Search-ready videos", "Content can be shaped with strong titles, thumbnails, descriptions, and related website posts."],
      ["Brand storytelling", "Projects, resorts, businesses, schools, churches, and estates can be turned into documentary-style media."],
      ["Multi-platform output", "One shoot can produce YouTube video, TikTok/Reels clips, Facebook posts, and website proof."]
    ],
    "digital-products": [
      ["Practical systems", "Websites and trackers focus on the daily work Ghanaian businesses actually need to record."],
      ["Digital product path", "Ebooks, templates, training pages, and simple checkout links can be added as offers grow."],
      ["Business automation", "MoMo, property, expense, construction, and client trackers can become Phase 2 tools."]
    ],
    services: [
      ["Combined service packages", "Drone footage, property listing, site visit, and digital reporting can work together."],
      ["WhatsApp-first enquiry", "Every service has a clear call-to-action for quick client conversation."],
      ["Professional proof", "Portfolio, testimonials, maps, project pages, and blog updates support trust."]
    ]
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", async () => {
    const content = await store.loadPublicContent();
    settings = content.settings || store.defaultSettings;
    posts = content.posts || [];
    portfolio = content.portfolio || [];
    properties = content.properties || [];
    testimonials = content.testimonials || [];

    bindNavigation();
    renderSettings();
    renderPage();
    bindGlobalClicks();
  });

  function bindNavigation() {
    const toggle = $(".nav-toggle");
    const nav = $("#mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    $$("#mainNav a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  function renderSettings() {
    $$("[data-setting]").forEach((node) => {
      node.textContent = settings[node.dataset.setting] || "";
    });

    const socialLinks = $("#socialLinks");
    if (socialLinks) {
      const links = [
        ["YouTube", settings.youtube],
        ["Facebook", settings.facebook],
        ["Instagram", settings.instagram],
        ["TikTok", settings.tiktok],
        ["X", settings.x]
      ].filter(([, href]) => href);
      socialLinks.innerHTML = links
        .map(([label, href]) => `<a href="${store.escapeHtml(href)}" target="_blank" rel="noreferrer">${store.escapeHtml(label)}</a>`)
        .join("");
    }

    $$("[data-whatsapp-link]").forEach((node) => {
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
      const text = node.dataset.message || "Hello Eben Tee, I want to make an enquiry from your website.";
      node.href = cleanedWhatsapp ? `https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}` : "/contact";
      if (cleanedWhatsapp) {
        node.target = "_blank";
        node.rel = "noreferrer";
      }
    });

    $$("[data-call-link]").forEach((node) => {
      node.href = settings.phone ? `tel:${settings.phone}` : "/contact";
    });
  }

  function renderPage() {
    const page = document.body.dataset.platformPage || "services";
    const config = pageConfigs[page] || pageConfigs.services;
    const main = $("#platformPageMain");
    if (!main) return;

    document.title = `${config.title.split(".")[0]} | ${settings.brandName || "Eben Tee"}`;
    main.innerHTML = `
      <section class="platform-page-hero">
        <div class="platform-page-copy">
          <p class="hero-badge"><span></span> ${store.escapeHtml(config.eyebrow)}</p>
          <h1>${store.escapeHtml(config.title)}</h1>
          <p class="lead">${store.escapeHtml(config.intro)}</p>
          <div class="hero-proof">
            <span>${store.escapeHtml(config.badge)}</span>
            <span>FAITH. PURPOSE. FREEDOM.</span>
          </div>
          <div class="hero-actions">${renderActions(config.actions)}</div>
        </div>
        <aside class="platform-page-card">
          <img src="/assets/eben-tee-logo-512.png" alt="Eben Tee logo">
          <div>
            <span>${store.escapeHtml(settings.ownerName || "Ebenezer Tetteh")}</span>
            <strong>${store.escapeHtml(config.spotlightTitle)}</strong>
            <p>${store.escapeHtml(config.spotlightText)}</p>
          </div>
        </aside>
      </section>

      <section class="platform-page-stats" aria-label="Page highlights">
        ${config.stats.map(([label, value]) => `<span><strong>${store.escapeHtml(label)}</strong><small>${store.escapeHtml(value)}</small></span>`).join("")}
      </section>

      <section class="platform-page-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Overview</p>
            <h2>${store.escapeHtml(config.eyebrow)}</h2>
          </div>
        </div>
        <div class="platform-card-grid">
          ${config.highlights.map((item, index) => renderInfoCard(item, index)).join("")}
        </div>
      </section>

      <section class="platform-page-section platform-process-section">
        <div>
          <p class="eyebrow">Process</p>
          <h2>${store.escapeHtml(config.processTitle)}</h2>
        </div>
        <div class="platform-process-grid">
          ${config.process.map((item, index) => renderProcessCard(item, index)).join("")}
        </div>
      </section>

      <section class="platform-spotlight">
        <div>
          <p class="eyebrow">Eben Tee advantage</p>
          <h2>${store.escapeHtml(config.spotlightTitle)}</h2>
          <p>${store.escapeHtml(config.spotlightText)}</p>
        </div>
        <div class="why-grid">
          ${config.spotlightList.map((item) => `<span>${store.escapeHtml(item)}</span>`).join("")}
        </div>
      </section>

      ${renderProofSection(page, config)}

      <section class="platform-page-section" id="${dynamicAnchor(config.dynamic)}">
        <div id="dynamicPanel"></div>
      </section>

      <section class="platform-contact-strip" id="contactStrip">
        <div>
          <p class="eyebrow">Work with Eben Tee</p>
          <h2>Ready to see, invest in, build, manage, or promote something in Ghana?</h2>
          <p>Send a quick message with your service, location, and goal. Eben Tee will guide the next step.</p>
        </div>
        <div class="platform-contact-actions">
          <a class="button" href="/contact">Book a service</a>
          <a class="button secondary" href="/contact" data-whatsapp-link>Chat on WhatsApp</a>
        </div>
      </section>
    `;

    renderDynamic(config.dynamic || page);
  }

  function renderActions(actions) {
    return actions
      .map(([label, href, variant]) => {
        const target = href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
        const classes = variant === "secondary" ? "button secondary" : "button";
        return `<a class="${classes}" href="${store.escapeHtml(href)}"${target}>${store.escapeHtml(label)}</a>`;
      })
      .join("");
  }

  function renderInfoCard(item, index) {
    return `
      <article class="platform-info-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${store.escapeHtml(item[0])}</strong>
        <p>${store.escapeHtml(item[1])}</p>
      </article>
    `;
  }

  function renderProcessCard(item, index) {
    return `
      <article class="platform-process-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${store.escapeHtml(item[0])}</strong>
        <p>${store.escapeHtml(item[1])}</p>
      </article>
    `;
  }

  function renderProofSection(page, config) {
    const blocks = proofBlocks[page] || proofBlocks.services;
    const relatedReviews = testimonials
      .filter((item) => {
        const category = String(item.serviceCategory || item.role || "").toLowerCase();
        const title = String(config.eyebrow || "").toLowerCase();
        return category && title.split(/\W+/).some((word) => word.length > 4 && category.includes(word));
      })
      .slice(0, 2);

    return `
      <section class="platform-proof-section">
        <div>
          <p class="eyebrow">Proof and trust</p>
          <h2>Professional details clients expect before they book.</h2>
        </div>
        <div class="platform-proof-grid">
          ${blocks
            .map(
              ([title, text]) => `
                <article>
                  <strong>${store.escapeHtml(title)}</strong>
                  <p>${store.escapeHtml(text)}</p>
                </article>
              `
            )
            .join("")}
        </div>
        ${
          relatedReviews.length
            ? `<div class="mini-review-grid">${relatedReviews
                .map((item) => `<blockquote><p>${store.escapeHtml(item.quote)}</p><cite>${store.escapeHtml(item.name)} · ${store.escapeHtml(item.role)}</cite></blockquote>`)
                .join("")}</div>`
            : ""
        }
      </section>
    `;
  }

  function renderDynamic(type) {
    const panel = $("#dynamicPanel");
    if (!panel) return;

    if (type === "properties") {
      renderPropertiesPanel(panel);
      return;
    }

    if (type === "portfolio") {
      renderPortfolioPanel(panel);
      return;
    }

    if (type === "blog") {
      renderBlogPanel(panel);
      return;
    }

    if (type === "media") {
      renderMediaPanel(panel);
      return;
    }

    if (type === "projects") {
      renderProjectsPanel(panel);
      return;
    }

    if (type === "contact") {
      renderContactPanel(panel);
      return;
    }

    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Explore more</p>
          <h2>Choose the Eben Tee service you need</h2>
        </div>
      </div>
      <div class="service-platform-grid">
        ${serviceLinks
          .map(
            ([label, href], index) => `
              <a class="service-platform-card" href="${store.escapeHtml(href)}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${store.escapeHtml(label)}</strong>
                <small>Open this service page and send an enquiry when you are ready.</small>
                <em>Open page</em>
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderPropertiesPanel(panel) {
    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Featured properties</p>
          <h2>Search land, houses, apartments, and management opportunities</h2>
        </div>
      </div>
      <div class="property-toolbar">
        <label>Search <input id="pagePropertySearch" type="search" placeholder="Accra, land, apartment..."></label>
        <label>Type
          <select id="pagePropertyType">
            <option value="all">All types</option>
            <option value="land">Land</option>
            <option value="house">House / Apartment</option>
            <option value="short">Short stay</option>
          </select>
        </label>
      </div>
      <div class="property-grid" id="pagePropertyGrid"></div>
    `;

    const render = () => {
      const search = String($("#pagePropertySearch").value || "").toLowerCase();
      const type = $("#pagePropertyType").value;
      const items = properties.filter((property) => {
        const text = [property.title, property.propertyType, property.availability, property.location, property.summary, property.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        const propertyType = String(property.propertyType || "").toLowerCase();
        const typeMatch =
          type === "all" ||
          (type === "land" && propertyType.includes("land")) ||
          (type === "house" && /house|apartment|home|estate/.test(propertyType)) ||
          (type === "short" && /short|airbnb|stay/.test(propertyType));
        return typeMatch && (!search || text.includes(search));
      });
      $("#pagePropertyGrid").innerHTML = items.length
        ? items.map(renderPropertyCard).join("")
        : `<p class="empty-state">No property matches that search yet.</p>`;
    };

    $("#pagePropertySearch").addEventListener("input", render);
    $("#pagePropertyType").addEventListener("change", render);
    render();
  }

  function renderPropertyCard(property) {
    const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
    const message = `Hello Eben Tee, I want to enquire about ${property.title} in ${property.location}.`;
    const href = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : "/contact";
    const target = whatsapp ? ' target="_blank" rel="noreferrer"' : "";
    return `
      <article class="property-card">
        <img src="${store.escapeHtml(property.coverImage || store.createGeneratedCover("building-project", property.title))}" alt="${store.escapeHtml(property.title)}" loading="lazy" decoding="async">
        <div class="property-card-copy">
          <span>${store.escapeHtml(property.propertyType)} · ${store.escapeHtml(property.availability)}</span>
          <strong>${store.escapeHtml(property.title)}</strong>
          <small>${store.escapeHtml(property.location)}</small>
          <p>${store.escapeHtml(property.summary)}</p>
          <div class="property-facts">
            <span>${store.escapeHtml(property.price)}</span>
            <span>${store.escapeHtml(property.size || "Details on request")}</span>
          </div>
          <div class="property-actions">
            <a class="text-link" href="${store.escapeHtml(store.propertyUrl(property))}">View details</a>
            <a class="button small" href="${store.escapeHtml(href)}"${target}>WhatsApp enquiry</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderPortfolioPanel(panel) {
    const items = portfolio.slice(0, 12);
    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Portfolio</p>
          <h2>Drone pictures, videos, property visuals, and project media</h2>
        </div>
      </div>
      <div class="portfolio-grid page-portfolio-grid">
        ${
          items.length
            ? items.map(renderPortfolioCard).join("")
            : `<p class="empty-state">Portfolio media will appear here after upload from the admin dashboard.</p>`
        }
      </div>
    `;
  }

  function renderPortfolioCard(item) {
    const image = item.thumbnail || (item.type === "photo" ? item.mediaUrl : "") || store.getYouTubeThumbnailUrl(item.mediaUrl);
    return `
      <a class="portfolio-card page-media-card" href="${store.escapeHtml(store.portfolioUrl(item))}">
        <span class="portfolio-card-media">
          ${image ? `<img src="${store.escapeHtml(image)}" alt="${store.escapeHtml(item.title)}" loading="lazy" decoding="async">` : `<span class="portfolio-placeholder"><span>ET</span></span>`}
          ${item.type === "video" ? '<span class="play-badge">Play</span>' : ""}
        </span>
        <span class="portfolio-card-copy">
          <small>${store.escapeHtml(item.clientType || item.type)}</small>
          <strong>${store.escapeHtml(item.title)}</strong>
          ${item.location ? `<span>${store.escapeHtml(item.location)}</span>` : ""}
        </span>
      </a>
    `;
  }

  function renderBlogPanel(panel) {
    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Latest updates</p>
          <h2>Posts, Ghana news, project updates, and service notes</h2>
        </div>
      </div>
      <div class="post-grid" id="blogPosts">
        ${posts.length ? posts.map(renderPostCard).join("") : `<p class="empty-state">No posts published yet.</p>`}
      </div>
    `;
  }

  function renderMediaPanel(panel) {
    const videos = posts.filter((post) => post.videoUrl || post.category === "video").slice(0, 8);
    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">YouTube videos</p>
          <h2 id="videoStories">Latest video stories and Ghana walkthroughs</h2>
        </div>
        <a class="text-link" href="${store.escapeHtml(settings.youtube || "https://www.youtube.com/@ebentee")}" target="_blank" rel="noreferrer">Subscribe</a>
      </div>
      <div class="post-grid">
        ${videos.length ? videos.map(renderPostCard).join("") : `<p class="empty-state">Video posts will appear here after publishing.</p>`}
      </div>
    `;
  }

  function renderProjectsPanel(panel) {
    const projects = posts.filter((post) => ["building-project", "construction-news"].includes(post.category)).slice(0, 8);
    panel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Construction projects</p>
          <h2>Current and completed project documentation</h2>
        </div>
        <a class="text-link" href="/projects">Open project desk</a>
      </div>
      <div class="post-grid">
        ${projects.length ? projects.map(renderProjectCard).join("") : `<p class="empty-state">Project updates will appear here after publishing.</p>`}
      </div>
    `;
  }

  function renderProjectCard(post) {
    const embed = store.getYouTubeEmbedUrl(post.videoUrl);
    return `
      <article class="post-card">
        <a class="card-button" href="${store.escapeHtml(store.projectUrl(post))}">
          <span class="media-frame">
            <img src="${store.escapeHtml(post.coverImage)}" alt="${store.escapeHtml(post.title)}" loading="lazy" decoding="async">
            ${embed ? '<span class="play-badge">Play</span>' : ""}
          </span>
          <span class="card-content">
            <span class="card-meta">${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</span>
            <strong>${store.escapeHtml(post.title)}</strong>
            <span>${store.escapeHtml(post.summary)}</span>
            ${post.location ? `<small>${store.escapeHtml(post.location)}</small>` : ""}
          </span>
        </a>
      </article>
    `;
  }

  function renderPostCard(post) {
    const embed = store.getYouTubeEmbedUrl(post.videoUrl);
    return `
      <article class="post-card">
        <a class="card-button" href="${store.escapeHtml(store.postUrl(post))}">
          <span class="media-frame">
            <img src="${store.escapeHtml(post.coverImage)}" alt="${store.escapeHtml(post.title)}" loading="lazy" decoding="async">
            ${embed ? '<span class="play-badge">Play</span>' : ""}
          </span>
          <span class="card-content">
            <span class="card-meta">${store.categoryLabel(post.category)} · ${store.formatDate(post.publishedAt)}</span>
            <strong>${store.escapeHtml(post.title)}</strong>
            <span>${store.escapeHtml(post.summary)}</span>
            ${post.location ? `<small>${store.escapeHtml(post.location)}</small>` : ""}
          </span>
        </a>
      </article>
    `;
  }

  function renderContactPanel(panel) {
    panel.innerHTML = `
      <div class="contact-grid platform-contact-panel" id="contactFormPanel">
        <div>
          <p class="eyebrow">Send enquiry</p>
          <h2>Tell Eben Tee what you need</h2>
          <p class="lead small-lead">This prepares a clean WhatsApp or email message with your service, location, and details.</p>
          <div class="contact-cards">
            ${settings.phone ? `<a class="contact-card" href="tel:${store.escapeHtml(settings.phone)}"><span>Call</span><strong>${store.escapeHtml(settings.phone)}</strong></a>` : ""}
            ${settings.email ? `<a class="contact-card" href="mailto:${store.escapeHtml(settings.email)}"><span>Email</span><strong>${store.escapeHtml(settings.email)}</strong></a>` : ""}
            <span class="contact-card"><span>Location</span><strong>${store.escapeHtml(settings.location || "Accra, Ghana")}</strong></span>
          </div>
        </div>
        <form class="contact-form" id="pageContactForm">
          <label>Full name <input name="name" type="text" autocomplete="name" required></label>
          <label>Email <input name="email" type="email" autocomplete="email"></label>
          <label>Phone / WhatsApp <input name="phone" type="text" autocomplete="tel" required></label>
          <label>Service needed
            <select name="service" required>
              <option value="">Choose a service</option>
              <option>Book a drone shoot</option>
              <option>Request a site visit</option>
              <option>Find land in Ghana</option>
              <option>List my property</option>
              <option>Start a building project</option>
              <option>Manage my Airbnb</option>
              <option>Website, software, or digital product</option>
              <option>Media, YouTube, or video editing</option>
            </select>
          </label>
          <label>Location <input name="location" type="text" placeholder="Town, city, site location, or country"></label>
          <label>Message <textarea name="message" rows="5" required></textarea></label>
          <label class="file-field compact">Upload site/property photo <input name="attachment" type="file" accept="image/*"></label>
          <button class="button" type="submit">Send enquiry</button>
        </form>
      </div>
    `;

      $("#pageContactForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const file = event.currentTarget.querySelector('input[type="file"]')?.files?.[0];
      const service = String(formData.get("service") || "").trim();
      await store.submitLead({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        service,
        location: String(formData.get("location") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        page: window.location.pathname,
        attachmentName: file ? file.name : ""
      }).catch(() => {});
      window.EbenTeeAnalytics?.track("lead_form_submit", { service, eventLabel: "Platform contact form" });
      const text = [
        `Hello ${settings.ownerName || "Eben Tee"}, my name is ${String(formData.get("name") || "").trim()}.`,
        `Service needed: ${service}.`,
        `Phone/WhatsApp: ${String(formData.get("phone") || "").trim()}.`,
        String(formData.get("email") || "").trim() ? `Email: ${String(formData.get("email") || "").trim()}.` : "",
        String(formData.get("location") || "").trim() ? `Location: ${String(formData.get("location") || "").trim()}.` : "",
        String(formData.get("message") || "").trim(),
        file ? `I also have a photo to share: ${file.name}.` : ""
      ]
        .filter(Boolean)
        .join("\n");
      const cleanedWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
      if (cleanedWhatsapp) {
        window.open(`https://wa.me/${cleanedWhatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (settings.email) {
        window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent("Eben Tee service enquiry")}&body=${encodeURIComponent(text)}`;
      }
      event.currentTarget.reset();
    });
  }

  function bindGlobalClicks() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-call-link]");
      if (!target) return;
      if (!settings.phone) {
        event.preventDefault();
        window.location.href = "/contact";
      }
    });
  }

  function dynamicAnchor(dynamic) {
    if (dynamic === "properties") return "propertyListings";
    if (dynamic === "media") return "videoStories";
    if (dynamic === "blog") return "blogPosts";
    return "pageDetails";
  }
})();
