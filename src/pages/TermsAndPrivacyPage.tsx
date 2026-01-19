import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * TermsAndPrivacyPage
 * Renders either Terms of Service or Privacy Policy depending on the current route.
 * - /terms    -> Terms of Service
 * - /privacy  -> Privacy Policy
 *
 * NOTE: This content is provided for general informational purposes and is not legal advice.
 * Have your counsel review before publishing.
 */

const SectionHeading: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => (
  <h3
    id={id}
    className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3 scroll-mt-24"
  >
    {children}
  </h3>
);

const Paragraph: React.FC<React.PropsWithChildren> = ({ children }) => (
  <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
    {children}
  </p>
);

const List: React.FC<React.PropsWithChildren<{ ordered?: boolean }>> = ({
  children,
  ordered,
}) =>
  ordered ? (
    <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200">
      {children}
    </ol>
  ) : (
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-200">
      {children}
    </ul>
  );

const Terms: React.FC = () => {
  const lastUpdated = "August 17, 2025";
  return (
    <article className="prose prose-emerald max-w-none dark:prose-invert">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Last Updated: {lastUpdated}
      </p>

      <SectionHeading id="acceptance">1) Acceptance of Terms</SectionHeading>
      <Paragraph>
        These Terms of Service (“Terms”) govern your access to and use of our
        websites, mobile experiences, telehealth services, and e-commerce
        offerings (collectively, the “Services”). By accessing or using the
        Services, you agree to these Terms and our{" "}
        <Link
          to="/privacy"
          className="underline decoration-emerald-500 hover:text-emerald-700"
        >
          Privacy Policy
        </Link>
        .
      </Paragraph>

      <SectionHeading id="eligibility">2) Eligibility; Account</SectionHeading>
      <List>
        <li>
          You must be at least 18 years old to create an account or purchase
          products.
        </li>
        <li>The Services are intended for use in the United States only.</li>
        <li>
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activity under your account.
        </li>
      </List>

      <SectionHeading id="no-medical-advice">
        3) No Emergency Care; Not a Substitute for In-Person Care
      </SectionHeading>
      <Paragraph>
        The Services are not appropriate for emergencies. If you are
        experiencing a medical emergency, call 911 immediately. Information on
        our website is provided for educational purposes and does not constitute
        medical advice. Any diagnosis, treatment plan, or prescription is
        provided by an independent, U.S.-licensed clinician in their
        professional judgment after reviewing your information.
      </Paragraph>

      <SectionHeading id="telehealth">4) Telehealth Consent</SectionHeading>
      <List>
        <li>
          By using any remote clinical services, you consent to receive
          telehealth care, which may include audio/video communications,
          asynchronous evaluations (e.g., photos, forms), and electronic
          prescriptions where permitted.
        </li>
        <li>
          Telehealth has limitations and may not be a complete substitute for
          in-person examinations. Availability varies by state.
        </li>
      </List>

      <SectionHeading id="prescriptions">
        5) Prescriptions; Compounded &amp; Over-the-Counter Products
      </SectionHeading>
      <List>
        <li>
          Prescription products require an evaluation and prescription from a
          U.S.-licensed clinician. Prescriptions are fulfilled by partner
          pharmacies. Availability is subject to state law.
        </li>
        <li>
          Follow all label instructions and clinician guidance. Discontinue use
          and seek medical attention if you experience adverse reactions.
        </li>
        <li>
          By law, pharmacies generally cannot accept returns of prescription
          medications. Non-Rx products may be returnable under our store policy
          below.
        </li>
      </List>

      <SectionHeading id="ordering-billing">
        6) Ordering, Billing, Subscriptions &amp; Shipping
      </SectionHeading>
      <List>
        <li>
          <strong>Pricing &amp; Taxes:</strong> Prices are shown in U.S. dollars
          and may change without notice. Applicable taxes and shipping are
          calculated at checkout.
        </li>
        <li>
          <strong>Payment:</strong> You authorize us and our payment processor
          to charge your selected payment method for your purchases. We do not
          store full credit card numbers.
        </li>
        <li>
          <strong>Subscriptions:</strong> If you enroll in auto-refill or
          subscription plans, you agree to recurring charges until you cancel.
          You can cancel at any time before the next renewal to avoid further
          charges (see your account settings).
        </li>
        <li>
          <strong>Shipping:</strong> Risk of loss passes to you upon delivery by
          the carrier to your address. Delivery timelines are estimates.
        </li>
        <li>
          <strong>Returns:</strong> Prescription medications are not returnable
          (except as required by law). For unopened, non-prescription items, you
          may request a return within 30 days of delivery. Contact support for
          an RMA and instructions.
        </li>
      </List>

      <SectionHeading id="prohibited">7) Prohibited Activities</SectionHeading>
      <Paragraph>
        You agree not to misuse the Services, including by attempting
        unauthorized access, scraping without permission, uploading harmful
        code, interfering with operations, or violating any applicable laws.
      </Paragraph>

      <SectionHeading id="ip">8) Intellectual Property</SectionHeading>
      <Paragraph>
        We and our licensors own the Services and all related content,
        trademarks, and other intellectual property. You may not copy, modify,
        or distribute our materials except as expressly permitted.
      </Paragraph>

      <SectionHeading id="user-content">
        9) Reviews &amp; User Content
      </SectionHeading>
      <Paragraph>
        If you submit reviews, photos, or other content, you grant us a
        non-exclusive, worldwide, royalty-free license to use, reproduce,
        display, and distribute that content in connection with the Services and
        our marketing, subject to applicable law.
      </Paragraph>

      <SectionHeading id="third-parties">
        10) Third-Party Services
      </SectionHeading>
      <Paragraph>
        The Services may link to third-party sites or use third-party tools
        (e.g., analytics, customer support). We are not responsible for
        third-party content or practices.
      </Paragraph>

      <SectionHeading id="disclaimer">11) Disclaimers</SectionHeading>
      <Paragraph>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICES AND PRODUCTS ARE
        PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND,
        EXPRESS OR IMPLIED.
      </Paragraph>

      <SectionHeading id="limitation">
        12) Limitation of Liability
      </SectionHeading>
      <Paragraph>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
        DAMAGES, OR ANY LOSS OF PROFITS OR DATA.
      </Paragraph>

      <SectionHeading id="indemnity">13) Indemnification</SectionHeading>
      <Paragraph>
        You agree to defend, indemnify, and hold us harmless from claims arising
        out of your use of the Services or violation of these Terms.
      </Paragraph>

      <SectionHeading id="disputes">
        14) Governing Law; Arbitration; Class Waiver
      </SectionHeading>
      <List>
        <li>
          <strong>Governing Law:</strong> These Terms are governed by the laws
          of the State of New York, without regard to conflict-of-law rules.
        </li>
        <li>
          <strong>Arbitration:</strong> Any dispute will be resolved by binding
          arbitration on an individual basis under the rules of the American
          Arbitration Association. You and we waive the right to a jury trial.
        </li>
        <li>
          <strong>Class Action Waiver:</strong> You may bring claims only in
          your individual capacity, not as a plaintiff or class member in any
          class or representative proceeding.
        </li>
        <li>
          This section does not prevent you from bringing a claim in
          small-claims court where permitted.
        </li>
      </List>

      <SectionHeading id="termination">15) Termination</SectionHeading>
      <Paragraph>
        We may suspend or terminate access to the Services at any time for any
        reason, including a violation of these Terms.
      </Paragraph>

      <SectionHeading id="changes">16) Changes to These Terms</SectionHeading>
      <Paragraph>
        We may update these Terms from time to time. The “Last Updated” date
        will reflect the most recent changes. Continued use of the Services
        constitutes acceptance.
      </Paragraph>

      <SectionHeading id="contact">17) Contact Us</SectionHeading>
      <Paragraph>
        Fusion Apothecary — 7620 5th Ave., Brooklyn, NY 11209 •{" "}
        <a
          href="mailto:info@fusionrxny.com"
          className="underline decoration-emerald-500"
        >
          info@fusionrxny.com
        </a>{" "}
        •{" "}
        <a href="tel:+19297211050" className="underline decoration-emerald-500">
          +1 (929) 721-1050
        </a>
      </Paragraph>
    </article>
  );
};

