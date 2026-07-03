import { useState, useMemo, useEffect, useRef } from 'react'
import { bibleBooks, uiLabels } from '../data/bibleData'

// ───────────────────────────────────────────
// Animated number counter for stats
// ───────────────────────────────────────────
function AnimatedCount({ target, duration = 1200 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const step = Math.ceil(target / (duration / 16))
          const interval = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(interval)
            } else {
              setCount(start)
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

// ───────────────────────────────────────────
// Category icons for book groups
// ───────────────────────────────────────────
function getBookCategory(index, isOT) {
  if (isOT) {
    if (index < 5) return { icon: 'history_edu', color: 'text-primary', bg: 'bg-primary-container/40', label: 'Taurat' }
    if (index < 17) return { icon: 'castle', color: 'text-secondary', bg: 'bg-secondary-container/40', label: 'Sejarah' }
    if (index < 22) return { icon: 'lyrics', color: 'text-tertiary', bg: 'bg-tertiary-container/40', label: 'Puisi' }
    if (index < 27) return { icon: 'record_voice_over', color: 'text-primary', bg: 'bg-primary-container/40', label: 'Nabi Besar' }
    return { icon: 'campaign', color: 'text-secondary', bg: 'bg-secondary-container/40', label: 'Nabi Kecil' }
  } else {
    if (index < 4) return { icon: 'auto_stories', color: 'text-primary', bg: 'bg-primary-container/40', label: 'Injil' }
    if (index < 5) return { icon: 'directions_walk', color: 'text-secondary', bg: 'bg-secondary-container/40', label: 'Sejarah' }
    if (index < 18) return { icon: 'mail', color: 'text-tertiary', bg: 'bg-tertiary-container/40', label: 'Surat' }
    return { icon: 'visibility', color: 'text-primary', bg: 'bg-primary-container/40', label: 'Nubuatan' }
  }
}

export default function BibleSection() {
  const [lang, setLang] = useState('indonesia')
  const [testament, setTestament] = useState('old')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef(null)

  const data = bibleBooks[lang]
  const labels = uiLabels[lang]
  const currentTestament = testament === 'old' ? data.oldTestament : data.newTestament

  // Filter books based on search
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return currentTestament.books
    return currentTestament.books.filter((book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.abbr.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentTestament.books, searchQuery])

  // Stats
  const totalBooks = data.oldTestament.books.length + data.newTestament.books.length
  const totalChapters =
    data.oldTestament.books.reduce((sum, b) => sum + b.chapters, 0) +
    data.newTestament.books.reduce((sum, b) => sum + b.chapters, 0)

  // Smooth language switch
  const handleLangSwitch = (newLang) => {
    if (newLang === lang) return
    setIsTransitioning(true)
    setTimeout(() => {
      setLang(newLang)
      setSearchQuery('')
      setSelectedBook(null)
      setIsTransitioning(false)
    }, 200)
  }

  // Smooth testament switch
  const handleTestamentSwitch = (t) => {
    if (t === testament) return
    setIsTransitioning(true)
    setTimeout(() => {
      setTestament(t)
      setSearchQuery('')
      setSelectedBook(null)
      setIsTransitioning(false)
    }, 200)
  }

  return (
    <section
      ref={sectionRef}
      id="alkitab"
      className="py-10 sm:py-lg md:py-xl px-4 sm:px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto"
    >
      {/* ─── Section Header ─── */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/30 border border-primary-container/50 mb-4 sm:mb-6">
          <span className="material-symbols-outlined icon-fill text-primary text-[18px]">auto_stories</span>
          <span className="font-label-md text-[12px] sm:text-label-sm text-primary tracking-wide uppercase">
            {data.version}
          </span>
        </div>
        <h2 className="font-headline-md md:font-display-lg text-[24px] sm:text-headline-md md:text-[44px] text-on-surface mb-3 sm:mb-4">
          {labels.title}
        </h2>
        <p className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant max-w-2xl mx-auto">
          {labels.subtitle}
        </p>
      </div>

      {/* ─── Language Toggle ─── */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex p-1 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-sm">
          {Object.entries(bibleBooks).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleLangSwitch(key)}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-label-md text-[13px] sm:text-label-md transition-all duration-300
                ${lang === key
                  ? 'bg-primary text-on-primary shadow-md scale-[1.02]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }
              `}
            >
              <span className="text-[16px]">{val.flag}</span>
              <span className="hidden sm:inline">{val.label}</span>
              <span className="sm:hidden">{val.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-xl mx-auto">
        <div className="glass-panel rounded-xl p-3 sm:p-4 text-center group hover:bg-white/60 transition-all duration-300">
          <span className="block font-headline-md text-[20px] sm:text-[28px] text-primary mb-0.5">
            <AnimatedCount target={totalBooks} />
          </span>
          <span className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider">
            {labels.totalBooks}
          </span>
        </div>
        <div className="glass-panel rounded-xl p-3 sm:p-4 text-center group hover:bg-white/60 transition-all duration-300">
          <span className="block font-headline-md text-[20px] sm:text-[28px] text-secondary mb-0.5">
            <AnimatedCount target={totalChapters} duration={1800} />
          </span>
          <span className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider">
            {labels.chapters}
          </span>
        </div>
        <div className="glass-panel rounded-xl p-3 sm:p-4 text-center group hover:bg-white/60 transition-all duration-300">
          <span className="block font-headline-md text-[20px] sm:text-[28px] text-tertiary mb-0.5">2</span>
          <span className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider">
            {lang === 'indonesia' ? 'Bahasa' : 'Hata'}
          </span>
        </div>
      </div>

      {/* ─── Testament Tabs + Search ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        {/* Testament Tabs */}
        <div className="flex p-1 rounded-xl bg-surface-container-high/50 border border-outline-variant/20">
          <button
            onClick={() => handleTestamentSwitch('old')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-label-md text-[12px] sm:text-label-md transition-all duration-300
              ${testament === 'old'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            <span>{labels.oldTestament}</span>
            <span className="text-[10px] opacity-60">({currentTestament.books.length === data.oldTestament.books.length && testament === 'old' ? data.oldTestament.books.length : data.oldTestament.books.length})</span>
          </button>
          <button
            onClick={() => handleTestamentSwitch('new')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-label-md text-[12px] sm:text-label-md transition-all duration-300
              ${testament === 'new'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            <span>{labels.newTestament}</span>
            <span className="text-[10px] opacity-60">({data.newTestament.books.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/60">
            search
          </span>
          <input
            type="text"
            placeholder={labels.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 font-body-md text-[13px] sm:text-[14px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container/50 transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant/60 hover:text-on-surface transition-colors"
            >
              close
            </button>
          )}
        </div>
      </div>

      {/* ─── Selected Book → Chapter Picker ─── */}
      {selectedBook && (
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="glass-panel rounded-2xl p-5 sm:p-6 md:p-8">
            {/* Back button + Book Title */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <button
                onClick={() => setSelectedBook(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-primary-container/30 transition-all duration-300 group"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                  arrow_back
                </span>
              </button>
              <div>
                <h3 className="font-headline-md text-[18px] sm:text-[22px] text-on-surface">
                  {selectedBook.name}
                </h3>
                <p className="font-label-sm text-[11px] sm:text-[12px] text-on-surface-variant">
                  {selectedBook.chapters} {labels.chapters} • {labels.selectChapter}
                </p>
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 sm:gap-2.5">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  className="aspect-square rounded-xl bg-surface-container-lowest border border-outline-variant/20 font-label-md text-[13px] sm:text-[14px] text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Books Grid ─── */}
      {!selectedBook && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3 block">
                search_off
              </span>
              <p className="font-body-md text-[14px] text-on-surface-variant">
                {lang === 'indonesia' ? 'Kitab tidak ditemukan' : 'Kitab ndang jumpang'}
              </p>
            </div>
          )}

          {filteredBooks.map((book, index) => {
            const originalIndex = currentTestament.books.indexOf(book)
            const category = getBookCategory(originalIndex, testament === 'old')

            return (
              <button
                key={book.name}
                onClick={() => setSelectedBook(book)}
                className="group glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left hover:bg-white/60 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Book Icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${category.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined icon-fill ${category.color} text-[20px] sm:text-[24px]`}>
                    {category.icon}
                  </span>
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline-md text-[14px] sm:text-[16px] text-on-surface truncate mb-0.5 group-hover:text-primary transition-colors duration-300">
                    {book.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant">
                      {book.abbr}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-outline-variant" />
                    <span className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant">
                      {book.chapters} {labels.chapters}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1">
                  chevron_right
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ─── Bottom Info ─── */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 text-on-surface-variant/60">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span className="font-label-sm text-[11px] sm:text-[12px]">
            {lang === 'indonesia'
              ? 'Konten ayat akan segera tersedia dalam pembaruan selanjutnya.'
              : 'Isi ni ayat laho ro di pambaruan na naeng ro.'}
          </span>
        </div>
      </div>
    </section>
  )
}
