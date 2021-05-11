import { Profile } from 'src/app/shared/models/profile.model';

export interface IOperator {
  id?: string;
  authId?: string;
  clubId?: string;
  profile?: Profile;
}

export class Operator implements IOperator {
  constructor(public id?: string, public authId?: string, public clubId?: string, public profile?: Profile) {
    this.id = id ? id : null;
    this.authId = authId ? authId : null;
    this.clubId = clubId ? clubId : null;
    this.profile = profile ? profile : new Profile();
  }
}
