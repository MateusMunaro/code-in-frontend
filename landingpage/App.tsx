import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { ROI } from './components/ROI';
import { Trust } from './components/Trust';
import { Footer } from './components/Footer';

function App() {
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
}

export default App;