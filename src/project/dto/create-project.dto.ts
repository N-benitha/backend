import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
        @IsNotEmpty()
        @IsString()
        title: string;
    
        @IsNotEmpty({ message: 'DEscription should not be empty'})
        @IsString()
        description: string;

}
