import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import TodoListItem from "./TodoListItem";
import AuthenticationService from "../../../services/AuthenticationService";

class ListTodoList extends Component {
    constructor() {
        super();
        this.AuthService = new AuthenticationService();
        this.state = {
            todoLists: [],
            failedAuth: false,
            errorOccured: false,
            errorMessage: ''
        };
    }

    componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.get('/TodoList/List?isAllData=true')
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    this.setState({ todoLists: response.data.data });   
                }
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
        if (this.state.errorOccured) {
            return <Redirect to={{ pathname: "/ErrorPage", state: { message: this.state.errorMessage }}} />;
        }
        if (this.state.failedAuth) {
            return <Redirect to="/PermissionDenied" />;
        }
        return(
            <div className="container">
                <div className="row">
                    <div className="col text-left"><br /><h1>Todo Lists</h1></div>
                    <div className="col text-right"><br /><Link to="/TodoList/Create" className="btn btn-lg btn-success"><strong>+</strong>  Create</Link></div>
                </div>
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