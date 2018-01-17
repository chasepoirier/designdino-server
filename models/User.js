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
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" }
  },
  { timestamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// schema.pre('save', function(next) {

//   const user = this;

//   bcrypt.hash(this.passwordHash, 10, function(err, hash) {
//     console.log(hash);
//     console.log(user);
//     user.passwordHash = hash;
//     next();
//   });
  
// });

// schema.methods.setPassword = function setPassword(password) {
//   // this.passwordHash = bcrypt.hashSync(password, 10);

//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, 10, function(err, hash) {
//       if(err) {
//         reject(err);
//       } else {
//         resolve(hash);
//       }
//     });
//   });
// };


// schema.methods.setPassword = function setPassword(password) {
//   // this.passwordHash = bcrypt.hashSync(password, 10);
  
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, 10, function(err, hash) {
//       if(err) {
//         reject(Error(err));
//         console.log(err);
//       } else {
//         this.passwordHash = hash;
//         resolve();
//       }
//     });
//   });
// };

schema.methods.createNewUser = function createNewUser(user) {
  return new Promise((resolve, reject) => {

    let passwordHash;

    bcrypt.hash(user.password, 10, function(err, hash) {
      if(err) {
        reject(Error(err));
      } else {
        passwordHash = hash;

        let newUser = ({ 
          email: user.email, 
          username: user.username, 
          passwordHash: passwordHash, 
          name: user.name });
        resolve(newUser)
        // return newUser;
      }
    });
    
  });
}

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
    token: this.generateJWT()
  };
};

schema.plugin(uniqueValidator, {
  message: "It is already taken, try another one."
});

export default mongoose.model("User", schema);
