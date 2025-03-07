
import { Contact } from '../models/contacts.js';
export const getContactsAll = async () => {
    
    const contactsAll = await Contact.find()
    return contactsAll
};

export const getContactsID = async (contactId) => {
    const contactsId = await Contact.findById(contactId)
    return contactsId

};

export const createContacts = async (contact) => {
    const contacts = await Contact.create(contact)
    return contacts
};

export const patchContact = async (contactId, contact) => {
    return Contact.findByIdAndUpdate(contactId, contact, { new: true })
};

export const deleteContact = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId)
    return contact
};