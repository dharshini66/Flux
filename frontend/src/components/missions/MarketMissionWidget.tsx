import React from 'react';
import { useMission } from '../../context/MissionContext';
import { useMarket } from '../../context/MarketContext';
import { Award, CheckCircle, Sparkles, TrendingUp, BarChart2, ShieldCheck, Trophy } from 'lucide-react';

export const MarketMissionWidget: React.FC = () => {
  const { missionState, claimReward } = useMission();
  const { setSelectedStockSymbol, setSelectedExplainChange, summary } = useMarket();

  if (!missionState) return null;

  return (
    <div className="space-y-6">
      {/* Header & Rank Summary */}
      <div className="bg-ivory-100 border border-editorial-dark rounded-md p-6 shadow-retro relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] financial-mono font-bold text-retropink-500 uppercase tracking-widest">
                EXPLORATION & COMPREHENSION LAYER
              </span>
              <span className="text-[9px] financial-mono bg-signal-ochre text-white px-1.5 py-0.2 rounded font-bold uppercase">
                NO TRADING GAMIFICATION
              </span>
            </div>
            <h2 className="editorial-headline text-3xl font-bold text-ink-900 mt-1">
              Market Mission
            </h2>
            <p className="text-xs text-ink-600 mt-1 max-w-xl">
              FLUX rewards analytical rigor and signal discovery. Complete daily analytical quests to level up your
              investigation rank. Never rewarding trade execution or transaction churn.
            </p>
          </div>

          {/* XP & Level Badge */}
          <div className="bg-ivory-200 border border-ink-900 rounded-sm p-4 text-center min-w-[180px] shadow-[2px_2px_0px_#121212]">
            <span className="text-[10px] financial-mono font-bold text-ink-500 uppercase block">
              CURRENT RANK
            </span>
            <span className="text-sm font-extrabold text-ink-900 block mt-0.5">
              {missionState.rank_title}
            </span>
            <div className="flex items-center justify-center gap-1 my-2">
              <Trophy className="w-4 h-4 text-signal-ochre" />
              <span className="text-xl font-extrabold financial-mono text-cobalt-500">
                {missionState.total_xp} XP
              </span>
            </div>
            {/* Level Progress Bar */}
            <div className="w-full bg-ivory-300 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-cobalt-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${missionState.level_progress_pct}%` }}
              ></div>
            </div>
            <span className="text-[9px] financial-mono text-ink-400 block mt-1">
              Level {missionState.level} · {missionState.level_progress_pct}% to Level {missionState.level + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Quests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missionState.missions.map((m) => (
          <div
            key={m.id}
            className={`retro-card p-5 flex flex-col justify-between ${
              m.is_completed ? 'border-signal-green/40 bg-green-50/20' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-wider">
                  QUEST // {m.category}
                </span>
                <span className="text-xs financial-mono font-extrabold text-retropink-500">
                  +{m.xp_reward} XP
                </span>
              </div>

              <h4 className="text-sm font-bold text-ink-900">{m.title}</h4>
              <p className="text-xs text-ink-600 mt-1 leading-snug">{m.objective}</p>
            </div>

            <div className="pt-4 border-t border-ivory-300 flex items-center justify-between mt-3">
              {m.is_completed ? (
                <span className="inline-flex items-center gap-1 text-xs financial-mono font-bold text-signal-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </span>
              ) : (
                <button
                  onClick={() => claimReward(m.id, m.xp_reward)}
                  className="px-3 py-1 bg-cobalt-500 hover:bg-cobalt-600 text-white text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212] transition-all"
                >
                  Inspect & Claim +{m.xp_reward} XP
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Retro Badges Grid */}
      <div className="bg-ivory-100 border border-editorial rounded-md p-6">
        <h3 className="editorial-headline text-2xl font-bold text-ink-900 mb-1">
          Intelligence Badges
        </h3>
        <p className="text-xs text-ink-600 mb-4">
          Unlocked through pattern recognition and cross-session baseline analysis.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {missionState.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-sm border text-center transition-all ${
                b.unlocked
                  ? 'bg-ivory-200 border-editorial-dark shadow-retro-sm'
                  : 'bg-ivory-50 border-ivory-300 opacity-60'
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-2 bg-ink-900 text-white rounded flex items-center justify-center text-sm font-extrabold financial-mono shadow-[2px_2px_0px_#1746D1]">
                {b.icon_code}
              </div>
              <span className="text-xs font-bold financial-mono text-ink-900 block truncate">
                {b.name}
              </span>
              <p className="text-[10px] text-ink-600 mt-1 leading-snug">{b.description}</p>
              <span
                className={`inline-block text-[9px] financial-mono font-bold uppercase px-1.5 py-0.2 rounded mt-2 ${
                  b.unlocked
                    ? 'bg-signal-green text-white'
                    : 'bg-ivory-300 text-ink-500'
                }`}
              >
                {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
