"use client";

import React from "react";
import { Coffee, TrendingUp, AlertCircle, Lightbulb, Clock } from "lucide-react";

export default function MorningBriefs() {
  // Sample morning brief data - in production, this would come from Convex
  const briefs = [
    {
      date: "Feb 9, 2026",
      time: "7:30 AM EST",
      headline: "Weekend Market Shift + Wellness Tailwinds",
      news: [
        "Japan's LDP wins landslide election—geopolitical stability improving",
        "India-US trade deal reshaping markets—tariff relief for tech/manufacturing",
        "Measles outbreak in SC driving wellness narrative—immunity angle trending",
        "Winter Olympics Bollywood moment—cross-cultural branding resonates",
      ],
      tech: [
        "AI Impact Summit 2026 launching Feb 16-20 in New Delhi (Sam Altman attending)",
        "Markets tilting toward growth over mega-cap tech—DTC opportunity",
      ],
      business: [
        "Risk-off sentiment = lower ad CPMs (acquisition opportunity window)",
        "Consumer caution favoring retention over new acquisition",
        "Health/wellness messaging gaining traction across CPG",
      ],
      yippy: [
        "🏌️ Test immunity/functional health angle in golf positioning",
        "📧 Increase email sequences for repeat conversion (3% → 10%)",
        "💰 Monitor Meta CPMs for budget scaling window",
      ],
    },
    {
      date: "Feb 8, 2026",
      time: "7:30 AM EST",
      headline: "Global News + Business Context",
      news: [
        "Trump-Russia peace talks progressing in Abu Dhabi",
        "France investigating ex-culture minister over Epstein links",
        "LA mayor race heating up with Nithya Raman challenge",
      ],
      tech: [],
      business: [
        "Precious metals volatility—silver rebounds in India markets",
        "Global economic uncertainty = cautious consumer spending",
      ],
      yippy: [
        "Monitor competitor NicoDose ($2M ad spend) for market shifts",
        "Leverage golf community positioning during market uncertainty",
      ],
    },
  ];

  const nextBrief = new Date();
  nextBrief.setDate(nextBrief.getDate() + 1);
  nextBrief.setHours(7, 30, 0, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Next Brief Schedule */}
      <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">Next Morning Brief</h3>
            <p className="text-amber-100/80">
              {formatDate(nextBrief)} at 7:30 AM EST
            </p>
            <p className="text-amber-100/60 text-sm mt-2">
              Automated daily briefing with global news, tech updates, business trends, and Yippy-specific opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Previous Briefs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Coffee className="w-6 h-6 text-amber-400" />
          Morning Briefs Archive
        </h2>

        <div className="space-y-6">
          {briefs.map((brief, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-slate-700/30 pb-4">
                <h3 className="text-xl font-bold text-white mb-2">{brief.headline}</h3>
                <p className="text-sm text-slate-400">{brief.date} • {brief.time}</p>
              </div>

              {/* Global News */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Global Headlines
                </h4>
                <ul className="space-y-2">
                  {brief.news.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <span className="text-blue-400 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech & AI */}
              {brief.tech.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    Tech & AI
                  </h4>
                  <ul className="space-y-2">
                    {brief.tech.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-300">
                        <span className="text-purple-400 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Business & Markets */}
              {brief.business.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Business & Markets
                  </h4>
                  <ul className="space-y-2">
                    {brief.business.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-300">
                        <span className="text-green-400 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Yippy Opportunities */}
              <div className="bg-slate-700/30 border border-amber-600/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Yippy Action Items
                </h4>
                <ul className="space-y-2">
                  {brief.yippy.map((item, i) => (
                    <li key={i} className="flex gap-3 text-amber-100">
                      <span className="text-amber-400 font-bold mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">About Morning Briefs</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Every morning at 7:30 AM EST, Yippybot delivers an automated briefing with:
        </p>
        <ul className="list-disc list-inside text-slate-300 text-sm mt-3 space-y-1">
          <li>🌍 Global trending stories and market news</li>
          <li>🤖 Tech & AI updates relevant to business</li>
          <li>💼 Business & market trends affecting DTC</li>
          <li>🏌️ Yippy-specific opportunities and action items</li>
        </ul>
        <p className="text-slate-400 text-xs mt-4">
          Archives are kept for reference. Each brief is tailored to Yippy Pouches' market positioning and strategic goals.
        </p>
      </div>
    </div>
  );
}
