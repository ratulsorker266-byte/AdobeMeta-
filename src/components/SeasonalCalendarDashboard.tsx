import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, Clock, Flame, Sparkles, TrendingUp, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { SeasonalDeadline } from '../types';

interface SeasonalCalendarDashboardProps {
  onBack: () => void;
  onExploreTrends: (searchQuery: string) => void;
  onOpenPromptStudioWithIdea: (idea: string) => void;
}

const SEASONAL_EVENTS: SeasonalDeadline[] = [
  {
    id: 'halloween',
    title: 'Halloween & Spooky Fall Festivities',
    eventDate: 'October 31, 2026',
    submissionWindow: 'Final Days (Index Window Closing)',
    daysRemaining: 12,
    urgency: 'critical',
    season: 'Autumn',
    topNiches: [
      'Minimalist cute pumpkin carving flat lays',
      'Realistic spooky outdoor suburban house decor',
      'Diverse family in creative homemade costumes',
      'Artisanal Halloween candy & cocktail recipe styling'
    ],
    buyerDemandNotes: 'Buyers are finalizing campaigns. Focus on fast turnaround, clean commercial backgrounds, and easy-to-use banners.',
    searchKeyword: 'October'
  },
  {
    id: 'black_friday',
    title: 'Black Friday & Cyber Monday E-Commerce',
    eventDate: 'November 27, 2026',
    submissionWindow: 'Peak Upload Window (Next 25 Days)',
    daysRemaining: 25,
    urgency: 'critical',
    season: 'Holiday Q4',
    topNiches: [
      'Mobile smartphone shopping in cozy setting',
      'Warehouse logistics workers sorting package boxes',
      'Modern credit card tap payment close-up',
      'Sale tag concepts with negative space for text overlays'
    ],
    buyerDemandNotes: 'Heavy demand from digital marketers, retail blogs, and e-commerce apps for high-contrast discount concepts.',
    searchKeyword: 'November'
  },
  {
    id: 'christmas',
    title: 'Christmas, Hanukkah & Winter Holidays',
    eventDate: 'December 25, 2026',
    submissionWindow: 'Prime Golden Window (Upload NOW)',
    daysRemaining: 38,
    urgency: 'critical',
    season: 'Winter Q4',
    topNiches: [
      'Multi-ethnic family sharing festive dinner table',
      'Modern sustainable kraft paper gift wrapping',
      'Corporate holiday office party celebration',
      'Cozy fireplace winter cabin interior with warm lights'
    ],
    buyerDemandNotes: 'The highest grossing microstock season of the entire year! Submit 60-90 days prior for search index dominance.',
    searchKeyword: 'December'
  },
  {
    id: 'new_year',
    title: 'New Year 2027 Goals, Fitness & Fiscal Planning',
    eventDate: 'January 1, 2027',
    submissionWindow: 'Optimal Submission Period (45 Days Remaining)',
    daysRemaining: 45,
    urgency: 'moderate',
    season: 'New Year Q1',
    topNiches: [
      'Healthy meal prep containers with fresh vegetables',
      'Running shoes and fitness tracker smartwatch at sunrise',
      'Corporate team planning 2027 fiscal strategy on glass board',
      'Clean modern calendar notebook with goal checklists'
    ],
    buyerDemandNotes: 'Advertising agencies and corporate publishers begin downloading New Year resolution imagery in early November.',
    searchKeyword: 'January'
  },
  {
    id: 'valentines',
    title: "Valentine's Day & Modern Romance",
    eventDate: 'February 14, 2027',
    submissionWindow: 'Early Production & Submission Window',
    daysRemaining: 75,
    urgency: 'upcoming',
    season: 'Spring Q1',
    topNiches: [
      'Authentic candid couples cooking romantic meal at home',
      'Minimalist red and pastel rose bouquets with copy space',
      'Fine jewelry gift unboxing close-up',
      'Galentine and friendship celebration brunch'
    ],
    buyerDemandNotes: 'Demand is shifting away from cheesy studio portraits toward authentic, cinematic lifestyle moments.',
    searchKeyword: 'February'
  },
  {
    id: 'spring',
    title: 'Spring Awakening, Easter & Home Renewal',
    eventDate: 'April 2027',
    submissionWindow: 'Advance Planning & Production',
    daysRemaining: 120,
    urgency: 'upcoming',
    season: 'Spring Q2',
    topNiches: [
      'Home spring cleaning and decluttering modern interior',
      'Gardening, planting herbs in sunny backyard garden',
      'Pastel Easter baking and table setting',
      'Outdoor active lifestyle in blooming cherry trees'
    ],
    buyerDemandNotes: 'Early corporate catalogs and travel magazines scout spring visuals 4-5 months ahead.',
    searchKeyword: 'March'
  }
];

export const SeasonalCalendarDashboard: React.FC<SeasonalCalendarDashboardProps> = ({
  onBack,
  onExploreTrends,
  onOpenPromptStudioWithIdea
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition"
            title="Back to Studio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-400" />
              Seasonal Stock Submission Calendar & Deadline Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Commercial stock buyers purchase 60-90 days before holidays. Submit on time to rank #1 in search results.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Strategy Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">The 60-Day Microstock Rule</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Adobe Stock & Shutterstock algorithms require 2 to 3 weeks to index new submissions and build search authority.
              Always submit seasonal photos and vectors <strong>60 to 90 days before</strong> the holiday begins!
            </p>
          </div>
        </div>
      </div>

      {/* Event Cards Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SEASONAL_EVENTS.map((event) => {
          const isCritical = event.urgency === 'critical';
          const isModerate = event.urgency === 'moderate';

          return (
            <div
              key={event.id}
              className={`bg-slate-950/80 backdrop-blur-xl border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all hover:border-slate-600 shadow-xl ${
                isCritical
                  ? 'border-rose-500/30 shadow-rose-950/20'
                  : isModerate
                  ? 'border-amber-500/30 shadow-amber-950/20'
                  : 'border-slate-800 shadow-slate-950/20'
              }`}
            >
              <div className="space-y-3">
                {/* Event header & badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      {event.season} Event • {event.eventDate}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{event.title}</h3>
                  </div>

                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isModerate
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isCritical && <Flame className="w-3 h-3 text-rose-400" />}
                    {event.daysRemaining} Days Window
                  </span>
                </div>

                {/* Window notice */}
                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Submission Status:</span>
                  <span
                    className={`font-bold ${
                      isCritical ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {event.submissionWindow}
                  </span>
                </div>

                {/* Buyer Demand Notes */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                  {event.buyerDemandNotes}
                </p>

                {/* Top Niches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> High-Demand Buyer Niches:
                  </span>
                  <ul className="space-y-1">
                    {event.topNiches.map((niche, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{niche}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenPromptStudioWithIdea(event.topNiches[0])}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generate Prompts</span>
                </button>

                <button
                  onClick={() => onExploreTrends(event.searchKeyword)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore Trends</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
