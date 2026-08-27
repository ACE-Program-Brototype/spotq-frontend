import LegalPageLayout from "@/layouts/LegalLayout";

const TermsAndConditionsPage = () => {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Please read these terms carefully before using SpotQ and its restaurant discovery and waitlist services."
      lastUpdated="August 24, 2026"
    >
      {/* Introduction */}
      <div className="space-y-4">
        <p>
          Welcome to SpotQ. These Terms and Conditions govern your access to and use of the SpotQ
          website, applications, and related services.
        </p>

        <p>
          By creating an account, accessing our services, or using SpotQ, you agree to be bound by
          these Terms and Conditions. If you do not agree with these terms, please do not use our
          services.
        </p>
      </div>

      {/* 1. About SpotQ */}
      <section className="mt-12">
        <h2>1. About SpotQ</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ is a restaurant discovery and waitlist management platform that helps customers
            discover restaurants and manage their place in participating restaurant queues.
          </p>

          <p>
            SpotQ does not own or operate the restaurants listed on the platform unless expressly
            stated otherwise. Restaurants are responsible for their own menus, prices, availability,
            seating arrangements, policies, and services.
          </p>
        </div>
      </section>

      {/* 2. Eligibility */}
      <section className="mt-12">
        <h2>2. Eligibility</h2>

        <div className="mt-4 space-y-4">
          <p>
            You must provide accurate information when creating and maintaining your SpotQ account.
            You are responsible for keeping your account information current and for maintaining the
            confidentiality of your login credentials.
          </p>

          <p>
            You agree not to create an account using false information or to impersonate another
            person or entity.
          </p>
        </div>
      </section>

      {/* 3. Using SpotQ */}
      <section className="mt-12">
        <h2>3. Using SpotQ</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ allows users to browse participating restaurants and, where supported, join
            restaurant waitlists or queues.
          </p>

          <p>
            Joining a waitlist does not necessarily guarantee immediate seating. Actual wait times
            and seating availability may change based on restaurant capacity, customer
            cancellations, operational conditions, and other factors.
          </p>
        </div>
      </section>

      {/* 4. Restaurant Availability */}
      <section className="mt-12">
        <h2>4. Restaurant Availability</h2>

        <div className="mt-4 space-y-4">
          <p>
            Restaurant information displayed through SpotQ may change without notice. While we aim
            to provide useful and current information, SpotQ does not guarantee that restaurant
            information, wait times, menus, prices, opening hours, or availability will always be
            accurate or complete.
          </p>

          <p>
            Final decisions regarding seating, table assignment, restaurant policies, and service
            remain with the restaurant.
          </p>
        </div>
      </section>

      {/* 5. User Responsibilities */}
      <section className="mt-12">
        <h2>5. User Responsibilities</h2>

        <p className="mt-4">When using SpotQ, you agree to:</p>

        <ul className="mt-4 space-y-3">
          <li>Provide accurate and truthful account information.</li>
          <li>Use the service only for lawful purposes.</li>
          <li>Not misuse or interfere with the SpotQ platform.</li>
          <li>Not attempt to gain unauthorized access to another user's account.</li>
          <li>Not use automated systems to abuse or overload the service.</li>
          <li>Respect restaurant staff, policies, and other customers.</li>
        </ul>
      </section>

      {/* 6. Account Suspension or Termination */}
      <section className="mt-12">
        <h2>6. Account Suspension or Termination</h2>

        <div className="mt-4 space-y-4">
          <p>
            We may suspend or terminate an account if we reasonably believe that the account has
            violated these Terms, applicable laws, or our platform policies.
          </p>

          <p>
            You may stop using SpotQ at any time. If you wish to request account deletion, please
            contact our support team.
          </p>
        </div>
      </section>

      {/* 7. Intellectual Property */}
      <section className="mt-12">
        <h2>7. Intellectual Property</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ and its associated branding, designs, logos, software, text, graphics, and other
            content are owned by or licensed to SpotQ and are protected by applicable intellectual
            property laws.
          </p>

          <p>
            You may not reproduce, distribute, modify, reverse engineer, or commercially exploit
            SpotQ content without appropriate authorization.
          </p>
        </div>
      </section>

      {/* 8. Third-Party Services */}
      <section className="mt-12">
        <h2>8. Third-Party Services</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ may integrate with or provide links to third-party services, restaurants, payment
            providers, mapping services, app stores, or other platforms.
          </p>

          <p>
            Third-party services are subject to their own terms and privacy policies. SpotQ is not
            responsible for the policies or practices of third parties.
          </p>
        </div>
      </section>

      {/* 9. Disclaimer */}
      <section className="mt-12">
        <h2>9. Disclaimer</h2>

        <div className="mt-4 space-y-4">
          <p>
            SpotQ is provided on an "as available" basis. To the extent permitted by applicable law,
            we do not guarantee that the service will always be uninterrupted, error-free, secure,
            or available at all times.
          </p>

          <p>
            We also do not guarantee that using SpotQ will result in a particular restaurant, table,
            seating time, or dining experience.
          </p>
        </div>
      </section>

      {/* 10. Limitation of Liability */}
      <section className="mt-12">
        <h2>10. Limitation of Liability</h2>

        <div className="mt-4 space-y-4">
          <p>
            To the maximum extent permitted by applicable law, SpotQ will not be responsible for
            indirect, incidental, special, consequential, or punitive damages arising from your use
            of the platform or services provided by participating restaurants.
          </p>
        </div>
      </section>

      {/* 11. Changes to These Terms */}
      <section className="mt-12">
        <h2>11. Changes to These Terms</h2>

        <div className="mt-4 space-y-4">
          <p>
            We may update these Terms and Conditions from time to time. Updated terms will be
            published on this page with a revised "Last updated" date.
          </p>

          <p>
            Your continued use of SpotQ after changes become effective constitutes your acceptance
            of the updated terms.
          </p>
        </div>
      </section>

      {/* 12. Contact Us */}
      <section className="mt-12">
        <h2>12. Contact Us</h2>

        <div className="mt-4 space-y-4">
          <p>
            If you have questions about these Terms and Conditions, please contact us at{" "}
            <a
              href="spotqofficial@gmail.com"
              className="font-semibold text-spotq-orange transition-colors hover:text-spotq-orange/80"
            >
              spotqofficial@gmail.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <div className="mt-14 rounded-xl border border-spotq-orange/20 bg-spotq-orange/5 p-5 sm:p-6">
        <p className="!m-0 text-sm !leading-6 !text-gray-600">
          <strong className="text-gray-800">Important:</strong> This page is a product-ready
          legal-page template. Before publishing, replace any placeholder business, jurisdiction,
          contact, payment, and liability details with the legally approved terms for your company.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default TermsAndConditionsPage;