const Privacy: React.FC = () => {
  const lastUpdated = "August 17, 2025";
  return (
    <article className="prose prose-emerald max-w-none dark:prose-invert">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Last Updated: {lastUpdated}
      </p>

      <SectionHeading id="scope">1) Scope &amp; Who We Are</SectionHeading>
      <Paragraph>
        This Privacy Policy explains how we collect, use, disclose, and protect
        information in connection with our websites, e-commerce, and customer
        support. It also describes choices and rights you may have under U.S.
        law. This Policy does not replace any HIPAA Notice of Privacy Practices
        (“NPP”). Where our clinicians or partner pharmacies handle your
        information as Protected Health Information (“PHI”), the NPP controls.
        For all other data described here, this Privacy Policy applies.
      </Paragraph>

      <SectionHeading id="data-we-collect">
        2) Information We Collect
      </SectionHeading>
      <List>
        <li>
          <strong>Account &amp; Contact Data:</strong> name, email, phone,
          shipping/billing addresses.
        </li>
        <li>
          <strong>Order &amp; Payment Data:</strong> items purchased,
          subscription status, and limited payment details processed by
          PCI-compliant providers (we do not store full card numbers).
        </li>
        <li>
          <strong>Health &amp; Consultation Data:</strong> forms, photos,
          symptoms, history, and messages you share for clinical review.
          Portions of this may be PHI governed by HIPAA and an applicable NPP.
        </li>
        <li>
          <strong>Device, Usage &amp; Cookies:</strong> IP address,
          device/browser type, pages viewed, timestamps, and cookie identifiers
          used for essential site functions, analytics, and (if enabled)
          advertising/retargeting.
        </li>
        <li>
          <strong>Communications:</strong> emails, SMS consent/preferences, and
          customer support interactions (e.g., live chat).
        </li>
      </List>

      <SectionHeading id="how-we-use">3) How We Use Information</SectionHeading>
      <List>
        <li>
          Provide, maintain, and improve the Services and your account
          experience.
        </li>
        <li>
          Facilitate telehealth evaluations, fulfill prescriptions, and ship
          products.
        </li>
        <li>
          Process payments, detect/prevent fraud, and secure our Services.
        </li>
        <li>
          Personalize content and recommendations; run analytics and performance
          measurement.
        </li>
        <li>
          Send transactional messages; send marketing communications with your
          consent where required.
        </li>
        <li>Comply with legal obligations and enforce our Terms.</li>
      </List>

      <SectionHeading id="sharing">4) How We Share Information</SectionHeading>
      <List>
        <li>
          <strong>Clinical &amp; Pharmacy Partners:</strong> to evaluate,
          prescribe, compound/dispense, and deliver products in accordance with
          law.
        </li>
        <li>
          <strong>Service Providers:</strong> payment processors,
          shipping/courier, customer support (e.g., chat), cloud hosting,
          analytics, and security vendors.
        </li>
        <li>
          <strong>Advertising &amp; Analytics Partners:</strong> where permitted
          and only for non-PHI website/app data; you may opt out (see “Your
          Choices”).
        </li>
        <li>
          <strong>Legal &amp; Safety:</strong> to comply with law, respond to
          lawful requests, or protect rights, property, and safety.
        </li>
        <li>
          <strong>Business Transfers:</strong> in connection with a merger,
          acquisition, or asset sale.
        </li>
      </List>

      <SectionHeading id="hipaa">5) HIPAA &amp; PHI</SectionHeading>
      <Paragraph>
        If and to the extent we act as a covered entity or business associate
        under HIPAA, PHI will be used and disclosed in accordance with the
        applicable Notice of Privacy Practices. Marketing/ads partners will not
        receive PHI. If there is a conflict between this Policy and the NPP for
        PHI, the NPP governs.
      </Paragraph>

      <SectionHeading id="choices">6) Your Choices</SectionHeading>
      <List>
        <li>
          <strong>Marketing Opt-Out:</strong> You can unsubscribe using the link
          in our emails. For SMS, reply STOP to opt out.
        </li>
        <li>
          <strong>Cookies:</strong> Manage preferences via our cookie banner or
          your browser settings. You may also use platform tools such as{" "}
          <em>AboutAds</em> or device ad settings to limit targeted ads.
        </li>
        <li>
          <strong>Do Not Sell/Share (CA):</strong> California residents can opt
          out of “sale”/“sharing” of personal information and limit use of
          sensitive personal information, where applicable.
        </li>
      </List>

      <SectionHeading id="rights">7) U.S. State Privacy Rights</SectionHeading>
      <Paragraph>
        Depending on your state (e.g., CA, CO, CT, VA, UT), you may have rights
        to access, correct, delete, or receive a portable copy of personal
        information; to opt out of targeted ads, sale/share; and to appeal a
        decision. To exercise rights, contact{" "}
        <a
          href="mailto:privacy@fusionrxny.com"
          className="underline decoration-emerald-500"
        >
          privacy@fusionrxny.com
        </a>
        . We will not discriminate for exercising your rights.
      </Paragraph>

      <SectionHeading id="retention">8) Data Retention</SectionHeading>
      <Paragraph>
        We retain information as long as necessary to provide the Services,
        comply with legal obligations, resolve disputes, and enforce agreements.
        Clinical records may be retained per medical record laws.
      </Paragraph>

      <SectionHeading id="security">9) Security</SectionHeading>
      <Paragraph>
        We implement administrative, technical, and physical safeguards designed
        to protect personal information. No system is 100% secure, and you use
        the Services at your own risk.
      </Paragraph>

      <SectionHeading id="children">10) Children’s Privacy</SectionHeading>
      <Paragraph>
        The Services are not directed to children under 13, and we do not
        knowingly collect personal information from children under 13. Do not
        use the Services if you are under 13.
      </Paragraph>

      <SectionHeading id="international">
        11) International Users
      </SectionHeading>
      <Paragraph>
        We operate in the United States and the Services are intended for U.S.
        residents. If you access the Services from outside the U.S., you consent
        to the transfer and processing of your information in the U.S. in
        accordance with this Policy.
      </Paragraph>

      <SectionHeading id="changes">12) Changes to This Policy</SectionHeading>
      <Paragraph>
        We may update this Policy periodically. The “Last Updated” date reflects
        the latest revision. Your continued use of the Services after changes
        means you accept the updated Policy.
      </Paragraph>

      <SectionHeading id="contact">13) Contact Us</SectionHeading>
      <Paragraph>
        Privacy Questions —{" "}
        <a
          href="mailto:privacy@fusionrxny.com"
          className="underline decoration-emerald-500"
        >
          privacy@fusionrxny.com
        </a>{" "}
        • 7620 5th Ave., Brooklyn, NY 11209 •{" "}
        <a href="tel:+19297211050" className="underline decoration-emerald-500">
          +1 (929) 721-1050
        </a>
      </Paragraph>
    </article>
  );
};

