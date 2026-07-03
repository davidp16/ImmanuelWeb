export default function DevotionalSection() {
  return (
    <section className="py-8 sm:py-lg px-4 sm:px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto relative z-20 -mt-8 sm:-mt-12 md:-mt-20">
      <div className="glass-panel rounded-[20px] sm:rounded-[24px] p-1.5 sm:p-2 md:p-3 grid grid-cols-1 md:grid-cols-12 gap-1.5 sm:gap-2 md:gap-3 items-stretch">
        {/* Date Column */}
        <div className="col-span-1 md:col-span-4 bg-primary rounded-[16px] sm:rounded-[18px] p-4 sm:p-6 text-on-primary flex flex-col justify-between relative overflow-hidden shadow-inner">
          {/* Decorative blurred circle */}
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-primary-fixed rounded-full mix-blend-screen filter blur-[60px] opacity-40 transform translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 flex items-center gap-2 mb-3 sm:mb-4 opacity-90">
            <span className="material-symbols-outlined icon-fill text-[16px] sm:text-[18px]">menu_book</span>
            <span className="font-label-sm text-[11px] sm:text-label-sm tracking-widest uppercase">
              Renungan Hari Ini
            </span>
          </div>

          <div className="relative z-10 text-center py-3 sm:py-4 border-y border-white/20 my-auto">
            <span className="block font-label-sm text-[10px] sm:text-label-sm uppercase tracking-widest mb-1 opacity-80">
              Minggu
            </span>
            <span className="block font-display-lg text-[44px] sm:text-[56px] md:text-[64px] leading-none font-bold mb-1">
              14
            </span>
            <span className="block font-label-sm text-[10px] sm:text-label-sm uppercase tracking-widest opacity-80">
              Mei 2024
            </span>
          </div>

          <div className="relative z-10 mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            {/* Morning reading */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/90">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary-container/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                <span className="material-symbols-outlined icon-fill text-secondary-container text-[14px] sm:text-[16px]">
                  light_mode
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-[10px] sm:text-label-sm uppercase opacity-70">Pagi</p>
                <p className="font-label-md text-[12px] sm:text-label-sm truncate">Mazmur 147 : 12–20</p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Evening reading */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/90">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                <span className="material-symbols-outlined icon-fill text-tertiary-container text-[14px] sm:text-[16px]">
                  dark_mode
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-[10px] sm:text-label-sm uppercase opacity-70">Malam</p>
                <p className="font-label-md text-[12px] sm:text-label-sm truncate">Markus 1 : 29–34</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verse Column */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest/60 rounded-[16px] sm:rounded-[18px] p-4 sm:p-6 md:p-8 flex flex-col justify-center relative">
          <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-primary-container/40 absolute top-4 sm:top-6 left-4 sm:left-6 transform -scale-x-100 rotate-180">
            format_quote
          </span>

          <div className="relative z-10 pl-4 sm:pl-6 md:pl-10 border-l-[3px] sm:border-l-4 border-primary-container">
            <p className="font-headline-lg-mobile text-[18px] sm:text-[22px] md:text-[26px] text-on-surface leading-snug mb-3 sm:mb-4 italic text-opacity-90">
              &ldquo;Dan kiranya Tuhan menjadikan kamu bertambah-tambah dan berkelimpahan dalam kasih
              seorang terhadap yang lain dan terhadap semua orang, sama seperti kami juga mengasihi
              kamu.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-headline-md text-[15px] sm:text-[18px] text-primary">
                1 Tesalonika 3 : 12
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:block" />
              <span className="font-label-md text-[11px] sm:text-label-sm text-on-surface-variant">
                Terjemahan Baru
              </span>
            </div>
          </div>

          <p className="mt-4 sm:mt-5 font-body-md text-[13px] sm:text-[14px] text-on-surface-variant max-w-2xl leading-relaxed">
            Kasih bukanlah sekadar perasaan, melainkan tindakan nyata yang terus bertumbuh. Tuhan
            memanggil kita untuk melimpahkan kasih tidak hanya kepada mereka yang dekat, tetapi kepada
            semua orang, sebagai cerminan kasih-Nya yang sempurna kepada kita.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 rounded-xl bg-surface/50 border border-white/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-inner shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">calendar_month</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-md text-[12px] sm:text-label-sm text-on-surface">Almanak HKBP 2024</p>
                <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant">
                  Sumber Renungan
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 font-label-md text-[12px] sm:text-label-sm text-primary hover:text-surface-tint transition-colors group whitespace-nowrap">
              Baca Selengkapnya
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
