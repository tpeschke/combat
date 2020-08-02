import { Component, OnInit } from '@angular/core';
import { FieldService } from '../../../../../utils/field.service';

@Component({
  selector: 'app-saved-fields',
  templateUrl: './saved-fields.component.html',
  styleUrls: ['./saved-fields.component.css']
})
export class SavedFieldsComponent implements OnInit {

  constructor(
    private fieldSerivce: FieldService
  ) { }

  private fields = []

  ngOnInit() {
    this.fieldSerivce.getFields().subscribe(results => {
      this.fields = results
    })
  }

}
