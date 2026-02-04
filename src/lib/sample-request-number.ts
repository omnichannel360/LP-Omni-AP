export function generateSampleRequestNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `SMP-${date}-${seq}`;
}
