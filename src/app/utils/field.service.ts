import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import local from '../local';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  subscribeToBattle(hash) {
    return this.socket.fromEvent<any>(hash);
  }

  getFields() {
    return this.http.get(local.endpointBase + '/api/fields')
  }

  getFighters(hash) {
    return this.http.get(local.endpointBase + '/api/battle/' + hash)
  }

  getFightersForPlayers(hash) {
    return this.http.get(local.endpointBase + '/api/player/battle/' + hash)
  }

  sendBattleData(data){
    this.socket.emit('battle', data)
  }
}
