import { getSchemaPath } from '@nestjs/swagger';

export const PaginatedResponseSchema = (model: any) => {
  return {
    properties: {
      total: {
        type: 'number',
      },
      results: {
        type: 'array',
        items: {
          $ref: getSchemaPath(model),
        },
      },
    },
  };
};
