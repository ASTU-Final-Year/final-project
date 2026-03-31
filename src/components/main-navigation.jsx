import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm flex flex-col gap-1">
            <div className="leading-none">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default function MainNavigationMenu({ navlinks }) {
  const pathname = usePathname();
  const activeNavlink = navlinks.find((navlink) => navlink.path === pathname);
  return (
    <NavigationMenu>
      <Head>
        <title key={1}>{activeNavlink?.title || "ServeSync+"}</title>
      </Head>
      <NavigationMenuList>
        {navlinks.map(({ title, label, path, children }, idx) =>
          children ? (
            <NavigationMenuItem key={idx}>
              <NavigationMenuTrigger className="px-4 py-2 rounded transition-colors text-sm text-foreground/70 hover:text-foreground bg-transparent hover:bg-muted font-medium">
                {label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  {children.map(({ title, label, path, description }, idx) => (
                    <ListItem
                      className={cn(
                        "p-2 md:p-4  rounded transition-colors text-foreground/70 hover:text-foreground bg-transparent hover:bg-muted font-medium",
                        activeNavlink?.path === path ? "text-foreground" : "",
                      )}
                      key={idx}
                      href={path}
                      title={title}
                    >
                      {description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={idx}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-sm text-foreground/70",
                  activeNavlink?.path === path ? "text-foreground" : "",
                )}
              >
                <Link href={path}>{label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
