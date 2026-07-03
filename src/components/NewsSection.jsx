import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NewsSection() {
  const sliderRef = useRef(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services/activities')
      .then(res => res.json())
      .then(data => {
        setActivities(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching activities:', err)
        setLoading(false)
      })
  }, [])

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-6 sm:py-8 md:py-12 px-0 sm:px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto overflow-hidden">
      <div className="mb-4 sm:mb-6 flex justify-between items-center px-4 sm:px-0">
        <h2 className="font-headline-md md:font-display-lg text-[20px] sm:text-[24px] md:text-[32px] text-on-surface font-bold">
          Informasi &amp; Kegiatan
        </h2>
        <a 
          href="#" 
          className="flex items-center gap-1 text-[12px] sm:text-[14px] text-primary font-medium bg-primary/10 hover:bg-primary/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors"
        >
          Lihat semua <span className="material-symbols-outlined text-[16px] sm:text-[18px]">chevron_right</span>
        </a>
      </div>

      <div className="relative group w-full">
        {/* Prev Button (Hidden on Mobile) */}
        <button 
          onClick={scrollLeft}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface dark:bg-surface-container-highest shadow-md rounded-full items-center justify-center text-on-surface hover:text-primary transition-all border border-outline-variant/20 opacity-0 group-hover:opacity-100"
          aria-label="Geser ke kiri"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {/* Slider Track */}
        <div 
          ref={sliderRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-0 pb-4 scroll-smooth"
        >
          {loading ? (
            <div className="w-full text-center py-10">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="w-full text-center py-10 bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface-variant font-body-md">
              Belum ada informasi kegiatan terbaru.
            </div>
          ) : (
            activities.map((news) => (
              <Link 
                to={`/kegiatan/${news.id}`}
                key={news.id} 
                className="snap-start shrink-0 w-[85%] sm:w-[45%] md:w-[31.5%] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 bg-surface-container-lowest block group hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-full aspect-[2/1] md:aspect-[21/9] bg-surface-container-highest relative overflow-hidden">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title || 'Banner Info'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <h3 className="text-white font-headline-sm font-bold line-clamp-1">{news.title}</h3>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Next Button (Hidden on Mobile) */}
        <button 
          onClick={scrollRight}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-surface dark:bg-surface-container-highest shadow-md rounded-full items-center justify-center text-on-surface hover:text-primary transition-all border border-outline-variant/20 opacity-0 group-hover:opacity-100"
          aria-label="Geser ke kanan"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  )
}
