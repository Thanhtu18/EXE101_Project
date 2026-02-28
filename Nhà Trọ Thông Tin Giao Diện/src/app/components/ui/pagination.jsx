import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

/* Root */

function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }) {
  return <ul className={cn("flex items-center gap-1", className)} {...props} />;
}

function PaginationItem(props) {
  return <li {...props} />;
}

/* Link */

function PaginationLink({ className, isActive, size = "icon", ...props }) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size={size}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious(props) {
  return (
    <PaginationLink size="default" {...props}>
      <ChevronLeftIcon className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationNext(props) {
  return (
    <PaginationLink size="default" {...props}>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
