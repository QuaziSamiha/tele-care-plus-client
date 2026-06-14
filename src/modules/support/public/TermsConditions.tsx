import SupportTemplate from "./SupportTemplate";

export const termsConditionsMockData = {
  title: "Terms & Conditions",
  description: `
    <div class="policy-container">
      <h3>Acceptance</h3>
      <p>By accessing or using the THP website, mobile application, or placing an order through any THP channel (including LINE OA, Shopee, and Lazada storefronts), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>
      
      <h3>Eligibility</h3>
      <p>You must be at least 18 years of age to place an order on THP. By placing an order, you confirm that you are legally permitted to purchase pharmaceutical products under the laws of Thailand. THP reserves the right to refuse service to any individual who provides false information or violates these terms.</p>

      <h3>Prescription medicines</h3>
      <p>Certain products listed on THP require a valid prescription issued by a licensed physician in Thailand. Customers must upload a clear, legible prescription at checkout for such products. THP pharmacists will verify all prescriptions before dispatch. THP reserves the right to cancel any order where the prescription is found to be invalid, expired, or fraudulent.</p>

      <h3>Pricing & payment</h3>
      <ol>
        <li>All prices are in Thai Baht (฿) inclusive of VAT.</li>
        <li>Accepted payments: ScanPay, credit/debit card, and COD (within city only, +฿30 fee).</li>
        <li>Prices at checkout are final. THP reserves the right to update prices without prior notice.</li>
      </ol>

      <h3>Delivery & liability</h3>
      <p>THP delivers via its own team of 4 staff. Estimated times: 2–3 days within city, 5–7 days outside city. THP is not liable for delays caused by factors outside its reasonable control. Product descriptions are kept accurate, but customers should always read the enclosed leaflet and consult a pharmacist before use.</p>

      <h3>Governing law</h3>
      <p>These terms are governed by the laws of the Kingdom of Thailand. Disputes are subject to Thai court jurisdiction.</p>

      <div class="warning-box">
        Obtaining prescription medicines without a valid Rx is a criminal offence under the Thai Drug Act B.E. 2510. Suspected fraud will be reported to the Thai FDA (อย.).
      </div>
    </div>
  `,
};

export default function TermsConditions() {
  return (
    <SupportTemplate
      title={termsConditionsMockData.title}
      description={termsConditionsMockData.description}
    />
  );
}
