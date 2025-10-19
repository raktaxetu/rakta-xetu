export default function PrivacyPolicy() {
  return (
    <div className="p-4 max-w-2xl mx-auto font-light text-neutral-500 flex flex-col gap-y-4">
      <p className="text-neutral-600 text-2xl font-normal">Privacy Policy</p>
      <p>Last Updated {new Date().toDateString()}</p>

      <div className="space-y-1">
        <p>
          At <span className="font-normal">RaktaXetu</span>, your privacy and
          trust are our top priorities. This Privacy Policy explains how we
          collect, use, protect, and share your personal information.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          1. Information We Collect
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>Personal Details: Name, Email ID, Phone Number, Blood Group.</li>
          <li>
            Location Data: Optional, used to show nearby donors or recipients on
            the map.
          </li>
          <li>
            Usage Data: App interactions, availability toggle, complaint
            submissions, etc.
          </li>
        </ol>
        <p>We do not collect sensitive health reports or financial data.</p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          2. How We Use Your Information
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>Create and manage your user profile.</li>
          <li>Connect you with donors/recipients of matching blood groups.</li>
          <li>Facilitate communication through WhatsApp or phone call.</li>
          <li>Improve platform performance, safety, and user experience.</li>
          <li>
            Send important notifications related to blood requests or donation
            drives.
          </li>
        </ol>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          3. Sharing of Information
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            Your contact number will be shared only with relevant users
            (donors/recipients) for blood donation purposes.
          </li>
          <li>
            We do not sell, rent, or trade your personal data with any third
            party.
          </li>
          <li>
            In case of abuse reports, limited user data may be shared with law
            enforcement upon valid legal request.
          </li>
        </ol>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">4. Data Security</p>
        <p>
          We employ secure encryption and access controls to protect your
          personal data. Only authorized administrators can access user data for
          technical support or abuse handling. However, no digital system is
          100% secure — users are advised to share contact details responsibly.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          5. User Control and Choices
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            You can update, correct, or delete your profile anytime through the
            app.
          </li>
          <li>
            You can turn “Available for Donation” OFF to stop sharing your
            contact information.
          </li>
          <li>
            You may request complete account deletion by contacting us at
            [insert support email].
          </li>
        </ol>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">6. Children’s Privacy</p>
        <p>
          RaktaXetu is not intended for users under 18 years of age. We do not
          knowingly collect personal information from minors.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          7. Legal Basis & Compliance
        </p>
        <p>
          This Privacy Policy complies with the Digital Personal Data Protection
          Act, 2023 and related Indian privacy laws. We ensure your data is used
          only for legitimate and transparent purposes directly related to blood
          donation facilitation.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">8. Third-Party Services</p>
        <p>
          RaktaXetu may use third-party tools (e.g., Google Calendar API,
          WhatsApp link redirection) to enhance functionality. These third
          parties have their own privacy policies, which we encourage you to
          review.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          9. Changes to Privacy Policy
        </p>
        <p>
          We may update this Privacy Policy periodically. Updated versions will
          be posted on our app, and continued use indicates acceptance.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-neutral-600">10. Contact Us</p>
        <p>
          For any privacy-related questions or complaints, please contact us at
          <span className="font-normal underline">
            {" "}
            <a href="mailto:raktaxetu@gmail.com">raktaxetu@gmail.com</a>
          </span>
        </p>
      </div>
    </div>
  );
}
