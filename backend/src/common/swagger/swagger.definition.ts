import config from '@config/config'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '420ent. JobSicker API documentation',
    version: '0.0.1',
    description: 'This is a 420ent. JobSicker API platform documentation',
    license: {
      name: 'MIT',
      url: 'https://github.com/imsimpla2209/jobsicker',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
}

export default swaggerDefinition
