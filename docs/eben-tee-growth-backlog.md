# Eben Tee Website Growth Backlog

Prepared: July 1, 2026

## Goal

Turn ebentee.com from a strong personal brand website into a premium Ghana-focused business platform that can attract search traffic, build trust with diaspora clients, capture leads, and support future paid services.

## Research Notes

- Google SEO guidance emphasizes helping search engines understand content, organizing the site clearly, using descriptive URLs, submitting a sitemap, and checking pages in Search Console.
- Google local/business guidance supports adding business details, services, photos, reviews, quote/booking paths, and updates through Google Business Profile.
- Google structured data guidance supports using JSON-LD for business, video, and product content where the page content genuinely matches the markup.
- Google Core Web Vitals focus on loading performance, interactivity, and visual stability. The target direction is LCP under 2.5 seconds, INP under 200 ms, and CLS under 0.1.
- GCAA has public guidance around drone registration. Drone service pages should show compliance, safety, and professional operating process.

Sources:
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google Video structured data: https://developers.google.com/search/docs/appearance/structured-data/video
- Google Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Google Business Profile: https://business.google.com/us/business-profile/
- GCAA drone registration: https://www.gcaa.com.gh/web/steps-to-properly-register-a-drone/

## Linear-Ready Issues

### P0 - Create individual property, project, video, and portfolio detail pages

Labels: `seo`, `content-platform`, `properties`, `projects`

Description:
Create indexable detail URLs for content currently shown mainly in grids. Each property, project, portfolio item, and video should have a unique page with title, description, media, location, tags, inquiry CTA, and metadata.

Acceptance criteria:
- Property pages exist at `/property/{slug}`.
- Project pages exist at `/project/{slug}` or reuse focused post routes cleanly.
- Portfolio/video items have shareable detail URLs.
- Sitemap includes all published detail pages.
- Each page has canonical URL, Open Graph image, and relevant JSON-LD.

### P0 - Add admin lead inbox and lead status tracking

Labels: `admin`, `conversion`, `crm`

Description:
Add a Leads tab to admin so contact form submissions, WhatsApp clicks, quote requests, property enquiries, and booking attempts can be tracked in one place.

Acceptance criteria:
- Lead fields include name, phone/email, service, location, source page, message, status, priority, notes, and follow-up date.
- Leads can be filtered by status and service.
- Admin can mark leads as new, contacted, quoted, won, lost, or follow-up.
- Public enquiry CTAs record a lead event before opening WhatsApp or email when possible.

### P0 - Build service proof blocks for each main service page

Labels: `copywriting`, `conversion`, `services`

Description:
Upgrade each service page so it answers buyer questions and reduces trust friction.

Acceptance criteria:
- Each service page includes deliverables, best-fit clients, process, turnaround expectations, pricing cue or quote CTA, proof section, FAQ, and WhatsApp CTA.
- Drone page includes compliance/safety note.
- Construction page includes diaspora reporting workflow.
- Real estate page includes buyer/seller verification checklist.
- Airbnb page includes owner onboarding checklist.

### P1 - Add page-specific structured data

Labels: `seo`, `structured-data`

Description:
Add JSON-LD templates that match each page type and content type.

Acceptance criteria:
- Homepage has Organization/ProfessionalService/LocalBusiness-compatible data.
- Service pages include Service schema where appropriate.
- Video pages/posts include VideoObject when the video is embedded and watchable on the page.
- Ebook page includes Product data with offer details if price/availability are known.
- BreadcrumbList is generated for static and detail pages.
- Rich Results Test has no critical errors on representative pages.

### P1 - Create Google Business Profile setup checklist page

Labels: `local-seo`, `business-profile`, `operations`

Description:
Create an internal checklist for setting up and maintaining Google Business Profile for Eben Tee.

Acceptance criteria:
- Checklist includes business categories, service areas, phone, website, photos, services, description, social links, booking/quote link, review process, and weekly post routine.
- Website footer/contact page clearly matches profile details.
- Add note to request real client reviews ethically.

### P1 - Improve Core Web Vitals and asset performance

Labels: `performance`, `frontend`, `seo`

Description:
Optimize CSS, images, media loading, and layout stability.

Acceptance criteria:
- Lazy-load non-critical images and embeds.
- Preload the logo and likely hero media.
- Defer non-critical scripts where safe.
- Reduce or split oversized CSS where practical.
- Add explicit image width/height or aspect-ratio for layout stability.
- Run Lighthouse or PageSpeed checks and document results.

### P1 - Add Google Maps/location support for properties and projects

Labels: `properties`, `projects`, `maps`, `conversion`

Description:
Let admin store approximate map links or coordinates for properties/projects and render a map/link on detail pages.

