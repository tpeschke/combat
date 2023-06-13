import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'panicShortThreshold'
})
export class PanicShortThresholdPipe implements PipeTransform {

  transform(value: any): any {
    switch (value) {
      case 1:
        return "A";
      case 2:
        return "U";
      case 3:
        return "N";
      case 4:
        return "S";
      case 5:
        return "B";
      default:
        return "N"
    }
  }
}
