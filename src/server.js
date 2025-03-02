
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import { getContactsAll, getContactsID } from './services/getcontacts.js';

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
  
  app.get('/contacts', async (req, res) => {
    const contacts =await getContactsAll();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });

  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactsID(contactId);
      
    
    	if (!contact) {
	  res.status(404).json({
		  message: 'Contact not found'
	  });
	  return;
	}
    res.status(200).json({
      status: 200,
  message: `Successfully found contact with id ${contactId}!`,
      data: contact
})
  })
  
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
   
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
    });
    
     


} 



