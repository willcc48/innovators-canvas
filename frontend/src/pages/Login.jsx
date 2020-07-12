import React, { Component } from 'react'
import ResponsiveNavigation from '../components/ResponsiveNavigation';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            netid: '',
            problem: '',
        }
    }

    componentDidMount() {
        window.location = "https://oauth.oit.duke.edu/oauth/authorize.php?response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&client_id=innovators-canvas&scope=basic&state=1129&client_secret=2nA!QE=qgr73rUlKgvkjX!k4foCg!W#4KP*co4tSVgYVxHz*qd";
    }

    

    getLoginText() {
        return (
            <div>You will be redirected to login.</div>
        )
    }

    render () {
        return (
            <div>
                <ResponsiveNavigation loggedIn='false'/>
                <br/><br/>
                {this.getLoginText()}
            </div>
        )
    }
}

export default Login