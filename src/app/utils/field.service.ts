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

  addField() {
    return this.http.get(local.endpointBase + '/api/newfield')
  }

  saveField(field) {
    return this.http.patch(local.endpointBase + '/api/battle', field)
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

  getTooltips() {
    return this.http.get(local.endpointBase + '/api/tooltips')
  }

  updateTooltip(type, value) {
    return this.http.patch(local.endpointBase + '/api/tooltips', {type, value})
  }

  deleteField(id) {
    return this.http.delete(local.endpointBase + '/api/battle/' + id)
  }
  
  deleteFighter(id) {
    return this.http.delete(local.endpointBase + '/api/fighter/' + id)
  }

  deleteStatus(id) {
    return this.http.delete(local.endpointBase + '/api/status/' + id)
  }
  
  deleteWeapon(id) {
    return this.http.delete(local.endpointBase + '/api/weapon/' + id)
  }
}
