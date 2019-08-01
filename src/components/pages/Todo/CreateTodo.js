import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthenticationService from "../../../services/AuthenticationService";
import { Statuses } from "../../Statuses";

class CreateTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            deadline: new Date(),
            todoLists: [],
            selectedTodoList: null,
            todos: [],
            dependentTodo: null,
            status: null,
            isCreated: false,
            isFailed: false,
            failedAuth: false,
            errorOccured: false,
            errorMessage: ''
        };
        this.AuthService = new AuthenticationService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStatusSelect = this.handleStatusSelect.bind(this);
        this.handleTodoListSelect = this.handleTodoListSelect.bind(this);
        this.handleTodoSelect = this.handleTodoSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }    

    async componentDidMount(){
        if (this.AuthService.loggedIn()) {
            this.AuthService.getWithoutRefresh('/TodoList/List?isAllData=true')
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    var todoLists = [];
                    response.data.data.map(value => {
                        todoLists.push({ value: value.id, label: value.name });
                        return todoLists;
                    });
                    var today = new Date();
                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate()+1);
                    this.setState({ 
                        todoLists: todoLists, 
                        selectedTodoList: todoLists.find(tl => tl.value.toString() === this.props.match.params.id),
                        deadline: tomorrow
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });

            this.AuthService.get(`/Todo/List?isAllData=true&todoListId=${this.props.match.params.id}`)
            .then(response => {
                if (response.data.succeeded === false) {
                    this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage });
                    console.log(response.data.exceptionMessage);
                } else {
                    var todos = [];
                    response.data.data.map(value => {
                        todos.push({ value: value.id, label: value.name });
                        return todos;
                    });
                    this.setState({ todos: todos });
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

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            name: this.state.name,
            description: this.state.description,
            deadline: this.state.deadline,
            todoListId: this.state.selectedTodoList.value,
            dependentTodoId: this.state.dependentTodo ? this.state.dependentTodo.value : null,
            status : this.state.status ? this.state.status.label : "Active"
        }
        console.log(data);
        this.AuthService.post('/Todo/Create', data)
        .then(response => {
            if (response.data.succeeded === false) {
                this.setState({ errorOccured: true, errorMessage: response.data.exceptionMessage, isCreated: false, isFailed: true });
                console.log(response.data.exceptionMessage);
            } else {
                this.setState({ isCreated: true, isFailed: false });   
            }
        }).catch(error => {
            this.setState({ isCreated: false, isFailed: true });
            console.log(error);
        });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleTodoListSelect(newValue){
        this.setState({ selectedTodoList: newValue });
    }

    handleTodoSelect(newValue){
        this.setState({ dependentTodo: newValue });
    }

    handleDateChange(date){
        this.setState({ deadline: date });
    }

    handleStatusSelect(status) {
        this.setState({ status: status });
    }

    render()
    {
        if (this.state.errorOccured) {
            return <Redirect to={{ pathname: "/ErrorPage", state: { message: this.state.errorMessage }}} />;
        }
        if (this.state.failedAuth) {
            return <Redirect to="/PermissionDenied" />;
        }
        if (this.state.isCreated) {
            return <Redirect to={`/TodoList/Get/${this.state.selectedTodoList.value}`} />;
        }
        return(
            <div className="container">
                <br />
                <h1 className="text-center">Create Todo Item</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="todoCreateName">Name</label>
                        <input 
                            id="todoCreateName"
                            name="name" 
                            required
                            type="text" 
                            className="form-control" 
                            placeholder="Todo Name" 
                            maxLength="200"
                            value={this.state.name} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="todoCreateDescription">Description</label>
                        <input 
                            id="todoCreateDescription"
                            name="description" 
                            required
                            type="text" 
                            className="form-control" 
                            placeholder="Todo Description" 
                            maxLength="500"
                            value={this.state.description} 
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <p htmlFor="todoCreateDeadline">Deadline</p>
                        <DatePicker 
                            id="todoCreateDeadline"
                            name="deadline" 
                            required
                            className="form-control" 
                            placeholder="Todo Deadline" 
                            selected={this.state.deadline}
                            onChange={this.handleDateChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="todoListSearchToAssign">Assign To a Todo List</label>
                        <Select 
                            id="todoListSearchToAssign"
                            name="todoListSearchToAssign"
                            options={this.state.todoLists}
                            value={this.state.selectedTodoList}
                            onChange={this.handleTodoListSelect}
                            placeholder="Type an Todo List to search..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="todoSearchToAssign">Select a Dependent Todo</label>
                        <Select 
                            id="todoSearchToAssign"
                            name="todoSearchToAssign"
                            options={this.state.todos}
                            value={this.state.dependentTodo}
                            onChange={this.handleTodoSelect}
                            placeholder="Type an Todo to be dependent..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="todoStatus">Status</label>
                        <Select 
                            id="todoStatus"
                            name="status"
                            required
                            options={Statuses}
                            value={this.state.status}
                            onChange={this.handleStatusSelect}
                            placeholder="Select a status for this todo." />
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

export default CreateTodo;