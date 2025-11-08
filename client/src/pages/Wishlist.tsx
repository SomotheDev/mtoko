import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems, isLoading } = trpc.wishlist.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();

  const removeItemMutation = trpc.wishlist.removeItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
      toast.success("Item removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const handleWishlistToggle = (productId: number) => {
    const item = wishlistItems?.find(item => item.productId === productId);
    if (item) {
      removeItemMutation.mutate({ itemId: item.id });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-3xl font-black uppercase mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your wishlist</p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="font-bold uppercase">
                Log In
              </Button>
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container">
            <h1 className="text-3xl font-black uppercase mb-8">Your Wishlist</h1>
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-3xl font-black uppercase mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-6">Your wishlist is empty</p>
            <Link href="/">
              <Button size="lg" className="font-bold uppercase">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-black uppercase mb-8">Your Wishlist</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item.product}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
