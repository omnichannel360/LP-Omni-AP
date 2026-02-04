export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantDescription: string;
  thickness: string;
  size: string;
  faceColor: string;
  priceCents: number;
  quantity: number;
}

const CART_KEY = "lp-omni-ap-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const existing = cart.find((c) => c.variantId === item.variantId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(
  variantId: string,
  quantity: number
): CartItem[] {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.variantId === variantId);
  if (idx !== -1) {
    if (quantity <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].quantity = quantity;
    }
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(variantId: string): CartItem[] {
  const cart = getCart().filter((c) => c.variantId !== variantId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
