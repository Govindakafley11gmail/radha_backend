import { IsNotEmpty, IsNumber, IsString, IsDateString, IsEmpty } from 'class-validator';

export class CreateAssetDto {
    @IsNotEmpty()
    @IsString()
    assetName: string;

    @IsNotEmpty()
    @IsString()
    assetCode: string;

    @IsNotEmpty()
    @IsNumber()
    purchaseCost: number;
    @IsNotEmpty()
    @IsNumber()
    gst: number;

    @IsNotEmpty()
    @IsDateString()
    purchaseDate: Date;

    @IsEmpty()
    status: string;
}
