import { authGuard } from "../guards/auth.guard";

export const protectedRoutes = [
    {
        'path': 'play',
        'canActivate': [authGuard],
        'data': {
            'role': 'user'
        }
    },
    {
        'path': 'admin',
        'canActivate': [authGuard],
        'data': {
            'role': 'admin'
        }
    }
]