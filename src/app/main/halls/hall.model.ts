export interface IHall{
    id?: string;
    clubId?: string;
    name?: string;
}

export class Hall implements IHall{
    constructor(
        public id?: string,
        public clubId?: string,
        public name?: string,
    ){
        this.id = id ? id : null;
        this.clubId = clubId ? clubId : '';
        this.name = name ? name : '';
    }
}

// export class GamePlace{
//     constructor(
//         public name?: string,
//     ){
//         this.name = name ? name : '';
//     }
// }
