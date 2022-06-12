import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpCors } from '../src';

it('should add CORS-request headers and execute handler (default config)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCors.setup())
    .route({ handler: () => 'Hello GET', method: 'GET', path: '/' })
    .route({ handler: () => 'Hello OPTIONS', method: 'OPTIONS', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    // CORS-request
    .get('/')
    .set('Origin', 'https://caviajs.com');

  expect(response.headers['access-control-allow-credentials']).toBeUndefined(); // CORS-request header
  expect(response.headers['access-control-allow-headers']).toBeUndefined();
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBe('*'); // CORS-request header
  expect(response.headers['access-control-expose-headers']).toBeUndefined(); // CORS-request header
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin'); // CORS-request header
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe('Hello GET');
});
