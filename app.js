const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const Blockchain = require("./public/blockchain");
const P2P = require("./p2p");
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const websocket = require('./socket');
const indexRouter = require('./routes');

const { getBlockchain, createNewBlock } = Blockchain;
// const startP2PServer = P2P.startP2PServer;
// const connectToPeers = P2P.connectToPeers;
const { startP2PServer, connectToPeers } = P2P;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);

////////////////////////////////////////////
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get("/blocks", (req, res, next) => {
  res.send(getBlockchain());
});

app.post("/blocks", (req, res) => {
  const { body: {data} } = req;
  const newBlock = createNewBlock(data);
  res.send(newBlock);
});

app.post("/peers", (req, res) => {
  const { body: { peer } } = req;
  connectToPeers(peer);


  res.send(user);
});

const server = app.listen(app.get('port'), ()=> {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
  
websocket(server);

module.exports = app;
