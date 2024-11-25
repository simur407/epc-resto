import { BadRequestException } from '@nestjs/common';

export class ValidationError extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
