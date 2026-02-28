"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "./utils";

function Drawer(props) {
  return <DrawerPrimitive.Root {...props} />;
}

function DrawerTrigger(props) {
  return <DrawerPrimitive.Trigger {...props} />;
}

function DrawerPortal(props) {
  return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose(props) {
  return <DrawerPrimitive.Close {...props} />;
}

function DrawerOverlay({ className, ...props }) {
  return (
    <DrawerPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-xl p-4",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
};
