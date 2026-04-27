// app/RecommendationBox.tsx
'use client';

import { useState } from 'react';

type Cam = {
  id: string;
  manufacturer: { name: string };
  partNumber: string;
  name: string;
  durationIntake: number;
  durationExhaust: number;
  liftIntake: number;
  liftExhaust: number;
  lsa: number | null;
  powerbandLow: number | null;
  powerbandHigh: number | null;
  recommendedUse: string[];
  headType: string | null;
  idleQuality: string | null;
};

export default function RecommendationBox({ initialCams }: { initialCams: Cam[] }) {
  const [buildDescription, setBuildDescription] = useState('');
  const [recommendations, setRecommendations] = useState<Cam[]>([]);
  const [reasoning, setReasoning] = useState('');

  const getRecommendations = () => {
    if (!buildDescription.trim()) return;

    const lowerDesc = buildDescription.toLowerCase();

    const scored = initialCams.map(cam => {
      let score = 0;
      if (lowerDesc.includes('turbo') && cam.recommendedUse.includes('turbo')) score += 50;
      if (lowerDesc.includes('street') || lowerDesc.includes('daily')) score += cam.idleQuality === 'smooth' ? 30 : 10;
      if (lowerDesc.includes('truck')) score += cam.recommendedUse.includes('truck') ? 40 : 0;
      if (lowerDesc.includes('1000') || lowerDesc.includes('high hp')) score += (cam.powerbandHigh && cam.powerbandHigh > 6800) ? 40 : 0;
      if (lowerDesc.includes('ls3') || lowerDesc.includes('rectangular')) score += cam.headType === 'rectangular' ? 30 : 0;
      return { cam, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topCams = scored.slice(0, 5).map(s => s.cam);

    setRecommendations(topCams);
    setReasoning(`Best match for: "${buildDescription}"`);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 mb-12">
      <h2 className="text-2xl font-semibold mb-4">Describe Your Build → Get Top 3–5 Recommendations</h2>
      <textarea
        value={buildDescription}
        onChange={(e) => setBuildDescription(e.target.value)}
        placeholder="Example: 5.3L truck, 450hp daily driver, 3.42 gears, cathedral heads, street driven"
        className="w-full h-28 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        onClick={getRecommendations}
        className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-medium transition-colors"
      >
        Get Recommendations
      </button>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Recommended Cams</h3>
          <div className="space-y-4">
            {recommendations.map((cam) => (
              <div key={cam.id} className="flex gap-6 bg-zinc-950 border border-zinc-700 rounded-2xl p-4">
                <div className="flex-1">
                  <div className="font-semibold">{cam.name}</div>
                  <div className="text-sm text-zinc-400">{cam.manufacturer.name} • {cam.partNumber}</div>
                </div>
                <div className="text-right text-sm">
                  <div>{cam.durationIntake}/{cam.durationExhaust} @.050"</div>
                  <div>{cam.liftIntake.toFixed(3)}/{cam.liftExhaust.toFixed(3)} lift</div>
                  <div className="text-blue-400">LSA {cam.lsa}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-6">{reasoning}</p>
        </div>
      )}
    </div>
  );
}