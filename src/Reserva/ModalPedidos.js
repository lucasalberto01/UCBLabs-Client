import React from 'react'
import { Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import moment from 'moment'
import { ListarPedidosData } from '../Service'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ModalPedidos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            date : moment().format('YYYY-MM-DD'),
            pedidos : []
        }
    }

    componentDidMount(){
        this.onLoad()
    }

    onDisplay = () =>{
        this.setState({exibir : true})
    }

    onLoad = () =>{
        let { date } = this.state

        let cokie = cookies.get('WebApp')
        let id_remetente = cokie.id_usuario
        this.setState({pedidos : []})
        
        ListarPedidosData(id_remetente, date, ({pedidos}) =>{
            console.log(pedidos)
            this.setState({pedidos})
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
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} className={'modal-lg'}>
                <ModalHeader toggle={() => this.setState({exibir : false})}>Pedidos</ModalHeader>
                <ModalBody>
                    <h5>Ver todos os pedidos</h5>
                    <small>Selecione uma data para ver todos os pedidos desse dia</small>
                    <Input type="date" value={this.state.date} onChange={({target }) => this.setState({date : target.value}, () => this.onLoad())} />

                    <h6 className="text-muted border-bottom pb-2 mt-3">Pedidos desse dia</h6>

                    <div>
                        {this.state.pedidos.map(element =>(
                          
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
                            
                        ))}

                        {this.state.pedidos.length === 0 &&
                            <div className="mt-1">
                                <p><i className="mdi mdi-close" /> Não foi feito nenhum pedido nesse dia</p>
                            </div>
                        }
                        

                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

export default ModalPedidos;