import React, { Component } from "react";

class ErrorPage extends Component
{
    render()
    {
        return (
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <br /><br />
                            <h1>Oops!</h1>
                            <div className="error-details">
                                {
                                    this.props.message ? 
                                    this.props.message 
                                    : 'Sorry, an error has occured or you have just requested wrong page!'
                                }
                            </div>
                            <br />
                            <a href="/" className="btn btn-success btn-lg active" role="button" aria-pressed="true">Back To Home</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage;