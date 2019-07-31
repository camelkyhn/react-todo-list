import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Select from 'react-select';
import AuthenticationService from "../../../services/AuthenticationService";

class CreateTodoList extends Component
{
    constructor(){
        super();
        this.state = {
            name: '',
            users: [],
            selectedUser: null,
            isCreated: false,
            isFailed: false,
            failedAuth: false
        };
        this.AuthService = new AuthenticationService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.AuthService.post('/TodoList/Create', {
            name: this.state.name,
            assignedUserId: this.state.selectedUser.value
        })
        .then(() => { 
            this.setState({ isCreated: true, isFailed: false });
        }).catch(error => {
            console.log(error);
            this.setState({ isCreated: false, isFailed: true });
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSelect(newValue) {
        this.setState({ selectedUser: newValue });
    }

    async componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.get('/User/List')
            .then(response => {
                var users = [];
                response.data.data.map(value => {
                    users.push({ value: value.id, label: value.username });
                    return users;
                });                    
                this.setState({ users: users });
            })
            .catch(error => { 
                console.log(error);
            });
        }
        else
        {
            this.setState({ failedAuth: true });
        }
    }

    render()
    {
        if (this.state.failedAuth) {
            return <Redirect to="/PermissionDenied" />;
        }
        if (this.state.isCreated) {
            return <Redirect to="/TodoList/List" />
        }
        return(
            <div className="container">
                <br />
                <h1 className="text-center">Create Todo List</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="todoListAddName">Name</label>
                        <input 
                            id="todoListAddName"
                            name="name" 
                            required
                            type="text" 
                            className="form-control" 
                            placeholder="Todo List Name" 
                            maxLength="50"
                            value={this.state.name} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userSearchToAssign">Assign To a User</label>
                        <Select 
                            id="userSearchToAssign"
                            name="userSearchToAssign"
                            options={this.state.users}
                            value={this.state.selectedUser}
                            onChange={this.handleSelect}
                            placeholder="Type an email to search..." />
                    </div>
                    <br />
                    <div className="text-center">
                        <button disabled={!this.state.selectedUser} type="submit" className="btn btn-success btn-lg">Submit</button>
                    </div>
                    {
                        this.state.isFailed ? 
                        <div className="text-center">
                            <p className="text-danger">Creation is Failed!</p>
                        </div>
                        : ''
                    }
                </form>
            </div>
        );
    }
}

export default CreateTodoList;