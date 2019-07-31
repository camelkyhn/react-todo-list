import React, { Component } from "react";

class ErrorPage extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.message
        };
    }
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
                                    this.state.message ? 
                                    this.state.message 
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