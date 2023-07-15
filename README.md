<div align="center">
<h3>@caviajs/http-cors</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

[Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a mechanism that allows
resources to be requested from another domain.

## Usage

### Installation

```shell
npm install @caviajs/http-cors --save
```

### Configure the interceptor

#### Config builder

```typescript
import { HttpCors } from '@caviajs/http-cors';
import { Interceptor } from '@caviajs/http-router';

export const CorsInterceptor: Interceptor = HttpCors.setup(request => {
  return {
    /*
      'Access-Control-Allow-Credentials'?: boolean;
      'Access-Control-Allow-Headers'?: string[];
      'Access-Control-Allow-Methods'?: ('DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT')[];
      'Access-Control-Allow-Origin'?: string;
      'Access-Control-Expose-Headers'?: string[];
      'Access-Control-Max-Age'?: number;
    */
  };
});
```

#### Config object

```typescript
import { HttpCors } from '@caviajs/http-cors';
import { Interceptor } from '@caviajs/http-router';

export const CorsInterceptor: Interceptor = HttpCors.setup({
  /*
    'Access-Control-Allow-Credentials'?: boolean;
    'Access-Control-Allow-Headers'?: string[];
    'Access-Control-Allow-Methods'?: ('DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT')[];
    'Access-Control-Allow-Origin'?: string;
    'Access-Control-Expose-Headers'?: string[];
    'Access-Control-Max-Age'?: number;
  */
});
```

### Bind the interceptor

```typescript
httpRouter
  .intercept(CorsInterceptor);
```
