import { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const servicesList = [
  { id: 'new-member', title: 'Jemaat Baru', icon: 'group_add', color: 'text-primary', bg: 'bg-primary-container/20', description: 'Formulir untuk mendaftar sebagai anggota jemaat baru.' },
  { id: 'baptism', title: 'Baptis Kudus', icon: 'water_drop', color: 'text-secondary', bg: 'bg-secondary-container/20', description: 'Pengajuan jadwal pelayanan Baptis Kudus.' },
  { id: 'catechism', title: 'Katekisasi Sidi', icon: 'menu_book', color: 'text-tertiary', bg: 'bg-tertiary-container/20', description: 'Pendaftaran kelas sidi bagi remaja/dewasa.' },
  { id: 'move-out', title: 'Pindah Keluar', icon: 'transfer_within_a_station', color: 'text-primary', bg: 'bg-primary-container/20', description: 'Formulir administrasi pindah ke gereja lain.' },
  { id: 'obituary', title: 'Berita Duka', icon: 'church', color: 'text-secondary', bg: 'bg-secondary-container/20', description: 'Laporkan berita duka cita jemaat.' },
  { id: 'suggestion', title: 'Kotak Saran', icon: 'mark_email_unread', color: 'text-tertiary', bg: 'bg-tertiary-container/20', description: 'Kirimkan saran atau kritik membangun.' },
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
          <div className="max-w-4xl mx-auto bg-surface-container-lowest sm:bg-surface rounded-3xl p-6 sm:p-10 shadow-sm sm:shadow-lg border border-outline-variant/15 sm:border-outline-variant/20">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
              {servicesList.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setActiveForm(service.id)}
                  className="flex flex-col items-center gap-3 group outline-none cursor-pointer"
                >
                  <div className={`w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-[1.15rem] sm:rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${service.bg} opacity-50`}></div>
                    <span className={`material-symbols-outlined icon-fill text-[32px] sm:text-[40px] ${service.color} relative z-10`}>
                      {service.icon}
                    </span>
                  </div>
                  
                  <span className="font-label-md text-[12px] sm:text-[14px] text-on-surface font-medium text-center leading-tight px-1 max-w-[90px] sm:max-w-[110px]">
                    {service.title}
                  </span>
                </div>
              ))}
            </div>
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
