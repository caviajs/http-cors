import http from 'http';
import { of } from 'rxjs';
import { Interceptor, Next } from '@caviajs/http-router';

function setAccessControlAllowCredentials(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  if (options['Access-Control-Allow-Credentials'] === true) {
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

function setAccessControlAllowHeaders(request: http.IncomingMessage, response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
  if (options['Access-Control-Allow-Headers']) {
    response.setHeader('Access-Control-Allow-Headers', options['Access-Control-Allow-Headers'].join(', '));
  } else if (typeof request.headers['access-control-request-headers'] === 'string') {
    // reflect headers
    response.setHeader('Access-Control-Allow-Headers', request.headers['access-control-request-headers']);
  }
}

function setAccessControlAllowMethods(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
  if (options['Access-Control-Allow-Methods']) {
    response.setHeader('Access-Control-Allow-Methods', options['Access-Control-Allow-Methods'].join(', '));
  }
}

function setAccessControlAllowOrigin(request: http.IncomingMessage, response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  if (typeof options['Access-Control-Allow-Origin'] === 'string') {
    response.setHeader('Access-Control-Allow-Origin', options['Access-Control-Allow-Origin']);
  } else if (typeof request.headers['origin'] === 'string') {
    // reflect origin
    response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);
  }
}

function setAccessControlExposeHeaders(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  if (options['Access-Control-Expose-Headers']) {
    response.setHeader('Access-Control-Expose-Headers', options['Access-Control-Expose-Headers'].join(', '));
  }
}

function setAccessControlMaxAge(response: http.ServerResponse, options: CorsOptions): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
  if (options['Access-Control-Max-Age']) {
    response.setHeader('Access-Control-Max-Age', options['Access-Control-Max-Age']);
  }
}

function setVary(response: http.ServerResponse): void {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
  let headerValue = response.getHeader('Vary') || [];

  if (typeof headerValue === 'number') {
    headerValue = [headerValue.toString()];
  }

  if (typeof headerValue === 'string') {
    headerValue = [headerValue];
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#cors_and_caching
  headerValue.push('Origin');

  response.setHeader('Vary', headerValue);
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
export class HttpCors {
  public static setup(options: CorsBuilder | CorsOptions = {}): Interceptor {
    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next) => {
      setVary(response);

      if (request.method === 'OPTIONS') {
        // This is a CORS-preflight request - https://fetch.spec.whatwg.org/#cors-preflight-request

        let corsOptions: CorsOptions;

        if (typeof options === 'function') {
          corsOptions = await options(request);
        } else {
          corsOptions = options;
        }

        setAccessControlAllowCredentials(response, corsOptions);
        setAccessControlAllowHeaders(request, response, corsOptions);
        setAccessControlAllowMethods(response, corsOptions);
        setAccessControlAllowOrigin(request, response, corsOptions);
        setAccessControlExposeHeaders(response, corsOptions);
        setAccessControlMaxAge(response, corsOptions);

        // A successful HTTP response to a CORS-preflight request is similar,
        // except it is restricted to an ok status, e.g., 200 or 204.
        response.statusCode = 204;

        return of(undefined);
      } else {
        // This is a CORS request - https://fetch.spec.whatwg.org/#cors-request

        let corsOptions: CorsOptions

        if (typeof options === 'function') {
          corsOptions = await options(request);
        } else {
          corsOptions = options;
        }

        setAccessControlAllowCredentials(response, corsOptions);
        setAccessControlAllowOrigin(request, response, corsOptions);
        setAccessControlExposeHeaders(response, corsOptions);

        return next.handle();
      }
    };
  }
}

export interface CorsBuilder {
  (request: http.IncomingMessage): CorsOptions | Promise<CorsOptions>;
}

export interface CorsOptions {
  'Access-Control-Allow-Credentials'?: boolean;
  'Access-Control-Allow-Headers'?: string[];
  'Access-Control-Allow-Methods'?: ('DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT')[];
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Expose-Headers'?: string[];
  'Access-Control-Max-Age'?: number;
}