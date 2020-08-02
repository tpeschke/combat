import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import local from '../local';

class User {
  id: number
  patreon?: number
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public loggedIn:boolean|string|number = false
  
  checkLogin() {
    return this.http.get(local.endpointBase + '/api/auth/me').pipe(
      // map((result: User) => {
      //   if (result.id === 1 || result.id === 21) {
      //     return 'owner'
      //   } else if (result.id && result.patreon) {
      //     return result.patreon
      //   } else if (result.id) {
      //     return true;
      //   }
      // })
    )
  }
}
