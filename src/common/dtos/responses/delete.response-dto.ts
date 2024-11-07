import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty()
  id!: number;
}
