import { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function LiturgyPage() {
  const [liturgies, setLiturgies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/services/liturgy')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data tata ibadah');
        return res.json();
      })
      .then(data => {
        setLiturgies(data);
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
            <span className="material-symbols-outlined text-[32px]">menu_book</span>
          </div>
          <h1 className="font-display-md sm:font-display-lg text-3xl sm:text-4xl text-on-surface mb-4">Tata Ibadah</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
            Unduh tata ibadah minggu ini dan mari persiapkan hati kita untuk beribadah bersama.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <span className="material-symbols-outlined animate-spin text-5xl mb-4">autorenew</span>
            <p className="font-label-lg">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-label-lg">{error}</p>
          </div>
        ) : liturgies.length === 0 ? (
          <div className="bg-surface-container p-12 rounded-3xl text-center border border-outline-variant/30 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">inbox</span>
            <h3 className="font-headline-md text-on-surface mb-2">Belum Ada Tata Ibadah</h3>
            <p className="font-body-md text-on-surface-variant">Saat ini belum ada tata ibadah yang diunggah oleh majelis jemaat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liturgies.map((liturgy) => (
              <div 
                key={liturgy.id} 
                className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">auto_stories</span>
                  </div>
                  <span className="bg-surface-container-highest text-on-surface-variant text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {new Date(liturgy.date).getFullYear()}
                  </span>
                </div>
                
                <h3 className="font-headline-sm text-on-surface font-bold mb-2 line-clamp-2">
                  {liturgy.title}
                </h3>
                <p className="font-body-sm text-primary mb-6 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {formatDate(liturgy.date)}
                </p>
                
                <div className="mt-auto pt-4 border-t border-outline-variant/20">
                  <a 
                    href={liturgy.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Buka Dokumen
                  </a>
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
