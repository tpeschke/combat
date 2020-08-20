import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import local from '../local';
import tooltips from './tooltips'
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

  subscribeToBattleInfo(hash) {
    return this.socket.fromEvent<any>(`${hash}-fetch`);
  }

  getFields() {
    return this.http.get(local.endpointBase + '/api/fields')
  }

  getFighters(hash) {
    return this.http.get(local.endpointBase + '/api/battle/' + hash)
  }

  getFightersFromBestiary(hash) {
    return this.http.get(local.endpointBase + '/api/beast/' + hash)
  }

  getFightersForPlayers(hash) {
    return this.http.get(local.endpointBase + '/api/player/battle/' + hash)
  }

  getBattleName(hash) {
    return this.http.get(local.endpointBase + '/api/player/field/' + hash)
  }

  sendBattleData(data){
    this.socket.emit('battle', data)
  }

  getBattleInfo(data) {
    this.socket.emit('battle-fetch', data)
  }


}
