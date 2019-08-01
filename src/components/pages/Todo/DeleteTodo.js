/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthenticationService from "../../../services/AuthenticationService";

class DeleteTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: {
                name: '',
                description: '',
                deadline: new Date(),
                completed: false,
                todoList: {
                    id: 0,
                    name: ''
                },
                dependentTodo: {
                    id: 0,
                    name: ''
                },
                status: null
            },
            todoListId: 0,
            isDeleted: false,
            failedAuth: false,
            errorOccured: false,
            errorMessage: ''
        };
        this.AuthService = new AuthenticationService();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.getWithoutRefresh(`/Todo/Get/${this.props.match.params.id}`)
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    this.setState({ todo: response.data.data });
                }
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            this.setState({ failedAuth: true });
        }
    }

    handleSubmit() {
        this.AuthService.delete('/Todo/Delete/' + this.props.match.params.id)
        .then(response => {
            if (response.data.succeeded === false) {
                this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage, isDeleted: false });
                console.log(response.data.exceptionMessage);
            } else {
                this.setState({ isDeleted: true });
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({ errorOccured: true, errorMessage: error, isDeleted: false });
        });
    }

    render() {
        if (this.state.errorOccured) {
            return <Redirect to={{ pathname: "/ErrorPage", state: { message: this.state.errorMessage }}} />;
        }
        if (this.state.failedAuth) {
            return <Redirect to="/PermissionDenied" />;
        }
        if (this.state.isDeleted) {
            return <Redirect to={"/TodoList/Get/" + this.state.todo.todoList.id} />;
        }
        return(
            <form className="container">
                <br />
                <h2 className="text-center">You really want to delete this Todo Item?</h2>
                <div className="form-group">
                    <label htmlFor="todoName">Name</label>
                    <input type="text" className="form-control" id="todoName" value={this.state.todo.name} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="todoDescription">Description</label>
                    <textarea rows="2" className="form-control" id="todoDescription" value={this.state.todo.name} disabled></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="todoTodoList">Todo List</label>
                    <input type="text" className="form-control" id="todoTodoList" value={this.state.todo.todoList.name} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="todoDependentTodo">Dependent Todo</label>
                    <input type="text" className="form-control" id="todoDependentTodo" value={this.state.todo.dependentTodo ? this.state.todo.dependentTodo.name : 'None'} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="todoDeadline">Deadline</label>
                    <input type="text" className="form-control" id="todoDeadline" value={this.state.todo.deadline} disabled />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="todoCompleted" checked={this.state.todo.completed} disabled />
                    <label htmlFor="todoCompleted">Completed</label>
                </div>
                <div className="form-group">
                    <label htmlFor="todoStatus">Status</label>
                    {
                        (this.state.todo.status === "Active") ? 
                        <input id="todoStatus" type="text" className="form-control text-success" value="Active" disabled/> : 
                        <input id="todoStatus" type="text" className="form-control text-danger" value="Inactive" disabled />
                    }
                </div>
                <div className="form-row">
                    <div className="col text-left">
                        <a className="btn btn-secondary" href="javascript:history.back()">Go Back</a>
                    </div>
                    <div className="col text-right">
                        <button type="button" className="btn btn-danger" onClick={this.handleSubmit}>Delete</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default DeleteTodo;