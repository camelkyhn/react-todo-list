import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorPage from "./Pages/ErrorPage";
import Register from "./Pages/Account/Register";
import PermissionDenied from "./Pages/PermissionDenied";

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Register" component={Register} />
            <Route exact path="/PermissionDenied" component={PermissionDenied} />
            <Route path="*" component={ErrorPage} />
        </Switch>
    </main>
);

export default Main;