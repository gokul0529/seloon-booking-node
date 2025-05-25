export class CreateSeloonDto {
    name: string; // Unique name of the Seloon
    city: string; // City where the Seloon is located
    place: string; // Place or area within the city
    latitude?: string; // Latitude of the Seloon location
    longitude?: string; // Longitude of the Seloon location
    password?: string; // Password for the Seloon, if required
}
