import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalNova extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false
        }
    }

    display = () =>{
        this.setState({ exibir : true})
    }

    render(){
        return(
            <>
            <Modal style={{maxWidth : 700}} isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} >
                <ModalHeader toggle={() => this.setState({exibir : false})}>Nova Manutenção</ModalHeader>
                <ModalBody>
                    <div>
                        <form>
                            <div class="form-group">
                                <label>Selecionar Laboratorio</label>
                                <select class="form-control">
                                    <option>LAB 1</option>
                                    <option>LAB 2</option>
                                    <option>LAB 3</option>
                                    <option>LAB 4</option>
                                    <option>LAB 5</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Selecionar Equipamento</label>
                                <select class="form-control">
                                    <option>Projetor</option>
                                    <option>Switch</option>
                                    <option>Lampada</option>
                                    <option>4</option>
                                    <option>5</option>
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

export default ModalNova;