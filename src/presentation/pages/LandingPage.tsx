import { Navbar } from '@/presentation/components/landing/Navbar';
import { Hero } from '@/presentation/components/landing/Hero';
import { About } from '@/presentation/components/landing/About';
import { Programs } from '@/presentation/components/landing/Programs';
import { Services } from '@/presentation/components/landing/Services';
import { News } from '@/presentation/components/landing/News';
import { Contact } from '@/presentation/components/landing/Contact';
import { Footer } from '@/presentation/components/landing/Footer';
import { ChatBot } from '@/presentation/components/landing/ChatBot';

export const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Programs />
      <Services />
      <News />
      <Contact />
      <Footer />
      <ChatBot />
    </main>
  );
};