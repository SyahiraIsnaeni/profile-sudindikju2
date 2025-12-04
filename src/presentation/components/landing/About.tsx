'use client';

import { BookOpen, Users, Monitor, Award } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    title: 'Peningkatan Akses',
    description: 'Memastikan setiap anak mendapatkan hak pendidikan yang layak dan merata.',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: 'Pembinaan Sekolah',
    description: 'Melakukan pendampingan intensif untuk sekolah negeri dan swasta.',
  },
  {
    icon: <Monitor className="w-8 h-8 text-blue-600" />,
    title: 'Transformasi Digital',
    description: 'Mendorong digitalisasi dalam proses pembelajaran dan administrasi.',
  },
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: 'Peningkatan Mutu GTK',
    description:
      'Mengembangkan kompetensi Guru dan Tenaga Kependidikan secara berkelanjutan.',
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Tentang Kami</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Suku Dinas Pendidikan Wilayah II Jakarta Utara berkomitmen untuk mewujudkan layanan
            pendidikan yang prima, transparan, dan akuntabel demi terciptanya generasi unggul yang
            siap bersaing di era global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-200 hover:-translate-y-2 cursor-pointer"
            >
              <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};