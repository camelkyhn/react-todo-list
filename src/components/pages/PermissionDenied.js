import React from "react";

const PermissionDenied = () => (
    <div className="container text-center">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <br /><br />
                    <h1>Permission Denied!</h1>
                    <div className="error-details">
                        <p>Sorry, an error has occured, just try to logout and/or sign in again!</p>
                    </div>
                    <br />
                    <a href="/" className="btn btn-success btn-lg active" role="button" aria-pressed="true">Back To Home</a>
                </div>
            </div>
        </div>
    </div>
);

export default PermissionDenied;