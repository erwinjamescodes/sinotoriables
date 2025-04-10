"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer if the current path is /candidates
  // if (pathname === "/candidates") {
  //   return null;
  // }

  const hideFooter = pathname === "/candidates";
  return (
    <footer
      className={`border-t py-6 md:py-0 ${hideFooter ? "hidden md:block" : ""}`}
    >
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 SinoToriables PH. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://www.erwinjames.tech/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            www.erwinjames.tech
          </Link>
        </div>
      </div>
    </footer>
  );
}
