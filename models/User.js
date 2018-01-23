import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

// TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    name: {
      type: String
    },
    bio: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    avatar: { type: String, default: null },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" },
    likes: [{
      fossilId: { type: String },
      count: { type: Number }
    }]
  },
  { timestamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  console.log(password, this.passwordHash);
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(this.passwordHash, 10, function(err, hash) {
    user.passwordHash = hash;
    next();
  });
});

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  return `${
    process.env.HOST
  }/reset_password/${this.generateResetPasswordToken()}`;
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      username: this.username,
      confirmed: this.confirmed
    },
    process.env.JWT_SECRET
  );
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    confirmed: this.confirmed,
    username: this.username,
    name: this.name,
    token: this.generateJWT(),
    avatar: this.avatar,
    id: this._id,
    likes: this.likes,
    title: this.title,
    bio: this.bio
  };
};

schema.plugin(uniqueValidator, {
  message: "It is already taken, try another one."
});

export default mongoose.model("User", schema);
