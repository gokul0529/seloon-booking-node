import { off } from "process";
import { PermissionCollection } from "src/schemas/role.schema";

export class CreateUserDto {
    name: string;
    email: string;
    employeeId: string;
    officeLocationId: string;
    departmentId: string;
    designationId: string;
    roleId: string;
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
}