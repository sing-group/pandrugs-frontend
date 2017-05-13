'use strict';

describe('Service: QueryResult', function () {

  // load the service's module
  beforeEach(module('pandrugsFrontendApp'));

  // instantiate service
  var QueryResult;
  beforeEach(inject(function (_QueryResult_) {
    QueryResult = _QueryResult_;
  }));

  it('should do something', function () {
    expect(!!QueryResult).toBe(true);
  });

});
