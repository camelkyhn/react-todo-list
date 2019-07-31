import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

class App extends Component
{
    render()
    {
        return(
            <div>
                <Navbar />
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;
