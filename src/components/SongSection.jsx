import { useState } from 'react'

export default function SongSection({ title, subtitle, apiEndpoint, placeholder, initialSongData = null }) {
  const [songNumber, setSongNumber] = useState('')
  const [songData, setSongData] = useState(initialSongData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSong = async (e) => {
    e.preventDefault()
    if (!songNumber.trim()) return

    setIsLoading(true)
    setError(null)
    setSongData(null)

    try {
      const response = await fetch(`/api/songs/${apiEndpoint}/${songNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Lagu tidak ditemukan.')
      }

      setSongData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-headline-lg text-[32px] sm:text-[40px] text-primary font-bold mb-4">
          {title}
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Search Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20 mb-8 max-w-2xl mx-auto">
        <form onSubmit={fetchSong} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              music_note
            </span>
            <input
              type="number"
              value={songNumber}
              onChange={(e) => setSongNumber(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-surface/50 border border-outline/20 rounded-2xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body-lg"
              min="1"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !songNumber}
            className="w-full sm:w-auto bg-primary text-on-primary rounded-2xl py-3 px-8 font-label-lg hover:shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">search</span>
                Cari Lagu
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-container/20 text-error rounded-2xl p-4 mb-8 text-center border border-error/20">
          <p className="font-body-md font-medium">{error}</p>
        </div>
      )}

      {/* Results */}
      {songData && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-sm border border-outline-variant/20 animate-fade-in text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          
          <h2 className="font-headline-md text-primary text-[24px] sm:text-[28px] font-bold mb-8 relative z-10">
            {songData.title}
          </h2>
          
          <div className="space-y-6 sm:space-y-8 font-body-lg text-on-surface/90 text-[16px] sm:text-[18px] leading-relaxed relative z-10 mx-auto max-w-2xl">
            {songData.lyrics.map((stanza, idx) => (
              <p key={idx} className="whitespace-pre-wrap">
                {stanza}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
