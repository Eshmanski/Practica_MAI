const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const nodeConfig = require('./config/node.config.json');
const mongodbConfig = require('./config/mongodb.config.json');
const mongoose = require('mongoose');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const router = require('./routes/router');
const varMiddleware = require('./middleware/variables');

const { PORT } = nodeConfig;
const { mUser, mPassword, clusterName, clusterId, databaseName} = mongodbConfig;
const MONGODB_URI = `mongodb+srv://${mUser}:${mPassword}@${clusterName}.${clusterId}.mongodb.net/${databaseName}`

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    if_eq: function(a, b, opts) {
      if (a === b) {
          return opts.fn(this);
      } else {
          return opts.inverse(this);
      }
    }
  }
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(csrf());
app.use(flash());
app.use(varMiddleware);

app.use(router);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Web-Server is started on port: ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

start();
