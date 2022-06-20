<div align="center">
<h3>@caviajs/http-cors</h3>
<p>ecosystem for your guinea pig</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-cors --save
```

<div align="center">
<h4>Usage</h4>
</div>

```typescript
import { HttpCors } from '@caviajs/http-cors';
import { Interceptor } from '@caviajs/http-router';

export const HttpCorsInterceptor: Interceptor = HttpCors.setup({ /* ... */ });
```

```typescript
// ...
httpRouter
  .intercept(HttpCorsInterceptor)
// ...
```

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
