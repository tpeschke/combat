import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import local from '../local';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private http: HttpClient
  ) { }

  getFields() {
    return this.http.get(local.endpointBase + '/api/fields')
  }
}
