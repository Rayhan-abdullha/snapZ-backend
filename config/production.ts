import dotenv from 'dotenv';

dotenv.config();

export default {
  port: 8000,
  mode: 'production',
  name: 'snapZ',
  secret_access_token: process.env.SECRET_ACCESS_TOKEN
};
