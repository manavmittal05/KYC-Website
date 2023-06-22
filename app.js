if (!process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const expressError = require('./utils/expressError');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const expressSessions = require('express-session');
const localStrategy = require('passport-local');
const axios = require('axios');
const fs = require('fs');

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { isLoggedIn } = require('./middleware');


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/test2';



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect(dbUrl);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
})

const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.urlencoded({ extended: true }));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig = {
    // store,
    name: 'KYCSession',
    secret,
    resave: false,
    // security: true,  //PROVES HTTPS SUPPORT (LOCALHOST ISN'T HTTPS BUT IS HTTP, HENCE IT WONT WORK ON LOCALHOST)
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(expressSessions(sessionConfig));
app.use(flash());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// IMP NOTE FROM SIDHANT YADAV FOR REQ.USER AND PASSPORT
// 'req.user' is only available once the user has been deserialized from the session. 'passport.serializeUser()' is used 
// to push the authenticated user to the end of the session. 'passport.deserializeUser()' is used to retrieve the pushed
// user from the last entry of the session and attach it to the request object as req.user. Therefore, req.user is only 
// available after the user has been authenticated and deserialized from the session and hence, it should only be added 
// in the 'res.locals' object AFTER passport has deserialized the user. 

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/kyc', isLoggedIn, (req, res) => {
    res.render('kyc');
});


app.post('/kyc', upload.fields([{ name: 'idFront', maxCount: 1 }, { name: 'idBack', maxCount: 1 }]), (req, res) => {
    const dataBody = req.body;
    const user = req.user;

    const day = req.user.dob.getDate().toString().padStart(2, '0');
    const month = (req.user.dob.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = req.user.dob.getFullYear();

    const userDOB = `${day}/${month}/${year}`;

    // console.log(formattedDate);


    // Read the image file as a buffer
    const imagePath = `./uploads/${req.files.idFront[0].filename}`;
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the image buffer to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    let selfieImg = dataBody.selfie;
    selfieImg = selfieImg.split(',')[1];

    const axiosData = {
        dob: userDOB,
        name: user.fullname,
        gender: user.gender,
        aadhaar_number: dataBody.idNum,
        aadhaar_card: base64Image,
        selfie: selfieImg
    }

    console.log(axiosData);

    axios({
        method: 'post',
        url: 'http://141.148.199.47/verify_details',
        data: axiosData
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });


    // axios.post('http://141.148.199.47/verify_details', {

    // })



    // console.log(req.files);
    res.send(req.body, req.user);
});

// app.post('/kyc', (req, res) => {
//     // console.log(req.file);
//     res.send(req.body);
// });

app.get('/register', (req, res) => {
    // res.send('Register');
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, fullname, dob, gender, address, password } = req.body;
        const user = new User({ username, fullname, dob, gender, address });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, (e) => {
            if (e) return next(e);
            req.flash('success', 'Successfully registered!');
            res.redirect('/');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/register');
    }

});

app.get('/logout', (req, res) => {
    req.logout(req.user, e => {
        if (e) return next(e);

        req.flash('success', 'Successfully logged out!');
        res.redirect('/login');
    })
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    try {
        if (req.isAuthenticated(req, res)) {
            console.log('Authenticated');
            req.flash('success', 'Successfully logged in!');
            res.redirect('/');
        }
    }
    catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});