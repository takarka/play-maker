import { Address } from './address.model';

export interface IClub {
  id?: string;
  tenantId?: string;
  name?: string;
  address?: Address;
  timeRange?: ClubTimeRange;
}

export class Club implements IClub {
  constructor(
    public id?: string,
    public tenantId?: string,
    public name?: string,
    public address?: Address,
    public timeRange?: ClubTimeRange
  ) {
    this.id = id ? id : null;
    this.tenantId = tenantId ? tenantId : null;
    this.name = name ? name : '';
    this.address = address ? address : new Address();
    this.timeRange = timeRange ? timeRange : new ClubTimeRange();
  }
}

export class ClubTimeRange {
  constructor(public dayStart?: Date, public nightStart?: string) {
    this.dayStart = dayStart ? dayStart : null;
    this.nightStart = nightStart ? nightStart : null;
  }
}
