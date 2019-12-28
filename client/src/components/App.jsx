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
            token: ''
        };
        
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
    
    
    render() {
        const {
            isLoading,
            token,
        } = this.state

        if (isLoading) {
            return <div><p>Loading...</p></div>
        }

        if (!token) {
            return (
                <div>
                    <div>
                       <p>sign in</p>
                        <input type="email" placeholder="Email"/><br/>
                        <input type="password" placeholder="Password"/><br/>
                        <button>Sign In</button>
                    </div>
                    <br/>
                    <br/>
                    <p>sign up</p>
                    <input type="text" placeholder="First Name"/><br/>
                    <input type="text" placeholder="Last Name"/><br/>
                    <input type="email" placeholder="Email"/><br/>
                    <input type="password" placeholder="Password"/><br/>
                    <button>Sign Up</button>
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