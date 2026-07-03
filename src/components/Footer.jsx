import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low mt-12 sm:mt-xl w-full border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-gutter px-4 sm:px-margin-mobile md:px-margin-desktop py-10 sm:py-xl max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-3 sm:gap-4">
          <span className="font-headline-md text-[20px] sm:text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill">church</span>
            Immanuel
          </span>
          <p className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant opacity-80 mt-1 sm:mt-2">
            Gereja HKBP Immanuel Kutajaya. Berkarya dalam kasih, bertumbuh dalam iman.
          </p>
        </div>

        {/* Links Column */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <h4 className="font-label-md text-[13px] sm:text-label-md text-on-surface font-semibold mb-1 sm:mb-2">
              Tautan Cepat
            </h4>
            <a
              className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80"
              href="#"
            >
              Tentang Kami
            </a>
            <a
              className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80"
              href="#"
            >
              Jadwal Ibadah
            </a>
            <a
              className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80"
              href="#"
            >
              Galeri
            </a>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <h4 className="font-label-md text-[13px] sm:text-label-md text-on-surface font-semibold mb-1 sm:mb-2">
              Pelayanan
            </h4>
            <a
              className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80"
              href="#"
            >
              Donasi
            </a>
            <a
              className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80"
              href="#"
            >
              Kontak
            </a>
          </div>

          {/* Kontak & Address */}
          <div className="flex flex-col gap-2.5 sm:gap-3 col-span-2 md:col-span-1 mt-2 sm:mt-4 md:mt-0">
            <h4 className="font-label-md text-[13px] sm:text-label-md text-on-surface font-semibold mb-1 sm:mb-2">
              Kontak
            </h4>
            {/* Email */}
            <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
              <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px] shrink-0">mail</span>
              <a
                href="mailto:admin@hkbpimmanuelkutajaya.or.id"
                className="font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant hover:text-primary transition-colors break-all"
              >
                admin@hkbpimmanuelkutajaya.or.id
              </a>
            </div>
            {/* WhatsApp */}
            <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
              <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px] shrink-0">call</span>
              <a
                href="https://wa.me/6285159322093"
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant hover:text-primary transition-colors break-all"
              >
                085159322093
              </a>
            </div>
            {/* Address */}
            <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
              <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px] mt-0.5 shrink-0">location_on</span>
              <p className="font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant">
                Ruko Regency 2 Blok AB 1 No.38, Gelam Jaya, Pasar Kemis, Kabupaten Tangerang,
                Banten
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant/30 px-4 sm:px-margin-mobile md:px-margin-desktop py-4 sm:py-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-3">
        <p className="font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant">
          © 2026 HKBP Immanuel Kutajaya. All Rights Reserved.
        </p>
        <div className="flex gap-3 sm:gap-4">
          {/* Instagram */}
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Instagram">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="Facebook">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z"/>
            </svg>
          </a>
          {/* TikTok */}
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="TikTok">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#" aria-label="YouTube">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
