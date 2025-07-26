// src/app/core/store/app.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectUserId = createSelector(
  selectAppState,
  (state) => state.userId
);

export const selectRole = createSelector(
  selectAppState,
  (state) => state.role
);

export const selectDetailId = createSelector(
  selectAppState,
  (state) => state.detailId
);
