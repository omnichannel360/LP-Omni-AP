export default function Home() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-banner.webm" type="video/webm" />
      </video>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/10" />
    </section>
  );
}
