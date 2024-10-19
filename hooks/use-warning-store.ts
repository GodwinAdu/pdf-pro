// store/useWarningStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const ONE_DAY_IN_MS = 12 * 60 * 60 * 1000;

interface WarningState {
    warningClosed: boolean;
    setWarningClosed: () => void;
    resetWarning: () => void;
}

export const useWarningStore = create<WarningState>()(
    persist(
        (set) => ({
            warningClosed: false,
            setWarningClosed: () => {
                set({ warningClosed: true });
                localStorage.setItem('warningClosedAt', Date.now().toString()); // Store close time
            },
            resetWarning: () => set({ warningClosed: false }),
        }),
        {
            name: 'warning-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage), // Use createJSONStorage with localStorage
        }
    )
);

// Utility to reset warning after 24 hours
export const checkAndResetWarning = () => {
    const warningClosedAt = localStorage.getItem('warningClosedAt');
    if (warningClosedAt) {
        const timeElapsed = Date.now() - parseInt(warningClosedAt, 10);
        if (timeElapsed >= ONE_DAY_IN_MS) {
            localStorage.removeItem('warningClosedAt');
            useWarningStore.getState().resetWarning();
        }
    }
};
