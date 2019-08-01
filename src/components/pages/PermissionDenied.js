import React from "react";
import { Link } from "react-router-dom";

const PermissionDenied = () => (
    <div className="container text-center">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <br /><br />
                    <h1>Permission Denied!</h1>
                    <div className="error-details">
                        <h4>You do not have permission to access this content.</h4>
                        <p>Just try to logout and/or sign in again!</p>
                    </div>
                    <br />
                    <p><Link className="text-muted" to="/Register">Or you can just start with creating an account?</Link></p>
                </div>
            </div>
        </div>
    </div>
);

export default PermissionDenied;