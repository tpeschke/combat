import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import tooltips from '../../../../utils/tooltips'
import { FieldService } from 'src/app/utils/field.service';

@Component({
  selector: 'app-saved-fields',
  templateUrl: './saved-fields.component.html',
  styleUrls: ['./saved-fields.component.css']
})
export class SavedFieldsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private fieldService: FieldService
  ) { }

  private fields = []
  private tooltips = tooltips

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.fields = data['fields']
    })
    this.fieldService.getTooltips().subscribe(results => {
      for (let key in results) {
        if (key !== 'id' && key !== 'userid') {
          tooltips[key] = results[key]
          this.tooltips[key] = results[key]
        }
      }
    })
  }

  checkCheckbox(type, event) {
    tooltips.updateTooltipSettings(type, !event.checked)
    this.fieldService.updateTooltip(type, !event.checked).subscribe().unsubscribe()
  }

  checkAllCheckboxes(event) {
    for (let key in tooltips) {
      if (typeof tooltips[key] === 'boolean') {
        tooltips.updateTooltipSettings(key, !event.checked)
      }
    }
  }

}
