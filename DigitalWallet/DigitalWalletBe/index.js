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
    { id: 0, name: 'Fernando Pérez', email: 'fernandojp@example.com', password: '$2b$10$/v7gNVaj2acOTU3zaFuJXe5Re3JpUZUrGmqDNKsrznQsc/d36.uce', balance: 800000 },
    { id: 1, name: 'User Admin', email: 'user@admin.com', password: '$2b$10$tbYNk0o5xIawARC1tGUO6uy7K6Y1B1vvGvlPJIK0xwr1H.JE5qlOG', balance: 180000 } // Admin123
  ];

// Array of transactions
const transactions = [
    {
    id: 0,
    amount: 1000,
    transactionID: 123456789,
    date: '2022-01-01',
    status: 'success',
    type: 'deposit',
    user_id: 0
  },
  {
    id: 1,
    amount: 500,
    transactionID: 987654321,
    date: '2022-01-02',
    status: 'pending',
    type: 'withdraw',
    user_id: 1
  },
  {
    id: 2,
    amount: 2000,
    transactionID: 456789123,
    date: '2022-01-03',
    status: 'failed',
    type: 'deposit',
    user_id: 1
  },
  {
    id: 3,
    amount: 1500,
    transactionID: 789123456,
    date: '2022-01-04',
    status: 'success',
    type: 'withdraw',
    user_id: 1
  }
];

app.post("/add-transaction", authenticateToken, (req, res) => {
  const { amount, transactionID, status, type, id } = req.body;

  // Get the current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  if (id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { id, amount, transactionID, status, type, user_id: req.user.id, date: formattedDate };
      res.send({message: "Transaction updated successfully", transactions, status: "success"});
    } else {
      res.status(404).json({message: "Transaction not found", status: "failed"});
    }
  } else {
    transactions.push({ id: transactions.length + 1, amount, transactionID, status, type, user_id: req.user.id, date: formattedDate });
    res.json({message: "Transaction updated successfully", transactions, status: "success"});
  }
  
})

app.get("/get-transactions", authenticateToken, (req, res) => {
  const type = req.query.type;

  if (type && type !== 'all') {
    const userTransactions = transactions.filter(t => t.user_id === req.user.id && t.type === type).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (userTransactions.length === 0) {
      return res.status(400).json({message: "No transactions found", status: "failed"});
    }

    res.json({transactions: userTransactions, status: "success"})
  } else {
    res.json({transactions: transactions.filter(t => t.user_id === req.user.id).sort((a, b) => new Date(b.date) - new Date(a.date)), status: "success"})
  }
})

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
    console.log("users length: " + users.length)
    // Here you would typically save the username and hashedPassword to your database
    users.push({ id: users.length + 1, name, email, password: hashedPassword, balance: 0.00 });

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
  if (!amount) return res.status(500).send('You need to send all keys')
  const user = users.find(u => u.email === req.user.email);
  user.balance = user.balance ? user.balance + parseFloat(amount) : parseFloat(amount);
  res.send({ message: 'Deposit successful' })
})

app.post("/withdraw", authenticateToken, (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(500).json({message: 'You need to send all keys', status: "failed"})
  const user = users.find(u => u.email === req.user.email);

  if (!user) {
    return res.status(400).json({message: 'User not found', status: "failed"})
  }

  if (amount > user.balance) {
    return res.status(400).json({message: 'Insufficient funds in your account', status: "failed"})
  }
  
  user.balance = user.balance ?  user.balance - parseFloat(amount) : parseFloat(amount);
  res.json({ message: 'Withdrawal successful', status: "success" })
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

    const user = users.find(u => u.email === req.user.email);
    console.log(user)

    if (!user) {
      return res.status(400).json({ message: 'User not found', status: "failed" });
    }
    // Find the user's current balance in the database
    let balance = user.balance;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount', status: "failed" });
    }

    // Process the payment
    if (amount > balance) {
      return res.status(400).json({ message: 'Insufficient funds in your account to process the payment', status: "failed" });
    }

    // Update the balance in the database
    if (balance - amount === 0) {
      user.balance = 0.00;
    } else {
      user.balance -= amount;
    }

    

    // Replace this with my own database implementation

    // For demonstration purposes, let's assume the payment processing is successful
    res.status(200).json({ message: 'Payment processed successfully', status: "success" });
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