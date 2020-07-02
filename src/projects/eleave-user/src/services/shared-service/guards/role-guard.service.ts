import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {

  /**
   *Creates an instance of RoleGuard.
   * @param {Router} _router
   * @memberof RoleGuard
   */
  constructor(private _router: Router) {
  }

  /**
   * check role
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