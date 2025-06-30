import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { filter, switchMap, take } from 'rxjs';
import { NavigationService } from '../services/navigation/navigation.service';
import { roleSuffices } from '../constants/roleHierarchy.constants';
import { LoadingService } from '../services/loading/loading.service';
import { protectedRoutes } from '../constants/protectedRoutes.constants';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../components/dialogs/login/login.component';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);
  const loadingService = inject(LoadingService);
  const dialog = inject(MatDialog);

  const loginDialog = () => {
    dialog.open(LoginComponent);
  }

  return loadingService.getLoadingState('user').pipe(
    filter(userLoading => userLoading === false), // Ensure userLoading is defined
    take(1),
    switchMap(userLoading => {
      if (userLoading) {
        return [false];  // User not loaded yet
      }
      // Check if user is already loaded
      const user = userService.getCurrentUser();
      let segment = state.url.split('?')[0];
      let ranOnce = false; // To prevent infinite loop
      while (protectedRoutes.some(route => segment.includes(route.path) && !roleSuffices(route?.data?.roles, user?.role))) {
        segment = segment.substring(0, segment.lastIndexOf('/'));
        ranOnce = true;
      }
      if (ranOnce) {
        // If the user is not logged in, redirect to login dialog
        if (!user) {
          navigationService.setReturnUrl(state.url.split('?')[0]);
          navigationService.setReturnParams(state.root.queryParams);
        }
        router.navigate([segment]);
        if (!user) {
          loginDialog();
        }
        return [false];
      }

      return [true];
    })
  );
};