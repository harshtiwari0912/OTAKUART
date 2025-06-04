const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const db = require('./config/mongoose-connection');
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouters');
app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);
app.listen(4000,()=>
{
    console.log('server is working');
})