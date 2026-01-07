import { IsArray, IsNumber, Min, ValidateNested, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class PayrollEmployee {
    @IsNumber()
    employeeId: number;


    @IsNumber()
    @Min(0)
    basicSalary: number;

    @IsNumber()
    @Min(0)
    tds: number;


    @IsNumber()
    @Min(0)
    medical: number;

    @IsNumber()
    @Min(0)
    otherAllowance: number;
    @IsNumber()

    providentInterest
    @IsNumber()
    @Min(0)
    housingAllowance: number;
}

export class CreatePayrollDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PayrollEmployee)
    employees: PayrollEmployee[];

    @IsDateString()
    payrollDate: string;

    @IsString()
    month: string;

    @IsString()
    year: string;

    @IsNumber()
    totalAmount: number;

    @IsNumber()

    totalDecuction: number;

    @IsNumber()
    totalAllowance: number;

}
