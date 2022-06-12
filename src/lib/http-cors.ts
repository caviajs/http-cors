import { Interceptor, Next } from '@caviajs/http-router';
import http from 'http';
import { Observable, of } from 'rxjs';

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  'Access-Control-Allow-Methods': ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
  'Access-Control-Allow-Origin': '*',
};

function setAccessControlAllowCredentials(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  if (options.hasOwnProperty('Access-Control-Allow-Credentials') && options['Access-Control-Allow-Credentials'] === true) {
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

function setAccessControlAllowHeaders(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
  if (options.hasOwnProperty('Access-Control-Allow-Headers')) {
    response.setHeader('Access-Control-Allow-Headers', options['Access-Control-Allow-Headers'].join(', '));
  }
}

function setAccessControlAllowMethods(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
  if (options.hasOwnProperty('Access-Control-Allow-Methods')) {
    response.setHeader('Access-Control-Allow-Methods', options['Access-Control-Allow-Methods'].join(', '));
  }
}

function setAccessControlAllowOrigin(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  if (options.hasOwnProperty('Access-Control-Allow-Origin')) {
    response.setHeader('Access-Control-Allow-Origin', options['Access-Control-Allow-Origin']);
  }
}

function setAccessControlExposeHeaders(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  if (options.hasOwnProperty('Access-Control-Expose-Headers')) {
    response.setHeader('Access-Control-Expose-Headers', options['Access-Control-Expose-Headers'].join(', '));
  }
}

function setAccessControlMaxAge(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
  if (options.hasOwnProperty('Access-Control-Max-Age')) {
    response.setHeader('Access-Control-Max-Age', options['Access-Control-Max-Age']);
  }
}

function setVary(response: http.ServerResponse): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#cors_and_caching
  let headerValue = response.getHeader('Vary') || [];

  if (typeof headerValue === 'number') {
    headerValue = [headerValue.toString()];
  }

  if (typeof headerValue === 'string') {
    headerValue = [headerValue];
  }

  headerValue.push('Origin');

  response.setHeader('Vary', headerValue);
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
export class HttpCors {
  public static setup(options: CorsOptions = {}): Interceptor {
    options = { ...DEFAULT_CORS_OPTIONS, ...options };

    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      setVary(response);

      if (request.method === 'OPTIONS' && request.headers['access-control-request-method'] && request.headers['origin']) {
        // This is a CORS-preflight request - https://fetch.spec.whatwg.org/#cors-preflight-request

        // There are three characteristics of a CORS-preflight request:
        // - it uses the HTTP OPTIONS method,
        // - it has an Access-Control-Request-Method header,
        // - it has an Origin request header.

        setAccessControlAllowCredentials(response, options);
        setAccessControlAllowHeaders(response, options);
        setAccessControlAllowMethods(response, options);
        setAccessControlAllowOrigin(response, options);
        setAccessControlExposeHeaders(response, options);
        setAccessControlMaxAge(response, options);

        // A successful HTTP response to a CORS-preflight request is similar,
        // except it is restricted to an ok status, e.g., 200 or 204.
        response.statusCode = 204;

        return of(undefined);
      } else {
        // This is a CORS request - https://fetch.spec.whatwg.org/#cors-request

        setAccessControlAllowCredentials(response, options);
        setAccessControlAllowOrigin(response, options);
        setAccessControlExposeHeaders(response, options);

        return next.handle();
      }
    };
  }
}

export interface CorsOptions {
  'Access-Control-Allow-Credentials'?: boolean;
  'Access-Control-Allow-Headers'?: string[];
  'Access-Control-Allow-Methods'?: ('DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT')[];
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Expose-Headers'?: string[];
  'Access-Control-Max-Age'?: number;
}
