import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, Clock, Flame, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { SeasonalDeadline } from '../types';

interface SeasonalCalendarDashboardProps {
  onBack: () => void;
  onExploreTrends: (searchQuery: string) => void;
  onOpenPromptStudioWithIdea: (idea: string) => void;
  themeMode?: 'light' | 'dark';
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
  onOpenPromptStudioWithIdea,
  themeMode = 'light'
}) => {
  const isLight = themeMode === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border p-5 sm:p-6 rounded-2xl transition-colors ${
        isLight
          ? 'bg-white border-neutral-200/90 text-neutral-900 shadow-2xs'
          : 'bg-[#111318] border-neutral-800 text-white shadow-xl'
      }`}>
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
            title="Back to All Stores"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              02 . STORE · SEASONAL DEMAND RADAR
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2 mt-0.5">
              <CalendarDays className="w-5 h-5 text-amber-500" />
              <span>Seasonal Stock Submission Calendar</span>
            </h1>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Commercial stock buyers purchase 60–90 days before holidays. Submit on time to rank #1 in search results.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Strategy Banner */}
      <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLight
          ? 'bg-[#fbfaf8] border-neutral-200/90 text-neutral-900'
          : 'bg-[#0e1015] border-neutral-800 text-white'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isLight ? 'bg-white border-neutral-200 text-amber-600' : 'bg-neutral-900 border-neutral-800 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold">The 60-Day Microstock Lead-Time Rule</h4>
            <p className={`text-xs mt-0.5 max-w-3xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Adobe Stock &amp; Shutterstock algorithms require 2 to 3 weeks to index new submissions and build search authority.
              Always submit seasonal photos and vectors <strong>60 to 90 days before</strong> the holiday begins.
            </p>
          </div>
        </div>
      </div>

      {/* Event Cards Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SEASONAL_EVENTS.map((event) => {
          const isCritical = event.urgency === 'critical';
          const isModerate = event.urgency === 'moderate';

          return (
            <div
              key={event.id}
              className={`border rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white border-neutral-200/90 hover:border-neutral-900 shadow-2xs'
                  : 'bg-[#111318] border-neutral-800 hover:border-neutral-600 shadow-xl'
              }`}
            >
              <div className="space-y-3.5">
                {/* Event header & unboxed status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400">
                      {event.season} · {event.eventDate}
                    </div>
                    <h3 className={`text-base font-bold tracking-tight mt-0.5 ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                      {event.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 ${
                      isCritical
                        ? (isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/15 text-rose-300 border-rose-500/30')
                        : isModerate
                        ? (isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-500/15 text-amber-300 border-amber-500/30')
                        : (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30')
                    }`}
                  >
                    {isCritical && <Flame className="w-3 h-3" />}
                    <span>{event.daysRemaining}d Window</span>
                  </span>
                </div>

                {/* Window notice */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-[#fbfaf8] border-neutral-200/70' : 'bg-neutral-900/90 border-neutral-800'
                }`}>
                  <span className="text-neutral-500 font-medium">Submission Window:</span>
                  <span
                    className={`font-bold ${
                      isCritical
                        ? 'text-rose-600 dark:text-rose-400'
                        : isModerate
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {event.submissionWindow}
                  </span>
                </div>

                {/* Buyer Demand Notes */}
                <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  {event.buyerDemandNotes}
                </p>

                {/* Top Niches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-neutral-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>High-Demand Buyer Niches</span>
                  </span>
                  <ul className="space-y-1.5 pt-1">
                    {event.topNiches.map((niche, i) => (
                      <li key={i} className={`text-xs flex items-center gap-2 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{niche}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`grid grid-cols-2 gap-2.5 pt-4 border-t ${
                isLight ? 'border-neutral-100' : 'border-neutral-800/80'
              }`}>
                <button
                  onClick={() => onOpenPromptStudioWithIdea(event.topNiches[0])}
                  className={`text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-neutral-950 hover:bg-black text-white'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generate Prompts</span>
                </button>

                <button
                  onClick={() => onExploreTrends(event.searchKeyword)}
                  className={`text-xs font-semibold py-2.5 px-3 rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-[#fbfaf8] hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Explore {event.searchKeyword}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
