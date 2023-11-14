import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateBoardPostDto extends BasePaginationDto {
  @IsString()
  @IsOptional()
  where__board__i_like: string;
}
