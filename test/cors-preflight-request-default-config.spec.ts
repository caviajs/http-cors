import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpCors } from '../src';

it('should add CORS-preflight request headers and not execute handler (default config)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCors.setup())
    .route({ handler: () => 'Hello GET', method: 'GET', path: '/' })
    .route({ handler: () => 'Hello OPTIONS', method: 'OPTIONS', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .options('/')
    .set('Origin', 'https://caviajs.com')
    .set('Access-Control-Request-Method', 'PUT');

  // CORS-preflight request headers:
  expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  expect(response.headers['access-control-allow-headers']).toBeUndefined();
  expect(response.headers['access-control-allow-methods']).toBe('DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
  expect(response.headers['access-control-allow-origin']).toBe('*');
  expect(response.headers['access-control-expose-headers']).toBeUndefined();
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(204);
  expect(response.text).toBe('');
});
