import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Select from 'react-select';
import TodoItem from "../Todo/TodoItem";
import { Statuses } from "../../Statuses";
import { Booleans } from "../../Booleans";
import AuthenticationService from "../../../services/AuthenticationService";

class GetTodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            todoList: {
                id: 0,
                name: '',
                assignedUser: {
                    username: ''
                }
            },
            id: 0,
            name: '',
            completed: null,
            selectedCompleted: null,
            expired: null,
            selectedExpired: null,
            status: null,
            failedAuth: false,
            errorOccured: false,
            errorMessage: ''
        };
        this.AuthService = new AuthenticationService();
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStatusSelect = this.handleStatusSelect.bind(this);
        this.handleCompletedSelect = this.handleCompletedSelect.bind(this);
        this.handleExpiredSelect = this.handleExpiredSelect.bind(this);
    }

    componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.getWithoutRefresh(`/TodoList/Get/${this.props.match.params.id}`)
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    this.setState({ todoList: response.data.data, id: response.data.data.id });
                    this.handleSearch();
                }
            })
            .catch(error => {
                console.log(error);
            });
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

    handleCompletedSelect(bool) {
        console.log(bool);
        this.setState({ selectedCompleted: bool, completed: bool.value });
    }

    handleExpiredSelect(bool) {
        console.log(bool);
        this.setState({ selectedExpired: bool, expired: bool.value });
    }

    handleSearch(){
        this.setState({ todos: [] });
        var url = `/Todo/List?isAllData=true&todoListId=${this.state.todoList ? this.state.todoList.id : this.props.match.params.id}`;
        url = url + this.prepareQueryString();
        console.log(url);
        this.AuthService.get(url)
        .then(listResponse => {
            if (listResponse.data.succeeded === false) {
                this.setState({ errorOccured: true, errorMessage: listResponse.data.exceptionMessage });
                console.log(listResponse.data.exceptionMessage);
            } else {
                this.setState({ todos: listResponse.data.data });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    prepareQueryString(){
        var query = '&';
        console.log(this.state);
        if(this.state.name) {
            query = query + 'name=' + this.state.name + '&';
        }
        if(this.state.completed !== null && this.state.completed !== undefined) {
                query = query + 'completed=' + this.state.completed + '&';
        }
        if(this.state.expired !== null && this.state.expired !== undefined) {
                query = query + 'expired=' + this.state.expired + '&';
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
                <form title="Search Form">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="todoListName">Name</label>
                            <input id="todoListName" name="todoListName" type="text" className="form-control" value={this.state.todoList.name} disabled />
                        </div>
                        <div className="col">
                            <label htmlFor="todoListAssignedUser">Assigned User</label>
                            <input id="todoListAssignedUser" name="todoListAssignedUser" type="text" className="form-control" value={this.state.todoList.assignedUser.username} disabled />
                        </div>
                        <div className="col">
                            <label htmlFor="todoListName">Status</label>
                            {
                                (this.state.todoList.status === "Active") ? 
                                <input disabled type="text" className="form-control text-success" value="Active" /> : 
                                <input disabled type="text" className="form-control text-danger" value="Inactive" />
                            }
                        </div>
                    </div>
                </form>
                <br />
                <div className="text-center">
                    <h1>Todo Items</h1>
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
                                    <h5 className="modal-title" id="exampleModalLabel">Filter Todo Items</h5>
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
                                        <label htmlFor="completed">Completed</label>
                                        <Select 
                                            id="completed" 
                                            name="completed" 
                                            placeholder="Completed?"
                                            options={Booleans}
                                            value={this.state.selectedCompleted} 
                                            onChange={this.handleCompletedSelect} /> 
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="expired">Expired</label>
                                        <Select 
                                            id="expired"
                                            name="expired"
                                            placeholder="Expired?"
                                            options={Booleans}
                                            value={this.state.selectedExpired}
                                            onChange={this.handleExpiredSelect} />
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
                            <Link to={`/Todo/Create/${this.props.match.params.id}`} className="btn btn-success"><strong>+</strong>  Create</Link>
                        </div>
                    </div>
                </form>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Deadline</th>
                            <th scope="col">Completed</th>
                            <th scope="col">Dependent Todo</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.todos.map((value) => {
                                return (
                                    <TodoItem 
                                        name={value.name} 
                                        description={value.description} 
                                        deadline={value.deadline} 
                                        completed={value.completed} 
                                        dependentTodo={value.dependentTodo} 
                                        status={value.status} 
                                        itemId={value.id} 
                                        key={value.id} />
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default GetTodoList;