export interface CustomerRegistrationDTO {
    customerId?: number;
    addresses: string[];
    district: string;
    cityName: string;
    countryName: string;
    firstName: string;
    lastName: string;
}