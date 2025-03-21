import express from 'express';
import { Router } from "express";
import { createContactsController, deleteContactController, getAllContacts, getContactsController, getContactsId, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from './../utils/ctrlWrapper.js';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

 
const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId',isValidId, ctrlWrapper(getContactsId))
router.post('/',jsonParser, validateBody(createContactsSchema),  ctrlWrapper(createContactsController))
router.patch('/:contactId', isValidId,jsonParser, validateBody(updateContactsSchema),  ctrlWrapper(patchContactController))
router.delete('/:contactId',isValidId, ctrlWrapper(deleteContactController))

export default router;

