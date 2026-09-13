import LegalPageLayout from "@/layouts/LegalLayout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie & Tracking Policy"
      description="Learn how SpotQ uses cookies and similar storage technologies to provide a secure and seamless queue and restaurant discovery experience."
      lastUpdated="September 9, 2026"
    >
      <div className="space-y-4">
        <p>
          This Cookie Policy explains how SpotQ ("we", "us", "our") uses cookies, local storage,
          session storage, and similar technologies when you visit our website, mobile web
          applications, or partner portals.
        </p>
        <p>
          By continuing to use SpotQ, you agree to the use of cookies and tracking technologies as
          described in this policy.
        </p>
      </div>

      <section className="mt-12">
        <h2>1. What Are Cookies and Local Storage?</h2>
        <div className="mt-4 space-y-4">
          <p>
            Cookies are small text files placed on your device by your web browser. Local storage
            and session storage are browser features that allow websites to store information
            directly on your device securely.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>2. Categories of Cookies We Use</h2>
        <div className="mt-4 space-y-4">
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong>Strictly Necessary Cookies &amp; Storage:</strong> Essential for
              authentication, maintaining your login session, securing token refreshes, and keeping
              track of active waitlist statuses. You cannot opt out of these essential mechanisms as
              the platform cannot function without them.
            </li>
            <li>
              <strong>Preference &amp; Functional Cookies:</strong> Used to remember your selected
              theme, language, restaurant search filters, and table preference settings.
            </li>
            <li>
              <strong>Analytics &amp; Performance Technologies:</strong> Help us understand platform
              usage patterns, queue response times, page latency, and user journeys so we can
              improve speed and reliability.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2>3. Managing Cookie Preferences</h2>
        <div className="mt-4 space-y-4">
          <p>
            Most web browsers allow you to control and manage cookies through their settings. You
            can choose to block or delete cookies. However, please note that disabling strictly
            necessary storage may prevent you from logging in or tracking your restaurant queue
            position in real time.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>4. Updates to This Policy</h2>
        <div className="mt-4 space-y-4">
          <p>
            We may update our Cookie Policy periodically to reflect technological, operational, or
            regulatory changes. Any modifications will be posted here with an updated "Last updated"
            date.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2>5. Contact Us</h2>
        <div className="mt-4 space-y-4">
          <p>
            If you have questions about our use of cookies or tracking technologies, please contact
            us at{" "}
            <a
              href="mailto:privacy@spotq.com"
              className="font-semibold text-spotq-orange transition-colors hover:text-spotq-orange/80"
            >
              privacy@spotq.com
            </a>
            .
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
