import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Settings2, Globe, Beaker, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations = {
  en: {
    title: "Vintage Story Alloy Calculator",
    ingots: "Ingots",
    brass: "Brass",
    bismuthbronze: "Bismuth Bronze",
    tinbronze: "Tin Bronze",
    blackbronze: "Black Bronze",
    molybdochalkos: "Molybdochalkos",
    leadsolder: "Lead Solder",
    silversolder: "Silver Solder",
    cupronickel: "Cupronickel",
    electrum: "Electrum",
    copper: "Copper",
    zinc: "Zinc",
    bismuth: "Bismuth",
    tin: "Tin",
    gold: "Gold",
    silver: "Silver",
    lead: "Lead",
    nickel: "Nickel",
    nuggets: "Nuggets",
    proportions: "Proportions",
    maxCrucible: "Crucible Full! Max 4 stacks (512 nuggets).",
    selectAlloy: "Select an Alloy",
    language: "Language",
    totalSlots: "Slots Used",
  },
  ru: {
    title: "Калькулятор сплавов Vintage Story",
    ingots: "Слитки",
    brass: "Латунь",
    bismuthbronze: "Висмутовая Бронза",
    tinbronze: "Оловянная Бронза",
    blackbronze: "Черная Бронза",
    molybdochalkos: "Молибдохалк",
    leadsolder: "Свинцовый припой",
    silversolder: "Серебряный припой",
    cupronickel: "Мельхиор",
    electrum: "Электрум",
    copper: "Медь",
    zinc: "Цинк",
    bismuth: "Висмут",
    tin: "Олово",
    gold: "Золото",
    silver: "Серебро",
    lead: "Свинец",
    nickel: "Никель",
    nuggets: "Кусочки",
    proportions: "Пропорции",
    maxCrucible: "Тигель полон! Макс 4 стака (512 кусочков).",
    selectAlloy: "Выберите сплав",
    language: "Язык",
    totalSlots: "Занято слотов",
  },
  de: {
    title: "Vintage Story Legierungsrechner",
    ingots: "Barren",
    brass: "Messing",
    bismuthbronze: "Wismutbronze",
    tinbronze: "Zinnbronze",
    blackbronze: "Schwarzbronze",
    molybdochalkos: "Kupferblei",
    leadsolder: "Blei Lot",
    silversolder: "Silber Lot",
    cupronickel: "Kupfernickel",
    electrum: "Elektrum",
    copper: "Kupfer",
    zinc: "Zink",
    bismuth: "Wismut",
    tin: "Zinn",
    gold: "Gold",
    silver: "Silber",
    lead: "Blei",
    nickel: "Nickel",
    nuggets: "Klumpen",
    proportions: "Proportionen",
    maxCrucible: "Tiegel voll! Max 4 Stacks (512 Klumpen).",
    selectAlloy: "Wähle eine Legierung",
    language: "Sprache",
    totalSlots: "Belegte Plätze",
  },
  es: {
    title: "Calculadora de Aleaciones Vintage Story",
    ingots: "Lingotes",
    brass: "Latón",
    bismuthbronze: "Bronce de Bismuto",
    tinbronze: "Bronce de Estaño",
    blackbronze: "Bronce Negro",
    molybdochalkos: "Molibdochalkos",
    leadsolder: "Soldadura de Plomo",
    silversolder: "Soldadura de Plata",
    cupronickel: "Cuproníquel",
    electrum: "Electro",
    copper: "Cobre",
    zinc: "Zinc",
    bismuth: "Bismuto",
    tin: "Estaño",
    gold: "Oro",
    silver: "Plata",
    lead: "Plomo",
    nickel: "Níquel",
    nuggets: "Pepitas",
    proportions: "Proporciones",
    maxCrucible: "¡Crisol lleno! Máx 4 stacks (512 pepitas).",
    selectAlloy: "Selecciona una Aleación",
    language: "Idioma",
    totalSlots: "Espacios Usados",
  }
};

type Language = keyof typeof translations;

const alloys = [
  { id: "brass", metals: ["copper", "zinc"], ranges: [[60, 70], [30, 40]] },
  { id: "bismuthbronze", metals: ["bismuth", "zinc", "copper"], ranges: [[10, 20], [20, 30], [50, 70]] },
  { id: "tinbronze", metals: ["copper", "tin"], ranges: [[88, 92], [8, 12]] },
  { id: "blackbronze", metals: ["gold", "silver", "copper"], ranges: [[8, 16], [8, 16], [68, 84]] },
  { id: "molybdochalkos", metals: ["lead", "copper"], ranges: [[88, 92], [8, 12]] },
  { id: "leadsolder", metals: ["lead", "tin"], ranges: [[45, 55], [45, 55]] },
  { id: "silversolder", metals: ["silver", "tin"], ranges: [[40, 50], [50, 60]] },
  { id: "cupronickel", metals: ["copper", "nickel"], ranges: [[65, 75], [25, 35]] },
  { id: "electrum", metals: ["silver", "gold"], ranges: [[40, 60], [40, 60]] }
] as const;

