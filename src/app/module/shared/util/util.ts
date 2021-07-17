export class Util {


  static fixedConversion(num: number, digits: number = 2) {
    if (num > 0) {
      return +num.toFixed(digits);
    } else {
      return 0;
    }
  }
}
