import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import local from '../local';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  public loggedIn:boolean|string|number = false
  public owner = false;
  
  checkLogin() {
    return this.http.get(local.endpointBase + '/api/auth/me')
  }
}
