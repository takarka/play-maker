export class Profile {
  constructor(
      public firstName?: string,
      public lastName?: string,
      public phoneNumber?: string,
      public email?: string,
  ) {
      this.firstName = firstName ? firstName : null;
      this.lastName = lastName ? lastName : null;
      this.phoneNumber = phoneNumber ? phoneNumber : null;
      this.email = email ? email : null;
  }
}
