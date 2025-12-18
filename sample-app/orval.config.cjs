module.exports = {
  product: {
    input: './openapi.yaml',
    output: {
      client: 'zod',
      target: './src/gen/schemas.ts',
      override: {
        zod: {
          generate: {
            schemas: true,
          }
        }
      }
    },
  },
};
