import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpReflector } from '../http-reflector';

export function Req(): ParameterDecorator {
  return (target, propertyKey: string, parameterIndex) => {
    HttpReflector.addRouteParamMetadata(target.constructor, propertyKey, {
      factory: (request: Request, response: Response) => {
        return request;
      },
      index: parameterIndex,
      pipes: [],
    });
  };
}
