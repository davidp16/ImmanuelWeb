import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TopNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Handle outside click for dropdown (optional, but good UX)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check local storage or system preference on mount
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDarkMode(true)
    }
  }

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Koinonia', href: '/koinonia' },
    { label: 'Marturia', href: '/marturia' },
    { label: 'Diakonia', href: '/diakonia' },
  ]

  const otherLinks = [
    { label: 'Layanan Jemaat', href: '/layanan' },
    { label: 'Warta Jemaat', href: '/warta' },
    { label: 'Tata Ibadah', href: '/tata-ibadah' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Alkitab', href: '/alkitab' },
    { label: 'Buku Ende', href: '/buku-ende' },
    { label: 'Kidung Jemaat', href: '/kidung-jemaat' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between w-full px-4 sm:px-margin-mobile md:px-margin-desktop py-3 max-w-7xl mx-auto md:grid md:grid-cols-3">
        {/* Brand (left) */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <span className={`material-symbols-outlined text-[28px] sm:text-[32px] icon-fill transition-colors duration-500 shrink-0 ${scrolled ? 'text-primary' : 'text-white'}`}>
            church
          </span>
          <div className="flex flex-col min-w-0">
            <span className={`font-headline-md text-[14px] sm:text-[18px] md:text-[20px] font-bold tracking-tight leading-tight transition-colors duration-500 truncate ${scrolled ? 'text-primary' : 'text-white'}`}>
              HKBP Immanuel Kutajaya
            </span>
            <span className={`font-label-sm text-[10px] sm:text-[11px] tracking-wide transition-colors duration-500 ${scrolled ? 'text-on-surface-variant' : 'text-white/80'}`}>
              Horas • Soli Deo Gloria
            </span>
          </div>
        </div>

        {/* Navigation Links (centered on desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              className={`font-medium font-label-md text-label-md transition-colors duration-500 whitespace-nowrap ${
                scrolled
                  ? 'text-on-surface-variant hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
              to={link.href}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Dropdown Lainnya Desktop */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 font-medium font-label-md text-label-md transition-colors duration-500 whitespace-nowrap focus:outline-none ${
                scrolled
                  ? 'text-on-surface-variant hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Lainnya
              <span className="material-symbols-outlined text-[18px]">
                {dropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full mt-4 -ml-4 w-48 rounded-2xl shadow-xl bg-white dark:bg-surface border border-outline-variant/30 py-2 flex flex-col z-50 animate-fade-in-up">
                {otherLinks.map((link) => (
                  <Link
                    key={link.label}
                    className="px-4 py-2.5 font-label-md text-[14px] text-on-surface hover:bg-primary-container/30 hover:text-primary transition-colors"
                    to={link.href}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions (right) */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto md:justify-end">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 sm:p-2 rounded-full transition-colors duration-500 ${
              scrolled 
                ? 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50' 
                : 'text-white hover:text-white/80 hover:bg-white/10'
            }`}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[28px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-1.5 sm:p-2 rounded-full transition-colors duration-500 ${
              scrolled 
                ? 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50' 
                : 'text-white hover:text-white/80 hover:bg-white/10'
            }`}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              if (mobileMenuOpen) setDropdownOpen(false)
            }}
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t animate-fade-in-up ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-outline-variant/30'
            : 'bg-black/30 backdrop-blur-xl border-white/20'
        }`}>
          <nav className="flex flex-col gap-1 px-4 sm:px-margin-mobile py-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`font-label-md text-label-md transition-colors duration-300 py-3 px-4 rounded-xl ${
                  scrolled
                    ? 'text-on-surface-variant hover:text-primary hover:bg-primary-container/20'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dropdown Lainnya Mobile */}
            <div className="flex flex-col w-full dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-between font-label-md text-label-md transition-colors duration-300 py-3 px-4 rounded-xl w-full text-left focus:outline-none ${
                    scrolled
                      ? 'text-on-surface-variant hover:text-primary hover:bg-primary-container/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>Lainnya</span>
                <span className="material-symbols-outlined text-[18px] transition-transform duration-300" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>
              
              {dropdownOpen && (
                <div className="flex flex-col gap-1 pl-4 mt-1 overflow-hidden animate-fade-in">
                  {otherLinks.map((link) => (
                    <Link
                      key={link.label}
                      className={`font-label-md text-sm transition-colors duration-300 py-2.5 px-4 rounded-xl ${
                        scrolled
                          ? 'text-on-surface-variant hover:text-primary hover:bg-primary-container/20'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                      to={link.href}
                      onClick={() => {
                        setDropdownOpen(false)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
