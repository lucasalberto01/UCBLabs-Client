import React from 'react';
import Cookies from 'universal-cookie';

import TopBar from './../Teamplate/TopBar'
import Pedido from './Pedido'
import ModalVerReservas from './ModalVerReservas'
import ModalPedidos from './ModalPedidos'

import { socket, ListarPedidos } from './../Service'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

const cookies = new Cookies();

class Reserva extends React.Component{
    constructor(props){
        super(props)
        this.modal1 = React.createRef();
        this.ModalVerReservas = React.createRef();
        this.ModalPedidos = React.createRef();

        this.state = {
            pedidos : []
        }
    }

    pedido = () =>{
        this.modal1.current.display();
    }

    onReservas = () =>{
        this.ModalVerReservas.current.onDisplay()
    }

    onPedidos = () =>{
        this.ModalPedidos.current.onDisplay();
    }

    componentDidMount(){
        let cokie = cookies.get('WebApp')
        let id = cokie.id_usuario;
        ListarPedidos(id, (data)=>{
            
            let saida = data.pedidos.map(element =>{
                element.data = moment(element.data).format('DD/MM/YYYY');
                if(element.status === 'em andamento'){
                    element.fundo = '#ebebff'
                }
                return element;
            })
            


            this.setState({pedidos : saida})
        })

    }

    colorPedido = (status) =>{
        if(status === 'Aprovado'){
            return '#28a745'
        }else if(status === 'Cancelado'){
            return '#dc3545'
        }else{
            return '#6c757d'
        }
    }

    render(){
        return(
            <div className="home">
            <TopBar disabled_nav={true} />

                <div className="container corpo">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                                <h4 class="page-title">Coordenador</h4>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col-sm-12">
                            <button type="button" class="btn btn-outline-primary" onClick={this.pedido}><i class="icon-plus icons"></i> Fazer Pedido</button>
                            <button type="button" class="btn btn-outline-primary ml-3" onClick={this.onReservas}> <i class="icon-plus icons"></i> Ver Todas Reserva</button>
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow">
                                <div className="card-header">Seus Pedidos Recentes</div>
                                <div className="card-body">

                                    <div>
                                        <h4>Ultimos pedidos</h4>
                                        <p>Legenda dos Status : 
                                            <span class="badge badge-secondary m-1 p-1"> Pendente </span> 
                                            <span class="badge badge-success m-1 p-1"> Aprovado </span> 
                                            <span class="badge badge-danger m-1 p-1"> Reprovado </span> 
                                        </p>
                                    </div>

                                    <div class="bg-white rounded">
                                    
                                        <h6 className="border-bottom border-gray pb-2 mb-2">Pedidos Feitos</h6>
                                        <div className="row">
                                            {this.state.pedidos.map(element =>(
                                                <div className="col-4">
                                                    <div className="media pt-3">
                                                        <svg className="bd-placeholder-img mr-2 rounded" width={32} height={55} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={this.colorPedido(element.status)} /><text x="50%" y="50%" fill={this.colorPedido(element.status)}  dy=".3em">32x32</text></svg>
                                                        <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                                <strong className="text-gray-dark">Diciplina {element.nome_disciplina}</strong>
                                                            </div>
                                                            <span>Data : {element.data} as {element.hora_inicio} </span>
                                                            <span className="d-block text-muted">Status : {element.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <small className="d-block text-right mt-3">
                                            <a href="#" onClick={this.onPedidos}>Ver todos</a>
                                        </small>
                                    
                                    </div>

                                </div>
                            </div> 
                        </div>
                    </div>
                </div>  
                <Pedido ref={this.modal1} />
                <ModalVerReservas ref={this.ModalVerReservas} />
                <ModalPedidos ref={this.ModalPedidos} />
            </div>
        )
    }
}

export default Reserva;