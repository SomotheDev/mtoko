import { useRoute } from "wouter";
import { useState } from "react";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  
  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const { isAuthenticated } = useAuth();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const addToWishlistMutation = trpc.wishlist.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to wishlist!");
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = JSON.parse(product.images);
  const sizes = JSON.parse(product.sizes);
  const colors = JSON.parse(product.colors);
  const tags = product.tags ? JSON.parse(product.tags) : [];
  const priceInTzs = (product.price / 100).toLocaleString();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    addToWishlistMutation.mutate({
      productId: product.id,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-secondary overflow-hidden">
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-secondary text-foreground text-xs px-3 py-1 uppercase font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold">Tzs {priceInTzs}</p>
              </div>

              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold uppercase">
                    Color: {selectedColor && <span className="font-normal">{selectedColor}</span>}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold uppercase">
                    Size: {selectedSize && <span className="font-normal">{selectedSize}</span>}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full font-bold uppercase"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full font-bold uppercase"
                  onClick={handleAddToWishlist}
                  disabled={addToWishlistMutation.isPending}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Product Details */}
              <div className="border-t border-border pt-6 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Category:</span>{" "}
                  <span className="capitalize">{product.gender}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Availability:</span>{" "}
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
