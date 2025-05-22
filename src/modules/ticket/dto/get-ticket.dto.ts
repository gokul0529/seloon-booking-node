import { } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
//

export class GetTicketDto {
    @ApiPropertyOptional()
    @IsOptional()
    limit: number;

    @ApiPropertyOptional()
    @IsOptional()
    page: number;

    @ApiPropertyOptional()
    @IsOptional()
    search: string;

    @ApiPropertyOptional()
    @IsOptional()
    startDate: Date;

    @ApiPropertyOptional()
    @IsOptional()
    endDate: Date;

    @ApiPropertyOptional()
    @IsOptional()
    priority: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    assignees: string[];

    @ApiPropertyOptional()
    @IsOptional()
    status: string;

    @ApiPropertyOptional()
    @IsOptional()
    channel: string;

    @ApiPropertyOptional()
    @IsOptional()
    severity: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    tags: string[];

    @ApiPropertyOptional()
    @IsOptional()
    workType: string;
}