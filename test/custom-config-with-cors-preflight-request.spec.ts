import http from 'http';
import supertest from 'supertest';
import { HttpCors } from '../src';

it('should add CORS-preflight request headers and not execute handler (custom config)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCors.setup({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': ['X-Foo', 'X-Bar'],
      'Access-Control-Allow-Methods': ['GET', 'POST'],
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': ['Y-Foo', 'Y-Bar'],
      'Access-Control-Max-Age': 500,
    }))
    .route({ handler: () => 'Hello GET', method: 'GET', path: '/' })
    .route({ handler: () => 'Hello OPTIONS', method: 'OPTIONS', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    // CORS-preflight request
    .options('/')
    .set('Origin', 'https://caviajs.com')
    .set('Access-Control-Request-Headers', 'Z-Foo, Z-Bar')
    .set('Access-Control-Request-Method', 'PUT');

  expect(response.headers['access-control-allow-credentials']).toBe('true');
  expect(response.headers['access-control-allow-headers']).toBe('X-Foo, X-Bar');
  expect(response.headers['access-control-allow-methods']).toBe('GET, POST');
  expect(response.headers['access-control-allow-origin']).toBe('*');
  expect(response.headers['access-control-expose-headers']).toBe('Y-Foo, Y-Bar');
  expect(response.headers['access-control-max-age']).toBe('500');
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(204);
  expect(response.text).toBe('');
});
