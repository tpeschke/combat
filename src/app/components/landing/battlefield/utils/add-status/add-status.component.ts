import { Component, OnInit, ViewChildren, QueryList, Input, OnChanges } from '@angular/core';
import { GeneralService } from 'src/app/utils/general.service';
import { FieldService } from 'src/app/utils/field.service';
import { CounterService } from 'src/app/utils/counter.service';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['../add-fighter/add-fighter.component.css']
})
export class AddStatusComponent implements OnInit, OnChanges {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @Input() editedStatus: any;
  @Input() closeEdit: Function;

  constructor(
    private generalService: GeneralService,
    private fieldService: FieldService,
    private counterService: CounterService
  ) { }

  public status = {
    id: null,
    namestatus: '',
    colorcode: '#a2a2a2',
    timestatus: null,
    description: null,
    playerdescription: false,
    playerview: true,
    interval: 0
  }
  public errors = []
  public editing = false;

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes) {
      this.editedStatus.timestatus = this.editedStatus.timestatus - this.counterService.count
      this.status = this.editedStatus
      this.editing = true;
    }
  }

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
      if (this.status.timestatus && !this.status.interval) { 
        this.status.timestatus = this.counterService.count + this.status.timestatus 
      } else if (this.status.timestatus && this.status.interval) {
        this.status.interval = this.status.timestatus;
        this.status.timestatus = this.counterService.count;
      }
      if (!this.status.playerview) { this.status.playerdescription = false}
      this.counterService.statuses = this.counterService.statuses.concat([this.status])
      this.fieldService.sendBattleData({hash: this.counterService.hash, type: 'addStatus', value: [this.status]})
      this.viewPanels.forEach(p => p.close());
      this.status = {
        id: null,
        namestatus: '',
        colorcode: '#a2a2a2',
        timestatus: null,
        description: null,
        playerdescription: false,
        playerview: true,
        interval: 0
      }
    } 
  }

  validStatus() {
    let isValid = false

    isValid = this.status.namestatus !== ''
      && ((this.status.interval && this.status.timestatus > 0) || !this.status.interval)

    this.errors = []
    if (this.status.namestatus === '') { this.errors.push('Name Required') }
    if (this.status.interval && !this.status.timestatus) { this.errors.push('Intervals Require an Interval') }
    if (this.status.interval && this.status.timestatus === 0) { this.errors.push('Intervals Require an Interval') }

    return isValid
  }

  saveEdit() {
    if (this.validStatus()) {
      if (this.status.timestatus && !this.status.interval) { 
        this.status.timestatus = this.counterService.count + this.status.timestatus 
      } else if (this.status.timestatus && this.status.interval) {
        this.status.interval = this.status.timestatus;
        this.status.timestatus = this.counterService.count;
      }
      if (!this.status.playerview) { this.status.playerdescription = false}
      this.counterService.statuses = this.counterService.statuses.map(val => {
        if (val.id === this.status.id) {
          return this.status
        } else {
          return val
        }
      })
      this.fieldService.sendBattleData({hash: this.counterService.hash, type: 'updateStatus', value: this.status})
      this.viewPanels.forEach(p => p.close());
      this.status = {
        id: null,
        namestatus: '',
        colorcode: '#a2a2a2',
        timestatus: null,
        description: null,
        playerdescription: false,
        playerview: true,
        interval: 0
      }
      this.editing = false
      this.closeEdit()
    } 
  }

  cancelEdit() {
    this.status = {
      id: null,
      namestatus: '',
      colorcode: '#a2a2a2',
      timestatus: null,
      description: null,
      playerdescription: false,
      playerview: true,
      interval: 0
    }
    this.editing = false
    this.closeEdit()
  }

}
