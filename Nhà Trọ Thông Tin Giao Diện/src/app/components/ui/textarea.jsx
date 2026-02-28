"use client";

import { cn } from "./utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-16",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
