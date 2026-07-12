import { useState, useEffect } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'Umum', 'Ama', 'Ina', 'Remaja', 'Naposo', 'Sekolah Minggu'];

  useEffect(() => {
    fetch('/api/services/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data galeri');
        return res.json();
      })
      .then(data => {
        setGalleryItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (activeFilter === 'Semua') return true;
    // Handle older items that might not have a category (assume 'Umum')
    const itemCategory = item.category || 'Umum';
    return itemCategory === activeFilter;
  });

  const handleDownload = async (url, title, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = url.split('.').pop().split('?')[0] || 'jpg';
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      a.download = `HKBP-Immanuel-${cleanTitle}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Gagal mengunduh gambar:', err);
      // Fallback
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavBar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">photo_library</span>
          </div>
          <h1 className="font-display-md sm:font-display-lg text-3xl sm:text-4xl text-on-surface mb-4">Galeri Gereja</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
            Dokumentasi foto kegiatan dan pelayanan dari seluruh kategorial di HKBP Immanuel Kutajaya.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-label-md transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-primary text-on-primary shadow-md scale-105' 
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant hover:text-on-surface border border-outline-variant/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <span className="material-symbols-outlined animate-spin text-5xl mb-4">autorenew</span>
            <p className="font-label-lg">Memuat galeri...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-label-lg">{error}</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="bg-surface-container p-12 rounded-3xl text-center border border-outline-variant/30 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">no_photography</span>
            <h3 className="font-headline-md text-on-surface mb-2">Belum Ada Foto</h3>
            <p className="font-body-md text-on-surface-variant">Saat ini belum ada foto kegiatan yang diunggah ke dalam galeri.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">search_off</span>
            <p className="font-label-lg text-on-surface-variant">Belum ada foto untuk kategori <b>{activeFilter}</b>.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="break-inside-avoid animate-fade-in-up"
                style={{ animationDelay: `${(idx % 6) * 100}ms` }}
              >
                <div className="bg-surface-container rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.category || 'Umum'}
                  </div>
                  
                  {/* Download Button */}
                  <button
                    onClick={(e) => handleDownload(item.imageUrl, item.title, e)}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-primary backdrop-blur-md text-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                    title="Unduh Gambar"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                  
                  <div className="relative overflow-hidden bg-surface-container-highest">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 min-h-[200px]"
                      loading="lazy"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Hover text over image */}
                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="font-headline-sm text-white font-bold line-clamp-2 shadow-sm">{item.title}</h3>
                    </div>
                  </div>
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
