import _ = require('lodash');
const formatDate = require('date-format').asString;
import TestCase = require('./test_case');
import Factory = require('./factory');
import { XMLElement } from 'xmlbuilder';

interface Property {
  name: string;
  value: string;
}

interface TestSuiteAttributes {
  tests?: number;
  errors?: number;
  failures?: number;
  skipped?: number;
  classname?: string;
  name?: string;
  time?: number;
  file?: string;
  timestamp?: string;
}

class TestSuite {
  private _factory: Factory;
  private _attributes: TestSuiteAttributes;
  private _testCases: TestCase[];
  private _properties: Property[];

  constructor(factory: Factory) {
    this._factory = factory;
    this._attributes = {};
    this._testCases = [];
    this._properties = [];
  }

  public name(name: string) {
    this._attributes.name = name;
    return this;
  }

  public time(timeInSeconds: number) {
    this._attributes.time = timeInSeconds;
    return this;
  }

  public timestamp(timestamp: Date | string) {
    if (_.isDate(timestamp)) {
      this._attributes.timestamp = formatDate('yyyy-MM-ddThh:mm:ss', timestamp);
    } else {
      this._attributes.timestamp = timestamp as string;
    }
    return this;
  }

  public property(name: string, value: any) {
    this._properties.push({ name, value });
    return this;
  }

  public testCase() {
    const testCase = this._factory.newTestCase();
    this._testCases.push(testCase);
    return testCase;
  }

  public getFailureCount() {
    return this._sumTestCaseCounts((testCase: TestCase) => {
      return testCase.getFailureCount();
    });
  }

  public getErrorCount() {
    return this._sumTestCaseCounts((testCase: TestCase) => {
      return testCase.getErrorCount();
    });
  }

  public getSkippedCount() {
    return this._sumTestCaseCounts((testCase: TestCase) => {
      return testCase.getSkippedCount();
    });
  }

  public _sumTestCaseCounts(counterFunction: (testCase: TestCase) => number): number {
    const counts = _.map(this._testCases, counterFunction);
    return _.sum(counts);
  }

  public build(parentElement: XMLElement) {
    this._attributes.tests = this._testCases.length;
    this._attributes.failures = this.getFailureCount();
    this._attributes.errors = this.getErrorCount();
    this._attributes.skipped = this.getSkippedCount();
    const suiteElement = parentElement.ele('testsuite', this._attributes);

    if (this._properties.length) {
      const propertiesElement = suiteElement.ele('properties');
      _.forEach(this._properties, (property: Property) => {
        propertiesElement.ele('property', {
          name: property.name,
          value: property.value,
        });
      });
    }

    _.forEach(this._testCases, (testCase: TestCase) => {
      testCase.build(suiteElement);
    });
  }
}

export = TestSuite;
