import createError from "http-errors";
import {patchContact, createContacts, getContactsAll, getContactsID, deleteContact, getAllContact } from "../services/contacts.js";
import { parsePaginationParams } from './../utils/parsePaginationParams.js';
import { parseSortParams } from './../utils/parseSortParams.js';
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";


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
     const userId = req.user._id;
    const contact = await getContactsID(contactId, userId);
    
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
    const photo = req.file;
   let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
    contactData.photo = photoUrl;
  }

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
    const userId = req.user._id;
    const photo = req.file;
   
  let photoUrl;

   if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedContact = await patchContact(contactId, { ...contact, photo: photoUrl }, userId);

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }


    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact
    });

}; 

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
     const userId = req.user._id;
        const contact = await deleteContact(contactId,userId);
    if (!contact) {
 throw createError(404, "Contact not found");
        }

        res.status(204).send();

};

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const userId = req.user._id;
  const result = await getAllContact({ page, perPage,sortBy,sortOrder,userId });
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: result,
  });
};

 

  