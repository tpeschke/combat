import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FieldService } from '../field.service';

@Injectable({
  providedIn: 'root'
})
export class FieldResolverService implements Resolve<any> {

  constructor(
    private fieldSerivce: FieldService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.fieldSerivce.getFields();
   }
}
