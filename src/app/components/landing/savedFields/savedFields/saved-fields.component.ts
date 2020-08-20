import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import tooltips from '../../../../utils/tooltips'

@Component({
  selector: 'app-saved-fields',
  templateUrl: './saved-fields.component.html',
  styleUrls: ['./saved-fields.component.css']
})
export class SavedFieldsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  private fields = []
  private tooltips = tooltips

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.fields = data['fields']
    })
  }

  checkCheckbox(type, event) {
    tooltips.updateTooltipSettings(type, !event.checked)
  }

}
