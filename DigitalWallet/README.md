# Digital Wallet App

## Overview
This simulated digital wallet app allows users to securely manage their digital transactions. You can deposit funds, withdraw money, scan QR codes, generate QR codes, and view your transaction history.

## Features
- **Deposit Funds:** Easily add money to your wallet.
- **Withdraw Funds:** Withdraw your balance whenever needed.
- **Scan QR Codes:** Quickly make payments by scanning QR codes.
- **Generate QR Codes:** Create QR codes for easy sharing of your wallet address.
- **Transaction History:** Keep track of all your transactions in one place.

## User Access
You can log in using the following credentials:
- Email: user@admin.com
- Password: Admin123

Alternatively, you can register a new account. All passwords are securely hashed and will remain valid until the server is shut down.

## Setup Instructions
### Configuration
To establish a connection between the frontend and backend, you need to modify the .env files in both the backend and frontend directories. Follow these steps:
- **Locate the .env Files:**
  - In the backend folder.
  - In the frontend folder.
- **Edit the Files:** 
  - Replace the placeholder IP address with your private machine's IP address.

## Running the Server
After configuring the .env files, run the server to establish a successful connection. Once the server is up and running, you should be able to access all features of the Digital Wallet application seamlessly.

```
#BE 
npm run start

#FE
npm run web
```

