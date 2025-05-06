import { Theme, ThemeList } from "../interfaces/theme";

export const availableThemes: ThemeList = (
    {
        'light': [
            { name: 'Azure Blue', file: 'azure-blue.css' },
            { name: 'Rose Red', file: 'rose-red.css' }
        ],
        'dark': [
            { name: 'Cyan Orange', file: 'cyan-orange.css' },
            { name: 'Magenta Violet', file: 'magenta-violet.css' }
        ]
    }
)

export const theme = {
    "palette": {
        "warning": "#ff9800",
        "error": "#f44336",
        "success": "#4caf50",
    }
}