var expect = require('chai').expect;
var log = require('../lib/log');

describe('log testing', function() {
  it('main logger statuses check', function(done) {
    log.should.have.property('debug');
    log.should.have.property('info');
    log.should.have.property('money');
    log.should.have.property('warn');
    log.should.have.property('error');
    done();
  });
});
