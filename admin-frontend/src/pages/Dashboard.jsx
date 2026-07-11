import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const StatusBadge = ({ status }) => {
  const isPending = status === 'PENDING';
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${isPending ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
      {status}
    </span>
  );
};

const AttachmentLink = ({ url }) => {
  if (!url) return <span className="text-gray-400">-</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-semibold" title="Buka Dokumen">
      <span className="material-symbols-outlined text-[16px]">attach_file</span>
      Lihat File
    </a>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  // Store raw arrays instead of just counts
  const [submissionsData, setSubmissionsData] = useState({
    newMembers: [],
    baptisms: [],
    catechisms: [],
    moveOuts: [],
    obituaries: [],
    suggestions: [],
    activities: [],
    schedules: []
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch submissions data
    fetch('/api/services/submissions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        if(data) {
          setSubmissionsData(prev => ({
            ...prev,
            newMembers: data.newMembers || [],
            baptisms: data.baptisms || [],
            catechisms: data.catechisms || [],
            moveOuts: data.moveOuts || [],
            obituaries: data.obituaries || [],
            suggestions: data.suggestions || [],
          }));
        }
      })
      .catch(err => console.error("Error fetching submissions:", err));

    // Fetch activities
    fetch('/api/services/activities')
      .then(res => res.json())
      .then(data => {
        if(data) {
          setSubmissionsData(prev => ({
            ...prev,
            activities: data || []
          }));
        }
      })
      .catch(err => console.error("Error fetching activities:", err));

    // Fetch schedules
    fetch('/api/services/schedules')
      .then(res => res.json())
      .then(data => {
        if(data) {
          setSubmissionsData(prev => ({
            ...prev,
            schedules: data || []
          }));
        }
      })
      .catch(err => console.error("Error fetching schedules:", err));

    fetch('/api/services/news')
      .then(res => res.json())
      .then(data => {
        if(data) {
          setSubmissionsData(prev => ({
            ...prev,
            news: data || []
          }));
        }
      })
      .catch(err => console.error("Error fetching news:", err));
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* Simple Admin Header */}
      <header className="bg-surface-container-low border-b border-outline-variant/30 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined icon-fill text-[28px]">admin_panel_settings</span>
          Immanuel Admin
        </h1>
        <div className="flex items-center gap-4">
          <a href={window.location.protocol + "//" + window.location.hostname} className="font-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 hidden sm:flex">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Ke Web Jemaat
          </a>
          <button onClick={handleLogout} className="bg-error-container text-on-error-container px-4 py-2 rounded-full font-label-md hover:opacity-90 flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Keluar
          </button>
        </div>
      </header>
      
      <main className="flex-grow py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel p-4 rounded-3xl sticky top-24 bg-surface-container border border-outline-variant/20 shadow-sm">
            <h2 className="font-headline-md text-on-surface mb-4 px-4 pt-2">Menu Admin</h2>
            <nav className="flex flex-col gap-2">
              <TabButton 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
                icon="dashboard" 
                label="Dasbor Utama" 
              />
              <div className="h-px bg-outline-variant/20 my-2 mx-2"></div>
              <TabButton 
                active={activeTab === 'liturgy'} 
                onClick={() => setActiveTab('liturgy')} 
                icon="menu_book" 
                label="Upload Tata Ibadah" 
              />
              <TabButton 
                active={activeTab === 'news'} 
                onClick={() => setActiveTab('news')} 
                icon="campaign" 
                label="Upload Warta" 
              />
              <TabButton 
                active={activeTab === 'gallery'} 
                onClick={() => setActiveTab('gallery')} 
                icon="photo_library" 
                label="Upload Galeri" 
              />
              <div className="h-px bg-outline-variant/20 my-2 mx-2"></div>
              <TabButton 
                active={activeTab === 'activities'} 
                onClick={() => setActiveTab('activities')} 
                icon="event_note" 
                label="Info & Kegiatan" 
              />
              <TabButton 
                active={activeTab === 'schedules'} 
                onClick={() => setActiveTab('schedules')} 
                icon="calendar_month" 
                label="Jadwal Mingguan" 
              />
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-grow glass-panel p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm overflow-hidden">
          {activeTab === 'dashboard' && <DashboardOverview data={submissionsData} onCardClick={setActiveTab} />}
          
          {/* Form Uploads */}
          {activeTab === 'liturgy' && <UploadForm endpoint="liturgy" title="Tata Ibadah" hasDescription={false} />}
          {activeTab === 'news' && <NewsManager data={submissionsData.news} setSubmissionsData={setSubmissionsData} />}
          {activeTab === 'gallery' && <UploadForm endpoint="gallery" title="Galeri" hasDescription={false} isImageOnly={true} />}
          {activeTab === 'activities' && <ActivityManager data={submissionsData.activities} setSubmissionsData={setSubmissionsData} />}
          {activeTab === 'schedules' && <ScheduleManager data={submissionsData.schedules} setSubmissionsData={setSubmissionsData} />}

          {/* Tables Views */}
          {activeTab === 'newMembers' && <DataTable 
            title="Data Jemaat Baru" 
            description="Daftar pendaftar menjadi jemaat baru." 
            columns={newMembersColumns} 
            data={submissionsData.newMembers} 
            onBack={() => setActiveTab('dashboard')} 
          />}
          {activeTab === 'baptisms' && <DataTable 
            title="Data Baptis Kudus" 
            description="Daftar pendaftar untuk layanan Baptis Kudus." 
            columns={baptismsColumns} 
            data={submissionsData.baptisms} 
            onBack={() => setActiveTab('dashboard')} 
          />}
          {activeTab === 'catechisms' && <DataTable 
            title="Data Katekisasi Sidi" 
            description="Daftar pendaftar untuk layanan Katekisasi Sidi." 
            columns={catechismsColumns} 
            data={submissionsData.catechisms} 
            onBack={() => setActiveTab('dashboard')} 
          />}
          {activeTab === 'moveOuts' && <DataTable 
            title="Data Pindah Keluar" 
            description="Daftar pengajuan pindah keanggotaan gereja." 
            columns={moveOutsColumns} 
            data={submissionsData.moveOuts} 
            onBack={() => setActiveTab('dashboard')} 
          />}
          {activeTab === 'obituaries' && <DataTable 
            title="Data Berita Duka" 
            description="Daftar laporan berita duka cita." 
            columns={obituariesColumns} 
            data={submissionsData.obituaries} 
            onBack={() => setActiveTab('dashboard')} 
          />}
          {activeTab === 'suggestions' && <DataTable 
            title="Data Saran Masuk" 
            description="Daftar kotak saran dan masukan dari jemaat." 
            columns={suggestionsColumns} 
            data={submissionsData.suggestions} 
            onBack={() => setActiveTab('dashboard')} 
          />}
        </section>
      </main>
    </div>
  );
}


