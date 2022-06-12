import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpCors } from '../src';

it('should add CORS-request headers and execute handler (custom config)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCors.setup({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': ['X-Foo', 'X-Bar'],
      'Access-Control-Allow-Methods': ['GET'],
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': ['Y-Foo', 'Y-Bar'],
      'Access-Control-Max-Age': 500,
    }))
    .route({ handler: () => 'Hello Cavia', method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/')
    .set('Origin', 'https://caviajs.com');

  expect(response.headers['access-control-allow-credentials']).toBe('true'); // CORS-request header
  expect(response.headers['access-control-allow-headers']).toBeUndefined();
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBe('*'); // CORS-request header
  expect(response.headers['access-control-expose-headers']).toBe('Y-Foo, Y-Bar'); // CORS-request header
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin'); // CORS-request header
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe('Hello Cavia');
});
