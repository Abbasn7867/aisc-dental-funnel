import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/site";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/funnel";

export const Route = createFileRoute("/tracking-privacy")({
  head: () => ({ meta: [
    { title: "Website Measurement Privacy | AI Solution Company" },
    { name: "description", content: "How AI Solution Company handles optional website measurement, advertising cookies and withdrawal of visitor permission." },
    { property: "og:title", content: "Website Measurement Privacy | AI Solution Company" },
    { property: "og:description", content: "Your choices for optional website measurement and advertising cookies." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: TrackingPrivacy,
});
function TrackingPrivacy() {
  return <><Nav /><main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
    <h1 className="text-4xl font-extrabold">Website measurement privacy</h1>
    <p>This notice supplements AI Solution Company's <a href={LEGAL.privacy} className="text-primary underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={LEGAL.cookies} className="text-primary underline" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.</p>
    <h2 className="text-2xl font-bold">Optional measurement</h2>
    <p>After you choose Accept all, this website may share page visits, offer clicks and successful business trial sign-ups with Meta through its Pixel and with Google through Google Analytics when configured. These services receive browser and device information, IP address, page URLs and cookie identifiers for website measurement and advertising optimization. No trial form answers, names, email addresses, phone numbers, patient details or health information are included in our event payloads. We do not upload customer lists or use customer matching.</p>
    <h2 className="text-2xl font-bold">Regional restrictions and privacy signals</h2>
    <p>Optional tracking stays blocked in regions requiring advertising consent and when the region cannot be determined. We currently permit measurement only in the United States, Canada, Australia, New Zealand, Japan and Singapore, and only after Accept all. Other regions remain blocked. Global Privacy Control and Do Not Track signals also block optional tracking. Advertising platforms can still report their own ad clicks and impressions without this website tracking.</p>
    <h2 className="text-2xl font-bold">Your choice and withdrawal</h2>
    <p>Essential only rejects optional measurement. Cookie settings lets you change or withdraw your choice at any time. Opening settings does not change your existing choice. Changes apply to future events and other open tabs on this site; blocked events are not replayed later. Withdrawal does not erase data already sent to the services.</p>
    <p>Your browser stores a random visitor reference, the choice, time, country and the version and text of this notice. A later withdrawal preserves the earlier acceptance time. Clearing browser storage removes that record and asks for your choice again. These website choices are separate from the trial form's account-message and marketing choices.</p>
    <Button variant="outline" onClick={() => window.dispatchEvent(new Event("aisc-cookie-settings"))}>Cookie settings</Button>
  </main><Footer /></>;
}