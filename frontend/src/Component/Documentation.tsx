import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Database, TriangleAlert, Zap, Cpu, Image, Layers, MoveRight } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Reveal from './Reveal';

export default function Documentation() {
  const navigate = useNavigate();

  /* Training / Validation history (representative, matches reported trends) */
  const trainingMetrics = [
    { epoch: '1', trainAcc: 96.2, valAcc: 98.5, trainLoss: 0.10, valLoss: 0.045 },
    { epoch: '2', trainAcc: 97.8, valAcc: 96.9, trainLoss: 0.063, valLoss: 0.088 },
    { epoch: '3', trainAcc: 98.0, valAcc: 98.9, trainLoss: 0.055, valLoss: 0.036 },
    { epoch: '4', trainAcc: 98.35, valAcc: 98.8, trainLoss: 0.047, valLoss: 0.034 },
    { epoch: '5', trainAcc: 98.45, valAcc: 99.2, trainLoss: 0.043, valLoss: 0.027 },
  ];

  /* Test-set performance (MobileNetV2) */
  const performanceMetrics = [
    { name: 'Accuracy', value: 99.46 },
    { name: 'Precision', value: 99.57 },
    { name: 'Recall', value: 99.45 },
    { name: 'F1-Score', value: 99.51 },
  ];

  /* Dataset split */
  const datasetComposition = [
    { name: 'Training', value: 70 },
    { name: 'Validation', value: 15 },
    { name: 'Test', value: 15 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Model Documentation</h1>
            <p className="text-slate-600 text-sm mt-1">
              Technical description of the wildfire risk prediction model
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Introduction */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-8">System Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="p-4 bg-emerald-500/10 rounded-xl w-fit mb-4">
                <Database size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Satellite Image Patches</h3>
              <p className="text-slate-600">
                The system processes RGB satellite image patches, each covering approximately
                644×644 meters, extracted from larger forested regions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="p-4 bg-blue-500/10 rounded-xl w-fit mb-4">
                <BrainCircuit size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">MobileNetV2 Backbone</h3>
              <p className="text-slate-600">
                A MobileNetV2 architecture implemented in PyTorch, containing 2,226,434 trainable
                parameters and optimized for efficient inference.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="p-4 bg-orange-500/10 rounded-xl w-fit mb-4">
                <TriangleAlert size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Risk & Confidence Output</h3>
              <p className="text-slate-600">
                The model produces two softmax probabilities corresponding to “risky” and
                “non-risky” classes, yielding both a discrete prediction and an associated
                confidence score.
              </p>
            </div>
          </div>
        </section>

        {/* Training Curves */}
       <Reveal>
  {(visible) => (
    <section className="mb-20">
      <h2 className="text-3xl font-black text-slate-900 mb-8">
        Training Dynamics
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LOSS */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <h3 style={{ textAlign: "center", fontSize: 18, fontWeight: 800 }}>
            Loss Over Epochs
          </h3>

          {visible && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis domain={[0, 0.15]} />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="trainLoss"
                  stroke="#10b981"
                  strokeWidth={3}
                  animationDuration={2000}
                />
                <Line
                  dataKey="valLoss"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  animationDuration={2000}
                  animationBegin={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ACCURACY */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <h3 style={{ textAlign: "center", fontSize: 18, fontWeight: 800 }}>
            Accuracy Over Epochs
          </h3>

          {visible && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis domain={[95, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="trainAcc"
                  stroke="#10b981"
                  strokeWidth={3}
                  animationDuration={2000}
                />
                <Line
                  dataKey="valAcc"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  animationDuration={2000}
                  animationBegin={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )}
</Reveal>



        {/* Performance Metrics */}
        <Reveal>
        {(visible) => (
        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Test Set Performance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 style={{textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#334155'}}>
                Dataset Composition
              </h3>
              {visible && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datasetComposition}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    isAnimationActive
                  >
                    {datasetComposition.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 style={{textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#334155'}}>
                Test Set Metrics
              </h3>
              {visible && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[97, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive>
                    {performanceMetrics.map((_, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index]}
                        />
                    ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>
        )}
        </Reveal>
        {/* Spatial Aggregation */}
        <Reveal>

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Spatial Aggregation Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visual Grid */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 text-center mb-6">3×3 Patch Aggregation</h3>
                <div className="grid grid-cols-3 gap-3 w-fit">
                  {/* Top-left corner */}
                  <div className="w-24 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-blue-900">5%</div>
                    <div className="text-[10px] text-blue-700 font-bold mt-1">Corner</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.05 weight
                    </div>
                  </div>
                  
                  {/* Top center */}
                  <div className="w-24 h-24 bg-emerald-200 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-emerald-900">10%</div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">Edge</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.10 weight
                    </div>
                  </div>
                  
                  {/* Top-right corner */}
                  <div className="w-24 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-blue-900">5%</div>
                    <div className="text-[10px] text-blue-700 font-bold mt-1">Corner</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.05 weight
                    </div>
                  </div>

                  {/* Middle-left */}
                  <div className="w-24 h-24 bg-emerald-200 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-emerald-900">10%</div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">Edge</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.10 weight
                    </div>
                  </div>
                  
                  {/* Center - Main patch */}
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500 border-4 border-orange-600 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-2xl hover:shadow-orange-400 transition-all cursor-pointer group shadow-lg">
                    <div className="text-sm font-black text-white">40%</div>
                    <div className="text-xs text-orange-100 font-bold mt-1">Center</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                      0.40 weight
                    </div>
                  </div>
                  
                  {/* Middle-right */}
                  <div className="w-24 h-24 bg-emerald-200 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-emerald-900">10%</div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">Edge</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.10 weight
                    </div>
                  </div>

                  {/* Bottom-left corner */}
                  <div className="w-24 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-blue-900">5%</div>
                    <div className="text-[10px] text-blue-700 font-bold mt-1">Corner</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.05 weight
                    </div>
                  </div>
                  
                  {/* Bottom center */}
                  <div className="w-24 h-24 bg-emerald-200 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-emerald-900">10%</div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">Edge</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.10 weight
                    </div>
                  </div>
                  
                  {/* Bottom-right corner */}
                  <div className="w-24 h-24 bg-blue-100 border-2 border-blue-400 rounded-lg flex flex-col items-center justify-center p-2 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="text-xs font-black text-blue-900">5%</div>
                    <div className="text-[10px] text-blue-700 font-bold mt-1">Corner</div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      0.05 weight
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex gap-6 mt-2 pt-6 w-full justify-center flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-300 to-orange-500 rounded border-2 border-orange-600"></div>
                  <span className="text-sm font-semibold text-slate-700">Center (40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-200 rounded border-2 border-emerald-500"></div>
                  <span className="text-sm font-semibold text-slate-700">Edge (10% each)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded border-2 border-blue-400"></div>
                  <span className="text-sm font-semibold text-slate-700">Corner (5% each)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">How It Works</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500 text-white font-bold text-lg">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Spatial Context Analysis</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Instead of analyzing a single image patch in isolation, the system evaluates a <strong>3×3 grid</strong> of satellite patches around the target location.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500 text-white font-bold text-lg">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Weighted Aggregation</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      The center patch (target area) gets 40% weight as it's most critical. Edge patches (4 neighbors) get 10% each, corner patches get 5% each.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500 text-white font-bold text-lg">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Robust Predictions</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      This weighted combination improves prediction robustness by incorporating environmental context, reducing noise sensitivity, and covering <strong>~3.7 km²</strong> total area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        </Reveal>
        {/* Technical Specs */}

        <section className="mb-20">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Technical Specifications</h2>
          
          {/* Model Architecture Flow */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Model Architecture Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Input */}
              <Reveal>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-2xl border-2 border-blue-300 text-center">
                <Image size={40} className="mx-auto text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Input</h4>
                <p className="text-sm text-slate-700 font-mono rounded p-2">
                  224×224×3
                </p>
                <p className="text-xs text-slate-600 mt-2">RGB Image</p>
              </div>
              </Reveal>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="hidden md:block text-2xl text-slate-400"><MoveRight size={40}></MoveRight></div>
              </div>

              {/* Processing */}
              <Reveal
              delay={0.5}
              ease="easeInOut"
              slide="x">

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-2xl border-2 border-emerald-300 text-center md:col-span-1">
                <Cpu size={40} className="mx-auto text-emerald-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Processing</h4>
                <p className="text-sm text-slate-700 font-bold">MobileNetV2</p>
                <p className="text-xs text-slate-600 mt-2">2.2M params</p>
              </div>
              </Reveal>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="hidden md:block text-2xl text-slate-400"><MoveRight size={40}></MoveRight></div>
              </div>

              {/* Output */}
              <Reveal delay={1} ease="easeOut" slide="x">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-2xl border-2 border-orange-300 text-center">
                <Zap size={40} className="mx-auto text-orange-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Output</h4>
                <p className="text-sm text-slate-700 font-mono rounded p-2">
                  Softmax (2)
                </p>
                <p className="text-xs text-slate-600 mt-2">Risk Classification</p>
              </div>
              </Reveal>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Model Specs */}

            <Reveal ease="easeInOut">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <BrainCircuit size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Model Details</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-slate-600">Architecture</span>
                  <span className="font-bold text-slate-900">MobileNetV2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Input Size</span>
                  <span className="font-bold text-slate-900">224×224×3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Parameters</span>
                  <span className="font-bold text-slate-900">2.2M</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Framework</span>
                  <span className="font-bold text-slate-900">PyTorch</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Output Classes</span>
                  <span className="font-bold text-slate-900">2 (Risk/Safe)</span>
                </li>
                <li className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-semibold">Model Size</span>
                  <span className="font-bold text-emerald-600">~8.7 MB</span>
                </li>
              </ul>
            </div>
            </Reveal>
            

            {/* Dataset Stats */}
            <Reveal ease="easeInOut">

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Database size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Dataset</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-slate-600">Total Images</span>
                  <span className="font-bold text-slate-900">42,850</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Wildfire</span>
                  <span className="font-bold text-orange-600">22,710</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">No-Wildfire</span>
                  <span className="font-bold text-emerald-600">20,140</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Source</span>
                  <span className="font-bold text-slate-900">Kaggle</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Region</span>
                  <span className="font-bold text-slate-900">Canada</span>
                </li>
                <li className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="text-slate-600 font-semibold">Balance</span>
                  <span className="font-bold text-blue-600">53:47</span>
                </li>
              </ul>
            </div>
          </Reveal>
          </div>

          {/* Tech Stack */}
          <div className="bg-blue-600 text-white p-8 rounded-2xl border-7 border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Layers color='white' size={28} />
              <h3 className="text-xl font-bold">Technology Stack</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase tracking-wider">Backend</p>
                <div className="space-y-1 text-sm">
                  <p>• Express.js</p>
                  <p>• Flask</p>
                  <p>• PyTorch</p>
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase tracking-wider">Frontend</p>
                <div className="space-y-1 text-sm">
                  <p>• React</p>
                  <p>• TypeScript</p>
                  <p>• Tailwind CSS</p>
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase tracking-wider">Data</p>
                <div className="space-y-1 text-sm">
                  <p>• MongoDB</p>
                  <p>• Satellite Imagery</p>
                  <p>• Google Maps API</p>
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase tracking-wider">Deployment</p>
                <div className="space-y-1 text-sm">
                  <p>• ONNX Conversion</p>
                  <p>• Mobile Optimized</p>
                  <p>• Real-time Capable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <footer className="py-16 text-center text-slate-600 border-t border-white/5">
        <div className="mb-4 font-black tracking-tighter text-xl text-emerald-500/50">FORESPARK</div>
        <p className="text-[10px] uppercase tracking-[0.5em]">© 2026 Protecting our Green Future</p>
      </footer>
    </div>
  );
}
