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
    playerDescription: false
  }

  ngOnInit() {}

  captureChange(value, type) {
    if (type === 'timestatus') {
      this.status[type] = +value
    } else {
      this.status[type] = value
    }
  }

  makeUniqueColor() {
    this.status.colorcode = this.generalService.genHexString()
  }

  toggleShowDescription(checked) {
    this.status.playerDescription = checked
  }

  addStatus() {
    if (this.validStatus()) {
      this.status.id = this.generalService.makeid()
      if (this.status.timestatus) { this.status.timestatus = this.counterService.count + this.status.timestatus }
      this.counterService.statuses = this.counterService.statuses.concat([this.status])
      this.fieldService.sendBattleData({hash: this.counterService.hash, type: 'addStatus', value: [this.status]})
      this.viewPanels.forEach(p => p.close());
      this.status = {
        id: null,
        namestatus: '',
        colorcode: '#ccc',
        timestatus: null,
        description: null,
        playerDescription: false
      }
    } 
  }

  validStatus() {
    return this.status.namestatus !== ''
  }

}
