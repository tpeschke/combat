import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import tooltips from '../../../../utils/tooltips'
import { FieldService } from 'src/app/utils/field.service';
import { MatDialog } from '@angular/material';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-saved-fields',
  templateUrl: './saved-fields.component.html',
  styleUrls: ['./saved-fields.component.css']
})
export class SavedFieldsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fieldService: FieldService,
    private router: Router
  ) { }

  private fields = []
  private tooltips = tooltips
  private hash = null

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

  addField() {
    this.fieldService.addField(false).subscribe((result: any) => {
      if (result.hash) {
        this.router.navigate(['/battle', result.hash])
      }
    })
  }

  changeHash(event) {
    this.hash = event.target.value
  }

  addFieldByHash() {
    this.fieldService.addField(this.hash).subscribe((result: any) => {
      if (result.hash) {
        this.router.navigate(['/battle', result.hash])
        this.hash = null;
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

  deleteConfirm(event, id) {
    event.stopPropagation()
    this.dialog.open(DeleteComponent, {
      panelClass: 'dialogStyling',
      data: { id }
    }).afterClosed().subscribe(result => {
      if (result) {
        for(let i = 0; i < this.fields.length; i++) {
          if (this.fields[i].id === id) {
            this.fields.splice(i,1)
            i = this.fields.length
          }
        }
      }
    })
  }

}
