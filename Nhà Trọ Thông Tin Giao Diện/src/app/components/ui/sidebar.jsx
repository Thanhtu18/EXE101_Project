"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { PanelLeftIcon } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

const SidebarContext = createContext(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar,
      isMobile,
    }),
    [open, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function Sidebar({ children, className }) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen transition-all duration-300",
        open ? "w-64" : "w-16",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("m-2", className)}
      onClick={toggleSidebar}
    >
      <PanelLeftIcon />
    </Button>
  );
}

export function SidebarContent({ children, className }) {
  return (
    <div className={cn("flex flex-col p-4 gap-2", className)}>{children}</div>
  );
}
