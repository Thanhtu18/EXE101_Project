"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./utils";

function Slider({
  className,
  defaultValue = [0],
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const values = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return defaultValue;
    return [min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("relative flex w-full items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>

      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-4 rounded-full border border-primary bg-background shadow transition hover:scale-110"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
