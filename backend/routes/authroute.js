const { signup, login } = require('../controller/authcontroller');
const { signupValidation, loginValidation } = require('../middleware/authvalidator');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;