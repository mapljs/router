import type { CompilerState } from '@mapl/compiler';

export interface RouterCompilerState extends CompilerState {
  compileItem: (item: any, state: RouterCompilerState, hasParam: boolean) => void;
}
