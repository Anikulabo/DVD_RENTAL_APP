export interface CustomerDetailDTO {
    fullName: string;
    address: string;
    rentals: {
        rentalDate: string;
        returnDate?: string;
        filmTitle: string;
    }[];
    totalAmountSpent: number;
    createdAt: string;
    active: boolean;
}
