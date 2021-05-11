import { Profile } from '../models/profile.model';

export interface IUser {
  id?: string;
  email?: string;
  password?: string;
  role?: string;
  tenantId?: string;
  profile?: Profile;
  activeClubId?: string;
}

export class User implements IUser {
  constructor(
    public id?: string,
    public email?: string,
    public password?: string,
    public role?: string,
    public tenantId?: string,
    public profile?: Profile,
    public activeClubId?: string
  ) {
    this.id = id ? id : null;
    this.email = email ? email : null;
    this.password = password ? password : null;
    this.role = role ? role : null;
    this.tenantId = tenantId ? tenantId : null;
    this.profile = profile ? profile : new Profile();
    this.activeClubId = activeClubId ? activeClubId : null;
  }
}
