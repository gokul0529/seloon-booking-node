export class CreateSaloonDto {
    name: string;
    city: string;
    place: string; // Place or area within the city
    latitude?: string; // Latitude of the Saloon location
    longitude?: string; // Longitude of the Saloon location
    password: string;
    email: string;
}

export class PaginationDto {
    page: number;
    limit: number;
    isActive: boolean;
    search?: string;
    saloonId?: string;

}

export class AddSaloonEmployeeDto {
    name: string;
    email: string;
    password: string;
}