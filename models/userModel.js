//userModel.js
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');

const userSchema= new mongoose.Schema({
  name: {
    type: String, 
    trim: true,
    required: [true, "user name is required"],
  },
  email: {
    type: String,
    required: [true, 'user email is required'],
    unique: [true, 'email used before'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, "Password must be at least 6 characters"]
  },
  phone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String
  },
  role: {
    type: String, 
    enum: ['user', 'admin'],
    default: 'user'
  },
  wishList: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  addresses: [
    {
      alias: String,
      details: String,
      city: String,
      postalCode: String,
      phone: String,
    }
  ],
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
},
{
  timestamps: true,
});

//works in the create
userSchema.post('save', function(doc) {
  doc.profileImage= `${process.env.BASE_URL}/users/${doc.profileImage}`;
});
//works with the find
userSchema.post('init', function(doc) {
  doc.profileImage= `${process.env.BASE_URL}/users/${doc.profileImage}`;
});

//hash password before saving it to database(works for the create function)
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password= await bcrypt.hash(this.password, 12);
  next();
});


module.exports= mongoose.model('User', userSchema);