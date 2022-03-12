import Builder = require('./builder');
import TestSuite = require('./test_suite');
import TestCase = require('./test_case');

class Factory {
  public newBuilder() {
    return new Builder(this);
  }

  public newTestSuite() {
    return new TestSuite(this);
  }

  public newTestCase() {
    return new TestCase();
  }
}

export = Factory;
