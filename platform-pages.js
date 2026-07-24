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
      title: "A Ghana-based engineer and software developer connecting technology, projects, media, property, and investment.",
      intro:
        "Ebenezer Tetteh, known professionally as Eben Tee, combines engineering thinking, software development, construction project support, drone media, real estate marketing, and digital entrepreneurship in Ghana.",
      heroImage: "/assets/eben-tee-profile.jpg",
      heroImageAlt: "Ebenezer Tetteh, professionally known as Eben Tee",
      badge: "INSPIRE. EMPOWER. CREATE IMPACT.",
      actions: [
        ["Explore services", "/services"],
        ["Talk on WhatsApp", "#contactStrip", "secondary"],
        ["Watch YouTube", "https://www.youtube.com/@ebentee", "secondary"]
      ],
      stats: [
        ["Professional focus", "Engineering and software"],
        ["Field work", "Projects, media, property"],
        ["Brand values", "Faith, purpose, freedom"]
      ],
      highlights: [
        ["What I help people do", "See opportunities clearly, promote properties professionally, follow building progress remotely, and make better decisions in Ghana."],
        ["Who I serve", "Diaspora buyers, property owners, builders, businesses, developers, Airbnb hosts, young digital learners, and people who follow Ghana's growth."],
        ["How I work", "I combine technical problem-solving, digital systems, visual evidence, and practical project knowledge so clients receive clear work and useful results."]
      ],
      processTitle: "Eben Tee platform areas",
      process: [
        ["Engineering", "Structured problem-solving, project thinking, technical coordination, and practical reporting."],
        ["Software", "Responsive websites, business systems, dashboards, trackers, and digital products."],
        ["Projects", "Construction supervision support, site reports, progress evidence, and documentation."],
        ["Media and property", "Drone videos, real estate presentation, documentaries, and Ghana opportunity stories."]
      ],
      spotlightTitle: "See. Build. Grow.",
      spotlightText: "Eben Tee helps people see, invest in, build, manage, and promote opportunities in Ghana.",
      spotlightList: ["Engineering mindset", "Software and digital systems", "Ghana market knowledge", "Drone and visual proof", "Project communication"],
      dynamic: "profile"
    },
    services: {
      eyebrow: "Eben Tee services",
      title: "Engineering, software, construction, media, and property services from one connected Ghana platform.",
      intro:
        "Choose the capability you need, then send a focused enquiry. Eben Tee supports digital systems, project documentation, drone shoots, property marketing, construction updates, media production, and property management.",
      badge: "Premium Ghana services",
      actions: [
        ["Book a service", "/contact"],
        ["Book drone shoot", "/drone-services", "secondary"],
        ["Find property", "/real-estate", "secondary"]
      ],
      stats: [
        ["6 service groups", "Media, property, projects, digital"],
        ["Best for", "Ghana and diaspora clients"],
        ["Output", "Clear visuals and practical support"]
      ],
      highlights: [
        ["Software Engineering and Digital Systems", "Responsive websites, business systems, dashboards, trackers, APIs, and practical digital tools for Ghanaian businesses."],
        ["Construction and Project Management", "Site supervision, weekly photos and videos, material and labour tracking, cost monitoring, and diaspora progress reports."],
        ["Drone Services", "Drone photography, videography, real estate aerial videos, construction progress, site inspections, events, hotels, resorts, and drone training."],
        ["Media and Content Creation", "YouTube documentaries, Ghana development stories, event coverage, real estate promos, editing, channel support, and brand documentaries."],
        ["Real Estate and Land Marketing", "Land promotion, house and apartment tours, buyer inspections, developer marketing, property sourcing, and investment presentation."],
        ["Property and Airbnb Management", "Guest communication, check-in support, maintenance coordination, booking monitoring, furnished apartment promotion, and income reporting."]
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
        ["View portfolio", "/portfolio", "secondary"],
        ["Watch videos", "/media", "secondary"]
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
      spotlightTitle: "Structured remote project reporting",
      spotlightText: "Construction updates can bring site photos, videos, expenses, progress notes, and decisions into one clear reporting workflow for local and diaspora clients.",
      spotlightList: ["Progress updates", "Expense records", "Photo archive", "Video evidence", "Decision notes"],
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
        ["Promote property", "/real-estate", "secondary"],
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
      spotlightTitle: "Ghana stories with useful context",
      spotlightText: "The media work connects opportunities, investment, places, projects, tourism, and digital learning through clear Ghana-focused storytelling.",
      spotlightList: ["Ghana development", "Infrastructure", "Real estate", "Tourism", "Digital skills"],
      dynamic: "media"
    },
    "digital-products": {
      eyebrow: "Software engineering and digital systems",
      title: "Responsive websites, serverless platforms, business systems, trackers, and digital products built around real work.",
      intro:
        "Eben Tee develops practical digital experiences that help businesses publish, capture enquiries, manage information, monitor activity, and turn manual workflows into clearer systems.",
      badge: "Engineer and software developer",
      actions: [
        ["Discuss a software project", "/contact"],
        ["View live case study", "#softwareCaseStudy", "secondary"],
        ["Buy ebook", "/book", "secondary"]
      ],
      stats: [
        ["Frontend", "Responsive web interfaces"],
        ["Backend", "Serverless APIs and data"],
        ["Delivery", "SEO, analytics, deployment"]
      ],
      highlights: [
        ["Responsive frontend development", "Accessible, mobile-ready websites and web applications with clear information architecture and JavaScript interactions."],
        ["Serverless applications and APIs", "Content, leads, analytics, authentication, and business data connected through practical backend services."],
        ["Business systems and dashboards", "Tools for tracking customers, jobs, sales, expenses, reports, MoMo operations, properties, and projects."],
        ["Content and publishing platforms", "Content-managed posts, media, properties, project updates, testimonials, and search-friendly detail pages."],
        ["Digital products", "Ebooks, guides, checkout pages, training experiences, and online business tools."]
      ],
      processTitle: "Digital project flow",
      process: [
        ["Problem", "Identify the business process or product idea."],
        ["Plan", "Map the pages, features, data, and workflow."],
        ["Build", "Create the website, tracker, dashboard, or product page."],
        ["Launch", "Publish, test, train, and improve based on real use."]
      ],
      spotlightTitle: "Built around real business work",
      spotlightText: "The strongest software starts with the real workflow: who uses it, what they need to record, and which decision the system should make easier.",
      spotlightList: ["Problem definition", "Responsive interfaces", "Data workflows", "Analytics", "Production deployment"],
      dynamic: "software"
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
      spotlightTitle: "Put your project in the best light",
      spotlightText: "Turn your property, construction site, destination, event, or business into clear visual content that clients and investors can understand and trust.",
      spotlightList: ["Aerial photography", "Project videos", "Property tours", "Progress updates", "Brand stories"],
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
        ["Watch YouTube", "/media", "secondary"]
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
      processTitle: "How to use Eben Tee insights",
      process: [
        ["Discover", "Browse current Ghana development, property, construction, media, and digital-business topics."],
        ["Understand", "Use the photos, videos, location context, and practical notes to understand what is changing."],
        ["Follow", "Open related videos and project pages for deeper visual evidence and continued updates."],
        ["Enquire", "Contact Eben Tee when an update connects with a property, project, media, or software need."]
      ],
      spotlightTitle: "Search-friendly content direction",
      spotlightText: "Posts should answer real searches like drone services in Ghana, land inspection for diaspora buyers, construction supervision in Ghana, or Airbnb management in Accra.",
      spotlightList: ["Ghana drone services", "Diaspora construction", "Land inspection", "Property tours", "Ghana investment"],
      dynamic: "blog"
    },
    contact: {
      eyebrow: "Contact / Book a Service",
      title: "Discuss a software system, engineering collaboration, site visit, drone shoot, property need, or media project.",
      intro:
        "Tell Eben Tee what problem you need to solve, where the work is located, your timeline, and the result you want. The enquiry is saved securely for a direct follow-up.",
      badge: "Fast enquiry",
      actions: [
        ["Chat on WhatsApp", "#contactFormPanel"],
        ["Call Eben Tee", "#contactFormPanel", "secondary"],
        ["Request quote", "#contactFormPanel", "secondary"]
      ],
      stats: [
        ["Services", "Software, projects, media"],
        ["Response", "Direct enquiry"],
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
      spotlightText: "Use the form below to send a clear project message with your preferred service, location, contact details, and timeline.",
      spotlightList: ["Book now", "Request quote", "Site visit", "Property enquiry", "Drone shoot"],
      dynamic: "contact"
    },
    booking: {
      eyebrow: "Booking and quotes",
      title: "Book a drone shoot, site visit, property inspection, or digital project with clear next steps.",
      intro:
        "Use the booking page to prepare the details Eben Tee needs before quoting: service, location, date, deliverables, project stage, and contact details.",
      badge: "Direct booking",
      actions: [
        ["Start booking", "#contactFormPanel"],
        ["Chat on WhatsApp", "#contactFormPanel", "secondary"],
        ["View services", "/services", "secondary"]
      ],
      stats: [
        ["Booking types", "Drone, property, site visits"],
        ["Flow", "Enquiry, quote, schedule"],
        ["Confirmation", "Direct scope and scheduling"]
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
      spotlightTitle: "A clear brief creates a better quote",
      spotlightText: "Share the location, timing, access, deliverables, and intended use so the scope and quotation reflect the real job.",
      spotlightList: ["Clear scope", "Practical quote", "Agreed schedule", "Defined deliverables"],
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
        ["Book a quote", "/booking", "secondary"],
        ["View services", "/services", "secondary"]
      ],
      stats: [
        ["Packages", "Drone, property, construction"],
        ["Audience", "Diaspora and Ghana clients"],
        ["Format", "Tailored project scopes"]
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
      spotlightTitle: "A package shaped around the real job",
      spotlightText: "Request the service guide that matches your project. Final scope and pricing are confirmed from the location, timeline, access, and deliverables.",
      spotlightList: ["Drone media", "Property marketing", "Construction updates", "Digital services"]
    },
    "client-portal": {
      eyebrow: "Private client reporting",
      title: "Clear reporting for diaspora clients building, investing, or managing property in Ghana.",
      intro:
        "Eben Tee provides project communication through private reports, photos, videos, documents, email, and WhatsApp, with the reporting format agreed for each engagement.",
      badge: "Diaspora client support",
      actions: [
        ["Request project updates", "/booking"],
        ["Start building project", "/construction", "secondary"],
        ["Contact Eben Tee", "/contact", "secondary"]
      ],
      stats: [
        ["Reporting", "Photos, videos, notes"],
        ["Project data", "Progress, costs, records"],
        ["Best for", "Diaspora clients"]
      ],
      highlights: [
        ["Progress timeline", "Construction stage updates supported by dated photos, notes, and video walkthroughs."],
        ["Expense and material notes", "Simple records of materials, labour activity, and key site observations."],
        ["Report archive", "Weekly or monthly reports organized for owners and decision makers abroad."],
        ["Decision follow-up", "Questions, observations, and agreed next actions carried into the following report."]
      ],
      processTitle: "Current client reporting flow",
      process: [
        ["Project setup", "Confirm the site, reporting frequency, deliverables, and decision makers."],
        ["Site documentation", "Capture progress photos, videos, observations, and agreed records."],
        ["Client update", "Send a clear summary through the client's preferred private channel."],
        ["Follow-up", "Record questions, decisions, issues, and the next scheduled update."]
      ],
      spotlightTitle: "Project information stays private",
      spotlightText: "Sensitive client records are kept away from public pages and shared only through the private communication channel agreed for the work.",
      spotlightList: ["Private reporting", "Progress records", "Client communication", "Controlled sharing"]
    },
    "business-profile": {
      eyebrow: "Eben Tee professional profile",
      title: "One Ghana-based professional connecting engineering, software, projects, property, and visual media.",
      intro:
        "Eben Tee helps clients and organizations understand opportunities, build practical digital systems, document field work, and communicate progress clearly.",
      badge: "Ghana-based, internationally minded",
      actions: [
        ["Hire Eben Tee", "/contact"],
        ["View software work", "/digital-products", "secondary"],
        ["Open portfolio", "/portfolio", "secondary"]
      ],
      stats: [
        ["Base", "Ghana"],
        ["Focus", "Technology and projects"],
        ["Audience", "Local and diaspora clients"]
      ],
      highlights: [
        ["Engineering and software", "Responsive websites, business systems, serverless services, dashboards, trackers, and practical digital products."],
        ["Construction and projects", "Site documentation, structured progress reporting, coordination support, and clear evidence for decision makers."],
        ["Drone and media", "Aerial photography, videography, editing, property tours, project coverage, and Ghana development storytelling."],
        ["Property services", "Property media, buyer context, listing support, inspections, and management coordination for local and diaspora clients."]
      ],
      processTitle: "How Eben Tee works",
      process: [
        ["Understand", "Clarify the problem, audience, location, timeline, and desired outcome."],
        ["Plan", "Define the practical scope, information, media, technology, and communication needed."],
        ["Deliver", "Build, document, coordinate, or produce the agreed work with clear checkpoints."],
        ["Report", "Share the result, evidence, decisions, and next action in a useful format."]
      ],
      spotlightTitle: "Technical thinking with visible proof",
      spotlightText: "Clients can review live software, published project updates, property media, drone work, and service workflows before starting a conversation.",
      spotlightList: ["Live digital platform", "Field documentation", "Visual portfolio", "Direct enquiry"],
      dynamic: "career"
    }
  };

  const documentTitles = {
    about: "About Eben Tee",
    services: "Professional Services",
    "drone-services": "Drone Services in Ghana",
    "real-estate": "Real Estate and Properties in Ghana",
    construction: "Construction and Site Supervision",
    "property-management": "Property and Airbnb Management",
    media: "Media and YouTube",
    "digital-products": "Software Engineering and Digital Systems",
    portfolio: "Portfolio",
    blog: "Blog and Ghana Updates",
    contact: "Contact and Hire Eben Tee",
    booking: "Book a Service",
    brochures: "Service Brochures",
    "client-portal": "Private Client Reporting",
    "business-profile": "Professional Profile"
  };

  const serviceLinks = [
    ["Software Engineering", "/digital-products"],
    ["Construction Supervision", "/construction"],
    ["Drone Services", "/drone-services"],
    ["Media / YouTube", "/media"],
    ["Real Estate and Properties", "/real-estate"],
    ["Property / Airbnb Management", "/property-management"]
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
      ["Practical systems", "Websites and applications focus on the daily work people actually need to complete and understand."],
      ["Connected workflow", "Frontend, content, data, leads, analytics, and publishing work together instead of becoming isolated tools."],
      ["Production delivery", "SEO, accessibility, responsive behavior, deployment, and ongoing content operations are considered as part of the system."]
    ],
    "business-profile": [
      ["Visible work", "Software, field media, project updates, property content, and public code links can be reviewed before an interview or enquiry."],
      ["Connected capability", "Engineering thinking, software delivery, project communication, and visual documentation work together around practical outcomes."],
      ["Direct conversation", "Employers, partners, and clients can move from the profile to a focused opportunity or project discussion."]
    ],
    services: [
      ["Combined service packages", "Drone footage, property listing, site visit, and digital reporting can work together."],
      ["Direct enquiry", "Every service has a clear route for a focused client conversation."],
      ["Professional proof", "Portfolio media, maps, project pages, and published updates support trust."]
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
        ["GitHub", settings.github],
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
      } else {
        node.removeAttribute("target");
        node.removeAttribute("rel");
        const label = String(node.textContent || "").trim();
        if (/whatsapp/i.test(label)) {
          node.textContent = /talk|chat/i.test(label) ? "Send an enquiry" : "Enquire";
        }
      }
    });

    $$("[data-call-link]").forEach((node) => {
      node.href = settings.phone ? `tel:${settings.phone}` : "/contact";
      node.classList.toggle("is-hidden-contact", !settings.phone);
    });

    const hasDirectContact = Boolean(String(settings.whatsapp || "").replace(/\D/g, "") || settings.phone);
    $$(".floating-cta").forEach((node) => node.classList.toggle("is-hidden-contact", !hasDirectContact));
  }

  function renderPage() {
    const page = document.body.dataset.platformPage || "services";
    const config = pageConfigs[page] || pageConfigs.services;
    const main = $("#platformPageMain");
    if (!main) return;

    document.title = `${documentTitles[page] || config.eyebrow} | ${settings.brandName || "Eben Tee"}`;
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
        <aside class="platform-page-card${config.heroImage ? " is-profile" : ""}">
          <img src="${store.escapeHtml(config.heroImage || "/assets/eben-tee-logo-512.png")}" alt="${store.escapeHtml(config.heroImageAlt || "Eben Tee logo")}">
          <div>
            <span>${store.escapeHtml(settings.brandName || "Eben Tee")}</span>
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
        const name = String(item.name || "").trim();
        const genericName = /^(diaspora building client|real estate seller|ghana development viewer|short-stay owner)$/i.test(name);
        return !genericName && category && title.split(/\W+/).some((word) => word.length > 4 && category.includes(word));
      })
      .slice(0, 2);

    return `
      <section class="platform-proof-section">
        <div>
          <p class="eyebrow">Proof and trust</p>
          <h2>Clear scope, practical delivery, and professional communication.</h2>
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

    if (type === "software") {
      renderSoftwarePanel(panel);
      return;
    }

    if (type === "profile") {
      renderProfilePanel(panel);
      return;
    }

    if (type === "career") {
      renderCareerPanel(panel);
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

  function renderSoftwarePanel(panel) {
    panel.innerHTML = `
      <div class="software-case-study">
        <div class="software-case-intro">
          <p class="eyebrow">Live platform case study</p>
          <h2>Eben Tee business and content platform</h2>
          <p>A production platform that connects public services, visual content, properties, project updates, enquiries, analytics, and administration in one responsive experience.</p>
          <div class="hero-actions">
            <a class="button" href="/">View live platform</a>
            <a class="button secondary" href="/contact">Discuss a similar system</a>
            <a class="button secondary" href="${store.escapeHtml(settings.github || "https://github.com/ebenezernarh83-lang")}" target="_blank" rel="noreferrer">Review GitHub</a>
          </div>
        </div>
        <div class="software-case-details">
          <article><span>01</span><strong>Responsive frontend</strong><p>Accessible navigation, responsive layouts, filters, media galleries, forms, dialogs, and content-rich service pages built with HTML, CSS, and JavaScript.</p></article>
          <article><span>02</span><strong>Serverless content platform</strong><p>Secure administration, persistent content, public APIs, lead capture, media handling, clean detail routes, and structured publishing workflows.</p></article>
          <article><span>03</span><strong>Business operations</strong><p>Properties, projects, portfolio media, posts, testimonials, enquiries, source attribution, and first-party analytics managed from one system.</p></article>
          <article><span>04</span><strong>Production delivery</strong><p>Search metadata, structured data, sitemap generation, security headers, cache-aware assets, responsive behavior, and Cloudflare deployment.</p></article>
        </div>
      </div>
    `;
  }

  function renderProfilePanel(panel) {
    panel.innerHTML = `
      <div class="professional-profile-panel">
        <div class="professional-profile-intro">
          <p class="eyebrow">Professional evidence</p>
          <h2>What employers, partners, and clients can review here</h2>
          <p>This profile is grounded in visible work. Explore the live software platform, published project and property pages, visual media, and the service workflows used to turn enquiries into clear deliverables.</p>
          <div class="hero-actions">
            <a class="button" href="/digital-products">Review software work</a>
            <a class="button secondary" href="/portfolio">View field portfolio</a>
            <a class="button secondary" href="${store.escapeHtml(settings.github || "https://github.com/ebenezernarh83-lang")}" target="_blank" rel="noreferrer">View GitHub</a>
          </div>
        </div>
        <div class="professional-evidence-grid">
          <article><span>01</span><strong>Software delivery</strong><p>Responsive HTML, CSS, and JavaScript interfaces connected to serverless APIs, content operations, analytics, and production deployment.</p></article>
          <article><span>02</span><strong>Engineering approach</strong><p>Problem definition, structured planning, practical systems, clear documentation, testing, and evidence-led decision support.</p></article>
          <article><span>03</span><strong>Project communication</strong><p>Construction progress records, site visuals, property context, reporting, and communication for Ghana-based and diaspora stakeholders.</p></article>
          <article><span>04</span><strong>Media capability</strong><p>Drone operations, videography, editing, YouTube storytelling, property tours, and visual documentation of Ghana's development.</p></article>
        </div>
      </div>
      <div class="professional-engagements">
        <div>
          <p class="eyebrow">Employment and collaboration</p>
          <h2>Discuss an engineering, software, project, media, or business role.</h2>
        </div>
        <p>Share the organization, role or project, location, expected outcome, timeline, and the best way to respond. The conversation starts with the work that needs to be done.</p>
        <a class="button" href="/contact">Start a professional conversation</a>
      </div>
    `;
  }

  function renderCareerPanel(panel) {
    const githubUrl = settings.github || "https://github.com/ebenezernarh83-lang";
    panel.innerHTML = `
      <div class="professional-profile-panel">
        <div class="professional-profile-intro">
          <p class="eyebrow">Professional capability statement</p>
          <h2>What Eben Tee can contribute to a team, client, or project</h2>
          <p>A multidisciplinary working profile built around practical problem-solving, usable digital systems, clear project evidence, and communication that helps people make decisions.</p>
          <div class="hero-actions">
            <a class="button" href="/contact">Discuss an opportunity</a>
            <a class="button secondary" href="${store.escapeHtml(githubUrl)}" target="_blank" rel="noreferrer">Review GitHub</a>
          </div>
        </div>
        <div class="professional-evidence-grid">
          <article><span>01</span><strong>Engineering and problem-solving</strong><p>Structured requirements, technical coordination, practical planning, documentation, testing, and evidence-led decisions.</p></article>
          <article><span>02</span><strong>Software and digital systems</strong><p>Responsive HTML, CSS, and JavaScript interfaces, serverless APIs, content platforms, analytics, SEO, and production delivery.</p></article>
          <article><span>03</span><strong>Projects and field communication</strong><p>Construction progress records, site visuals, reporting workflows, property context, and clear updates for local and diaspora stakeholders.</p></article>
          <article><span>04</span><strong>Media and market communication</strong><p>Drone operations, videography, editing, YouTube publishing, property tours, and visual stories about Ghana's development.</p></article>
        </div>
      </div>
      <div class="professional-engagements">
        <div>
          <p class="eyebrow">Evidence available now</p>
          <h2>Review the work before starting the conversation.</h2>
        </div>
        <p>The live website demonstrates software delivery. GitHub provides public code evidence. The portfolio and YouTube channel show field documentation, visual communication, and Ghana project coverage.</p>
        <a class="button" href="/portfolio">View selected work</a>
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
            <a class="button small" href="${store.escapeHtml(href)}"${target}>${whatsapp ? "WhatsApp enquiry" : "Enquire"}</a>
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
            : `<p class="empty-state">Portfolio updates are added as work is cleared for publication. Contact Eben Tee to discuss your project coverage.</p>`
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
      <div class="post-grid" id="blogPostsGrid">
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
      window.EbenTeeAnalytics?.track("lead_form_submit", { eventLabel: "Platform contact form" });
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
    if (dynamic === "software") return "softwareCaseStudy";
    return "pageDetails";
  }
})();
