import { ConflictException } from '@nestjs/common';

export class BusinessRuleViolation extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
