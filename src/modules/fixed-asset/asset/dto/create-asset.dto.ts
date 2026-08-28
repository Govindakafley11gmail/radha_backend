import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateAssetDto {
 @IsNotEmpty()
    @IsString()
    assetType!: string;

    @IsNotEmpty()
    @IsString()
    assetName!: string;

    @IsNotEmpty()
    @IsString()
    assetCode!: string;

    @IsNotEmpty()
    @IsNumber()
    purchaseCost!: number;
    @IsNotEmpty()
    @IsString()
    gstApplicable!: string;

    @IsNotEmpty()
    @IsDateString()
    purchaseDate!: Date;
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'Amount must be a valid decimal number' },
    )
    @IsNotEmpty()
    fridgeCost!: number;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'Amount must be a valid decimal number' },
    )
    @IsNotEmpty()
    otherCost!: number;
    @IsNotEmpty()
    description!: string;

}
