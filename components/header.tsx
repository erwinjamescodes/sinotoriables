"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-primary text-white px-24">
      <div className="flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6 justify-between w-full">
          <Link
            href="/"
            className={`flex items-center gap-2 ${
              pathname === "/" ? "border-b-2 border-white pb-1" : ""
            }`}
          >
            <span className="text-xl font-bold">SinoToriables PH</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/candidates"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/candidates" ? "border-b-2 border-white pb-0" : ""
              }`}
            >
              Candidates
            </Link>
            <Link
              href="/my-list"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/my-list" ? "border-b-2 border-white pb-0" : ""
              }`}
            >
              My List
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/analytics" ? "border-b-2 border-white pb-0" : ""
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors hover:text-gray-300 ${
                pathname === "/about" ? "border-b-2 border-white pb-0" : ""
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
