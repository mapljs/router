import type { CompilerState } from '@mapl/compiler';

export interface RouterCompilerState<Item> extends CompilerState {
  compileItem: (item: Item, state: this) => void;
}
