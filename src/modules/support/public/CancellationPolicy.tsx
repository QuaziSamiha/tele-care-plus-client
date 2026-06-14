import SupportTemplate from "./SupportTemplate";

export const cancellationPolicyMockData = {
  title: "Cancellation Policy",
  description: `
    <div class="policy-container">
      <h3>Cancellation window</h3>
      <p>Customers may cancel an order free of charge within 2 hours of placing it, provided the order has not yet been confirmed by our pharmacy team. To cancel, contact THP support via LINE OA, phone, or email with your order ID.</p>
      
      <h3>Cancellation by order stage</h3>
      <ul class="space-y-2 mb-8">
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Awaiting payment / Rx under review</span>
          <span style="color: #22c55e; font-weight: 600;">Free cancellation</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Picking in progress</span>
          <span style="color: #f97316; font-weight: 600;">฿50 Fee</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Packed, ready to dispatch</span>
          <span style="color: #f97316; font-weight: 600;">฿100 fee</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Dispatched / out for delivery</span>
          <span style="color: #ef4444; font-weight: 600;">Cannot be cancelled</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Delivered</span>
          <span style="color: #ef4444; font-weight: 600;">Return policy applies</span>
        </li>
      </ul>

      <h3>Non-cancellable items</h3>
      <ol>
        <li>Controlled / Schedule II-IV medicines once dispensing has started.</li>
        <li>Cold-chain products once removed from temperature-controlled storage.</li>
        <li>Custom-compounded preparations.</li>
      </ol>

      <h3>Refund timelines</h3>
      <ul class="space-y-2 mb-8">
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">PromptPay / bank transfer</span>
          <span class="text-neutral-600 font-medium">3-5 business days</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">Credit / debit card</span>
          <span class="text-neutral-600 font-medium">7-14 business days</span>
        </li>
        <li class="flex justify-between items-center text-sm">
          <span class="text-neutral-600">TrueMoney Wallet</span>
          <span class="text-neutral-600 font-medium">1-3 business days</span>
        </li>
        <li class="flex justify-between items-center text-sm pt-1">
          <span class="text-neutral-600">COD orders</span>
          <span class="text-neutral-600 font-medium">Via PromptPay (provide bank details)</span>
        </li>
      </ul>

      <div class="warning-box">
        If your prescription is rejected, your order is held for 48 hours for resubmission. After 48 hours with no valid Rx, the order is auto-cancelled with a full refund, no fee.
      </div>
    </div>
  `,
};
export default function CancellationPolicy() {
  return (
    <SupportTemplate
      title={cancellationPolicyMockData.title}
      description={cancellationPolicyMockData.description}
    />
  );
}
