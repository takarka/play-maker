export class Address {
    constructor(
        public country?: string,
        public city?: string,
        public region?: string,
        public street?: string,
        public houseNumber?: string,
        public zipCode?: string
    ){
        this.country = country ? country : '';
        this.city = city ? city : '';
        this.region = region ? region : '';
        this.street = street ? street : '';
        this.houseNumber = houseNumber ? houseNumber : '';
        this.zipCode = zipCode ? zipCode : '';
    }
}