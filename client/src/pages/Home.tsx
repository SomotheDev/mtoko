import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = trpc.products.getFeatured.useQuery();
  const { data: womenProducts, isLoading: womenLoading } = trpc.products.getByGender.useQuery({ gender: "women" });
  const { data: menProducts, isLoading: menLoading } = trpc.products.getByGender.useQuery({ gender: "men" });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-black text-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero-banner.jpg"
              alt="Hero Banner"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="relative container h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black uppercase mb-4 tracking-tight">
                NEW IN: COSY LUXE
              </h1>
              <p className="text-xl mb-8 text-white/90">
                All turning heads in burgundy, this season's hottest hue.
              </p>
              <div className="flex gap-4">
                <Link href="/women">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold uppercase">
                    Shop Women
                  </Button>
                </Link>
                <Link href="/men">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-bold uppercase">
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm uppercase text-muted-foreground mb-1">Featured</p>
                  <h2 className="text-3xl font-black uppercase">NEW IN</h2>
                </div>
                <Link href="/products">
                  <Button variant="ghost" className="group">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Women's Section */}
        {womenProducts && womenProducts.length > 0 && (
          <section className="py-16 bg-secondary">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm uppercase text-muted-foreground mb-1">Women's</p>
                  <h2 className="text-3xl font-black uppercase">SHOP WOMEN</h2>
                </div>
                <Link href="/women">
                  <Button variant="ghost" className="group">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {womenProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Men's Section */}
        {menProducts && menProducts.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm uppercase text-muted-foreground mb-1">Men's</p>
                  <h2 className="text-3xl font-black uppercase">SHOP MEN</h2>
                </div>
                <Link href="/men">
                  <Button variant="ghost" className="group">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container">
            <h2 className="text-3xl font-black uppercase text-center mb-12">Shop By Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/women">
                <div className="group relative h-80 overflow-hidden bg-secondary cursor-pointer">
                  <img
                    src="/images/category-women.jpg"
                    alt="Women's Collection"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-2xl font-black uppercase mb-2">Women</h3>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </Link>
              <Link href="/men">
                <div className="group relative h-80 overflow-hidden bg-secondary cursor-pointer">
                  <img
                    src="/images/category-men.jpg"
                    alt="Men's Collection"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-2xl font-black uppercase mb-2">Men</h3>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </Link>
              <Link href="/accessories">
                <div className="group relative h-80 overflow-hidden bg-secondary cursor-pointer">
                  <img
                    src="/images/category-accessories.jpg"
                    alt="Accessories Collection"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-2xl font-black uppercase mb-2">Accessories</h3>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
