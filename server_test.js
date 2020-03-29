let express = require('express');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
let moment = require('moment');
let hash = require('object-hash');
let multer = require('multer');
const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');
const session = require('express-session');
const uuid = require('uuid');

let messages = []; //array for store all the chat messages
let sessions = {}; //object associates sessions ids with usernames
let membersData = require('./data/members.json');
let members = membersData.users;
let activeUsers = {};
let TIMEOUT = 2000000000;
let upload = multer({
  dest: __dirname + '/uploads/'
});

// ========== server utilities =========================//
//generate random session Id
let generateIdSession = () => {
  return '' + Math.floor(Math.random() * 100000000);
};

let getInitiales = (firstname, lastname) => {
  return firstname.charAt(0) + lastname.charAt(0);
};

let getMember = username => {
  let searchUsername = members.filter(user => {
    if (user.username === username) return user;
  });
  return searchUsername[0];
};

let findSessionFromUser = (sessions, user) => {
  let session;
  for (let [key, value] of Object.entries(sessions)) {
    if (value === user) session = key;
  }
  return session;
};

let activingUsers = user => {
  let timeout = setTimeout(() => {
    delete activeUsers[user];
    delete sessions[findSessionFromUser(sessions, user)];
  }, TIMEOUT);
  clearTimeout(activeUsers[user]);
  activeUsers[user] = timeout;
};
// ========== server utilities =========================//

// ========== server           =========================//
let app = express();

// try session-parser
const map = new Map();
//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});
// try session-parser

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(sessionParser);
app.use('/', express.static(path.join(__dirname, 'build'))); // Needed for the HTML and JS files
app.use('/', express.static(path.join(__dirname, 'public'))); // Needed for local assets

// Your endpoints go after this line
// signup endpoint
app.post('/signup', upload.none(), (req, res) => {
  console.log("***** I'm the signup endpoint");
  let username = req.body.username;
  let hPassword = hash({
    passwordHashed: req.body.password
  });
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let checkUser = getMember(username);
  if (!checkUser) {
    let member = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: hPassword
    };
    let sessionId = generateIdSession();
    sessions[sessionId] = username;
    membersData.users.push(member);
    fs.writeFile('./data/members.json', JSON.stringify(membersData), 'utf8', function(err) {
      if (err) {
        console.log('An error occured while writing JSON Object to File.');
        return console.log(err);
      }
      console.log('JSON file has been saved.');
    });
    activingUsers(username);
    res.cookie('sid', sessionId);
    res.send(
      JSON.stringify({
        success: true,
        initials: getInitiales(member.firstname, member.lastname)
      })
    );
  } else {
    res.send(
      JSON.stringify({
        success: false
      })
    );
  }
});

//login endpoint
app.post('/login', upload.none(), (req, res) => {
  console.log("***** I'm the login endpoint");
  let username = req.body.username;
  let hPassword = hash({
    passwordHashed: req.body.password
  });
  let memberConnected = getMember(username);
  if (memberConnected) {
    let expectedPassword = memberConnected.password;
    if (hPassword === expectedPassword) {
      let sessionId = generateIdSession();
      req.session.userId = sessionId;
      sessions[sessionId] = username;
      activingUsers(username);
      let firtLetters = getInitiales(memberConnected.firstname, memberConnected.lastname);
      res.cookie('sid', sessionId);

      res.send(
        JSON.stringify({
          success: true,
          initials: firtLetters
        })
      );
      return;
    }
  }
  res.send(
    JSON.stringify({
      success: false
    })
  );
});

//logout endpoint
app.get('/logout', (req, res) => {
  console.log("***** I'm the logout endpoint");
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  delete sessions[sessionId];
  delete activeUsers[username];
  res.clearCookie('sid');
  res.send(
    JSON.stringify({
      success: true
    })
  );
  return;
});

