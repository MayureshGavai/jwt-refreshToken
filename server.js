import express from 'express'
import { configDotenv } from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoute from './src/routes/auth.route.js'
import studentsRoute from './src/routes/students.route.js'

const app = express()
app.use(morgan('dev'))
app.use(express.json());
configDotenv()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



app.set('view engine','ejs')
app.set('views', path.join(__dirname,'src/views'))

const PORT = process.env.PORT || 3000

app.use('/auth/',authRoute)

app.use('/students/', studentsRoute);


app.get('/',async (req,res,next)=>{
    res.render('index')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})