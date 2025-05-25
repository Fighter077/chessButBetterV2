import { RouteTree } from "../interfaces/routeTree";

export const meta: RouteTree = {
    title: "META.TITLE",
    description: "META.DESCRIPTION",
    children: {
        'licenses': {
            title: 'META.LICENSES.TITLE',
            description: 'META.LICENSES.DESCRIPTION'
        },
        'privacy-policy': {
            title: 'META.PRIVACY_POLICY.TITLE',
            description: 'META.PRIVACY_POLICY.DESCRIPTION'
        },
        'play': {
            title: 'META.PLAY.TITLE',
            description: 'META.PLAY.DESCRIPTION',
        },
        'game': {
            title: 'META.GAME.TITLE',
            description: 'META.GAME.DESCRIPTION',
            children: {
                ':id': {
                    title: 'META.GAME.ID.TITLE',
                    description: 'META.GAME.ID.DESCRIPTION'
                }
            }
        },
        'about': {
            title: 'META.ABOUT.TITLE',
            description: 'META.ABOUT.DESCRIPTION'
        },
        'settings': {
            title: 'META.SETTINGS.TITLE',
            description: 'META.SETTINGS.DESCRIPTION'
        }
    }
}