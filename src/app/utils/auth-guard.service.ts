import { Injectable } from '@angular/core';
import { FieldService } from './field.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class User {
  id: number
  patreon?: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private fieldService: FieldService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.fieldService.checkLogin()
      .pipe(
        map((results: User) => {
          if (results) {
            return true
          } else {
            this.router.navigate(['/'])
            return false
          }
        })
      )
  }
}
