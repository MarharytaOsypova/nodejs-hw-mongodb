import { getContactsAll, getContactsID } from "../services/getcontacts";


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

}
  

  