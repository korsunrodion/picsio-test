import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { clearDb, seedDb } from './utils';

chai.use(chaiHttp);

describe('[Router] Events', () => {
  beforeEach(async () => {
    await clearDb();
  })

  it('Test 1', async () => {
    await seedDb([
      {
        destinationName: 'destination1',
        url:'http://example.com',
        transport: 'http.post'
      },
      {
        destinationName: 'destination2',
        url:'http://example2.com',
        transport: 'http.get'
      },
      {
        destinationName: 'destination3',
        transport: 'console.log'
      }
    ], {
      defaultStrategy: 'ALL'
    })

    const res = await chai.request(app).post('/api/events').send({
      payload: { a: 1 },
      routingIntents: [
        { destinationName: 'destination1'},
        { destinationName: 'destination2'},
        { destinationName: 'destination3'},
        { destinationName: 'destination4'},
        { destinationName: 'destination5'}
      ]
    })

    expect(res.body).to.deep.equal({
      destination1: true,
      destination2: false,
      destination3: true,
      destination4: false,
      destination5: false
    })
  })

  it('Test 2', async () => {
    await seedDb([
      {
        destinationName: 'destination1',
        url:'http://example.com/',
        transport: 'http.post'
      },
      {
        destinationName: 'destination2',
        url:'http://example2.com/',
        transport: 'http.get'
      },
      {
        destinationName: 'destination3',
        transport: 'console.log'
      }
    ], {
      defaultStrategy: 'IMPORTANT'
    })

    const res = await chai.request(app).post('/api/events').send({
      payload: { a: 1 },
      routingIntents: [
        { destinationName: 'destination1', important: true },
        { destinationName: 'destination2', important: false },
        { destinationName: 'destination3', important: true },
        { destinationName: 'destination4', important: false },
        { destinationName: 'destination5', important: true }
      ]
    })

    expect(res.body).to.deep.equal({
      destination1: true,
      destination2: false,
      destination3: true,
      destination4: false,
      destination5: false
    })
  })

  it('Test 3', async () => {
    await seedDb([
      {
        destinationName: 'destination1',
        url:'http://example.com/',
        transport: 'http.post'
      },
      {
        destinationName: 'destination2',
        url:'http://example.com/',
        transport: 'http.get'
      },
      {
        destinationName: 'destination3',
        transport: 'console.log'
      }
    ], {
      defaultStrategy: 'ALL'
    })

    const res = await chai.request(app).post('/api/events').send({
      payload: { a: 1 },
      strategy: 'function onlyNegativeScore(routingIntents) { return routingIntents.filter(intent => intent?.score < 0); }',
      routingIntents: [
        { destinationName: 'destination1', score: 1 },
        { destinationName: 'destination2', score: -1 },
        { destinationName: 'destination3', score: 0 },
        { destinationName: 'destination4', score: -1 },
        { destinationName: 'destination5', score: 1 }
      ]
    })

    expect(res.body).to.deep.equal({
      destination1: false,
      destination2: true,
      destination3: false,
      destination4: false,
      destination5: false
    })
  })
})