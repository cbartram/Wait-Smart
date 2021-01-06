const expect = require('chai').expect;
const { isValidParkId } = require('../src/utils');

describe('Util Method Tests', () => {
    it('Returns true for valid park id', (done) => {
       expect(isValidParkId("10135")).to.be.a('boolean').that.deep.equals(true);
       expect(isValidParkId("1234567")).to.be.a('boolean').that.deep.equals(true);
       done();
    });

    it('Returns false for invalid park id', (done) => {
       expect(isValidParkId("BAD_PARK_ID")).to.be.a('boolean').that.deep.equals(false);
       expect(isValidParkId("104B14")).to.be.a('boolean').that.deep.equals(false);
       expect(isValidParkId("123")).to.be.a('boolean').that.deep.equals(false);
       done();
    })
})