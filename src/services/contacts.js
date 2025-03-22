
 
import { SORT_ORDER } from '../constants/sort.js';
import { Contact } from '../models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
export const getContactsAll = async () => {
    
    const contactsAll = await Contact.find()
    return contactsAll
};

export const getContactsID = async (contactId, userId) => {
return await Contact.findOne({ _id: contactId, userId });
};

export const createContacts = async (contact) => {
    const contacts = await Contact.create(contact)
    return contacts
};

export const patchContact = async (contactId, contact, userId,) => {
   return await Contact.findOneAndUpdate({ _id: contactId, userId }, contact, { new: true });

};

export const deleteContact = async (contactId,userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export const getAllContact = async ({ page, perPage, sortOrder = SORT_ORDER.ASC,sortBy = '_id',userId }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const totalItems = await Contact.countDocuments({userId});

  const contacts = await Contact.find({userId}).skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};