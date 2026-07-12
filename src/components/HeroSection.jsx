export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <img
        alt="Hero 12 July"
        className="w-full h-auto md:h-[85vh] md:min-h-[600px] object-cover object-center block"
        src="/Hero 12 July.png"
      />
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-surface/10 mix-blend-multiply pointer-events-none" />
    </section>
  )
}
