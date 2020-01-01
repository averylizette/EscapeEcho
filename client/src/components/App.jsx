import React, { Component } from 'react';
import { isLoading, setIsLoadingTo } from './component_functions/app.js'
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
        this.onLogOut = this.onLogOut.bind(this);
        this.setIsLoadingTo = this.setIsLoadingTo.bind(this);
    }

    setIsLoadingTo(state) {
        this.setState({
            isLoading: state
        })
    }

    componentDidMount() {
        //check for session token
        const obj = getFromStorage('main_app'); // ??? why main app ??
        if ( obj && obj.token) {
            const { token } = obj

            fetch('/api/account/verify?token=' + token) // ???
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else {
                        this.setIsLoadingTo(false)
                    }
                })
        } else {
            this.setIsLoadingTo(false)
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

    onSignUp(event) {
        event.preventDefault();
        
        const {
            signUpFirstName,
            signUpLastName,
            signUpEmail,
            signUpPassword
        } = this.state;

        this.setIsLoadingTo(true)

        fetch('/api/account/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                firstName: signUpFirstName,
                lastName: signUpLastName,
                email: signUpEmail,
                password: signUpPassword
            }),
        }).then(res => res.json())
        .then(json => {
            if (json.success) {
                this.setState({
                    signUpError: json.message,
                    isLoading: false,
                    signUpEmail: '',
                    signUpPassword: '',
                    signUpFirstName: '',
                    signUpLastName: ''
                }); // dont need to do this if I am then redirecting to another page because it will then clear automatically 
            } else {
                //console.log('here')
                this.setState({
                    signUpError: json.message,
                    isLoading: false
                })
            }
            
        })

    }

    onSignIn() {
        event.preventDefault();
        
        const {
            signInEmail,
            signInPassword,
        } = this.state;

        setIsLoadingTo(true)

        fetch('/api/account/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword
            }),
        }).then(res => res.json())
        .then(json => {
            console.log(json, 'json')
            setInStorage('main_app', {token: json.token})
            if (json.success) {
                this.setState({
                    signInError: json.message,
                    isLoading: false,
                    signInEmail: '',
                    signInPassword: ''
                }); // dont need to do this if I am then redirecting to another page because it will then clear automatically 
            } else {
                this.setState({
                    signInError: json.message,
                    isLoading: false
                })
            }  
        })
    }

    onLogOut(){
        setIsLoadingTo(true)

        const obj = getFromStorage('main_app'); // ??? why main app ??
        if ( obj && obj.token) {
            const { token } = obj

            fetch('/api/account/logout?token=' + token) // ???
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token: '',
                            isLoading: false
                        });
                    } else {
                        setIsLoadingTo(false)
                    }
                })
        } else {
            setIsLoadingTo(false)
        }

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
                       <form>
                        <label>sign in</label><br/>
                            <input type="email" placeholder="Email" value={signInEmail} onChange={this.onChangeSignInEmail}/><br/>
                            <input type="password" placeholder="Password" value={signInPassword} onChange={this.onChangeSignInPassword}/><br/>
                            <button onClick={this.onSignIn}>Sign In</button>
                        </form>
                    </div>
                    <br/>
                    <br/>
                    <form>
                        <label>sign up</label><br/> 
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
                    </form>
                </div>
            )
        }
        return (
            <div>
                <p>Account</p>
                <button onClick={this.onLogOut}>Sign Out</button>
            </div>
        );
    }
}

export default App;


//TODO seperate sign in sign up and loading into separate componets 