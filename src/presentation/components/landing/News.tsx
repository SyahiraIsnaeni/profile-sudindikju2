import { Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

async function getLatestNews() {
  const news = await prisma.artikel.findMany({
    where: {
      status: 1,
      // Optional: Filter by specific category if needed
      // kategori: { in: ['Berita', 'Pengumuman'] } 
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 3,
  });
  return news;
}

export const News = async () => {
  const newsData = await getLatestNews();

  // Helper to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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
          {newsData.length > 0 ? (
            newsData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  {item.gambar ? (
                    <Image
                      src={item.gambar} // Ensure this path is valid/accessible if it's a URL or local path
                      alt={item.judul}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Placeholder if no image
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    {item.kategori || 'Berita'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {formatDate(item.tanggal)}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" /> {item.penulis || 'Admin'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.judul}
                  </h3>
                  {/* Avoid rendering HTML directly unless sanitized, but description editor produces HTML */}
                  <div
                    className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.deskripsi || '' }}
                  />
                  <span className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center">
                    Baca Selengkapnya
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              Belum ada berita atau pengumuman.
            </div>
          )}
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