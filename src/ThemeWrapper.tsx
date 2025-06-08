import React from "react";
import { useAppSelector } from "./store/hooks";
import { selectTheme } from "./store/themeSlice";

const ThemeWrapper = ({ children }: { children: React.ReactNode}) => {
    const mode = useAppSelector(selectTheme);

    return (
        <div data-theme={mode} data-testid="theme-root" id="theme-root">
            {children}
        </div>
    )
}

export default ThemeWrapper;