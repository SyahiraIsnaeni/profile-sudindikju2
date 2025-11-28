import { Navbar } from '@/presentation/components/Navbar';

export const LandingPage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-50 rounded-full">
            <p className="text-sm font-medium text-blue-600">
              Selamat Datang di Website Kami
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sudin Pendidikan Jakarta Utara Wilayah 2
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tempat berbagi informasi dan kegiatan pendidikan terpadu
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
            Jelajahi Sekarang
          </button>
        </div>
      </section>

      {/* Sections */}
      <section id="profil" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Profil</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Konten profil akan ditampilkan di sini
          </p>
        </div>
      </section>

      <section id="artikel" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Artikel</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Konten artikel akan ditampilkan di sini
          </p>
        </div>
      </section>

      <section id="kegiatan" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Kegiatan</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Konten kegiatan akan ditampilkan di sini
          </p>
        </div>
      </section>

      <section id="kontak" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Kontak</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Konten kontak akan ditampilkan di sini
          </p>
        </div>
      </section>
    </div>
  );
};