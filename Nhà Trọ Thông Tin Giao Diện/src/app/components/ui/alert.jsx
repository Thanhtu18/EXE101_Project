import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

/* ===============================
   Variants
================================ */

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[0_1fr] has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* ===============================
   Alert Root
================================ */

function Alert({ className, variant, ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/* ===============================
   Title
================================ */

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ===============================
   Description
================================ */

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
