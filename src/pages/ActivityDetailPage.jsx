import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/services/activities/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Informasi kegiatan tidak ditemukan.');
        return res.json();
      })
      .then(data => {
        setActivity(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <TopNavBar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <span className="material-symbols-outlined animate-spin text-5xl mb-4">autorenew</span>
            <p className="font-label-lg">Memuat detail kegiatan...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-8 rounded-3xl text-center max-w-lg mx-auto shadow-sm">
            <span className="material-symbols-outlined text-5xl mb-3">error</span>
            <h2 className="font-headline-md mb-2">Oops!</h2>
            <p className="font-body-md mb-6">{error}</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-on-error-container text-error-container px-5 py-2.5 rounded-full font-label-md hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali ke Beranda
            </Link>
          </div>
        ) : activity && (
          <article className="bg-surface-container-lowest rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-outline-variant/30 shadow-lg animate-fade-in-up overflow-hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:bg-primary-container/30 px-4 py-2 rounded-full mb-6 font-label-md transition-colors w-max">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali
            </Link>

            <div className="w-full aspect-[21/9] bg-surface-container-high rounded-2xl sm:rounded-3xl overflow-hidden mb-8 shadow-sm">
              <img 
                src={activity.imageUrl} 
                alt={activity.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-2 sm:px-4">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md mb-3">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>{formatDate(activity.createdAt)}</span>
              </div>
              
              <h1 className="font-display-md sm:font-display-lg text-3xl sm:text-4xl font-bold text-on-surface mb-6 leading-tight">
                {activity.title}
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {activity.description}
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
