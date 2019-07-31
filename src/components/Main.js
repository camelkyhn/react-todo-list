import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Register from "./pages/Account/Register";
import PermissionDenied from "./pages/PermissionDenied";

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