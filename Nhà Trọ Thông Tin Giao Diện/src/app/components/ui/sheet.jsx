"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

function Sheet(props) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger(props) {
  return <SheetPrimitive.Trigger {...props} />;
}

function SheetClose(props) {
  return <SheetPrimitive.Close {...props} />;
}

function SheetPortal(props) {
  return <SheetPrimitive.Portal {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({ className, children, side = "right", ...props }) {
  const sideStyles = {
    right: "right-0 top-0 h-full w-3/4 border-l sm:max-w-sm",
    left: "left-0 top-0 h-full w-3/4 border-r sm:max-w-sm",
    top: "top-0 left-0 w-full border-b",
    bottom: "bottom-0 left-0 w-full border-t",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 bg-background p-6 shadow-lg transition ease-in-out",
          sideStyles[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100 focus:outline-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
