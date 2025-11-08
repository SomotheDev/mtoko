import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Women's Section */}
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Women's</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/women/leggings" className="text-muted-foreground hover:text-foreground transition-colors">Leggings</Link></li>
              <li><Link href="/women/sports-bras" className="text-muted-foreground hover:text-foreground transition-colors">Sports Bras</Link></li>
              <li><Link href="/women/hoodies" className="text-muted-foreground hover:text-foreground transition-colors">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/women/shorts" className="text-muted-foreground hover:text-foreground transition-colors">Shorts</Link></li>
              <li><Link href="/women/tops" className="text-muted-foreground hover:text-foreground transition-colors">T-Shirts & Tops</Link></li>
            </ul>
          </div>

          {/* Men's Section */}
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Men's</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/men/tshirts" className="text-muted-foreground hover:text-foreground transition-colors">T-Shirts & Tops</Link></li>
              <li><Link href="/men/shorts" className="text-muted-foreground hover:text-foreground transition-colors">Shorts</Link></li>
              <li><Link href="/men/hoodies" className="text-muted-foreground hover:text-foreground transition-colors">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/men/joggers" className="text-muted-foreground hover:text-foreground transition-colors">Joggers</Link></li>
              <li><Link href="/men/tank-tops" className="text-muted-foreground hover:text-foreground transition-colors">Tank Tops</Link></li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Information</Link></li>
              <li><Link href="/help/returns" className="text-muted-foreground hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/help/size-guide" className="text-muted-foreground hover:text-foreground transition-colors">Size Guide</Link></li>
              <li><Link href="/help/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/help/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/sustainability" className="text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 mtoko. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
