import { Router } from '@reach/router'
import Canvas from './pages/Canvas.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Logout from './pages/Logout.jsx'
import './App.css';
import React, { Component } from "react";

class App extends Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Home path="/" />
					<Home path="/home" />
					<Canvas path="/canvas" />
					<Login path="/login"/>
					<Logout path="/logout"/>
				</Router>
			</div>
		);
	}
}

export default App;