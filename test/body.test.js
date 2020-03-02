const request = require('supertest');
const app = require('./app');

describe('validate body', () => {
  describe('when the request contains a valid payload', () => {
    it('should return a 200 ok response', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.status).toBe(200);
    });
  });

  describe('when the request contains an invalid payload', () => {
    it('should return a 400 response and a single error', async () => {
      const login = {
        email: 'andrew.keiggmail.com',
        password: '12356',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.status).toBe(400);
      expect(response.body.errors.body.length).toBe(1);
      expect(response.body.errors.body[0].path[0]).toBe('email');
    });
  });

  describe('when the request has a missing item in payload', () => {
    it('should return a 400 response and a single error', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: ''
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.status).toBe(400);
      expect(response.body.errors.body.length).toBe(1);
      expect(response.body.errors.body[0].path[0]).toBe('password');
    });
  });

  describe('when the request has multiple missing items in payload', () => {
    it('should return a 400 response and two errors', async () => {
      const login = {
        email: '',
        password: '',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.status).toBe(400);
      expect(response.body.errors.body.length).toBe(1);
      expect(response.body.errors.body[0].path[0]).toBe('email');
    });
  });

  describe('when the request has extra items in payload', () => {
    it('should return a 400 response and one error', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
        token: '1234',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.status).toBe(400);
      expect(response.body.errors.body.length).toBe(1);
      expect(response.body.errors.body[0].message).toBe('"token" is not allowed');
    });
  });
});
