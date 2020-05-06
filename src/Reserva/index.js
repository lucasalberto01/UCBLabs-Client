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
                        <div class="col-12">
                            <div class="page-title-box">
                               
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6">
                                    <div className="card">
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
                                <div className="col-6">
                                    <div className="card shadow">
                                        <div className="card-header">Seus Pedidos Recentes</div>
                                        <div className="" style={{marginTop : 15}}>
                                            <ul className="list-group">
                                                {this.state.pedidos.map(element =>{
                                                    return(
                                                        <li className="list-group-item" style={{backgroundColor : element.fundo}}>
                                                            <p style={{margin : 0}}>Pedido dia <b>{element.data}</b> as <b>{element.hora_inicio}</b> da diciplina {element.diciplina}</p>
                                                            <p style={{margin : 0}}>Status : {element.status}</p>
                                                        </li>
                                                    )
                                                })}
                                            </ul>

                                        </div>
                                    </div> 
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