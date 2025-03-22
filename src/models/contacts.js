import { Schema, model } from "mongoose";

 
const contactsShema = new Schema(
    {
         
        name: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            required: true,
        },

        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            required: true,
            default: 'personal',
        },
            
        userId: {
        type: Schema.Types.ObjectId, 
        required: true,

        },

    },

      {
    timestamps: true,
  },
        

    
);

export const Contact = model("contact", contactsShema);


