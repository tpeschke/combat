import { Component, OnInit } from '@angular/core';
import variables from '../../../../local'
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  public hash = null;
  public loginEndpoint = variables.login

  enterHash(event) {
    this.hash = event.target.value
  }

}
