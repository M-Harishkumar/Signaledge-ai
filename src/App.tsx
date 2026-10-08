import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Signal,
  Company,
  Watchlist,
  AlertItem,
  RegulatoryTheme,
  Screener,
  SimulationSession,
  ResearchThesis,
  OpportunityItem,
} from './types';
import {
  SEED_COMPANIES,
  SEED_SIGNALS,
  SEED_REGULATORY_THEMES,
  SEED_SCREENERS,
  SEED_SIMULATIONS,
  SEED_WATCHLISTS,
  SEED_ALERTS,
  SEED_THESES,
  SEED_OPPORTUNITIES,
} from './data/seedData';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Modals
import { E2EEVaultModal } from './components/modals/E2EEVaultModal';
import { PreBuyCheckModal } from './components/modals/PreBuyCheckModal';
import { ThesisModal } from './components/modals/ThesisModal';
import { InvestigateModal } from './components/modals/InvestigateModal';
import { ResearchAssistantModal } from './components/assistant/ResearchAssistantModal';

// States & Resilience
import { LoadingState } from './components/states/LoadingState';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import type { AuthMode } from './pages/AuthPages';

// Lazy-Loaded Route Pages
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const AuthPages = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.AuthPages })));
const OnboardingFlow = lazy(() => import('./pages/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const DailyBriefPage = lazy(() => import('./pages/DailyBriefPage').then((m) => ({ default: m.DailyBriefPage })));
const DossierViewPage = lazy(() => import('./pages/DossierViewPage').then((m) => ({ default: m.DossierViewPage })));
const ScreenerPage = lazy(() => import('./pages/ScreenerPage').then((m) => ({ default: m.ScreenerPage })));
const CompanyPage = lazy(() => import('./pages/CompanyPage').then((m) => ({ default: m.CompanyPage })));
const DiscoveryHubPage = lazy(() => import('./pages/DiscoveryHubPage').then((m) => ({ default: m.DiscoveryHubPage })));
const SimulationPage = lazy(() => import('./pages/SimulationPage').then((m) => ({ default: m.SimulationPage })));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage })));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage').then((m) => ({ default: m.WorkspacePage })));
const TrackRecordPage = lazy(() => import('./pages/PlatformPages').then((m) => ({ default: m.TrackRecordPage })));
const SettingsPage = lazy(() => import('./pages/PlatformPages').then((m) => ({ default: m.SettingsPage })));
const SearchResultsPage = lazy(() => import('./pages/PlatformPages').then((m) => ({ default: m.SearchResultsPage })));
const WatchlistsPage = lazy(() => import('./pages/PlatformPages').then((m) => ({ default: m.WatchlistsPage })));
const ExportsPage = lazy(() => import('./pages/PlatformPages').then((m) => ({ default: m.ExportsPage })));

