import { Controller, Interceptor } from '@caviajs/http-server';
import { HttpReflector } from '../http-reflector';

describe('@Controller', () => {
  it('should return false if the class does not use the @Controller decorator', () => {
    class Foo {
    }

    expect(HttpReflector.getAllControllerMetadata(Foo)).toEqual([]);
    expect(HttpReflector.hasControllerMetadata(Foo)).toEqual(false);
  });

  it('should return the appropriate metadata if the class uses the @Controller decorator', () => {
    class MyInterceptor implements Interceptor {
      intercept(context, next) {
        return next.handle();
      }
    }

    @Controller()
    class FooWithoutArguments {
    }

    @Controller('foo')
    class FooWithPrefix {
    }

    @Controller(MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
    class FooWithInterceptors {
    }

    @Controller('foo', MyInterceptor, { args: ['bar'], interceptor: MyInterceptor })
    class FooWithPrefixAndInterceptors {
    }

    expect(HttpReflector.getAllControllerMetadata(FooWithoutArguments)).toEqual([{
      prefix: '',
      interceptors: [],
    }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithPrefix)).toEqual([{
      prefix: 'foo',
      interceptors: [],
    }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithInterceptors)).toEqual([{
      prefix: '',
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }]
    }]);
    expect(HttpReflector.getAllControllerMetadata(FooWithPrefixAndInterceptors)).toEqual([{
      prefix: 'foo',
      interceptors: [{ args: [], interceptor: MyInterceptor }, { args: ['bar'], interceptor: MyInterceptor }]
    }]);
  });
});