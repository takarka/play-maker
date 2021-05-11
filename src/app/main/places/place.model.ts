import { Hall } from '../halls/hall.model';

export interface IPlace {
  id?: string;
  name?: string;
  active?: boolean;
  clubId?: string;
  hall?: Hall;
}

export class Place implements IPlace {
  constructor(public id?: string, public name?: string, public active?: boolean, public clubId?: string, public hall?: Hall) {
    this.id = id ? id : null;
    this.name = name ? name : '';
    this.active = active ? active : true;
    this.clubId = clubId ? clubId : '';
    this.hall = hall ? hall : new Hall();
  }
}
