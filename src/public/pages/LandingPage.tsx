import React from 'react';
import {
  Navbar,
  Hero,
  Problem,
  Solution,
  Features,
  ROI,
  Trust,
  Footer,
} from '../components';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <ROI />
        <Trust />
      </main>
      <Footer />
    </div>
  );
};
