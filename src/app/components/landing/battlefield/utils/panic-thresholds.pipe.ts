import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'panicThresholds'
})
export class PanicThresholdsPipe implements PipeTransform {

  transform(value: any): any {
    switch(value) {
      case 1:
        return "Fresh";
      case 2:
        return "Tired";
      case 3:
        return "Hurt";
      case 4:
        return "Bloodied";
      case 5:
        return "Wounded";
      case 6:
        return "Bleeding Out";
      default:
        return "Never"
    }
  }

}
