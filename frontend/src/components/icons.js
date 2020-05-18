import React from 'react';
import { FaFolderOpen, FaPowerOff, FaUserCircle, FaUserLock } from 'react-icons/fa';

export default function Icons(props){
    switch(props.name) {
        case('folder-open'): return(<FaFolderOpen size={props.size} color={props.color}/>);
        case('user-circle'): return(<FaUserCircle size={props.size} color={props.color}/>);
        case('user-lock'): return(<FaUserLock size={props.size} color={props.color}/>);
        case('exit'): return(<FaPowerOff size={props.size} color={props.color}/>);
        default: return null;
    }
}