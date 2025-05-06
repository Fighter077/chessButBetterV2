import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { filter, map, switchMap, take } from 'rxjs';
import { NavigationService } from '../services/navigation/navigation.service';
import { roleSuffices } from '../constants/roleHierarchy.constants';
import { LoadingService } from '../services/loading/loading.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);
  const loadingService = inject(LoadingService);

  const requiredRole = route.data['role'] as string | undefined;

  return loadingService.getLoadingState('user').pipe(
    filter(userLoading => userLoading === false), // Ensure userLoading is defined
    take(1),
    switchMap(userLoading => {
      if (userLoading) {
        return [false];  // User not loaded yet
      }

      return userService.user$.pipe(
        take(1),
        map(user => {
          if (!user) {
            navigationService.setReturnUrl(state.url);
            router.navigate(['/']);
            return false;
          }

          if (requiredRole && !roleSuffices(requiredRole, user.role)) {
            router.navigate(['/']);
            return false;
          }

          return true;
        })
      );
    })
  );
};