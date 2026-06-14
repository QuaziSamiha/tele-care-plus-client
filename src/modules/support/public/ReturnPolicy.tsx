import SupportTemplate from "./SupportTemplate";

export const returnPolicyMockData = {
  title: "Return Policy",
  description: `
    <div class="policy-container">
      <h3>When we accept returns</h3>
      <p>Due to the nature of pharmaceutical products, THP only accepts returns in the following situations. All return requests must be submitted within 24 hours of delivery with photo or video evidence.</p>
      <ol>
        <li>Wrong product or dosage delivered — not what you ordered.</li>
        <li>Damaged or defective product received — broken seal, damaged packaging, visible contamination.</li>
        <li>Expired product — expiry date has passed at the time of delivery.</li>
        <li>Product recall — THP will contact you directly if your order is affected.</li>
      </ol>

      <h3>Return conditions</h3>
      <p>To be eligible for a return, the product must be:</p>
      <ol>
        <li>Sealed and unopened in its original packaging.</li>
        <li>Within its expiry date.</li>
        <li>Returned via a THP delivery person who will collect it from your address — do not post medicines independently.</li>
        <li>Accompanied by the original order number and a brief description of the issue.</li>
      </ol>

      <h3>Non-returnable items</h3>
      <ul class="space-y-3 mb-8">
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Opened or partially used medicines</span>
          <span style="color: #ef4444; font-weight: 600; text-transform: capitalize;">not accepted</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Cold-chain / refrigerated products</span>
          <span style="color: #ef4444; font-weight: 600; text-transform: capitalize;">not accepted</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Controlled substances (Schedule II–IV)</span>
          <span style="color: #ef4444; font-weight: 600; text-transform: capitalize;">not accepted</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Personal hygiene & intimate products</span>
          <span style="color: #ef4444; font-weight: 600; text-transform: capitalize;">not accepted</span>
        </li>
        <li class="flex justify-between items-center text-sm pt-1 border-t border-neutral-100">
          <span class="text-neutral-600">Items returned after 24-hour window</span>
          <span style="color: #f97316; font-weight: 600; text-transform: capitalize;">case by case</span>
        </li>
      </ul>

      <h3>How to request a return</h3>
      <ol>
        <li>Step 1 — Contact THP support via LINE OA or support@thp.co.th within 24 hours of delivery.</li>
        <li>Step 2 — Provide your order ID, the product name, and clear photos or video of the issue.</li>
        <li>Step 3 — Our team reviews the request within 1 business day and approves or rejects it.</li>
        <li>Step 4 — If approved, a THP delivery person will collect the item from your address at no cost to you.</li>
        <li>Step 5 — Refund is issued to your original payment method within the standard refund timelines.</li>
      </ol>

      <h3>Refund timelines</h3>
      <ul class="space-y-3 mb-8">
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">PromptPay / bank transfer</span>
          <span class="text-neutral-700 font-medium">3–5 business days</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Credit / debit card</span>
          <span class="text-neutral-700 font-medium">7–14 business days</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">TrueMoney Wallet</span>
          <span class="text-neutral-700 font-medium">1–3 business days</span>
        </li>
      </ul>

      <h3>Returns & Rx rejection</h3>
      <p>Returns are accepted only for damaged, wrong, or recalled products — reported within 24 hours of delivery. Products must be sealed and unopened. If your prescription is rejected, you have 48 hours to resubmit. After 48 hours, the order is auto-cancelled with a full refund.</p>

      <div class="warning-box">
        THP cannot accept returns for health and safety reasons if the product has been opened, dispensed, or removed from cold-chain storage. This is in line with Thai pharmaceutical regulations and is non-negotiable.
      </div>
    </div>
  `,
};
export default function ReturnPolicy() {
  return (
    <SupportTemplate
      title={returnPolicyMockData.title}
      description={returnPolicyMockData.description}
    />
  );
}
