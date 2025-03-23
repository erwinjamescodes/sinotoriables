"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b bg-primary text-white px-4 sm:px-6 md:px-8 lg:px-24">
      <div className="flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6 justify-between w-full">
          <Link href="/" className={`flex items-center gap-2`}>
            <span className="text-xl font-bold">SinoToriables PH</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary py-4 px-4 border-t border-gray-700">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/candidates"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/candidates" ? "border-l-4 border-white pl-2" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Candidates
            </Link>
            <Link
              href="/my-list"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/my-list" ? "border-l-4 border-white pl-2" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My List
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/analytics" ? "border-l-4 border-white pl-2" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors hover:text-gray-300 py-2 ${
                pathname === "/about" ? "border-l-4 border-white pl-2" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
