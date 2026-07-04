import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import LiturgyPage from './pages/LiturgyPage'
import NewsPage from './pages/NewsPage'
import GalleryPage from './pages/GalleryPage'
import MinistryPage from './pages/MinistryPage'
import ActivityDetailPage from './pages/ActivityDetailPage'
import BiblePage from './pages/BiblePage'
import BukuEndePage from './pages/BukuEndePage'
import KidungJemaatPage from './pages/KidungJemaatPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alkitab" element={<BiblePage />} />
        <Route path="/buku-ende" element={<BukuEndePage />} />
        <Route path="/kidung-jemaat" element={<KidungJemaatPage />} />
        <Route path="/layanan" element={<ServicesPage />} />
        <Route path="/tata-ibadah" element={<LiturgyPage />} />
        <Route path="/warta" element={<NewsPage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/koinonia" element={<MinistryPage type="koinonia" />} />
        <Route path="/marturia" element={<MinistryPage type="marturia" />} />
        <Route path="/diakonia" element={<MinistryPage type="diakonia" />} />
        <Route path="/kegiatan/:id" element={<ActivityDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App

