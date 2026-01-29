import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetPaymentDto } from './create-asset-payment.dto';

export class UpdateAssetPaymentDto extends PartialType(CreateAssetPaymentDto) {
    status?: 'Pending' | 'Completed' | 'Failed';
}
