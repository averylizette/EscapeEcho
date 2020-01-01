import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        
    }

    onChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value
        })
    }

    onChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value
        })
    }

    
    
    render() {
        return (
            <div>
                howdy partner 
            </div>
        );
    }
}

export default Login;


