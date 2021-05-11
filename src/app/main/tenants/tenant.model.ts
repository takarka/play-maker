export interface ITenant{
    id?: string;
    name?: string;
}

export class Tenant implements ITenant{
    constructor(
        public id?: string,
        public name?: string,
    ){
        this.id = id ? id : null;
        this.name = name ? name : '';
    }
}
