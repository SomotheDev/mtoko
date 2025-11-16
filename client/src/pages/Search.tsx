import { useLocation, useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Search() {
  const searchParams = new URLSearchParams(useSearch());
  const query = searchParams.get("q") || "";
  
  const { data: results, isLoading } = trpc.products.search.useQuery(
    { query },
    { enabled: query.length > 0 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-muted-foreground">
                Showing results for "{query}"
              </p>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && !query && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Enter a search term to find products
              </p>
            </div>
          )}

          {!isLoading && query && results && results.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl font-bold mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {results.length} {results.length === 1 ? "product" : "products"} found
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
