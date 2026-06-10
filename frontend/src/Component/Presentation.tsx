import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  Flame,
  Cpu,
  DollarSign,
  TriangleAlert,
  ShieldCheck,
  Zap,
  Wifi,
  BrainCircuit,
  Layers,
  Activity,
  Sparkles,
  MonitorPlay,
  Terminal,
  ChevronRight,
  BookOpen,
  MapPin,
  Maximize,
  GitBranch,
  Database,
  Monitor,
  Server,
  Eye,
  Lock,
  Chrome,
  Shield,
  ArrowRight,
  Target,
  TrendingUp,
  Trees,
  Sun,
  ArrowUpRight,
  Droplets,
  Waves,
  Building2,
  CheckCircle,
  Play
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

import wildfire1 from '../images/wildfire_1.png';
import wildfire2 from '../images/wildfire_2.png';
import nowildfire1 from '../images/nowildfire_1.png';
import nowildfire2 from '../images/nowildfire_2.png';
import wildfireImg from '../images/wildfire.png';
import nowildfireImg from '../images/nowildfire.png';
import mobilenetv2Arch from '../images/mobilenetv2_arch.png';
import workflowImg from '../images/workflow.png';
import gradcamCanadaImg from '../images/gradcam_canada.png';

// Chart datasets
const donutData = [
  { name: 'Wildfire', value: 22710, color: '#f97316' }, // orange-500
  { name: 'No Wildfire', value: 20140, color: '#10b981' } // emerald-500
];

const lossData = [
  { epoch: '1', trainLoss: 0.092, valLoss: 0.059 },
  { epoch: '2', trainLoss: 0.046, valLoss: 0.040 },
  { epoch: '3', trainLoss: 0.030, valLoss: 0.026 },
  { epoch: '4', trainLoss: 0.026, valLoss: 0.027 },
  { epoch: '5', trainLoss: 0.023, valLoss: 0.028 },
  { epoch: '6', trainLoss: 0.018, valLoss: 0.024 },
  { epoch: '7', trainLoss: 0.015, valLoss: 0.021 },
  { epoch: '8', trainLoss: 0.012, valLoss: 0.019 },
  { epoch: '9', trainLoss: 0.011, valLoss: 0.020 },
  { epoch: '10', trainLoss: 0.011, valLoss: 0.021 }
];

const accuracyData = [
  { epoch: '1', trainAcc: 96.5, valAcc: 97.9 },
  { epoch: '2', trainAcc: 98.2, valAcc: 98.6 },
  { epoch: '3', trainAcc: 98.8, valAcc: 99.1 },
  { epoch: '4', trainAcc: 99.0, valAcc: 99.1 },
  { epoch: '5', trainAcc: 99.1, valAcc: 99.1 },
  { epoch: '6', trainAcc: 99.4, valAcc: 98.95 },
  { epoch: '7', trainAcc: 99.45, valAcc: 99.3 },
  { epoch: '8', trainAcc: 99.55, valAcc: 99.4 },
  { epoch: '9', trainAcc: 99.65, valAcc: 99.35 },
  { epoch: '10', trainAcc: 99.65, valAcc: 99.3 }
];

const pyroVisionData = [
  { name: 'Accuracy', value: 0.9551, fill: '#56a2e3' },
  { name: 'F1-Score', value: 0.9516, fill: '#50d487' },
  { name: 'Recall', value: 0.9480, fill: '#e3675c' },
  { name: 'Precision', value: 0.9553, fill: '#f3b244' }
];

const resNetData = [
  { name: 'Accuracy', value: 0.9960, fill: '#56a2e3' },
  { name: 'F1-Score', value: 0.9964, fill: '#50d487' },
  { name: 'Recall', value: 0.9931, fill: '#e3675c' },
  { name: 'Precision', value: 0.9997, fill: '#f3b244' }
];

const mobileNetData = [
  { name: 'Accuracy', value: 0.9949, fill: '#56a2e3' },
  { name: 'F1-Score', value: 0.9954, fill: '#50d487' },
  { name: 'Recall', value: 0.9917, fill: '#e3675c' },
  { name: 'Precision', value: 0.9991, fill: '#f3b244' }
];

interface PlotBorderProps {
  width?: number;
  height?: number;
  margin?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}

const PlotBorder = (props: PlotBorderProps) => {
  const { width, height, margin } = props;
  if (!width || !height || !margin) return null;
  const x = margin.left || 0;
  const y = margin.top || 0;
  const w = width - (margin.left || 0) - (margin.right || 0);
  const h = height - (margin.top || 0) - (margin.bottom || 0);
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="none"
      stroke="#000000"
      strokeWidth={1}
    />
  );
};
const ModelPerformanceChart = ({ title, subTitle, data }: { title: string; subTitle: string; data: any[] }) => {
  return (
    <div className="flex flex-col items-center w-full bg-white p-2 rounded-xl">
      {/* Title */}
      <div className="text-center mb-3 font-sans font-bold text-xs sm:text-[13px] text-black leading-tight">
        <div className="font-extrabold">{title}</div>
        <div className="font-extrabold">{subTitle}</div>
      </div>

      {/* Chart container */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            barCategoryGap="18%"
          >
            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#000000"
              tickLine={{ stroke: '#000000' }}
              tick={{ fill: '#000000', fontWeight: 'bold', fontSize: 10 }}
            />
            <YAxis
              domain={[0.92, 1.00]}
              ticks={[0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00]}
              tickFormatter={(v) => v.toFixed(2)}
              stroke="#000000"
              tickLine={{ stroke: '#000000' }}
              tick={{ fill: '#000000', fontWeight: 'bold', fontSize: 10 }}
              width={45}
              label={{
                value: 'Score',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontWeight: 'bold', fill: '#000000', fontSize: 11 }
              }}
            />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000000" strokeWidth={1} />
              ))}
              <LabelList
                dataKey="value"
                position="insideTop"
                formatter={(val: any) => (typeof val === 'number' ? val.toFixed(4) : val)}
                style={{ fill: '#000000', fontWeight: 'bold', fontSize: 10, fontFamily: 'sans-serif' }}
                dy={12}
              />
            </Bar>
            <PlotBorder />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};



interface Section {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  shortTitle: string;
}

