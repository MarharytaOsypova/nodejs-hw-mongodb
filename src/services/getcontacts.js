
import { Contact } from '../models/contacts.js';
export const getContactsAll = async () => {
    
    const contactsAll = await Contact.find()
    return contactsAll
};

export const getContactsID = async (contactId) => {
    const contactsId = await Contact.findById(contactId)
    return contactsId

};