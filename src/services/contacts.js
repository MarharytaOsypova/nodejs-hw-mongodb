
 
import { SORT_ORDER } from '../constants/sort.js';
import { Contact } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
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

export const getAllContact = async ({ page, perPage, sortOrder = SORT_ORDER.ASC,sortBy = '_id', }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const totalItems = await Contact.countDocuments();

  const contacts = await Contact.find().skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};