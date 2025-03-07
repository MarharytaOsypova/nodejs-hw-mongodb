
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import router from './routers/contacts.js'
import {errorHandler} from './middlewares/errorHandler.js';
import {notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

export const setupServer =() => {
    const app = express();
  const PORT = process.env.PORT || 3000;
     app.use(cors());

     app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
  ); 

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



