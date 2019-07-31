import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
