import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WeaponSelectComponent } from '../../battlefield/utils/weapon-select/weapon-select.component';
import { FieldService } from 'src/app/utils/field.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WeaponSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fieldService: FieldService
  ) { }

  public id = this.data.id

  ngOnInit() {}

  deleteField() {
    this.fieldService.deleteField(this.id).subscribe(result => {
      this.dialogRef.close(true)
    })
  }

}
