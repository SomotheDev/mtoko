import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function Men() {
  const { data: products, isLoading } = trpc.products.getByGender.useQuery({ gender: "men" });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-12">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-black uppercase">Men's Collection</h1>
            <p className="text-muted-foreground mt-2">Discover our latest men's activewear</p>
          </div>
        </div>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
