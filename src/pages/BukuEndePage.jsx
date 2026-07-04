import TopNavBar from '../components/TopNavBar'
import SongSection from '../components/SongSection'
import Footer from '../components/Footer'

export default function BukuEndePage() {
  return (
    <>
      <TopNavBar />
      <div className="pt-20 min-h-screen bg-surface-container-lowest">
        <SongSection 
          title="Buku Ende HKBP"
          subtitle="Puji Tuhan melalui nyanyian rohani Buku Ende."
          apiEndpoint="ende"
          placeholder="Masukkan nomor Buku Ende..."
        />
      </div>
      <Footer />
    </>
  )
}
