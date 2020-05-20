import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../../components/headerAuth';

import checkIfIsAuthenticated from '../../../../../utils/checkIfIsAuthenticated';

export default function Commits(){
    const history = useHistory();
    const location = useLocation();
    const [indexOfValue, setIndexOfValue] = useState(0);
    const [activeAnimation, setActiveAnimation] = useState(true);

    checkIfIsAuthenticated(sessionStorage, history, location);
    
    var action = sessionStorage.getItem('action');
    var actionSplit = action.split('-');
    var title = '';

    for(var i in actionSplit){
        if(i >= actionSplit.length - 1){
            title += actionSplit[i];
        }else{
            title += actionSplit[i] + ' ';
        }
    }

    var actions = JSON.parse(sessionStorage.getItem('actions@' + action));

    var qtdCommit = actions.commits.length;
    var qtdChange = 0;
    for(var u in actions.rank){
        qtdChange += actions.rank[u].total;
    }
    var qtdAuthor = actions.rank.length;
    var _commits = [];
    for(var q in actions.commits){
        var _date =  new Date(actions.commits[q].date);
        _date = _date.toJSON();
        
        var _day = _date.substring(8,10);
        var _month = _date.substring(5,7);
        var _year = _date.substring(2,4)

        _commits[(actions.commits.length - 1) - q] = {
            author: actions.commits[q].author,
            avatar: actions.commits[q].author_avatar,
            date: _date,
            dateReducer: _day + "/" + _month + "/" + _year,
            total: actions.commits[q].stats.total,
            additions: actions.commits[q].stats.additions,
            deletions: actions.commits[q].stats.deletions,
            message: actions.commits[q].message
        }
        
    }

    const changesTimeline = _commits;

    //Grafico de Pizza
    var dataDetails = [{id: 0, value: actions.rank[indexOfValue].additions, color: "rgb(91, 197, 106, 0.6)"},{id: 1, value: actions.rank[indexOfValue].deletions, color: "rgb(197, 148, 91,0.6)"}];
    const COLORS = ['rgba(70, 131, 180, 0.5)','rgba(70, 131, 180, 0.4)','rgba(70, 131, 180, 0.3)','rgba(70, 131, 180, 0.2)','rgba(70, 131, 180, 0.6)'];

    var activeShape = ({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent }) => {
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 55;
        const exp = mx + (cos >= 0 ? 1 : -1) * 65;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        return (
            <g>
                <defs>
                    <pattern id="avt" width="100%" height="100%">
                        <image href={payload.avatar} width="100" height="100"/>
                    </pattern>
                </defs>
                <circle cx={cx} cy={cy} r={innerRadius - 10} fill="url(#avt)"/>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill="steelblue"
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill="steelblue"
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="steelblue" fill="none"/>

                <path d={`M${ex + (cos >= 0 ? 1 : -1) * 28},${ey - 40}L${ex + (cos >= 0 ? 1 : -1) * 28},${ey - 7}`} strokeWidth="5" stroke="steelblue" fill="none"/>
                <path d={`M${ex + (cos >= 0 ? 1 : -1) * 28},${ey}L${ex + (cos >= 0 ? 1 : -1) * 28},${ey + 11}`} strokeWidth="5" stroke="rgb(91, 197, 106, 0.6)" fill="none"/>
                <path d={`M${ex + (cos >= 0 ? 1 : -1) * 28},${ey + 18}L${ex + (cos >= 0 ? 1 : -1) * 28},${ey + 29}`} strokeWidth="5" stroke="rgb(197, 148, 91,0.6)" fill="none"/>

                <circle cx={exp} cy={ey} r={3} fill="steelblue" stroke="none"/>
                <text className="details-pie-percent" x={ex + (cos >= 0 ? 1 : -1) * -35} y={ey + 10} dy={-18} textAnchor={textAnchor} fill="steelblue">{`${(percent * 100).toFixed(2)}%`}</text>
                <text className="details-pie-title " x={ex + (cos >= 0 ? 1 : -1) * 35} y={ey} dy={-25}textAnchor={textAnchor} fill="steelblue">{`${payload.name}`}</text>
                <text className="details-pie" x={ex + (cos >= 0 ? 1 : -1) * 35} y={ey} dy={-7} textAnchor={textAnchor} fill="rgb(1, 53, 95)">Total: {payload.total}</text>
                <text className="details-pie" x={ex + (cos >= 0 ? 1 : -1) * 35} y={ey} dy={11} textAnchor={textAnchor} fill="rgb(1, 53, 95)">Adicionou: {payload.additions}</text>
                <text className="details-pie" x={ex + (cos >= 0 ? 1 : -1) * 35} y={ey} dy={29} textAnchor={textAnchor} fill="rgb(1, 53, 95)">Removeu: {payload.deletions}</text>
            </g>
        );
    };

    //Grafico Alterações X Tempo
    const CustomTooltip  = ({payload, label, active}) => {
        if (active) {
            return (
                <div className="custom-tooltip">
                    <img src={payload[2].value} alt="avatar"/>
                    <div>
                        <h3>{`${label} - ${payload[0].value}`}</h3 >
                        <h4>{payload[1].value}</h4>
                        <h4>{`Alterações: ${payload[3].value}`}</h4>
                    </div>
                </div>
            );
        }
    
        return null;
    };

    const CustomTooltip2  = ({payload, active}) => {
        if (active) {
            return (
                <div className="custom-tooltip tooltip-additions">
                    <h3>{`Adições no codigo: ${payload[0].value}`}</h3 >
                </div>
            );
        }
    
        return null;
    };

    const CustomTooltip3  = ({payload, active}) => {
        if (active) {
            return (
                <div className="custom-tooltip tooltip-deletions">
                    <h3>{`Remoções no codigo: ${payload[0].value}`}</h3 >
                </div>
            );
        }
    
        return null;
    };
      
    const TimelineAreaChart = () => {
        return (
            <div className="timeline-areachart">
                <AreaChart width={1200} height={200} className="areacharts-first" data={changesTimeline} syncId="timeline">
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="dateReducer"/>
                <YAxis/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area isAnimationActive={activeAnimation} animationDuration={6000} type='monotone' dataKey='author' name="Autor" stroke='rgba(70, 131, 180)' activeDot={false}></Area>
                <Area isAnimationActive={activeAnimation} animationDuration={6000} type='monotone' dataKey='message' name="Mensagem" stroke='rgba(70, 131, 180)' activeDot={false}></Area>
                <Area isAnimationActive={activeAnimation} animationDuration={6000} type='monotone' dataKey='avatar' name="Avatar" stroke='rgba(70, 131, 180)' activeDot={false}></Area>
                <Area isAnimationActive={activeAnimation} animationDuration={6000} type='monotone' dataKey='total' name="Alterações" stroke='rgba(70, 131, 180)' fill='rgba(70, 131, 180, 0.5)'/>
                </AreaChart>

                <div className="timeline-areachart-2">
                    <AreaChart width={600} height={200} data={changesTimeline} syncId="timeline">
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="dateRecuder"/>
                    <YAxis/>
                    <Tooltip content={<CustomTooltip2/>}/>
                    <Area isAnimationActive={activeAnimation} animationDuration={7000} type='monotone' name="Adições" dataKey='additions' stroke='rgb(91, 197, 106)' fill='rgb(91, 197, 106, 0.5)' />
                    </AreaChart>

                    <AreaChart width={600} height={200} data={changesTimeline} syncId="timeline">
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="dateRecuder"/> 
                    <YAxis/>
                    <Tooltip content={<CustomTooltip3/>}/>
                    <Area isAnimationActive={activeAnimation} animationDuration={7000} onAnimationEnd={() => {
                        if(activeAnimation){
                            setActiveAnimation(false);
                        }
                    }} type='monotone' name="Remoções" dataKey='deletions' stroke='rgb(197, 148, 91)' fill='rgb(197, 148, 91,0.5)' />
                    </AreaChart>
                </div>
            </div>
        );
    }

    return(
        <div>
            <HeaderAuth title={title}/>
            <div className="div-global-page with-scroll header-is-auth">
            <div className="piechart-div">
                <PieChart width={700} height={400}>
                    <Pie 
                        activeIndex={indexOfValue}
                        activeShape={activeShape} 
                        labelLine={false}
                        data={actions.rank} 
                        cx={300} 
                        cy={200} 
                        innerRadius={60}
                        outerRadius={80} 
                        dataKey="total"
                        paddingAngle={2}
                        onMouseEnter={(data, index) => {
                            setIndexOfValue(index)}
                        }
                    >
                    {
                        actions.rank.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none"/>)
                    }
                    </Pie>
                    <Pie 
                        data={dataDetails} 
                        cx={300} 
                        cy={200}
                        dataKey="value" 
                        innerRadius={45}
                        outerRadius={55} 
                        paddingAngle={2}
                    >
                         {
                        dataDetails.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>)
                    }
                    </Pie>
                </PieChart>
                <div className="piechart-div-title">
                    <div>
                        <h1 className="piechart-title">Commits</h1>
                        <h2 className="piechart-detail">Total de Commits: <span className="color-theme-text">{qtdCommit}</span></h2>
                        <h2 className="piechart-detail">Total de Alterações: <span className="color-theme-text">{qtdChange}</span></h2>
                        <h2 className="piechart-detail">Total de Autores: <span className="color-theme-text">{qtdAuthor}</span></h2>
                        <h2 className="piechart-detail">Commits/Autores: <span className="color-theme-text">{(qtdCommit/qtdAuthor).toFixed(2)}</span></h2>
                        <h2 className="piechart-detail">Alterações/Autores: <span className="color-theme-text">{(qtdChange/qtdAuthor).toFixed(2)}</span></h2>
                        <h2 className="piechart-detail">Alterações/Commit: <span className="color-theme-text">{(qtdChange/qtdCommit).toFixed(2)}</span></h2>
                    </div>
                    <div>
                        <h1 className="piechart-title">Commit Recente</h1>
                        <h2 className="piechart-detail">{actions.commits[0].author} | <span className="color-theme-text">{actions.commits[0].message}</span></h2>
                    </div>
                </div>
            </div>

            <TimelineAreaChart/>

            </div>
        </div>
    );
}