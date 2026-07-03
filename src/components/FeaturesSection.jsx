import { Link } from 'react-router-dom'

const features = [
  {
    icon: 'menu_book',
    title: 'Tata Ibadah',
    iconColor: 'text-primary',
    bgIcon: 'bg-primary-container/20',
    path: '/tata-ibadah',
  },
  {
    icon: 'campaign',
    title: 'Warta Jemaat',
    iconColor: 'text-secondary',
    bgIcon: 'bg-secondary-container/20',
    path: '/warta',
  },
  {
    icon: 'photo_library',
    title: 'Galeri',
    iconColor: 'text-tertiary',
    bgIcon: 'bg-tertiary-container/20',
    path: '/galeri',
  },
  {
    icon: 'support_agent',
    title: 'Layanan',
    iconColor: 'text-primary',
    bgIcon: 'bg-primary-container/20',
    path: '/layanan',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto -mt-4 sm:-mt-8 relative z-10">
      {/* App-like Container */}
      <div className="bg-surface-container-lowest sm:bg-surface rounded-3xl p-4 sm:p-8 shadow-sm sm:shadow-lg border border-outline-variant/15 sm:border-outline-variant/20">
        
        {/* Optional Title for larger screens */}
        <div className="hidden sm:block text-center mb-6">
          <h2 className="font-headline-md text-[20px] text-on-surface">Akses Cepat</h2>
        </div>

        {/* 4 Columns Grid - Forces items to be side-by-side even on mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.path}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              {/* App Icon Box */}
              <div className={`w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-[1.15rem] sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                {/* Subtle colored background behind icon */}
                <div className={`absolute inset-0 ${f.bgIcon} opacity-50`}></div>
                
                {/* Icon */}
                <span className={`material-symbols-outlined icon-fill text-[28px] sm:text-[36px] ${f.iconColor} relative z-10`}>
                  {f.icon}
                </span>
              </div>
              
              {/* Text */}
              <span className="font-label-sm text-[10px] sm:text-[13px] text-on-surface font-medium text-center leading-tight px-0.5">
                {f.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
