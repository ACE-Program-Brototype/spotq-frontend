import LegalPageLayout from "@/layouts/LegalLayout";

export default function TermsAndConditionsPage() {
  const tableOfContents = [
    { id: "about", title: "1. About SpotQ" },
    { id: "account", title: "2. Account Usage & Responsibilities" },
    { id: "waitlist", title: "3. Virtual Waitlist & Queuing Rules" },
    { id: "ordering", title: "4. Food Ordering & Fulfillment" },
    { id: "payments", title: "5. Pricing, Billing & Payments" },
    { id: "cancellations", title: "6. Cancellations & Order Modifications" },
    { id: "refunds", title: "7. Refunds & Failed Transactions" },
    { id: "responsibilities", title: "8. Restaurant vs. Platform Responsibilities" },
    { id: "prohibited", title: "9. Prohibited Conduct & Platform Misuse" },
    { id: "privacy", title: "10. Privacy & Data Protection" },
    { id: "termination", title: "11. Account Suspension & Termination" },
    { id: "disputes", title: "12. Dispute Handling, Liability & Contact" },
  ];

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Please read these terms carefully before using SpotQ for restaurant discovery, virtual waitlists, digital menus, and food ordering."
      lastUpdated="October 9, 2026"
    >
      <div className="space-y-4">
        <p>
          Welcome to SpotQ. These Terms and Conditions (&quot;Terms&quot;) govern your access to and
          use of the SpotQ website, mobile interfaces, and digital dining services.
        </p>

        <p>
          By creating an account, browsing dining options, joining a restaurant queue, or placing a
          food order through SpotQ, you agree to be bound by these Terms and our Privacy Policy. If
          you do not agree with any portion of these terms, please discontinue using our platform.
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
                className="hover:text-spotq-orange transition-colors flex items-center gap-1.5"
              >
                <span className="text-neutral-400">•</span>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="about" className="mt-12 scroll-mt-24">
        <h2>1. About SpotQ</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ is a hospitality technology platform connecting dining guests with participating
            restaurants. Our platform provides digital tools for restaurant discovery, virtual queue
            and waitlist management, QR-code table ordering, and electronic payment facilitation.
          </p>
          <p>
            SpotQ is an independent technology intermediary. Unless expressly stated otherwise,
            SpotQ does not own, operate, prepare food, or employ the staff at participating dining
            establishments. Independent restaurant partners remain solely responsible for food
            preparation, menu pricing, physical seating, and onsite service delivery.
          </p>
        </div>
      </section>

      <section id="account" className="mt-12 scroll-mt-24">
        <h2>2. Account Usage &amp; Responsibilities</h2>
        <div className="mt-4 space-y-4">
          <p>
            To access certain features such as queue tracking and order history, you may be required
            to register an account. When creating your account, you agree to provide truthful,
            accurate, and complete information, including a valid phone number and email address.
          </p>
          <p>
            You are responsible for safeguarding your login credentials and OTP verification codes.
            You agree not to create accounts under false names, impersonate other diners, or
            transfer your account to third parties.
          </p>
        </div>
      </section>

      <section id="waitlist" className="mt-12 scroll-mt-24">
        <h2>3. Virtual Waitlist &amp; Queuing Rules</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ provides estimated queue positions and wait times based on historical dining
            metrics and live table turnaround. Estimated wait times (ETA) are algorithmic
            predictions and may fluctuate due to kitchen volume, dining party pace, and onsite
            restaurant operations.
          </p>
          <p>When participating in a virtual queue, you agree to the following policies:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Accurate Party Sizes:</strong> You must state your exact party size upon
              joining. Adding guests onsite may result in queue reassignment.
            </li>
            <li>
              <strong>Grace Period &amp; Seating Calls:</strong> When your table is ready, a
              notification will be sent via SMS, push notification, or in-app alert. You must
              present yourself to the host stand within the designated grace period (typically 5 to
              10 minutes).
            </li>
            <li>
              <strong>No-Shows &amp; Cancellations:</strong> Failure to respond within the grace
              period may result in ticket cancellation. Repeated no-shows may limit your ability to
              join active queues.
            </li>
          </ul>
        </div>
      </section>

      <section id="ordering" className="mt-12 scroll-mt-24">
        <h2>4. Food Ordering &amp; Fulfillment</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ enables guests to place pre-orders while waiting in queue, scan table QR codes for
            self-service dine-in ordering, or place takeaway orders.
          </p>
          <p>
            Submitting an order constitutes an offer to purchase the specified menu items. The order
            is finalized once accepted by the restaurant&apos;s kitchen. While restaurants aim to
            maintain accurate live inventory, menu items, variants, and add-ons remain subject to
            kitchen availability.
          </p>
          <p>
            Special dietary notes and cooking instructions submitted with an order are passed
            directly to the restaurant kitchen. However, SpotQ cannot guarantee fulfillment of
            customized preparation requests.
          </p>
        </div>
      </section>

      <section id="payments" className="mt-12 scroll-mt-24">
        <h2>5. Pricing, Billing &amp; Payments</h2>
        <div className="mt-4 space-y-4">
          <p>
            All prices displayed on digital menus are determined directly by the respective
            restaurant partner. Total checkout bills clearly itemize:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Itemized food and beverage costs (including variants and customizations)</li>
            <li>Applicable government taxes (such as GST and local hospitality levies)</li>
            <li>
              Platform convenience fees or restaurant service fees, where clearly disclosed prior to
              payment
            </li>
          </ul>
          <p>
            Online transactions are securely handled via authorized PCI-DSS compliant payment
            gateways (such as Razorpay). Where supported by the restaurant, offline options such as
            Pay at Counter or Cash on Delivery may be selected at checkout. Digital tax invoices and
            itemized receipts are issued electronically for all completed transactions.
          </p>
        </div>
      </section>

      <section id="cancellations" className="mt-12 scroll-mt-24">
        <h2>6. Cancellations &amp; Order Modifications</h2>
        <div className="mt-4 space-y-4">
          <p>
            Given the perishable and immediate nature of prepared food, orders may only be canceled
            by the guest prior to the kitchen accepting or initiating preparation (the
            &quot;Placed&quot; state). Once an order enters the &quot;Confirmed&quot; or
            &quot;Preparing&quot; stage, cancellations and ingredient modifications are no longer
            permissible.
          </p>
          <p>
            If a restaurant is unable to fulfill an order due to out-of-stock items, closing hours,
            or kitchen overcapacity, the restaurant will cancel the affected items and initiate an
            immediate payment reversal.
          </p>
        </div>
      </section>

      <section id="refunds" className="mt-12 scroll-mt-24">
        <h2>7. Refunds &amp; Failed Transactions</h2>
        <div className="mt-4 space-y-4">
          <p>
            Refunds are processed strictly back to the original source payment method used during
            checkout under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Order cancellation approved prior to preparation</li>
            <li>Order cancellation initiated by the restaurant or platform</li>
            <li>
              Payment gateway deductions where order confirmation failed due to network interruption
            </li>
          </ul>
          <p>
            Approved refunds for online payments are dispatched to payment networks within 24 to 48
            hours and typically reflect in your bank account or card statement within 5 to 7
            business days, depending on your banking provider.
          </p>
        </div>
      </section>

      <section id="responsibilities" className="mt-12 scroll-mt-24">
        <h2>8. Restaurant vs. Platform Responsibilities</h2>
        <div className="mt-4 space-y-4">
          <p>
            To ensure complete transparency regarding your dining experience, roles are demarcated
            as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Restaurant Responsibilities:</strong> The restaurant partner is solely
              accountable for food hygiene, quality, preparation, allergen warnings, ingredient
              freshness, physical seating, and onsite staff conduct. Diners with severe allergies
              must inform restaurant staff directly upon arrival.
            </li>
            <li>
              <strong>SpotQ Platform Responsibilities:</strong> SpotQ is responsible for providing
              secure, functional software for digital menus, queue updates, notifications, and
              accurate payment processing.
            </li>
          </ul>
        </div>
      </section>

      <section id="prohibited" className="mt-12 scroll-mt-24">
        <h2>9. Prohibited Conduct &amp; Platform Misuse</h2>
        <div className="mt-4 space-y-4">
          <p>When using SpotQ, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Place fraudulent or mock orders with no intention of consuming or paying for them
            </li>
            <li>
              Join multiple concurrent queues across separate restaurants without intention to dine
            </li>
            <li>
              Harass, abuse, or mistreat restaurant staff, delivery personnel, or other diners
            </li>
            <li>
              Use automated scripts, bots, scrapers, or exploits to manipulate queue positions or
              platform data
            </li>
            <li>Attempt unauthorized access to other guest accounts or backend systems</li>
          </ul>
        </div>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-24">
        <h2>10. Privacy &amp; Data Protection</h2>
        <div className="mt-4 space-y-4">
          <p>
            Your privacy is of utmost importance to us. Information collected through SpotQ—such as
            your name, phone number, order details, and queue timestamps—is processed strictly to
            deliver restaurant waitlist and ordering services.
          </p>
          <p>
            For complete details regarding how your personal information is stored, protected, and
            processed, please review our full{" "}
            <a href="/privacy" className="font-semibold text-spotq-orange">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>

      <section id="termination" className="mt-12 scroll-mt-24">
        <h2>11. Account Suspension &amp; Termination</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ reserves the right to suspend, terminate, or limit platform access for accounts
            that violate these Terms, engage in payment fraud, repeatedly fail to honor queue calls
            without cancellation, or demonstrate abusive behavior toward restaurant teams.
          </p>
          <p>
            You may stop using SpotQ at any time. If you wish to permanently delete your account and
            associated data records, please contact our support desk.
          </p>
        </div>
      </section>

      <section id="disputes" className="mt-12 scroll-mt-24">
        <h2>12. Dispute Handling, Liability &amp; Contact</h2>
        <div className="mt-4 space-y-4">
          <p>
            To the maximum extent permitted by applicable law, SpotQ shall not be liable for
            indirect, incidental, or consequential damages arising from restaurant food quality,
            physical dining disputes, or temporary network downtime.
          </p>
          <p>
            If you encounter an issue with an order, billing charge, or queue experience, our
            customer care team is available to assist:
          </p>
          <p>
            <strong>Support Email:</strong>{" "}
            <a
              href="mailto:spotqofficial@gmail.com"
              className="font-semibold text-spotq-orange transition-colors hover:text-spotq-orange/80"
            >
              spotqofficial@gmail.com
            </a>
          </p>
          <p className="text-xs text-neutral-500">
            Governing Law: These terms shall be governed by and construed in accordance with the
            laws of India.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
