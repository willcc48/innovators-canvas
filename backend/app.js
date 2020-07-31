var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require('url');
const querystring = require('querystring');
var bodyParser = require('body-parser');
const axios = require('axios');
var monk = require('monk');
var session = require('express-session');
const http = require('http');
var open = require('open');
var cors = require('cors');
require('dotenv').config();

var login_url = 'https://oauth.oit.duke.edu/oauth/authorize.php?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A9000&client_id=innovators-canvas&scope=basic&state=1129&client_secret=2nA!QE=qgr73rUlKgvkjX!k4foCg!W#4KP*co4tSVgYVxHz*qd';
var logout_url = 'https://oauth.oit.duke.edu/Shibboleth.sso/Logout?return=https://shib.oit.duke.edu/cgi-bin/logout.pl';

var app = express();
const mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var allowedOrigins = ['http://localhost:3000', 'http://localhost:9000'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }, credentials: true
}));

mongoose.connect(process.env.ATLAS_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})
const userSchema = new mongoose.Schema({imgDrags: String,
                                        netid: String, firstName: String, lastName: String, stress: String, strengths: String, 
                                        behaviors: String, energy: String, experience_bias: String, voice: String, values: String,
                                        fixed_mindset: String, growth_mindset: String, vision: String, purpose: String, deliberate_practices: String });
const User = mongoose.model('User', userSchema);

app.use(session({resave: true, saveUninitialized: true, secret: 'XCR3rsasa%RDHHH', cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}}));

/* GET home page. */
app.get('/', function(req, res, next) {
    if(req.session.netid) {
        return res.render('index', { login_link: './logout_old',
            login_text: 'Logout', title: 'Hi logged in user!' });
    }
    return res.render('index', { login_link: login_url, login_text: 'Login', title: 'Hello, Generic User' });
});

/* GET home page. */
app.get('/index.html', function(req, res, next) {
    return res.redirect('/');
});

/* GET about page. */
app.get('/about.html', function(req, res, next) {
    return res.render('about', { login_link: login_url, login_text: 'Login' });
});

/* GET contact page. */
app.get('/contact.html', function(req, res, next) {
    return res.render('contact', { login_link: login_url, login_text: 'Login' });
});

app.get('/test', function(req, res, next) {
    if(req.session.netid) {
        return res.json({
            netid: req.session.netid,
            firstName: req.session.firstName,
            lastName: req.session.lastName
        });
    }
    return res.json({netid: 'NO USER SESSION'});
});

/* GET canvas page. */
app.get('/canvas.html', async function(req, res, next) {
    var flag = false;
    if(req.session.netid) {
        flag = true;
        var myquery = {"netid" : req.session.netid};
        const user = await User.findOne(myquery);

        return res.render('./canvas', { login_link: './logout_old',
            login_text: 'Logout', title: 'Hi '+user.firstName
            +' '+user.lastName+' '+user.netid+'', problem: user.problem });
    }

    if(!flag) {
        return res.render('index', { login_link: login_url, login_text: 'Login', title: 'Not logged in!' });
    }
});

/* GET logout. */
app.get('/logout', function(req, res, next) {
    if(req.session.netid) {
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            open(logout_url, function (err) {
                if ( err ) throw err;    
            });
        });
        return res.send('done');
    }
    return res.send();
});

/* GET logout. */
app.get('/logout_old', function(req, res, next) {
    if(req.session.netid) {
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            open(logout_url, function (err) {
                if ( err ) throw err;    
            });
        });
        return res.redirect('/');
    }
    return res.render('index', { login_link: login_url, login_text: 'Login', title: 'Not logged in!' });
});

/* GET canvas data. */
app.get('/userinfo', function(req, res, next) {
    if(req.session.netid) {
        var myquery = {netid : req.session.netid};
        User.findOne(myquery, function(err, user) {
            if(user==null) {
                var my_user = new User({
                    imgDrags: '[]', netid: req.session.netid, firstName: req.session.firstName, lastName: req.session.lastName,
                    stress: '<h3>Stress</h3>', strengths: '<h3>Strengths</h3>', behaviors: '<h3>Behaviors</h3>', energy: '<h3>Energy</h3>',
                    experience_bias: '<h3>Experience Bias</h3>', voice: '<h3>Voice</h3>', values: '<h3>Values</h3>', fixed_mindset: '<h3>Fixed Mindset</h3>',
                    growth_mindset: '<h3>Growth Mindset</h3>', vision: '<h3>Vision</h3>', purpose: '<h3>Purpose</h3>',
                    deliberate_practices: '<h3>Deliberate Practices</h3>'});
    
                my_user.save(function(err,result) {
                    User.findOne(myquery, function(err, user) {
                        return res.json({imgDrags: user.imgDrags, netid: user.netid, firstName: user.firstName, lastName: user.lastName, stress: user.stress, strengths: user.strengths,
                            behaviors: user.behaviors, energy: user.energy, experience_bias: user.experience_bias, voice: user.voice,
                            values: user.values, fixed_mindset: user.fixed_mindset, growth_mindset: user.growth_mindset, vision: user.vision,
                            purpose: user.purpose, deliberate_practices: user.deliberate_practices });
                    });
                })
            } else {
                return res.json({imgDrags: user.imgDrags, netid: user.netid, firstName: user.firstName, lastName: user.lastName, stress: user.stress, strengths: user.strengths,
                    behaviors: user.behaviors, energy: user.energy, experience_bias: user.experience_bias, voice: user.voice,
                    values: user.values, fixed_mindset: user.fixed_mindset, growth_mindset: user.growth_mindset, vision: user.vision,
                    purpose: user.purpose, deliberate_practices: user.deliberate_practices });
            }
        })
    }
    else{
        return res.json({});
    }
});

/* POST canvas data. */
app.post('/canvas_data', async function(req, res) {
    var userData = JSON.stringify(req.body);
    userData = JSON.parse(userData);

    var saved_res = res;
    var myquery = { netid: req.session.netid };
    var newvalues = { $set: {imgDrags: userData['imgDrags'], stress: userData['stress'], strengths: userData['strengths'], behaviors: userData['behaviors'], energy: userData['energy'],
                             experience_bias: userData['experience_bias'], voice: userData['voice'], values: userData['values'], 
                             fixed_mindset: userData['fixed_mindset'], growth_mindset: userData['growth_mindset'], vision: userData['vision'],
                             purpose: userData['purpose'], deliberate_practices: userData['deliberate_practices']}};

    await User.findOneAndUpdate(myquery, newvalues, {useFindAndModify: false});
    return saved_res.end();
});

/* process POST to root to GET login data */
app.post('/', function(req, res) {
    var access_token = req.body.access_token;
    axios.get('https://api.colab.duke.edu/identity/v1/', {
        headers: {
            'x-api-key': 'innovators-canvas',
            'Authorization': `Bearer ${access_token}`
        }
    }).then((response) => {
        req.session.firstName = response.data.firstName;
        req.session.lastName = response.data.lastName;
        req.session.netid = response.data.netid;
        res.send('done');
      });
});

app.use(express.static("views"));

app.get('p5.js', function(req, res, next) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname+'/views/p5.js'));
});

app.get('p5.sound.min.js', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/views/p5.sound.min.js'));
});

app.get('sketch.js', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/views/sketch.js'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;