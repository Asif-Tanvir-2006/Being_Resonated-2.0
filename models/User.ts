import mongoose from 'mongoose'


const userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  
  email:{type:String,required:true},
  dob:{type:Date,required:false},
  events:[{type:mongoose.Schema.Types.ObjectId,required:false,ref:"Event"}],
  gradYear:{type:Number,required:false},
  password:{type:String,select:false},
  image:{type:String,required:false},
  interests:[{type:String,required:false}],
  teams:[{type:mongoose.Schema.Types.ObjectId,required:false,ref:"Team"}],
  assignedWorks: [ {
     work: { type: String, required: false },
     completionDate:{type:Date,required:true},
     team: { type:mongoose.Schema.Types.ObjectId, ref: 'Team', required: true } }],
  role:{type:String,default:'user'},
  authProviderId:{type:String},
  posts:[{type:String,required:false}],

},{timestamps:true})

export const User=mongoose.models?.User || mongoose.model("User",userSchema);