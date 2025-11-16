import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "../../../drizzle/schema";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: number) => void;
}

export default function ProductCard({ product, onWishlistToggle }: ProductCardProps) {
  const images = JSON.parse(product.images);
  const tags = product.tags ? JSON.parse(product.tags) : [];
  const sizes = JSON.parse(product.sizes);
  const colors = JSON.parse(product.colors);
  const priceInTzs = (product.price / 100).toLocaleString();
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
      utils.cart.getItems.invalidate();
      setIsAdding(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to cart");
      setIsAdding(false);
    },
  });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsAdding(true);
    // Use first available size and color as defaults
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
      size: sizes[0],
      color: colors[0],
    });
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-none bg-transparent">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-background/90 text-foreground text-xs px-2 py-1 uppercase font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/90 hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(product.id);
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/90 hover:bg-background"
          onClick={handleQuickAdd}
          disabled={isAdding}
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.slug}`}>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-muted-foreground transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-bold">Tzs {priceInTzs}</p>
        </div>
      </Link>
    </Card>
  );
}
