export class CreateUserDto { }


export class CreateDepartmentDto {
    name: string;
}

export class CreateDesignationDto {
    name: string;
}

export class CreateRoleDto {
    name: string;
    permissions: any[];
}