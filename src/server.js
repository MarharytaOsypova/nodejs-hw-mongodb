
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import {errorHandler} from './middlewares/errorHandler.js';
import {notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { UPLOAD_DIR } from './constants/index.js';



export const setupServer =() => {
    const app = express();
  const PORT = Number(getEnvVar('PORT', '3000'));
  app.use(cors());
  app.use(cookieParser());

     app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
  ); 
app.use('/auth/uploads', express.static(UPLOAD_DIR));
    app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Ok',
    });
  });
  
  app.use(router); 
  

  app.use(notFoundHandler)

  app.use(errorHandler)
   
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
    });
    
     


} 



