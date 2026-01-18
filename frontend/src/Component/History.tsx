import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MoveLeftIcon, FileDownIcon } from 'lucide-react';

interface ScanRecord {
  _id: string;
  coordinates: { 
    lat: number; 
    lng: number; 
    regionName: string 
  };
  prediction: { 
    riskLevel: string; 
    accuracy: number; 
    timestamp: string;
    modelId?: string;
  };
  // Added feedback to the interface
  userFeedback?: {
    isCorrect: boolean | null;
    notes?: string;
  };
  userId?: { fullName: string; email: string };
}

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [_, setLoading] = useState(true);

  const downloadCSV = () => {
    const headers = ["User", "Region", "Latitude", "Longitude", "Risk_Level", "Accuracy", "Date", "User_Feedback", "Notes"];
    
    const rows = scans.map(scan => [
      scan.userId?.fullName || "N/A",
      `"${scan.coordinates.regionName}"`,
      scan.coordinates.lat,
      scan.coordinates.lng,
      scan.prediction.riskLevel,
      `${(scan.prediction.accuracy * 100).toFixed(1)}%`,
      new Date(scan.prediction.timestamp).toLocaleDateString(),
      scan.userFeedback?.isCorrect === true ? "Valid" : scan.userFeedback?.isCorrect === false ? "Faulty" : "Unverified",
      `"${scan.userFeedback?.notes || ""}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ForeSpark_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('fireforest_token');
      const endpoint = user?.role === 'admin' ? '/api/admin/master-history' : '/api/scans/my-history';
      
      try {
        const response = await fetch(endpoint, {
          headers: { 'x-auth-token': token || '' }
        });
        const data = await response.json();
        setScans(user?.role === 'admin' ? data.data : data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-emerald-600/5 -skew-y-3 origin-top-left z-0" />
      
      <div className="relative z-10 max-w-6xl mx-auto pt-32 pb-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all mb-4"
            >
              <MoveLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Map
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              {user?.role === 'admin' ? 'Global Logs' : 'My History'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={downloadCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
            >
              <FileDownIcon size={18} /> Download CSV
            </button>
            <div className="bg-white border border-emerald-100 px-6 py-4 rounded-2xl shadow-sm">
              <div className="text-[10px] font-black uppercase text-slate-400">Total Records</div>
              <div className="text-2xl font-black text-emerald-600">{scans.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  {user?.role === 'admin' && <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">User</th>}
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">Region</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">Risk Level</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">AI Accuracy</th>
                  {user?.role === 'admin' && <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>}
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scans.map((scan) => (
                  <React.Fragment key={scan._id}>
                    <tr className="hover:bg-emerald-50/30 transition-all group">
                      {user?.role === 'admin' && (
                        <td className="px-10 py-7">
                          <div className="font-bold text-slate-900">{scan.userId?.fullName}</div>
                          <div className="text-[10px] text-slate-400">{scan.userId?.email}</div>
                        </td>
                      )}
                      <td className="px-10 py-7">
                        <div className="font-bold text-slate-900">{scan.coordinates.regionName}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {scan.coordinates.lat.toFixed(4)}, {scan.coordinates.lng.toFixed(4)}
                        </div>
                      </td>
                      <td style={{padding: '7px'}} className="px-12 py-7">
                        <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          scan.prediction.riskLevel.toLowerCase().includes('high') 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {scan.prediction.riskLevel}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                        <div className="text-sm font-bold text-slate-700">
                          {(scan.prediction.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase font-black">{scan.prediction.modelId || 'V1.0'}</div>
                      </td>
                      
                      {/* ADMIN FEEDBACK COLUMN */}
                      {user?.role === 'admin' && (
                        <td className="px-10 py-7 text-center">
                          {scan.userFeedback?.isCorrect !== null ? (
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[9px] uppercase ${
                              scan.userFeedback?.isCorrect 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {scan.userFeedback?.isCorrect ? '✓ Valid' : '✕ Faulty'}
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-300 uppercase italic">Unverified</span>
                          )}
                        </td>
                      )}

                      <td className="px-10 py-7 text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {new Date(scan.prediction.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>

                    {/* ADMIN NOTES SUB-ROW */}
                    {user?.role === 'admin' && scan.userFeedback?.notes && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={6} className="px-10 py-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-100 px-2 py-0.5 rounded">User Note</span>
                            <p className="text-xs text-slate-600 italic font-medium">"{scan.userFeedback.notes}"</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}