import mongoose from "mongoose";
import { normalizeLanguage } from "../utils/validation.js";

const cardSchema = mongoose.Schema({
  title: { type: String, default: 'new', trim: true, maxlength: 100 },
  language: {
    type: String,
    required: true,
    enum: ['cpp', 'python', 'javascript', 'java'],
    set: normalizeLanguage,
  },
  code: { type: String, default: '', maxlength: 100000 }
});

const workspaceSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  cards: [cardSchema]
});

const userSchema=mongoose.Schema({
    name:{type:String,required:true,trim:true,maxlength:100},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:true,minlength:8},
    id:{type:String},
    ws: [workspaceSchema],
})

userSchema.pre('validate', function() {
  if (this.ws && Array.isArray(this.ws)) {
    this.ws.forEach((workspace) => {
      if (workspace.cards && Array.isArray(workspace.cards)) {
        workspace.cards.forEach((card) => {
          if (card.language) {
            card.language = normalizeLanguage(card.language);
          }
        });
      }
    });
  }
});

userSchema.set('toJSON', {
  transform: (_document, returnedUser) => {
    delete returnedUser.password;
    delete returnedUser.__v;
    return returnedUser;
  },
});

export default mongoose.model('User',userSchema);