import React from 'react';

import logo from '../assets/classwork-white.png';

function Header(props){
    return(
        <div> 
            <div className="div-header-container">
                <div className="second-div-header-container">
                    <img src={logo} alt="Classwork Logo"></img>
                    <h1 className="header-title">Classwork</h1>
                </div>
            </div>
            <div className="div-header"></div>
        </div>
    );
}

export default Header;