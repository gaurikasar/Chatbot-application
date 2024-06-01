import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import createServer from '../app.js'
import mongoose from "mongoose"

const signup = jest.fn();

jest.mock('../helpers/user', () => ({
  signup: jest.fn(),
  login:jest.fn()
}));

const mockUserData = {
  _id: 'mockUserId',
  email: 'test@example.com',
  // Add other necessary user data fields here
};

// Mock user token for testing
const mockToken = jwt.sign(mockUserData, process.env.JWT_PRIVATE_KEY);
const validUser = {
  email: 'valid@example.com',
  pass: 'validPassword123',
};
jest.mock('jsonwebtoken'); // Mock jsonwebtoken

describe("POST /signup", () => {
  beforeEach(() => {
    user.signup.mockReset();
  });

  describe("given a username and password", () => {
    test("should save the username and password to the database", async () => {
      const bodyData = { username: "username1", password: "password1", fname: "abc", lname: "def" };
      const req = { body: bodyData }; // Simulated request object with a body property
      const res = {}; // Simulated response object

      // Mock the response functions
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);

      // Mock the return value of user.signup function
      user.signup.mockResolvedValue({ username: bodyData.username });
      user.signup.mockResolvedValue({ password: bodyData.password });
      user.signup.mockResolvedValue({ fname: bodyData.fname });
      user.signup.mockResolvedValue({ lname: bodyData.lname });

      await user.signup(req.body, res);

      expect(user.signup.mock.calls.length).toBe(1);
      expect(user.signup.mock.calls[0][0].username).toBe(bodyData.username);
      expect(user.signup.mock.calls[0][0].password).toBe(bodyData.password);
      expect(user.signup.mock.calls[0][0].fname).toBe(bodyData.fname);
      expect(user.signup.mock.calls[0][0].lname).toBe(bodyData.lname);
      
    });

    
  });
  

});

describe("GET /login route", () => {
 
  test("Check if login route is called", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const userInput = {
      email: "test@example.com",
      name: "Jane Doe",
      password: "Password123",
      passwordConfirmation: "Password123",
    };
   const userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    name: "Jane Doe",
  };
   const loginUserService = jest.spyOn(user,"login").mockReturnValueOnce(userPayload)
    const app = createServer;
   const  req = {
    get: () => {
      return "a user agent";
    },
    body: {
      email: "test@example.com",
      password: "Password123",
    },
  };
  const send = jest.fn();

  const res = {
    send,
  };  
  
  });
   
});


describe("GET /login route", () => {
  it('should check if GPT 3.5 works', async () => {
    return frisby
      .get(`${global.apiUrl}/my-weather-endpoint`)
      .expect('status', 200)
      .expect('jsonTypes', Joi.object({
        cnt: Joi.number().required(),
        cod: Joi.string().required(),
        city: Joi.object({
          coord: Joi.object({ 
            lat: Joi.number().required(),
            lon: Joi.number().required()
          }),
          country: Joi.string().required(),
          id: Joi.number().required(),
          name: Joi.string().required(),
          population: Joi.number().required(),
          timezone: Joi.number().required()
      }).required()
    }));
  });
});
  