Acceptance criteria:
- Admin property/project forms include map URL or coordinates.
- Public pages show map link or embedded map when available.
- Users can filter properties/projects by location text.
- Sensitive/private site locations can be hidden or generalized.

### P1 - Add drone compliance and safety section

Labels: `drone-services`, `trust`, `compliance`

Description:
Add a professional drone operations section explaining registration, permit awareness, safety planning, site access, weather checks, and responsible flying.

Acceptance criteria:
- Drone services page includes compliance/safety copy.
- Contact form asks for site type, date, and location.
- Admin can flag a drone portfolio item as real estate, construction, event, tourism, or inspection.

### P1 - Add testimonials with service/category mapping

Labels: `testimonials`, `trust`, `admin`

Description:
Make testimonials more useful by linking each review to a service category and optionally a project/property.

Acceptance criteria:
- Admin testimonial form includes service category and optional related item.
- Public service pages show relevant testimonials.
- Homepage shows a balanced mix across services.

### P2 - Create diaspora construction client portal foundation

Labels: `phase-2`, `client-portal`, `construction`

Description:
Plan and scaffold a future login portal for diaspora construction clients.

Acceptance criteria:
- Define data model for clients, projects, visits, photos, videos, expenses, receipts, notes, and reports.
- Create protected route plan.
- Create admin-side project update workflow.
- Create sample client dashboard UI prototype.

### P2 - Add booking and payment flows

Labels: `payments`, `booking`, `monetization`

Description:
Prepare the site for paid drone shoots, drone training, ebook/digital products, site visits, and consultation bookings.

Acceptance criteria:
- Booking page supports service type, date, location, budget, and notes.
- Payment provider decision documented for Ghana context.
- Ebook page has clear price, checkout link, delivery note, and Product schema.
- Future booking calendar route is planned.

### P2 - Add content calendar and publishing prompts in admin

Labels: `content`, `seo`, `admin`

Description:
Help Eben Tee publish search-friendly content regularly.

Acceptance criteria:
- Admin includes suggested post templates for drone case study, property inspection, construction progress, Ghana infrastructure news, Airbnb management tip, and digital product tip.
- Each template suggests title, tags, summary, and CTA.
- Blog page groups content by topic.

### P2 - Add analytics events and conversion dashboard

Labels: `analytics`, `conversion`, `admin`

Description:
Extend analytics beyond visits to track actions.

Acceptance criteria:
- Track WhatsApp clicks, call clicks, email clicks, property enquiries, ebook checkout clicks, video opens, and form starts/submits.
- Admin analytics shows top converting pages and top services requested.
- Bots remain excluded from analytics.

### P3 - Add downloadable service brochures

Labels: `marketing`, `sales-assets`

Description:
Create lightweight PDF/download pages for drone services, diaspora construction supervision, real estate marketing, and Airbnb management.

Acceptance criteria:
- Each brochure has service summary, process, deliverables, CTA, and contact details.
- Public pages include download/request brochure CTA.

### P3 - Add multilingual/local content experiments

Labels: `content`, `localization`, `growth`

Description:
Explore small Ghana-focused local language or phrase support where it helps conversion.

Acceptance criteria:
- Decide whether Twi/Ga/Pidgin snippets fit the brand.
- Add only where it supports trust and does not reduce premium feel.
- Keep English as the primary site language.

## Suggested Sprint Order

1. Sprint 1: Detail pages, lead inbox, service proof blocks.
2. Sprint 2: Structured data, Google Business Profile checklist, performance pass.
3. Sprint 3: Maps/location support, drone compliance, testimonial mapping.
4. Sprint 4: Client portal prototype, booking/payment plan, conversion analytics.

## Slack-Ready Planning Message

**Eben Tee website growth plan**

I reviewed the current site and the next best step is to move it from a beautiful platform into a stronger client-acquisition system.

Top priorities:
- Create individual pages for properties, projects, videos, and portfolio items so they can rank and be shared.
- Add an admin lead inbox to track WhatsApp enquiries, quote requests, property enquiries, and bookings.
- Upgrade each service page with proof, deliverables, FAQs, process, and stronger CTAs.
- Add structured data for business, service, video, ebook/product, breadcrumbs, and listings.
- Improve performance and Core Web Vitals.
- Set up or complete Google Business Profile with services, photos, reviews, quote links, and weekly updates.

Recommended first sprint:
1. Detail pages for listings and portfolio.
2. Admin lead tracking.
3. Stronger service proof blocks.

Ask:
Confirm whether we should start Sprint 1 with detail pages first or lead tracking first.

## Notes For Linear/Slack Execution

The current Codex session did not expose Linear issue tools or Slack posting tools. To create issues or post the message directly, connect the Linear and Slack apps in Codex, then provide:

- Linear team and project name.
- Slack channel or DM destination.
- Whether the Slack message should be posted directly or saved as a draft.

