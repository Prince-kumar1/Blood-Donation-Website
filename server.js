const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db.js');
const socketManager = require('./socket');
const http = require('http');
dotenv.config();

//mongodb connection
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketManager.init(server);

// Make io accessible to routes
app.set('socketio', io);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/test',require('./routes/testRroute.js'))
app.use('/api/v1/auth',require('./routes/authRoute.js'))
app.use('/api/v1/inventory',require('./routes/inventoryRoutes.js'))
app.use('/api/v1/analytics',require('./routes/analyticsRoutes.js'))
app.use("/api/v1/admin", require("./routes/adminRoutes.js"));

const PORT = process.env.PORT || 8080;

// Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`Server running in ${process.env.DEV_MODE} on ${process.env.PORT}`.bgBlue.white ));