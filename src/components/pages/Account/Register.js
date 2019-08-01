import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthenticationService from "../../../services/AuthenticationService";

class Register extends Component
{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.AuthService = new AuthenticationService();
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            isFailed: false,
            isRegistered: false
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();      
        var body = { 
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.email,
            password: this.state.password,
            status: 'Active'
        };

        this.AuthService.register(body)
                        .then(response => {
                            
                            if (response.data.succeeded){
                                this.setState({ isRegistered: true, isFailed: false });
                            } else {
                                this.setState({ isRegistered: false, isFailed: true });
                                throw new Error(response.data.exceptionMessage);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({ isRegistered: false, isFailed: true });
                        });
    }

    render() {
        if (this.state.isRegistered) {
            return <Redirect to="/" />;
        }
        return(
            <div className="container">
                <br />
                <h1 className="text-center">Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="registerFirstName">First Name</label>
                        <input 
                            id="registerFirstName" 
                            name="firstName"
                            required
                            type="text" 
                            className="form-control" 
                            placeholder="First Name" 
                            maxLength="50"
                            value={this.state.firstName} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerLastName">Last Name</label>
                        <input 
                            id="registerLastName"
                            name="lastName" 
                            required
                            type="text" 
                            className="form-control" 
                            placeholder="Last Name" 
                            maxLength="50"
                            value={this.state.lastName} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerEmail">Email address</label>
                        <input 
                            id="registerEmail" 
                            name="email" 
                            required
                            type="email" 
                            className="form-control" 
                            aria-describedby="emailHelp" 
                            placeholder="Email" 
                            maxLength="50"
                            value={this.state.email} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registerPassword">Password</label>
                        <input 
                            id="registerPassword" 
                            name="password" 
                            required
                            type="password" 
                            className="form-control" 
                            placeholder="Password" 
                            maxLength="100"
                            value={this.state.password}
                            onChange={this.handleChange} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-success btn-lg">Submit</button>
                    </div>
                    {
                        this.state.isFailed ? 
                        <div className="text-center">
                            <p className="text-danger">Register Failed!</p>
                        </div>
                        : ''
                    }
                </form>
            </div>
        );
    }
}

export default Register;