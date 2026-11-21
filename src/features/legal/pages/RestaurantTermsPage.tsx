import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { RestaurantTermsSections } from "@/features/legal/components/RestaurantTermsSections";
import LegalPageLayout from "@/layouts/LegalLayout";

export default function RestaurantTermsPage() {
  const tableOfContents = [
    { id: "registration", title: "1. Restaurant Partner Registration" },
    { id: "compliance", title: "2. Business Verification & Statutory Compliance" },
    { id: "menu", title: "3. Menu Management & Pricing Integrity" },
    { id: "fulfillment", title: "4. Order Fulfillment & Kitchen SLAs" },
    { id: "queue", title: "5. Virtual Queue & Table Operations" },
    { id: "fees", title: "6. Payments, Platform Fees & Settlements" },
    { id: "liability", title: "7. Cancellations, Refunds & Financial Liability" },
    { id: "privacy", title: "8. Customer Data Privacy & Safeguards" },
    { id: "availability", title: "9. Service Availability & Platform Modifications" },
    { id: "termination", title: "10. Termination & Account Suspension" },
    { id: "disputes", title: "11. Dispute Resolution & Governing Law" },
    { id: "contact", title: "12. Partner Support & Inquiries" },
  ];

  return (
    <LegalPageLayout
      title="Restaurant Partner Terms & Conditions"
      description="Please read these terms carefully before registering and operating your restaurant on the SpotQ platform."
      lastUpdated="October 9, 2026"
      variant="restaurant"
      backTo={RESTAURANT_ROUTES.LOGIN}
      backLabel="Back to Restaurant Portal"
    >
      <div className="space-y-4">
        <p>
          Welcome to SpotQ&apos;s Restaurant Partner Program. These Terms &amp; Conditions
          (&quot;Partner Terms&quot;) govern the commercial and technical relationship between SpotQ
          (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;) and your dining establishment
          (&quot;Restaurant Partner&quot;, &quot;you&quot;, &quot;your&quot;) regarding onboarding,
          virtual waitlist operations, digital table menus, QR ordering, and payment processing.
        </p>

        <p>
          By completing restaurant registration, verifying your restaurant email address, or
          operating the SpotQ Partner Dashboard, you agree to comply with and be legally bound by
          these Partner Terms.
        </p>
      </div>

      {/* Table of Contents Box */}
      <nav
        aria-label="Table of contents"
        className="my-8 rounded-xl border border-[#eddcd4] bg-[#fffaf6] p-5 not-prose"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Table of Contents
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs font-medium text-neutral-700">
          {tableOfContents.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="hover:text-[#9a3412] transition-colors flex items-center gap-1.5"
              >
                <span className="text-neutral-400">•</span>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <RestaurantTermsSections />
    </LegalPageLayout>
  );
}
