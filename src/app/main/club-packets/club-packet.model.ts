import { Hall } from '../halls/hall.model';
import { Time } from 'src/app/shared/models/time.model';

export interface IClubPacket {
    id?: string;
    clubId?: string;
    name?: string;
    hall?: Hall;
    time?: Time;
    cost?: number;
    description?: string;
}

export class ClubPacket implements IClubPacket {
    constructor(
        public id?: string,
        public clubId?: string,
        public name?: string,
        public hall?: Hall,
        public time?: Time,
        public cost?: number,
        public description?: string,
    ) {
        this.id = id ? id : null;
        this.clubId = clubId ? clubId : null;
        this.name = name ? name : '';
        this.hall = hall ? hall : new Hall();
        this.time = time ? time : new Time(0, 0, 0);
        this.cost = cost ? cost : null;
        this.description = description ? description : '';
    }
}
