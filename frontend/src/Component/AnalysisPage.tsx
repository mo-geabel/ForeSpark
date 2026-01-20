import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";

/* =========================
   Feedback Section
========================= */
function FeedbackSection({
  feedback,
  setFeedback,
  notes,
  setNotes
}: {
  feedback: boolean | null;
  setFeedback: (v: boolean) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  return (
    <div className="mt-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
          Accuracy
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setFeedback(true)}
            className={`p-2 rounded-lg transition-all ${
              feedback === true
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-400 border border-slate-100"
            }`}
          >
            <HandThumbUpIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setFeedback(false)}
            className={`p-2 rounded-lg transition-all ${
              feedback === false
                ? "bg-red-600 text-white"
                : "bg-white text-slate-400 border border-slate-100"
            }`}
          >
            <HandThumbDownIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Small note (optional)..."
        className="w-full bg-white border border-slate-100 p-2 rounded-xl text-[10px] outline-none focus:border-emerald-500/50 transition-all text-slate-700"
      />
    </div>
  );
}

/* =========================
   Analysis Page
========================= */
export default function AnalysisPage() {
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [analysisResult, setAnalysisResult] = useState<any>(
    location.state?.analysisResult || null
  );
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");

  /* Fetch if page refreshed */
  useEffect(() => {
    if (!analysisResult && id) {
      fetch(`http://localhost:5000/api/scans/${id}`, {
        headers: {
          "x-auth-token": localStorage.getItem("fireforest_token") || ""
        }
      })
        .then(res => res.json())
        .then(setAnalysisResult)
        .catch(() => navigate("/"));
    }
  }, [id, analysisResult, navigate]);

  const handleSaveFeedback = async (id: string) => {
    if (!analysisResult) return;

    await fetch(
      `http://localhost:5000/api/scans/feedback/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("fireforest_token") || ""
        },
        body: JSON.stringify({
          isCorrect: feedback,
          notes
        })
      }
    );

    navigate("/history");
  };

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950/5 px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-6xl bg-white rounded-3xl lg:rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Spatial Grid */}
        <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10 bg-emerald-50/50 border-b lg:border-b-0 lg:border-r border-emerald-100">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
          >
            ← Back
          </button>

          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-800">
            Spatial Grid Analysis
          </h3>
          <p className="text-[9px] text-emerald-600 mb-6">
            9-point deep learning verification
          </p>

          <div className="grid grid-cols-3 gap-2">
           {analysisResult.grid_data.map((point: any, idx: number) => (
            <div
              key={idx}
              className="relative overflow-hidden shadow-md border-2 border-white aspect-square group"
            >
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=17&size=300x300&maptype=satellite&key=${GOOGLE_API_KEY}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-2 left-2 px-2 py-1 bg-white/95 backdrop-blur rounded-lg text-[8px] font-black text-emerald-900">
                {point.label}
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <span className={`text-[8px] font-black uppercase ${
                  point.individual_prob > 0.4 ? "text-orange-300" : "text-emerald-300"
                }`}>
                  {(point.individual_prob * 100).toFixed(0)}%
                </span>

                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      point.individual_prob > 0.4 ? "bg-orange-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${point.individual_prob * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* RIGHT — Verdict */}
        <div className="lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
            AI Verdict
          </span>

          <h2
            className={`mt-4 font-bold tracking-tight leading-none
              text-3xl sm:text-4xl lg:text-5xl
              ${analysisResult.result === "High Risk" || analysisResult.result === "Critical Risk"
                ? "text-red-600"
                : "text-emerald-600"}
            `}
          >
            {analysisResult.result}
          </h2>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tabular-nums">
              {(analysisResult.total_probability * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">
              Estimated<br />Risk
            </span>
          </div>
        </div>

         <FeedbackSection
            feedback={feedback}
            setFeedback={setFeedback}
            notes={notes}
            setNotes={setNotes}
          />

        <div className="space-y-3 mt-6">
          <button
            onClick={() => handleSaveFeedback(analysisResult._id)}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-emerald-700 transition-all active:scale-95"
          >
            Confirm & Save History
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 transition-all active:scale-95"
          >
            Discard Scan
          </button>
        </div>

        <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
          <p className="text-[9px] text-emerald-800 italic leading-relaxed">
            "This report combines spatial data from surrounding areas. The weighted algorithm
            prioritizes central terrain while monitoring perimeter threats."
          </p>
        </div>
      </div>

    </div>
  </div>
  );
}
