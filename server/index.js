// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paypalRoutes = require('./routes/paypalRoutes');
// const paypalWebhookRoutes = require('./routes/paypalWebhookRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/paypal', paypalRoutes);
// app.use('/paypal', paypalWebhookRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
