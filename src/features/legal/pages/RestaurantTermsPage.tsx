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
      backTo="/restaurant/email/verification"
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

      <section id="registration" className="mt-12 scroll-mt-24">
        <h2>1. Restaurant Partner Registration</h2>
        <div className="mt-4 space-y-4">
          <p>
            To onboard with SpotQ, you must provide accurate corporate information, primary business
            contact details, an official restaurant email, and complete email OTP verification. You
            warrant that you are an authorized legal representative or owner of the restaurant
            entity with full legal capacity to bind the business to these terms.
          </p>
          <p>
            You are responsible for restricting access to staff accounts, assigning appropriate role
            permissions (Admin vs. Staff), and maintaining the confidentiality of dashboard access
            credentials.
          </p>
        </div>
      </section>

      <section id="compliance" className="mt-12 scroll-mt-24">
        <h2>2. Business Verification &amp; Statutory Compliance</h2>
        <div className="mt-4 space-y-4">
          <p>
            All onboarding partners must successfully pass verification before being published on
            customer discovery channels. You must upload authentic documentation, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              A valid Food Safety and Standards Authority of India (FSSAI) license or equivalent
              food regulatory permit
            </li>
            <li>GST Registration Certificate (GSTIN) where legally applicable</li>
            <li>Bank account settlement documentation (cancelled cheque / bank passbook)</li>
            <li>Trade/Municipal establishment permits</li>
          </ul>
          <p>
            You must maintain active regulatory licenses throughout your tenure on SpotQ. SpotQ
            reserves the right to immediately suspend restaurant operations upon expiry, revocation,
            or suspension of your FSSAI license.
          </p>
        </div>
      </section>

      <section id="menu" className="mt-12 scroll-mt-24">
        <h2>3. Menu Management &amp; Pricing Integrity</h2>
        <div className="mt-4 space-y-4">
          <p>
            Restaurant partners retain full editorial control over items, descriptions, and pricing
            published in their digital menus, subject to the following obligations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Pricing Parity:</strong> Item base prices published on SpotQ must not exceed
              the prices charged to walk-in diners for identical dine-in items.
            </li>
            <li>
              <strong>Real-Time Availability:</strong> Kitchen staff must promptly toggle
              out-of-stock items or variants to &quot;Unavailable&quot; to prevent customer order
              rejection.
            </li>
            <li>
              <strong>Allergen Disclosures:</strong> Clear declarations must be provided for common
              food allergens, vegetarian/non-vegetarian classifications, and dietary indicators.
            </li>
            <li>
              <strong>Content Licensing:</strong> You grant SpotQ a non-exclusive license to display
              your restaurant brand, logo, photographs, and menu descriptions across our web and
              mobile applications. You warrant that food photography uploaded does not infringe on
              third-party copyrights.
            </li>
          </ul>
        </div>
      </section>

      <section id="fulfillment" className="mt-12 scroll-mt-24">
        <h2>4. Order Fulfillment &amp; Kitchen SLAs</h2>
        <div className="mt-4 space-y-4">
          <p>When receiving food orders via QR table ordering or pre-orders, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Promptly accept or reject incoming orders within 2 minutes of placement</li>
            <li>
              Adhere to kitchen preparation time estimates and update order milestones accurately
              (&quot;Preparing&quot;, &quot;Ready&quot;, &quot;Served&quot;)
            </li>
            <li>
              Prioritize running table add-ons from seated guests to ensure exceptional hospitality
              turnaround
            </li>
            <li>
              Prepare food following strict hygiene standards and inspect all takeaway packaging for
              safety seals
            </li>
          </ul>
        </div>
      </section>

      <section id="queue" className="mt-12 scroll-mt-24">
        <h2>5. Virtual Queue &amp; Table Operations</h2>
        <div className="mt-4 space-y-4">
          <p>For partners utilizing SpotQ&apos;s live queue service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              You agree to honor customer queue positions and table calls generated through the
              system
            </li>
            <li>
              Maintain clear table layout and section statuses to ensure algorithmic wait-time
              predictions remain accurate
            </li>
            <li>
              Provide a reasonable grace period (minimum 5 minutes) before marking a waiting guest
              as a no-show
            </li>
            <li>
              Register walk-in diners accurately into the queue management dashboard to maintain
              queue fairness
            </li>
          </ul>
        </div>
      </section>

      <section id="fees" className="mt-12 scroll-mt-24">
        <h2>6. Payments, Platform Fees &amp; Settlements</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ provides subscription tiers (e.g. Starter, Queue Pro, Enterprise) and payment
            facilitation services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Subscription Fees:</strong> Recurring software subscription fees are billed
              monthly or annually as selected during onboarding.
            </li>
            <li>
              <strong>Payment Gateway Fees:</strong> Online customer payments processed via
              integrated gateways are subject to standard payment processing fees and applicable
              GST.
            </li>
            <li>
              <strong>Settlement Schedule:</strong> Net customer order collections (less processing
              fees and refunds) are settled directly to your registered bank account on a T+2
              business day rolling schedule.
            </li>
          </ul>
        </div>
      </section>

      <section id="liability" className="mt-12 scroll-mt-24">
        <h2>7. Cancellations, Refunds &amp; Financial Liability</h2>
        <div className="mt-4 space-y-4">
          <p>
            The Restaurant Partner bears full operational and financial liability for refunds
            resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Orders canceled by the kitchen due to ingredient unavailability</li>
            <li>Serving incorrect, missing, contaminated, or improperly prepared food items</li>
            <li>Refusal to seat or honor confirmed orders for waiting diners</li>
          </ul>
          <p>
            Where a customer is issued a refund for partner fault, the corresponding order value
            will be deducted from the partner&apos;s subsequent settlement cycle.
          </p>
        </div>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-24">
        <h2>8. Customer Data Privacy &amp; Safeguards</h2>
        <div className="mt-4 space-y-4">
          <p>
            Customer details provided through SpotQ (such as customer name, phone number, and party
            preferences) are disclosed strictly for the limited purpose of table assignment, queue
            notification, and food delivery.
          </p>
          <p>
            Restaurant Partners are strictly prohibited from storing, exporting, selling, or using
            customer contact information for unsolicited marketing, external messaging, or
            off-platform promotional communications. Any unauthorized processing of diner data
            constitutes a material breach of these terms.
          </p>
        </div>
      </section>

      <section id="availability" className="mt-12 scroll-mt-24">
        <h2>9. Service Availability &amp; Platform Modifications</h2>
        <div className="mt-4 space-y-4">
          <p>
            While SpotQ strives for 99.9% platform availability, we do not guarantee uninterrupted
            or error-free service at all times. Scheduled maintenance windows will be communicated
            in advance via the dashboard or registered email.
          </p>
          <p>
            SpotQ reserves the right to introduce feature enhancements, redesign interfaces, or
            discontinue legacy tools with reasonable advance notice.
          </p>
        </div>
      </section>

      <section id="termination" className="mt-12 scroll-mt-24">
        <h2>10. Termination &amp; Account Suspension</h2>
        <div className="mt-4 space-y-4">
          <p>
            Either party may terminate this partnership agreement with 30 days written notice.
            Furthermore, SpotQ reserves the right to immediately suspend or terminate a partner
            account if:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The restaurant fails statutory audits or loses its food safety licensing</li>
            <li>
              Repeated customer complaints regarding food hygiene or billing discrepancies occur
            </li>
            <li>
              The partner engages in fraudulent transactions, price gouging, or abusive conduct
              toward guests
            </li>
          </ul>
          <p>
            Upon termination, outstanding customer orders must be fulfilled or refunded, and
            remaining net settlements will be disbursed after clearing potential chargeback
            liabilities.
          </p>
        </div>
      </section>

      <section id="disputes" className="mt-12 scroll-mt-24">
        <h2>11. Dispute Resolution &amp; Governing Law</h2>
        <div className="mt-4 space-y-4">
          <p>
            Any dispute arising out of or in connection with these Partner Terms shall first be
            attempted to be resolved amicably through good-faith discussions between the restaurant
            owner and SpotQ management.
          </p>
          <p>
            These Partner Terms shall be governed by and interpreted under the laws of India, and
            courts in Ernakulam, Kerala shall have exclusive jurisdiction over legal proceedings.
          </p>
        </div>
      </section>

      <section id="contact" className="mt-12 scroll-mt-24">
        <h2>12. Partner Support &amp; Inquiries</h2>
        <div className="mt-4 space-y-4">
          <p>
            For partner support, technical inquiries, or billing assistance, our partner operations
            team is available:
          </p>
          <p>
            <strong>Partner Desk:</strong>{" "}
            <a
              href="mailto:spotqofficial@gmail.com"
              className="font-semibold text-[#9a3412] transition-colors hover:text-[#9a3412]/80"
            >
              spotqofficial@gmail.com
            </a>
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
