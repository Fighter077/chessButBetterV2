export interface RouteTree {
    title: string;
    description: string;
    children?: {
        [key: string]: RouteTree;
    }
}