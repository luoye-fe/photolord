import * as ExtendContext from '@/app/extend/context';

type ExtendContextType = typeof ExtendContext;

declare module 'egg' {
  interface Context extends ExtendContextType {}
}
