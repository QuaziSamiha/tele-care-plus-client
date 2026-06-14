interface ISupportPolicy {
  title: string;
  description: string; // HTML format from backend
}

export default function SupportTemplate({
  title,
  description,
}: ISupportPolicy) {
  return (
    <section className="container mx-auto px-4 lg:px-0 py-16 mt-20">
      <h1 className="text-slate-900 font-bold text-3xl md:text-4xl mb-10">
        {title}
      </h1>

      <div
        className="rich-text-container text-base text-neutral-600 break-words w-full"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </section>
  );
}
