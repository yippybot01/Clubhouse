"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, TrendingUp, AlertCircle, Target } from "lucide-react";

export default function SeasonalCalendar() {
  const [expandedMonth, setExpandedMonth] = useState("april");

  const months = [
    { id: "january", name: "January", quarter: "Q1", theme: "New Year Resolutions + Spring Prep", headline: "New Year, New Game", keyEvents: ["New Year's Day hangover recovery","PGA Tour starts","Winter golf in warmer climates peaks"], campaigns: ["Resolution Ramp email series","Bundle play: Golf + Desk","Influencer testimonials on focus/energy"], messaging: "Energy + Focus = Better Performance", budget: "30% ads, 40% content, 30% events" },
    { id: "february", name: "February", quarter: "Q1", theme: "Presidents' Day + Couples/Group Play", headline: "Social Golf & Group Events", keyEvents: ["Presidents' Day weekend","Valentine's Day couples golf","PGA Tour Swing"], campaigns: ["Couples' Golf Package bundle","Guys' Trip Kit (2-3 pack)","Couple testimonial videos"], messaging: "Share the vibe, stay sharp, no jitters", budget: "25% ads, 35% content, 40% events" },
    { id: "march", name: "March", quarter: "Q1", theme: "Spring Break + Masters Prep", headline: "Spring Travel & Tournament Preparation", keyEvents: ["Spring Break","Masters practice rounds","March Madness crossover audience"], campaigns: ["Spring Escape Bundle","Masters Prep Series (4-week email)","YouTube: What's in my golf bag?"], messaging: "Professional-grade focus, tournament-tested", budget: "35% ads, 35% content, 30% events" },
    { id: "april", name: "April", quarter: "Q2", theme: "Masters Tournament + Peak Season", headline: "The Biggest Golf Event of the Year", keyEvents: ["Masters Tournament (April 9-12, 2026)","Spring weather = peak conditions","PGA Tour majors momentum"], campaigns: ["Masters Madness bracket email","Tour Pro Tips educational series","Limited edition Masters bundles"], messaging: "Championship-level focus, proven by pros", budget: "40% ads, 40% content, 20% events", highlight: true },
    { id: "may", name: "May", quarter: "Q2", theme: "Charity Tournaments + Wedding Season", headline: "Community & Celebration Golf", keyEvents: ["Charity golf outings","Memorial Day weekend (May 26)","Wedding season begins"], campaigns: ["Charity Tournament Kit","Bachelor Party Bundle","Partner with charity organizations"], messaging: "Great rounds create great memories", budget: "25% ads, 30% content, 45% events" },
    { id: "june", name: "June", quarter: "Q2", theme: "Summer + Father's Day", headline: "FATHER'S DAY GIFT GIVING EVENT", keyEvents: ["Father's Day (June 15, 2026)","Summer season peak","Kids golf camps ramp up"], campaigns: ["Father's Day Special limited bundles","Dad's Day Out gift marketing","Email: 10 Father's Day gifts under $50"], messaging: "Gift perfection, fathers deserve the best", budget: "35% ads, 35% content, 30% events", highlight: true },
    { id: "july", name: "July", quarter: "Q3", theme: "Summer Peak + Independence Day", headline: "Vacation Golf & Summer Travel", keyEvents: ["Independence Day (July 4)","Summer vacation peak","Hot weather golf"], campaigns: ["Summer Vacation Bundle","Beat the Heat content series","Destination golf guides"], messaging: "Stay sharp in any conditions", budget: "30% ads, 40% content, 30% events" },
    { id: "august", name: "August", quarter: "Q3", theme: "Late Summer + Back-to-School", headline: "Youth Golf & New Routines", keyEvents: ["Back-to-school","Kids golf camps","High school golf season prep"], campaigns: ["Youth Golf Bundle","Back-to-School routine content","High school golf team sponsorships"], messaging: "Performance + focus + healthy alternative", budget: "25% ads, 40% content, 35% events" },
    { id: "september", name: "September", quarter: "Q3", theme: "Fall Transition", headline: "End of Summer, Best Golf Season Ahead", keyEvents: ["Labor Day (Sept 1)","Fall weather begins","Work/school routines restart"], campaigns: ["Fall Formula seasonal messaging","Back to Routine content series","Labor Day sale/promotion"], messaging: "Fall = Best golf season, peak performance", budget: "30% ads, 40% content, 30% events" },
    { id: "october", name: "October", quarter: "Q4", theme: "Fall Tournament Season", headline: "Competitive Golf & Tournament Prep", keyEvents: ["October golf tournaments","PGA Tour majors","Fall foliage peak"], campaigns: ["Tournament Ready email series","Compete Like a Pro content","Sponsorships of local tournaments"], messaging: "Competition-tested, perform under pressure", budget: "35% ads, 40% content, 25% events" },
    { id: "november", name: "November", quarter: "Q4", theme: "Thanksgiving + BLACK FRIDAY", headline: "BIGGEST SHOPPING EVENT OF THE YEAR", keyEvents: ["Thanksgiving (Nov 27)","Black Friday (Nov 28)","Cyber Monday (Dec 1)"], campaigns: ["Black Friday Blitz (30-50% off)","Turkey Bowl Special bundles","12 Days of Golf Deals"], messaging: "Save big on functional performance", budget: "50% ads, 30% content, 20% events", highlight: true },
    { id: "december", name: "December", quarter: "Q4", theme: "Holiday Season + Year-End", headline: "Gift Giving & New Year Prep", keyEvents: ["Holiday season (Dec 1-25)","Christmas (Dec 25)","New Year's Eve (Dec 31)"], campaigns: ["Last Minute Gift bundles","Holiday Gift Guide","New Year Teases (Jan deals)"], messaging: "Perfect gift, start 2027 strong", budget: "45% ads, 40% content, 15% events" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500/10 to-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-sans font-bold text-white mb-2 tracking-tight">Golf Seasonal Marketing Calendar 2026</h2>
            <p className="text-gray-400">Strategic content, campaigns, and budget allocation by season.</p>
          </div>
        </div>
      </div>

      {/* Quarterly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
          const qm = months.filter((m) => m.quarter === quarter);
          return (
            <div key={quarter} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300">
              <p className="text-amber-400 font-sans font-bold text-lg">{quarter}</p>
              <p className="text-gray-400 text-sm mt-2">{qm.length} Months</p>
              <p className="text-gray-500 text-xs mt-1">{qm.reduce((s, m) => s + m.campaigns.length, 0)} Campaigns</p>
            </div>
          );
        })}
      </div>

      {/* Months */}
      <div className="space-y-3">
        {months.map((month) => (
          <div key={month.id} className={`border rounded-2xl transition-all duration-300 backdrop-blur-xl ${
            expandedMonth === month.id
              ? "bg-white/[0.07] border-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.15)]"
              : "bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20"
          }`}>
            <button onClick={() => setExpandedMonth(expandedMonth === month.id ? "" : month.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-sans font-bold text-white">{month.name}</h3>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-lg text-gray-400 border border-white/10">{month.quarter}</span>
                    {month.highlight && <Target className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{month.theme}</p>
                </div>
              </div>
              <div className="text-amber-400 font-sans font-semibold text-sm">{month.headline}</div>
            </button>

            {expandedMonth === month.id && (
              <div className="px-6 pb-6 border-t border-white/10 space-y-4 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2 mt-4">
                    <CalendarIcon className="w-4 h-4 text-emerald-400" />Key Events
                  </h4>
                  <ul className="space-y-1">
                    {month.keyEvents.map((e, i) => (
                      <li key={i} className="text-sm text-gray-400 flex gap-2"><span className="text-emerald-400">•</span><span>{e}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />Campaigns
                  </h4>
                  <ul className="space-y-1">
                    {month.campaigns.map((c, i) => (
                      <li key={i} className="text-sm text-gray-400 flex gap-2"><span className="text-amber-400">→</span><span>{c}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border-l-4 border-amber-500">
                  <p className="text-xs text-gray-500 mb-1">Core Messaging</p>
                  <p className="text-sm text-amber-400 font-sans font-semibold">{month.messaging}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Budget Allocation</p>
                  <p className="text-sm text-gray-400">{month.budget}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strategy Points */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />Key Strategy Points
        </h3>
        <ul className="space-y-3 text-sm">
          {[
            { icon: "🎯", text: "<strong class='text-white'>High-Impact Months:</strong> April (Masters), June (Father's Day), November (Black Friday). Allocate 40-50% of budget here." },
            { icon: "📧", text: "<strong class='text-white'>Email Cadence:</strong> 3-4 emails per campaign during seasonal peaks, 2-3x per week regular cadence." },
            { icon: "🏌️", text: "<strong class='text-white'>Content Strategy:</strong> Align with tournament calendar (Masters, US Open, PGA Championship)." },
            { icon: "💰", text: "<strong class='text-white'>Bundle Strategy:</strong> Rotate bundle combos by season." },
            { icon: "📱", text: "<strong class='text-white'>Influencer Tie-ins:</strong> Seed influencers before major events, capture content during peak moments." },
          ].map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="text-amber-400 font-bold">{item.icon}</span>
              <span className="text-gray-400" dangerouslySetInnerHTML={{ __html: item.text }} />
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-sm text-gray-500">
        <p>📄 Full calendar with detailed budgets and metrics available in workspace:<br />
          <code className="text-emerald-400">GOLF-SEASONAL-MARKETING-CALENDAR-2026.md</code>
        </p>
      </div>
    </div>
  );
}
