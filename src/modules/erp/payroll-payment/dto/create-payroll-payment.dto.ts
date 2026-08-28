import {  IsString } from "class-validator";

export class CreatePayrollPaymentDto {
    @IsString()
    id!: string;
    @IsString()
    remarks!: string;
  
    @IsString()
    chequeNo!: string;
    @IsString()
    paymentMethod!: string;
    @IsString()
    paymentDate!: Date;

}
