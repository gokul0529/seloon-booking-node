import { Types } from "mongoose";
import { PermissionCollection } from "src/schemas/role.schema";

export class CreateUserDto {
    name: string;
    email: string;
    employeeId: Types.ObjectId;
    officeLocationId: Types.ObjectId;
    departmentId: Types.ObjectId;
    designationId: Types.ObjectId;
    roleId: Types.ObjectId;
    isActive: boolean;
}


export class CreateDepartmentDto {
    name: string;
}

export class CreateDesignationDto {
    name: string;
}

export class CreateRoleDto {
    name: string;
    permissions: PermissionCollection[];
}

export class PaginationDto {
    page: number;
    limit: number;
    isActive: boolean;
}