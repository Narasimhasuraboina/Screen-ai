import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveDemo } from './components/InteractiveDemo';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { InstallGuide } from './components/InstallGuide';
import { PrivacySection } from './components/PrivacySection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="bg-mesh" />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Hero />
        <InteractiveDemo />
        <HowItWorks />
        <Features />
        <InstallGuide />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
};

export default App;

