export interface Theme {
    name: string; // The name of the theme
    file: string; // The file name of the theme
    isDark?: boolean; // Optional property to indicate if the theme is dark
}

export interface ThemeList {
    light: Theme[]; // Array of light themes
    dark: Theme[]; // Array of dark themes
}

export interface ThemeMinimal {
    "style": "light" | "dark",
    "background": string,
    "text": string,
    "primary": string,
    "secondary": string
}

export interface ThemeMinimalList {
    [key: string]: ThemeMinimal;
}