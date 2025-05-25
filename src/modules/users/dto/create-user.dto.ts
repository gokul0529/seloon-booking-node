import { Types } from "mongoose";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
}


export class CreateDepartmentDto {
    name: string;
}

export class CreateDesignationDto {
    name: string;
}



export class PaginationDto {
    page: number;
    limit: number;
    isActive: boolean;
}