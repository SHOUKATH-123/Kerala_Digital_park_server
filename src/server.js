import express from 'express'
import cookieParser from 'cookie-parser';
import config from './config/env.js'
import router from './app.js'
import cors from 'cors'
import connectDB from './infrastructure/database/connection.js'

const app = express();


app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// app.use((req, res, next) => {
//     console.log(`📨 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
//     next();
// });

app.use('/api', router);


const PORT = config.PORT || 5000


connectDB()
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} in ${config.NODE_ENV || 'development'} mode`);
});
