import { useParams, Navigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const ministryData = {
  koinonia: {
    title: 'Koinonia (Persekutuan)',
    icon: 'diversity_3',
    iconColor: 'text-primary',
    bgIcon: 'bg-primary-container/20',
    leader: 'St. E Tambun',
    description: 'Koinonia merupakan bidang pelayanan yang berfokus pada membangun persekutuan yang erat di antara seluruh jemaat. Melalui berbagai kegiatan ibadah, pembinaan, dan kebersamaan, Koinonia bertujuan memperkuat iman, kasih, serta rasa saling memiliki sebagai satu tubuh Kristus.',
    tasks: [
      'Merencanakan dan mengoordinasikan kegiatan persekutuan jemaat.',
      'Membina kebersamaan antar jemaat dari berbagai kelompok usia.',
      'Mendukung pelaksanaan ibadah, doa, dan pembinaan rohani.',
      'Mengembangkan pelayanan kategorial seperti Sekolah Minggu, Naposo, kaum bapak, kaum ibu, dan lansia.',
      'Menjalin hubungan yang harmonis serta mempererat persaudaraan di lingkungan gereja.',
      'Mendorong jemaat untuk aktif berpartisipasi dalam kehidupan bergereja.'
    ]
  },
  marturia: {
    title: 'Marturia (Kesaksian)',
    icon: 'campaign',
    iconColor: 'text-secondary',
    bgIcon: 'bg-secondary-container/20',
    leader: 'St. MUP Silalahi',
    description: 'Marturia merupakan bidang pelayanan yang bertugas menyampaikan kabar baik tentang Yesus Kristus melalui pemberitaan Injil, pembinaan iman, dan kesaksian hidup. Pelayanan ini bertujuan agar setiap jemaat menjadi saksi Kristus dalam keluarga, pekerjaan, masyarakat, maupun dunia digital.',
    tasks: [
      'Mengembangkan pelayanan penginjilan dan kesaksian.',
      'Mendukung kegiatan katekisasi, pendalaman Alkitab, dan pembinaan iman.',
      'Mengelola pelayanan media informasi dan publikasi gereja.',
      'Mendorong jemaat untuk menjadi teladan dalam perkataan dan perbuatan.',
      'Menyelenggarakan seminar, pelatihan, dan kegiatan yang memperkuat iman jemaat.',
      'Menjangkau masyarakat melalui pelayanan yang membawa nilai-nilai Kristiani.'
    ]
  },
  diakonia: {
    title: 'Diakonia (Pelayanan Kasih)',
    icon: 'volunteer_activism',
    iconColor: 'text-tertiary',
    bgIcon: 'bg-tertiary-container/20',
    leader: null,
    description: 'Diakonia merupakan bidang pelayanan yang mewujudkan kasih Kristus melalui tindakan nyata kepada jemaat dan masyarakat. Pelayanan ini berorientasi pada kepedulian sosial, pemberdayaan, dan bantuan kepada mereka yang membutuhkan sebagai wujud kasih Allah dalam kehidupan sehari-hari.',
    tasks: [
      'Mengidentifikasi dan melayani jemaat yang membutuhkan bantuan.',
      'Mengoordinasikan kegiatan sosial, bakti sosial, dan pelayanan kemanusiaan.',
      'Mengunjungi jemaat yang sakit, lanjut usia, berduka, atau mengalami kesulitan.',
      'Mengelola program bantuan bagi masyarakat yang membutuhkan.',
      'Menumbuhkan semangat kepedulian dan pelayanan di kalangan jemaat.',
      'Bekerja sama dengan bidang pelayanan lainnya dalam kegiatan sosial gereja.'
    ]
  }
};

export default function MinistryPage({ type }) {
  const data = ministryData[type];

  if (!data) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <TopNavBar />
      
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="bg-surface-container-lowest rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 border border-outline-variant/30 shadow-lg relative overflow-hidden animate-fade-in-up">
          
          {/* Decorative background element */}
          <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full ${data.bgIcon} blur-3xl opacity-50`}></div>
          <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full ${data.bgIcon} blur-3xl opacity-50`}></div>
          
          <div className="relative z-10 flex flex-col items-center text-center mb-12">
            <div className={`w-24 h-24 rounded-full ${data.bgIcon} flex items-center justify-center mb-6 shadow-sm border border-outline-variant/20`}>
              <span className={`material-symbols-outlined text-[48px] ${data.iconColor}`}>
                {data.icon}
              </span>
            </div>
            
            <h1 className="font-display-lg text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              {data.title}
            </h1>
            
            {data.leader && (
              <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full font-label-lg shadow-sm border border-outline-variant/20 mb-6">
                <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                <span>Ketua: <b>{data.leader}</b></span>
              </div>
            )}
            
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed max-w-2xl mt-4">
              {data.description}
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/30 pb-4">
              <span className={`material-symbols-outlined text-[28px] ${data.iconColor}`}>task_alt</span>
              <h2 className="font-headline-md text-2xl font-bold">Tugas dan Tanggung Jawab</h2>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.tasks.map((task, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/10 shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-full ${data.bgIcon} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`font-bold ${data.iconColor} font-label-md`}>{idx + 1}</span>
                  </div>
                  <p className="font-body-md text-on-surface leading-relaxed pt-1">
                    {task}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
