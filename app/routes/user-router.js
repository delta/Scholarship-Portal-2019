const router = require('express').Router();
const user = require('../controllers/user-controller.js');

//sessionChecker middlewares
let sessionChecker = (req,res,next) =>{
  if(!req.session.user){
    res.redirect('/user/login')
  }else{
    next()
  }
}

// register
router.get('/:username/register',sessionChecker, user.renderRegisterForm)
router.post('/:username/register',sessionChecker, user.registerUser)

// // register
// router.get('/:username/register', user.renderRegisterForm)
// router.post('/:username/register', user.registerUser)


// login
router.get('/login',user.renderLoginForm)
router.post('/login',user.validateLogin)



module.exports = router
