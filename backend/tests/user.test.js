const request = require('supertest');
const app = require('../server'); // Aapka express app

describe('Auth API Tests', () => {
  
  // Test Case 1: Status Code Check
  it('should return 200 for a successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "ruchita@gmail",
        password: "ruchita"
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test Case 2: Error Handling Check
  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "ruchita@gmail",
        password: "wrongpassword"
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

});