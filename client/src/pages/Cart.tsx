import { Link } from "wouter";
import { Trash2, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { data: cartItems, isLoading } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();

  const updateItemMutation = trpc.cart.updateItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Item removed from cart");
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-3xl font-black uppercase mb-4">Your Cart</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your cart</p>
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
            <h1 className="text-3xl font-black uppercase mb-8">Your Cart</h1>
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-3xl font-black uppercase mb-4">Your Cart</h1>
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 75000 ? 0 : 5000; // Free shipping over Tzs 75,000
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-black uppercase mb-8">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const images = JSON.parse(item.product.images);
                const priceInTzs = (item.product.price / 100).toLocaleString();
                const totalPrice = ((item.product.price * item.quantity) / 100).toLocaleString();

                return (
                  <div key={item.id} className="flex gap-4 border-b border-border pb-6">
                    <Link href={`/product/${item.product.slug}`}>
                      <div className="w-24 h-32 bg-secondary overflow-hidden flex-shrink-0">
                        <img
                          src={images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 space-y-2">
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-semibold hover:text-muted-foreground transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> | </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                      <p className="font-bold">Tzs {priceInTzs}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateItemMutation.mutate({
                                  itemId: item.id,
                                  quantity: item.quantity - 1,
                                });
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              updateItemMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              });
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            removeItemMutation.mutate({ itemId: item.id });
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">Tzs {totalPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 space-y-4 sticky top-4">
                <h2 className="text-xl font-black uppercase">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Tzs {(subtotal / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `Tzs ${(shipping / 100).toLocaleString()}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add Tzs {((75000 - subtotal) / 100).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Tzs {(total / 100).toLocaleString()}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full font-bold uppercase">
                  Checkout
                </Button>

                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full font-bold uppercase">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
