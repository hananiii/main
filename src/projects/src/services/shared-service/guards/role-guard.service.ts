import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '$admin-root/src/services/shared-service/auth.service';
/** 
 * role guard service
 * @export
 * @class RoleGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RoleGuard implements CanActivate {

  /**
   *Creates an instance of RoleGuard.
   * @param {AuthService} _authService
   * @param {Router} _router
   * @memberof RoleGuard
   */
  constructor(private _authService: AuthService, private _router: Router) {
  }

  /**
   * check role activate
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof RoleGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // navigate to not found page
    this._router.navigate(['/404']);
    return false;
  }

}