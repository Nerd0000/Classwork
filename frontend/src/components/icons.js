import React from 'react';
import { FaFolderOpen, FaPowerOff, FaUserCircle, FaUserLock, FaAngleRight, FaAngleLeft, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

export default function Icons(props){
    switch(props.name) {
        case('double-back'): return(<FaAngleDoubleLeft size={props.size} color={props.color}/>);
        case('back'): return(<FaAngleLeft size={props.size} color={props.color}/>);
        case('next'): return(<FaAngleRight size={props.size} color={props.color}/>);
        case('double-next'): return(<FaAngleDoubleRight size={props.size} color={props.color}/>);

        case('folder-open'): return(<FaFolderOpen size={props.size} color={props.color}/>);
        case('user-circle'): return(<FaUserCircle size={props.size} color={props.color}/>);
        case('user-lock'): return(<FaUserLock size={props.size} color={props.color}/>);
        case('exit'): return(<FaPowerOff size={props.size} color={props.color}/>);
        default: return null;
    }
}