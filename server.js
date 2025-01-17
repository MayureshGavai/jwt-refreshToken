import express from 'express';
import { config as configDotenv } from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import authRoute from './src/routes/auth.route.js';
import { verifyAccessToken, verifyAccessTokenFromCookies } from './src/middleware/auth.middleware.js';

configDotenv();

const app = express();
// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

app.use('/', authRoute);

app.get('/', verifyAccessTokenFromCookies, (req, res) => {
    res.render('index', { user: req.user });
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
