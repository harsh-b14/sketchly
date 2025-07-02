'use client';
import { Footer } from '@/components/Footer';
import { HeroComponent } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated && token) {
      router.push('/rooms');
    } 
  }, [isAuthenticated, token]);


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <HeroComponent />

      <Features />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to transform your team's collaboration?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of users who trust WhiteSpace for their visual collaboration needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}