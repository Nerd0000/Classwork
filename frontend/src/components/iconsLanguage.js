import React from 'react';
import {
    FaJava, 
    FaJsSquare,
    FaPython,
    FaPhp,
    FaCode,
    FaCss3
} from 'react-icons/fa';

export default function IconsLanguage(props){
    switch(props.name) {
        case('Java'): return(<FaJava size={props.size} color={props.color}/>);
        case('JavaScript'): return(<FaJsSquare size={props.size} color={props.color}/>);
        case('Python'): return(<FaPython size={props.size} color={props.color}/>);
        case('PHP'): return(<FaPhp size={props.size} color={props.color}/>);
        case('HTML'): return(<FaCode size={props.size} color={props.color}/>);
        case('CSS'): return(<FaCss3 size={props.size} color={props.color}/>);
        default: return null;
    }
}