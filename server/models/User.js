import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
  title: { type: String,default:'new'},
  language: { type: String, required: true },
  code: {type:String,default:''}
});

const workspaceSchema = mongoose.Schema({
  title: { type: String, required: true },
  cards: [cardSchema]
});

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    id:{type:String},
    ws: [workspaceSchema],
})
export default mongoose.model('User',userSchema);