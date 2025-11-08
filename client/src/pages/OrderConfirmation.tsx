import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderId");
  const orderId = params?.orderId ? parseInt(params.orderId) : 0;
  
  const { data: orderItems, isLoading } = trpc.orders.getOrderItems.useQuery({ orderId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-2xl">
            <Skeleton className="h-64 w-full" />
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
        <div className="container max-w-2xl">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-black uppercase mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>

            <div className="bg-secondary p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold">#{orderId}</p>
            </div>

            {orderItems && orderItems.length > 0 && (
              <div className="text-left mb-6">
                <h2 className="text-lg font-bold uppercase mb-4">Order Items</h2>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <p className="font-semibold">Product #{item.productId}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                          {item.size && ` | Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`}
                        </p>
                      </div>
                      <p className="font-bold">
                        Tzs {((item.priceAtPurchase * item.quantity) / 100).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="font-bold uppercase w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account">
                <Button size="lg" variant="outline" className="font-bold uppercase w-full sm:w-auto">
                  View Orders
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
