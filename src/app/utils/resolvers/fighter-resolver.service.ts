import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FieldService } from '../field.service';

@Injectable({
  providedIn: 'root'
})
export class FighterResolverService implements Resolve<any> {

  constructor(
    private fieldService: FieldService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any> {
    let hash = route.paramMap.get('hash');
    if (hash !== 'new') {
      return this.fieldService.getFighters(hash)
    } else {
      return null
    }
  }
}
