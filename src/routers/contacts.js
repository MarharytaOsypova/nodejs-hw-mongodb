import express from 'express';
import { Router } from "express";
import { createContactsController, deleteContactController, getAllContacts, getContactsId, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from './../utils/ctrlWrapper.js';


const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContactsId))
router.post('/contacts', jsonParser, ctrlWrapper(createContactsController))
router.patch('/contacts/:contactId', jsonParser, ctrlWrapper(patchContactController))
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController))

export default router;

