import { AppState } from './app.state';
import { createReducer, on } from '@ngrx/store';
import { LoginFailure, logout, setUser } from './app.action';
export const initialAppState: AppState = {
  userId: null,
  role: null,
  detailId: null,
  error: null,
  loading: false,
};
export const appReducer = createReducer(
  initialAppState,
  on(setUser, (state, { userId, role, detailId, loading }) => ({
    ...state,
    userId,
    role,
    detailId,
    loading,
  })),
  on(LoginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(logout, () => ({
    userId: null,
    role: null,
    detailId: null,
    error: null,
    loading: false,
  }))
);
