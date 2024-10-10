const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.SERVICE_PORT;
const host = process.env.SERVICE_HOST;

let balance = 8000000

const QRCode = require('qrcode')

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline';");
  next();
});

app.post('/generate-qr', (req, res) => {
  const { amount, transactionID } = req.body;
    if (!amount || !transactionID ) return res.status(500).send('You need to send all keys')

    // Construct the URL for redirection
    const redirectUrl = `/redirect-to-process-payment?amount=${amount}&transactionID=${transactionID}`;

    // const qrData = JSON.stringify({ amount, transactionID })
    const qrData = `http://${host}:${port}${redirectUrl}`;
    QRCode.toDataURL(qrData, (err, url) => {
        if (err) return res.status(500).send('Error generating QR code')
          // Send JSON response
          res.json({ qrCode: url })

          // Or send HTML response
          // res.send(`<img src="${url}">`);
        
    })
})

app.get('/redirect-to-process-payment', (req, res) => {
  const { amount, transactionID } = req.query;

  // Create an HTML form that submits via POST
  const formHtml = `
      <form id="paymentForm" action="/process-payment" method="POST">
          <input type="input" name="amount" value="${amount}">
          <input type="input" name="transactionID" value="${transactionID}">
          <button type="submit" name="button-submit">Confirmar</button>
      </form>
      
  `;
  
  res.send(formHtml);
});


app.post('/process-payment', (req, res) => {
    const { amount, transactionID } = req.body;
    console.log(`Payment received for amount: ${amount}, transaction ID: ${transactionID}`);


    // Process the payment
    if (amount > balance) {
      return res.status(400).json({ message: 'Insufficient funds in your account to process the payment' });
    }

    balance -= amount;

    // Update the balance in the database
    // Replace this with my own database implementation

    // For demonstration purposes, let's assume the payment processing is successful
    res.status(200).json({ message: 'Payment processed successfully' });
})


// Middleware for parsing JSON request bodies
app.use(express.json());

// Route to create a new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  // Check if required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if email is in a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check if password meets the required complexity requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }

  // Store the new user in the database
  // Replace this with your own database implementation
  const users = [
    // Existing users...
    { id: 1, name, email, password },
  ];

  res.status(201).json({ message: 'User created successfully', user: users[users.length - 1] });
});

// Route to authenticate a user
app.post('/auth', (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are provided
  if (!email ||!password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find the user in the database
  // Replace this with your own database implementation
  const users = [
    // Existing users...
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
  ];

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate a JWT token for the authenticated user
  // Replace this with your own JWT token generation logic

  const token = 'your_jwt_token_here';
  res.json({ message: 'Authentication successful', token });
  // You can store the JWT token in the user's session or send it as a response header
  // res.setHeader('Authorization', `Bearer ${token}`);
});

app.get("/login", (req, res) => {
  res.send("Login")
} )

app.get("/", (req, res) => {
  res.send("Digital Wallet Server");
})

app.get("/get-balance", (req, res) => {
  res.send({ balance: balance })
} )

// Start the server
app.listen(port, () => {
  console.log(`Digital Wallet server listening at http://${host}:${port}`);
});