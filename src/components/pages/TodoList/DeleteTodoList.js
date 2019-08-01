/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthenticationService from "../../../services/AuthenticationService";

class DeleteTodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: {
                id: 0,
                name: '',
                assignedUser: {
                    username: ''
                },
                status: null
            },
            id: 0,
            name: '',
            status: null,
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
            this.AuthService.getWithoutRefresh(`/TodoList/Get/${this.props.match.params.id}`)
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    console.log(response.data);
                    this.setState({ todoList: response.data.data, id: response.data.data.id });
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
        console.log('/TodoList/Delete/' + this.props.match.params.id);
        this.AuthService.delete('/TodoList/Delete/' + this.props.match.params.id)
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
            return <Redirect to="/TodoList/List" />;
        }
        return(
            <form className="container">
                <br />
                <h2 className="text-center">You really want to delete this Todo List?</h2>
                <div className="form-group">
                    <label htmlFor="todoListName">Name</label>
                    <input type="text" className="form-control" id="todoListName" value={this.state.todoList.name} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="todoListAssignedUser">Assigned User</label>
                    <input type="text" className="form-control" id="todoListAssignedUser" value={this.state.todoList.assignedUser.username} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="todoListStatus">Status</label>
                    {
                        (this.state.todoList.status === "Active") ? 
                        <input id="todoListStatus" type="text" className="form-control text-success" value="Active" disabled/> : 
                        <input id="todoListStatus" type="text" className="form-control text-danger" value="Inactive" disabled />
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

export default DeleteTodoList;