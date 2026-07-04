import TopNavBar from '../components/TopNavBar'
import BibleSection from '../components/BibleSection'
import Footer from '../components/Footer'

export default function BiblePage() {
  return (
    <>
      <TopNavBar />
      <div className="pt-20">
        <BibleSection />
      </div>
      <Footer />
    </>
  )
}
