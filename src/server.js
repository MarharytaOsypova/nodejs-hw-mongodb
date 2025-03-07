
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import contactsRouter from './routers/contacts.js'

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
  
  app.use(contactsRouter); 
  
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
   
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
    });
    
     


} 



