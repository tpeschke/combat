import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fatigueThreshold'
})
export class FatigueThresholdPipe implements PipeTransform {

  transform(value: any): any {
    switch (value) {
      case "A":
        return "Always";
      case "H":
        return "Hurt";
      case 'B':
        return "Bloodied";
      case 'W':
        return "Wounded";
      case 'C':
        return "Critical";
      default:
        return "Never"
    }
  }
}
