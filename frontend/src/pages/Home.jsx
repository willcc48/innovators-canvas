import React, { Component } from 'react'
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import MaterialNavBar from '../components/MaterialNavBar';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            netid: '',
            problem: '',

            loggedIn: true
        }

        this.useStyles = makeStyles((theme) => ({
            root: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            },
        }));

        this.divRef = React.createRef()
    }

    componentDidMount() {
/*
        const script1 = document.createElement("script");
        const script2 = document.createElement("script");
        const script3 = document.createElement("script");
        script1.src = "http://localhost:9000/p5.js";
        script1.async = true;
        script1.type = "text/javascript"
        script2.src = "http://localhost:9000/p5.sound.min.js";
        script2.async = true;
        script2.type = "text/javascript"
        script3.src = "http://localhost:9000/sketch.js";
        script3.async = true;
        
        this.divRef.current.appendChild(script1);
        this.divRef.current.appendChild(script2);
        this.divRef.current.appendChild(script3);
*/

        this.sendLoginHash();
        axios.get('http://localhost:9000/userinfo', {withCredentials: true})
            .then(res => {
                var data = res.data;
                if(data.netid) {
                    this.setState({firstName: data.firstName, lastName: data.lastName, netid: data.netid, problem: data.problem});
                    this.setState({loggedIn: true})
                } else {
                    this.setState({loggedIn: false})
                }
        });

    }

    sendLoginHash() {
        var login_hash = window.location.hash;
        if(login_hash) {
            var xhr = new window.XMLHttpRequest();
            xhr.open('POST', 'http://localhost:9000/', true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onreadystatechange = function () {
                // In local files, status is 0 upon success in Mozilla Firefox
                if(xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        // The request has been completed successfully
                        console.log('request completed '+status);
                        window.location.replace("/canvas");
                    } else {
                        // Oh no! There has been an error with the request!
                        console.log('request failed '+status);
                    }
                }
            };

            xhr.send(JSON.stringify(this.parseQueryString(login_hash.split('#')[1])));
        }
    }

    parseQueryString(query) {
        var parsed = {};

        query.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                function ($0, $1, $2, $3) {
                    parsed[decodeURIComponent($1)] = decodeURIComponent($3);
                }
        );
        return parsed;
    }

    render () {

        return (
            <div>
                <MaterialNavBar loggedIn={this.state.loggedIn} title="Innovator's Canvas"/>
                <br/><br/><br/><br/><br/>
                <div>
                    <h1>Home</h1>
                    <p>This is the home page. Insert information about Innovator's Canvas here.</p>
                </div>

                <div ref={this.divRef}/>
            </div>
        )
    }
}

export default Home