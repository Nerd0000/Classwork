import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../../../components/headerAuth';
import Painel from '../../../../../../components/painel';

import checkIfIsAuthenticated from '../../../../../../utils/checkIfIsAuthenticated';
import Icons from '../../../../../../components/icons';

export default function Commits(){
    const history = useHistory();
    const location = useLocation();
    const [page, setPage] = useState(1);

    checkIfIsAuthenticated(sessionStorage, history, location);

    var files = JSON.parse(sessionStorage.getItem('action-files'));

    var itemPerPage = 10;
    var pageMax = Math.ceil(files.files.length/itemPerPage);
    var pageMin = 1;

    function handleChangePage(e){
        setPage(e.target.value);
    }

    function goToPage(num, func){
        if((num <= pageMax && func === "next") || (num >= pageMin && func === "back")){
            setPage(num);
        }
    }

    var _date =  new Date(files.date);
    _date = _date.toJSON();
    
    var _day = _date.substring(8,10);
    var _month = _date.substring(5,7);
    var _year = _date.substring(2,4);

    var title = _day+"/"+_month+"/"+_year;

    return(
        <div>
            <HeaderAuth title={title}/>
            <Painel/>
            <div className="div-global-page with-scroll header-is-auth"> 
            <h1 className="commmits-chart-title first-commmits-chart-title">Dados do Commit</h1>
            <h2 className="commmits-chart-subtitle">{files.author} - {files.message}</h2>
            <table className="table-commits">
                <thead>
                    <tr>
                        <th>Nome do Arquivo</th>
                        <th>Status</th>
                        <th>Linhas Adicionadas</th>
                        <th>Linhas Removidas</th>
                        <th>Caminho</th>
                    </tr>
                </thead>
                <tbody>
                {
                    files.files.map(function(item, index){

                        var _name = item.filename.split('/');
                        var _path = "";

                        for(var i in _name){
                            if(i < _name.length - 2){
                                _path += _name[i] + "/"
                            }
                        }

                        if(_path === ""){
                            _path = "Esse arquivo está dentro da pasta raiz"
                        }

                        _name = _name[_name.length-1];

                        var _status = item.status;
                        var _showStatus = "";
                        switch(_status){
                            case("removed"):
                                _showStatus = "Removido";
                                break;
                            case("added"):
                                _showStatus = "Criado";
                                break;
                            case("modified"):
                                _showStatus = "Modificado";
                                break;
                            default:
                                _showStatus = "Desconhecido";
                        }

                        

                        if((index+1) > (itemPerPage*(page-1)) && (index+1) <= (itemPerPage*(page))){
                            return(<tr key={index} className="table-commits-tr">
                                <td className="table-commits-tr-td table-commits-tr-td-text table-file">{_name}</td>
                                <td className="table-commits-tr-td table-commits-tr-td-text table-alt">{_showStatus}</td>
                                <td className="table-commits-tr-td table-commits-tr-td-text table-alt">{item.additions}</td>
                                <td className="table-commits-tr-td table-commits-tr-td-text table-alt">{item.deletions}</td>
                                <td className="table-commits-tr-td table-msg">{_path}</td>
                            </tr>);
                        }else{
                            return null;
                        }
                    })
                }
                </tbody>
            </table>
            <div className="table-page-control-div">
                <button onClick={() => {goToPage(pageMin, "back")}} style={{color: (page > pageMin)? "rgb(70, 130, 180)":"rgb(148, 182, 211)"}}><Icons name="double-back" size={25} color="white"/></button>
                <button onClick={() => {goToPage(page - 1, "back")}} style={{color: (page > pageMin)? "rgb(70, 130, 180)":"rgb(148, 182, 211)"}}><Icons name="back" size={25} color="white"/></button>
                    
                <input min={pageMin} max={pageMax} type="number" value={page} onChange={handleChangePage}></input>
               
                <button onClick={() => {goToPage(page + 1, "next")}} style={{color: (page < pageMax)? "rgb(70, 130, 180)":"rgb(148, 182, 211)"}}><Icons name="next" size={25} color="white"/></button>
                <button onClick={() => {goToPage(pageMax, "next")}} style={{color: (page < pageMax)? "rgb(70, 130, 180)":"rgb(148, 182, 211)"}}><Icons name="double-next" size={25} color="white"/></button>
            </div>
            </div>
        </div>
    );
}