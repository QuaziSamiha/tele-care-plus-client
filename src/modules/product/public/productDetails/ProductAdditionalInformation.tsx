const additionalInfo = [
  { label: "Active Ingredient", value: "Pantoprazole (as sodium sesquihydrate)" },
  { label: "Strength", value: "40 mg" },
  { label: "Dosage Form", value: "Gastro-Resistant Tablet" },
];

export default function ProductAdditionalInformation() {
  return (
    <section className="py-6">
      <div className="border-t border-slate-100">
        {additionalInfo.map((info, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-center border-b border-slate-100 py-4 px-2"
          >
            {/* Label Column */}
            <span className="text-slate-800 font-bold text-base">
              {info.label}
            </span>

            {/* Value Column */}
            <span className="text-slate-500 text-base mt-1 md:mt-0">
              {info.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}