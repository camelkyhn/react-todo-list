import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Register from "./pages/Account/Register";
import CreateTodoList from "./pages/TodoList/CreateTodoList";
import ListTodoList from "./pages/TodoList/ListTodoList";
import UpdateTodoList from "./pages/TodoList/UpdateTodoList";
import CreateTodo from "./pages/Todo/CreateTodo";
import UpdateTodo from "./pages/Todo/UpdateTodo";
import GetTodoList from "./pages/TodoList/GetTodoList";
import PermissionDenied from "./pages/PermissionDenied";
import DeleteTodoList from "./pages/TodoList/DeleteTodoList";
import DeleteTodo from "./pages/Todo/DeleteTodo";

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Register" component={Register} />
            <Route exact path="/Todo/Create/:id" component={CreateTodo} />
            <Route exact path="/Todo/Update/:id" component={UpdateTodo} />
            <Route exact path="/Todo/Delete/:id" component={DeleteTodo} />
            <Route exact path="/TodoList/Get/:id" component={GetTodoList} />
            <Route exact path="/TodoList/Create" component={CreateTodoList} />
            <Route exact path="/TodoList/Update/:id" component={UpdateTodoList} />
            <Route exact path="/TodoList/List" component={ListTodoList} />
            <Route exact path="/TodoList/Delete/:id" component={DeleteTodoList} />
            <Route exact path="/PermissionDenied" component={PermissionDenied} />
            <Route path="*" component={ErrorPage} />
        </Switch>
    </main>
);

export default Main;