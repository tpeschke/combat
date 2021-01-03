import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'panicThresholds'
})
export class PanicThresholdsPipe implements PipeTransform {

  transform(value: any): any {
    switch(value) {
      case 1:
        return "Always";
      case 2:
        return "Hurt";
      case 3:
        return "Bloodied";
      case 4:
        return "Wounded";
      case 5:
        return "Bleeding Out";
      default:
        return "Never"
    }
  }

}
