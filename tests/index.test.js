const { describe, it } = require('mocha');
const expect = require('chai').expect;
const nock = require('nock');
const index = require('../index');

const DUMMY_TOKEN_RESPONSE = {
    "Token": "7dc776-e42-48b6-844b-646767dcab_DUMMY",
    "BaseUrl": "https://services.universalorlando.com/api/",
    "ServicesBaseUrl": "https://services.universalorlando.com/",
    "TokenExpirationString": "2021-01-06T15:55:11-05:00",
    "TokenExpirationUnix": 1609966512,
    "ExPassNotificationInvervalInMin": 5,
}

const DUMMY_POI_RESPONSE  = {
    Rides: [],
    Restaurants: [],
    ATMS: [],
}

const DUMMY_POI_RIDES_RESPONSE = {
    Rides: [{
        "MinHeightInInches": 40,
        "MaxHeightInInches": null,
        "ExpressPassAccepted": true,
        "WaitTime": 70,
        "Category": "Rides",
        "MblDisplayName": "Despicable Me Minion Mayhem™",
        "LandId": 10143,
    },
        {
            "MinHeightInInches": 40,
            "MaxHeightInInches": null,
            "ExpressPassAccepted": true,
            "WaitTime": 35,
            "OpensAt": null,
            "ClosesAt": null,
            "HasChildSwap": true,
            "Category": "Rides",
            "MblDisplayName": "The Amazing Adventures of Spider-Man®",
            "LandId": 10138,
        },
        {
            "WaitTime": 5,
            "RideTypes": [
                "KidFriendly"
            ],
            "Category": "Rides",
            "MblDisplayName": "Caro-Seuss-el™",
            "LandId": 10142,
            "DetailImages": [
                "https://services.universalorlando.com/api/Images/IOA-Caro_detail1.jpg",
                "https://services.universalorlando.com/api/Images/IOA-Caro_detail2.jpg",
                "https://services.universalorlando.com/api/Images/IOA-Caro_detail3.jpg"
            ],
            "ListImage": "https://services.universalorlando.com/api/Images/IOA-Caro_list.jpg",
        }]
}

describe('GET /', () => {

    it('Successfully all POI data from universal API', async () => {
        nock('https://services.universalorlando.com')
            .post('/api')
            .reply(200, DUMMY_TOKEN_RESPONSE);

        nock('https://services.universalorlando.com')
            .get('/api/pointsOfInterest')
            .reply(200, DUMMY_POI_RESPONSE);

        const response = await index.handler({ httpMethod: 'GET', path: '/' }, null);

        expect(response.statusCode).to.be.a('number').that.equals(200);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.Rides).to.be.a('array').that.deep.equals([])
        expect(res.Restaurants).to.be.a('array').that.deep.equals([])
        expect(res.ATMS).to.be.a('array').that.deep.equals([])
    });

    it('Catches an error when universal API call fails', async () => {
       nock('https://services.universalorlando.com')
           .get('/api')
           .replyWithError({
               message: 'Unauthorized',
               code: 403,
           });

        const response = await index.handler({ httpMethod: 'GET', path: '/' }, null);

        expect(response.statusCode).to.be.a('number').that.equals(500);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.message).to.be.a('string').that.deep.equals('Failed to retrieve point of interest data from Universal API')
    });
});


describe('GET /rides/park', () => {

    it('Groups rides for all the theme parks', async () => {
        nock('https://services.universalorlando.com')
            .post('/api')
            .reply(200, DUMMY_TOKEN_RESPONSE);

        nock('https://services.universalorlando.com')
            .get('/api/pointsOfInterest')
            .reply(200, DUMMY_POI_RIDES_RESPONSE);

        const response = await index.handler({ httpMethod: 'GET', path: '/rides/park' }, null);

        expect(response.statusCode).to.be.a('number').that.equals(200);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.parks['10138'].length).to.be.a('number').that.deep.equals(1)
        expect(res.parks['10142'].length).to.be.a('number').that.deep.equals(1)
        expect(res.parks['10143'].length).to.be.a('number').that.deep.equals(1)
    });

    it('Catches errors when communicating with universal services /rides/park', async () => {
        nock('https://services.universalorlando.com')
            .post('/api')
            .replyWithError({
                message: 'Unauthorized',
                code: 403
            })

        const response = await index.handler({ httpMethod: 'GET', path: '/rides/park' }, null);

        expect(response.statusCode).to.be.a('number').that.equals(500);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.message).to.be.a('string').that.deep.equals("Failed to retrieve ride data from Universal API")
        expect(res.parks).to.be.a('object');
    });
});


describe('GET /rides/park/:parkId', () => {

    it('Returns error for invalid park Id', async () => {
        const response = await index.handler({httpMethod: 'GET', path: '/rides/park/BAD_ID'}, null);
        expect(response.statusCode).to.be.a('number').that.equals(400);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.message).to.be.a('string').that.deep.equals('The park id must be an integer between 4 and 6 digits long.')
    });

    it('Finds all rides for a specific park', async () => {
        nock('https://services.universalorlando.com')
            .post('/api')
            .reply(200, DUMMY_TOKEN_RESPONSE);

        nock('https://services.universalorlando.com')
            .get('/api/pointsOfInterest')
            .reply(200, DUMMY_POI_RIDES_RESPONSE);

        const response = await index.handler({httpMethod: 'GET', path: '/rides/park/10134'}, null);

        expect(response.statusCode).to.be.a('number').that.equals(200);
        expect(response.body).to.be.a('string');
        const res = JSON.parse(response.body);
        expect(res.parks['10138'].length).to.be.a('number').that.deep.equals(1)
        expect(res.parks['10142'].length).to.be.a('number').that.deep.equals(1)
        expect(res.parks['10143'].length).to.be.a('number').that.deep.equals(1)
    });
});
