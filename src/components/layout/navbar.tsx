"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const navbar = tv(
  {
    base: ["h-14 w-full border-b border-border-primary bg-bg-page"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const navbarInner = tv(
  {
    base: ["h-full w-full px-6 lg:px-10 flex items-center"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const navbarLogo = tv(
  {
    base: ["flex items-center gap-2"],
    variants: {},
    defaultVariants: {},
  },
  {
    twMerge: true,
  },
);

const navbarLink = tv(
  {
    base: ["font-mono text-sm transition-colors"],
    variants: {
      active: {
        true: "text-text-primary",
        false: "text-text-secondary hover:text-text-primary",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
  {
    twMerge: true,
  },
);

export type NavbarVariantProps = VariantProps<typeof navbar>;
export type NavbarProps = NavbarVariantProps &
  Omit<HTMLAttributes<HTMLElement>, "className"> & {
    className?: string;
    logoText?: string;
    links?: Array<{ href: string; label: string; active?: boolean }>;
  };

function Navbar({
  className,
  logoText = "devroast",
  links = [],
  ...props
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={navbar({ className })} {...props}>
      <div className={navbarInner()}>
        <div className={navbarLogo()}>
          <span className="text-accent-green font-mono text-xl font-bold">
            &gt;
          </span>
          <span className="text-text-primary font-mono text-lg">
            {logoText}
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href || link.active;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={navbarLink({ active: isActive })}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

Navbar.displayName = "Navbar";

export { Navbar, navbar, navbarLink, navbarLogo };
