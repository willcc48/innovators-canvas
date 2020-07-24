import React, { Component } from 'react'
import axios from 'axios';
import MaterialNavBar from '../components/MaterialNavBar';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            netid: '',
            problem: '',

            logoutSuccess: true
        }
    }

    componentDidMount() {
        axios.get('http://localhost:9000/logout', {withCredentials: true})
            .then(res => {
                if(res.data === 'done') {
                    this.setState({logoutSuccess: true});
                } else {
                    console.log(res);
                    this.setState({logoutSuccess: false});
                }
        });
    }

    getLogoutText() {
        if(this.state.logoutSuccess) {
            return (
                <div>
                    <MaterialNavBar loggedIn={!this.state.logoutSuccess} title='Logout'/>
                    <br/><br/><br/><br/><br/>
                    <div>You will be redirected to logout.</div>
                </div>
            )
        } else {
            return (
                <div>
                    <MaterialNavBar loggedIn={!this.state.logoutSuccess} title='Logout'/>
                    <br/><br/><br/><br/><br/>
                    <div>You are not logged in!</div>
                </div>
                
            )
        }
    }

    render () {
        return (
            <div>
                {this.getLogoutText()}
            </div>
        )
    }
}

export default Login