import { useState, useEffect } from 'react'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function WeeklySchedule() {
  const [activeDay, setActiveDay] = useState('Kamis')
  const [scheduleData, setScheduleData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services/schedules')
      .then(res => res.json())
      .then(data => {
        // Group by day
        const grouped = {}
        days.forEach(d => grouped[d] = [])
        if (data && Array.isArray(data)) {
          data.forEach(item => {
            if (grouped[item.day]) {
              grouped[item.day].push(item)
            }
          })
        }
        setScheduleData(grouped)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching schedules:", err)
        setLoading(false)
      })
  }, [])

  const activities = scheduleData[activeDay] || []

  const handlePrevDay = () => {
    const currentIndex = days.indexOf(activeDay)
    if (currentIndex > 0) setActiveDay(days[currentIndex - 1])
    else setActiveDay(days[days.length - 1])
  }

  const handleNextDay = () => {
    const currentIndex = days.indexOf(activeDay)
    if (currentIndex < days.length - 1) setActiveDay(days[currentIndex + 1])
    else setActiveDay(days[0])
  }

  // Safely scroll only the filter container, preventing whole page shift
  useEffect(() => {
    const activeBtn = document.getElementById(`day-btn-${activeDay}`)
    const container = document.getElementById('day-filter-container')
    
    if (activeBtn && container) {
      const containerWidth = container.offsetWidth
      const btnOffsetLeft = activeBtn.offsetLeft - container.offsetLeft
      const btnWidth = activeBtn.offsetWidth
      
      const scrollPos = btnOffsetLeft - (containerWidth / 2) + (btnWidth / 2)
      container.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      })
    }
  }, [activeDay])

  return (
    <section className="py-8 sm:py-lg md:py-xl px-4 sm:px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto overflow-hidden">
      <div className="mb-6 sm:mb-10 text-center">
        <h2 className="font-headline-md md:font-display-lg text-[22px] sm:text-headline-md md:text-[40px] text-on-surface mb-3 sm:mb-4">
          Jadwal Kegiatan Mingguan
        </h2>
        <p className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant max-w-2xl mx-auto">
          Jadwal rutin pelayanan dan persekutuan jemaat sepanjang minggu.
        </p>
      </div>

      {/* Integrated Schedule Container */}
      <div className="glass-panel rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 border border-white/60 relative overflow-hidden bg-white/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(14,165,233,0.1)] flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
        {/* Decorative blurred background elements */}
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-[#7dd3fc] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] opacity-20 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary-container rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] opacity-30 transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Daily Filter Navigation */}
        <div className="relative z-10 flex items-center md:items-stretch md:flex-col gap-1.5 sm:gap-2 md:w-64 md:border-r border-white/30 md:pr-8 shrink-0">
          
          {/* Mobile Prev Button */}
          <button 
            onClick={handlePrevDay} 
            className="md:hidden w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-surface-container-high rounded-full shrink-0 shadow-sm border border-white/80 dark:border-outline-variant/20 active:scale-95 transition-transform text-primary"
          >
             <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          {/* Scrollable Container */}
          <div id="day-filter-container" className="flex md:flex-col gap-1.5 sm:gap-2 overflow-x-auto md:overflow-visible pb-2 pt-2 md:pb-0 md:pt-0 scrollbar-hide flex-1 scroll-smooth">
            {days.map((day) => (
              <button
                key={day}
                id={`day-btn-${day}`}
                onClick={() => setActiveDay(day)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 md:px-5 md:text-left rounded-lg sm:rounded-xl md:rounded-2xl font-label-md text-[12px] sm:text-label-md transition-all duration-300 whitespace-nowrap ${
                  activeDay === day
                    ? 'bg-white/70 dark:bg-surface-container-highest text-primary shadow-sm border border-white/80 dark:border-outline-variant/30 backdrop-blur-md relative flex items-center justify-between group'
                    : 'text-on-surface-variant hover:bg-white/60 dark:hover:bg-surface-container-high'
                }`}
              >
                {day}
                {activeDay === day && (
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px] opacity-0 md:opacity-100 text-primary group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Next Button */}
          <button 
            onClick={handleNextDay} 
            className="md:hidden w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-surface-container-high rounded-full shrink-0 shadow-sm border border-white/80 dark:border-outline-variant/20 active:scale-95 transition-transform text-primary"
          >
             <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* Schedule Items Content Area */}
        <div className="relative z-10 flex-1 flex flex-col gap-3 sm:gap-4">
          <h3 className="font-headline-md text-[18px] sm:text-[20px] text-primary mb-1 sm:mb-2 hidden md:block">
            Kegiatan Hari {activeDay}
          </h3>

          {loading ? (
            <div className="bg-white/60 dark:bg-surface-container backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-white/60 dark:border-outline-variant/20 flex flex-col items-center justify-center min-h-[200px]">
              <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-primary mb-3 sm:mb-4 block animate-spin">
                autorenew
              </span>
              <p className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant">
                Memuat jadwal kegiatan...
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-white/60 dark:bg-surface-container backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-white/60 dark:border-outline-variant/20">
              <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-on-surface-variant/40 mb-3 sm:mb-4 block">
                event_busy
              </span>
              <p className="font-body-md text-[13px] sm:text-body-md text-on-surface-variant">
                Belum ada kegiatan terjadwal untuk hari {activeDay}.
              </p>
            </div>
          ) : (
            activities.map((activity, idx) => (
              <div
                key={idx}
                className="bg-white/60 dark:bg-surface-container backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-white/60 dark:border-outline-variant/20 hover:bg-white/80 dark:hover:bg-surface-container-high hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${activity.iconBg} ${activity.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">{activity.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-headline-md text-[15px] sm:text-[18px] text-on-surface mb-0.5 sm:mb-1 truncate">
                      {activity.title}
                    </h4>
                    <p className="font-body-md text-[12px] sm:text-[14px] text-on-surface-variant truncate">
                      {activity.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 md:border-t-0 md:pt-0">
                  <span className="font-label-md text-[12px] sm:text-label-md text-primary">{activity.time}</span>
                  <span className="font-body-md text-[12px] sm:text-[14px] text-on-surface-variant">
                    {activity.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
