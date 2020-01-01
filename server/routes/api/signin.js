// This file will contain all endpoints related to logging in.
const User = require('../../models/User')
const UserSession = require('../../models/UserSession')

module.exports = (app) => {
 
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    console.log(body)
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
  }); 

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let {email} = body;

    if (!email) {
        return res.send({
        success: false,
        message: 'Error: Email cannot be blank. (login)'
      });
    }

    if (!password) {
        return res.send({
        success: false,
        message: 'Error: Password cannot be blank. (login)'
      });
    }

    email = email.toLowerCase();
    // now we need to find the user and validate their password 
    User.find({email: email}, (err, users) => {
        if (err) {
        return res.send({
            success: false,
            message: 'Error: Email not found in system (login)'
            });
        }
        if (users.length !== 1) {
            return res.send({
                success: false,
                message: 'No user was found matching this email'
                });
        }
        const user = users[0]
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Invalid password'
            });
        }
        // otherwise create user session

        const userSession = new UserSession()

        userSession.userId = user._id // Mongo has an automatic userid, so this is the id returned from the search result 
        userSession.save((err, doc) => { // chance doc to session for clarity TODO
            if (err) {
                return res.send({
                    success: false,
                    message: 'Failed to save user session'
                });
            }
            return res.send({
                success: true,
                message: 'Valid sign in',
                token: doc._id
            })
        })

    })

  });

  app.get('/api/account/verify', (req, res, next) => {
      /*steps:
      get the token
      verify the token is one of a kind and not deleted
      */
     const { query } = req;
     const { token } = query;

     UserSession.find({
         _id: token,
         isDeleted: false
     }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: "Error: Failed to validate session"
            })
        }

        if (sessions.length !== 1) {
            return res.send({
                success: false,
                message: "Error: Number of sessions are either 0 or more than one"
            })
        } else {
            return res.send({
                success: true,
                message: "Valid session"
            })
        }
     })

  });

  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true}

    }, null, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: "Error: Failed to logout of session"
            })
        } else {
            return res.send({
                success: true,
                message: "Logged out"
            })
        }
    })

    });
};


//TODO: validate email
// TODO: modularize functions 
// TODO: Promises