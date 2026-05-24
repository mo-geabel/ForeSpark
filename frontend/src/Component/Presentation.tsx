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
  Send,
  Eye,
  Lock,
  Chrome,
  Shield,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import wildfire1 from '../images/wildfire_1.png';
import wildfire2 from '../images/wildfire_2.png';
import nowildfire1 from '../images/nowildfire_1.png';
import nowildfire2 from '../images/nowildfire_2.png';
import wildfireImg from '../images/wildfire.png';
import nowildfireImg from '../images/nowildfire.png';
import mobilenetv2Arch from '../images/mobilenetv2_arch.png';
import workflowImg from '../images/workflow.png';

// Chart datasets
const donutData = [
  { name: 'Wildfire', value: 22710, color: '#f97316' }, // orange-500
  { name: 'No Wildfire', value: 20140, color: '#10b981' } // emerald-500
];

const lossData = [
  { epoch: 'E1', trainLoss: 0.54, valLoss: 0.52 },
  { epoch: 'E2', trainLoss: 0.38, valLoss: 0.35 },
  { epoch: 'E3', trainLoss: 0.27, valLoss: 0.24 },
  { epoch: 'E4', trainLoss: 0.19, valLoss: 0.18 },
  { epoch: 'E5', trainLoss: 0.14, valLoss: 0.15 },
  { epoch: 'E6', trainLoss: 0.10, valLoss: 0.12 },
  { epoch: 'E7', trainLoss: 0.08, valLoss: 0.09 },
  { epoch: 'E8', trainLoss: 0.06, valLoss: 0.08 },
  { epoch: 'E9', trainLoss: 0.05, valLoss: 0.07 },
  { epoch: 'E10', trainLoss: 0.04, valLoss: 0.06 }
];

const accuracyData = [
  { epoch: 'E1', trainAcc: 86.5, valAcc: 88.2 },
  { epoch: 'E2', trainAcc: 91.2, valAcc: 92.5 },
  { epoch: 'E3', trainAcc: 94.1, valAcc: 94.8 },
  { epoch: 'E4', trainAcc: 95.8, valAcc: 96.1 },
  { epoch: 'E5', trainAcc: 96.9, valAcc: 97.2 },
  { epoch: 'E6', trainAcc: 97.6, valAcc: 97.9 },
  { epoch: 'E7', trainAcc: 98.1, valAcc: 98.3 },
  { epoch: 'E8', trainAcc: 98.5, valAcc: 98.6 },
  { epoch: 'E9', trainAcc: 98.8, valAcc: 98.9 },
  { epoch: 'E10', trainAcc: 99.2, valAcc: 99.4 }
];

interface Section {
  id: string;
  num: number;
  title: string;
  subtitle: string;
}

