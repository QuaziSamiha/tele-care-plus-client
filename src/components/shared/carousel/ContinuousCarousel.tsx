"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useTranslations } from "next-intl";

const SERVICE_KEYS = [
  "pharmacy",
  "relief",
  "expertise",
  "care",
  "health",
  "support",
  "wellness",
] as const;

export default function ContinuousCarousel() {
  const t = useTranslations("Home.carousel");
  const animation = { duration: 20000, easing: (t: number) => t };

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    slides: {
      perView: "auto",
      spacing: 16,
    },
    created(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });
  return (
    <div ref={sliderRef} className="keen-slider">
      {SERVICE_KEYS.map((key) => (
        <div
          key={key}
          className="keen-slider__slide min-w-fit px-2 py-1.5 md:px-6 md:py-3 border lg:border-2 border-slate-100 text-slate-800 max-lg:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center"
        >
          {t(key)}
        </div>
      ))}
    </div>
  );
}