// check login endpoint
app.get('/checklogin', (req, res) => {
  console.log("***** I'm the checklogin endpoint");
  let sessionId = req.cookies.sid;
  let memberConnected = getMember(sessions[sessionId]);
  if (memberConnected) {
    let firtLetters = getInitiales(memberConnected.firstname, memberConnected.lastname);
    if (sessions[sessionId]) {
      res.send(
        JSON.stringify({
          success: true,
          initials: firtLetters
        })
      );
      return;
    }
  }
  res.send(
    JSON.stringify({
      success: false
    })
  );
});
// get user online
app.get('/useronline', (req, res) => {
  res.send(JSON.stringify(Object.keys(activeUsers)));
  return;
});

// newmessage endpoint
app.post('/newmessage', upload.none(), (req, res) => {
  console.log('***** inside new message');
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let memberConnected = getMember(sessions[sessionId]);
  if (memberConnected) {
    let firtLetters = getInitiales(memberConnected.firstname, memberConnected.lastname);
    let msg = req.body.msg;
    let newMsg = {
      username: username,
      initiales: firtLetters,
      message: msg,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
    messages = messages.concat(newMsg);
    activingUsers(username);

    res.send(
      JSON.stringify({
        success: true
      })
    );
  }
});

// Your endpoints go before this line
//
// Create HTTP server by ourselves.
//
// try webSocket
let server = http.createServer(app);
const websocketServer = new WebSocket.Server({ noServer: true });
// const websocketServer = new WebSocket.Server({ server: server });
// server: server, path: '/test/',

// server.on('upgrade', function(request, socket, head) {
//   // console.log('Parsing session from request...', request.headers);
//   // // console.log('Parsing session from socket...', socket);
//   // console.log('Parsing session from head...', head);

//   // sessionParser(request, {}, () => {
//   //   if (!request.session.userId) {
//   //     socket.destroy();
//   //     return;
//   //   }

//   //   console.log('Session is parsed!');
//   var login = false;
//   // if (login) {
//   websocketServer.handleUpgrade(request, socket, head, function(ws) {
//     // console.log('in handleUpgrade', request.headers);
//     websocketServer.emit('connection', ws, request);
//   });
//   // }
//   // });
// });

websocketServer.on('connection', function connection(webSocketClient, request, clients) {
  //send feedback to the incoming connection
  // console.info('websocket connection open -  request', request);
  // console.info('websocket connection open', request.headers);
  // const userId = request.session.userId;
  // map.set(userId, ws);
  webSocketClient.on('upgrade', response => {
    console.log('response in upgrade', JSON.stringify(response));
    console.log('request.headers in upgrade', request.headers);
  });
  //when a message is received
  webSocketClient.on('message', message => {
    //for each websocket client
    // console.log(`Received message ${message} from user ${userId}`);
    // console.info('websocket message open -  request', request);
    // console.info('websocket message open -  client', client);
    console.log('message', JSON.parse(message));
    let msgReceive = JSON.parse(message);
    let sessionId = msgReceive.cookies;
    let username = sessions[sessionId];
    let memberConnected = getMember(sessions[sessionId]);
    if (memberConnected) {
      console.log('memberConnected', memberConnected);
      let firtLetters = getInitiales(memberConnected.firstname, memberConnected.lastname);
      let newMsg = {
        username: username,
        initiales: firtLetters,
        message: msgReceive.message,
        date: moment().format('MMMM Do YYYY, h:mm:ss a')
      };
      messages = messages.concat(newMsg);
      websocketServer.clients.forEach(function each(client) {
        console.log('in map clients');
        if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
          //send the client the current message
          console.log(' client');
          client.send(JSON.stringify(messages));
        }
      });
    }
  });
  // webSocketClient.on('close', function() {
  //   map.delete(userId);
  // });
});
//
// Start the server.
//
server.listen(3001, '0.0.0.0', () => {
  console.log('Express server is running on localhost:3001');
});
