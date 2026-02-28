"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal(props) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background p-6 shadow-lg rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <XIcon className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogTitle(props) {
  return <DialogPrimitive.Title data-slot="dialog-title" {...props} />;
}

function DialogDescription(props) {
  return (
    <DialogPrimitive.Description data-slot="dialog-description" {...props} />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
