const { describe, it } = require('mocha');
const expect = require('chai').expect;

const index = require('../index');

describe('Index.js Tests', () => {
   it('Successfully retrieves data from universal API', async () => {
      const response = await index.handler({ httpMethod: 'GET', path: '/' }, null);
       expect(response.statusCode).to.be.a('number').that.equals(200);
       expect(response.body).to.be.a('string');
   });
});
