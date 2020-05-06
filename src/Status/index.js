import React from 'react'
import logo from './../img/logo-login.png'
import Lab from './Lab'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Moment from 'react-moment';

import { listarAlertas, listaLabs, socket } from './../Service';


moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-BR');

class Status extends React.Component{
    constructor(props){
        super(props)
        this.state = { hora : '', labs : [], avisos : []}
        this.calculos = this.calculos.bind(this)
        this.listarLab = this.listarLab.bind(this)
        this.loadAvisos = this.loadAvisos.bind(this)
    }

    componentDidMount(){
        this.calculos()
        this.listarLab()
        this.loadAvisos()
        setInterval(this.calculos, 1000);

        socket.on('UpdateStatusAvisos', function(data){
            this.setState({avisos : data.avisos})
            
        }.bind(this))
    }

    calculos(){
        var now = moment();
        this.setState({hora : now.format('HH:mm:ss')})

    }

    listarLab(){
        listaLabs(function(data){
            console.log(data)
            
            this.setState({ labs : data.Laboratorios })
        }.bind(this));
    }

    loadAvisos(){
        listarAlertas(function(data){
            this.setState({avisos : data.lista})
        }.bind(this))
    }

    render(){
        return(
            
            <div className="status">
                <div className="cabecalho">
                    <img src={logo} />
                </div>
                <div className="container conteudo">
                    <div className="row">
                        <div className="col-12">
                            <h3>Avisos</h3>
                                <div className="avisos">
                                    {this.state.avisos.map(element => {
                                        return(
                                            <div className="alert" style={{backgroundColor : element.color}} role="alert">
                                                <div className="row" >
                                                    <div className="col-1">
                                                        <i class="icon-screen-desktop icons"></i>
                                                    </div>
                                                    <div className="col-11">
                                                        <b>{element.local}</b>
                                                        <span>{element.mensagem}</span>
                                                    </div>
                                                </div>
                                                
                                            </div>  
                                        )
                                    })}
                                    
                                </div>
                        </div>
                        <div className="col-12">
                            <h3 className="titulo float-right"><b>{this.state.hora}</b></h3>
                            <h3 className="titulo">Laboratorio e Aulas atuais</h3>
                        </div>
                        <div className="col-12">
                            <div className="card shadow">
                                <div className="card-body">
                                    <div className="row">
                                        {this.state.labs.map((item, i) => {

                                           return <Lab lab={item} />
                                        })}
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Status;