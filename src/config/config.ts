export default () => ({
  db: process.env.DB_URL,
  port: parseInt(process.env.PORT, 10) || 3000,
  api_medic_username: process.env.API_MEDIC_USERNAME,
  api_medic_password: process.env.API_PASSWORD,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  front_url: process.env.FRONT_URL,
});
