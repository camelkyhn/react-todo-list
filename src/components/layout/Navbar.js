import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "../../services/AuthenticationService";

class Navbar extends Component
{
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.AuthService = new AuthenticationService();
        this.state = {
            email: '',
            password: '',
            isAuthenticated: false,
            isFailed: false
        }
    }

    componentDidMount(){
        this.setState({ isAuthenticated: this.AuthService.loggedIn() });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        var data = { username: this.state.email, password: this.state.password };
        this.AuthService.login(data)
        .then(response => {
            this.AuthService.setItem("access_token", response.data.access_token);
            this.AuthService.setItem("refresh_token", response.data.refresh_token);
            this.AuthService.setItem("username", this.state.email);
            this.setState({ isAuthenticated: true, isFailed: false });
         })
        .catch(error => {
            this.setState({ isAuthenticated: false, isFailed: true });
        });
    }

    handleLogout() {
        this.setState({ isAuthenticated: false, email: '', password: '' });
        this.AuthService.logout();
    }

    render()
    {
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Todo List App</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/TodoList/List">Lists</Link>
                            </li>
                        </ul>
                        {
                            !this.state.isAuthenticated ?
                            <div>
                                <form className="form-inline" onSubmit={this.handleSubmit}>
                                    <input 
                                        className="form-control mr-sm-2"
                                        required
                                        type="email"
                                        name="email"
                                        placeholder="Email *"
                                        value={this.state.email} 
                                        onChange={this.handleChange} />            
                                    <input 
                                        className="form-control mr-sm-2"
                                        required
                                        type="password"
                                        name="password"
                                        placeholder="Password *" 
                                        value={this.state.password} 
                                        onChange={this.handleChange} />
                                    <button className="btn btn-outline-info my-2 my-sm-0" type="submit">Sign In</button>
                                    { 
                                        this.state.isFailed ? 
                                        <ul className="navbar-nav mr-auto">
                                            <li className="nav-item">
                                                <a className="nav-link text-danger">Login Failed!</a>
                                            </li>
                                        </ul>
                                        : ''
                                    }
                                    <ul className="navbar-nav mr-auto">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register">Register</Link>
                                        </li>
                                    </ul>
                                </form>
                            </div>
                            : 
                            <ul className="navbar-nav justify-content-end">
                                <li className="nav-item">
                                    <Link onClick={this.handleLogout} className="nav-link" to="#">Logout</Link>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;