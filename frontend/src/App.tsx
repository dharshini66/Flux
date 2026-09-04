import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider, useMarket } from './context/MarketContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { MissionProvider } from './context/MissionContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { EditorialHero } from './components/hero/EditorialHero';
import { MarketPulseTimeline } from './components/pulse/MarketPulseTimeline';
import { RightRail } from './components/layout/RightRail';
import { TopChangeCard } from './components/cards/TopChangeCard';
import { WatchlistTable } from './components/watchlist/WatchlistTable';
import { WatchlistTabs } from './components/watchlist/WatchlistTabs';
import { AddStockModal } from './components/watchlist/AddStockModal';
import { ManageWatchlistsModal } from './components/watchlist/ManageWatchlistsModal';
import { StockDetailModal } from './components/stock/StockDetailModal';
import { ExplainDrawer } from './components/cards/ExplainDrawer';
import { ChangesFeedView } from './components/changes/ChangesFeedView';
import { MarketMissionWidget } from './components/missions/MarketMissionWidget';
import { EngineSpecsView } from './components/engine/EngineSpecsView';
import { DemoScenarioBar } from './components/demo/DemoScenarioBar';
import { StaleDataBanner } from './components/common/StaleDataBanner';
import { EmptyState } from './components/common/EmptyState';
import { Activity, Layers, ArrowRight } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);
  const [isManageWatchlistsOpen, setIsManageWatchlistsOpen] = useState<boolean>(false);
  const { summary } = useMarket();

  const topChanges = summary?.top_changes || [];
  const isFirstVisit = summary?.is_first_visit || false;

  return (
    <div className="min-h-screen bg-ivory-200 flex flex-col justify-between">
      <div>
        <Header />

        <div className="max-w-[1600px] w-full mx-auto flex flex-1">
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6 min-w-0">
            {/* Stale Data Warning Banner if Active */}
            <StaleDataBanner />

            {/* TAB 1: OVERVIEW (Since Last Visit Center) */}
            {activeTab === 'overview' && (
              <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Main Center Column */}
                <div className="flex-1 min-w-0 space-y-6 w-full">
                  {/* Visual Center Hero */}
                  <EditorialHero />

                  {/* Market Pulse Timeline */}
                  <MarketPulseTimeline />

                  {/* Top Changes Since Last Visit */}
                  {!isFirstVisit && topChanges.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-widest block">
                            SIGNIFICANT MOVES
                          </span>
                          <h2 className="editorial-headline text-2xl font-bold text-ink-900">
                            Top Changes Since Your Last Visit
                          </h2>
                        </div>

                        <button
                          onClick={() => setActiveTab('changes')}
                          className="inline-flex items-center gap-1 text-xs financial-mono font-bold text-cobalt-500 hover:text-cobalt-700 uppercase"
                        >
                          <span>View All Signals</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {topChanges.map((change) => (
                          <TopChangeCard key={change.symbol} change={change} />
                        ))}
                      </div>
                    </div>
                  )}

                  {!isFirstVisit && topChanges.length === 0 && (
                    <EmptyState type="NO_FLUX" />
                  )}

                  {/* Watchlist Section */}
                  <div className="pt-4 border-t border-ivory-300">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-widest block">
                          MONITORED EQUITIES
                        </span>
                        <h2 className="editorial-headline text-2xl font-bold text-ink-900">
                          Your Watchlist
                        </h2>
                      </div>
                    </div>

                    <WatchlistTabs
                      onAddStockClick={() => setIsAddStockOpen(true)}
                      onManageWatchlistsClick={() => setIsManageWatchlistsOpen(true)}
                    />

                    <WatchlistTable onAddStockClick={() => setIsAddStockOpen(true)} />
                  </div>
                </div>

                {/* Right Information Rail */}
                <RightRail />
              </div>
            )}

            {/* TAB 2: WATCHLIST MANAGER */}
            {activeTab === 'watchlist' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-ivory-300">
                  <span className="text-[10px] financial-mono font-bold text-cobalt-500 uppercase tracking-widest block">
                    PORTFOLIO MANAGEMENT
                  </span>
                  <h2 className="editorial-headline text-3xl font-bold text-ink-900">
                    Watchlist Intelligence
                  </h2>
                </div>

                <WatchlistTabs
                  onAddStockClick={() => setIsAddStockOpen(true)}
                  onManageWatchlistsClick={() => setIsManageWatchlistsOpen(true)}
                />

                <WatchlistTable onAddStockClick={() => setIsAddStockOpen(true)} />
              </div>
            )}

            {/* TAB 3: CHANGES FEED */}
            {activeTab === 'changes' && <ChangesFeedView />}

            {/* TAB 4: MARKET MISSION */}
            {activeTab === 'missions' && <MarketMissionWidget />}

            {/* TAB 5: ENGINE SPECS */}
            {activeTab === 'engine' && <EngineSpecsView />}
          </main>
        </div>
      </div>

      {/* Evaluator Bottom Floating Toolbar */}
      <DemoScenarioBar />

      {/* Global Modals & Drawers */}
      <AddStockModal isOpen={isAddStockOpen} onClose={() => setIsAddStockOpen(false)} />
      <ManageWatchlistsModal
        isOpen={isManageWatchlistsOpen}
        onClose={() => setIsManageWatchlistsOpen(false)}
      />
      <StockDetailModal />
      <ExplainDrawer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <WatchlistProvider>
          <MissionProvider>
            <MainDashboard />
          </MissionProvider>
        </WatchlistProvider>
      </MarketProvider>
    </AuthProvider>
  );
}

export default App;
