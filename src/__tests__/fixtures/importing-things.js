import * as classes from './just-classes';
import * as fns from './just-functions';
import { spam } from './just-variables';

export class CompositeClass extends classes.TestClass2 {
  constructor() {
    super();
    /* eslint-disable @typescript-eslint/restrict-plus-operands */
    this.yeet =
      this.spam + this.foo + fns.identity(' yeet') + ' ' + spam.join(' ');
    /* eslint-enable @typescript-eslint/restrict-plus-operands */
  }
}