// Schedule Manager Component
function ScheduleManager({ data, setSubmissionsData }) {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'upload' or 'edit'
  const [status, setStatus] = useState(null);
  const [editData, setEditData] = useState(null);

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSubmissionsData(prev => ({
          ...prev,
          schedules: prev.schedules.filter(item => item.id !== id)
        }));
      }
    } catch (error) {
      console.error("Failed to delete schedule", error);
    }
  };

  const openEdit = (item) => {
    setEditData(item);
    setActiveView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    const scheduleData = Object.fromEntries(formData.entries());
    
    const iconStyles = {
      'church': { bg: 'bg-primary-container/60', color: 'text-on-primary-container' },
      'groups': { bg: 'bg-primary-container/60', color: 'text-on-primary-container' },
      'library_music': { bg: 'bg-secondary-container/60', color: 'text-on-secondary-container' },
      'diversity_3': { bg: 'bg-tertiary-container/60', color: 'text-on-tertiary-container' },
      'child_care': { bg: 'bg-secondary-container/60', color: 'text-on-secondary-container' },
      'menu_book': { bg: 'bg-primary-container/60', color: 'text-on-primary-container' },
      'folded_hands': { bg: 'bg-primary-container/60', color: 'text-on-primary-container' },
      'event': { bg: 'bg-surface-variant/60', color: 'text-on-surface-variant' }
    };

    const selectedIcon = scheduleData.icon || 'event';
    const style = iconStyles[selectedIcon] || iconStyles['event'];
    
    scheduleData.iconBg = style.bg;
    scheduleData.iconColor = style.color;

    const url = activeView === 'edit' ? `/api/admin/schedules/${editData.id}` : `/api/admin/schedules`;
    const method = activeView === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData),
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setSubmissionsData(prev => ({
          ...prev,
          schedules: activeView === 'edit' 
            ? prev.schedules.map(s => s.id === newItem.id ? newItem : s)
            : [...prev.schedules, newItem]
        }));
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
          setActiveView('list');
          setEditData(null);
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
    }
  };

  if (activeView === 'upload' || activeView === 'edit') {
    return (
      <div className="relative animate-fade-in-up">
        <button 
          onClick={() => { setActiveView('list'); setEditData(null); }} 
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-variant text-on-surface rounded-full transition-colors font-label-md border border-outline-variant/30 shadow-sm z-10"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali
        </button>
        
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto pt-4">
          <div className="w-20 h-20 rounded-full bg-primary-container/30 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-primary">calendar_add_on</span>
          </div>
          
          <h2 className="font-display-md text-3xl text-on-surface mb-3 text-center">{activeView === 'edit' ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2 shrink-0 sm:w-1/3">
                <label className="font-label-lg font-bold text-on-surface">Hari</label>
                <select 
                  name="day" 
                  required
                  defaultValue={editData?.day}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm appearance-none"
                >
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <label className="font-label-lg font-bold text-on-surface">Nama Kegiatan</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  defaultValue={editData?.title}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-grow">
                <label className="font-label-lg font-bold text-on-surface">Lokasi</label>
                <input 
                  type="text" 
                  name="location" 
                  required
                  defaultValue={editData?.location}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
                />
              </div>
              <div className="flex flex-col gap-2 shrink-0 sm:w-1/3">
                <label className="font-label-lg font-bold text-on-surface">Waktu</label>
                <input 
                  type="text" 
                  name="time" 
                  required
                  defaultValue={editData?.time}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-grow">
                <label className="font-label-lg font-bold text-on-surface">Kategori / Sasaran</label>
                <input 
                  type="text" 
                  name="category" 
                  required
                  defaultValue={editData?.category}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
                />
              </div>
              <div className="flex flex-col gap-2 shrink-0 sm:w-1/3">
                <label className="font-label-lg font-bold text-on-surface">Ikon</label>
                <select 
                  name="icon" 
                  required
                  defaultValue={editData?.icon}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm appearance-none material-symbols-outlined"
                >
                  <option value="church">church (Gereja)</option>
                  <option value="groups">groups (Kumpulan)</option>
                  <option value="library_music">library_music (Koor/Musik)</option>
                  <option value="diversity_3">diversity_3 (Pemuda/Naposo)</option>
                  <option value="child_care">child_care (Anak-anak)</option>
                  <option value="menu_book">menu_book (Alkitab/PA)</option>
                  <option value="folded_hands">folded_hands (Doa)</option>
                  <option value="event">event (Umum)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="mt-6 bg-primary text-on-primary py-4 px-8 rounded-full font-headline-sm hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto self-center"
            >
              {status === 'loading' ? (
                <><span className="material-symbols-outlined animate-spin text-[24px]">autorenew</span> Menyimpan...</>
              ) : (
                <><span className="material-symbols-outlined text-[24px]">save</span> Simpan Jadwal</>
              )}
            </button>

            {status === 'success' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-green-700 rounded-2xl flex justify-center gap-3 font-label-lg">
                Jadwal berhasil disimpan!
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-700 rounded-2xl flex justify-center gap-3 font-label-lg">
                Gagal menyimpan jadwal.
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-6 gap-4">
        <div>
          <h2 className="font-display-sm text-2xl text-on-surface mb-1">Jadwal Mingguan</h2>
          <p className="font-body-md text-on-surface-variant">Daftar kegiatan rutin pelayanan gereja setiap minggunya.</p>
        </div>
        <button 
          onClick={() => setActiveView('upload')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:opacity-90 text-on-primary rounded-full transition-colors font-label-md shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Jadwal
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {daysOfWeek.map(day => {
          const daySchedules = data.filter(item => item.day === day);
          if (daySchedules.length === 0) return null;
          
          return (
            <div key={day} className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="bg-surface-container-lowest px-6 py-4 border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <h3 className="font-headline-md text-on-surface font-bold">{day}</h3>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {daySchedules.map(item => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
                        <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-on-surface font-bold">{item.title}</h4>
                        <p className="font-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {item.location} • {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <span className="px-3 py-1 bg-surface-variant/30 text-on-surface-variant rounded-full font-label-sm border border-outline-variant/20 mr-2">
                        {item.category}
                      </span>
                      <button 
                        onClick={() => openEdit(item)}
                        className="text-primary hover:bg-primary-container/50 p-2 rounded-full transition-colors shrink-0"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-error hover:bg-error-container/50 p-2 rounded-full transition-colors shrink-0"
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant font-body-md border border-outline-variant/30 rounded-2xl bg-white">
            Belum ada jadwal yang ditambahkan.
          </div>
        )}
      </div>
    </div>
  );
}


// Activity Manager Component
function ActivityManager({ data, setSubmissionsData }) {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'upload' or 'edit'
  const [editData, setEditData] = useState(null);
  const [status, setStatus] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus informasi/kegiatan ini?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSubmissionsData(prev => ({
          ...prev,
          activities: prev.activities.filter(item => item.id !== id)
        }));
      }
    } catch (error) {
      console.error("Failed to delete activity", error);
    }
  };

  const openEdit = (item) => {
    setEditData(item);
    setActiveView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    
    const url = activeView === 'edit' ? `/api/admin/activities/${editData.id}` : `/api/admin/activities`;
    const method = activeView === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setSubmissionsData(prev => ({
          ...prev,
          activities: activeView === 'edit' 
            ? prev.activities.map(a => a.id === newItem.id ? newItem : a)
            : [newItem, ...prev.activities]
        }));
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
          setActiveView('list');
          setEditData(null);
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
    }
  };

  if (activeView === 'upload' || activeView === 'edit') {
    return (
      <div className="relative">
        <button 
          onClick={() => { setActiveView('list'); setEditData(null); }} 
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-variant text-on-surface rounded-full transition-colors font-label-md border border-outline-variant/30 shadow-sm z-10"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke Daftar
        </button>
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-10">
          <h2 className="font-display-md text-3xl text-on-surface mb-6 text-center">{activeView === 'edit' ? 'Edit Info & Kegiatan' : 'Tambah Info & Kegiatan'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Judul</label>
              <input type="text" name="title" required defaultValue={editData?.title} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Deskripsi</label>
              <textarea name="description" rows="4" required defaultValue={editData?.description} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md"></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Gambar (Biarkan kosong jika tidak ingin mengubah)</label>
              <input type="file" name="image" accept="image/*" required={activeView === 'upload'} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-label-md file:bg-primary-container file:text-on-primary-container hover:file:bg-primary hover:file:text-on-primary transition-all cursor-pointer" />
            </div>
            <button type="submit" disabled={status === 'loading'} className="mt-4 bg-primary text-on-primary py-4 px-8 rounded-full font-headline-sm hover:opacity-90 flex justify-center shadow-lg disabled:opacity-50">
              {status === 'loading' ? 'Menyimpan...' : 'Simpan Kegiatan'}
            </button>
            {status === 'success' && <div className="p-4 bg-green-500/10 text-green-700 rounded-2xl">Berhasil disimpan!</div>}
            {status === 'error' && <div className="p-4 bg-red-500/10 text-red-700 rounded-2xl">Gagal menyimpan.</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-6 gap-4">
        <div>
          <h2 className="font-display-sm text-2xl text-on-surface mb-1">Manajemen Info & Kegiatan</h2>
          <p className="font-body-md text-on-surface-variant">Daftar informasi dan kegiatan yang tampil di halaman depan.</p>
        </div>
        <button 
          onClick={() => setActiveView('upload')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:opacity-90 text-on-primary rounded-full transition-colors font-label-md shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant font-body-md border border-outline-variant/30 rounded-2xl bg-white">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
              Belum ada informasi kegiatan.
            </div>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
              <div className="w-full aspect-video relative overflow-hidden bg-surface-container-highest">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-headline-sm text-on-surface mb-1 font-bold line-clamp-1" title={item.title}>{item.title}</h3>
                <p className="font-body-sm text-on-surface-variant line-clamp-2 mb-4 flex-grow" title={item.description}>{item.description}</p>
                <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-3">
                  <span className="text-[11px] text-on-surface-variant font-label-sm">{formatDate(item.createdAt)}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEdit(item)}
                      className="text-primary hover:bg-primary-container/50 p-1.5 rounded-full transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-error hover:bg-error-container/50 p-1.5 rounded-full transition-colors"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// News Manager Component
function NewsManager({ data, setSubmissionsData }) {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'upload' or 'edit'
  const [editData, setEditData] = useState(null);
  const [status, setStatus] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus warta jemaat ini?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSubmissionsData(prev => ({
          ...prev,
          news: prev.news.filter(item => item.id !== id)
        }));
      }
    } catch (error) {
      console.error("Failed to delete news", error);
    }
  };

  const openEdit = (item) => {
    setEditData(item);
    setActiveView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const token = localStorage.getItem('adminToken');
    const formData = new FormData(e.target);
    
    const url = activeView === 'edit' ? `/api/admin/news/${editData.id}` : `/api/admin/news`;
    const method = activeView === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setSubmissionsData(prev => ({
          ...prev,
          news: activeView === 'edit' 
            ? prev.news.map(n => n.id === newItem.id ? newItem : n)
            : [newItem, ...prev.news]
        }));
        setStatus('success');
        setTimeout(() => {
          setStatus(null);
          setActiveView('list');
          setEditData(null);
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
    }
  };

  if (activeView === 'upload' || activeView === 'edit') {
    return (
      <div className="relative">
        <button 
          onClick={() => { setActiveView('list'); setEditData(null); }} 
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-variant text-on-surface rounded-full transition-colors font-label-md border border-outline-variant/30 shadow-sm z-10"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke Daftar
        </button>
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-10">
          <h2 className="font-display-md text-3xl text-on-surface mb-6 text-center">{activeView === 'edit' ? 'Edit Warta Jemaat' : 'Tambah Warta Jemaat'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Judul Warta</label>
              <input type="text" name="title" required defaultValue={editData?.title} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Tanggal Warta</label>
              <input type="date" name="date" required defaultValue={editData?.date ? new Date(editData.date).toISOString().split('T')[0] : ''} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">Deskripsi / Ringkasan</label>
              <textarea name="description" rows="3" defaultValue={editData?.description} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md"></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-lg font-bold text-on-surface">File PDF / Gambar (Biarkan kosong jika tidak mengubah)</label>
              <input type="file" name="file" accept="image/*,.pdf" required={activeView === 'upload'} className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-label-md file:bg-primary-container file:text-on-primary-container hover:file:bg-primary hover:file:text-on-primary transition-all cursor-pointer" />
            </div>
            <button type="submit" disabled={status === 'loading'} className="mt-4 bg-primary text-on-primary py-4 px-8 rounded-full font-headline-sm hover:opacity-90 flex justify-center shadow-lg disabled:opacity-50">
              {status === 'loading' ? 'Menyimpan...' : 'Simpan Warta'}
            </button>
            {status === 'success' && <div className="p-4 bg-green-500/10 text-green-700 rounded-2xl">Berhasil disimpan!</div>}
            {status === 'error' && <div className="p-4 bg-red-500/10 text-red-700 rounded-2xl">Gagal menyimpan.</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-6 gap-4">
        <div>
          <h2 className="font-display-sm text-2xl text-on-surface mb-1">Manajemen Warta Jemaat</h2>
          <p className="font-body-md text-on-surface-variant">Daftar warta jemaat mingguan.</p>
        </div>
        <button 
          onClick={() => setActiveView('upload')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:opacity-90 text-on-primary rounded-full transition-colors font-label-md shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Warta
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant font-body-md border border-outline-variant/30 rounded-2xl bg-white">
            Belum ada warta jemaat.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-container-low transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">campaign</span>
                </div>
                <div>
                  <h3 className="font-headline-sm font-bold text-on-surface">{item.title}</h3>
                  <p className="font-body-sm text-on-surface-variant mb-1">{formatDate(item.date)}</p>
                  <p className="font-body-sm text-on-surface-variant line-clamp-2">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline font-label-md text-sm border border-primary/30 px-3 py-1.5 rounded-full">
                    Lihat File
                  </a>
                )}
                <button 
                  onClick={() => openEdit(item)}
                  className="text-primary hover:bg-primary-container/50 p-2 rounded-full transition-colors"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-error hover:bg-error-container/50 p-2 rounded-full transition-colors"
                  title="Hapus"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Columns Configurations
const newMembersColumns = [
  { header: 'Nama Lengkap', accessor: 'fullName' },
  { header: 'No. HP', accessor: 'contactNumber' },
  { header: 'Alamat', accessor: 'address' },
  { header: 'Gereja Asal', accessor: 'previousChurch' },
  { header: 'Catatan', accessor: 'notes' },
  { header: 'Lampiran', render: (row) => <AttachmentLink url={row.transferLetterUrl} /> },
  { header: 'Tanggal Daftar', render: (row) => formatDate(row.createdAt) },
  { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

const baptismsColumns = [
  { header: 'Nama Anak', accessor: 'fullName' },
  { header: 'Nama Orang Tua', accessor: 'parentName' },
  { header: 'Tgl Lahir', render: (row) => formatDate(row.birthDate) },
  { header: 'Tempat Lahir', accessor: 'birthPlace' },
  { header: 'No. HP', accessor: 'contactNumber' },
  { header: 'Lampiran', render: (row) => <AttachmentLink url={row.birthCertificateUrl} /> },
  { header: 'Tanggal Daftar', render: (row) => formatDate(row.createdAt) },
  { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

const catechismsColumns = [
  { header: 'Nama Lengkap', accessor: 'fullName' },
  { header: 'Tgl Lahir', render: (row) => formatDate(row.birthDate) },
  { header: 'Tempat Lahir', accessor: 'birthPlace' },
  { header: 'No. HP', accessor: 'contactNumber' },
  { header: 'Alamat', accessor: 'address' },
  { header: 'Lampiran', render: (row) => <AttachmentLink url={row.baptismCertificateUrl} /> },
  { header: 'Tanggal Daftar', render: (row) => formatDate(row.createdAt) },
  { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

const moveOutsColumns = [
  { header: 'Nama Lengkap', accessor: 'fullName' },
  { header: 'No. HP', accessor: 'contactNumber' },
  { header: 'Alamat Sekarang', accessor: 'currentAddress' },
  { header: 'Gereja Tujuan', accessor: 'destination' },
  { header: 'Alasan', accessor: 'reason' },
  { header: 'Tanggal Lapor', render: (row) => formatDate(row.createdAt) },
  { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

const obituariesColumns = [
  { header: 'Nama Alm/Almh', accessor: 'deceasedName' },
  { header: 'Pelapor', accessor: 'reporterName' },
  { header: 'No. HP', accessor: 'contactNumber' },
  { header: 'Tgl Wafat', render: (row) => formatDate(row.dateOfDeath) },
  { header: 'Alamat Duka', accessor: 'address' },
  { header: 'Tanggal Lapor', render: (row) => formatDate(row.createdAt) },
  { header: 'Status', render: (row) => <StatusBadge status={row.status} /> }
];

const suggestionsColumns = [
  { header: 'Nama Pengirim', accessor: 'name' },
  { header: 'Topik', accessor: 'topic' },
  { header: 'Pesan', accessor: 'message' },
  { header: 'Tanggal Masuk', render: (row) => formatDate(row.createdAt) }
];


// Components

function DataTable({ title, description, columns, data, onBack }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-6 gap-4">
        <div>
          <h2 className="font-display-sm text-2xl text-on-surface mb-1">{title}</h2>
          <p className="font-body-md text-on-surface-variant">{description}</p>
        </div>
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container hover:bg-surface-variant text-on-surface rounded-full transition-colors font-label-md border border-outline-variant/30 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-2xl border border-outline-variant/30 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-md border-b border-outline-variant/30 uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 whitespace-nowrap font-bold">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-on-surface-variant font-body-md bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
                    Belum ada data pendaftar.
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors bg-white">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-6 py-4 font-body-sm text-on-surface max-w-[250px] truncate" title={typeof item[col.accessor] === 'string' ? item[col.accessor] : ''}>
                      {col.render ? col.render(item) : (item[col.accessor] || <span className="text-gray-400">-</span>)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-label-lg w-full text-left
        ${active 
          ? 'bg-primary text-on-primary shadow-md translate-x-1' 
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }
      `}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
}

function DashboardOverview({ data, onCardClick }) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="font-display-sm text-2xl text-on-surface mb-2">Ringkasan Layanan Masuk</h2>
      <p className="font-body-md text-on-surface-variant mb-6 border-b border-outline-variant/20 pb-4">
        Klik kartu di bawah ini untuk melihat daftar lengkap pendaftar.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Jemaat Baru" count={data.newMembers.length} icon="group_add" onClick={() => onCardClick('newMembers')} />
        <StatCard title="Baptis Kudus" count={data.baptisms.length} icon="water_drop" onClick={() => onCardClick('baptisms')} />
        <StatCard title="Katekisasi Sidi" count={data.catechisms.length} icon="menu_book" onClick={() => onCardClick('catechisms')} />
        <StatCard title="Pindah Keluar" count={data.moveOuts.length} icon="transfer_within_a_station" onClick={() => onCardClick('moveOuts')} />
        <StatCard title="Berita Duka" count={data.obituaries.length} icon="deceased" onClick={() => onCardClick('obituaries')} />
        <StatCard title="Saran Masuk" count={data.suggestions.length} icon="mark_email_unread" onClick={() => onCardClick('suggestions')} />
      </div>
    </div>
  );
}

function StatCard({ title, count, icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-outline-variant/20 flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-surface-container-lowest transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 group"
    >
      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
      </div>
      <h3 className="font-label-md text-on-surface-variant group-hover:text-primary transition-colors">{title}</h3>
      <p className="font-display-md text-4xl text-on-surface font-bold">{count}</p>
    </div>
  );
}

function UploadForm({ endpoint, title, hasDescription, isImageOnly }) {
  const [status, setStatus] = useState(null);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (response.ok) {
        setStatus('success');
        e.target.reset();
        setFileName('');
        setTimeout(() => setStatus(null), 3000);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in-up flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-primary-container/30 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-primary">
          {endpoint === 'liturgy' ? 'menu_book' : endpoint === 'news' ? 'campaign' : 'photo_library'}
        </span>
      </div>
      
      <h2 className="font-display-md text-3xl text-on-surface mb-3 text-center">Upload {title}</h2>
      <p className="font-body-lg text-on-surface-variant mb-10 text-center border-b border-outline-variant/20 pb-8 w-full">
        Silakan isi form di bawah ini untuk menambahkan {title.toLowerCase()} baru ke dalam website jemaat.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-2 flex-grow">
            <label className="font-label-lg font-bold text-on-surface">Judul {title}</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder={`Contoh: ${title} Minggu Ini...`}
              className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
            />
          </div>

          {!isImageOnly && (
            <div className="flex flex-col gap-2 shrink-0 sm:w-1/3">
              <label className="font-label-lg font-bold text-on-surface">Tanggal</label>
              <input 
                type="date" 
                name="date" 
                required
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm" 
              />
            </div>
          )}

          {endpoint === 'gallery' && (
            <div className="flex flex-col gap-2 shrink-0 sm:w-1/3">
              <label className="font-label-lg font-bold text-on-surface">Kategori</label>
              <select 
                name="category" 
                required
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                <option value="Umum">Umum</option>
                <option value="Ama">Ama</option>
                <option value="Ina">Ina</option>
                <option value="Remaja">Remaja</option>
                <option value="Naposo">Naposo</option>
                <option value="Sekolah Minggu">Sekolah Minggu</option>
              </select>
            </div>
          )}
        </div>

        {hasDescription && (
          <div className="flex flex-col gap-2">
            <label className="font-label-lg font-bold text-on-surface">Deskripsi / Ringkasan</label>
            <textarea 
              name="description" 
              rows="5"
              placeholder="Berikan ringkasan singkat mengenai topik berita ini..."
              className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl p-4 text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors font-body-md shadow-sm resize-none" 
            />
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-label-lg font-bold text-on-surface">Dokumen Lampiran ({isImageOnly ? 'Gambar' : 'PDF/Gambar'})</label>
          <div className="relative group">
            <input 
              type="file" 
              name={isImageOnly ? 'image' : 'file'}
              accept={isImageOnly ? 'image/*' : '.pdf,image/*'}
              required
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className={`w-full border-2 border-dashed ${fileName ? 'border-primary bg-primary-container/10' : 'border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low'} rounded-3xl p-10 flex flex-col items-center justify-center gap-3 transition-colors`}>
              <span className={`material-symbols-outlined text-5xl ${fileName ? 'text-primary' : 'text-outline-variant group-hover:text-primary transition-colors'}`}>
                {fileName ? 'task' : 'cloud_upload'}
              </span>
              <p className={`font-label-lg text-center ${fileName ? 'text-primary' : 'text-on-surface-variant'}`}>
                {fileName ? (
                  <span className="font-bold">{fileName}</span>
                ) : (
                  <span>Seret dan lepas file di sini, atau <span className="text-primary font-bold">klik untuk menelusuri</span></span>
                )}
              </p>
              <p className="font-body-sm text-outline">
                {isImageOnly ? 'Format yang didukung: JPG, PNG, WEBP (Maks 10MB)' : 'Format yang didukung: PDF, JPG, PNG (Maks 10MB)'}
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="mt-8 bg-primary text-on-primary py-4 px-8 rounded-full font-headline-sm hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto self-center"
        >
          {status === 'loading' ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[24px]">autorenew</span>
              Mengunggah Data...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[24px]">publish</span>
              Publikasikan {title}
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-2xl flex items-center justify-center gap-3 font-label-lg animate-fade-in-up">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
            File {title.toLowerCase()} berhasil dipublikasikan!
          </div>
        )}
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-2xl flex items-center justify-center gap-3 font-label-lg animate-fade-in-up">
            <span className="material-symbols-outlined text-[24px]">error</span>
            Gagal mempublikasikan file. Terjadi kesalahan pada server.
          </div>
        )}
      </form>
    </div>
  );
}
