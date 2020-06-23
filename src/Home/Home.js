import React from 'react'
import './../App.css'
import TopBar from './../Teamplate/TopBar'
import { Link } from 'react-router-dom'
import { socket, listaLabs, listarAlertas, ListarTodosPedidos } from './../Service'
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import AceitarPedido from './AceitarPedido'
import Pedido from './NovaReserva'
import { connect } from 'react-redux'

class Home extends React.Component{
    constructor(props){
        super(props);
        
        this.modal1 = React.createRef();
        this.Pedido = React.createRef();

        this.state = {
            ListaLabs : [],
            ListaAvisos : [],
            ListaPedidos : [],
            load : true,
            status : this.props.status
        }



    }

    componentDidMount(){
        this.loadLabs()
        this.loadAvisos()
        this.loadPedidos()

        socket.on('AtualizacaoLabs', function(data){
            console.log(data)
            this.setState({ListaLabs : data.Laboratorios})
        }.bind(this));

        socket.on('AtualizarPedidos', (data) =>{
            console.log({data})
            this.setState({ListaPedidos : data.pedidos})
        })

        
    }

    loadLabs(){
        this.setState({ ListaLabs : []}, function(){
            listaLabs(function(data){
                console.log(data)
                this.setState({ListaLabs : data.Laboratorios})

            }.bind(this))
        }.bind(this))

    }

    loadAvisos(){
        this.setState({ ListaAvisos : [] }, function(){
            listarAlertas(function(data){
                console.log(data)
                this.setState({ ListaAvisos : data.lista })
            }.bind(this))
        }.bind(this))
    }

    loadPedidos(){
        this.setState({ListaPedidos : [] }, ()=>{
            ListarTodosPedidos((data)=>{
                let saida = data.pedidos.map(element =>{
                    element.data = moment(element.data).format('DD/MM/YYYY');
                    if(element.status === 'em andamento'){
                        element.fundo = '#ebebff'
                    }else if(element.status === 'Aprovado'){
                        element.fundo = '#ecffec'
                    }
                    return element;
                })
                this.setState({ListaPedidos : saida})
            })
        })
    }

    clickPedido = (id_pedido) =>{
        this.modal1.current.display(id_pedido);
    }

    onAdd = () =>{
        this.Pedido.current.display(true)
    }

    render(){       
        
        return(
            <div className="home">
                <TopBar />

                <div className="container corpo">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                                <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">Dashboard</li>
                                </ol>
                                </div>
                                <h4 className="page-title">Dashboard</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3 ml-0 mr-0 text-white-50 bg-purple rounded shadow-sm">
                        <div className="col-3 d-flex align-items-center">
                            <i className="mdi mdi-cloud-outline mdi-36px ml-2 mr-2" style={{color : '#fff'}} />
                            <div className="lh-100">
                                <h6 className="mb-0 text-white lh-100">Status</h6>
                                <small>Status das conexões</small>
                            </div>
                        </div>
                        <div className="col-3 d-flex align-items-center text-white">
                            <span> <i  className="mdi mdi-circle" /> OS Inventury <span class="badge badge-dark p-1">Sem conexão</span> </span> 
                        </div>
                        <div className="col-3 d-flex align-items-center text-white">
                            <span> <i  className="mdi mdi-circle" /> UCB Sistema <span class="badge badge-dark p-1">Sem conexão</span> </span> 
                        </div>
                        <div className="col-3 d-flex align-items-center text-white">
                            <span> <i  className="mdi mdi-circle" /> UCB Labs <span class={ "badge " + this.props.color + " p-1" }>{this.props.status}</span> </span> 
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-8">
                            <div className="card shadow ">
                                <h5 className="card-header">
                                    <a href="#" onClick={() => this.onAdd()} className="float-right text-white">
                                        <i className="icon-plus icons"></i>
                                    </a>
                                    Reservas
                                </h5>
                                <div className="card-body">
                                    <p>Selecione um Laboratorio para ver as reservas</p>

                                    {this.state.ListaLabs.length > 0 &&
                                        <div className="row lista-computador">
                                            {this.state.ListaLabs.map( (elemento, index) => (
                                                <div key={index.toString()} className="col-2">
                                                    <Link className="item shadow" to={'/laboratorio/' + elemento.id_lab}>
                                                        <i className="icon-screen-desktop icons"></i>
                                                        <span>{elemento.local}</span>
                                                    </Link>
                                                </div>
                                            ))}
                                            
                                        </div>
                                    }
                                   {this.state.ListaLabs.length === 0 &&
                                        <div className="text-center">
                                            <div className="carregando"></div>
                                        </div>
                                    }
                                </div>
                            </div>
                         </div>
                         <div className="col-4">
                            <div className="card shadow ">
                                <h5 className="card-header">Ultimos perdidos</h5>
                                <div className="card-body" style={{padding : 0}}>
                                    
                                    {this.state.ListaPedidos.map(element =>{
                                        return(
                                            <a key={element.id_pedido} onClick={() => { if(element.status === 'em andamento'){this.clickPedido(element.id_pedido)} } } className="list-group-item list-group-item-action " style={{backgroundColor : element.fundo, cursor : 'pointer'}}>
                                                <p style={{margin : 0}}>Pedido dia <b>{element.data}</b> as <b>{element.hora_inicio}</b> da diciplina <b>{element.nome_disciplina}</b></p>
                                                <p style={{margin : 0}}>Status : {element.status}</p>
                                            </a>
                                        )
                                    })}

                                    {this.state.ListaPedidos.length === 0 &&
                                        <div style={{padding : '1.25rem'}}>
                                            <p className="card-text">Nenhum pedido pendente :)</p>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                            <div className="espaco"></div>
                            <div className="card shadow ">
                                <h5 className="card-header">Avisos</h5>
                                <div className="card-body">
                                    {this.state.ListaAvisos.length === 0 &&
                                        <p className="card-text">Nenhum aviso. Parece está tudo bem  :) </p>
                                    }

                                    {this.state.ListaAvisos.length > 0 && 

                                        <div className="list-group avisos">
                                            {this.state.ListaAvisos.map((elemento, index) => (
                                                <div className="media text-muted pb-3">
                                                    <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={elemento.color} /><text x="50%" y="50%" fill={elemento.color} dy=".3em">32x32</text></svg>
                                                    <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                        <span className="d-block text-gray-dark">
                                                            <a href="#" class="float-right">Ver</a>
                                                            <b>{elemento.local}</b>
                                                        </span>
                                                        {elemento.mensagem}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
                <AceitarPedido ref={this.modal1} />
                <Pedido ref={this.Pedido} />
            </div>
        )
    }
}

function mapStateToProps(states){
    return { status : states.status, color : states.color}
}

export default connect(mapStateToProps)(Home);