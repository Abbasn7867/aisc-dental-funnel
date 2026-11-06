// src/data/painPoints.ts — 54 pain points. Render EVERY item; do not drop, merge or shorten any.
export type AgentKey = "amy" | "leena" | "morgan" | "kim" | "stephanie" | "elise" | "joseph" | "trisha";
export const AGENTS: Record<AgentKey, { name: string; role: string; color: string }> = {
  amy: { name: "Annie", role: "Receptionist", color: "#2B6E63" },
  leena: { name: "Sarah", role: "Schedule Optimizer", color: "#3E7CB8" },
  morgan: { name: "Paula", role: "Patient Intake", color: "#E8734A" },
  kim: { name: "Claire", role: "Case Acceptance", color: "#5FA88A" },
  stephanie: { name: "Fiona", role: "Follow-up", color: "#C98A3E" },
  elise: { name: "Emily", role: "Patient Experience", color: "#C2678D" },
  joseph: { name: "David", role: "Fax Management", color: "#5B7B8C" },
  trisha: { name: "Megan", role: "Practice Manager", color: "#6B5B95" },
};
export type PainItem = { id: string; pain: string; agent: AgentKey; fix: string };
export type Category = { id: string; title: string; outcome: string; items: PainItem[] };
export const CATEGORIES: Category[] = [
  { id: "c1", title: "Appointment Booking & Scheduling", outcome: "Every call answered, every visit booked, day or night", items: [
    { id: "p1", pain: "Front desk overwhelmed by phone volume during peak hours, leading to missed calls and lost bookings", agent: "amy", fix: "Answers every call in real time, even during peak volume — books directly into the PMS" },
    { id: "p2", pain: "Double-booking or scheduling conflicts due to manual calendar management across multiple providers/chairs", agent: "leena", fix: "Prevents double-bookings across all providers and treatment chairs automatically" },
    { id: "p3", pain: "Booking made without confirming insurance is active or in-network, causing billing surprises later", agent: "amy", fix: "Flags insurance status at the point of booking, before the appointment is confirmed" },
    { id: "p4", pain: "No automated reminder system, or reminders sent too late (day-of instead of 48-72 hrs out)", agent: "amy", fix: "Sends multi-touch reminders on a 48–72hr cadence with one-click reschedule" },
    { id: "p5", pain: "Patients unable to book/reschedule outside office hours, pushing them to competitors with online/24-7 booking", agent: "amy", fix: "Captures and confirms bookings 24/7, including after hours and overnight" },
    { id: "p6", pain: "Callers who ask to speak with a person mid-call have no clean path to a human, so the request gets lost or the caller just hangs up frustrated", agent: "amy", fix: "Recognizes a transfer request immediately and routes to the right staff member, logging the reason so nothing gets lost" },
    { id: "p7", pain: "Calls that drop or disconnect mid-conversation leave the booking half-finished with no automatic follow-up to pick it back up", agent: "amy", fix: "Logs exactly where the call dropped and automatically attempts a callback to finish the booking" },
    { id: "p8", pain: "Phone bookings that start but don't finish (dropped call, transfer, caller hesitation) aren't tracked as a distinct category from web-form leads, so they're not systematically followed up on", agent: "amy", fix: "Tracks every started-but-not-completed phone booking as its own queue, regardless of why it stalled" },
  ]},
  { id: "c2", title: "Patient Intake", outcome: "Patients arrive with paperwork done, not filling it out in the lobby", items: [
    { id: "p9", pain: "New patient paperwork completed in-office on arrival, creating bottlenecks and delayed start times", agent: "morgan", fix: "Sends structured digital intake forms before the visit, so patients arrive ready" },
    { id: "p10", pain: "Incomplete or outdated medical/dental history collected, discovered mid-procedure", agent: "morgan", fix: "Collects and validates medical/dental history fields before the appointment" },
    { id: "p11", pain: "Intake forms not synced with PMS, requiring manual re-entry and data errors", agent: "morgan", fix: "Structured fields auto-populate the PMS directly, eliminating manual re-entry" },
    { id: "p12", pain: "Patients not informed in advance what documents/insurance cards to bring, causing rescheduling", agent: "morgan", fix: "Sends a pre-visit checklist of what to bring, reducing day-of rescheduling" },
  ]},
  { id: "c3", title: "Consent Forms", outcome: "Consent completed before the patient sits in the chair", items: [
    { id: "p13", pain: "Consent forms signed hastily chairside without patient fully understanding procedure risks", agent: "morgan", fix: "Sends procedure-specific consent forms 24–48 hours before the appointment" },
    { id: "p14", pain: "No digital pre-visit consent workflow, so consent collection delays same-day procedures", agent: "morgan", fix: "Digital consent workflow completed before arrival, not chairside" },
    { id: "p15", pain: "Consent forms not procedure-specific or not updated per current regulatory/legal standards", agent: "morgan", fix: "Matches the correct procedure-specific consent form to the scheduled treatment" },
    { id: "p16", pain: "Missing signed consent discovered only during audit or insurance claim dispute", agent: "morgan", fix: "Digital signatures with timestamps create audit-ready, searchable records" },
  ]},
  { id: "c4", title: "Eligibility & Benefits", outcome: "No coverage surprises at checkout", items: [
    { id: "p17", pain: "Manual eligibility verification (calling insurer) consumes significant staff time per patient", agent: "morgan", fix: "Automated real-time eligibility checks replace manual insurer calls" },
    { id: "p18", pain: "Eligibility checked too far in advance, so coverage status changes before appointment date go unnoticed", agent: "morgan", fix: "Re-verifies eligibility close to the appointment date, not just at scheduling" },
    { id: "p19", pain: "Staff unaware of patient's real-time benefit utilization (how much of annual max has been used)", agent: "morgan", fix: "Surfaces annual max, deductible status, and utilization before the visit" },
    { id: "p20", pain: "Coverage limits on radiographic services exceeded, resulting in denied claims and patient billed unexpectedly", agent: "morgan", fix: "Flags frequency-limit exposure (e.g. FMX/bitewing) before treatment, not after" },
    { id: "p21", pain: "Plan-specific downgrades or exclusions (e.g. composite downgraded to amalgam rate) not communicated pre-treatment", agent: "morgan", fix: "Surfaces plan-specific downgrades/exclusions so patients know out-of-pocket costs upfront" },
  ]},
  { id: "c5", title: "Rescheduling, No-Shows & Late Arrivals", outcome: "Empty chairs refilled automatically", items: [
    { id: "p22", pain: "No-show rate not tracked or addressed with a systematic follow-up/waitlist-fill process, leaving empty chair time", agent: "leena", fix: "Tracks no-show patterns and automatically fills openings from the waitlist" },
    { id: "p23", pain: "Late arrivals disrupt the day's schedule with no buffer or policy communicated in advance", agent: "leena", fix: "Builds buffer awareness into the schedule and communicates arrival policy in reminders" },
    { id: "p24", pain: "Rescheduled patients fall through the cracks with no automated re-booking follow-up, becoming permanently lost patients", agent: "leena", fix: "Automated re-booking follow-up ensures rescheduled patients don't disappear" },
  ]},
  { id: "c6", title: "Clinical Communication Gaps", outcome: "Instructions and treatment plans that actually get followed", items: [
    { id: "p25", pain: "Pre-operative instructions (fasting, medication holds, etc.) not communicated or communicated too late for patient to comply", agent: "kim", fix: "Sends pre-operative instructions with enough lead time for patients to comply" },
    { id: "p26", pain: "Post-operative care instructions given verbally only, forgotten, leading to avoidable complications or ER visits and no-shows at follow-up", agent: "kim", fix: "Automated SMS/email post-op care instructions patients can reference after leaving" },
    { id: "p27", pain: "Treatment plan follow-up (unscheduled or unaccepted treatment) never re-approached, leaving revenue and patient care on the table", agent: "kim", fix: "Automated follow-up sequence if a treatment plan isn't scheduled within 7 days" },
  ]},
  { id: "c7", title: "Coverage / Life Changes", outcome: "Coverage changes caught before they become denials", items: [
    { id: "p28", pain: "Patient's employment change, plan switch, or coverage discontinuation not caught until claim is denied post-treatment — no periodic re-verification process in place", agent: "morgan", fix: "Periodic re-verification (e.g. every 90 days) catches coverage changes before they cause a denial" },
  ]},
  { id: "c8", title: "Review & Reputation Management", outcome: "More reviews from happy patients, fast recovery from unhappy ones", items: [
    { id: "p29", pain: "No systematic post-visit review request process, so only unhappy patients proactively leave reviews (review bias)", agent: "elise", fix: "Sends a review request to every patient 24–48 hours after the visit" },
    { id: "p30", pain: "Negative reviews left unanswered or answered too late, damaging perceived responsiveness and trust", agent: "elise", fix: "Immediate staff notification on negative feedback for fast resolution" },
    { id: "p31", pain: "No monitoring across the major review platforms, so reputation issues go unnoticed until they've already affected new patient volume", agent: "elise", fix: "Monitors every major review platform from one dashboard" },
    { id: "p32", pain: "Review requests sent to all patients indiscriminately, including those who had a poor visit experience, amplifying negative reviews instead of filtering for resolution first", agent: "elise", fix: "Smart filtering routes unhappy patients to private feedback before any public ask" },
    { id: "p33", pain: "No workflow to funnel dissatisfied patients into private feedback/resolution channels before they post publicly", agent: "elise", fix: "Structured private-feedback workflow catches dissatisfaction before it goes public" },
    { id: "p34", pain: "Staff lack training/scripts on responding to reviews in a HIPAA-compliant, non-defensive way", agent: "elise", fix: "HIPAA-compliant response templates with staff approval workflow" },
    { id: "p35", pain: "Positive reviews and testimonials not leveraged in marketing or new-patient-facing materials, wasting available social proof", agent: "elise", fix: "Positive reviews auto-populated into marketing and new-patient materials" },
  ]},
  { id: "c9", title: "Recall, Retention & Re-Engagement", outcome: "Keep every patient on schedule", items: [
    { id: "p36", pain: "Appointments that were never confirmed are not proactively re-worked before the appointment date", agent: "stephanie", fix: "Automated re-engagement for unconfirmed bookings before the date arrives, not after a no-show" },
    { id: "p37", pain: "Payment plan follow-ups fall through the cracks with no systematic outreach cadence to keep patients on track", agent: "stephanie", fix: "Same recall-cadence mechanic applied to payment plan adherence instead of a cleaning interval" },
    { id: "p38", pain: "At-risk accounts — overdue payments, lapsed maintenance plans, expiring agreements — aren't proactively flagged before it's too late", agent: "stephanie", fix: "Flags at-risk accounts and reaches out before the relationship lapses entirely" },
    { id: "p39", pain: "Renewals and upsells depend on someone remembering to manually check a list, so they're handled ad hoc", agent: "stephanie", fix: "Automated reminders for membership, maintenance-plan, or contract renewals" },
    { id: "p40", pain: "Patients lapsed 6-12+ months aren't systematically re-engaged, only those already on a scheduled recall", agent: "stephanie", fix: "Long-lapse reactivation outreach broader than a standard recall-interval trigger" },
  ]},
  { id: "c10", title: "Referral & Care Coordination", outcome: "Refills, referrals and messages routed, not chased", items: [
    { id: "p41", pain: "Refill requests clog the front desk, requiring manual routing to a nurse or provider and adding delay", agent: "joseph", fix: "Routes prescription refill requests directly to the right clinical staff member instead of the front desk" },
    { id: "p42", pain: "Patients call repeatedly asking whether a refill was approved or a lab result is ready, with no status they can check", agent: "joseph", fix: "Gives patients status visibility on refills and lab results without repeat calls" },
    { id: "p43", pain: "Admin staff spend time transcribing and manually routing clinical messages instead of attending to patients physically present", agent: "joseph", fix: "Structured handoff of clinical messages frees front-desk staff for in-person patients" },
    { id: "p44", pain: "Urgent and non-urgent requests aren't triaged, so clinical issues can end up waiting behind routine administrative questions", agent: "joseph", fix: "Flags urgent clinical requests so they don't wait behind routine ones" },
    { id: "p45", pain: "The patient becomes the de facto messenger between referring and receiving providers, with no closed-loop communication", agent: "joseph", fix: "Closes the loop between referring and receiving providers so the patient isn't the go-between" },
    { id: "p46", pain: "Multi-channel support requests (fax, email, portal messages) lack unified ticketing, prioritization, or routing to the right team", agent: "joseph", fix: "Unifies multi-channel requests into one triaged, routed queue" },
    { id: "p47", pain: "Getting the specialist appointment itself actually booked is inconsistent — automatic when the specialist is on a connected system, but otherwise depends on staff calling or faxing to chase a confirmed date", agent: "joseph", fix: "Books directly when the receiving specialist is a connected practice; when they're not, calls/faxes the receiving office and follows up until a date is confirmed — logged as coordination, not overstated as automatic booking either way" },
    { id: "p48", pain: "Patients get a generic appointment reminder for a referral visit, so the referral context (which provider, why) is lost by the time the appointment arrives", agent: "joseph", fix: "Sends a referral-specific reminder that names the specialist and reason, not a generic appointment reminder" },
  ]},
  { id: "c11", title: "Practice Intelligence & Reporting", outcome: "See the whole practice at a glance", items: [
    { id: "p49", pain: "Staff or owners can't see at a glance how many active leads, booked appointments, and stalled deals exist right now", agent: "trisha", fix: "Real-time view of active leads, booked appointments, and stalled opportunities" },
    { id: "p50", pain: "Opportunities sit in \"contacted\" or \"in progress\" for weeks with no automatic alert or hand-off to your team", agent: "trisha", fix: "Automatically flags opportunities sitting idle with no hand-off to your team" },
    { id: "p51", pain: "There's no standing report on calls answered, leads contacted, appointments set, show rates, or closed business", agent: "trisha", fix: "Standing weekly report on calls answered, appointments set, show rates, and revenue" },
    { id: "p52", pain: "Without a codified system, the business cannot be run — or even monitored — without the owner personally involved every day", agent: "trisha", fix: "Codifies practice operations so nothing depends on one person remembering" },
    { id: "p53", pain: "Owners have no simple, quantified score for how much revenue is leaking each month across speed-to-lead, no-shows, and follow-up gaps", agent: "trisha", fix: "Quantifies monthly revenue leaking from missed calls, no-shows, and follow-up gaps" },
    { id: "p54", pain: "When a contact responds to an outbound campaign, there's no clear process for assigning that reply to the right team member", agent: "trisha", fix: "Routes inbound campaign replies to the right team member automatically" },
  ]},
];
