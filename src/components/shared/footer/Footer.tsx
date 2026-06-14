import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import LogoIcon from "@/components/shared/logo/LogoIcon";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: t("product"), link: "/product" },
    { label: t("blog"), link: "/blog" },
    { label: t("beautyAntiAging"), link: "/" },
    { label: t("basicHealthImmunity"), link: "/" },
    { label: t("targetedHealth"), link: "/" },
  ];

  const supportLinks = [
    { label: t("deliveryPolicy"), link: "/delivery-policy" },
    { label: t("termsConditions"), link: "/terms-conditions" },
    { label: t("privacyPolicy"), link: "/privacy-policy" },
    { label: t("cancellationPolicy"), link: "/cancellation-policy" },
    { label: t("returnPolicy"), link: "/return-policy" },
  ];

  const helpLinks = [
    { label: t("faq"), link: "/" },
    { label: t("contactUs"), link: "/contact" },
  ];

  return (
    <footer className="bg-neutral-100 w-full">
      <main className="container mx-auto py-14 max-md:p-4 md:px-6">
        <div className="flex flex-col gap-8">
          <section className="grid max-lg:grid-cols-1 lg:grid-cols-5 max-lg:gap-10 lg:gap-12 xl:gap-20">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* LOGO & NAME */}
              <div className="flex items-center lg:gap-2 xl:gap-6">
                <LogoIcon className="w-20 h-20 text-slate-800" />
                <p className="text-slate-800 text-2xl font-semibold">
                  Essence Lab
                </p>
              </div>
              <p className="text-sm text-slate-800 xl:w-[75%]">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-1">
              <p className="text-sm text-slate-400 font-medium">{t("quickLinks")}</p>
              {quickLinks.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className="block text-sm text-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-5 lg:col-span-1">
              <p className="text-sm text-slate-400 font-medium">{t("support")}</p>
              {supportLinks.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className="block text-sm text-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-5 lg:col-span-1">
              <p className="text-sm text-slate-400 font-medium">{t("help")}</p>
              {helpLinks.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className="block text-sm text-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Separator className="bg-neutral-300 w-full max-lg:hidden" />

      <section className="flex items-center justify-between max-lg:hidden container mx-auto max-md:p-4 md:p-6 text-slate-400 text-sm">
        <div className="flex items-center gap-8">
          <Link href="">{t("termsOfUse")}</Link>
          <Link href="">{t("privacyPolicy")}</Link>
        </div>
        <p>{t("copyright", { year })}</p>
      </section>
    </footer>
  );
}
