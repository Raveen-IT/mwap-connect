
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-2 glass-effect" 
          : "py-4 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-mwap-400 to-mwap-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="font-heading font-semibold text-xl md:text-2xl tracking-tight">
            MWAP
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-accent flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 transform md:hidden overflow-hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="min-h-screen glass-effect border-t border-border p-6 flex flex-col">
          <nav className="flex flex-col space-y-8 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary flex items-center",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div className="ml-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse-subtle" />
                )}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-4">
              <Button asChild variant="outline" className="rounded-full w-full">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="rounded-full w-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
