import type { CompilerState } from '@mapl/compiler';

export interface RouterCompilerState extends CompilerState {
  compileItem: (item: unknown, state: RouterCompilerState, hasParam: boolean) => void;
}
