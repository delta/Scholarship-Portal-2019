const signale = require('signale')
const config = require('../../config/config.js');
const schema = require('../models/defaultSchema.js')
const _USERNAME = config.auth.name
const _PASSWORD = config.auth.password
var upload = require('../../config/upload.js');


exports.renderLoginForm = (req,res) => {
  res.render('login');
}

exports.renderRegisterForm = (req,res) => {
  res.render('register');
}
//matching login credentials to create a new session
exports.validateLogin = (req, res) => {
  //checking for missing inputs
  if (!req.body.username || !req.body.password) {
    return res.redirect('/user/login')
  }
  // no missing inputs, go for further validations
  let username = req.body.username
  let password = req.body.password
  // wrong credentials
  if(username !== _USERNAME || password !== _PASSWORD ){
    return res.redirect('/user/login')
  }
  //correct credentials, create session
  req.session.user = {
    name:_USERNAME,
    password:_PASSWORD
  }
  return res.redirect(`/user/${_USERNAME}/register`)
}

exports.registerUser = (req,res) => {
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
      return res.redirect('/user/scholarship/register');
    }
    req.files.forEach( img => console.log(img))
    return res.render('status')
  })
}