export function App() {
  const { user, isLoading: isAuthLoading, logout, updateProfile, deleteAccount } = useAuth();
  const { showToast } = useToast();

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // App Data State
  const [signals, setSignals] = useState<Signal[]>(SEED_SIGNALS);
  const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
  const [regulatoryThemes, setRegulatoryThemes] = useState<RegulatoryTheme[]>(SEED_REGULATORY_THEMES);
  const [savedScreeners, setSavedScreeners] = useState<Screener[]>(SEED_SCREENERS);
  const [simulations, setSimulations] = useState<SimulationSession[]>(SEED_SIMULATIONS);
  const [watchlists, setWatchlists] = useState<Watchlist[]>(SEED_WATCHLISTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(SEED_ALERTS);
  const [theses, setTheses] = useState<ResearchThesis[]>(SEED_THESES);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(SEED_OPPORTUNITIES);

  // Load server-persisted data on init
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [fetchedTheses, fetchedOpps, fetchedCompanies, fetchedSignals] = await Promise.all([
          api.getTheses().catch(() => SEED_THESES),
          api.getOpportunities().catch(() => SEED_OPPORTUNITIES),
          api.getCompanies().catch(() => SEED_COMPANIES),
          api.getSignals().catch(() => SEED_SIGNALS),
        ]);
        if (isMounted) {
          if (fetchedTheses && fetchedTheses.length > 0) setTheses(fetchedTheses);
          if (fetchedOpps && fetchedOpps.length > 0) setOpportunities(fetchedOpps);
          if (fetchedCompanies && fetchedCompanies.length > 0) setCompanies(fetchedCompanies);
          if (fetchedSignals && fetchedSignals.length > 0) setSignals(fetchedSignals);
        }
      } catch (err) {
        console.warn('Using seeded datasets for initial state.');
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Detail State
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TATAMOTORS');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(SEED_SIGNALS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simulationPresetScenario, setSimulationPresetScenario] = useState<string>('');

  // Security Vault & Modals State
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);
  const [showAssistantModal, setShowAssistantModal] = useState<boolean>(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);
  const [preBuyAuditSymbol, setPreBuyAuditSymbol] = useState<string | null>(null);

  // Investigate & Thesis Global Modals
  const [investigateSymbol, setInvestigateSymbol] = useState<string | null>(null);
  const [thesisModalTarget, setThesisModalTarget] = useState<{ symbol: string; signalId?: string } | null>(null);

  // E2EE Vault unlock simulation
  const handleUnlockVault = async (_passphrase: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 400));
    setIsVaultUnlocked(true);
    showToast('Vault unlocked. Encrypted state loaded.', 'success');
    return true;
  };

  const handleLockVault = () => {
    setIsVaultUnlocked(false);
    showToast('Security vault locked.', 'info');
  };

  // Rating signals handler
  const handleRateSignal = (signalId: string, rating: 'USEFUL' | 'NOT_USEFUL') => {
    setSignals((prev) =>
      prev.map((s) => (s.signal_id === signalId ? { ...s, user_rating: rating } : s))
    );
    api.rateSignal(signalId, rating);
    showToast('Personalization model weights updated.', 'success');
  };

  // Run new simulation session with SSE stream & fallback
  const handleRunNewSimulation = async (
    scenario: string,
    name: string,
    uploadedText?: string,
    onStatus?: (status: { message: string; step?: number }) => void
  ) => {
    const newSim = await api.createSimulationStream(
      scenario,
      30,
      uploadedText,
      'Uploaded Scenario Context',
      name,
      onStatus
    );
    setSimulations((prev) => [newSim, ...prev]);
    return newSim;
  };

  const handleSelectCompany = (symbol: string) => {
    setSelectedSymbol(symbol.toUpperCase());
    navigateTo('/company-detail');
  };

  const handleSelectSignal = (sig: Signal) => {
    setSelectedSignal(sig);
    navigateTo('/dossier-view');
  };

  const handleTriggerSimulation = (scenario: string) => {
    setSimulationPresetScenario(scenario);
    navigateTo('/simulation');
  };

  const handleOpenInvestigate = (symbol: string) => {
    setInvestigateSymbol(symbol.toUpperCase());
  };

  const handleRefreshLiveMarket = async () => {
    try {
      const res = await api.refreshLiveMarket();
      const updatedComps = await api.getCompanies();
      setCompanies(updatedComps);
      showToast(res.message || 'Updated equities with live NSE market feed.', 'success');
    } catch (err: any) {
      showToast('Live market refresh failed.', 'error');
    }
  };

  const handleOpenThesisModal = (symbol?: string, signalId?: string) => {
    setThesisModalTarget({
      symbol: (symbol || selectedSymbol || 'TATAMOTORS').toUpperCase(),
      signalId,
    });
  };

  const handleSaveThesis = async (thesisData: any) => {
    try {
      const created = await api.createThesis(thesisData);
      setTheses((prev) => [created, ...prev]);
      showToast(`Research thesis for ${created.primary_symbol} created.`, 'success');
    } catch (err: any) {
      // Fallback local creation
      const localThesis: ResearchThesis = {
        thesis_id: `th-${Date.now()}`,
        user_id: user?.user_id || 'usr-default',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...thesisData,
      };
      setTheses((prev) => [localThesis, ...prev]);
      showToast(`Research thesis saved locally.`, 'success');
    } finally {
      setThesisModalTarget(null);
    }
  };

  const handleDeleteThesis = async (id: string) => {
    try {
      await api.deleteThesis(id);
    } catch (err) {
      console.warn('Deleted locally:', id);
    }
    setTheses((prev) => prev.filter((t) => t.thesis_id !== id));
    showToast('Thesis deleted from workspace.', 'info');
  };

  const handleUpdateOpportunityStatus = async (id: string, status: OpportunityItem['status']) => {
    try {
      await api.updateOpportunityStatus(id, status);
    } catch (err) {
      console.warn('Updated opportunity status locally');
    }
    setOpportunities((prev) =>
      prev.map((o) => (o.opportunity_id === id ? { ...o, status, updated_at: new Date().toISOString() } : o))
    );
    showToast(`Opportunity status moved to ${status}.`, 'success');
  };

  const handleAddToWatchlist = (symbol: string) => {
    const comp = companies.find((c) => c.nse_symbol === symbol);
    if (!comp) return;

    setWatchlists((prev) => {
      const first = prev[0];
      if (!first) return prev;
      const alreadyIn = first.companies?.some((c) => c.nse_symbol === symbol);
      if (alreadyIn) {
        showToast(`${symbol} is already in your watchlist.`, 'info');
        return prev;
      }
      const updated: Watchlist = {
        ...first,
        companies: [
          ...(first.companies || []),
          {
            company_id: comp.company_id,
            nse_symbol: comp.nse_symbol,
            company_name: comp.company_name,
            sector: comp.sector,
            current_price: comp.current_price,
            price_change_pct: comp.price_change_pct,
            added_at: new Date().toISOString(),
            notes: 'Added from Investigation Workspace',
            research_status: 'INVESTIGATING',
            last_gate_verdict: comp.prebuy_verdict === 'PASS' ? 'Passes screening' : comp.prebuy_verdict === 'INVESTIGATE' ? 'Requires investigation' : 'High-risk screen',
            last_reviewed_at: new Date().toISOString().split('T')[0],
          },
        ],
      };
      showToast(`Added ${symbol} to ${first.name}`, 'success');
      return [updated, ...prev.slice(1)];
    });
  };

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    if (route.startsWith('/companies/')) {
      const sym = route.replace('/companies/', '').split('?')[0].trim().toUpperCase();
      if (sym) {
        setSelectedSymbol(sym);
      }
    }
    if (route.startsWith('/search')) {
      const queryPart = route.split('?q=')[1];
      if (queryPart) {
        setSearchQuery(decodeURIComponent(queryPart.split('&')[0]));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <LoadingState message="Initializing SignalEdge OS security context..." />
      </div>
    );
  }

  // Unauthenticated / Auth views
  if (currentRoute === '/landing') {
    return (
      <ErrorBoundary fallbackMessage="Unable to load landing experience">
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F17] flex items-center justify-center"><LoadingState message="Loading SignalEdge OS..." /></div>}>
          <LandingPage
            onStart={() => {
              setAuthMode('SIGNUP');
              setCurrentRoute('/auth');
            }}
            onLogIn={() => {
              setAuthMode('LOGIN');
              setCurrentRoute('/auth');
            }}
            onViewLiveSignals={() => navigateTo('/brief')}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentRoute === '/auth' || currentRoute === '/login' || currentRoute === '/signup') {
    return (
      <ErrorBoundary fallbackMessage="Unable to load security authentication form">
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F17] flex items-center justify-center"><LoadingState message="Loading security credentials..." /></div>}>
          <AuthPages
            mode={authMode}
            onSuccess={(_email) => {
              showToast('Authenticated successfully. Welcome to SignalEdge OS.', 'success');
              navigateTo('/dashboard');
            }}
            onSwitchMode={(mode) => setAuthMode(mode)}
            onBackToHome={() => navigateTo('/landing')}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentRoute === '/onboarding') {
    return (
      <ErrorBoundary fallbackMessage="Unable to load onboarding flow">
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F17] flex items-center justify-center"><LoadingState message="Configuring investor profile..." /></div>}>
          <OnboardingFlow
            onComplete={async (profileData) => {
              await updateProfile({ ...profileData, onboarding_completed: true });
              showToast('Investor profile setup completed.', 'success');
              navigateTo('/dashboard');
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Active user context (guaranteed user fallback)
  const activeUser = user || {
    user_id: 'usr-default-01',
    email: 'investor@signaledge.in',
    display_name: 'Aravind Kumar',
    role: 'RETAIL_INVESTOR',
    investment_horizon: '7-15YR',
    risk_tolerance: 'MODERATE_AGGRESSIVE',
    portfolio_size_range: '50L-2CR',
    sectors_of_interest: ['Automotive', 'Renewable Energy', 'Defense'],
    primary_goal: 'DISCOVERY',
    onboarding_completed: true,
    created_at: '2026-01-15T09:00:00+05:30',
  };

  const investigatingCompany =
    companies.find((c) => c.nse_symbol === investigateSymbol) || companies[0];

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-[#E5E7EB] antialiased font-sans overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-[#0B0F17] border-r border-[#1F293D] flex flex-col justify-between z-10 animate-slide-in">
            <Sidebar
              currentRoute={currentRoute}
              onNavigate={navigateTo}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          user={activeUser}
          alerts={alerts}
          companies={companies}
          signals={signals}
          isVaultUnlocked={isVaultUnlocked}
          onOpenVault={() => setShowVaultModal(true)}
          onOpenAssistant={() => setShowAssistantModal(true)}
          onSearch={(q) => {
            setSearchQuery(q);
            navigateTo(`/search?q=${encodeURIComponent(q)}`);
          }}
          onNavigate={navigateTo}
          onMarkAllAlertsRead={() => {
            setAlerts(alerts.map((a) => ({ ...a, is_read: true })));
            showToast('All notifications marked as read.', 'info');
          }}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onRefreshLiveMarket={handleRefreshLiveMarket}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary fallbackMessage="An error occurred while loading this workspace page">
            <Suspense fallback={<LoadingState message="Loading module workspace..." />}>
              {currentRoute === '/dashboard' && (
            <DashboardPage
              user={activeUser}
              signals={signals}
              companies={companies}
              watchlists={watchlists}
              alerts={alerts}
              opportunities={opportunities}
              theses={theses}
              onNavigate={navigateTo}
              onRateSignal={handleRateSignal}
              onSelectCompany={handleSelectCompany}
              onSelectSignal={handleSelectSignal}
              onOpenInvestigate={handleOpenInvestigate}
              onOpenNewThesis={() => handleOpenThesisModal()}
            />
          )}

          {currentRoute === '/brief' && (
            <DailyBriefPage
              signals={signals}
              onRateSignal={handleRateSignal}
              onSelectCompany={handleSelectCompany}
              onSelectSignal={handleSelectSignal}
              onInvestigate={handleOpenInvestigate}
              onCreateThesis={(sym) => handleOpenThesisModal(sym)}
            />
          )}

          {currentRoute === '/workspace' && (
            <WorkspacePage
              theses={theses}
              opportunities={opportunities}
              companies={companies}
              signals={signals}
              onOpenNewThesis={() => handleOpenThesisModal()}
              onSelectCompany={handleSelectCompany}
              onRunSimulation={handleTriggerSimulation}
              onOpenGate={(sym) => setPreBuyAuditSymbol(sym)}
              onDeleteThesis={handleDeleteThesis}
              onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
            />
          )}

          {currentRoute === '/screener' && (
            <ScreenerPage
              companies={companies}
              savedScreeners={savedScreeners}
              onSelectCompany={handleSelectCompany}
              onSaveScreener={(scr) => {
                setSavedScreeners([scr, ...savedScreeners]);
                showToast(`Saved screener "${scr.name}".`, 'success');
              }}
              onInvestigate={handleOpenInvestigate}
              onOpenPreBuy={(sym) => setPreBuyAuditSymbol(sym)}
            />
          )}

          {(currentRoute === '/companies' || currentRoute === '/company-detail' || currentRoute.startsWith('/companies/')) && (
            <CompanyPage
              symbol={
                currentRoute.startsWith('/companies/') && currentRoute.replace('/companies/', '').split('?')[0].trim()
                  ? currentRoute.replace('/companies/', '').split('?')[0].trim().toUpperCase()
                  : selectedSymbol
              }
              companies={companies}
              onBack={() => navigateTo('/companies')}
              onSelectPeer={handleSelectCompany}
              onRunSimulation={handleTriggerSimulation}
              onOpenPreBuy={(sym) => setPreBuyAuditSymbol(sym)}
              onInvestigate={handleOpenInvestigate}
              onCreateThesis={(sym) => handleOpenThesisModal(sym)}
            />
          )}

          {currentRoute === '/watchlists' && (
            <WatchlistsPage
              companies={companies}
              watchlists={watchlists}
              onSelectCompany={handleSelectCompany}
              onUpdateWatchlists={(lists) => setWatchlists(lists)}
              onInvestigate={handleOpenInvestigate}
              onCreateThesis={(sym) => handleOpenThesisModal(sym)}
            />
          )}

          {currentRoute === '/exports' && <ExportsPage />}

          {currentRoute === '/dossier-view' && selectedSignal && (
            <DossierViewPage
              signal={selectedSignal}
              onBack={() => navigateTo('/brief')}
              onSelectCompany={handleSelectCompany}
              onRunSimulation={handleTriggerSimulation}
              onRunPreBuy={(sym) => setPreBuyAuditSymbol(sym)}
            />
          )}

          {/* Discovery Views F1 - F7 */}
          {[
            '/discovery',
            '/regulatory',
            '/strategy-dna',
            '/institutional',
            '/macro-simulator',
            '/supply-chain',
            '/constraint-cast',
            '/forensic-quality',
            '/cross-asset',
            '/research-bridge',
          ].includes(currentRoute) && (
            <DiscoveryHubPage
              activeView={currentRoute.replace('/', '')}
              signals={signals}
              regulatoryThemes={regulatoryThemes}
              onSelectCompany={handleSelectCompany}
              onSelectSignal={handleSelectSignal}
              onRunSimulation={handleTriggerSimulation}
              onInvestigate={handleOpenInvestigate}
              onRunPreBuy={(sym) => setPreBuyAuditSymbol(sym)}
            />
          )}

          {currentRoute === '/simulation' && (
            <SimulationPage
              sessions={simulations}
              initialScenario={simulationPresetScenario}
              onRunNewSimulation={handleRunNewSimulation}
              onSelectCompany={handleSelectCompany}
              onInvestigate={handleOpenInvestigate}
            />
          )}

          {currentRoute === '/analysis' && (
            <SimulationPage
              sessions={simulations}
              initialScenario={simulationPresetScenario}
              initialTab="CASCADE"
              onRunNewSimulation={handleRunNewSimulation}
              onSelectCompany={handleSelectCompany}
              onInvestigate={handleOpenInvestigate}
            />
          )}

          {currentRoute === '/track-record' && (
            <CompanyPage
              symbol={selectedSymbol}
              initialTab="HISTORICAL_TRACK_RECORD"
              companies={companies}
              onBack={() => navigateTo('/companies')}
              onSelectPeer={handleSelectCompany}
              onRunSimulation={handleTriggerSimulation}
              onOpenPreBuy={(sym) => setPreBuyAuditSymbol(sym)}
              onInvestigate={handleOpenInvestigate}
              onCreateThesis={(sym) => handleOpenThesisModal(sym)}
              onSelectSignal={handleSelectSignal}
            />
          )}

          {(currentRoute === '/settings' || currentRoute === '/profile') && (
            <SettingsPage
              user={activeUser}
              onUpdateUser={updateProfile}
              onLogout={async () => {
                await logout();
                showToast('Signed out successfully.', 'info');
                navigateTo('/landing');
              }}
              onDeleteAccount={async () => {
                await deleteAccount();
                showToast('Your account was deleted.', 'info');
                navigateTo('/landing');
              }}
            />
          )}

          {currentRoute.startsWith('/search') && (
            <SearchResultsPage
              query={
                searchQuery ||
                (currentRoute.includes('?q=')
                  ? decodeURIComponent(currentRoute.split('?q=')[1].split('&')[0])
                  : '')
              }
              companies={companies}
              signals={signals}
              onSelectCompany={handleSelectCompany}
              onSelectSignal={handleSelectSignal}
              onInvestigate={handleOpenInvestigate}
              onSearchChange={(q) => {
                setSearchQuery(q);
                navigateTo(`/search?q=${encodeURIComponent(q)}`);
              }}
            />
          )}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {/* E2EE Security Vault Modal */}
      {showVaultModal && (
        <E2EEVaultModal
          isUnlocked={isVaultUnlocked}
          onUnlockVault={handleUnlockVault}
          onLockVault={handleLockVault}
          onClose={() => setShowVaultModal(false)}
        />
      )}


      {/* 8-Layer Pre-Buy Fundamental Check Modal */}
      {preBuyAuditSymbol && (
        <PreBuyCheckModal
          symbol={preBuyAuditSymbol}
          onClose={() => setPreBuyAuditSymbol(null)}
        />
      )}

      {/* Universal Investigation Workspace Modal */}
      {investigateSymbol && (
        <InvestigateModal
          isOpen={true}
          onClose={() => setInvestigateSymbol(null)}
          company={investigatingCompany}
          signals={signals}
          onOpenGate={(sym) => {
            setInvestigateSymbol(null);
            setPreBuyAuditSymbol(sym);
          }}
          onRunSimulation={(scenario) => {
            setInvestigateSymbol(null);
            handleTriggerSimulation(scenario);
          }}
          onCreateThesis={(sym) => {
            setInvestigateSymbol(null);
            handleOpenThesisModal(sym);
          }}
          onAddToWatchlist={(sym) => handleAddToWatchlist(sym)}
        />
      )}

      {/* Universal Research Thesis Modal */}
      {thesisModalTarget && (
        <ThesisModal
          isOpen={true}
          onClose={() => setThesisModalTarget(null)}
          onSave={handleSaveThesis}
          initialCompany={thesisModalTarget.symbol}
          initialSignalId={thesisModalTarget.signalId}
          companies={companies}
          signals={signals}
        />
      )}

      {/* AI Research Assistant Modal (Tool Grounded) */}
      <ResearchAssistantModal
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        activeSymbol={selectedSymbol}
        onSelectCompany={handleSelectCompany}
        onOpenGate={(sym) => setPreBuyAuditSymbol(sym)}
      />
    </div>
  );
}

export default App;
