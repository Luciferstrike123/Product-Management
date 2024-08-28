const express = require('express')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const database = require('./config/database')

require('dotenv').config()

const adminRoute = require('./routes/admin/index.route')
const route = require('./routes/client/index.route')
const systemConfig = require('./config/system')

database.connect();

const app = express()
const port = process.env.PORT;
// override with POST having ?_method=
app.use(methodOverride('_method'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Flash
app.use(cookieParser('qwheuripfdsnjkcnsjkfiqwhrquewpr'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`))

//Routes
adminRoute(app)
route(app)

app.listen(port, () => console.log(`Example app listening on port ${port}`))