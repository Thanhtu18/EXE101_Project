import * as React from "react";
import { cn } from "./utils";

/* ===============================
   Card Root
================================ */

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/* ===============================
   Header
================================ */

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6",
        className,
      )}
      {...props}
    />
  );
}

/* ===============================
   Title
================================ */

function CardTitle({ className, ...props }) {
  return (
    <h4
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

/* ===============================
   Description
================================ */

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ===============================
   Action (button góc phải)
================================ */

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/* ===============================
   Content
================================ */

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/* ===============================
   Footer
================================ */

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 pt-4 border-t", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
