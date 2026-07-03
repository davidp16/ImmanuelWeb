import { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const servicesList = [
  { id: 'new-member', title: 'Pendaftaran Jemaat Baru', icon: 'group_add', description: 'Formulir untuk mendaftar sebagai anggota jemaat baru.' },
  { id: 'baptism', title: 'Pendaftaran Baptis Kudus', icon: 'water_drop', description: 'Pengajuan jadwal pelayanan Baptis Kudus.' },
  { id: 'catechism', title: 'Pendaftaran Katekisasi Sidi', icon: 'menu_book', description: 'Pendaftaran kelas sidi bagi remaja/dewasa.' },
  { id: 'move-out', title: 'Pengajuan Pindah Keluar', icon: 'transfer_within_a_station', description: 'Formulir administrasi pindah ke gereja lain.' },
  { id: 'obituary', title: 'Pelaporan Berita Duka', icon: 'deceased', description: 'Laporkan berita duka cita jemaat.' },
  { id: 'suggestion', title: 'Kotak Saran', icon: 'mark_email_unread', description: 'Kirimkan saran atau kritik membangun.' },
];

export default function ServicesPage() {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const handleInputChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      const response = await fetch(`/api/services/${activeForm}`, {
        method: 'POST',
        body: data,
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({});
        setTimeout(() => {
          setStatus(null);
          setActiveForm(null);
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const renderFormFields = () => {
    switch (activeForm) {
      case 'new-member':
        return (
          <>
            <InputField label="Nama Lengkap" name="fullName" onChange={handleInputChange} />
            <InputField label="Nomor Kontak (WA)" name="contactNumber" onChange={handleInputChange} />
            <InputField label="Alamat Lengkap" name="address" onChange={handleInputChange} />
            <InputField label="Gereja Asal (Jika ada)" name="previousChurch" onChange={handleInputChange} required={false} />
            <InputField label="Surat Pengantar Gereja Asal (PDF/Gambar)" name="file" type="file" onChange={handleInputChange} required={false} />
          </>
        );
      case 'baptism':
        return (
          <>
            <InputField label="Nama Lengkap Anak/Peserta" name="fullName" onChange={handleInputChange} />
            <InputField label="Nama Orang Tua" name="parentName" onChange={handleInputChange} />
            <InputField label="Tempat Lahir" name="birthPlace" onChange={handleInputChange} />
            <InputField label="Tanggal Lahir" name="birthDate" type="date" onChange={handleInputChange} />
            <InputField label="Nomor Kontak (WA)" name="contactNumber" onChange={handleInputChange} />
            <InputField label="Akte Lahir (PDF/Gambar)" name="file" type="file" onChange={handleInputChange} required={true} />
          </>
        );
      case 'catechism':
        return (
          <>
            <InputField label="Nama Lengkap Peserta" name="fullName" onChange={handleInputChange} />
            <InputField label="Tempat Lahir" name="birthPlace" onChange={handleInputChange} />
            <InputField label="Tanggal Lahir" name="birthDate" type="date" onChange={handleInputChange} />
            <InputField label="Alamat Lengkap" name="address" onChange={handleInputChange} />
            <InputField label="Nomor Kontak (WA)" name="contactNumber" onChange={handleInputChange} />
            <InputField label="Surat Baptis (PDF/Gambar)" name="file" type="file" onChange={handleInputChange} required={true} />
          </>
        );
      case 'move-out':
        return (
          <>
            <InputField label="Nama Lengkap" name="fullName" onChange={handleInputChange} />
            <InputField label="Nomor Kontak (WA)" name="contactNumber" onChange={handleInputChange} />
            <InputField label="Alamat Saat Ini" name="currentAddress" onChange={handleInputChange} />
            <InputField label="Gereja Tujuan" name="destination" onChange={handleInputChange} />
            <InputField label="Alasan Pindah" name="reason" onChange={handleInputChange} />
          </>
        );
      case 'obituary':
        return (
          <>
            <InputField label="Nama Almarhum/Almarhumah" name="deceasedName" onChange={handleInputChange} />
            <InputField label="Tanggal Meninggal" name="dateOfDeath" type="date" onChange={handleInputChange} />
            <InputField label="Nama Pelapor" name="reporterName" onChange={handleInputChange} />
            <InputField label="Nomor Kontak Pelapor" name="contactNumber" onChange={handleInputChange} />
            <InputField label="Alamat Rumah Duka" name="address" onChange={handleInputChange} />
          </>
        );
      case 'suggestion':
        return (
          <>
            <InputField label="Nama (Boleh Dikosongkan)" name="name" onChange={handleInputChange} required={false} />
            <InputField label="Topik Saran" name="topic" onChange={handleInputChange} />
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="font-label-md text-on-surface-variant">Pesan/Saran</label>
              <textarea 
                name="message" 
                onChange={handleInputChange} 
                required 
                className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary h-32 resize-none" 
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavBar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="font-display-md sm:font-display-lg text-3xl sm:text-4xl text-on-surface mb-3">Layanan Jemaat</h1>
          <p className="text-on-surface-variant font-body-md max-w-2xl mx-auto">Pilih jenis layanan administrasi yang Anda butuhkan dan isi formulir dengan lengkap.</p>
        </div>

        {!activeForm ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {servicesList.map((service) => (
              <div 
                key={service.id}
                onClick={() => setActiveForm(service.id)}
                className="glass-panel p-6 rounded-2xl sm:rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 border border-outline-variant/20 flex flex-col items-center text-center gap-3 bg-surface-container hover:bg-surface-container-high"
              >
                <div className="w-14 h-14 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[28px]">{service.icon}</span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface">{service.title}</h3>
                <p className="font-body-sm text-on-surface-variant">{service.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-outline-variant/20 bg-surface-container">
            <button 
              onClick={() => setActiveForm(null)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-label-md">Kembali ke Pilihan Layanan</span>
            </button>
            
            <h2 className="font-headline-lg text-2xl text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
              {servicesList.find(s => s.id === activeForm)?.title}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {renderFormFields()}
              
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="mt-4 bg-primary text-on-primary py-3 px-6 rounded-full font-label-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === 'loading' ? 'Mengirim...' : 'Kirim Formulir'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-4 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-center font-label-md">
                  Berhasil mengirim formulir! Anda akan dikembalikan ke halaman sebelumnya.
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-center font-label-md">
                  Gagal mengirim formulir. Silakan coba lagi.
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Reusable Input Component
function InputField({ label, name, type = 'text', onChange, required = true }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 text-left">
      <label className="font-label-md text-on-surface-variant">{label}</label>
      <input 
        type={type} 
        name={name} 
        onChange={onChange}
        required={required}
        accept={type === 'file' ? '.pdf,image/*' : undefined}
        className={type === 'file' 
          ? "w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg p-2 text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:opacity-90"
          : "w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary"
        }
      />
    </div>
  );
}
