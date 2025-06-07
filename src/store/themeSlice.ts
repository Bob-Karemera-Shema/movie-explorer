import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface ThemeState {
    mode: "light" | "dark";
}

const initialState: ThemeState = {
    mode: "light"
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme(state) {
            const newMode = state.mode === 'light' ? 'dark' : 'light';
            state.mode = newMode;
        }
    }
});

// Export action creator
export const { toggleTheme } = themeSlice.actions;

// Export theme reducer
export default themeSlice.reducer;

// Export theme selector
export const selectTheme = (state: RootState) => state.theme.mode;