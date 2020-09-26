import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private toastr: ToastrService) { }

  public makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  public rollDice(diceString) {
    if (typeof (diceString) === 'number') {
      return +Math.floor(Math.random() * Math.floor(diceString)) + 1
    } else {
      let diceExpressionArray = []
      let expressionValue = ""

      diceString.replace(/\s/g, '').split('').forEach((val, i, array) => {
        if (val === '-' || val === '+') {
          diceExpressionArray.push(expressionValue)
          if (i !== array.length - 1) {
            diceExpressionArray.push(val)
          }
          expressionValue = ""
        }
        if (!isNaN(+val) || val === 'd' || val === "!") {
          expressionValue = expressionValue + val;
        }

        if (i === array.length - 1 && expressionValue !== '') {
          diceExpressionArray.push(expressionValue);
        }
      })

      for (let index = 0; index < diceExpressionArray.length; index++) {
        let val = diceExpressionArray[index];

        if (val.includes('d')) {
          val = val.split('d')
          let subtotal = 0
          for (let i = 0; i < val[0]; i++) {
            subtotal += this.rollDice(+val[1])
          }
          diceExpressionArray[index] = subtotal
        }
      }
      return eval(diceExpressionArray.join(""))
    }
  }

  genHexString() {
    const hex = '0123456789ABCDEF';
    let output = '#';
    for (let i = 0; i < 6; ++i) {
      output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }

  stripNonInt(value) {
    if (typeof value === 'string') {
      return +value.replace(/\D/g,'')
    } else {
      return value
    }
  }

  handleMessage(message) {
    let {message: info, color } = message;
    if (info) {
      if (color === 'green') {
        this.toastr.success(info)
      } else if (color === 'blue') {
        this.toastr.info(info)
      } else if (color === 'yellow') {
        this.toastr.warning(info)
      } else if (color === 'red') {
        this.toastr.error(info)
      } 
    }
  }
}
