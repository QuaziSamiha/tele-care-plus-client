"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import UnderDevelopmentModal from "@/components/shared/common/UnderDevelopmentModal";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Link from "next/link";
import React, { useState } from "react";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted OTP:", otp);
  };
  return (
    <section className="bg-backgroundPrimary ">
      <div className="container mx-auto flex justify-center items-center ">
        <div className="flex flex-col justify-center items-center gap-6 py-12 w-fit max-md:px-4">
          <header className="text-start space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-textPrimary">
              OTP Verification
            </h1>
            <p className="text-muted-foreground">
              Your One Time Password (OTP) has been sent via email to your
              registered email address.
            </p>
          </header>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-6"
          >
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={(val) => setOtp(val)}
            >
              <InputOTPGroup className="flex items-center gap-3">
                <InputOTPSlot
                  index={0}
                  className="border border-neutral-300 rounded"
                />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {/* <SubmitButton submitTitle="Verify" /> */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-2 w-full bg-mauve-700 rounded-md text-textPrimary font-semibold text-base py-2.5 px-6 cursor-pointer disabled:cursor-not-allowed"
              >
                Verify
              </button>
              <UnderDevelopmentModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
              />
            </div>
          </form>
          <div className="text-sm flex items-center justify-center gap-1">
            <p className="font-normal text-neutral-800">
              Haven&apos;t received a code?
            </p>
            <div className="">
              <Link
                href=""
                onClick={() => setIsModalOpen(true)}
                className="font-semibold  text-mauve-800"
              >
                Resend
              </Link>
              <UnderDevelopmentModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client"

// import * as React from "react"
// import { OTPInput, OTPInputContext } from "input-otp"
// import { MinusIcon } from "lucide-react"

// import { cn } from "@/lib/utils"

// function InputOTP({
//   className,
//   containerClassName,
//   ...props
// }: React.ComponentProps<typeof OTPInput> & {
//   containerClassName?: string
// }) {
//   return (
//     <OTPInput
//       data-slot="input-otp"
//       containerClassName={cn(
//         "flex items-center gap-2 has-disabled:opacity-50",
//         containerClassName
//       )}
//       className={cn("disabled:cursor-not-allowed", className)}
//       {...props}
//     />
//   )
// }

// function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="input-otp-group"
//       className={cn("flex items-center", className)}
//       {...props}
//     />
//   )
// }

// function InputOTPSlot({
//   index,
//   className,
//   ...props
// }: React.ComponentProps<"div"> & {
//   index: number
// }) {
//   const inputOTPContext = React.useContext(OTPInputContext)
//   const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

//   return (
//     <div
//       data-slot="input-otp-slot"
//       data-active={isActive}
//       className={cn(
//         "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 relative flex h-9 md:h-12 w-9 md:w-16 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none rounded border border-neutralPrimary-300 data-[active=true]:z-10 data-[active=true]:ring-[3px]",
//         // "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
//         className
//       )}
//       {...props}
//     >
//       {char}
//       {hasFakeCaret && (
//         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//           <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
//         </div>
//       )}
//     </div>
//   )
// }

// function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
//   return (
//     <div data-slot="input-otp-separator" role="separator" {...props}>
//       <MinusIcon />
//     </div>
//   )
// }

// export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
