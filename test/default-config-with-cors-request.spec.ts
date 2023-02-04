import http from 'http';
import supertest from 'supertest';
import { HttpCors } from '../src';

it('should add CORS-request headers and execute handler (default config)', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCors.setup(request, response, {});

    response.end('Hello GET');
  });

  const response = await supertest(httpServer)
    // CORS-request
    .get('/');

  expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  expect(response.headers['access-control-allow-headers']).toBeUndefined();
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBeUndefined();
  expect(response.headers['access-control-expose-headers']).toBeUndefined();
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe('Hello GET');
});

it('should add CORS-request headers and execute handler (default config) - reflection', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    HttpCors.setup(request, response, {});

    response.end('Hello GET');
  });

  const response = await supertest(httpServer)
    // CORS-request
    .get('/')
    .set('Origin', 'https://caviajs.com') // this header starts reflection
    .set('Access-Control-Request-Headers', 'Z-Foo, Z-Bar') // this header starts reflection
    .set('Access-Control-Request-Method', 'PUT');

  expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  expect(response.headers['access-control-allow-headers']).toBeUndefined(); // reflected but only used in CORS-preflight requests
  expect(response.headers['access-control-allow-methods']).toBeUndefined();
  expect(response.headers['access-control-allow-origin']).toBe('https://caviajs.com'); // reflected from Origin header
  expect(response.headers['access-control-expose-headers']).toBeUndefined();
  expect(response.headers['access-control-max-age']).toBeUndefined();
  expect(response.headers['vary']).toBe('Origin');
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe('Hello GET');
});
