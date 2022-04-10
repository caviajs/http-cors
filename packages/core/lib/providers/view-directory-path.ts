import path from 'path';
import { ValueProvider } from '../types/provider';
import { Token } from '../types/token';

export const VIEW_DIRECTORY_PATH: Token<ViewDirectoryPath> = Symbol('VIEW_DIRECTORY_PATH');

export const ViewDirectoryPathProvider: ValueProvider<ViewDirectoryPath> = {
  provide: VIEW_DIRECTORY_PATH,
  useValue: path.join(process.cwd(), 'resources', 'views'),
};

export type ViewDirectoryPath = string;