export interface SampleCartItem {
  productId: string;
  productName: string;
  colorways: { code: string; name: string; hex: string }[];
}

const SAMPLE_CART_KEY = "lp-omni-ap-sample-cart";

export function getSampleCart(): SampleCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAMPLE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSampleCart(items: SampleCartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAMPLE_CART_KEY, JSON.stringify(items));
}

export function addSampleToCart(item: SampleCartItem): SampleCartItem[] {
  const cart = getSampleCart();
  const existing = cart.find((c) => c.productId === item.productId);
  if (existing) {
    // Merge colorways, avoiding duplicates
    const existingCodes = new Set(existing.colorways.map((c) => c.code));
    item.colorways.forEach((cw) => {
      if (!existingCodes.has(cw.code)) {
        existing.colorways.push(cw);
      }
    });
  } else {
    cart.push(item);
  }
  saveSampleCart(cart);
  return cart;
}

export function removeSampleFromCart(productId: string): SampleCartItem[] {
  const cart = getSampleCart().filter((c) => c.productId !== productId);
  saveSampleCart(cart);
  return cart;
}

export function removeSampleColorway(
  productId: string,
  colorCode: string
): SampleCartItem[] {
  const cart = getSampleCart();
  const item = cart.find((c) => c.productId === productId);
  if (item) {
    item.colorways = item.colorways.filter((c) => c.code !== colorCode);
    if (item.colorways.length === 0) {
      return removeSampleFromCart(productId);
    }
  }
  saveSampleCart(cart);
  return cart;
}

export function clearSampleCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SAMPLE_CART_KEY);
}

export function getSampleCartCount(items: SampleCartItem[]): number {
  return items.reduce((sum, i) => sum + i.colorways.length, 0);
}
