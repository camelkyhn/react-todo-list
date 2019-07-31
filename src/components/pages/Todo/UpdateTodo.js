import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthenticationService from "../../../services/AuthenticationService";
import { Statuses } from "../../Statuses";

class UpdateTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            deadline: new Date(),
            completed: false,
            selectedTodoList: null,
            dependentTodo: null,
            status: null,
            todoLists: [],
            todos: [],
            canNotBeCompleted: false,
            isUpdated: false,
            isFailed: false,
            failedAuth: false
        };
        this.AuthService = new AuthenticationService();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTodoListSelect = this.handleTodoListSelect.bind(this);
        this.handleTodoSelect = this.handleTodoSelect.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleStatusSelect = this.handleStatusSelect.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
    }    

    async componentDidMount(){
        if (this.AuthService.loggedIn())
        {
            this.AuthService.get('/Todo/List')
            .then(response => {
                var todo = response.data.data.find(t => t.id.toString() === this.props.match.params.id);
                var status = Statuses.find(s => s.label === todo.status);

                this.setState({
                    name: todo.name,
                    description: todo.description,
                    deadline: new Date(todo.deadline),
                    completed: todo.completed,
                    selectedTodoList: { value: todo.todoList.id, label: todo.todoList.name },
                    dependentTodo: todo.dependentTodo ? { value: todo.dependentTodo.id, label: todo.dependentTodo.name } : null,
                    status: status,
                });
                var todos = [];
                response.data.data.map(value => {
                    if (value.id !== todo.id && value.todoList.id === todo.todoList.id) {
                        if (value.dependentTodo && (value.dependentTodo.id !== todo.id)) {
                            todos.push({ value: value.id, label: value.name });
                        }
                    }
                    return todos;
                });
                this.setState({ todos: todos });
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
            id: this.props.match.params.id,
            name: this.state.name,
            description: this.state.description,
            deadline: this.state.deadline,
            completed: this.state.completed,
            todoListId: this.state.selectedTodoList.value,
            dependentTodoId: this.state.dependentTodo ? this.state.dependentTodo.value : null,
            status: this.state.status.label
        }
        this.AuthService.put('/Todo/Update', data)
        .then((response) => {
            this.setState({ isUpdated: true, isFailed: false });
        }).catch(error => {
            console.log(error);
            this.setState({ isUpdated: false, isFailed: true });
        });
    }

    handleTodoListMenuOpen() {
        this.AuthService.get('/TodoList/List')
        .then(response => {
            var todoLists = [];
            response.data.data.map(value => {
                todoLists.push({ value: value.id, label: value.name });
                return todoLists;
            });
            this.setState({ 
                todoLists: todoLists, 
                selectedTodoList: todoLists.find(tl => tl.value.toString() === this.selectedTodoList.value) 
            });
        })
        .catch(error => { 
            console.log(error);
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleComplete(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        this.setState({ [name]: value });
        if (value === true && this.state.dependentTodo) {
            this.AuthService.getWithoutRefresh(`/Todo/Get/${this.state.dependentTodo.value}`)
            .then(response => {
                if (response.data.data.completed === true) {
                    this.setState({ canNotBeCompleted: false });
                }
                else
                {
                    this.setState({ canNotBeCompleted: true });
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        this.setState({ canNotBeCompleted: false });
    }

    handleTodoListSelect(newValue){
        this.setState({ selectedTodoList: newValue });
    }

    handleTodoSelect(newValue){
        this.setState({ dependentTodo: newValue });
    }

    handleStatusSelect(newValue){
        this.setState({ status: newValue });
    }

    handleDateChange(date){
        this.setState({ deadline: date });
    }

    render()
    {
        if (this.state.failedAuth) {
            return <Redirect to="PermissionDenied" />
        }
        if (this.state.isUpdated)
        {
            return <Redirect to={`/TodoList/Get/${this.state.selectedTodoList.value}`} />;
        }
        return(
            <div className="container">
                <br />
                <h1 className="text-center">Edit Todo Item</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="todoAddName">Name</label>
                        <input 
                            id="todoAddName"
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
                        <label htmlFor="todoAddDescription">Description</label>
                        <input 
                            id="todoAddDescription"
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
                    <div className="form-row">
                        <div className="col">
                            <p htmlFor="todoEditDeadline">Deadline</p>
                            <DatePicker 
                                id="todoEditDeadline"
                                name="deadline" 
                                required
                                className="form-control" 
                                placeholder="Todo Deadline" 
                                selected={this.state.deadline}
                                onChange={this.handleDateChange} />
                        </div>
                        <div className="col">
                            <br />
                            <br />
                            <input 
                                id="completed"
                                name="completed" 
                                type="checkbox" 
                                className="form-check-input" 
                                checked={this.state.completed}
                                onChange={this.handleComplete} />
                            {this.state.canNotBeCompleted ? <label className="text-danger" htmlFor="completed">Can Not Be Completed!</label> : <label htmlFor="completed">Is Completed?</label>}
                        </div>
                        <div className="col">
                            <p htmlFor="todoListStatus">Status</p>
                            <Select 
                                id="todoListStatus"
                                name="todoListStatus"
                                options={Statuses}
                                value={this.state.status}
                                onChange={this.handleStatusSelect}
                                placeholder="Select a status for this todo." />
                        </div>
                    </div>
                    <br />
                    <div className="row">
                    <div className="col">
                        <Link to="/" className="btn btn-secondary btn-lg">Back To Home</Link>
                    </div>
                    <div className="col text-right">
                        <button hidden={this.state.canNotBeCompleted} type="submit" className="btn btn-success btn-lg">Submit</button>
                    </div>
                    </div>
                    {
                        this.state.isFailed ? 
                        <div className="text-center">
                            <p className="text-danger">Update is Failed!</p>
                        </div>
                        : ''
                    }
                </form>
            </div>
        );
    }
}

export default UpdateTodo;