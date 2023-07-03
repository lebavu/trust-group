import { create, SetState } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  dopen: boolean;
  updateOpen: (dopen: boolean) => void;
}

const appStore = (set: SetState<AppState>): AppState => ({
  dopen: true,
  updateOpen: (dopen) => set((state: AppState) => ({ ...state, dopen })),
});

const persistedAppStore = persist(appStore, { name: "my_app_store" });
export const useAppStore = create(persistedAppStore);
