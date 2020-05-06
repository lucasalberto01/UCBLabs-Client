import React from 'react'
import './../App.css'
import TopBar from './../Teamplate/TopBar'
import { Link } from 'react-router-dom'
import { socket, listaLabs, listarAlertas, ListarTodosPedidos } from './../Service'
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import AceitarPedido from './AceitarPedido'

class Home extends React.Component{
    constructor(props){
        super(props);
        this.modal1 = React.createRef();
        this.state = {
            ListaLabs : [],
            ListaAvisos : [],
            ListaPedidos : [],
            load : true
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

    handleClickDayname = (ev) => {
        // view : week, day
        console.group('onClickDayname');
        console.log(ev.date);
        console.groupEnd();
    };


    clickPedido = (id_pedido) =>{
        this.modal1.current.display(id_pedido);
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
                    <div className="row">
                        <div className="col-8">
                            <div className="card shadow ">
                                <h5 className="card-header">Laboratorios</h5>
                                <div className="card-body">
                                    {this.state.ListaLabs.length > 0 &&
                                        <div className="row lista-computador">
                                            {this.state.ListaLabs.map( (elemento, index) => (
                                                    <div key={index.toString()} className="col-3">
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
                                        <div class="list-group avisos">
                                            {this.state.ListaAvisos.map(elemento => {
                                                return(
                                                    <a href="#" className="list-group-item list-group-item-action " style={{backgroundColor : elemento.color}}>
                                                        <span className="lab">{elemento.local}</span>
                                                        <span>{elemento.mensagem}</span>
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
                <AceitarPedido ref={this.modal1} />
            </div>
        )
    }
}

export default Home;