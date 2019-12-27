// This file will contain all endpoints related to logging in.
const User = require('../../models/User')

module.exports = (app) => {
 
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const { 
        firstName,
        lastName,
        email,
        password 
    } = body;

    if (!firstName) {
        // res.end: Use to quickly end the 
        //response without any data. If you need to respond with data, instead use methods such as res.send()
        // could do something like:
        //res.end()
        //res.status(404).end()
        
        res.end({
            success: false,
            message: 'Error: missing first name'
        })
    }

    if (!lastName) {
        res.end({
            success: false,
            message: 'Error: missing first name'
        })
    }

    
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up'
        });
      });
    });
  }); // end of sign up endpoint
};