const TermsAndPrivacyPage: React.FC = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.toLowerCase().includes("privacy");

  useEffect(() => {
    document.title = isPrivacy
      ? "Privacy Policy • Fusion"
      : "Terms of Service • Fusion";
  }, [isPrivacy]);

  return (
    <div className="relative z-10">
      {/* Header band */}
      <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-black border-b border-emerald-200/60 dark:border-emerald-400/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {isPrivacy ? "Privacy Policy" : "Terms of Service"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isPrivacy
              ? "Learn how we collect, use, and protect your information."
              : "Read the terms that govern your use of our services and products."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {isPrivacy ? <Privacy /> : <Terms />}

        {/* Back to home / cross-link */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-green-800 text-white hover:bg-green-600"
          >
            ← Back to Home
          </Link>
          <Link
            to={isPrivacy ? "/terms" : "/privacy"}
            className="text-emerald-700 dark:text-emerald-300 underline decoration-emerald-500 hover:opacity-80"
          >
            View {isPrivacy ? "Terms of Service" : "Privacy Policy"} instead
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-md border border-amber-300/60 bg-amber-50 p-4 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-400/40">
          <p className="text-sm">
            <strong>Legal Disclaimer:</strong> The content on this page is
            provided for general informational purposes and does not constitute
            legal advice. Laws and regulations (including HIPAA and state
            telehealth rules) may change. Please consult your legal counsel to
            tailor these policies for your organization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyPage;
