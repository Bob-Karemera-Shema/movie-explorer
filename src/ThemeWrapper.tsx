import React from "react";
import { useAppSelector } from "./store/hooks";
import { selectTheme } from "./store/themeSlice";

const ThemeWrapper = ({ children }: { children: React.ReactNode}) => {
    const mode = useAppSelector(selectTheme);

    return (
        <div data-theme={mode} id="theme-root">
            {children}
        </div>
    )
}

export default ThemeWrapper;