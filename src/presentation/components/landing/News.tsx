'use client';

import { Calendar, User } from 'lucide-react';
import Image from 'next/image';

const news = [
  {
    title: 'Sosialisasi Kurikulum Merdeka di Jakarta Utara',
    date: '27 Nov 2025',
    author: 'Admin',
    image: '/images/news-curriculum.png',
    summary:
      'Sudin Pendidikan Wilayah II menggelar sosialisasi implementasi Kurikulum Merdeka bagi sekolah-sekolah di wilayah Jakarta Utara.',
  },
  {
    title: 'Prestasi Siswa Jakut di Olimpiade Sains Nasional',
    date: '25 Nov 2025',
    author: 'Humas',
    image: '/images/news-achievement.png',
    summary:
      'Selamat kepada para siswa yang telah berhasil meraih medali emas pada ajang OSN tingkat nasional tahun ini.',
  },
  {
    title: 'Peningkatan Kompetensi Guru Melalui Workshop Digital',
    date: '20 Nov 2025',
    author: 'Dikdas',
    image: '/images/news-teacher.png',
    summary:
      'Workshop pemanfaatan teknologi digital dalam pembelajaran diikuti oleh ratusan guru dari berbagai jenjang pendidikan.',
  },
];

export const News = () => {
  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Berita Terkini</h2>
            <p className="text-gray-600 text-lg">
              Informasi terbaru seputar pendidikan di Jakarta Utara.
            </p>
          </div>
          <button className="hidden md:block text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Lihat Semua Berita &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-2"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  Berita
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {item.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" /> {item.author}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
                <span className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center">
                  Baca Selengkapnya
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <button className="text-blue-600 font-semibold hover:text-blue-700">
            Lihat Semua Berita &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};