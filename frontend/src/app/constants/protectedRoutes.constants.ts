import { authGuard } from "../guards/auth.guard";

export const protectedRoutes = [
    {
        'path': 'play',
        'canActivate': [authGuard],
        'data': {
            'roles': ['TEMP_USER', 'USER', 'ADMIN'],
        }
    },
    {
        'path': 'admin',
        'canActivate': [authGuard],
        'data': {
            'roles': ['ADMIN']
        }
    },
    {
        'path': 'settings/user',
        'canActivate': [authGuard],
        'data': {
            'roles': ['ADMIN', 'USER'],
        }
    }
]