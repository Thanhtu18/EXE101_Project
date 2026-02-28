"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";

/* Root */

function NavigationMenu({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

/* List */

function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

/* Item */

function NavigationMenuItem(props) {
  return <NavigationMenuPrimitive.Item {...props} />;
}

/* Trigger style */

const navigationMenuTriggerStyle = cva(
  "inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
);

/* Trigger */

function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="ml-1 size-3 transition-transform data-[state=open]:rotate-180" />
    </NavigationMenuPrimitive.Trigger>
  );
}

/* Content */

function NavigationMenuContent({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "absolute top-0 left-0 w-full data-[motion=from-start]:animate-in data-[motion=to-start]:animate-out",
        className,
      )}
      {...props}
    />
  );
}

/* Viewport */

function NavigationMenuViewport({ className, ...props }) {
  return (
    <div className="absolute top-full left-0 flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-2 w-full overflow-hidden rounded-md border bg-popover shadow-md md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/* Link */

function NavigationMenuLink({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "block select-none rounded-md p-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

/* Indicator */

function NavigationMenuIndicator({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-10 flex h-1.5 items-end justify-center",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
};
