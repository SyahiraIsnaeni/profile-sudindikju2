'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="/images/education-bg.png"
        alt="Education Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 z-20 text-center text-white pt-20">
        <div className="animate-fadeInUp">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-100 text-sm font-medium mb-6 backdrop-blur-sm">
            Selamat Datang di Portal Resmi
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Suku Dinas Pendidikan Wilayah II <br />
            <span className="text-blue-300">Jakarta Utara</span>
          </h1>
        </div>

        <div className="animate-fadeInUp animation-delay-200">
          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Mendukung peningkatan mutu pendidikan yang berkualitas, inklusif, dan inovatif untuk
            masa depan generasi bangsa.
          </p>
        </div>

        <div className="animate-fadeInUp animation-delay-300 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-blue-600/30 transform hover:scale-105">
            Informasi Layanan
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold transition-all hover:border-white/60">
            Program Unggulan
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
};