export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  return `APA-${segment()}-${segment()}`;
}
