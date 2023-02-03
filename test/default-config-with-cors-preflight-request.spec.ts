import http from 'http';
import supertest from 'supertest';
import { HttpCors, HttpRouter } from '../src';

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
    // CORS-preflight request
    .options('/');

  expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  expect(response.headers['access-control-allow-headers']).toBeUndefined();
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBeUndefined();
  expect(response.headers['access-control-expose-headers']).toBeUndefined();
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(204);
  expect(response.text).toBe('');
});

it('should add CORS-preflight request headers and not execute handler (default config) - reflection', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpCors.setup())
    .route({ handler: () => 'Hello GET', method: 'GET', path: '/' })
    .route({ handler: () => 'Hello OPTIONS', method: 'OPTIONS', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    // CORS-preflight request
    .options('/')
    .set('Origin', 'https://caviajs.com') // this header starts reflection
    .set('Access-Control-Request-Headers', 'Z-Foo, Z-Bar') // this header starts reflection
    .set('Access-Control-Request-Method', 'PUT');

  expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  expect(response.headers['access-control-allow-headers']).toBe('Z-Foo, Z-Bar'); // reflected from Access-Control-Request-Headers header
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBe('https://caviajs.com');  // reflected from Origin header
  expect(response.headers['access-control-expose-headers']).toBeUndefined();
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(204);
  expect(response.text).toBe('');
});
