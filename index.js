require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;  // Default to 5000 if process.env.PORT is not defined

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const protect = require('./middleware/authMiddleware');


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// prisma.$connect().then(() => console.log("DB connected")).catch(console.error);





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




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// console.log(Object.keys(prisma));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const bookingRoutes = require('./routes/bookingRoutes')
app.use('/api/bookings', bookingRoutes);

const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api',wishlistRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews',reviewRoutes)

// const aiSearchRoute = require('./routes/aiSearch');
// app.use('/api/ai-Search' , aiSearchRoute)


const aiSearchRoute = require('./routes/aiSearch.js');
app.use('/api/ai-search', aiSearchRoute);


const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);


// after your other `app.use(...)` calls
const ownerRoutes = require('./routes/ownerRoutes');
app.use('/api/owner', ownerRoutes);


    
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI2YTVjMTk3NjU5NmNmOWMyYTgyMyIsImlhdCI6MTc0NjAzNzM0MSwiZXhwIjoxNzQ2MTIzNzQxfQ.1lodWsf8v_NU3_6Li5xZ2nvY25Fx-mRF8AChDUk-hEM