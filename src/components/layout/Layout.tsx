
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export const Layout = ({ children, className, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn("flex-grow pt-20", className)}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
