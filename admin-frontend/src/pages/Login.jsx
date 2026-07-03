import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/church-bg.png')" }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 z-0 text-blue-50/70">
        <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,144C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,106.7C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[440px] px-4 py-8 flex flex-col items-center">
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full p-8 md:p-10 flex flex-col items-center">
          
          {/* Logo Recreation */}
          <div className="flex flex-col items-center justify-center text-[#1e3a8a] mb-2">
             <div className="relative flex flex-col items-center">
                {/* Cross */}
                <div className="h-6 w-1 bg-[#1e3a8a] relative z-10 rounded-t-sm">
                   <div className="absolute top-2 -left-2 w-5 h-1 bg-[#1e3a8a] rounded-full"></div>
                </div>
                {/* Circle */}
                <div className="w-12 h-12 border-4 border-[#1e3a8a] rounded-full -mt-1 flex items-center justify-center bg-white z-0">
                  <div className="w-2 h-2 bg-[#1e3a8a] rounded-full"></div>
                </div>
                {/* Banner */}
                <div className="bg-[#1e3a8a] text-white text-[10px] font-bold px-3 py-0.5 rounded-sm -mt-2 z-20">
                  HKBP
                </div>
             </div>
          </div>

          <h1 className="text-xl font-bold text-[#1e3a8a] text-center mt-3 font-headline-md tracking-wide">
            HKBP IMMANUEL KUTAJAYA
          </h1>
          <p className="text-gray-500 text-sm mt-1 mb-4 font-medium">Panel Admin</p>

          {/* Divider with Cross */}
          <div className="flex items-center w-full max-w-[200px] mb-5">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="text-[#1e3a8a] px-3 font-bold">†</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>

          <h2 className="text-lg font-bold text-[#1e3a8a] mb-1 text-center">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-500 text-[13px] text-center leading-relaxed mb-6">
            Silakan masuk untuk mengakses<br/>panel administrasi gereja.
          </p>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 font-semibold text-[13px]">Email / Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  person
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-[#25429a] focus:ring-1 focus:ring-[#25429a] transition-all" 
                  placeholder="Masukkan email atau username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 font-semibold text-[13px]">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  lock
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-[#25429a] focus:ring-1 focus:ring-[#25429a] transition-all" 
                  placeholder="Masukkan password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-[13px] mt-1 mb-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#25429a] focus:ring-[#25429a]" />
                Ingat saya
              </label>
              <a href="#" className="text-[#25429a] font-semibold hover:underline">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#25429a] text-white py-2.5 rounded-lg text-[15px] font-semibold hover:bg-[#1a3178] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-900/20"
            >
              <span className="material-symbols-outlined text-[18px]">
                {loading ? 'hourglass_empty' : 'lock_open'}
              </span>
              {loading ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>

          {/* Or Divider */}
          <div className="flex items-center w-full my-6">
            <div className="h-px bg-gray-100 flex-grow"></div>
            <span className="text-gray-400 text-[13px] px-4">atau</span>
            <div className="h-px bg-gray-100 flex-grow"></div>
          </div>

          {/* Google Button */}
          <button type="button" className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2 text-gray-600/80 text-[12px] font-medium">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          Akses admin hanya untuk pengurus resmi<br/>HKBP Immanuel Kutajaya
        </div>
      </div>
    </div>
  );
}
