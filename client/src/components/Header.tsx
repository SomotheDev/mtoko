import { Link } from "wouter";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-secondary text-foreground text-center py-2 text-sm font-medium">
        Free standard shipping on orders over Tzs 75,000 🚚
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation - Left */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/women" className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase">
                Women
              </Link>
              <Link href="/men" className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase">
                Men
              </Link>
              <Link href="/accessories" className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase">
                Accessories
              </Link>
            </nav>

            {/* Logo - Center */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight uppercase">mtoko</span>
              </div>
            </Link>

            {/* Icons - Right */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </a>
              )}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {/* Cart count badge - placeholder */}
                  {/* <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span> */}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container py-4 flex flex-col gap-4">
              <Link 
                href="/women" 
                className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                href="/men" 
                className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                href="/accessories" 
                className="text-sm font-semibold hover:text-muted-foreground transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accessories
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="mt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={!searchQuery.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
