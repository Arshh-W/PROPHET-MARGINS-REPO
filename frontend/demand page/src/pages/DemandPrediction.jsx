import { useState } from 'react';
import Mode1Form from '../components/Mode1Form';
import Mode2Form from '../components/Mode2Form';
import Mode3Form from '../components/Mode3Form';

const DemandPrediction = () => {
  const [activeMode, setActiveMode] = useState(1);

  const modes = [
    {
      id: 1,
      title: 'Dataset + Category',
      description: 'Upload a dataset and analyze demand for a specific product category',
      component: Mode1Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: '#8B7355',
    },
    {
      id: 2,
      title: 'Direct Prediction',
      description: 'Predict demand directly from past 7 days data',
      component: Mode2Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: '#6B5D4F',
    },
    {
      id: 3,
      title: 'Overall Analysis',
      description: 'Analyze all categories in your dataset',
      component: Mode3Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: '#A0826D',
    },
  ];

  const ActiveComponent = modes.find(m => m.id === activeMode)?.component;

  return (
    <div className="min-h-screen bg-beige relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 tracking-tight">
              Demand Prediction
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
              <div className="w-2 h-2 bg-primary/30 rotate-45"></div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>
          </div>
          <p className="text-lg text-secondary/70 font-light max-w-2xl mx-auto leading-relaxed">
            Sophisticated analytics and forecasting for discerning businesses
          </p>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                style={activeMode === mode.id ? { backgroundColor: mode.color, borderColor: mode.color } : {}}
                className={`group relative overflow-hidden rounded-lg p-8 transition-all duration-300 border-2 ${
                  activeMode === mode.id
                    ? 'text-beige shadow-xl scale-[1.02]'
                    : 'bg-white/70 backdrop-blur-sm text-primary hover:bg-white border-primary/10 hover:border-primary/30 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      style={activeMode !== mode.id ? { backgroundColor: mode.color } : {}}
                      className={`p-3 rounded-lg ${
                        activeMode === mode.id 
                          ? 'bg-white/20 border-2 border-white/30' 
                          : 'text-white'
                      }`}
                    >
                      {mode.icon}
                    </div>
                    {activeMode === mode.id && (
                      <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-beige"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-left">
                    <div className="font-semibold text-xl mb-3 flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold border-2 ${
                        activeMode === mode.id ? 'bg-white/10 border-white/30' : 'bg-primary/5 border-primary/20 text-primary'
                      }`}>
                        {mode.id}
                      </span>
                      {mode.title}
                    </div>
                    <p className={`text-sm leading-relaxed font-light ${
                      activeMode === mode.id ? 'text-beige/90' : 'text-secondary/80'
                    }`}>
                      {mode.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-primary/10">
          <div className="bg-gradient-to-r from-primary/[0.02] to-secondary/[0.02] px-10 py-8 border-b border-primary/10">
            <div className="flex items-center gap-5">
              <div 
                style={{ backgroundColor: modes.find(m => m.id === activeMode)?.color }}
                className="p-4 rounded-lg text-white shadow-md"
              >
                {modes.find(m => m.id === activeMode)?.icon}
              </div>
              <div>
                <h2 className="text-3xl font-serif font-semibold text-primary mb-1">
                  {modes.find(m => m.id === activeMode)?.title}
                </h2>
                <p className="text-secondary/70 font-light">
                  {modes.find(m => m.id === activeMode)?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-10">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-md shadow-sm border border-primary/10">
            <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-secondary/70 font-light">
              Enterprise-grade security and confidentiality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;
