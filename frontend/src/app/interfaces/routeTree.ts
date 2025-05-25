export interface RouteTree {
    title: string;
    interpolation?: {
        [toInterpolate: string]: string;
    };
    description: string;
    children?: {
        [key: string]: RouteTree;
    }
}