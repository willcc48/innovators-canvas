var express = require('express');
var router = express.Router();

router.get("/users", (req, res) => {
    res.json([{
        id: 1,
        username: "samsepi0l"
    }]);
  });

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.netid) {
        return res.render('index', { login_link: './logout',
            login_text: 'Logout', title: 'Hi logged in user!' });
    }
    return res.render('index', { login_link: login_url, login_text: 'Login', title: 'Hello, Generic User' });
});

/* GET home page. */
router.get('/index.html', function(req, res, next) {
    return res.redirect('/');
});

/* GET about page. */
router.get('/about.html', function(req, res, next) {
    return res.render('about', { login_link: login_url, login_text: 'Login' });
});

/* GET contact page. */
router.get('/contact.html', function(req, res, next) {
    return res.render('contact', { login_link: login_url, login_text: 'Login' });
});

/* GET canvas page. */
router.get('/canvas.html', function(req, res, next) {
    var flag = false;
    if(req.session.netid) {
        flag = true;
        var users = req.db.get('users');
        var myquery = {"netid" : req.session.netid};
        users.findOne(myquery, function(e, docs) {
            req.db.close();

            return res.render('./canvas', { login_link: './logout',
                login_text: 'Logout', title: 'Hi '+docs.firstName
                +' '+docs.lastName+' '+docs.netid+'', problem: docs.problem });
        });
    }

    if(!flag) {
        return res.render('index', { login_link: login_url, login_text: 'Login', title: 'Not logged in!' });
    }
});

/* GET logout. */
router.get('/logout', function(req, res, next) {
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

router.post('/canvas_data', function(req, res) {
    var probs = JSON.stringify(req.body);
    probs = JSON.parse(probs);
    probs = probs['problem'];
    console.log(probs);
    var users = req.db.get('users');

    var saved_res = res;

    var myquery = { netid: req.session.netid };
    var newvalues = { $set: {problem: probs }};
    users.update(myquery, newvalues, function(err, res) {
        if (err) throw err;
        req.db.close();
        var response = { problem : probs }
        return saved_res.end(JSON.stringify(response));
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* process POST to root to GET login data */
router.post('/', function(req, res) {
    sess=req.session;
    var access_token = req.body.access_token;
    axios.get('https://api.colab.duke.edu/identity/v1/', {
        headers: {
            'x-api-key': 'innovators-canvas',
            'Authorization': `Bearer ${access_token}`
        }
    }).then((response) => {
        console.log(response.data);
        sess.firstName = response.data.firstName;
        sess.lastName = response.data.lastName;
        sess.netid = response.data.netid;
        res.send('done');
      });
});

module.exports = router;
