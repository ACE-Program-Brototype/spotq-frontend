import LegalPageLayout from "@/layouts/LegalLayout";

export default function RestaurantPrivacyPage() {
  return (
    <LegalPageLayout
      title="Restaurant Partner Privacy Policy"
      description="This policy outlines how SpotQ handles business, staff, operational, and customer dining data on behalf of our restaurant partners."
      lastUpdated="September 9, 2026"
      variant="restaurant"
      backTo="/restaurant/email/verification"
      backLabel="Back to Restaurant Portal"
    >
      <div className="space-y-4">
        <p>
          At SpotQ ("Platform", "we", "us"), we are committed to safeguarding the privacy and
          security of our Restaurant Partners ("you", "your") and the customers you serve. This
          Restaurant Partner Privacy Policy details how we collect, process, store, and protect
          information when you register and manage your restaurant on SpotQ.
        </p>

        <p>
          By accessing the SpotQ Partner Dashboard, onboarding your restaurant, or managing staff
          and queues, you acknowledge and agree to the data practices described in this policy.
        </p>
      </div>

      <section className="mt-12">
        <h2>1. Information We Collect from Restaurant Partners</h2>
        <div className="mt-4 space-y-4">
          <p>We collect information necessary to onboard and manage your restaurant entity:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Business &amp; Contact Details:</strong> Restaurant business name, official
              email address, contact numbers, physical location, opening hours, and table capacity.
            </li>
            <li>
              <strong>Owner &amp; Staff Information:</strong> Full name, verified email addresses,
              phone numbers, and assigned role/designation (e.g., Manager, Host, Kitchen Staff).
            </li>
            <li>
              <strong>Operational Data:</strong> Real-time waitlist numbers, estimated wait times,
              table assignments, seat status, and operational logs.
            </li>
            <li>
              <strong>Technical Logs:</strong> Device information, IP address, login timestamps, and
              portal audit records for security and accountability.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2>2. Processing Dining &amp; Customer Waitlist Data</h2>
        <div className="mt-4 space-y-4">
          <p>
            When dining customers join your restaurant queue or waitlist through SpotQ, we collect
            their party size, contact number, and name to facilitate queue management.
          </p>
          <p>
            In this context, SpotQ and the Restaurant Partner act as responsible data custodians:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Customer information must only be accessed to notify customers of table readiness,
              manage seating, and communicate queue status.
            </li>
            <li>
              Restaurant Partners must not export, resell, or distribute customer details for
              unsolicited direct marketing without explicit customer consent.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2>3. Staff Management &amp; Access Controls</h2>
        <div className="mt-4 space-y-4">
          <p>
            SpotQ allows restaurant administrators to invite staff members to collaborate on queue
            and table operations. Invitation tokens sent via email are single-use, time-limited (48
            hours), and cryptographically signed.
          </p>
          <p>
            Administrators have the capability and responsibility to revoke invitations or suspend
            staff access when staff members change roles or depart the establishment.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>4. Data Sharing &amp; Third-Party Service Providers</h2>
        <div className="mt-4 space-y-4">
          <p>We do not sell restaurant business data. We only share information with:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Infrastructure &amp; Cloud Hosts:</strong> Encrypted hosting and database
              providers ensuring high availability.
            </li>
            <li>
              <strong>Communication Providers:</strong> Email and SMS gateways for sending
              onboarding invites, OTPs, and customer waitlist updates.
            </li>
            <li>
              <strong>Regulatory &amp; Legal Authorities:</strong> Only when strictly required by
              enforceable legal orders or statutory obligations.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2>5. Security &amp; Data Protection</h2>
        <div className="mt-4 space-y-4">
          <p>
            We implement industry-standard encryption in transit (HTTPS/TLS) and at rest, role-based
            access control, secure JWT session management, and rate-limiting to protect your partner
            portal against unauthorized access or breaches.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>6. Data Retention &amp; Account Deletion</h2>
        <div className="mt-4 space-y-4">
          <p>
            Restaurant operational history and queue logs are retained to provide historical
            analytics. If you choose to close your SpotQ partner account, you may request permanent
            deletion of your restaurant data by emailing our support team.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>7. Contact &amp; Privacy Officer</h2>
        <div className="mt-4 space-y-4">
          <p>
            For privacy inquiries, data subject access requests, or questions regarding our partner
            data practices, please contact our Privacy Team at{" "}
            <a
              href="mailto:privacy@spotq.com"
              className="font-semibold text-orange-600 hover:underline"
            >
              privacy@spotq.com
            </a>{" "}
            or reach partner support at{" "}
            <a
              href="mailto:partners@spotq.com"
              className="font-semibold text-orange-600 hover:underline"
            >
              partners@spotq.com
            </a>
            .
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
