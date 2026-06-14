import SupportTemplate from "./SupportTemplate";

export const deliveryPolicyMockData = {
  title: "Delivery Policy",
  description: `
    <div class="policy-container">
      <h3>Overview</h3>
      <p>THP operates a dedicated team of our own delivery man responsible for the safe, timely, and compliant delivery of pharmaceutical products to customers across Thailand. All delivery staff are employed directly by THP and are trained in pharmaceutical handling standards, customer service, and cold-chain protocol.</p>
      <br/> 
      <h3>Delivery coverage & timeframes</h3>
      <br/>
      <p><strong>Within city (Bangkok & metro):</strong><br/>
      Estimated delivery: 2–3 business days from order confirmation. Same-day dispatch for orders confirmed before 12:00 noon.</p>
      <br/><br/>
      <p><strong>Outside city (provincial areas) :</strong><br/>
      Estimated delivery: 2–3 business days from order confirmation. Same-day dispatch for orders confirmed before 12:00 noon.</p>
<br/><br/>
      <h3>Delivery staff responsibilities</h3>
      <ol>
        <li>Verify customer ID before handing over prescription-only medicines.</li>
        <li>Keep products in THP-issued insulated bags. Cold-chain items must stay at 2°C-8°C.</li>
        <li>Obtain a signature from the recipient. Parcels must not be left unattended.</li>
        <li>Report any damaged or tampered packages to Operations before delivery.</li>
        <li>Complete delivery confirmation in the admin system within 1 hour.</li>
      </ol>
<br/><br/>
      <h3>Failed delivery</h3>
      <p>Staff will attempt delivery 3 times with a 4-hour gap between each attempt. After 3 failed attempts, the parcel is returned to the THP warehouse and the order is flagged for admin review.</p>
<br/><br/>
      <div class="warning-box">
        Controlled or Schedule II-IV medicines may only be handed to the registered patient or their legal guardian. No third-party handover without written THP authorisation.
      </div>
    </div>
  `,
};
export default function DeliveryPolicy() {
  return (
    <SupportTemplate
      title={deliveryPolicyMockData.title}
      description={deliveryPolicyMockData.description}
    />
  );
}
