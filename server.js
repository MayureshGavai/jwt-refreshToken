import express from 'express';
import { config as configDotenv } from 'dotenv'; // Import and configure dotenv
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './src/routes/auth.route.js';
import studentsRoute from './src/routes/students.route.js';
import { verifyAccessToken } from './src/middleware/auth.middleware.js';

configDotenv(); // Ensure dotenv is configured here


const app = express();
app.use(morgan('dev'));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

const PORT = process.env.PORT || 3000;


app.use('/auth/', authRoute);

app.use('/students/', studentsRoute);



app.get('/', verifyAccessToken, async (req, res, next) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
