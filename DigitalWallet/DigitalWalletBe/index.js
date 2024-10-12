import authenticateToken, { generateAccessToken } from './middlewares/authTokenMiddleware.js';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import QRCode from 'qrcode'
import bcrypt from 'bcrypt';


// Load environment variables

dotenv.config();


const app = express();
const port = process.env.SERVICE_PORT;
const host = process.env.SERVICE_HOST;

app.use(cors());

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline';");
  next();
});


// Array of users for authentication purposes
  // Find the user in the database
  const users = [
    // Existing users...
    { id: 1, name: 'Fernando Pérez', email: 'fernandojp@example.com', password: '$2b$10$/v7gNVaj2acOTU3zaFuJXe5Re3JpUZUrGmqDNKsrznQsc/d36.uce', balance: 800000 },
    { id:2, name: 'User Admin', email: 'user@admin.com', password: '$2b$10$tbYNk0o5xIawARC1tGUO6uy7K6Y1B1vvGvlPJIK0xwr1H.JE5qlOG', balance: 180000 } // Admin123
  ];


app.get("/", authenticateToken, (req, res) => {
  res.send("Digital Wallet Server");
})

// Route to authenticate a user
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are provided
  if (!email ||!password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }
    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      // Generate a JWT token for the authenticated user
      const token = generateAccessToken({ id: user.id, email: user.email });
      const username = user.name;
      // Send token back to the client
      res.json({ message: 'Authentication successful', user: username, token });
      // You can store the JWT token in the user's session or send it as a response header
      // res.setHeader('Authorization', `Bearer ${token}`);
        // res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error verifying password' });
}
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if email is in a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Check if password meets the required complexity requirements
  const passwordRegex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).*$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }

  try {
    // Generate a salt and hash the password
    const saltRounds = 10; // You can adjust the cost factor
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Here you would typically save the username and hashedPassword to your database
    users.push({ id: users.length + 1, name, email, password: hashedPassword });

    res.status(201).json({ success: true });
  
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user' });
  }

})

app.get("/login", (req, res) => {
  res.send("Login")
} )

app.get("/get-balance", authenticateToken, (req, res) => {

  // Find the user in the database
  const user = users.find(u => u.email === req.user.email);
  res.send({ balance: user.balance ? user.balance : 0.00 })
} )

app.post("/deposit", authenticateToken, (req, res) => {
  const { amount } = req.body;
  const user = users.find(u => u.email === req.user.email);
  user.balance = user.balance ? user.balance + parseFloat(amount) : parseFloat(amount);
  res.send({ message: 'Deposit successful' })
})


app.post('/generate-qr', authenticateToken, (req, res) => {
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

app.get('/redirect-to-process-payment', authenticateToken, (req, res) => {
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


app.post('/process-payment', authenticateToken, (req, res) => {
    const { amount, transactionID } = req.body;
    console.log(`Payment received for amount: ${amount}, transaction ID: ${transactionID}`);

    let balance = users.find(u => u.email === req.user.email).balance;

    // Process the payment
    if (amount > balance) {
      return res.status(400).json({ message: 'Insufficient funds in your account to process the payment' });
    }

    balance -= amount;

    // Update the balance in the database
    users.find(u => u.email === req.user.email).balance = balance;

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
  const users = [
    // Existing users...
    { id: 1, name, email, password },
  ];

  res.status(201).json({ message: 'User created successfully', user: users[users.length - 1] });
});


// Start the server
app.listen(port, () => {
  console.log(`Digital Wallet server listening at http://${host}:${port}`);
});