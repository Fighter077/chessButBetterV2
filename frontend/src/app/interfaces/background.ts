export type BackgroundList = BackgroundOption[];

export interface BackgroundOption {
    name: string; // The name of the background option
    path: string; // The image URL for the background option
    path_low_res: string; // The low-resolution image URL for the background option
    loaded?: boolean; // Optional flag to indicate if the background has been loaded
    initial?: boolean; // Optional flag to indicate if this is the initial background
}