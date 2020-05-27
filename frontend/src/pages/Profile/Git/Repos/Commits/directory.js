import React, { useState } from 'react';

import Icons from '../../../../../components/iconsLanguage';
import Highlight from 'react-highlight';

import base64 from 'base-64';
import axios from 'axios';

export default function Directory(props){
    const [tree, setTree] = useState([]);
    const [treeUrl, setTreeUrl] = useState(null);
    const [loadTree, setLoadTree] = useState(true);
    const [oldTreeUrlIndex, setOldTreeUrlIndex] = useState(0);
    const [oldUrlTree, setOldUrlTree] = useState([]);
    const [canUpdate, setCanUpdate] = useState(true);
    const [nameFile, setNameFile] = useState("");
    const [indFile, setIndFile] = useState(-1);
    const [contFile, setContFile] = useState(null);
    const [fileType, setFileType] = useState('');

    var _oldUrlTree = oldUrlTree;

    if(oldTreeUrlIndex < 0){
        setOldTreeUrlIndex(0);
    }

    if(treeUrl == null && props._url != null){
        setTreeUrl(props._url);
    }

    if(treeUrl != null){
        if(canUpdate){
            _oldUrlTree[oldTreeUrlIndex] = treeUrl;
            setOldUrlTree(_oldUrlTree);
            setCanUpdate(false);
            axios.get(treeUrl, {
                headers: {
                    "Authorization": "token " + sessionStorage.getItem('token')
                }
            }).then(async function(response){
                await setTree(response.data.tree);
                setLoadTree(true);
            }).catch();
        }

        function changeTreeFolder(url, type, item, ind){
            if(type === "tree"){
                setLoadTree(false);
                setOldTreeUrlIndex(oldTreeUrlIndex + 1);
                setTreeUrl(url);
                setCanUpdate(true);
            }else if(type === "blob"){
                axios.get(url, {
                    headers: {
                        "Authorization": "token " + sessionStorage.getItem('token')
                    }
                }).then(async function(response){
                    var _blob = base64.decode(response.data.content);

                    if(_blob !== contFile){
                        var _type = item.path.split('.')
                        var _typeItem = _type[_type.length- 1];
                        setFileType(_typeItem);
                        setContFile(_blob);
                        setNameFile(item.path);
                        setIndFile(ind);
                    }else{
                        setFileType('');
                        setContFile(null);
                        setIndFile(-1);
                        setNameFile("");
                    }  
                }).catch();
            }
        }

        function returnTreeFolder(){
            setLoadTree(false);
            setOldTreeUrlIndex(oldTreeUrlIndex - 1);
            setTreeUrl(_oldUrlTree[oldTreeUrlIndex - 1]);
            setCanUpdate(true);
            setContFile(null);
            setIndFile(-1);
            setNameFile("");
        }

        return(<div className="directory-div">
            {(oldTreeUrlIndex !== 0)? <button onClick={() => {returnTreeFolder()}}>
                <div>
                    <Icons name="folder-open" size={25} color="currentColor"/>
                    ..
                </div>
            </button>:null}
            {loadTree?
                tree.map(function(item, index){
                    var _type = item.path.split('.')
                    var _typeItem = _type[_type.length- 1];
                    return(<button className={(item.type === "blob")? "shadow-theme no-focus-shadow-theme":"shadow-theme"}  key={index} onClick={() => {changeTreeFolder(item.url, item.type, item, index)}}>
                        <div>
                            <Icons name={(item.type === "blob")? _typeItem:"folder"} size={25} color="currentColor"/>
                            {item.path}
                        </div>
                        {(contFile !== null && index === indFile)? <Icons name="eye" size={25} color="currentColor"/>:null}
                    </button>);
                }):<div className="shadow-theme alt">
                    Carregando...
                </div>
            }
            {(contFile != null)? <div><h1 className="commmits-chart-title">{nameFile}</h1><div className="code">
            <Highlight className={fileType}>{contFile}</Highlight></div></div>:null} 
        </div>);
    }else{
        return(null);
    }
}