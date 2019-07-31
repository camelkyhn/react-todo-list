import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import TodoItem from "../Todo/TodoItem";
import AuthenticationService from "../../../services/AuthenticationService";

class GetTodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            todoList: {
                name: '',
                assignedUser: {
                    username: ''
                }
            },
            id: 0,
            name: '',
            completed: false,
            expired: false,
            failedAuth: false
        };
        this.AuthService = new AuthenticationService();
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.get(`/TodoList/Get/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ todoList: response.data.data, id: response.data.data.id });
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

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleSearch(){
        var url = `/Todo/ListBy?todoListId=${this.state.todoList.id}`;
        url = url + this.prepareQueryString();
        this.AuthService.get(url)
        .then(listResponse => {
            this.setState({ todos: listResponse.data.data });
        })
        .catch(error => {
            console.log(error);
        });
    }

    prepareQueryString(){
        var query = '&';
        if(this.state.name)
        {
            query = query + 'name=' + this.state.name + '&';
        }
        if(this.state.completed !== undefined)
        {
            query = query + 'completed=' + this.state.completed.toString() + '&';
        }
        if(this.state.expired !== undefined)
        {
            query = query + 'expired=' + this.state.expired.toString();
        }
        if (query.slice(-1) === '&') {
            query = query.substr(0, query.length - 1);
        }
        return query;
    }

    render()
    {
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
                    <div className="text-center"><h1>Todo Items Of {this.state.todoList.name}</h1></div>
                <br />
                <form>
                    <div className="row">
                        <div className="col-md-2">
                            <input id="name" name="name" type="text" className="form-control" placeholder="Name Search..." value={this.state.name} onChange={this.handleChange} maxLength="50" />
                        </div>
                        <div className="col-md-3 text-center">
                            <input id="completed" name="completed" type="checkbox" className="form-check-input" checked={this.state.completed} onChange={this.handleChange} />
                            <label htmlFor="completed">Is Completed</label>
                        </div>
                        <div className="col-md-3 text-center">
                            <input id="expired" name="expired" type="checkbox" className="form-check-input" checked={this.state.expired} onChange={this.handleChange} />
                            <label htmlFor="expired">Is Expired</label>
                        </div>
                        <div className="col-md-2 text-right">
                            <input type="button" className="btn btn-info" onClick={this.handleSearch} value="Search" />
                        </div>
                        <div className="col-md-2 text-right"><Link to={`/Todo/Add/${this.props.match.params.id}`} className="btn btn-success"><strong>+</strong>  Create</Link></div>
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