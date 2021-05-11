import { Place } from '../places/place.model';
import { Hall } from '../halls/hall.model';
import { User } from 'src/app/shared/services/user.model';

export class OrderArchiveSearch {
  constructor(public openedBy?: User, public hall?: Hall, public place?: Place, public startDate?: Date, public endDate?: Date) {
    this.hall = hall ? hall : null;
    this.place = place ? place : null;
    this.startDate = startDate ? startDate : null;
    this.endDate = endDate ? endDate : null;
    this.openedBy = openedBy ? openedBy : null;
  }
}
