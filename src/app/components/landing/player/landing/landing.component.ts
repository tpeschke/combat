import { Component, OnInit } from '@angular/core';
import variables from '../../../../local'
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private fieldService: FieldService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fieldService.checkLogin().subscribe(results => {
      if (results) {
        this.router.navigate(['/fields'])
      } else {
      }
    })
  }

  public hash = null;
  public loginEndpoint = variables.login

  enterHash(event) {
    this.hash = event.target.value
  }

}
