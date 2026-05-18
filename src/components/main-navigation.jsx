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

function ListItem({ title, children, href, className, ...props }) {
  return (
    <li className={cn(className)} {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          {title}
          {/* <div className="text-sm flex flex-col gap-1">
            <div className="leading-none">{title}</div>
            <div className="line-clamp-2 text-muted">{children}</div>
          </div> */}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default function MainNavigationMenu({ navlinks }) {
  const pathname = usePathname();
  const activeNavlink = navlinks.find((navlink) => navlink.path === pathname);
  return (
    <NavigationMenu className="dark">
      <Head>
        <title key={1}>{activeNavlink?.title || "ServeSync+"}</title>
      </Head>
      <NavigationMenuList>
        {navlinks.map(({ title, label, path, children }, idx) =>
          children ? (
            <NavigationMenuItem
              className="bg-transparent focus:bg-transparent"
              key={idx}
            >
              <NavigationMenuTrigger className="px-4 py-2 rounded transition-colors text-base text-white/70 hover:text-white bg-transparent active:bg-transparent focus:bg-transparent hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent hover:border-b-2 hover:border-white/70 font-semibold">
                {label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-slate-900 text-lg">
                <ul className="w-96">
                  {children.map(({ title, label, path, description }, idx) => (
                    <ListItem
                      className={cn(
                        "p-2 md:p-4  rounded transition-colors text-white/70 hover:text-white bg-transparent hover:bg-transparent focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent hover:broder-b-2 hover:border-white/60 font-medium",
                        activeNavlink?.path === path ? "text-white" : "",
                      )}
                      key={idx}
                      href={path}
                      title={title}
                    >
                      {/* {description} */}
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
                  "bg-transparent text-base font-semibold text-white/70 hover:bg-transparent focus:bg-transparent active:bg-transparent hover:border-b-2 hover:border-white/60",
                  activeNavlink?.path === path ? "text-white" : "",
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
