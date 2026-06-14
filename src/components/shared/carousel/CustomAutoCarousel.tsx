"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface IProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  delay?: number;
  className?: string;
}

export function CustomAutoCarousel<T>({
  data,
  renderItem,
  delay = 400,
  className = "w-full",
}: IProps<T>) {
  const plugin = React.useRef(
    Autoplay({
      delay,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      className={className}
    >
      {/* ✅ Use items-stretch to make all cards equal height */}
      <CarouselContent className="flex px-2 items-stretch ml-0.5">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <div className="mx-2 h-full">{renderItem(item, index)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
