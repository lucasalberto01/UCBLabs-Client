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
        this.Labs = React.createRef()
    }

    componentDidMount(){
        this.calculos()
        this.listarLab()
        this.loadAvisos()
        setInterval(this.calculos, 1000);

        socket.on('UpdateStatusAvisos', function(data){
            this.setState({avisos : data.avisos})
        }.bind(this))

        socket.on('AtualizacaoLabs', function(data){
            console.log(data)
            this.setState({labs : data.Laboratorios})
        }.bind(this));

        
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
                <div className="container-fluid conteudo">
                    <div className="row">            
                        <div className="col-9">
                            <div className="card shadow">
                                <div className="card-header">
                                    <span className="float-right"><b>{this.state.hora}</b></span>
                                    Laboratorio e Aulas
                                </div>
                                <div className="card-body pt-0">
                                    <div className="row justify-content-center">
                                        {this.state.labs.map((item, i) => (
                                            <Lab lab={item} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card shadow">
                                <div className="card-header">Avisos</div>
                                <div className="card-body">
                                    {this.state.avisos.map((elemento, index) => (
                                        <div className="media text-muted pb-3" key={index}>
                                            <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={elemento.color} /><text x="50%" y="50%" fill={elemento.color} dy=".3em">32x32</text></svg>
                                            <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                <span className="d-block text-gray-dark">
                                                    
                                                    <b>{elemento.local}</b>
                                                </span>
                                                {elemento.mensagem}
                                            </p>
                                        </div>
                                    ))}
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