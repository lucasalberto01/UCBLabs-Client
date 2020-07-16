import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import moment from 'moment'

import { listarAlertasDate, listaLabs } from '../Service'

class ModalTodos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            date : moment().format('YYYY-MM-DD'),
            avisos : []
        }
    }

    onDisplay = () =>{
        this.setState({exibir : true})
        this.onLoad()
    }

    onSelect = ({target}) =>{
        this.setState({date : target.value}, () => this.onLoad())
    }

    onLoad = () =>{
        let { date } = this.state

        listarAlertasDate(date, ({lista}) =>{
            console.log(lista)
            this.setState({avisos : lista})
        })
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} className="modal-lg" >
                <ModalHeader toggle={() => this.setState({exibir : false})}>Todos os Avisos</ModalHeader>
                <ModalBody>
                    <div>
                        <h5>Todos os alertas por data</h5>
                        <p>Selecione uma data para ver todos os pedidos feitos nessa data</p>
                        <Input value={this.state.date} onChange={this.onSelect} type="date" />
                    </div>
                    <h5 className="text-muted border-bottom mt-3 pb-2">Avisos</h5>
                    <div>
                        {this.state.avisos.map((element, index) =>(
                            <div className="media pb-3" key={index}>
                                <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={element.color} /><text x="50%" y="50%" fill={element.color} dy=".3em">32x32</text></svg>
                                <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                    <span className="d-block"><b>{element.local}</b> by {element.sobre} {element.data_final}</span>
                                    {element.mensagem}
                                </p>
                            </div>
                        ))}
                        {this.state.avisos.length === 0 &&
                            <div>
                                <p>Nenhum aviso foi criado nesse dia</p>
                            </div>
                        }
                        
                    </div>

                </ModalBody>
            </Modal>
        )
    }
}

export default ModalTodos;