import React from 'react';
import {
    FaJava, 
    FaJsSquare,
    FaPython,
    FaPhp,
    FaCode,
    FaCss3,
    FaFolder,
    FaFolderOpen,
    FaGitAlt,
    FaLock,
    FaReadme,
    FaFileAlt,
    FaEye
} from 'react-icons/fa';

export default function IconsLanguage(props){
    switch(props.name) {
        case('Java'): return(<FaJava size={props.size} color={props.color}/>);
        case('JavaScript'): return(<FaJsSquare size={props.size} color={props.color}/>);
        case('Python'): return(<FaPython size={props.size} color={props.color}/>);
        case('PHP'): return(<FaPhp size={props.size} color={props.color}/>);
        case('HTML'): return(<FaCode size={props.size} color={props.color}/>);
        case('CSS'): return(<FaCss3 size={props.size} color={props.color}/>);

        //Bonus
        case('eye'): return(<FaEye size={props.size} color={props.color}/>);

        case('java'): return(<FaJava size={props.size} color={props.color}/>);
        case('js'): return(<FaJsSquare size={props.size} color={props.color}/>);
        case('py'): return(<FaPython size={props.size} color={props.color}/>);
        case('php'): return(<FaPhp size={props.size} color={props.color}/>);
        case('html'): return(<FaCode size={props.size} color={props.color}/>);
        case('css'): return(<FaCss3 size={props.size} color={props.color}/>);
        case('gitignore'): return(<FaGitAlt size={props.size} color={props.color}/>);
        case('md'): return(<FaReadme size={props.size} color={props.color}/>);
        case('lock'): return(<FaLock size={props.size} color={props.color}/>);
        case('folder-open'): return(<FaFolderOpen size={props.size} color={props.color}/>);
        case('folder'): return(<FaFolder size={props.size} color={props.color}/>);

        default: return(<FaFileAlt size={props.size} color={props.color}/>);
    }
}