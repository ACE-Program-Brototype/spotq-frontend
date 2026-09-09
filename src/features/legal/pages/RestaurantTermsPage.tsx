import LegalPageLayout from "@/layouts/LegalLayout";

export default function RestaurantTermsPage() {
  return (
    <LegalPageLayout
      title="Restaurant Partner Terms & Conditions"
      description="Please read these terms carefully before registering and operating your restaurant on the SpotQ platform."
      lastUpdated="August 30, 2026"
      variant="restaurant"
      backTo="/restaurant/email/verification"
      backLabel="Back to Restaurant Portal"
    >
      <div className="space-y-4">
        <p>
          Welcome to SpotQ's Restaurant Partner Program. These Terms &amp; Conditions ("Partner
          Terms") govern the relationship between SpotQ ("Platform", "we", "us") and your restaurant
          entity ("Restaurant Partner", "you", "your") regarding your enrollment, waitlist
          management, table queue operations, and presence on SpotQ.
        </p>

        <p>
          By completing the registration process, verifying your restaurant email, or accessing the
          SpotQ Partner Dashboard, you agree to comply with and be bound by these Partner Terms.
        </p>
      </div>

      <section className="mt-12">
        <h2>1. Restaurant Partner Registration</h2>
        <div className="mt-4 space-y-4">
          <p>
            To partner with SpotQ, you must provide valid business details, an official restaurant
            email, and complete the OTP verification and onboarding process. You confirm that you
            are an authorized representative of the restaurant with full legal authority to agree to
            these terms.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities conducted under your restaurant account.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>2. Queue &amp; Waitlist Management Obligations</h2>
        <div className="mt-4 space-y-4">
          <p>
            As a Restaurant Partner using SpotQ's real-time queue management tools, you agree to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Keep estimated wait times and queue statuses reasonably accurate and updated.</li>
            <li>Honor table calls and notifications issued to dining customers via SpotQ.</li>
            <li>Maintain clear and fair seating policies for customers joining through SpotQ.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2>3. Restaurant Information &amp; Branding</h2>
        <div className="mt-4 space-y-4">
          <p>
            You grant SpotQ a non-exclusive, royalty-free license to display your restaurant name,
            logo, address, operating hours, photos, and menu items across our applications and
            marketing channels.
          </p>
          <p>
            You guarantee that all content, imagery, and menu data provided to SpotQ do not infringe
            upon any third-party intellectual property or privacy rights.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>4. Data Privacy &amp; Customer Information</h2>
        <div className="mt-4 space-y-4">
          <p>
            Customer information shared through SpotQ (such as customer names, phone numbers, and
            party sizes) is strictly for managing active waitlists and table reservations.
          </p>
          <p>
            You agree not to use, export, or disclose customer personal data for unsolicited
            marketing or any purpose outside fulfilling the dining experience on SpotQ, in
            compliance with applicable data privacy laws.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>5. Service Availability &amp; Platform Modifications</h2>
        <div className="mt-4 space-y-4">
          <p>
            We strive to provide uninterrupted service, but SpotQ does not guarantee that partner
            services will be entirely error-free or uninterrupted. We reserve the right to modify,
            update, or temporarily suspend services for maintenance or platform enhancements.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>6. Termination &amp; Account Suspension</h2>
        <div className="mt-4 space-y-4">
          <p>
            Either party may terminate the restaurant partnership at any time upon notice. SpotQ
            reserves the right to suspend or terminate restaurant accounts that violate these terms,
            engage in fraudulent activities, or misrepresent queue data to customers.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>7. Contact &amp; Support</h2>
        <div className="mt-4 space-y-4">
          <p>
            If you have any questions or require assistance regarding your restaurant partner
            account or these terms, please reach out to our partner support team at{" "}
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
