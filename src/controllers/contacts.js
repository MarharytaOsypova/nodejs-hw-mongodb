import createError from "http-errors";
import {patchContact, createContacts, getContactsAll, getContactsID, deleteContact, getAllContact } from "../services/contacts.js";
import { parsePaginationParams } from './../utils/parsePaginationParams.js';
import { parseSortParams } from './../utils/parseSortParams.js';


export const getAllContacts = async (req, res) => {

    const contacts =await getContactsAll();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });

  
}

export const getContactsId = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactsID(contactId);
    	if (!contact) {
 throw createError(404, "Contact not found");
}
    res.status(200).json({
      status: 200,
  message: `Successfully found contact with id ${contactId}!`,
      data: contact
})

}
  
export const createContactsController = async (req, res) => {
      const contactData = { ...req.body, userId: req.user._id };

  const newContact = await createContacts(contactData);
    
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact
    })
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = req.body;

    const result = await patchContact(contactId, contact);

    if (!result) {
 throw createError(404, "Contact not found");
    }


    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
        const contact = await deleteContact(contactId);
    if (!contact) {
 throw createError(404, "Contact not found");
        }

        res.status(204).send();

};

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
  const result = await getAllContact({ page, perPage,sortBy,sortOrder, });
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: result,
  });
};

 

  