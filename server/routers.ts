import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    getAll: publicProcedure.query(async () => {
      const db = await import('./db');
      return db.getAllProducts();
    }),
    getByGender: publicProcedure
      .input(z.object({ gender: z.enum(["women", "men", "unisex"]) }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getProductsByGender(input.gender);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getProductBySlug(input.slug);
      }),
    getFeatured: publicProcedure.query(async () => {
      const db = await import('./db');
      return db.getFeaturedProducts();
    }),
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getProductsByCategory(input.categoryId);
      }),
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.searchProducts(input.query);
      }),
  }),

  categories: router({
    getAll: publicProcedure.query(async () => {
      const db = await import('./db');
      return db.getAllCategories();
    }),
    getByGender: publicProcedure
      .input(z.object({ gender: z.enum(["women", "men", "unisex"]) }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getCategoriesByGender(input.gender);
      }),
  }),

  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      const db = await import('./db');
      return db.getCartItems(ctx.user.id);
    }),
    addItem: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        size: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db');
        await db.addToCart(ctx.user.id, input.productId, input.quantity, input.size, input.color);
        return { success: true };
      }),
    updateItem: protectedProcedure
      .input(z.object({ itemId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input }) => {
        const db = await import('./db');
        await db.updateCartItem(input.itemId, input.quantity);
        return { success: true };
      }),
    removeItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import('./db');
        await db.removeFromCart(input.itemId);
        return { success: true };
      }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await import('./db');
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  wishlist: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      const db = await import('./db');
      return db.getWishlistItems(ctx.user.id);
    }),
    addItem: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db');
        await db.addToWishlist(ctx.user.id, input.productId);
        return { success: true };
      }),
    removeItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import('./db');
        await db.removeFromWishlist(input.itemId);
        return { success: true };
      }),
  }),

  orders: router({
    getUserOrders: protectedProcedure.query(async ({ ctx }) => {
      const db = await import('./db');
      return db.getUserOrders(ctx.user.id);
    }),
    getOrderItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getOrderItems(input.orderId);
      }),
    createOrder: protectedProcedure
      .input(z.object({
        totalAmount: z.number(),
        shippingAddress: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db');
        return db.createOrder(ctx.user.id, input.totalAmount, input.shippingAddress);
      }),
  }),

  reviews: router({
    getProductReviews: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getProductReviews(input.productId);
      }),
    getProductRating: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const db = await import('./db');
        return db.getProductAverageRating(input.productId);
      }),
    createReview: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db');
        // Check if user already reviewed this product
        const hasReviewed = await db.hasUserReviewedProduct(ctx.user.id, input.productId);
        if (hasReviewed) {
          throw new Error("You have already reviewed this product");
        }
        return db.createReview({
          userId: ctx.user.id,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
