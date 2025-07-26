// src/app/core/store/app.state.ts
export interface AppState {
  userId: number | null;
  role: 'customer' | 'staff' | 'admin' | null;
  detailId: number | null; // Will hold customerId or staffId
  error: string | null;
  loading: boolean;
}
