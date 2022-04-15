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
        return "Unsure";
      case 3:
        return "Nervous";
      case 4:
        return "Shaken";
      case 5:
        return "Breaking";
      default:
        return "Never"
    }
  }

}
