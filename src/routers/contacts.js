import { Router } from "express";
import { getAllContacts, getContactsId } from "../controllers/contacts";


const router =  express.Router();
router.get('/contacts', getAllContacts);
router.get('/contacts/:contactId', getContactsId )
    



export default router;

