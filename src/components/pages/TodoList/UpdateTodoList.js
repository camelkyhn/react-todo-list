import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Select from 'react-select';
import AuthenticationService from "../../../services/AuthenticationService";
import { Statuses } from "../../Statuses";

class UpdateTodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            selectedUser: null,
            status: null,
            filter: '',
            users: [],
            isUpdated: false,
            isFailed: false,
            failedAuth: false
        };
        this.AuthService = new AuthenticationService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
        this.handleStatusSelect = this.handleStatusSelect.bind(this);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            id: this.props.match.params.id,
            name: this.state.name,
            status: this.state.status.label,
            assignedUserId: this.state.selectedUser.value
        };
        this.AuthService.put('/TodoList/Update/' + data.id, data)
        .then(() => { 
            this.setState({ isUpdated: true, isFailed: false });
        })
        .catch(error => {
            console.log(error);
            this.setState({ isUpdated: false, isFailed: true });
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleUserSelect(newValue) {
        this.setState({ selectedUser: newValue });
    }

    handleStatusSelect(status) {
        this.setState({ status: status });
    }

    handleMenuOpen() {
        this.AuthService.get("/User/List")
        .then(usersResponse => {
            var users = [];
            usersResponse.data.data.forEach(element => {
                users.push({ value: element.id, label: element.username });
            });
            this.setState({ 
                users: users
            });
        })
        .catch(usersError => {
            console.log(usersError);
        });
    }

    async componentDidMount(){
        if (this.AuthService.loggedIn())
        {
            this.AuthService.get(`/TodoList/Get/${this.props.match.params.id}`)
            .then(response => {
                var status = Statuses.find(s => s.label === response.data.data.status);
                this.setState({ 
                    name: response.data.data.name,
                    status: status,
                    selectedUser: { value: response.data.data.assignedUser.id, label: response.data.data.assignedUser.username }
                });
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
        if (this.state.isUpdated)
        {
            return <Redirect to="/TodoList/List" />
        }
        return(
            <div className="container">
                <br />
                <h1 className="text-center">Update Todo List</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="todoListUpdateName">Name</label>
                        <input 
                            id="todoListUpdateName"
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
                            onChange={this.handleUserSelect}
                            onMenuOpen={this.handleMenuOpen}
                            placeholder="Type an email to search..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="todoListStatus">Status</label>
                        <Select 
                            id="todoListStatus"
                            name="todoListStatus"
                            options={Statuses}
                            value={this.state.status}
                            onChange={this.handleStatusSelect}
                            placeholder="Select a status for this list." />
                    </div>
                    <br />
                    <div className="text-center">
                        <button type="submit" className="btn btn-success btn-lg">Submit</button>
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

export default UpdateTodoList;