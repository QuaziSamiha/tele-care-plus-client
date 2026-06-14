import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";
import ContactInfoPanel from "./ContactInfoPanel";

export default async function Contact() {
  const t = await getTranslations("ContactPage");

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 max-lg:pt-24 pt-12 my-12 lg:my-24">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10">
        {t("pageTitle")}
      </h1>

      <main className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <ContactForm />
        </div>

        <ContactInfoPanel />
      </main>
    </section>
  );
}
