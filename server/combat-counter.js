const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , dotenv = require('dotenv').config()
    , massive = require('massive')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , socket = require('socket.io')
    , config = require('./config')

const sqlCtrl = require('./sqlController')

const app = new express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(__dirname + `/../dist/`));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: config.AUTH_DOMAIN,
    clientID: config.AUTH_CLIENT_ID,
    clientSecret: config.AUTH_CLIENT_SECRET,
    callbackURL: config.AUTH_CALLBACK,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    let { displayName, user_id } = profile;
    const db = app.get('db');

    db.get.find_User([user_id]).then(function (users) {
        if (!users[0]) {
            db.add.create_User([
                displayName,
                user_id
            ]).then(users => {
                return done(null, users[0].id)
            })
        } else {
            return done(null, users[0].id)
        }
    })
}))

///////////////////////////////////
////TESTING TOPLEVEL MIDDLEWARE////
///COMMENET OUT WHEN AUTH0 READY///
///////////////////////////////////
app.use(config.fakeAuth)

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: `/SavedFields`
}));

passport.serializeUser((id, done) => {
    done(null, id)
})
passport.deserializeUser((id, done) => {
    app.get('db').get.find_Session_User([id]).then((user) => {
        return done(null, user[0]);
    })
})

app.get('/auth/logout', function (req, res) {
    req.logOut();
    res.redirect(`/`)
})

// ==================================================

app.get('/auth/me', (req, res) => {
    if (!req.user) {
        res.status(404).send('User not found.');
    } else {
        res.status(200).send(req.user);
    }
})

app.get('/api/combats', sqlCtrl.getAllCombats);
app.get('/api/combat/:id', sqlCtrl.loadCombatants);
app.get('/api/status/:id', sqlCtrl.getAllStatuses);
app.get('/api/hash/:id', sqlCtrl.getHash);
app.get('/api/player/battle/:hash', sqlCtrl.getBattleByHash);
app.get('/api/player/fighter/:hash', sqlCtrl.getCombatantsbyHash);
app.get('/api/beast/:hash', sqlCtrl.getBeastbyHash);

app.post('/api/newfield', sqlCtrl.newField);
app.post('/api/settings', sqlCtrl.setTooltip);

app.delete('/api/battle/:id', sqlCtrl.deleteField);
app.delete('/api/fighter/:id', sqlCtrl.deleteFighter);
app.delete('/api/status/:id', sqlCtrl.deleteStatus);
app.delete('/api/weapon/:id', sqlCtrl.deleteWeapon);

app.patch('/api/battle', sqlCtrl.saveField);
app.patch('/api/theme/:theme', sqlCtrl.setTheme);

const path = require('path')

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

// ==========================================

const port = config.SERVER_PORT

massive(config.CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance);
});

const io = socket(app.listen(port, _ => {
    console.log(`Autumn Ends: The Frogs Settle Down Into The Earth ${port}`);
}))

// ====================================================

io.on('connection', socket => {
    socket.on('sub', interval => {
        setInterval(_ => {
            socket.emit('timer', new Date());
        }, interval)
    })

    socket.on('battleSend', data => {
        io.emit(`${data.hash}`, data)
    })

    socket.on('updateCount', data => {
        io.emit(`${data.hash}-count`, data)
    })

    socket.on('playerTop', data => {
        io.emit(`${data.hash}-top`, data)
    })

    socket.on('playerKill', data => {
        io.emit(`${data.hash}-kill`, data)
    })

    socket.on('playerUnTop', data => {
        io.emit(`${data.hash}-untop`, data)
    })

    socket.on('playerResurrect', data => {
        io.emit(`${data.hash}-resurrect`, data)
    })

    socket.on('playerHealth', data => {
        io.emit(`${data.hash}-health`, data)
    })

    socket.on('playerAddStatus', data => {
        io.emit(`${data.hash}-addStatus`, data)
    })

    socket.on('playerDelStatus', data => {
        io.emit(`${data.hash}-delStatus`, data)
    })

    socket.on('playerAdd', data => {
        io.emit(`${data.hash}-add`, data)
    })

    socket.on('playerRemove', data => {
        io.emit(`${data.hash}-remove`, data)
    })

    socket.on('playerClear', data => {
        io.emit(`${data.hash}-clear`)
    })

    socket.on('playerEdit', data => {
        io.emit(`${data.hash}-edit`, data)
    })

    socket.on('playerWeapon', data => {
        io.emit(`${data.hash}-weapon`, data)
    })

    socket.on('playerHide', data => {
        io.emit(`${data.hash}-hide`, data)
    })
})