type AlloyId = typeof alloys[number]['id'];

const metalStyles: Record<string, string> = {
  copper: "from-[#c87941] to-[#8c4a20]",
  zinc: "from-[#d1d5db] to-[#9ca3af]",
  bismuth: "from-[#fbcfe8] to-[#db2777]",
  tin: "from-[#e5e7eb] to-[#d1d5db]",
  gold: "from-[#fde047] to-[#eab308]",
  silver: "from-[#f3f4f6] to-[#9ca3af]",
  lead: "from-[#4b5563] to-[#374151]",
  nickel: "from-[#f8fafc] to-[#cbd5e1]"
};

const MetalIcon = ({ metal, className }: { metal: string, className?: string }) => (
  <div 
    className={cn(
      "rounded-full shadow-lg border border-white/20 bg-gradient-to-br flex items-center justify-center shrink-0",
      metalStyles[metal] || "from-gray-400 to-gray-600",
      className
    )}
  >
    <span className="text-[10px] font-bold text-black/40 uppercase tracking-tighter mix-blend-overlay">
      {metal.substring(0, 2)}
    </span>
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedAlloyId, setSelectedAlloyId] = useState<AlloyId | null>(null);
  const [ingots, setIngots] = useState<number>(1);
  const [percentages, setPercentages] = useState<number[]>([]);

  const t = translations[lang];
  const selectedAlloy = alloys.find(a => a.id === selectedAlloyId);

  // Initialize percentages when alloy changes
  useEffect(() => {
    if (selectedAlloy) {
      const initialPercentages = selectedAlloy.ranges.map(r => Math.floor((r[0] + r[1]) / 2));
      
      // Ensure they sum to 100
      let sum = initialPercentages.reduce((a, b) => a + b, 0);
      if (sum !== 100) {
        initialPercentages[initialPercentages.length - 1] += (100 - sum);
      }
      setPercentages(initialPercentages);
    }
  }, [selectedAlloyId]);

  const handlePercentageChange = (index: number, newValue: number) => {
    if (!selectedAlloy) return;
    
    const newPercentages = [...percentages];
    newPercentages[index] = newValue;
    
    // Calculate the last percentage
    let sum = 0;
    for (let i = 0; i < newPercentages.length - 1; i++) {
      sum += newPercentages[i];
    }
    let lastValue = 100 - sum;
    
    // Clamp lastValue to its allowed range
    const lastRange = selectedAlloy.ranges[selectedAlloy.ranges.length - 1];
    if (lastValue < lastRange[0]) {
      const diff = lastRange[0] - lastValue;
      newPercentages[index] -= diff;
      lastValue = lastRange[0];
    } else if (lastValue > lastRange[1]) {
      const diff = lastValue - lastRange[1];
      newPercentages[index] += diff;
      lastValue = lastRange[1];
    }
    
    newPercentages[newPercentages.length - 1] = lastValue;
    setPercentages(newPercentages);
  };

  // Calculate required nuggets
  const calculateNuggets = () => {
    if (!selectedAlloy || percentages.length === 0) return [];
    
    const nuggets: number[] = [];
    for (let m = 0; m < selectedAlloy.metals.length - 1; m++) {
      let units = ingots * percentages[m];
      let roundedUnits = Math.ceil(units / 5) * 5;
      if (roundedUnits > ingots * selectedAlloy.ranges[m][1]) {
        roundedUnits -= 5;
      }
      nuggets.push(roundedUnits / 5);
    }
    
    const sumOtherUnits = nuggets.reduce((a, b) => a + b, 0) * 5;
    const lastUnits = ingots * 100 - sumOtherUnits;
    nuggets.push(lastUnits / 5);
    
    return nuggets;
  };

  const nuggets = calculateNuggets();
  
  // Calculate crucible slots (1 stack = 128 nuggets)
  const slots = nuggets.reduce((acc, n) => acc + Math.ceil(n / 128), 0);

  return (
    <div className="min-h-screen bg-[#111110] text-zinc-300 font-sans selection:bg-amber-500/30">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-900/20 border border-amber-400/20">
              <Beaker className="text-amber-50" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-100 tracking-tight">
                {t.title}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Calculate perfect ratios for your foundry
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-2 hover:border-zinc-700 transition-colors cursor-pointer">
              <Globe size={16} className="text-zinc-400" />
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-sm font-medium text-zinc-300 outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
              <ChevronDown size={14} className="text-zinc-500 absolute right-4 pointer-events-none" />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Left Column: Alloy Selection & Inputs */}
          <div className="space-y-8">
            {/* Alloy Grid */}
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-zinc-700"></span>
                {t.selectAlloy}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {alloys.map(a => (
                  <button 
                    key={a.id}
                    onClick={() => setSelectedAlloyId(a.id)}
                    className={cn(
                      "p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 border relative overflow-hidden group",
                      selectedAlloyId === a.id 
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.1)]" 
                        : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    {selectedAlloyId === a.id && (
                      <motion.div 
                        layoutId="activeAlloy"
                        className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"
                      />
                    )}
                    <div className="flex -space-x-2 relative z-10">
                      {a.metals.map((m, i) => (
                        <MetalIcon 
                          key={m} 
                          metal={m} 
                          className={cn(
                            "w-8 h-8 border-2",
                            selectedAlloyId === a.id ? "border-[#1a1a19]" : "border-zinc-900 group-hover:border-zinc-800"
                          )} 
                          style={{ zIndex: a.metals.length - i }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-center relative z-10">{t[a.id as keyof typeof t]}</span>
                  </button>
                ))}
              </div>
            </section>

            <AnimatePresence mode="popLayout">
              {selectedAlloy && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm"
                >
                  {/* Ingot Input */}
                  <div className="flex flex-col items-center mb-10">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                      {t.ingots}
                    </label>
                    <div className="flex items-center gap-6 bg-zinc-950/50 p-2 rounded-full border border-zinc-800/50">
                      <button 
                        onClick={() => setIngots(Math.max(1, ingots - 1))} 
                        className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center hover:bg-zinc-700 text-2xl text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={ingots}
                        onChange={e => setIngots(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 text-center text-4xl sm:text-5xl font-serif font-medium bg-transparent text-amber-50 outline-none"
                      />
                      <button 
                        onClick={() => setIngots(ingots + 1)} 
                        className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center hover:bg-zinc-700 text-2xl text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                      <Settings2 size={16} />
                      {t.proportions}
                    </div>
                    
                    {selectedAlloy.metals.map((metal, i) => (
                      <div key={metal} className="relative">
                        <div className="flex justify-between items-end mb-3">
                          <div className="flex items-center gap-3">
                            <MetalIcon metal={metal} className="w-6 h-6" />
                            <span className="font-medium text-zinc-200">{t[metal as keyof typeof t]}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xl font-mono text-amber-400/90">{percentages[i]}%</span>
                          </div>
                        </div>
                        
                        <div className="relative h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                            style={{ width: `${percentages[i]}%` }}
                          />
                          <input 
                            type="range" 
                            min={selectedAlloy.ranges[i][0]} 
                            max={selectedAlloy.ranges[i][1]} 
                            value={percentages[i] || 0}
                            onChange={e => handlePercentageChange(i, parseInt(e.target.value))}
                            disabled={i === selectedAlloy.metals.length - 1}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2 px-1">
                          <span>{selectedAlloy.ranges[i][0]}%</span>
                          <span>{selectedAlloy.ranges[i][1]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Results */}
          <div className="lg:sticky lg:top-8">
            <AnimatePresence mode="wait">
              {selectedAlloy ? (
                <motion.section
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-serif text-zinc-100">{t.nuggets}</h3>
                    <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">
                      <span className="text-zinc-500">{t.totalSlots}:</span>
                      <span className={cn("font-bold", slots > 4 ? "text-red-400" : "text-amber-400")}>
                        {slots} / 4
                      </span>
                    </div>
                  </div>

                  {slots > 4 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-sm flex items-start gap-3"
                    >
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{t.maxCrucible}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedAlloy.metals.map((metal, i) => (
                      <div 
                        key={metal} 
                        className="flex flex-col items-center p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MetalIcon metal={metal} className="w-12 h-12 mb-4 shadow-xl" />
                        <span className="text-3xl font-mono text-zinc-100 mb-1">
                          {nuggets[i]}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                          {t[metal as keyof typeof t]}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20"
                >
                  <Beaker className="text-zinc-700 mb-4" size={48} />
                  <p className="text-zinc-500 font-medium">{t.selectAlloy}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
