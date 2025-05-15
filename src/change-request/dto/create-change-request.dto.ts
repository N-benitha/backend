import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RequestType } from "../entities/enums/request-type.enum";
import { RequestStatus } from "../entities/enums/request-status.enum";

export class CreateChangeRequestDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(RequestType, {
        message: 'Invalid type'
    })
    request_type: RequestType;

    @IsOptional()
    @IsEnum(RequestStatus, {
        message: 'Invalid Status'
    })
    status: RequestStatus;

    @IsDateString()
    @IsOptional()
    deployment_date: string;
}
