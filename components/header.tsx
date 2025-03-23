import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <header className="border-b bg-primary text-white px-24">
      <div className="flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6 justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">SinoToriables PH</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/candidates"
              className="text-sm font-medium transition-colors hover:text-gray-300"
            >
              Candidates
            </Link>
            <Link
              href="/my-list"
              className="text-sm font-medium transition-colors hover:text-gray-300"
            >
              My List
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium transition-colors hover:text-gray-300"
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colorshover:text-gray-300"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
