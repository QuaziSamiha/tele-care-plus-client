import SupportTemplate from "./SupportTemplate";

export const privacyPolicyMockData = {
  title: "Privacy Policy",
  description: `
    <div class="policy-container">
      <h3>What we collect</h3>
      <ol>
        <li>Identity: Name, national ID, date of birth (for Rx verification).</li>
        <li>Contact: Phone number, email, delivery address.</li>
        <li>Health data (sensitive): Prescription documents and relevant medical information.</li>
        <li>Transaction: Order history and payment method (no full card numbers stored).</li>
      </ol>

      <h3>Data sharing & retention</h3>
      <p>We share limited data only with our delivery staff (name, address, phone), payment processors, and Thai regulatory authorities when required by law. We never sell your data. Prescription records are kept for 3 years; order records for 5 years.</p>

      <h3>Your rights (PDPA)</h3>
      <p>You have the right to access, correct, delete, or port your data, and to withdraw consent at any time. Contact our Data Protection Officer at privacy@thp.co.th. We respond within 30 days.</p>

      <div class="warning-box">
        Prescription and health data is encrypted, accessible only to licensed THP pharmacists, and never used for marketing purposes.
      </div>
    </div>
  `,
};
export default function PrivacyPolicy() {
  return (
    <SupportTemplate
      title={privacyPolicyMockData.title}
      description={privacyPolicyMockData.description}
    />
  );
}
