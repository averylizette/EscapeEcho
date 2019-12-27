// This file will contain all endpoints related to logging in.
const User = require('../../models/User')

module.exports = (app) => {
 
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const { 
        firstName,
        lastName,
        password 
    } = body;

    let {email} = body;

    if (!firstName) {
        // res.end: Use to quickly end the 
        //response without any data. If you need to respond with data, instead use methods such as res.send()
        // could do something like:
        //res.end()
        //res.status(404).end()
        return res.send({
            success: false,
            message: 'Error: missing first name'
        })
    }

    if (!lastName) {
        return res.send({
            success: false,
            message: 'Error: missing last name'
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
    
    // verify email doesn't exist and if it doesnt then save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
          // ??? do I need or want the return statement here and in the following else if ???
          // return res.send vs not returning return res.send()
          return res.send({
          success: false,
          message: 'Error: error in signin.js when trying to look up the email. User probably doesnt exist in our system'
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
      newUser.firstName = firstName
      newUser.lastName = lastName
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
            return res.send({
            success: false,
            message: 'Error: Server error, unable to save user'
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


//TODO: validate email