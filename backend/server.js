const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Create default accounts
const initializeUsers = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    console.log('Default admin created');
  }

  const user = await User.findOne({ username: 'user' });
  if (!user) {
    await User.create({ username: 'user', password: 'user123', role: 'user' });
    console.log('Default user created');
  }
};

connectDB().then(initializeUsers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
