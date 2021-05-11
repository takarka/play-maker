
export interface IShift {
    id?: string,
    openedTime?: Date,
    closedTime?: Date,
    shiftStatus?: string;
    clubId?: string;
}

export class Shift implements IShift {
  constructor(
    public id?: string,
    public openedTime?: Date,
    public closedTime?: Date,
    public shiftStatus?: string,
    public clubId?: string
  )
  {
    this.id = id ? id : null;
    this.openedTime = openedTime ? openedTime : null;
    this.closedTime = closedTime ? closedTime : null;
    this.shiftStatus = shiftStatus ? shiftStatus : null;
    this.clubId = clubId ? clubId : null;
  }
}
