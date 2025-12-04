'use client';

import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { Input } from '@/presentation/components/shared/Input';
import { Button } from '@/presentation/components/shared/Button';
import { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Hubungi Kami</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Silakan hubungi kami untuk informasi lebih lanjut atau pertanyaan seputar layanan
              pendidikan.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Alamat Kantor</h3>
                  <p className="text-gray-600">
                    Jl. Laksda Yos Sudarso No.27-29, RT.19/RW.5, Kebon Bawang, Tanjung Priok,
                    Jakarta Utara
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">sudin.jp2@jakarta.go.id</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Telepon</h3>
                  <p className="text-gray-600">(021) 43931056</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Jam Layanan</h3>
                  <p className="text-gray-600">Senin - Jumat: 08:00 - 16:00 WIB</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden relative shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.988822487678!2d106.89047831476868!3d-6.132204995560124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f54c6c6c6c6d%3A0x6c6c6c6c6c6c6c6c!2sKantor%20Walikota%20Jakarta%20Utara!5e0!3m2!1sid!2sid!4v1629876543210!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Kirim Pesan</h3>
            <form className="space-y-6">
              <Input
                label="Nama Lengkap"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
              <Button className="w-full h-12 flex items-center justify-center">
                Kirim Pesan
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};