require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecosort';
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to local MongoDB successfully');
  } catch (err) {
    console.log('Local MongoDB not running. Starting auto-fallback Mongo server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to Auto-Fallback In-Memory MongoDB successfully');
    } catch (fallbackErr) {
      console.error('MongoDB connection error:', fallbackErr);
    }
  }

  // Auto-seed initial data if database is empty
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Auto-seeding initial data...');
      const seedDB = require('./seed');
      await seedDB();
    }
  } catch (seedErr) {
    console.warn('Auto-seed check note:', seedErr.message);
  }
};

connectDB();


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Attach io to request for later use
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
