export class TestClass1 {
  constructor() {
    this.foo = 'bar';
  }
}

export class TestClass2 extends TestClass1 {
  constructor() {
    super();
    this.spam = this.foo + ' and eggs';
  }
}