export default function Presentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('section-1');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [showEdgeCase, setShowEdgeCase] = useState(false);

  const [xaiStep, setXaiStep] = useState(1);
  const [isPlayingXai, setIsPlayingXai] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlayingXai) {
      interval = setInterval(() => {
        setXaiStep((prev) => {
          if (prev >= 4) {
            setIsPlayingXai(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlayingXai]);

  const playXaiAnimation = () => {
    setXaiStep(1);
    setIsPlayingXai(true);
  };

  const [isTr, setIsTr] = useState(false);



  const sections: Section[] = [
    { id: 'section-1', num: 1, title: isTr ? 'Literatür Taraması' : 'Literature Review', subtitle: isTr ? 'Tespit vs. Tahmin ve Model Seçimi' : 'Detection vs. Prediction & Model Selection', shortTitle: isTr ? 'Literatür' : 'Literature' },
    { id: 'section-2', num: 2, title: isTr ? 'Veri ve Uzamsal Kalıplar' : 'Data & Spatial Patterns', subtitle: isTr ? 'Uydu Veri Kümeleri ve Izgara Formatları' : 'Satellite Datasets & Grid Formats', shortTitle: isTr ? 'Veri' : 'Data' },
    { id: 'section-3', num: 3, title: isTr ? 'Sistem Tasarımı ve Akış' : 'System Design & Flow', subtitle: isTr ? '3-Hizmet Mikro Hizmetler ve Güvenlik' : '3-Service Microservices & Security', shortTitle: isTr ? 'Sistem' : 'System' },
    { id: 'section-4', num: 4, title: isTr ? 'Mimari Boru Hattı' : 'Architecture Pipeline', subtitle: isTr ? 'Derin Öğrenme Katmanları ve Eğitim' : 'Deep Learning Layers & Training', shortTitle: isTr ? 'Mimari' : 'Architecture' },
    { id: 'section-5', num: 5, title: isTr ? 'Sonuçlar' : 'Results', subtitle: isTr ? 'Model Çıkarımı ve Metrikleri' : 'Model Inference & Metrics', shortTitle: isTr ? 'Sonuçlar' : 'Results' },
    { id: 'section-6', num: 6, title: isTr ? 'Açıklanabilir Yapay Zeka' : 'Explainable Artificial Intelligence', subtitle: isTr ? 'Model Kararlarının Görselleştirilmesi' : 'Visualization of Model Decisions', shortTitle: isTr ? 'XAI' : 'XAI' }
  ];

  // IntersectionObserver to auto-update active tab on scroll
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger when section is around top-middle of screen
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // Account for sticky header
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col relative overflow-x-hidden">
      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full pb-24">
        {/* BACKGROUND GRAPHICS */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

        {/* FIXED HEADER WITH NAVBAR */}
        <div className="fixed top-4 z-[100] px-1 sm:px-2 md:px-4 w-full flex justify-center pointer-events-none left-0">
          <header className="pointer-events-auto bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full p-1 md:p-1.5 flex items-center gap-1 sm:gap-1.5 md:gap-3 max-w-[98vw] lg:max-w-[95vw] overflow-x-auto scrollbar-hide">

            {/* Logo and Back Button */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 pl-0.5 md:pl-1">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors border border-slate-200 shadow-sm shrink-0"
                title={isTr ? "Ana Sayfaya Dön" : "Back to home"}
              >
                <ArrowLeft size={12} className="md:w-[14px] md:h-[14px]" />
              </button>
              <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-slate-200/60 hidden min-[900px]:flex">
                <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-sm text-white shrink-0">
                  <MonitorPlay size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-slate-900 uppercase leading-none">FORESPARK</span>
                  <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{isTr ? 'Sunum' : 'Presentation'}</span>
                </div>
              </div>
            </div>

            {/* Sections Navigation */}
            <nav className="flex items-center gap-0.5 md:gap-1 shrink-0 pr-0.5 md:pr-1">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`whitespace-nowrap px-1.5 md:px-2.5 2xl:px-3 py-1 md:py-1.5 rounded-full text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 md:gap-1.5 shrink-0 ${activeSection === sec.id
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  title={sec.title}
                >
                  <span className={`flex items-center justify-center w-4 h-4 md:w-3.5 md:h-3.5 rounded-full text-[9px] md:text-[8px] shrink-0 ${activeSection === sec.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/70 text-slate-500'
                    }`}>
                    {sec.num}
                  </span>
                  <span className="hidden 2xl:inline">{sec.title}</span>
                  <span className="hidden min-[800px]:inline 2xl:hidden">{sec.shortTitle}</span>
                </button>
              ))}

              {/* Special Analysis Button */}
              <button
                onClick={() => navigate('/app')}
                className="ml-0.5 md:ml-1 2xl:ml-2 flex items-center gap-1 md:gap-1.5 px-2 md:px-3 2xl:px-4 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-[8px] md:text-[9px] 2xl:text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 shrink-0"
                title={isTr ? "Analiz Aracını Aç" : "Open Analysis Tool"}
              >
                <Zap size={12} className="animate-pulse shrink-0 md:w-[14px] md:h-[14px]" />
                <span className="hidden min-[900px]:inline">{isTr ? 'ANALİZE BAŞLA' : 'START ANALYSIS'}</span>
                <span className="min-[900px]:hidden">{isTr ? 'ANALİZ' : 'APP'}</span>
              </button>
              {/* Language Toggle Button */}
              <button
                onClick={() => setIsTr(!isTr)}
                className={`ml-0.5 md:ml-1 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full font-black text-[8px] md:text-[10px] transition-all duration-300 shadow-sm border bg-slate-100 text-slate-600 shrink-0`}
                title="Toggle Turkish/English"
              >
                {isTr ? 'TR' : 'EN'}
              </button>
            </nav>

          </header>
        </div>

        {/* TOP SUMMARY INTRO BANNER */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-8 w-full">
          <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="max-w-2xl z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black tracking-wider text-emerald-700 uppercase mb-4">
                <BookOpen size={12} /> {isTr ? 'Proje Tezi' : 'Project Thesis'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {isTr ? 'ForeSpark Proje' : 'ForeSpark Project'} <span className="text-emerald-600">{isTr ? 'Sunumu' : 'Keynote'}</span>
              </h1>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {isTr ? 'Canlı proje sunum panelimize hoş geldiniz. Burada literatür taramasını, veri seti metriklerini, model seçimi detaylarını ve yapay zeka tabanlı Orman Yangını tahminimizi yönlendiren gelişmiş mimarileri özetliyoruz.' : 'Welcome to our live project presentation dashboard. Here, we outline the literature review, dataset metrics, model selection details, and advanced weighted architectures that drive our AI-based Forest Fire prediction.'}
              </p>
            </div>

          </div>
        </section>

        {/* CORE PRESENTATION CONTENT */}
        <section className="max-w-6xl mx-auto px-6 py-4 w-full">
          <div className="space-y-16">

            {/* SECTION 1 — LITERATURE REVIEW */}
            <div id="section-1" className="scroll-mt-28">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 1' : 'SECTION 1'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'Literatür Taraması' : 'Literature Review'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {isTr ? 'Temel paradigma değişimlerini oluşturmak: Tespiti Tahmine karşı değerlendirmek ve model seçimini haklı çıkarmak.' : 'Establishing the core paradigm shifts: Detection vs. Prediction, and justifying model selection.'}
                </p>
              </div>

              {/* Three-Column Card Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Card 1 — Detection Approach */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative group hover:border-red-400/50 hover:shadow-md transition-all duration-300">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-[9px] font-black tracking-wider text-red-600 uppercase">
                        <ShieldAlert size={12} />
                        {isTr ? 'TESPİT YAKLAŞIMI' : 'DETECTION APPROACH'}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">{isTr ? 'Tespitin Zayıf Yönleri' : 'Detection Pitfalls'}</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      {isTr ? 'Geleneksel algılama doğası gereği tutuşma sonrası çalışır ve müdahalede kritik gecikmelere neden olur.' : 'Traditional sensing is inherently post-ignition, creating critical lags in mitigation.'}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <Flame size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? <>Tutuşmadan <span className="text-red-600 font-black">SONRA</span> tepki verir — çok geç</> : <>Reacts <span className="text-red-600 font-black">AFTER</span> ignition — too late</>}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <Cpu size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Gerçek zamanlı veri akışı gerektirir' : 'Requires real-time feeds'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <DollarSign size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Yüksek altyapı maliyeti' : 'High infrastructure cost'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <TriangleAlert size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? <>PyroVision duyarlılık sınırı: <span className="text-red-600 font-black">%94.80</span></> : <>PyroVision recall cap: <span className="text-red-600 font-black">94.80%</span></>}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 — Prediction Approach */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative group hover:border-emerald-400/50 hover:shadow-md transition-all duration-300">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[9px] font-black tracking-wider text-emerald-700 uppercase">
                        <ShieldCheck size={12} />
                        {isTr ? 'TAHMİN YAKLAŞIMI' : 'PREDICTION APPROACH'}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">{isTr ? 'Tahminin Avantajları' : 'Prediction Advantages'}</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      {isTr ? 'Önleyici risk modellemesi, yangın tehditlerini öngörmek için uzamsal dokuları kullanır.' : 'Pre-emptive risk modeling uses spatial textures to forecast fire threats.'}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Zap size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? <>Tutuşmadan <span className="text-emerald-600 font-black">ÖNCE</span> harekete geçer — proaktif</> : <>Acts <span className="text-emerald-600 font-black">BEFORE</span> ignition — proactive</>}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Wifi size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Gerçek zamanlı akış gerekmez' : 'No real-time stream required'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <DollarSign size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Sıfır saha kurulum maliyeti' : 'Zero field deployment cost'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <ShieldCheck size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Tam uzamsal bağlamı kullanır' : 'Uses full spatial context'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 — Why MobileNetV2 */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative group hover:border-purple-400/50 hover:shadow-md transition-all duration-300">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-[9px] font-black tracking-wider text-purple-700 uppercase">
                        <BrainCircuit size={12} />
                        {isTr ? 'MODEL SEÇİM GEREKÇESİ' : 'MODEL SELECTION RATIONALE'}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">{isTr ? 'Neden MobileNetV2?' : 'Why MobileNetV2?'}</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      {isTr ? 'Minimum hesaplama yüküyle maksimum performans.' : 'Maximized performance with minimal computational footprints.'}
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Layers size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Orman yangını görüntüleri: düşük görsel derinlik' : 'Wildfire imagery: low visual depth'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Cpu size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Ağır modeller (ResNet) gereksiz' : 'Heavy models (ResNet) overkill'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Zap size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'MobileNetV2: 2.2M parametre (20× daha küçük)' : 'MobileNetV2: 2.2M params (20× smaller)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Activity size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          {isTr ? 'Ters çevrilmiş artıklar + derinlik evrişimleri' : 'Inverted residuals + depth convolutions'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Emphasis Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-white to-amber-500/5 border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <div className="text-[9px] font-black text-emerald-700 tracking-[0.2em] uppercase">
                      {isTr ? 'TEMEL TEZ HİPOTEZİ' : 'KEY THESIS HYPOTHESIS'}
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {isTr ? '"Hafif mimari + Uzamsal Bağlam ≥ Tek başına ağır mimari"' : '"Lightweight architecture + Spatial Context ≥ Heavy architecture alone"'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200">
                  <Terminal size={14} className="text-slate-500" />
                  {isTr ? 'Sistem Tezi Onaylandı' : 'System Thesis Approved'}
                </div>
              </div>
            </div>

            {/* SECTION 2 — DATA & PATTERNS */}
            <div id="section-2" className="scroll-mt-28">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 2' : 'SECTION 2'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'Veri Seti ve Uzamsal Kalıplar' : 'Dataset & Spatial Patterns'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {isTr ? 'Pozitif/negatif orman yangını görüntülerinin dağılımı, örnek uydu görüntüleri ve CNN eğitim dinamikleri.' : 'Distribution of positive/negative wildfire imagery, sample satellite views, and CNN training dynamics.'}
                </p>
              </div>

              {/* Row 1: Left: Distribution Card | Right: 2x2 Photos Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">

                {/* Left Card: Data Distribution */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-5">
                      <Layers size={12} />
                      {isTr ? 'VERİ DAĞILIMI' : 'DATA DISTRIBUTION'}
                    </div>

                    {/* Donut Chart */}
                    <div className="relative w-full h-[150px] flex items-center justify-center mb-5">
                      <PieChart width={180} height={150}>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          stroke="none"
                          onMouseEnter={(_, index) => setActivePieIndex(index)}
                          onMouseLeave={() => setActivePieIndex(null)}
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>

                      {/* absolute center hover overlay */}
                      <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-[8px] uppercase font-black tracking-widest text-slate-400">
                          {activePieIndex === 0 ? (isTr ? 'Orman Yangını' : 'Wildfire') : activePieIndex === 1 ? (isTr ? 'Yangın Yok' : 'No Fire') : (isTr ? 'Toplam Görüntü' : 'Total Images')}
                        </span>
                        <span className="text-xl font-black text-slate-900 leading-none mt-1">
                          {activePieIndex === 0 ? '22,710' : activePieIndex === 1 ? '20,140' : '42,850'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 mt-1">
                          {activePieIndex === 0 ? '53.0%' : activePieIndex === 1 ? '47.0%' : '100%'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                            {isTr ? 'Orman Yangını (Pozitif)' : 'Wildfire (Positive)'}
                          </span>
                          <span>53.0% (22,710)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: '53%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                            {isTr ? 'Orman Yangını Yok (Negatif)' : 'No Wildfire (Negative)'}
                          </span>
                          <span>47.0% (20,140)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '47%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: 2x2 Satellite Photos Matrix */}
                <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase">
                        <Sparkles size={12} className="text-emerald-500" />
                        {isTr ? 'UYDU ÖRNEKLERİ' : 'SATELLITE SAMPLES'}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        {isTr ? '350×350px (~644×644m)' : '350×350px (~644×644m)'}
                      </span>
                    </div>

                    {/* Responsive photo grid: 1 col on mobile, 2 cols on sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      {/* wildfire_1 */}
                      <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo (crisp, small, natural size) */}
                        <div className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-4">
                          <img
                            src={wildfire1}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="Wildfire 1"
                          />
                        </div>

                        {/* Bottom: The Clear Labels Under the Photo */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                            {isTr ? 'ORMAN YANGINI' : 'WILDFIRE'}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{isTr ? 'Örnek 01' : 'Sample 01'}</span>
                        </div>
                      </div>

                      {/* wildfire_2 */}
                      <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-4">
                          <img
                            src={wildfire2}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="Wildfire 2"
                          />
                        </div>

                        {/* Bottom: The Clear Labels */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                            {isTr ? 'ORMAN YANGINI' : 'WILDFIRE'}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{isTr ? 'Örnek 02' : 'Sample 02'}</span>
                        </div>
                      </div>

                      {/* nowildfire_1 */}
                      <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-4">
                          <img
                            src={nowildfire1}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="No Wildfire 1"
                          />
                        </div>

                        {/* Bottom: The Clear Labels */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            {isTr ? 'YANGIN YOK' : 'NO WILDFIRE'}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{isTr ? 'Örnek 03' : 'Sample 03'}</span>
                        </div>
                      </div>

                      {/* nowildfire_2 */}
                      <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-4">
                          <img
                            src={nowildfire2}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="No Wildfire 2"
                          />
                        </div>

                        {/* Bottom: The Clear Labels */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            {isTr ? 'YANGIN YOK' : 'NO WILDFIRE'}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{isTr ? 'Örnek 04' : 'Sample 04'}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>



              {/* Row 3: Dataset parameters placed at the very bottom */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <Terminal size={12} />
                  {isTr ? 'VERİ SETİ METADATA PARAMETRELERİ' : 'DATASET METADATA PARAMETERS'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <MapPin size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">{isTr ? 'Coğrafi Aralık' : 'Geographic Range'}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{isTr ? 'Kanada yüksek yoğunluklu ormanlık bölgeler' : 'Canada high-density forestry regions'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Layers size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">{isTr ? 'Uydu Özellikleri' : 'Satellite Specs'}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{isTr ? 'Yakınlaştırma svy 15 · 350px · ~644m kapsama' : 'Zoom lvl 15 · 350px · ~644m coverage'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Database size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">{isTr ? 'Edinme Boru Hattı' : 'Acquisition Pipeline'}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">Kaggle Repository · MapBox API</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <GitBranch size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">{isTr ? 'Doğrulama Ayrımı' : 'Validation Split'}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{isTr ? '%70 Eğitim / %15 Doğrulama / %15 Test' : '70% Training / 15% Val / 15% Test'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Maximize size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">{isTr ? 'Model Boyutlandırma' : 'Model Sizing'}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{isTr ? 'MobileNetV2 için 224×224px boyutlandırıldı' : 'Resized to 224×224px for MobileNetV2'}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>


            {/* SECTION 3 — SYSTEM DESIGN & DATA FLOW */}
            <div id="section-3" className="scroll-mt-28 bg-white border border-slate-200/85 p-8 rounded-[2rem] shadow-sm relative group mb-8">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 3' : 'SECTION 3'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'Sistem Tasarımı ve Veri Akışı' : 'System Design & Data Flow'}
                </h2>
                <p className="text-slate-650 text-sm mt-1 leading-relaxed">
                  {isTr ? 'Tam üç katmanlı mikro hizmet mimarisi, yatay veri telemetri yolları ve temel veritabanı şemaları.' : 'Full three-tier microservice architecture, horizontal data telemetry pathways, and core database schemas.'}
                </p>
              </div>

              {/* Sub-section A: Architecture Overview Diagram */}
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl mb-8 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-8 relative z-10">
                  <Terminal size={12} className="text-slate-500" />
                  {isTr ? 'ÜÇLÜ MİKRO HİZMET MİMARİSİ' : 'TRI-SERVICE MICROSERVICE ARCHITECTURE'}
                </div>

                <div className="flex flex-col gap-6 relative z-10">

                  {/* Vertical Connection Line */}
                  <div className="absolute left-8 md:left-1/2 top-12 bottom-12 w-px bg-slate-200 md:-translate-x-1/2 -z-10 hidden sm:block border-dashed" />

                  {/* Tier 1: Client Layer */}
                  <div className="w-full relative">
                    <div className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                        <Monitor size={32} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none block mb-1">{isTr ? 'Katman 01 · Ön Yüz Sunumu' : 'Tier 01 · Frontend Presentation'}</span>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight mb-3">REACT SPA (TypeScript + Vite)</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React Router v7', 'Context API', 'Google Maps API'].map((b, i) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-lg">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:w-1/3 w-full bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">{isTr ? 'Arayüz Yolları' : 'Interface Pathways'}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {[{ en: 'Landing', tr: 'Açılış' }, { en: 'Analyze', tr: 'Analiz' }, { en: 'Grad-CAM++', tr: 'Grad-CAM++' }, { en: 'History', tr: 'Geçmiş' }].map((c, i) => (
                            <span key={i} className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                              {isTr ? c.tr : c.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tier 2: Service & Data Layer */}
                  <div className="w-full relative">
                    <div className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6">

                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 pr-0 md:pr-6 md:border-r border-slate-100">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                          <Server size={32} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none block mb-1">{isTr ? 'Katman 02 · Hizmet Ağ Geçidi' : 'Tier 02 · Service Gateway'}</span>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight mb-3">NODE.JS + EXPRESS</h4>
                          <div className="flex flex-wrap gap-2">
                            {[{ en: 'REST API', tr: 'REST API' }, { en: 'auth.js', tr: 'auth.js' }, { en: 'Centralized Errors', tr: 'Merkezi Hatalar' }].map((b, i) => (
                              <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-lg">
                                {isTr ? b.tr : b.en}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
                          <Database size={32} />
                        </div>
                        <div className="w-full">
                          <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none block mb-1">{isTr ? 'Veri Katmanı' : 'Data Layer'}</span>
                          <h4 className="text-lg font-black text-slate-800 tracking-tight mb-3">MONGODB</h4>
                          <div className="space-y-2 w-full">
                            {[{ en: 'User Schema', tr: 'Kullanıcı Şeması' }, { en: 'Analysis Schema', tr: 'Analiz Şeması' }, { en: 'Log Schema', tr: 'Log Şeması' }].map((schema, i) => (
                              <div key={i} className="flex justify-between items-center text-[10px] font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                                <span className="font-bold text-slate-700">{isTr ? schema.tr : schema.en}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>



                  {/* Tier 3: AI Engine Layer */}
                  <div className="w-full relative">
                    <div className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                        <BrainCircuit size={32} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none block mb-1">{isTr ? 'Katman 03 · ML Çıkarım Çekirdeği' : 'Tier 03 · ML Inference Core'}</span>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight mb-3">PYTHON FLASK</h4>
                        <div className="flex flex-wrap gap-2">
                          {[{ en: 'MobileNetV2 (PyTorch)', tr: 'MobileNetV2 (PyTorch)' }, { en: 'Grad-CAM++', tr: 'Grad-CAM++' }, { en: 'Spatial Weighting', tr: 'Uzamsal Ağırlıklandırma' }].map((b, i) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-lg">
                              {isTr ? b.tr : b.en}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:w-1/3 w-full bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">{isTr ? 'Oluşturulan Veri Yükü' : 'Generated Payload'}</div>
                        <div className="flex flex-col gap-1.5">
                          {[{ en: 'Risk Score (Softmax)', tr: 'Risk Skoru (Softmax)' }, { en: 'Heatmap (Base64)', tr: 'Isı Haritası (Base64)' }, { en: '9-patch Grid Data', tr: '9-parça Izgara Verisi' }].map((c, i) => (
                            <div key={i} className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-md shadow-sm flex items-center justify-between">
                              {isTr ? c.tr : c.en}
                              <ChevronRight size={12} className="text-slate-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Sub-section B: Data Flow Timeline */}
              <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-3xl mb-8 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/50 text-[10px] font-black tracking-wider text-slate-700 uppercase mb-6">
                  <Activity size={12} className="text-slate-600" />
                  {isTr ? 'ANALİZ İSTEĞİ VERİ AKIŞI' : 'ANALYSIS REQUEST DATA FLOW'}
                </div>

                {/* Workflow Diagram */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 overflow-hidden flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <img
                    src={workflowImg}
                    className="w-full max-h-[500px] object-contain transition-all duration-350"
                    alt="Analysis Request Data Flow Workflow"
                  />
                </div>
              </div>

              {/* Sub-section C: Security Architecture */}
              <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-3xl relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/50 text-[10px] font-black tracking-wider text-slate-700 uppercase mb-6">
                  <ShieldCheck size={12} className="text-slate-600" />
                  {isTr ? 'GÜVENLİK VE KİMLİK DOĞRULAMA PROTOKOLLERİ' : 'SECURITY & AUTHENTICATION PROTOCOLS'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Card 1: JWT AUTHENTICATION */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl w-fit mb-4">
                      <Lock size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">{isTr ? 'JWT Kimlik Doğrulaması' : 'JWT Authentication'}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {isTr ? 'Durumsuz, kriptografik olarak imzalanmış 24 saatlik erişim belirteçleri. Çıkarım yollarında sıfır veritabanı oturum sorgusu gerektirir, böylece hızlı, ayrıştırılmış sistem ağ geçitleri sağlar.' : 'Stateless, cryptographically signed 24-hour access tokens. Zero database session queries required on inference paths, ensuring rapid, decoupled system gateways.'}
                    </p>
                  </div>

                  {/* Card 2: GOOGLE OAUTH 2.0 */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl w-fit mb-4">
                      <Chrome size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">{isTr ? 'Google OAuth 2.0' : 'Google OAuth 2.0'}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {isTr ? 'Güvenli sunucu tarafı belirteç doğrulamasıyla güvenli, üçüncü taraf sunucu kimlik doğrulaması. Otomatik hesap sözlük saldırılarına karşı dahili şemaları korur.' : 'Secure, third-party presenter authentication with secure server-side token validation. Protects internal schemas against automated account dictionary attacks.'}
                    </p>
                  </div>

                  {/* Card 3: ROLE-BASED ACCESS */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl w-fit mb-4">
                      <Shield size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">{isTr ? 'Rol Tabanlı Erişim Kontrolü (RBAC)' : 'Role-Based Access (RBAC)'}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {isTr ? <>Ayrıntılı ağ geçidi yetkilendirme yolları (<code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">user</code> vs <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">admin</code>). Sıkı beyaz liste CORS başlıkları, API erişimini kesinlikle beyaz listeye alınmış sunum kaynaklarıyla sınırlar.</> : <>Granular gateway authorization routes (<code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">user</code> vs <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">admin</code>). Strict whitelist CORS headers restrict API access strictly to whitelisted presenter origins.</>}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* SECTION 4 — MODEL ARCHITECTURE */}
            <div id="section-4" className="scroll-mt-28">

              <style>{`
                @keyframes scanline {
                  0% { transform: translateY(-100%); }
                  100% { transform: translateY(100%); }
                }
                @keyframes flowParticles {
                  to {
                    stroke-dashoffset: -20;
                  }
                }
                .animate-scanline {
                  animation: scanline 2s linear infinite;
                }
                .animate-flow-particles {
                  stroke-dasharray: 6, 4;
                  animation: flowParticles 1s linear infinite;
                }
              `}</style>

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 4' : 'SECTION 4'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'Model Boru Hattı ve Mimarisi' : 'Model Pipeline & Architecture'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {isTr ? 'Ham RGB piksellerinden son Softmax orman yangını tahminlerine kadar MobileNetV2\'nin uçtan uca çıkarım akışı.' : 'End-to-end inference flow of MobileNetV2, from raw RGB pixels down to final Softmax wildfire predictions.'}
                </p>
              </div>

              {/* Sub-section A: Architecture Diagram */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <Layers size={12} />
                  {isTr ? 'MOBILENETV2 TAM MİMARİ DİYAGRAMI' : 'MOBILENETV2 FULL ARCHITECTURE DIAGRAM'}
                </div>
                <div className="bg-slate-950 w-fit mx-auto rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={mobilenetv2Arch}
                    className="max-w-full h-auto object-contain filter brightness-95 hover:brightness-100 transition-all duration-300"
                    alt="MobileNetV2 Architecture Diagram"
                  />
                </div>
              </div>

              {/* Sub-section B: Pipeline Visualization Comparison */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">

                {/* Header */}
                <div className="mb-6">
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    {isTr ? 'ALT BÖLÜM B' : 'SUB-SECTION B'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2.5">
                    {isTr ? 'Boru Hattı Karşılaştırması: Orman Yangını vs. Güvenli Orman' : 'Pipeline Comparison: Wildfire vs. Safe Forest'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {isTr ? 'Aktif orman yangını ve güvenli iğne yapraklı orman uydu karoları için derin öğrenme boru hattı çıktılarının görsel karşılaştırmalı analizi.' : 'Visual comparative analysis of the deep learning pipeline outputs for active wildfire and safe coniferous forest satellite tiles.'}
                  </p>
                </div>

                {/* 1. Wildfire Pipeline Output */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[9px] font-black tracking-wider text-slate-650 uppercase mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {isTr ? 'AKTİF ORMAN YANGINI ÖRNEK BORU HATTI ÇIKTISI (SINIF 1)' : 'ACTIVE WILDFIRE SAMPLE PIPELINE OUTPUT (CLASS 1)'}
                  </div>
                  <div className="bg-slate-950 w-fit mx-auto rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={wildfireImg}
                      className="max-w-full h-auto object-contain filter brightness-95 hover:brightness-100 transition-all duration-350"
                      alt="Active Wildfire Pipeline Visualization"
                    />
                  </div>
                </div>

                {/* 2. Safe Forest Pipeline Output */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[9px] font-black tracking-wider text-slate-650 uppercase mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {isTr ? 'GÜVENLİ ORMAN ÖRNEK BORU HATTI ÇIKTISI (SINIF 0)' : 'SAFE FOREST SAMPLE PIPELINE OUTPUT (CLASS 0)'}
                  </div>
                  <div className="bg-slate-950 w-fit mx-auto rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={nowildfireImg}
                      className="max-w-full h-auto object-contain filter brightness-95 hover:brightness-100 transition-all duration-350"
                      alt="Safe Forest Pipeline Visualization"
                    />
                  </div>
                </div>

              </div>

              {/* Row 2: Charts placed under Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                {/* Chart A — Training Loss */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                    <Activity size={12} />
                    {isTr ? 'KAYIP DİNAMİKLERİ (EPOK 1-10)' : 'LOSS DYNAMICS (EPOCH 1-10)'}
                  </div>

                  <div className="h-[220px] w-full text-xs flex items-center justify-center">
                    <LineChart width={440} height={275} data={lossData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="epoch" stroke="#94a3b8" />
                      <YAxis domain={[0, 0.1]} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="linear" dataKey="trainLoss" name={isTr ? 'Eğitim Kaybı' : 'Training Loss'} stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="linear" dataKey="valLoss" name={isTr ? 'Doğrulama Kaybı' : 'Validation Loss'} stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </div>
                </div>

                {/* Chart B — Training Accuracy */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                    <Activity size={12} />
                    {isTr ? 'DOĞRULUK DİNAMİKLERİ (EPOK 1-10)' : 'ACCURACY DYNAMICS (EPOCH 1-10)'}
                  </div>

                  <div className="h-[220px] w-full text-xs flex items-center justify-center">
                    <LineChart width={440} height={275} data={accuracyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="epoch" stroke="#94a3b8" />
                      <YAxis domain={[95, 100]} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="linear" dataKey="trainAcc" name={isTr ? 'Eğitim Doğruluğu' : 'Training Accuracy'} stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="linear" dataKey="valAcc" name={isTr ? 'Doğrulama Doğruluğu' : 'Validation Accuracy'} stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </div>
                </div>

              </div>

              {/* Sub-section D: Spatial Weighting Visualizer */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-2">
                      <MapPin size={12} />
                      {isTr ? 'UZAMSAL AĞIRLIKLANDIRMA ALGORİTMASI' : 'SPATIAL WEIGHTING ALGORITHM'}
                    </div>
                    <p className="text-sm text-slate-500">{isTr ? 'Gürültü azaltma için etkileşimli 3×3 bağlam ızgarası.' : 'Interactive 3×3 context grid for noise reduction.'}</p>
                  </div>

                  <button
                    onClick={() => setShowEdgeCase(!showEdgeCase)}
                    className={`mt-4 sm:mt-0 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${showEdgeCase
                      ? 'bg-sky-50 text-sky-600 border-sky-200 shadow-sm shadow-sky-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                  >
                    <Eye size={14} className={showEdgeCase ? 'text-sky-500' : 'text-slate-400'} />
                    {showEdgeCase ? (isTr ? 'Uç Durumu Kapat' : 'Disable Edge Case') : (isTr ? 'Uç Durumu Göster: Sudaki Ada' : 'Show Edge Case: Island in Water')}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center justify-center">

                  {/* The Grid */}
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 bg-slate-800 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-md z-20">
                      Σ = 1.00
                    </div>
                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">

                      {/* Top Row */}
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-300' : 'border-slate-300 bg-white'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <div className="text-[10px] font-bold text-slate-500">{isTr ? 'Köşe' : 'Corner'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.05</div>
                        </div>
                      </div>
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-400' : 'border-emerald-300 bg-emerald-50/30'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-600">{isTr ? 'Ana Yön' : 'Cardinal'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.10</div>
                        </div>
                      </div>
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-300' : 'border-slate-300 bg-white'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <div className="text-[10px] font-bold text-slate-500">{isTr ? 'Köşe' : 'Corner'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.05</div>
                        </div>
                      </div>

                      {/* Middle Row */}
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-400' : 'border-emerald-300 bg-emerald-50/30'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-600">{isTr ? 'Ana Yön' : 'Cardinal'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.10</div>
                        </div>
                      </div>
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 -m-2 rounded-xl border-4 flex flex-col items-center justify-center z-10 transition-colors duration-500 relative overflow-hidden shadow-lg ${showEdgeCase ? 'border-orange-500' : 'border-orange-400 bg-orange-50'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#16a34a] opacity-90 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg border border-orange-200">
                          <div className="text-[9px] font-black text-orange-600 uppercase">{isTr ? 'HEDEF PARÇA' : 'TARGET PATCH'}</div>
                          <div className="text-base font-black text-slate-900">w=0.40</div>
                        </div>
                      </div>
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-400' : 'border-emerald-300 bg-emerald-50/30'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-600">{isTr ? 'Ana Yön' : 'Cardinal'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.10</div>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-300' : 'border-slate-300 bg-white'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <div className="text-[10px] font-bold text-slate-500">{isTr ? 'Köşe' : 'Corner'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.05</div>
                        </div>
                      </div>
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-400' : 'border-emerald-300 bg-emerald-50/30'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-600">{isTr ? 'Ana Yön' : 'Cardinal'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.10</div>
                        </div>
                      </div>
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${showEdgeCase ? 'border-sky-300' : 'border-slate-300 bg-white'}`}>
                        {showEdgeCase && <div className="absolute inset-0 bg-[#0ea5e9] opacity-80 z-0"></div>}
                        <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <div className="text-[10px] font-bold text-slate-500">{isTr ? 'Köşe' : 'Corner'}</div>
                          <div className="text-sm font-black text-slate-800">w=0.05</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Context Info */}
                  <div className="flex-1 max-w-sm">
                    {showEdgeCase ? (
                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 transition-all duration-500">
                        <h4 className="text-sm font-black text-sky-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                          <TriangleAlert size={16} className="text-sky-600" />
                          {isTr ? 'Uç Durum Aktif' : 'Edge Case Active'}
                        </h4>

                        <div className="space-y-4 mb-6">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isTr ? 'İzole Parça Skoru' : 'Isolated Patch Score'}</div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-black">
                              0.98 {isTr ? 'ORMAN YANGINI' : 'WILDFIRE'} <span className="opacity-70 font-bold">{isTr ? '(Yanlış Pozitif)' : '(False Positive)'}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{isTr ? 'Uzamsal Ağırlıklandırmadan Sonra' : 'After Spatial Weighting'}</div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-black">
                              0.45 {isTr ? 'ORMAN YANGINI' : 'WILDFIRE'} <span className="opacity-70 font-bold">{isTr ? '(Güvenli Eşik)' : '(Safe Threshold)'}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-sky-700 font-medium leading-relaxed bg-white/60 p-3 rounded-xl border border-sky-200/50">
                          {isTr ? '"Çevredeki su parçaları 0.10×4 + 0.05×4 = 0.60 Risksiz sinyal ağırlığına katkıda bulunarak yanlış pozitifi etkili bir şekilde bastırır."' : '"Surrounding water patches contribute 0.10×4 + 0.05×4 = 0.60 weight of No-Risk signal, effectively muting the false positive."'}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 transition-all duration-500">
                        <h4 className="text-sm font-black text-emerald-900 mb-2 uppercase tracking-wider">
                          {isTr ? 'Bağlam Güçlendirme' : 'Context Amplification'}
                        </h4>
                        <p className="text-xs text-emerald-700 mb-6 leading-relaxed font-medium">
                          {isTr ? 'Orman yangınları uzamsal olaylardır. 3×3 bir ızgaranın ağırlıklı ortalamasını alarak, büyük bitişik ısı izlerini güçlendirirken yanlış pozitifleri (izole kamp ateşleri veya yüksek oranda yansıtıcı çatılar gibi) büyük ölçüde azaltıyoruz.' : 'Wildfires are spatial events. By taking a weighted average of a 3×3 grid, we drastically reduce false positives (like isolated campfires or highly reflective rooftops) while amplifying massive contiguous heat signatures.'}
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-emerald-200 shadow-sm w-full">
                          <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
                            <Maximize size={14} />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isTr ? 'Kapsama Genişletme' : 'Coverage Expansion'}</div>
                            <div className="text-[10px] font-black text-slate-800">{isTr ? 'Tek parça: ~644m → 3×3 ızgara: ~1.9km kapsama' : 'Single patch: ~644m → 3×3 grid: ~1.9km coverage'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-section C: Architecture Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{isTr ? 'Mimari' : 'Architecture'}</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">MobileNetV2</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{isTr ? 'Girdi Boyutları' : 'Input Dimensions'}</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">224 × 224 × 3</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{isTr ? 'Toplam Parametreler' : 'Total Parameters'}</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">2.2 {isTr ? 'Milyon' : 'Million'}</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{isTr ? 'Çerçeve' : 'Framework'}</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">PyTorch 2.0</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm col-span-2 md:col-span-1">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{isTr ? 'İkili Model Boyutu' : 'Binary Model Size'}</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">~8.7 {isTr ? 'Megabayt' : 'Megabytes'}</div>
                </div>
              </div>

            </div>
            {/* SECTION 5 — RESULTS */}
            <div id="section-5" className="scroll-mt-28">

              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 5' : 'SECTION 5'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'Sonuçlar' : 'Results'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {isTr ? 'Tüm performans rakamlarını, karmaşa matrisi verilerini ve uzamsal ağırlıklandırma mekanizmasını görsel olarak gösterin.' : 'Show all performance numbers, confusion matrix data, and the spatial weighting mechanism visually.'}
                </p>
              </div>

              {/* Sub-section A: Performance Metrics Bar Chart */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <Activity size={12} />
                  {isTr ? 'TEST SETİ PERFORMANSI — TÜM 3 MODEL' : 'TEST SET PERFORMANCE — ALL 3 MODELS'}
                </div>

                <div className="w-full mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ModelPerformanceChart
                      title={isTr ? "Test Seti Performans Metrikleri" : "Test Set Performance Metrics"}
                      subTitle="(PyroVision)"
                      data={pyroVisionData}
                    />
                    <ModelPerformanceChart
                      title={isTr ? "Test Seti Performans Metrikleri" : "Test Set Performance Metrics"}
                      subTitle="(Modified ResNet101)"
                      data={resNetData}
                    />
                    <ModelPerformanceChart
                      title={isTr ? "Test Seti Performans Metrikleri" : "Test Set Performance Metrics"}
                      subTitle={isTr ? "(MobileNetV2 (bizim))" : "(MobileNetV2 (ours))"}
                      data={mobileNetData}
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section B: Confusion Matrices */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <MonitorPlay size={12} />
                  {isTr ? 'KARMAŞA MATRİSLERİ (TEST SETİ: 6.428 ÖRNEK)' : 'CONFUSION MATRICES (TEST SET: 6,428 SAMPLES)'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PyroVision Matrix */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col">
                    <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 text-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PyroVision</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-bold text-center">
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yangın' : 'Pred: Wildfire'}</div>
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yok' : 'Pred: No Fire'}</div>
                        {/* Row 1: True Wildfire */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TP</span>
                          <span className="text-sm font-black">3,304</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FN</span>
                          <span className="text-sm font-black">103</span>
                        </div>
                        {/* Row 2: True No Fire */}
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FP</span>
                          <span className="text-sm font-black">88</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TN</span>
                          <span className="text-sm font-black">2,933</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FN: 103</span>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FP: 88</span>
                      </div>
                    </div>
                  </div>

                  {/* ResNet101 Matrix */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col">
                    <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 text-center">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Modified ResNet101</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-bold text-center">
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yangın' : 'Pred: Wildfire'}</div>
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yok' : 'Pred: No Fire'}</div>
                        {/* Row 1: True Wildfire */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TP</span>
                          <span className="text-sm font-black">3,383</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FN</span>
                          <span className="text-sm font-black">24</span>
                        </div>
                        {/* Row 2: True No Fire */}
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FP</span>
                          <span className="text-sm font-black">1</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TN</span>
                          <span className="text-sm font-black">3,020</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FN: 24</span>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FP: 1</span>
                      </div>
                    </div>
                  </div>

                  {/* MobileNetV2 Matrix */}
                  <div className="border-2 border-emerald-400 rounded-2xl overflow-hidden bg-white flex flex-col relative shadow-lg shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                      Selected
                    </div>
                    <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-100 text-center">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">MobileNetV2</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-bold text-center">
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yangın' : 'Pred: Wildfire'}</div>
                        <div className="text-slate-400">{isTr ? 'Tahmin: Yok' : 'Pred: No Fire'}</div>
                        {/* Row 1: True Wildfire */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TP</span>
                          <span className="text-sm font-black">3,378</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FN</span>
                          <span className="text-sm font-black">29</span>
                        </div>
                        {/* Row 2: True No Fire */}
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">FP</span>
                          <span className="text-sm font-black">3</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-lg flex flex-col justify-center">
                          <span className="text-[9px] uppercase opacity-70">TN</span>
                          <span className="text-sm font-black">3,018</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FN: 29</span>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase">FP: 3</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full text-rose-600 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <ShieldAlert size={14} />
                    {isTr ? '"Her yanlış negatif = kaçırılan orman yangını = kritik hata"' : '"Every false negative = missed wildfire = critical failure"'}
                  </div>
                </div>
              </div>

              {/* Sub-section C: Parameter Efficiency Comparison */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-50/50 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-8">
                    <Cpu size={12} className="text-emerald-500" />
                    {isTr ? 'PARAMETRE VERİMLİLİĞİ KARŞILAŞTIRMASI' : 'PARAMETER EFFICIENCY COMPARISON'}
                  </div>

                  <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* ResNet Box */}
                    <div className="flex-1 w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center shadow-sm">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Modified ResNet101</div>
                      <div className="text-3xl font-black text-slate-800">44.5M</div>
                      <div className="text-xs text-indigo-700/70 font-bold mt-1">{isTr ? 'Parametreler' : 'Parameters'}</div>
                    </div>

                    {/* Middle Badge */}
                    <div className="flex flex-col items-center justify-center -mx-4 z-20 my-4 md:my-0">
                      <div className="bg-emerald-500 text-white border-4 border-white rounded-full px-6 py-3 text-[11px] font-black uppercase tracking-widest shadow-md flex flex-col items-center whitespace-nowrap">
                        <span>{isTr ? '20× DAHA AZ PARAMETRE' : '20× FEWER PARAMS'}</span>
                        <span className="text-[9px] text-emerald-100 font-bold mt-0.5">{isTr ? '~%0.11 DOĞRULUK FARKI' : '~0.11% ACCURACY DIFFERENCE'}</span>
                      </div>
                    </div>

                    {/* MobileNet Box */}
                    <div className="flex-1 w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center md:max-w-[280px] shadow-sm">
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">MobileNetV2</div>
                      <div className="text-3xl font-black text-slate-800">2.2M</div>
                      <div className="text-xs text-emerald-700/70 font-bold mt-1">{isTr ? 'Parametreler' : 'Parameters'}</div>
                    </div>
                  </div>

                  <div className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-200 pt-4 text-center max-w-2xl">
                    {isTr ? '"Derinlikten azalan getiriler doğrulandı — görevin görsel karmaşıklığı ağır kapasite gerektirmiyor"' : '"Diminishing returns from depth confirmed — task visual complexity does not require heavy capacity"'}
                  </div>
                </div>
              </div>


            </div>

            {/* SECTION 6 — GRAD-CAM++ EXPLAINABILITY (XAI) */}
            <div id="section-6" className="scroll-mt-28">

              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {isTr ? 'BÖLÜM 6' : 'SECTION 6'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  {isTr ? 'GRAD-CAM++ — AÇIKLANABİLİRLİK KATMANI (XAI)' : 'GRAD-CAM++ — EXPLAINABILITY LAYER (XAI)'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {isTr ? 'Grad-CAM++\'ın nasıl çalıştığına dair animasyonlu/kavramsal açıklama.' : 'Animated/conceptual explanation of how Grad-CAM++ works.'}
                </p>
              </div>

              {/* Sub-section A: How It Works — Animated Conceptual Diagram */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase">
                    <Activity size={12} />
                    {isTr ? 'NASIL ÇALIŞIR — KAVRAMSAL AKIŞ' : 'HOW IT WORKS — CONCEPTUAL FLOW'}
                  </div>
                  <button
                    onClick={playXaiAnimation}
                    disabled={isPlayingXai}
                    className={`mt-4 sm:mt-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${isPlayingXai
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 shadow-sm'
                      }`}
                  >
                    <Play size={14} className={isPlayingXai ? 'text-slate-400' : 'text-emerald-500'} />
                    {isPlayingXai ? (isTr ? 'Animasyon Oynatılıyor...' : 'Animating...') : (isTr ? 'Animasyonu Oynat' : 'Play Animation')}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                  {/* Step 1 */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center ${xaiStep >= 1 ? 'border-emerald-300 bg-emerald-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                    <div className={`p-3 rounded-full mb-4 ${xaiStep >= 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                      <ArrowRight size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isTr ? 'Adım 1' : 'Step 1'}</div>
                    <h4 className={`text-sm font-black uppercase tracking-wider mb-4 ${xaiStep >= 1 ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {isTr ? 'İLERİ BESLEME' : 'FORWARD PASS'}
                    </h4>

                    {/* Visual 1 */}
                    <div className="flex items-center justify-center gap-2 mb-4 h-24 w-full">
                      <div className={`w-12 h-12 border-2 ${xaiStep >= 1 ? 'border-emerald-400 bg-white' : 'border-slate-300 bg-slate-100'} rounded-md shadow-sm`} />
                      <ArrowRight size={14} className={xaiStep >= 1 ? 'text-emerald-300' : 'text-slate-300'} />
                      <div className={`w-8 h-8 border-2 ${xaiStep >= 1 ? 'border-emerald-500 bg-white' : 'border-slate-300 bg-slate-100'} rounded-sm shadow-sm`} />
                      <ArrowRight size={14} className={xaiStep >= 1 ? 'text-emerald-300' : 'text-slate-300'} />
                      <div className={`w-4 h-4 border-2 ${xaiStep >= 1 ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-slate-100'} rounded-[2px] shadow-sm`} />
                    </div>

                    <div className={`text-[9px] font-bold px-2 py-1 rounded-md ${xaiStep >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                      {isTr ? 'Girdi → özellikler[18] → Softmax' : 'Input → features[18] → Softmax'}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center ${xaiStep >= 2 ? 'border-indigo-300 bg-indigo-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                    <div className={`p-3 rounded-full mb-4 ${xaiStep >= 2 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Target size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isTr ? 'Adım 2' : 'Step 2'}</div>
                    <h4 className={`text-sm font-black uppercase tracking-wider mb-4 ${xaiStep >= 2 ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {isTr ? 'HEDEF: özellikler[18]' : 'TARGET: features[18]'}
                    </h4>

                    {/* Visual 2 */}
                    <div className="flex items-center justify-center mb-4 h-24 w-full relative">
                      <div className={`w-16 h-16 border-4 ${xaiStep >= 2 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-100'} rounded-lg shadow-md flex items-center justify-center relative overflow-hidden`}>
                        {xaiStep >= 2 && <div className="absolute inset-0 bg-indigo-400/20 animate-pulse" />}
                        <Target size={24} className={xaiStep >= 2 ? 'text-indigo-500' : 'text-slate-400'} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <div className={`text-[9px] font-bold px-2 py-1 rounded-md ${xaiStep >= 2 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                        {isTr ? 'Global Ort. Havuzlamadan önceki son konv blok' : 'Last conv block before Global Avg Pool'}
                      </div>
                      <div className={`text-[8.5px] font-bold px-2 py-1 rounded-md ${xaiStep >= 2 ? 'bg-indigo-50 text-indigo-600/80 border border-indigo-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {isTr ? 'En zengin anlamsal özellikler + uzamsal detay korundu' : 'Richest semantic features + spatial detail retained'}
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center ${xaiStep >= 3 ? 'border-amber-300 bg-amber-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                    <div className={`p-3 rounded-full mb-4 ${xaiStep >= 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                      <TrendingUp size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isTr ? 'Adım 3' : 'Step 3'}</div>
                    <h4 className={`text-sm font-black uppercase tracking-wider mb-4 ${xaiStep >= 3 ? 'text-amber-900' : 'text-slate-700'}`}>
                      {isTr ? 'POZİTİF KISMİ TÜREVLER' : 'POSITIVE PARTIAL DERIVATIVES'}
                    </h4>

                    {/* Visual 3 */}
                    <div className="flex items-center justify-center mb-4 h-24 w-full">
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                          <div key={i} className={`w-5 h-5 flex items-center justify-center rounded-sm ${xaiStep >= 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'} ${xaiStep >= 3 && i % 2 === 0 ? 'opacity-30' : ''}`}>
                            {(xaiStep >= 3 && i % 2 !== 0) ? <TrendingUp size={12} /> : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <div className={`text-[9px] font-bold px-2 py-1 rounded-md ${xaiStep >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                        {isTr ? 'Grad-CAM++ SADECE POZİTİF gradyanları kullanır' : 'Grad-CAM++ uses POSITIVE gradients only'}
                      </div>
                      <div className={`text-[8.5px] font-bold px-2 py-1 rounded-md ${xaiStep >= 3 ? 'bg-amber-50 text-amber-600/80 border border-amber-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {isTr ? 'Standart Grad-CAM\'e göre daha iyi çoklu örnek konumlandırma' : 'Better multi-instance localization vs standard Grad-CAM'}
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center ${xaiStep >= 4 ? 'border-rose-300 bg-rose-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                    <div className={`p-3 rounded-full mb-4 ${xaiStep >= 4 ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Eye size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isTr ? 'Adım 4' : 'Step 4'}</div>
                    <h4 className={`text-sm font-black uppercase tracking-wider mb-4 ${xaiStep >= 4 ? 'text-rose-900' : 'text-slate-700'}`}>
                      {isTr ? 'AĞIRLIKLI AKTİVASYON HARİTASI' : 'WEIGHTED ACTIVATION MAP'}
                    </h4>

                    {/* Visual 4 */}
                    <div className="flex items-center justify-center mb-4 h-24 w-full">
                      <div className={`w-24 h-16 rounded-lg shadow-inner relative overflow-hidden ${xaiStep >= 4 ? 'opacity-100' : 'bg-slate-200 opacity-50'}`}>
                        {xaiStep >= 4 && (
                          <img src={gradcamCanadaImg} className="w-full h-full object-cover" alt="Real Grad-CAM++ Canada Forest" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <div className={`text-[9px] font-bold px-2 py-1 rounded-md ${xaiStep >= 4 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-500'}`}>
                        {isTr ? 'Sıcak = kararda yüksek etki' : 'Warm = high influence on decision'}
                      </div>
                      <div className={`text-[8.5px] font-bold px-2 py-1 rounded-md ${xaiStep >= 4 ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'}`}>
                        {isTr ? 'Soğuk = düşük etki' : 'Cool = low influence'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section B: What the Model Learns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Column */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                      <Flame size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        {isTr ? 'DOĞRU POZİTİF AKTİVASYONU' : 'TRUE POSITIVE ACTIVATION'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{isTr ? 'Orman Yangını Risk İzleri' : 'Wildfire Risk Signatures'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <Trees size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Kuru, seyrek bitki örtüsü bölgeleri' : 'Dry, sparse vegetation zones'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <Sun size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Açık arazi örtüsü — maruz kalan arazi' : 'Open land cover — exposed terrain'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <ArrowUpRight size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Ormandan açık alana geçiş bölgeleri' : 'Forest-to-open-ground transition zones'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <TriangleAlert size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Aktivasyon, yangına eğilimli peyzaj özelliklerinde yoğunlaştı' : 'Activation concentrated on fire-prone landscape features'}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        {isTr ? 'DOĞRU NEGATİF AKTİVASYONU' : 'TRUE NEGATIVE ACTIVATION'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{isTr ? 'Risk Yok / Güvenli İzler' : 'No Risk / Safe Signatures'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <Waves size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Su kütlesi hakimiyeti → bastırılmış aktivasyon' : 'Water body dominance → suppressed activation'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <Building2 size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Kentsel altyapı → doğal yangın bariyeri' : 'Urban infrastructure → natural fire barrier'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <Activity size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Dağınık, düşük yoğunluklu, odak noktası yok' : 'Diffuse, low-intensity, no focal hotspot'}</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{isTr ? 'Çevresel yangın söndürme faktörleriyle hizalanmış' : 'Aligned with environmental fire-suppression factors'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section C: XAI Value Callout banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-emerald-500/50 flex items-center justify-center backdrop-blur-md z-10">
                    <Lock size={28} className="text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-indigo-500/50 flex items-center justify-center backdrop-blur-md z-20">
                    <BrainCircuit size={28} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 relative z-10 text-center md:text-left">
                  <p className="text-lg md:text-xl font-bold leading-relaxed mb-6 italic text-white/95">
                    {isTr ? '"Yüksek doğruluk tek başına ≠ güvenilir sistem. Grad-CAM++ kararların istatistiksel gürültüye değil çevresel mantığa dayandığını onaylar."' : '"High accuracy alone ≠ trustworthy system. Grad-CAM++ confirms decisions are grounded in environmental reasoning — not statistical noise."'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      {isTr ? 'KARA KUTU KARŞITI' : 'ANTI-BLACK-BOX'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      {isTr ? 'XAI UYUMLU' : 'XAI COMPLIANT'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      {isTr ? 'AFET YÖNETİMİNE HAZIR' : 'DISASTER MANAGEMENT READY'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        <footer className="py-16 mt-8 text-center text-slate-500 border-t border-slate-200">
          <div className="mb-4 font-black tracking-tighter text-xl text-emerald-500/40">FORESPARK</div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-medium text-slate-400">© 2026 Protecting our Green Future</p>
        </footer>

      </div>
    </div>
  );
}
