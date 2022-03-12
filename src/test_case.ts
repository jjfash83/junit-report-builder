import { XMLElement } from 'xmlbuilder';

interface TestCaseAttributes {
  classname?: string;
  name?: string;
  time?: number;
  file?: string;
}

interface ErrorAttributes {
  message?: string;
  type?: string;
  content?: string;
}

class TestCase {
  private _error = false;
  private _failure = false;
  private _skipped = false;
  private _standardOutput?: string;
  private _standardError?: string;
  private _stacktrace?: string;
  private _attributes: TestCaseAttributes;
  private _errorAttributes: ErrorAttributes;
  private _failureAttributes: ErrorAttributes;
  private _errorAttachment?: string;
  private _errorContent?: string;

  constructor() {
    this._attributes = {};
    this._errorAttributes = {};
    this._failureAttributes = {};
  }

  className(className: string): TestCase {
    this._attributes.classname = className;
    return this;
  }

  name(name: string): TestCase {
    this._attributes.name = name;
    return this;
  }

  time(timeInSeconds: number): TestCase {
    this._attributes.time = timeInSeconds;
    return this;
  }

  file(filepath: string): TestCase {
    this._attributes.file = filepath;
    return this;
  }

  failure(message: string, type: string): TestCase {
    this._failure = true;
    if (message) {
      this._failureAttributes.message = message;
    }
    if (type) {
      this._failureAttributes.type = type;
    }
    return this;
  }

  error(message: string, type: string, content: string): TestCase {
    this._error = true;
    if (message) {
      this._errorAttributes.message = message;
    }
    if (type) {
      this._errorAttributes.type = type;
    }
    if (content) {
      this._errorContent = content;
    }
    return this;
  }

  stacktrace(stacktrace: string): TestCase {
    this._failure = true;
    this._stacktrace = stacktrace;
    return this;
  }

  skipped(): TestCase {
    this._skipped = true;
    return this;
  }

  standardOutput(log: string): TestCase {
    this._standardOutput = log;
    return this;
  }

  standardError(log: string): TestCase {
    this._standardError = log;
    return this;
  }

  getFailureCount() {
    return Number(this._failure);
  }

  getErrorCount() {
    return Number(this._error);
  }

  getSkippedCount() {
    return Number(this._skipped);
  }

  errorAttachment(path: string) {
    this._errorAttachment = path;
    return this;
  }

  build(parentElement: XMLElement) {
    const testCaseElement = parentElement.ele('testcase', this._attributes);
    if (this._failure) {
      const failureElement = testCaseElement.ele('failure', this._failureAttributes);
      if (this._stacktrace) {
        failureElement.cdata(this._stacktrace);
      }
    }
    if (this._error) {
      const errorElement = testCaseElement.ele('error', this._errorAttributes);
      if (this._errorContent) {
        errorElement.cdata(this._errorContent);
      }
    }
    if (this._skipped) {
      testCaseElement.ele('skipped');
    }
    if (this._standardOutput) {
      testCaseElement.ele('system-out').cdata(this._standardOutput);
    }
    if (this._standardError) {
      const systemError = testCaseElement.ele('system-err').cdata(this._standardError);

      if (this._errorAttachment) {
        systemError.txt('[[ATTACHMENT|' + this._errorAttachment + ']]');
      }
    }
  }
}

export = TestCase;
