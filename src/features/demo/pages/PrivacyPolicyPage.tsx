import LegalPageLayout from "@/layouts/LegalLayout";

const PrivacyPolicyPage = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how SpotQ collects, uses, stores, and protects information when you use our services."
      lastUpdated="August 24, 2026"
    >
      {/* Introduction */}
      <div className="space-y-4">
        <p>
          At SpotQ, we respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains what information we may collect, why we collect
          it, and how we use it when you interact with SpotQ.
        </p>
      </div>

      {/* 1. Information We Collect */}
      <section className="mt-12">
        <h2>1. Information We Collect</h2>

        {/* Account Information */}
        <div className="mt-6">
          <h3>Account Information</h3>

          <p className="mt-3">
            When you create a SpotQ account, we may collect information such as your name, email
            address, phone number, and account credentials.
          </p>
        </div>

        {/* Restaurant and Waitlist Information */}
        <div className="mt-7">
          <h3>Restaurant and Waitlist Information</h3>

          <p className="mt-3">
            When you use SpotQ to discover restaurants or join a waitlist, we may collect
            information associated with your restaurant interactions, waitlist activity,
            preferences, and bookings or queue requests where applicable.
          </p>
        </div>

        {/* Device and Technical Information */}
        <div className="mt-7">
          <h3>Device and Technical Information</h3>

          <p className="mt-3">
            We may collect technical information such as browser type, device information, IP
            address, operating system, application version, approximate location, and usage
            information.
          </p>
        </div>

        {/* Support Information */}
        <div className="mt-7">
          <h3>Information You Provide to Support</h3>

          <p className="mt-3">
            If you contact our support team, we may collect the information you provide in your
            communication, including your email address and the details of your request.
          </p>
        </div>
      </section>

      {/* 2. How We Use Information */}
      <section className="mt-12">
        <h2>2. How We Use Information</h2>

        <p className="mt-4">We may use collected information to:</p>

        <ul className="mt-4 space-y-3">
          <li>Create and manage your SpotQ account.</li>
          <li>Provide restaurant discovery and waitlist functionality.</li>
          <li>Communicate with you about your account and activity.</li>
          <li>Provide customer support.</li>
          <li>Improve the SpotQ platform and user experience.</li>
          <li>Detect fraud, abuse, security issues, and unauthorized activity.</li>
          <li>Comply with applicable legal obligations.</li>
        </ul>
      </section>

      {/* 3. Location Information */}
      <section className="mt-12">
        <h2>3. Location Information</h2>

        <div className="mt-4 space-y-4">
          <p>
            Some SpotQ features may use location information to help you discover nearby restaurants
            or provide location-based functionality.
          </p>

          <p>
            Where required, we will request the appropriate permission before accessing precise
            device location information.
          </p>
        </div>
      </section>

      {/* 4. Cookies */}
      <section className="mt-12">
        <h2>4. Cookies and Similar Technologies</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ may use cookies, local storage, analytics technologies, and similar mechanisms to
            maintain sessions, remember preferences, understand usage, and improve our services.
          </p>

          <p>
            You may be able to control certain cookie settings through your browser or device
            settings.
          </p>
        </div>
      </section>

      {/* 5. Sharing Information */}
      <section className="mt-12">
        <h2>5. Sharing Information</h2>

        <div className="mt-4 space-y-4">
          <p>We do not sell your personal information as part of the normal operation of SpotQ.</p>

          <div>
            <p>We may share information with service providers that help us:</p>

            <ul className="mt-4 space-y-3">
              <li>Host and operate our infrastructure.</li>
              <li>Provide authentication services.</li>
              <li>Process payments where applicable.</li>
              <li>Provide analytics and monitoring.</li>
              <li>Deliver communications.</li>
              <li>Provide customer support.</li>
            </ul>
          </div>

          <p>
            We may also disclose information when required by law, legal process, governmental
            request, or when necessary to protect the rights, security, and safety of SpotQ, our
            users, or others.
          </p>
        </div>
      </section>

      {/* 6. Data Security */}
      <section className="mt-12">
        <h2>6. Data Security</h2>

        <div className="mt-4 space-y-4">
          <p>
            We use reasonable technical and organizational safeguards designed to protect personal
            information against unauthorized access, loss, misuse, alteration, or disclosure.
          </p>

          <p>However, no internet-based service can guarantee absolute security.</p>
        </div>
      </section>

      {/* 7. Data Retention */}
      <section className="mt-12">
        <h2>7. Data Retention</h2>

        <p className="mt-4">
          We retain personal information for as long as reasonably necessary to provide our
          services, maintain business records, resolve disputes, enforce agreements, and comply with
          legal obligations.
        </p>
      </section>

      {/* 8. Privacy Rights */}
      <section className="mt-12">
        <h2>8. Your Privacy Rights</h2>

        <div className="mt-4 space-y-4">
          <p>
            Depending on your location and applicable law, you may have rights relating to your
            personal information, including the right to request access, correction, deletion,
            restriction, or a copy of certain information.
          </p>

          <p>To make a privacy-related request, contact us using the information provided below.</p>
        </div>
      </section>

      {/* 9. Children's Privacy */}
      <section className="mt-12">
        <h2>9. Children's Privacy</h2>

        <p className="mt-4">
          SpotQ is not intended to be used by children who are not legally permitted to use the
          service in their jurisdiction. We do not knowingly collect personal information from
          children in violation of applicable law.
        </p>
      </section>

      {/* 10. Third-Party Services */}
      <section className="mt-12">
        <h2>10. Third-Party Services</h2>

        <p className="mt-4">
          SpotQ may use third-party services for authentication, analytics, hosting, payments,
          communications, maps, or other functionality. Those services may process information
          according to their own privacy policies.
        </p>
      </section>

      {/* 11. Changes to Privacy Policy */}
      <section className="mt-12">
        <h2>11. Changes to This Privacy Policy</h2>

        <div className="mt-4 space-y-4">
          <p>
            We may update this Privacy Policy periodically to reflect changes to our services,
            technology, or legal requirements.
          </p>

          <p>
            When we make changes, we will update the "Last updated" date shown at the top of this
            page.
          </p>
        </div>
      </section>

      {/* 12. Contact Us */}
      <section className="mt-12">
        <h2>12. Contact Us</h2>

        <p className="mt-4">
          If you have questions, concerns, or requests regarding this Privacy Policy, please contact
          us at{" "}
          <a
            href="spotqofficial@gmail.com"
            className="font-semibold text-spotq-orange transition-colors hover:text-spotq-orange/80"
          >
            spotqofficial@gmail.com
          </a>
          .
        </p>
      </section>

      {/* Important Notice */}
      <div className="mt-14 rounded-xl border border-spotq-orange/20 bg-spotq-orange/5 p-5 sm:p-6">
        <p className="!m-0 text-sm !leading-6 !text-gray-600">
          <strong className="text-gray-800">Important:</strong> This Privacy Policy is a
          product-ready template and should be reviewed by your legal/privacy team before production
          use. Add your actual legal entity name, jurisdiction, data-controller information,
          retention periods, vendors, and applicable regional privacy rights.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
