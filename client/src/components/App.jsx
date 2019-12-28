import React, { Component } from 'react';
import { getFromStorage, setInStorage} from '../../utils/storage.js';
import 'whatwg-fetch';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            signUpError: '',
            signInError:'',
            token: '',
            signInEmail: '',
            signInPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpError: '',
            signUpEmail: '',
            signUpPassword: ''
        };
        this.onChangeSignInEmail = this.onChangeSignInEmail.bind(this);
        this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
        this.onChangeSignUpPassword = this.onChangeSignUpPassword.bind(this);
        this.onChangeSignUpFirstName = this.onChangeSignUpFirstName.bind(this);
        this.onChangeSignUpLastName = this.onChangeSignUpLastName.bind(this);
        this.onChangeSignUpEmail = this.onChangeSignUpEmail.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
    }

    componentDidMount() {
        //check for session token
        const token = getFromStorage('main_app'); // ??? why main app ??
        if (token) {
            //verify token
            fetch('/api/account/verify?token=' + token) // ???
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        })
                    }
                })
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }
    
    onChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value
        })
    }
    onChangeSignUpEmail(event) {
        this.setState({
            signUpEmail: event.target.value
        })
    }
    onChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value
        })
    }

    onChangeSignUpPassword(event) {
        this.setState({
            signUpPassword: event.target.value
        })
    }

    onChangeSignUpFirstName(event) {
        this.setState({
            signUpFirstName: event.target.value
        })
    }

    onChangeSignUpLastName(event) {
        this.setState({
            signUpLastName: event.target.value
        })
    }

    onSignUp() {
        const {
            signUpFirstName,
            signUpLastName,
            signUpEmail,
            signUpPassword
        } = this.state;

        this.setState({
            isLoading: true
        })

        fetch('/api/account/signup', {
            method: 'POST',
            body: JSON.stringify({
                firstName: signUpFirstName,
                lastName: signUpLastName,
                email: signUpEmail,
                password: signUpPassword
            }),
        }).then(json => {
            if (json.success) {
                this.setState({
                    signUpError: json.message,
                    isLoading: false,
                    signUpEmail: '',
                    signInPassword: '',
                    signUpFirstName: '',
                    signUpLastName: ''
                }) // dont need to do this if I am then redirecting to another page because it will then clear automatically 
            }
            
        })

    }

    onSignIn() {

    }
    
    render() {
        const {
            isLoading,
            token,
            signInError,
            signInPassword,
            signUpEmail,
            signInEmail,
            signUpFirstName,
            signUpLastName,
            signUpError,
            signUpPassword
        } = this.state;

        if (isLoading) {
            return <div><p>Loading...</p></div>
        }

        if (!token) {
            return (
                <div>
                    <div>
                        {
                            (signInError) ? (
                                <p>{signInError}</p>
                            ) : (null)
                        }
                       <p>sign in</p>
                        <input type="email" placeholder="Email" value={signInEmail} onChange={this.onChangeSignInEmail}/><br/>
                        <input type="password" placeholder="Password" value={signInPassword} onChange={this.onChangeSignInPassword}/><br/>
                        <button onClick={this.onSignIn}>Sign In</button>
                    </div>
                    <br/>
                    <br/>
                    <p>sign up</p>
                    {
                            (signUpError) ? (
                                <p>{signUpError}</p>
                            ) : (null)
                        }
                    <input type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onChangeSignUpFirstName}/><br/>
                    <input type="text" placeholder="Last Name" value={signUpLastName} onChange={this.onChangeSignUpLastName}/><br/>
                    <input type="email" placeholder="Email" value={signUpEmail} onChange={this.onChangeSignUpEmail}/><br/>
                    <input type="password" placeholder="Password" value={signUpPassword} onChange={this.onChangeSignUpPassword}/><br/>
                    <button onClick={this.onSignUp}>Sign Up</button>
                </div>
            )
        }
        return (
            <div>
                <p>Account</p>
            </div>
        );
    }
}

export default App;


//TODO seperate sign in sign up and loading into separate componets 