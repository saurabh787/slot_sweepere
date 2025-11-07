require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./model/db');
const AuthRouter = require('./routes/authroute');

const bookingsRoute = require("./routes/booking");

const swapRoutes = require("./routes/swap");


// Connect DB
connectDB();

// ✅ Middlewares BEFORE routes
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// ✅ Routes
app.use('/auth', AuthRouter);

app.use("/api/bookings", bookingsRoute);

app.use("/api", swapRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
