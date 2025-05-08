require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port =  5000;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const protect = require('./middleware/authMiddleware');


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Airbnb Clone Backend is running!');
});


app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You have access!', user: req.user });
});
  
// app.use('/api/properties', propertyRoutes);

const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api/properties', propertyRoutes);




app.listen(port, () => console.log(`Server running on port ${port}`));
// console.log(Object.keys(prisma));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const bookingRoutes = require('./routes/bookingRoutes')
app.use('/api/bookings', bookingRoutes);

const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api',wishlistRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews',reviewRoutes)
    
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI2YTVjMTk3NjU5NmNmOWMyYTgyMyIsImlhdCI6MTc0NjAzNzM0MSwiZXhwIjoxNzQ2MTIzNzQxfQ.1lodWsf8v_NU3_6Li5xZ2nvY25Fx-mRF8AChDUk-hEM