// utils/paypalClient.js

// import fetch from 'node-fetch';
require('dotenv').config();

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // PayPal Sandbox API

// Get PayPal API access token
async function getAccessToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

module.exports = { getAccessToken };
