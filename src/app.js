const express = require('express'); 
const userRoute = require('./api/routes/usersRoute');
const orderRoute = require('./api/routes/ordersRoute');
const authRoute = require('./api/routes/authRoute');
const port = 8080;
const app = express();

app.use(express.json());
app.use('/user', userRoute);
app.use('/order', orderRoute);
app.use('/', authRoute);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});

// add timestamps and userId to logs