import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalEditar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false
        }
    }

    display = (id) =>{
        this.setState({exibir : true})
    }

    render(){
        return(
            <>
                <Modal style={{maxWidth : 700}} isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} >
                    <ModalHeader toggle={() => this.setState({exibir : false})}>Editar Manutenção</ModalHeader>
                    <ModalBody>
                        <div>
                            <form>
                                <div>
                                    <h5>Informações</h5>
                                    <p>Laboratorio : <b>Lab 01</b></p>
                                    <p>Equipamento : <b>Projetor</b></p>
                                </div>
                                <hr/>
                                <div class="form-group">
                                    <label>Status</label>
                                    <select class="form-control">
                                        <option>Problema Encontrado</option>
                                        <option>Em andamento</option>
                                        <option>Resolvido</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="exampleFormControlTextarea1">Descrição do problema</label>
                                    <textarea class="form-control" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success">Salvar</Button>
                        <Button color="secondary" onClick={() => this.setState({exibir : false})}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default ModalEditar;