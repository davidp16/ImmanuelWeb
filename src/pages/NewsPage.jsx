import { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/services/news')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data warta jemaat');
        return res.json();
      })
      .then(data => {
        setNewsList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavBar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">campaign</span>
          </div>
          <h1 className="font-display-md sm:font-display-lg text-3xl sm:text-4xl text-on-surface mb-4">Warta Jemaat</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
            Ikuti perkembangan, pengumuman, dan informasi pelayanan terbaru dari HKBP Immanuel Kutajaya.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <span className="material-symbols-outlined animate-spin text-5xl mb-4">autorenew</span>
            <p className="font-label-lg">Memuat warta...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-label-lg">{error}</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-surface-container p-12 rounded-3xl text-center border border-outline-variant/30 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">inbox</span>
            <h3 className="font-headline-md text-on-surface mb-2">Belum Ada Warta Jemaat</h3>
            <p className="font-body-md text-on-surface-variant">Saat ini belum ada warta jemaat terbaru yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {newsList.map((news) => (
              <div 
                key={news.id} 
                className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start group"
              >
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary-container text-primary flex items-center justify-center group-hover:scale-105 transition-transform hidden sm:flex">
                  <span className="material-symbols-outlined text-[32px]">newspaper</span>
                </div>
                
                <div className="flex-grow w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-3 py-1 rounded-full tracking-wider">
                      TERBARU
                    </span>
                    <p className="font-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {formatDate(news.date)}
                    </p>
                  </div>
                  
                  <h3 className="font-headline-md sm:text-2xl text-on-surface font-bold mb-3">
                    {news.title}
                  </h3>
                  
                  {news.description && (
                    <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
                      {news.description}
                    </p>
                  )}
                  
                  {news.fileUrl && (
                    <a 
                      href={news.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors font-label-md border border-outline-variant/30 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      Buka Dokumen Warta
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
