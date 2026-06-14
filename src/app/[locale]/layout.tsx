// * ========= ROOT LAYOUT ========
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../styles/globals.css";
import { APP_NAME } from "@/constants/common.constants";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
// import QueryProvider from "@/providers/QueryProvider";
import { ToastContainer } from "react-toastify";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import QueryProvider from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Premium fragrances and beauty products by Essence Lab.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  //* MUST CALL BEFORE getMessages() — SETS LOCALE IN REACT CACHE FOR SERVER COMPONENTS
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <QueryProvider>
          <NextAuthProvider>
            <NextIntlClientProvider messages={messages}>
              <TooltipProvider>{children}</TooltipProvider>
            </NextIntlClientProvider>
          </NextAuthProvider>
        </QueryProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}