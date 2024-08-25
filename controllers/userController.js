const { User } = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();


const loginUser = async (email, password, res) => {
  try {

    if (!(email && password)) {
      return {result: "error occurred",status: 500};
    }
    var user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      var token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      return {result: "success",status: 200,token: token};
    } else {
      return {result: "error occurred",status: 500};
    }
  } catch (err) {
    console.log(err);
  }
}

const registerUser = async (name, email, password, res) => {
  try {

    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return {result: "error occurred",status: 500};
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    return {result: "success",status: 200,user: user};
  } catch (e) {
    return {result: "error occurred",status: 500,error_message: e};
  }
}
const getUserWithId = async (id) => {
  try{
    const user = await User.findOne({where: {id: parseInt(id),status: 1},attributes: ['id', 'name','books']});
    return {result: "success",status: 200,user: user};
  }catch(e){
    return {result: "error occurred",status: 500,error_message: e};
  }
}

const getAllUsers = async () => {
  try{
    const allUsers = await User.findAll({ where: { status: 1 },attributes: ['id', 'name','books']  });
    return {result: "success",status: 200,users: allUsers};
  }catch(e){
    return {result: "error occurred",status: 500,error_message: e};
  }
}

const saveUser = async (body) => {
  try{
    await User.create({ name: body.name,status: 1,books: {past:[],present:[]}},{raw: true});
    return {result: "success",status: 200};
  }catch(e){
    return {result: "error occurred",status: 500,error_message: e};
  }
}

const updateUser = async (id, body) => {
  try{
    await User.update(body,{ where: { id: id } });
    return {result: "success",status: 200};
  }catch(e){
    return {result: "error occurred",status: 500,error_message: e};
  }
}

const deleteUserWithId = async (id) => {
  try{
    await User.update({ status: 2 },{ where: { id: id } });
    return {result: "success",status: 200};
  }catch(e){
    return {result: "error occurred",status: 500,error_message: e};
  }
}


module.exports = {
  registerUser,
  getUserWithId,
  getAllUsers,
  saveUser,
  updateUser,
  deleteUserWithId,
  loginUser
}