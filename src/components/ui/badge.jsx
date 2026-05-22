import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-0.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md [a]:hover:bg-primary/90",
        secondary:
          "bg-accent text-accent-foreground shadow-sm hover:shadow-md [a]:hover:bg-accent/80",
        destructive:
          "bg-destructive/15 text-destructive border-destructive/30 shadow-sm hover:bg-destructive/25 focus-visible:ring-destructive/20 dark:bg-destructive/25 dark:hover:bg-destructive/35 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-border text-foreground shadow-sm hover:bg-muted hover:text-foreground hover:shadow-md [a]:hover:bg-muted",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 [a]:hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
