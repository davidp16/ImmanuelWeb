import TopNavBar from '../components/TopNavBar'
import SongSection from '../components/SongSection'
import Footer from '../components/Footer'

export default function KidungJemaatPage() {
  return (
    <>
      <TopNavBar />
      <div className="pt-20 min-h-screen bg-surface-container-lowest">
        <SongSection 
          title="Kidung Jemaat"
          subtitle="Puji Tuhan melalui nyanyian rohani Kidung Jemaat."
          apiEndpoint="kj"
          placeholder="Masukkan nomor Kidung Jemaat..."
        />
      </div>
      <Footer />
    </>
  )
}
