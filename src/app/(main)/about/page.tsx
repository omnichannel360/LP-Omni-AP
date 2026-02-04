import Link from "next/link";

const features = [
  {
    title: "Australia Made Panel",
    description:
      "We manufacture locally, with adherence to strict Australian manufacturing standards.",
    icon: (
      <svg className="h-16 w-16 text-[#e8751a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
      </svg>
    ),
  },
  {
    title: "Cost-Effective",
    description:
      "Choose from our extensive range of cost-effective options which balance quality and affordability.",
    icon: (
      <svg className="h-16 w-16 text-[#e8751a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
  {
    title: "Group 1 to 3 Fire Rated",
    description:
      "Explore our comprehensive selection of panels rated Group 1, 2 or 3 to comply with stringent Australian building standards.",
    icon: (
      <svg className="h-16 w-16 text-[#e8751a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
      </svg>
    ),
  },
  {
    title: "Extensive Product Range",
    description:
      "You'll find the perfect solution for any project amongst our range of products, finishes, sizes and colours.",
    icon: (
      <svg className="h-16 w-16 text-[#e8751a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
      </svg>
    ),
  },
  {
    title: "Industry Experts",
    description:
      "With two decades of manufacturing & design experience, we are an industry leader dedicated to delivering excellence in both products and services.",
    icon: (
      <svg className="h-16 w-16 text-[#e8751a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#333]">
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-2 lg:px-10">
          {/* Text */}
          <div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">About Us</h1>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/80">
              <p>
                Acoustic Panels Australia Pty Ltd is an Australian owned and operated business.
                Our company was established after many years of experience in industrial
                manufacturing. We have expert knowledge of industry requirements, new technologies
                and commercial design processes.
              </p>
              <p>
                We strive to be competitive and to offer the best quality products, to meet our
                clients&apos; acoustic needs. From small projects to large, we can accommodate any
                requirements and tailor solutions to your specific design. We pride ourselves on
                maintaining the most up to date equipment, with cutting edge machinery for creating
                and enhancing decorative solutions.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-8 inline-block rounded-sm border border-white/80 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
            >
              See Our Product Range
            </Link>
          </div>

          {/* Video Placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-lg bg-black/50 border border-white/10">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/videos/about-us.webm" type="video/webm" />
              </video>
              {/* Fallback if video not yet uploaded */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-xs text-white/20">Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AP Acoustic Section */}
      <section className="bg-[#111] py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
            WHY <span className="text-[#e8751a]">ACOUSTIC PANELS AUSTRALIA</span>
          </h2>

          {/* Top row — 3 features */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.slice(0, 3).map((f) => (
              <div key={f.title} className="text-center">
                <div className="mb-4 flex justify-center">{f.icon}</div>
                <h3 className="mb-3 text-lg font-bold text-[#e8751a]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom row — 2 features */}
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:px-20">
            {features.slice(3).map((f) => (
              <div key={f.title} className="text-center">
                <div className="mb-4 flex justify-center">{f.icon}</div>
                <h3 className="mb-3 text-lg font-bold text-[#e8751a]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{f.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-sm border border-white/40 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white/80 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
