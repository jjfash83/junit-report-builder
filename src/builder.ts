import _ = require('lodash');
import xmlBuilder = require('xmlbuilder');
import path = require('path');
import makeDir = require('make-dir');
import fs = require('fs');
import TestSuite = require('./test_suite');
import TestCase = require('./test_case');
import Factory = require('./factory');
import { XMLElement } from 'xmlbuilder';

declare type SuitOrCase = TestSuite | TestCase;

class JUnitReportBuilder {
  private _factory: Factory;
  private _testSuitesAndCases: SuitOrCase[];

  constructor(factory: Factory) {
    this._factory = factory;
    this._testSuitesAndCases = [];
  }

  writeTo(reportPath: string) {
    makeDir.sync(path.dirname(reportPath));
    fs.writeFileSync(reportPath, this.build(), 'utf8');
  }

  build() {
    const xmlTree: XMLElement = xmlBuilder.create('testsuites', { encoding: 'UTF-8', invalidCharReplacement: '' });
    _.forEach(this._testSuitesAndCases, (suiteOrCase: TestSuite | TestCase) => {
      suiteOrCase.build(xmlTree);
    });
    return xmlTree.end({ pretty: true });
  }

  testSuite() {
    const suite = this._factory.newTestSuite();
    this._testSuitesAndCases.push(suite);
    return suite;
  }

  testCase() {
    const testCase = this._factory.newTestCase();
    this._testSuitesAndCases.push(testCase);
    return testCase;
  }

  newBuilder() {
    return this._factory.newBuilder();
  }
}

export = JUnitReportBuilder;
