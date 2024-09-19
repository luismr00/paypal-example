// const fetch = require('node-fetch');
// const { process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET } = require('../utils/config');
require('dotenv').config();
const crypto = require('crypto');

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';  // Change to production URL for live environment

// const getAuthHeader = async () => {
//     const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Accept-Language': 'en_US',
//             'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: 'grant_type=client_credentials'
//     });

//     const data = await response.json();
//     console.log(data.access_token);
//     return `Bearer ${data.access_token}`;
// };


const getAuthHeader = async () => {
  // console.log(process.env.PAYPAL_CLIENT_ID);
  // console.log(process.env.PAYPAL_CLIENT_SECRET);
  // To base64 encode your client id and secret using NodeJs
  const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  console.log(BASE64_ENCODED_CLIENT_ID_AND_SECRET);

  const request = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
          method: "POST",
          headers: {
              Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
          },
          body: new URLSearchParams({
              grant_type: "client_credentials",
              response_type: "id_token",
              intent: "sdk_init",
          }),
      }
  );
  const json = await request.json();
  return json.access_token;
}


const createOrder = async (req, res) => {
    const { planId } = req.body;
    
    try {
        console.log('Plan ID', planId);
        const accessToken = await getAuthHeader();
        // console.log('Token', accessToken);
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                plan_id: planId,
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '10.00',
                    }
                }],
                application_context: {
                  // return_url: process.env.BASE_URL + '/complete-order',
                  // cancel_url: process.env.BASE_URL + '/cancel-order',
                  brand_name: "What Are You Buying App",
                  locale: "en-US",
                  shipping_preference: "NO_SHIPPING",
                  user_action: "PAY_NOW"
                }
            })
        });

        const data = await response.json();
        res.json({ id: data.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createSubscription = async (req, res) => {
    const { planId } = req.body;

    try {
        const accessToken = await getAuthHeader();
        const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                plan_id: planId,
                application_context: {
                  brand_name: "RE4 MERCHANT",
                  locale: "en-US",
                  shipping_preference: "NO_SHIPPING",
                  user_action: "PAY_NOW"
                }
            })
        });

        const data = await response.json();
        res.json({ id: data.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware to verify PayPal webhook signature
const verifyWebhookSignature = (req, res, next) => {
  const transmissionId = req.headers['paypal-transmission-id'];
  const transmissionTime = req.headers['paypal-transmission-time'];
  const certUrl = req.headers['paypal-cert-url'];
  const authAlgo = req.headers['paypal-auth-algo'];
  const transmissionSig = req.headers['paypal-transmission-sig'];
  const webhookId = 'YOUR_WEBHOOK_ID'; // Replace with your webhook ID

  const expectedSignature = crypto.createHmac('sha256', 'YOUR_WEBHOOK_SECRET')
      .update(transmissionId + "|" + transmissionTime + "|" + webhookId + "|" + JSON.stringify(req.body))
      .digest('base64');

  if (expectedSignature === transmissionSig) {
      next();
  } else {
      res.status(400).send('Invalid signature');
  }
};

// Controller to handle PayPal webhook events
const handleWebhook = (req, res) => {
  const event = req.body;

  switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
          // Handle subscription creation
          console.log('Subscription created:', event);
          // Add your logic here
          break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
          // Handle subscription activation
          console.log('Subscription activated:', event);
          // Add your logic here
          break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
          // Handle subscription cancellation
          console.log('Subscription cancelled:', event);
          // Add your logic here
          break;
      // Add more cases as needed
      default:
          console.log('Unhandled event type:', event.event_type);
  }

  res.sendStatus(200);
};

const cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;

  try {
      const accessToken = await getAuthHeader();
      const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          }
      });

      console.log("Cancellation initiated");

      // Check if the response body is empty
      const text = await response.text();
      if (!text) {
          console.log("Empty response body");
          return res.status(200).json({ status: 'Cancellation initiated' });
      }

      const data = await response.json();
      console.log(data);
      res.status(200).json({ status: data.status });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { createOrder, createSubscription, verifyWebhookSignature, handleWebhook, cancelSubscription };
