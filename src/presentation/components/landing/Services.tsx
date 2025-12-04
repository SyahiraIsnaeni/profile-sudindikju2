'use client';

import {
  GraduationCap,
  Info,
  FileText,
  MessageSquare,
  Database,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

const services = [
  { title: 'PPDB Online', icon: <GraduationCap className="w-6 h-6" /> },
  { title: 'Informasi Sekolah', icon: <Info className="w-6 h-6" /> },
  { title: 'Layanan Administratif', icon: <FileText className="w-6 h-6" /> },
  { title: 'Pengaduan Masyarakat', icon: <MessageSquare className="w-6 h-6" /> },
  { title: 'Data Pendidikan', icon: <Database className="w-6 h-6" /> },
  { title: 'Pembinaan GTK', icon: <UserCheck className="w-6 h-6" /> },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Layanan Publik</h2>
          <p className="text-gray-600 text-lg">Akses mudah dan cepat ke berbagai layanan pendidikan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer flex items-center justify-between hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:rotate-6 transition-transform duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};