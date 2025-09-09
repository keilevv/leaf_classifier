import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

const initialState = {
  // User
  user: null,

  // UI State
  uiState: {
    selectedPage: "home",
    login: {
      comesFrom: {
        pathname: "/",
        search: "",
        key: "",
      },
    },
  },

  accessToken: null,
};

const useStore = create(
  devtools(
    persist((set) => ({
      ...initialState,

      // Reset function
      resetStore: () => set({ ...initialState }),

      // User
      setUser: (userState) =>
        set({ user: userState.user, accessToken: userState.accessToken }),

      // UI State
      setUiState: (newUiState) =>
        set((state) => ({
          uiState: { ...state.uiState, ...newUiState },
        })),
      setSelectedPage: (newPage) =>
        set((state) => ({
          uiState: { ...state.uiState, selectedPage: newPage },
        })),
    })),

    {
      name: "leaf-classifier-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useStore;
