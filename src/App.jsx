import React, { useState } from 'react';
import { Share2, User, Play, Square, Settings, Beef, Bird, PiggyBank, Wheat, Sprout, Activity, CheckCircle2, Factory, Map, Sun, Layers, Bug, Leaf, Apple, Cherry } from 'lucide-react';
import { LAND_DATABASE, MANURE_DATABASE, CROP_REQUIREMENTS, determineOptimalMix } from './manureData';

// Helper to get component by icon string
const IconMapper = ({ name, size = 24, className = "" }) => {
  const icons = {
    Beef: Beef,
    Bird: Bird,
    PiggyBank: PiggyBank,
    Wheat: Wheat,
    Sprout: Sprout,
    Map: Map,
    Sun: Sun,
    Layers: Layers,
    Bug: Bug,
    Leaf: Leaf,
    Apple: Apple,
    Cherry: Cherry
  };
  const IconComponent = icons[name] || Activity;
  return <IconComponent size={size} className={className} />;
};

export default function App() {
  const [mode, setMode] = useState('individual'); // 'individual' | 'cooperative'
  const [selectedLand, setSelectedLand] = useState(null);
  const [selectedManures, setSelectedManures] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleStart = () => {
    if (!selectedLand || selectedManures.length === 0 || !selectedCrop) return;
    setIsProcessing(true);
    setResult(null);

    // Simulate machine processing time
    setTimeout(() => {
      const mix = determineOptimalMix(selectedLand, selectedManures, selectedCrop);
      setResult(mix);
      setIsProcessing(false);
    }, 2000);
  };

  const handleStop = () => {
    setIsProcessing(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-7xl">
        {/* Header / Brand */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b-4 border-slate-800">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 text-slate-900 p-3 rounded-none border-4 border-emerald-600">
              <Factory size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">Smart Organic Rwanda</h1>
              <h2 className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Smart-Mix Bio-fertilizer</h2>
            </div>
          </div>

          {/* Toggle Mode */}
          <div className="mt-4 md:mt-0 flex items-center bg-slate-800 p-2 border-2 border-slate-700 w-full md:w-auto">
            <button
              onClick={() => setMode('individual')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${mode === 'individual' ? 'bg-emerald-500 text-slate-900 border-2 border-emerald-400' : 'text-slate-400 hover:text-white border-2 border-transparent'}`}
            >
              <User size={18} />
              Individual
            </button>
            <button
              onClick={() => setMode('cooperative')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${mode === 'cooperative' ? 'bg-blue-500 text-slate-900 border-2 border-blue-400' : 'text-slate-400 hover:text-white border-2 border-transparent'}`}
            >
              <Share2 size={18} />
              Cooperative
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Control Panel Left - Inputs */}
          <div className="lg:col-span-5 space-y-8">

            {/* Step 1: Select Land */}
            <section className="bg-slate-800 border-4 border-slate-700 p-6 relative">
              <div className="absolute top-0 left-0 bg-emerald-500 text-slate-900 px-3 py-1 font-bold flex items-center gap-2 uppercase text-xs tracking-widest -mt-4 ml-4">
                Step 1 <CheckCircle2 size={14} />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide opacity-90 mt-2 text-slate-300">Select Land/Soil Type</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(LAND_DATABASE).map(land => (
                  <button
                    key={land.id}
                    onClick={() => setSelectedLand(land.id)}
                    className={`flex flex-col items-center justify-center p-4 border-4 transition-all duration-200 ${selectedLand === land.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    <IconMapper name={land.icon} size={40} className="mb-3" />
                    <span className="font-bold uppercase text-xs tracking-wider">{land.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Select Manure */}
            <section className="bg-slate-800 border-4 border-slate-700 p-6 relative">
              <div className="absolute top-0 left-0 bg-emerald-500 text-slate-900 px-3 py-1 font-bold flex items-center gap-2 uppercase text-xs tracking-widest -mt-4 ml-4">
                Step 2 <CheckCircle2 size={14} />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide opacity-90 mt-2 text-slate-300">Select Waste Sources (Multiple)</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(MANURE_DATABASE).map(man => (
                  <button
                    key={man.id}
                    onClick={() => {
                      if (selectedManures.includes(man.id)) {
                        setSelectedManures(selectedManures.filter(id => id !== man.id));
                      } else {
                        setSelectedManures([...selectedManures, man.id]);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-4 border-4 transition-all duration-200 ${selectedManures.includes(man.id)
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    <IconMapper name={man.icon} size={40} className="mb-3" />
                    <span className="font-bold uppercase text-xs tracking-wider">{man.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Select Crop */}
            <section className="bg-slate-800 border-4 border-slate-700 p-6 relative">
              <div className="absolute top-0 left-0 bg-emerald-500 text-slate-900 px-3 py-1 font-bold flex items-center gap-2 uppercase text-xs tracking-widest -mt-4 ml-4">
                Step 3 <CheckCircle2 size={14} />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide opacity-90 mt-2 text-slate-300">Select Target Crop</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(CROP_REQUIREMENTS).map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`flex flex-col items-center justify-center p-4 border-4 transition-all duration-200 ${selectedCrop === crop.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    <IconMapper name={crop.icon} size={40} className="mb-3" />
                    <span className="font-bold uppercase text-sm tracking-wider">{crop.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Machine Controls */}
            <section className="bg-slate-800 border-4 border-slate-700 p-6 flex items-center justify-center gap-8 shadow-inner">
              <button
                onClick={handleStart}
                disabled={!selectedLand || selectedManures.length === 0 || !selectedCrop || isProcessing}
                className={`relative overflow-hidden w-32 h-32 rounded-full font-bold uppercase tracking-widest text-lg flex flex-col items-center justify-center border-8 transition-all active:scale-95 ${!selectedLand || selectedManures.length === 0 || !selectedCrop
                  ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed shadow-none'
                  : isProcessing
                    ? 'bg-amber-500 border-amber-600 text-amber-900 animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                    : 'bg-emerald-500 border-emerald-600 text-emerald-950 hover:bg-emerald-400 hover:border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                  }`}
              >
                <Play size={40} className={`mb-1 ${isProcessing ? 'animate-spin' : ''}`} fill="currentColor" />
                {isProcessing ? 'MIXING' : 'START'}
              </button>

              <button
                onClick={handleStop}
                className="w-24 h-24 rounded-full font-bold uppercase tracking-widest text-sm flex flex-col items-center justify-center border-8 border-red-700 bg-red-600 text-red-100 hover:bg-red-500 hover:border-red-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              >
                <Square size={24} className="mb-1" fill="currentColor" />
                STOP
              </button>
            </section>

          </div>

          {/* Control Panel Right - Output/Result */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-8">

            <section className="bg-slate-800 border-4 border-slate-700 p-8 relative flex-1 flex flex-col">
              <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 px-4 py-2 font-bold flex items-center gap-2 uppercase text-xs tracking-widest border-b-4 border-l-4 border-slate-900">
                <Settings size={14} className={isProcessing ? "animate-spin" : "opacity-50"} /> System Output
              </div>

              <h3 className="text-2xl font-black mb-6 uppercase tracking-wider text-slate-400 border-b-4 border-slate-700 pb-4">
                Designer Fertilizer Recipe
              </h3>

              {!result && !isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <Activity size={80} className="mb-4" />
                  <p className="text-lg uppercase tracking-widest font-bold text-center">Awaiting Input Parameters<br />Select land, source, and crop to begin</p>
                </div>
              )}

              {isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-amber-500">
                  <Settings size={80} className="mb-6 animate-spin" />
                  <p className="text-2xl font-black uppercase tracking-widest animate-pulse">Analyzing Bio-Samples...</p>
                  <div className="w-full max-w-md bg-slate-900 h-4 mt-8 border-2 border-slate-700 p-0.5">
                    <div className="bg-amber-500 h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              )}

              {result && !isProcessing && (
                <div className="flex-1 flex flex-col animate-fade-in">

                  {/* Expected Yield Header */}
                  <div className="bg-emerald-500 text-emerald-950 p-6 border-4 border-emerald-600 mb-8 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm mb-1 opacity-80">Predicted Yield Increase</h4>
                      <p className="text-5xl font-black">{result.yieldIncrease}</p>
                    </div>
                    <Activity size={64} className="opacity-50" />
                  </div>

                  {/* Recipe Formulation */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-900 border-4 border-slate-700 p-6 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Primary Base</p>
                      <p className="text-3xl font-black text-white">{result.mixRatio.base}%</p>
                      <p className="text-lg text-emerald-400 font-bold uppercase tracking-wide mt-1">{result.baseManure}</p>
                    </div>
                    <div className="bg-slate-900 border-4 border-slate-700 p-6 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Supplement</p>
                      <p className="text-3xl font-black text-white">{result.mixRatio.supplementary}%</p>
                      <p className="text-lg text-amber-400 font-bold uppercase tracking-wide mt-1">{result.supplementaryManure}</p>
                    </div>
                  </div>

                  {/* Nutrient Gap Analysis */}
                  <div className="mb-8">
                    <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-4 border-l-4 border-emerald-500 pl-3">Nutrient Gap Match (NPK)</h4>
                    <div className="space-y-4">
                      {/* Nitrogen */}
                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                          <span>Nitrogen (N)</span>
                          <span className="text-emerald-400">{result.nutrientGap.n.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-4 border-2 border-slate-700 p-0.5">
                          <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out" style={{ width: `${result.nutrientGap.n}%` }}></div>
                        </div>
                      </div>
                      {/* Phosphorus */}
                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                          <span>Phosphorus (P)</span>
                          <span className="text-emerald-400">{result.nutrientGap.p.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-4 border-2 border-slate-700 p-0.5">
                          <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out delay-100" style={{ width: `${result.nutrientGap.p}%` }}></div>
                        </div>
                      </div>
                      {/* Potassium */}
                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                          <span>Potassium (K)</span>
                          <span className="text-emerald-400">{result.nutrientGap.k.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-4 border-2 border-slate-700 p-0.5">
                          <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out delay-200" style={{ width: `${result.nutrientGap.k}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rationale Terminal */}
                  <div className="mt-auto bg-slate-900 border-4 border-slate-700 p-4 font-mono text-sm leading-relaxed pointer-events-none">
                    <div className="text-emerald-500 font-bold mb-2">&gt;&gt; SYSTEM_REASONING_ENGINE</div>
                    <p className="text-slate-300">{result.rationale}</p>
                    <div className="w-2 h-4 bg-emerald-500 animate-pulse mt-2 inline-block"></div>
                  </div>

                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
