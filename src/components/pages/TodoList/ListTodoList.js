import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Select from 'react-select';
import TodoListItem from "./TodoListItem";
import { Statuses } from "../../Statuses";
import AuthenticationService from "../../../services/AuthenticationService";

class ListTodoList extends Component {
    constructor() {
        super();
        this.AuthService = new AuthenticationService();
        this.state = {
            todoLists: [],
            name: '',
            assignedUsername: '',
            status: null,
            failedAuth: false,
            errorOccured: false,
            errorMessage: ''
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStatusSelect = this.handleStatusSelect.bind(this);
    }

    componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.handleSearch();
        } else {
            this.setState({ failedAuth: true });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleStatusSelect(status) {
        this.setState({ status: status });
    }

    handleSearch(){
        this.setState({ todos: [] });
        var url = `/TodoList/List?isAllData=true`;
        url = url + this.prepareQueryString();
        this.AuthService.getWithoutRefresh(url)
        .then(listResponse => {
            if (listResponse.data.succeeded === false) {
                this.setState({ errorOccured: true, errorMessage: listResponse.data.exceptionMessage });
                console.log(listResponse.data.exceptionMessage);
            } else {
                this.setState({ todoLists: listResponse.data.data });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    prepareQueryString() {
        var query = '&';
        if(this.state.name) {
            query = query + 'name=' + this.state.name + '&';
        }
        if(this.state.assignedUsername) {
            query = query + 'assignedUsername=' + this.state.assignedUsername + '&';
        }
        if(this.state.status !== null) {
            query = query + 'status=' + this.state.status.label;
        }
        if (query.slice(-1) === '&') {
            query = query.substr(0, query.length - 1);
        }
        return query;
    }

    render() {
        if (this.state.errorOccured) {
            return <Redirect to={{ pathname: "/ErrorPage", state: { message: this.state.errorMessage }}} />;
        }
        if (this.state.failedAuth) {
            return <Redirect to="/PermissionDenied" />;
        }
        return(
            <div className="container">
                <br />
                <div className="text-center">
                    <h1>Todo Lists</h1>
                </div>
                <br />
                <form>
                    <div className="row">
                        <div className="col text-left">
                            <button type="button" className="btn btn-info" data-toggle="modal" data-target="#filterModal">Search</button>
                        </div>
                        <div className="modal fade" id="filterModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Filter Todo Lists</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="todoListFilterName">Name</label>
                                        <input 
                                            id="todoListFilterName"
                                            name="name" 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Todo List Name" 
                                            value={this.state.name} 
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="todoListFilterAssignedUsername">Assigned Username</label>
                                        <input 
                                            id="todoListFilterAssignedUsername"
                                            name="assignedUsername" 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Todo List Assigned Username" 
                                            value={this.state.assignedUsername} 
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="todoListStatus">Status</label>
                                        <Select 
                                            id="todoListStatus"
                                            name="status"
                                            placeholder="Status"
                                            options={Statuses}
                                            value={this.state.status}
                                            onChange={this.handleStatusSelect} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <input type="button" className="btn btn-primary" onClick={this.handleSearch} value="Apply Filter" />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col text-right">
                            <Link to="/TodoList/Create" className="btn btn-success"><strong>+</strong>  Create</Link>
                        </div>
                    </div>
                </form>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Assisned User</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.todoLists.map((value) => {
                                return (
                                    <TodoListItem status={value.status} itemName={value.name} itemOwner={value.assignedUser.username} itemId={value.id} key={value.id} />
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListTodoList;