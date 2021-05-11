export class Time {
    constructor(public hour?: number, public minute?: number, public second?: number) {
      this.hour = hour ? hour : 0;
      this.minute = minute ? minute : 0;
      this.second = second ? second : 0;
    }
  }
