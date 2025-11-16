import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, categories, cartItems, wishlistItems, orders, orderItems, reviews, InsertReview } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products);
}

export async function getProductsByGender(gender: "women" | "men" | "unisex") {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.gender, gender));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.featured, 1));
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.categoryId, categoryId));
}

export async function searchProducts(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query.toLowerCase()}%`;
  const { like, or } = await import('drizzle-orm');
  
  return await db.select().from(products).where(
    or(
      like(products.name, searchTerm),
      like(products.description, searchTerm),
      like(products.tags, searchTerm)
    )
  );
}

// Category queries
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories);
}

export async function getCategoriesByGender(gender: "women" | "men" | "unisex") {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).where(eq(categories.gender, gender));
}

// Cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const items = await db
    .select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      size: cartItems.size,
      color: cartItems.color,
      createdAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
  return items;
}

export async function addToCart(userId: number, productId: number, quantity: number, size?: string, color?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(cartItems).values({ userId, productId, quantity, size, color });
}

export async function updateCartItem(itemId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
}

export async function removeFromCart(itemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Wishlist queries
export async function getWishlistItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const items = await db
    .select({
      id: wishlistItems.id,
      userId: wishlistItems.userId,
      productId: wishlistItems.productId,
      createdAt: wishlistItems.createdAt,
      product: products,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId));
  return items;
}

export async function addToWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(wishlistItems).values({ userId, productId });
}

export async function removeFromWishlist(itemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(wishlistItems).where(eq(wishlistItems.id, itemId));
}

// Order queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function createOrder(userId: number, totalAmount: number, shippingAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Create the order
  const result = await db.insert(orders).values({ userId, totalAmount, shippingAddress });
  const orderId = Number((result as any).insertId);
  
  // Get cart items with product prices
  const cartItemsList = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      size: cartItems.size,
      color: cartItems.color,
      price: products.price,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
  
  // Create order items from cart
  if (cartItemsList.length > 0) {
    await db.insert(orderItems).values(
      cartItemsList.map(item => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        size: item.size,
        color: item.color,
      }))
    );
    
    // Clear the cart
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
  
  return { orderId };
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Review queries
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const reviewsWithUsers = await db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(reviews.createdAt);
  
  return reviewsWithUsers;
}

export async function getProductAverageRating(productId: number) {
  const db = await getDb();
  if (!db) return { averageRating: 0, reviewCount: 0 };
  
  const { avg, count } = await import('drizzle-orm');
  const result = await db
    .select({
      averageRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));
  
  return {
    averageRating: result[0]?.averageRating ? Number(result[0].averageRating) : 0,
    reviewCount: result[0]?.reviewCount ? Number(result[0].reviewCount) : 0,
  };
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reviews).values(review);
  return { success: true };
}

export async function hasUserReviewedProduct(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const { and } = await import('drizzle-orm');
  const result = await db
    .select()
    .from(reviews)
    .where(and(
      eq(reviews.userId, userId),
      eq(reviews.productId, productId)
    ))
    .limit(1);
  
  return result.length > 0;
}
