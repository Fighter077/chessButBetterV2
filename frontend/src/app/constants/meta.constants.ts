import { RouteTree } from "../interfaces/routeTree";

export const meta: RouteTree = {
    title: `chessbutbetter | It's chess, but better`,
    description: `Play chessbutbetter — reimagined chess with 3D graphics, animations, and online gameplay. It's chess, but better.`,
    children: {
        'licenses': {
            title: 'chessbutbetter - Licenses',
            description: 'Licenses for the assets used in this project.'
        },
        'privacy-policy': {
            title: 'chessbutbetter - Privacy Policy',
            description: 'Privacy policy for the chess game. Accepting the privacy policy refers to the collection and use of personal data in accordance with this policy.'
        },
        'play': {
            title: 'chessbutbetter - Play',
            description: 'Play chess with 3D graphics and animations. Play against the computer or a friend.',
        },
        'game': {
            title: 'chessbutbetter - Game',
            description: 'Play chess with 3D graphics and animations. Play against the computer or a friend.',
            children: {
                ':id': {
                    title: 'chessbutbetter - Game :id',
                    description: 'Test the chess game with various scenarios.'
                }
            }
        }
    },
}