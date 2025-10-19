export default function TermsAndConditions() {
  return (
    <div className="p-4 max-w-2xl mx-auto font-light text-neutral-500 flex flex-col gap-y-4">
      <p className="text-neutral-600 text-2xl font-normal">
        Terms & Conditions
      </p>
      <p>Last Updated {new Date().toDateString()}</p>
      <div className="space-y-1">
        <p>
          Welcome to <span className="font-normal">RaktaXetu</span>
        </p>
        <p>
          voluntary blood donation connector platform developed to connect
          willing blood donors with individuals or organizations in need of
          blood. By downloading, registering, or using RaktaXetu (referred to as
          “we, ” “us, ” or “our”), you agree to these Terms and Conditions.
          Please read them carefully before using our services.
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          1. Purpose of the Platform
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            RaktaXetu is a digital connector, not a blood bank or medical
            institution.
          </li>
          <li>
            The platform enables users to create profiles, indicate blood group
            and availability, and connect directly with donors or recipients.
          </li>
          <li>
            All donations facilitated through RaktaXetu are voluntary and
            noncommercial.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">2. Legal Compliance</p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            In accordance with the Drugs and Cosmetics Act, 1940 and Rules,
            1945, RaktaXetu does not collect, test, store, or distribute blood.
          </li>
          <li>
            The platform complies with the National Blood Policy, 2002, which
            prohibits any form of paid or commercial blood donation.
          </li>
          <li>
            RaktaXetu strictly functions as an information and communication
            medium between users.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">3. User Eligibility</p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>Users must be at least 18 years of age to register as donors.</li>
          <li>
            Users must ensure that all information provided (name, contact,
            blood group, availability) is accurate and truthful.
          </li>
          <li>
            Users are responsible for ensuring their own medical fitness before
            donating blood.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">4. Prohibited Activities</p>
        <p className="font-normal">Users agree not to:</p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            Demand or offer money or material benefits for blood donation.
          </li>
          <li>
            Provide false or misleading information regarding availability,
            blood group, or location.
          </li>
          <li>
            Use the platform for advertisements, spam, or unlawful purposes.
          </li>
          <li>
            Harass, threaten, or misuse another user's personal information.
          </li>
        </ol>
        <p className="font-normal text-rose-500">
          Any violation may lead to account suspension, permanent ban, or legal
          action.
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          5. Contact Sharing and Communication
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            To connect donors and recipients, RaktaXetu may redirect users to
            WhatsApp or phone call.
          </li>
          <li>
            When this happens, your registered phone number will be visible to
            the other user.
          </li>
          <li>
            RaktaXetu currently does not use virtual number masking; hence, your
            real contact number may be shared.
          </li>
          <li>
            You can control your visibility by toggling “Available for Donation”
            on or off.
          </li>
          <li>
            RaktaXetu is not liable for any misuse of contact information by
            other users.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          6. Data Accuracy and User Responsibility
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            RaktaXetu does not verify the medical status or identity of users.
          </li>
          <li>
            Users should exercise discretion before contacting or meeting anyone
            through the platform.
          </li>
          <li>
            The platform does not guarantee donor availability or response.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">7. Liability Disclaimer</p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            RaktaXetu is not responsible for the medical outcome, safety, or
            success of any blood transfusion.
          </li>
          <li>
            The platform is not a substitute for professional medical advice or
            emergency services.
          </li>
          <li>
            All donations and requests are made at the user’s own risk and
            judgment.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          8. Monitoring, Reporting & Enforcement
        </p>
        <ol className="space-y-1 [list-style-type:number] pl-4">
          <li>
            Users can report suspicious or abusive behavior via the “Make a
            Complaint” option.
          </li>
          <li>
            RaktaXetu reserves the right to review, suspend, or permanently
            remove accounts found violating these Terms.
          </li>
          <li>
            In serious cases (e.g., monetary exploitation), we may inform local
            authorities.
          </li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">9. Intellectual Property</p>
        <p>
          All content, design, and features of RaktaXetu are the intellectual
          property of RaktaXetu Developers. Users may not copy, modify, or
          redistribute without prior written consent.
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">
          10. Modification of Terms
        </p>
        <p>
          RaktaXetu may update or modify these Terms periodically. Users will be
          notified through the app or email. Continued use of the platform means
          acceptance of updated terms.
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-normal text-neutral-600">11. Governing Law</p>
        <p>
          These Terms and Conditions shall be governed by and interpreted
          according to the laws of India, under the jurisdiction of the courts
          of Assam.
        </p>
      </div>
    </div>
  );
}
