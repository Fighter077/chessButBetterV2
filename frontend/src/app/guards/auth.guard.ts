import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { filter, switchMap, take } from 'rxjs';
import { NavigationService } from '../services/navigation/navigation.service';
import { roleSuffices } from '../constants/roleHierarchy.constants';
import { LoadingService } from '../services/loading/loading.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);
  const loadingService = inject(LoadingService);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  return loadingService.getLoadingState('user').pipe(
    filter(userLoading => userLoading === false), // Ensure userLoading is defined
    take(1),
    switchMap(userLoading => {
      if (userLoading) {
        return [false];  // User not loaded yet
      }
      // Check if user is already loaded
      const user = userService.getCurrentUser();
      if (user) {
        // User is already loaded, check role sufficiency
        if (!requiredRoles || requiredRoles.some(requiredRole => roleSuffices(requiredRole, user.role))) {
          return [true];
        }
      }
      router.navigate(['/']);
      navigationService.setReturnUrl(state.url);
      return [false];
    })
  );
};