import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { GeneralService } from 'src/app/utils/general.service';
import { FieldService } from 'src/app/utils/field.service';
import { CounterService } from 'src/app/utils/counter.service';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['../add-fighter/add-fighter.component.css']
})
export class AddStatusComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  constructor(
    private generalService: GeneralService,
    private fieldService: FieldService,
    private counterService: CounterService
  ) { }

  public status = {
    id: null,
    namestatus: '',
    colorcode: '#ccc',
    timestatus: null,
    description: null,
    playerdescription: false,
    playerview: true
  }

  ngOnInit() {}

  captureChange(event, type) {
    event.stopPropagation()
    if (type === 'timestatus') {
      this.status[type] = +event.target.value
    } else {
      this.status[type] = event.target.value
    }
  }

  captureColor(value) {
    this.status.colorcode = value
  }

  makeUniqueColor() {
    this.status.colorcode = this.generalService.genHexString()
  }

  toggleCheckbox(checked, type) {
    this.status[type] = checked
  }

  addStatus() {
    if (this.validStatus()) {
      this.status.id = this.generalService.makeid()
      if (this.status.timestatus) { this.status.timestatus = this.counterService.count + this.status.timestatus }
      if (!this.status.playerview) { this.status.playerdescription = false}
      this.counterService.statuses = this.counterService.statuses.concat([this.status])
      this.fieldService.sendBattleData({hash: this.counterService.hash, type: 'addStatus', value: [this.status]})
      this.viewPanels.forEach(p => p.close());
      this.status = {
        id: null,
        namestatus: '',
        colorcode: '#ccc',
        timestatus: null,
        description: null,
        playerdescription: false,
        playerview: true
      }
    } 
  }

  validStatus() {
    // Make sure time is greater than 0
    return this.status.namestatus !== ''
  }

}
