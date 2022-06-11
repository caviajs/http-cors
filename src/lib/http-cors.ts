import { Interceptor, Next } from '@caviajs/http-router';
import http from 'http';
import { Observable, of } from 'rxjs';

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  'Access-Control-Allow-Methods': ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
export class HttpCors {
  public static setup(options: CorsOptions = {}): Interceptor {
    options = { ...DEFAULT_CORS_OPTIONS, ...options };

    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      if (request.method === 'OPTIONS') {
        // Preflight request...

        // If there is no Access-Control-Request-Method header, it is not a preflight request.
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method
        if (!request.headers['Access-Control-Request-Method']) {
          return next.handle();
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
        if (options.hasOwnProperty('Access-Control-Allow-Credentials') && options['Access-Control-Allow-Credentials'] === true) {
          response.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
        if (options.hasOwnProperty('Access-Control-Allow-Headers')) {
          response.setHeader('Access-Control-Allow-Headers', options['Access-Control-Allow-Headers']);
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
        if (options.hasOwnProperty('Access-Control-Allow-Methods')) {
          response.setHeader('Access-Control-Allow-Methods', options['Access-Control-Allow-Methods'].join(','));
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
        if (options.hasOwnProperty('Access-Control-Allow-Origin')) {
          // response.setHeader('Access-Control-Allow-Origin', options['Access-Control-Allow-Origin']);
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
        if (options.hasOwnProperty('Access-Control-Expose-Headers')) {
          response.setHeader('Access-Control-Expose-Headers', options['Access-Control-Expose-Headers'].join(','));
        }

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
        if (options.hasOwnProperty('Access-Control-Max-Age')) {
          response.setHeader('Access-Control-Max-Age', options['Access-Control-Max-Age']);
        }

        return of(undefined);
      } else {
        // If the Origin header is not present handle next interceptors.
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
        if (!request.headers['origin']) {
          return next.handle();
        }

        // ...
      }
    };
  }
}

export interface CorsOptions {
  'Access-Control-Allow-Credentials'?: boolean;
  'Access-Control-Allow-Headers'?: string[];
  'Access-Control-Allow-Methods'?: ('DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT')[];
  'Access-Control-Allow-Origin'?: (string | RegExp)[];
  'Access-Control-Expose-Headers'?: string[];
  'Access-Control-Max-Age'?: number;
}