export default function Presentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('section-1');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const [simulating, setSimulating] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [selectedSample, setSelectedSample] = useState<'wildfire' | 'nowildfire'>('wildfire');

  const startSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < 5) {
        setActiveStage(stage);
      } else {
        clearInterval(interval);
        setActiveStage(null);
        setSimulating(false);
      }
    }, 900); // 0.9s per stage as requested
  };

  const stageDetails = [
    {
      name: "Input RGB Image Tensor",
      shape: "224 × 224 × 3",
      math: "X ∈ ℝ^[Batch × 3 × 224 × 224]",
      params: ["Batch Size: 32", "Channels: 3 (RGB)", "Normalization: PyTorch ImageNet"],
      desc: "Raw satellite tile image resized and normalized to PyTorch default MobileNetV2 input specifications."
    },
    {
      name: "Stem Convolutional Stage",
      shape: "112 × 112 × 32",
      math: "Y = ReLU6( BatchNorm( Conv2D(X) ) )",
      params: ["Kernel: 3×3", "Stride: 2", "Activation: ReLU6", "Channels Out: 32"],
      desc: "Initial feature extraction layer. Filters input patterns via strided depthwise convolution for aggressive spatial reduction."
    },
    {
      name: "Inverted Residual & Bottleneck Core",
      shape: "7 × 7 × 1280",
      math: "X_block = X_in + Proj( DWConv( Exp(X_in) ) )",
      params: ["Blocks: 17", "Expansion: 6x", "DW Kernel: 3×3", "Shortcut: Residual Link"],
      desc: "Main architectural block. Employs low-dimensional bottlenecks and depthwise separable convolutions to isolate spatial relations efficiently."
    },
    {
      name: "Global Average Pooling (GAP)",
      shape: "1 × 1 × 1280",
      math: "v_c = (1 / (H × W)) × Σ x_{c,i,j}",
      params: ["Spatial Size: 7×7 → 1×1", "Vector Out: 1D (1280)", "Parameters: 0 (GAP)"],
      desc: "Collapses 2D spatial dimensions (7×7) into a 1D channel-wise descriptor vector, minimizing parameter count and translation bias."
    },
    {
      name: "Linear Classifier Head (Softmax)",
      shape: "2-Way Class Logits",
      math: "p_i = e^{z_i} / Σ e^{z_j}",
      params: ["Features In: 1280", "Classes: 2 (Wildfire/Safe)", "Activation: Softmax"],
      desc: "Fully connected projection layer converting deep features into final categorical class probabilities via the Softmax mathematical activation."
    }
  ];

  const currentInspectorStage = hoveredStage !== null ? hoveredStage : (activeStage !== null ? activeStage : 0);

  const sections: Section[] = [
    { id: 'section-1', num: 1, title: 'Literature Review', subtitle: 'Detection vs. Prediction & Model Selection' },
    { id: 'section-2', num: 2, title: 'Data & Spatial Patterns', subtitle: 'Satellite Datasets & Grid Formats' },
    { id: 'section-3', num: 3, title: 'Architecture Pipeline', subtitle: 'Deep Learning Layers & Training' },
    { id: 'section-4', num: 4, title: 'System Design & Flow', subtitle: '3-Service Microservices & Security' },
    { id: 'section-5', num: 5, title: 'Live Demo & Validation', subtitle: 'Model Inference & Metrics' },
    { id: 'section-6', num: 6, title: 'Future & Summary', subtitle: 'Roadmap, Scaling & Vision' }
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-24">

      {/* BACKGROUND GRAPHICS (Extremely subtle, matching site gradients) */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-700 active:scale-95 transition-all group border border-slate-200"
              title="Back to home"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <MonitorPlay size={18} className="text-emerald-600" />
                <span className="text-sm font-black tracking-widest text-slate-900 uppercase">FORESPARK</span>
                <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700">PRESENTATION KEYNOTE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Status:</span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Presenter Mode
            </div>
          </div>
        </div>
      </header>

      {/* TOP SUMMARY INTRO BANNER */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black tracking-wider text-emerald-700 uppercase mb-4">
              <BookOpen size={12} /> Project Thesis
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              ForeSpark Project <span className="text-emerald-600">Keynote</span>
            </h1>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Welcome to our live project presentation dashboard. Here, we outline the literature review, dataset metrics, model selection details, and advanced weighted architectures that drive our AI-based Forest Fire prediction.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <Terminal size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-500 font-mono">v1.0.0 Stable Build</span>
          </div>
        </div>
      </section>

      {/* CORE PRESENTATION GRID */}
      <section className="max-w-6xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* FLOATING LEFT SIDEBAR INDEX */}
          <aside className="lg:sticky lg:top-28 col-span-1 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm z-30">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Presentation Index</h3>

            <div className="space-y-1.5">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase transition-all duration-200 flex items-center justify-between group ${activeSection === sec.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                >
                  <span className="truncate pr-2">
                    {sec.num}. {sec.title}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-200 ${activeSection === sec.id ? 'translate-x-0 text-white' : 'translate-x-[-4px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
              <div className="text-[9px] uppercase tracking-wider font-black text-slate-400">Presentation Guide</div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Click any section above to smooth-scroll directly to it, or scroll the page to see the progress.
              </p>
            </div>
          </aside>

          {/* MAIN SCROLLABLE SECTIONS COLUMN */}
          <div className="col-span-1 lg:col-span-3 space-y-16">

            {/* SECTION 1 — LITERATURE REVIEW */}
            <div id="section-1" className="scroll-mt-28">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  SECTION 1
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  Literature Review
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Establishing the core paradigm shifts: Detection vs. Prediction, and justifying model selection.
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
                        DETECTION APPROACH
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">Detection Pitfalls</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Traditional sensing is inherently post-ignition, creating critical lags in mitigation.
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <Flame size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Reacts <span className="text-red-600 font-black">AFTER</span> ignition — too late
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <Cpu size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Requires real-time feeds
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <DollarSign size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          High infrastructure cost
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg">
                          <TriangleAlert size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          PyroVision recall cap: <span className="text-red-600 font-black">94.80%</span>
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
                        PREDICTION APPROACH
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">Prediction Advantages</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Pre-emptive risk modeling uses spatial textures to forecast fire threats.
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Zap size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Acts <span className="text-emerald-600 font-black">BEFORE</span> ignition — proactive
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Wifi size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          No real-time stream required
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <DollarSign size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Zero field deployment cost
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                          <ShieldCheck size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Uses full spatial context
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
                        MODEL SELECTION RATIONALE
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2">Why MobileNetV2?</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Maximized performance with minimal computational footprints.
                    </p>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Layers size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Wildfire imagery: low visual depth
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Cpu size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Heavy models (ResNet) overkill
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Zap size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          MobileNetV2: 2.2M params (20× smaller)
                        </span>
                      </div>

                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-100 hover:bg-white transition-all duration-200">
                        <div className="flex-shrink-0 p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                          <Activity size={14} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 leading-snug">
                          Inverted residuals + depth convolutions
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
                      KEY THESIS HYPOTHESIS
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      "Lightweight architecture + Spatial Context ≥ Heavy architecture alone"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200">
                  <Terminal size={14} className="text-slate-500" />
                  System Thesis Approved
                </div>
              </div>
            </div>

            {/* SECTION 2 — DATA & PATTERNS */}
            <div id="section-2" className="scroll-mt-28">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  SECTION 2
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  Dataset & Spatial Patterns
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Distribution of positive/negative wildfire imagery, sample satellite views, and CNN training dynamics.
                </p>
              </div>

              {/* Row 1: Left: Distribution Card | Right: 2x2 Photos Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-stretch">

                {/* Left Card: Data Distribution (5 columns on large screens) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                      <Layers size={12} />
                      DATA DISTRIBUTION
                    </div>

                    {/* Donut Chart */}
                    <div className="relative w-full h-[180px] flex items-center justify-center mb-6">
                      <PieChart width={220} height={180}>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          innerRadius={55}
                          outerRadius={75}
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
                        <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">
                          {activePieIndex === 0 ? 'Wildfire' : activePieIndex === 1 ? 'No Fire' : 'Total Images'}
                        </span>
                        <span className="text-2xl font-black text-slate-900 leading-none mt-1">
                          {activePieIndex === 0 ? '22,710' : activePieIndex === 1 ? '20,140' : '42,850'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 mt-1">
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
                            Wildfire (Positive)
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
                            No Wildfire (Negative)
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
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase">
                        <Sparkles size={12} className="text-emerald-500" />
                        SATELLITE SAMPLES
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        2×2 Matrix · 300×300px
                      </span>
                    </div>

                    {/* 2×2 photo grid — vertical small photo cards with no extra borders */}
                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>

                      {/* wildfire_1 */}
                      <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo (crisp, small, natural size) */}
                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-3">
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
                            WILDFIRE
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Sample 01</span>
                          <p className="text-[11px] font-semibold text-slate-500 leading-tight max-w-[145px] mt-0.5">
                            Dense forest canopy under active burn.
                          </p>
                        </div>
                      </div>

                      {/* wildfire_2 */}
                      <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-3">
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
                            WILDFIRE
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Sample 02</span>
                          <p className="text-[11px] font-semibold text-slate-500 leading-tight max-w-[145px] mt-0.5">
                            Dry shrubland cover and sparse dry woodlands.
                          </p>
                        </div>
                      </div>

                      {/* nowildfire_1 */}
                      <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-3">
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
                            NO WILDFIRE
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Sample 03</span>
                          <p className="text-[11px] font-semibold text-slate-500 leading-tight max-w-[145px] mt-0.5">
                            Urban residential housing and lake boundary.
                          </p>
                        </div>
                      </div>

                      {/* nowildfire_2 */}
                      <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50/30 hover:bg-slate-50/70 transition-all duration-300 group">
                        {/* Top: The Photo */}
                        <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 relative shadow-sm mb-3">
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
                            NO WILDFIRE
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Sample 04</span>
                          <p className="text-[11px] font-semibold text-slate-500 leading-tight max-w-[145px] mt-0.5">
                            Farmland fields and cleared firebreak buffers.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Charts placed under Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                {/* Chart A — Training Loss */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                    <Activity size={12} />
                    LOSS DYNAMICS (EPOCH 1-10)
                  </div>

                  <div className="h-[220px] w-full text-xs flex items-center justify-center">
                    <LineChart width={440} height={220} data={lossData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="epoch" stroke="#94a3b8" />
                      <YAxis domain={[0, 0.6]} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </div>
                </div>

                {/* Chart B — Training Accuracy */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                    <Activity size={12} />
                    ACCURACY DYNAMICS (EPOCH 1-10)
                  </div>

                  <div className="h-[220px] w-full text-xs flex items-center justify-center">
                    <LineChart width={440} height={220} data={accuracyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="epoch" stroke="#94a3b8" />
                      <YAxis domain={[85, 100]} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Line type="monotone" dataKey="trainAcc" name="Training Accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="valAcc" name="Validation Accuracy" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </div>
                </div>

              </div>

              {/* Row 3: Dataset parameters placed at the very bottom */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <Terminal size={12} />
                  DATASET METADATA PARAMETERS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <MapPin size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">Geographic Range</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">Canada high-density forestry regions</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Layers size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">Satellite Specs</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">Zoom lvl 15 · 300px · ~644m coverage</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Database size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">Acquisition Pipeline</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">Kaggle Repository · MapBox API</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <GitBranch size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">Validation Split</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">70% Training / 15% Val / 15% Test</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                    <Maximize size={20} className="text-emerald-600" />
                    <div>
                      <div className="text-[10px] font-black text-slate-700 uppercase">Model Sizing</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">Resized to 224×224px for MobileNetV2</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* SECTION 3 — MODEL ARCHITECTURE */}
            <div id="section-3" className="scroll-mt-28">

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
                  SECTION 3
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  Model Pipeline & Architecture
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  End-to-end inference flow of MobileNetV2, from raw RGB pixels down to final Softmax wildfire predictions.
                </p>
              </div>

              {/* Sub-section A: Architecture Diagram */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 uppercase mb-6">
                  <Layers size={12} />
                  MOBILENETV2 FULL ARCHITECTURE DIAGRAM
                </div>
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={mobilenetv2Arch}
                    className="w-full max-h-64 object-contain filter brightness-95 hover:brightness-100 transition-all duration-300"
                    alt="MobileNetV2 Architecture Diagram"
                  />
                </div>
              </div>

              {/* Sub-section B: Pipeline Visualization Comparison */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8">

                {/* Header */}
                <div className="mb-6">
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    SUB-SECTION B
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2.5">
                    Pipeline Comparison: Wildfire vs. Safe Forest
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Visual comparative analysis of the deep learning pipeline outputs for active wildfire and safe coniferous forest satellite tiles.
                  </p>
                </div>

                {/* 1. Wildfire Pipeline Output */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[9px] font-black tracking-wider text-slate-650 uppercase mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    ACTIVE WILDFIRE SAMPLE PIPELINE OUTPUT (CLASS 1)
                  </div>
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={wildfireImg}
                      className="w-full max-h-[400px] object-contain filter brightness-95 hover:brightness-100 transition-all duration-350"
                      alt="Active Wildfire Pipeline Visualization"
                    />
                  </div>
                </div>

                {/* 2. Safe Forest Pipeline Output */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-[9px] font-black tracking-wider text-slate-650 uppercase mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SAFE FOREST SAMPLE PIPELINE OUTPUT (CLASS 0)
                  </div>
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={nowildfireImg}
                      className="w-full max-h-[400px] object-contain filter brightness-95 hover:brightness-100 transition-all duration-350"
                      alt="Safe Forest Pipeline Visualization"
                    />
                  </div>
                </div>

              </div>

              {/* Sub-section C: Architecture Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Architecture</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">MobileNetV2</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Input Dimensions</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">224 × 224 × 3</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Parameters</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">2.2 Million</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Framework</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">PyTorch 2.0</div>
                </div>
                <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-4 rounded-2xl text-center transition-colors shadow-sm col-span-2 md:col-span-1">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Binary Model Size</div>
                  <div className="text-xs font-bold text-slate-850 font-mono">~8.7 Megabytes</div>
                </div>
              </div>

            </div>

            {/* SECTION 4 — SYSTEM DESIGN & DATA FLOW */}
            <div id="section-4" className="scroll-mt-28 bg-white border border-slate-200/85 p-8 rounded-[2rem] shadow-sm relative group mb-8">

              {/* Section Header */}
              <div className="mb-8">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  SECTION 4
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2.5">
                  System Design & Data Flow
                </h2>
                <p className="text-slate-650 text-sm mt-1 leading-relaxed">
                  Full three-tier microservice architecture, horizontal data telemetry pathways, and core database schemas.
                </p>
              </div>

              {/* Sub-section A: Architecture Overview Diagram */}
              <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-3xl mb-8 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/50 text-[10px] font-black tracking-wider text-slate-700 uppercase mb-6">
                  <Terminal size={12} className="text-slate-600" />
                  TRI-SERVICE MICROSERVICE ARCHITECTURE
                </div>

                {/* Vertical Three-Tier Diagram */}
                <div className="flex flex-col gap-6 w-full">

                  {/* Tier 1: Client Layer */}
                  <div className="w-full bg-blue-50/45 border border-slate-200/60 p-6 md:p-7 rounded-2.5xl shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-350">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none block mb-0.5">Tier 01 · Frontend Presentation</span>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">REACT SPA (TypeScript + Vite)</h4>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4.5">
                      {['React Router v7', 'Context API', 'JWT Auth', 'Google OAuth 2.0', 'Fetch API (async/await)', 'Google Maps API'].map((b, i) => (
                        <span key={i} className="text-[9px] font-bold bg-white text-blue-850 border border-slate-200/70 px-3 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          {b}
                        </span>
                      ))}
                    </div>
                    {/* Page Chips */}
                    <div className="flex flex-wrap gap-2 items-center pt-6">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-1">Interface Pathways:</span>
                      {['Landing/Auth', 'Analyze', 'Results (Grad-CAM++)', 'History/Admin'].map((c, i) => (
                        <span key={i} className="text-[9px] font-bold bg-blue-500/5 text-blue-700 border border-slate-200/35 px-3 py-1 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tier 2: Business Logic & Data Layer */}
                  <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch justify-between relative">

                    {/* API Gateway Card */}
                    <div className="flex-1 bg-emerald-50/45 border border-slate-200/60 p-6 md:p-7 rounded-2.5xl shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-350 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
                            <Server size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none block mb-0.5">Tier 02 · Service Gateway</span>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">NODE.JS + EXPRESS v5</h4>
                          </div>
                        </div>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4.5">
                          {['Mongoose ODM', 'CORS Policy', 'auth.js middleware', 'adminAuth.js middleware', 'async/await', 'Centralized Error Handler'].map((b, i) => (
                            <span key={i} className="text-[9px] font-bold bg-white text-emerald-855 border border-slate-200/70 px-3 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Endpoint Chips */}
                      <div className="flex flex-wrap gap-2 items-center mt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-1">Gateway Routers:</span>
                        {['/api/auth/login', '/api/predict', '/api/history', '/api/admin/logs'].map((c, i) => (
                          <span key={i} className="text-[9px] font-bold bg-emerald-500/5 text-emerald-700 border border-slate-200/35 px-3 py-1 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] font-mono">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Floating MongoDB Database Card */}
                    <div className="w-full lg:w-[320px] bg-emerald-50/45 border border-slate-200/60 p-6 md:p-7 rounded-2.5xl shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-350 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
                            <Database size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none block mb-0.5">Data Layer</span>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight font-sans">MONGODB (NoSQL)</h4>
                          </div>
                        </div>
                        {/* Collection list */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[9.5px] font-mono bg-white/90 border border-slate-200/70 px-3 py-1.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <span className="font-black text-emerald-950">User Schema</span>
                            <span className="text-[7px] text-emerald-600 font-extrabold tracking-wider uppercase">JWT Auth Details</span>
                          </div>
                          <div className="flex items-center justify-between text-[9.5px] font-mono bg-white/90 border border-slate-200/70 px-3 py-1.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <span className="font-black text-emerald-950">Analysis Schema</span>
                            <span className="text-[7px] text-emerald-600 font-extrabold tracking-wider uppercase">Analysis Results</span>
                          </div>
                          <div className="flex items-center justify-between text-[9.5px] font-mono bg-white/90 border border-slate-200/70 px-3 py-1.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <span className="font-black text-emerald-950">Log/Faulty Schema</span>
                            <span className="text-[7px] text-emerald-600 font-extrabold tracking-wider uppercase">Audit Records</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-2 text-[8px] font-extrabold text-emerald-600/80 italic leading-normal">
                        * Note: Raw images are NOT stored in DB. Heatmaps are generated dynamically via coordinates.
                      </div>
                    </div>

                  </div>

                  {/* Tier 3: AI Engine Layer (Centered Full Width below Node & Mongo) */}
                  <div className="w-full bg-blue-50/45 border border-slate-200/60 p-6 md:p-7 rounded-2.5xl shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-350">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                        <BrainCircuit size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none block mb-0.5">Tier 03 · ML Inference Core</span>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">PYTHON FLASK</h4>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4.5">
                      {['MobileNetV2 (PyTorch)', 'Grad-CAM++ (features[18])', 'Spatial Weighting Algorithm', 'MapBox API'].map((b, i) => (
                        <span key={i} className="text-[9px] font-bold bg-white text-blue-800 border border-slate-200/70 px-3 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          {b}
                        </span>
                      ))}
                    </div>
                    {/* Outputs Chips */}
                    <div className="flex flex-wrap gap-2 items-center pt-6">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-1">Generated Payload:</span>
                      {['Risk Score (Softmax)', 'Heatmap (Base64)', '9-patch grid data'].map((c, i) => (
                        <span key={i} className="text-[9px] font-bold bg-blue-500/5 text-blue-700 border border-slate-200/35 px-3 py-1 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Sub-section B: Data Flow Timeline */}
              <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-3xl mb-8 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/50 text-[10px] font-black tracking-wider text-slate-700 uppercase mb-6">
                  <Activity size={12} className="text-slate-600" />
                  ANALYSIS REQUEST DATA FLOW
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
                  SECURITY & AUTHENTICATION PROTOCOLS
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Card 1: JWT AUTHENTICATION */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl w-fit mb-4">
                      <Lock size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">JWT Authentication</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      Stateless, cryptographically signed 24-hour access tokens. Zero database session queries required on inference paths, ensuring rapid, decoupled system gateways.
                    </p>
                  </div>

                  {/* Card 2: GOOGLE OAUTH 2.0 */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl w-fit mb-4">
                      <Chrome size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Google OAuth 2.0</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      Secure, third-party presenter authentication with secure server-side token validation. Protects internal schemas against automated account dictionary attacks.
                    </p>
                  </div>

                  {/* Card 3: ROLE-BASED ACCESS */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl w-fit mb-4">
                      <Shield size={20} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Role-Based Access (RBAC)</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      Granular gateway authorization routes (<code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">user</code> vs <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[9px] text-emerald-600">admin</code>). Strict whitelist CORS headers restrict API access strictly to whitelisted presenter origins.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* SECTION 5 — PLACEHOLDER */}
            <div id="section-5" className="scroll-mt-28 bg-white border border-slate-200/85 p-8 rounded-[2rem] shadow-sm relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  SECTION 5
                </span>
                <span className="text-[9px] font-black tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                  DRAFT • AWAITING CONTENT
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Live Demo & Validation
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Awaiting your details for Section 5. Let's showcase live predictions, scanning windows, confusion matrices, or validation curves!
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 font-mono text-[11px] text-slate-400 flex items-center gap-3">
                <Sparkles size={16} className="text-slate-400" />
                <span>Ready to integrate scanning demonstrations or validation metrics here...</span>
              </div>
            </div>

            {/* SECTION 6 — PLACEHOLDER */}
            <div id="section-6" className="scroll-mt-28 bg-white border border-slate-200/85 p-8 rounded-[2rem] shadow-sm relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  SECTION 6
                </span>
                <span className="text-[9px] font-black tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                  DRAFT • AWAITING CONTENT
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Future & Summary
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Awaiting your details for Section 6. Let's outline the early-warning pipelines, SMS alerting APIs, ground IoT integrations, and overall conclusions.
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 font-mono text-[11px] text-slate-400 flex items-center gap-3">
                <Sparkles size={16} className="text-slate-400" />
                <span>Ready to integrate future roadmap plans or closing remarks here...</span>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
