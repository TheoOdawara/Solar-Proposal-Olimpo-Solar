/* eslint-disable react-refresh/only-export-components */
/**
 * Context global da aplicação
 * Centraliza estado compartilhado e reduz prop drilling
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { ProposalData } from '@/types/proposal';

interface AppState {
  // Estados da aplicação
  currentProposal: ProposalData | null;
  networkStatus: {
    isOnline: boolean;
    lastOnline: Date | null;
  };
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    loadingStates: Record<string, boolean>;
  };
  cache: {
    proposals: ProposalData[];
    lastFetch: Date | null;
  };
}

type AppAction =
  | { type: 'SET_CURRENT_PROPOSAL'; payload: ProposalData | null }
  | { type: 'SET_NETWORK_STATUS'; payload: { isOnline: boolean; lastOnline?: Date } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'CACHE_PROPOSALS'; payload: { proposals: ProposalData[]; timestamp: Date } }
  | { type: 'CLEAR_CACHE' };

const initialState: AppState = {
  currentProposal: null,
  networkStatus: {
    isOnline: navigator.onLine,
    lastOnline: navigator.onLine ? new Date() : null,
  },
  ui: {
    sidebarOpen: false,
    theme: 'system',
    loadingStates: {},
  },
  cache: {
    proposals: [],
    lastFetch: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_PROPOSAL':
      return {
        ...state,
        currentProposal: action.payload,
      };

    case 'SET_NETWORK_STATUS':
      return {
        ...state,
        networkStatus: {
          isOnline: action.payload.isOnline,
          lastOnline: action.payload.lastOnline || state.networkStatus.lastOnline,
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loadingStates: {
            ...state.ui.loadingStates,
            [action.payload.key]: action.payload.loading,
          },
        },
      };

    case 'CACHE_PROPOSALS':
      return {
        ...state,
        cache: {
          proposals: action.payload.proposals,
          lastFetch: action.payload.timestamp,
        },
      };

    case 'CLEAR_CACHE':
      return {
        ...state,
        cache: {
          proposals: [],
          lastFetch: null,
        },
      };

    default:
      return state;
  }
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setCurrentProposal: (proposal: ProposalData | null) => void;
  setLoading: (key: string, loading: boolean) => void;
  toggleSidebar: () => void;
  setNetworkStatus: (isOnline: boolean) => void;
  cacheProposals: (proposals: ProposalData[]) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions para facilitar o uso
  const setCurrentProposal = (proposal: ProposalData | null) => {
    dispatch({ type: 'SET_CURRENT_PROPOSAL', payload: proposal });
  };

  const setLoading = (key: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, loading } });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setNetworkStatus = (isOnline: boolean) => {
    dispatch({
      type: 'SET_NETWORK_STATUS',
      payload: { isOnline, lastOnline: isOnline ? new Date() : undefined },
    });
  };

  const cacheProposals = (proposals: ProposalData[]) => {
    dispatch({
      type: 'CACHE_PROPOSALS',
      payload: { proposals, timestamp: new Date() },
    });
  };

  const value: AppContextValue = {
    state,
    dispatch,
    setCurrentProposal,
    setLoading,
    toggleSidebar,
    setNetworkStatus,
    cacheProposals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
