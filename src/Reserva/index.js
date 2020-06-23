import React from 'react';
import Cookies from 'universal-cookie';

import TopBar from './../Teamplate/TopBar'
import Pedido from './Pedido'

import { socket, ListarPedidos } from './../Service'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

const cookies = new Cookies();

class Reserva extends React.Component{
    constructor(props){
        super(props)
        this.modal1 = React.createRef();
        this.state = {
            pedidos : []
        }
    }

    pedido = () =>{
        this.modal1.current.display();
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

    render(){
        return(
            <div className="home">
            <TopBar disabled_nav={true} />

                <div className="container corpo">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                               
                            </div>
                        </div>
                    </div>
                   
                    <div className="row">
                        <div className="col-8">
                            <div className="card shadow">
                                <div className="card-header">Seus Pedidos Recentes</div>
                                <div className="card-body">

                                    <div>
                                        <h4>Todos os seus pedidos</h4>
                                        <p>Legenda dos Status : 
                                            <span class="badge badge-secondary m-1 p-1"> Pendente </span> 
                                            <span class="badge badge-success m-1 p-1"> Aprovado </span> 
                                            <span class="badge badge-danger m-1 p-1"> Reprovado </span> 
                                        </p>
                                    </div>

                                    <div class="bg-white rounded">
                                    
                                        <h6 className="border-bottom border-gray pb-2 mb-2">Pedidos</h6>
                                        <div className="row">
                                            {this.state.pedidos.map(element =>(
                                                <div className="col-6">
                                                    <div className="media text-muted pt-3">
                                                        <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                                                        <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                                <strong className="text-gray-dark">Pedido dia <b>{element.data}</b> as <b>{element.hora_inicio}</b> da diciplina {element.diciplina}</strong>
                                                                
                                                            </div>
                                                            <span className="d-block">Status : {element.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        

                                        <small className="d-block text-right mt-3">
                                            <a href="#">Ver todos</a>
                                        </small>
                                    
                                    </div>

                                </div>
                            </div> 
                        </div>
                        <div className="col-4">
                            <div className="card shadow">
                                <div className="card-header text-center">Home</div>
                                <div className="card-body text-secondary">
                                    <h5 className="card-title">Bem Vindo </h5>
                                    <p className="card-text text-center">Funçoes Basicas.</p>
                                    <button className="btn btn-info btn-block" onClick={this.pedido}>Pedir Reserva Sala</button>
                                    <button className="btn btn-info btn-block">Ver Todas seus Pedidos</button>
                                    <button className="btn btn-info btn-block">Ver Todas as Reservas</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>  
                <Pedido ref={this.modal1} />
            </div>
        )
    }
}

export default Reserva;