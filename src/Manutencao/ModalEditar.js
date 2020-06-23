import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import { listarStatusManutancao, editarManutencao } from './../Service'
import Swal from 'sweetalert2';

class ModalEditar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            local : '',
            equipamento : '',
            status : [],
            id_status : 0,
            obs : '',
            id : 0
        }
    }

    componentDidMount(){

        listarStatusManutancao(data =>{
            this.setState({ status : data.status })
        })
    }

    display = (local, nome, id_status, obs, id) =>{
        this.setState({
            exibir : true,
            local,
            equipamento : nome,
            id_status,
            obs,
            id
        })
    }

    onSave = (e) =>{
        e.preventDefault()
        let { id, id_status, obs } = this.state

        let payload = {
            id,
            id_status,
            obs
        }

        editarManutencao(payload, data =>{
            if(data.success){
                Swal.fire({
                    title : 'Pronto',
                    text : 'Salvo com success',
                    type : 'success'
                })
                this.setState({ exibir : false})
            }
        })



    }

    render(){
        return(
            <>
                <Modal style={{maxWidth : 700}} isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} >
                    <ModalHeader toggle={() => this.setState({exibir : false})}>Editar Manutenção</ModalHeader>
                    <ModalBody>
                        <div>
                            <form onSubmit={this.onSave}>
                                <div>
                                    <h5>Informações</h5>
                                    <p>Laboratorio : <b>{this.state.local}</b></p>
                                    <p>Equipamento : <b>{this.state.equipamento}</b></p>
                                </div>
                                <hr/>
                                <div class="form-group">
                                    <label>Status</label>
                                    <Input defaultValue={this.state.id_status} type="select" onChange={({target}) => this.setState({ id_status : target.value} )}>
                                        {this.state.status.map(element =>{
                                            return(
                                                <option value={element.id}>{element.nome}</option>
                                            )
                                        })}
                                    </Input>
                                </div>
                                <div class="form-group">
                                    <label for="exampleFormControlTextarea1">Descrição do problema</label>
                                    <Input required type="textarea" value={this.state.obs} onChange={({target}) => this.setState({ obs : target.value} )} />
                                </div>
                                <div class="form-group" style={{float : 'right'}}>
                                    <Button color="secondary" onClick={() => this.setState({exibir : false})}>Cancelar</Button>
                                    <Button type="submit"  style={{marginLeft : 10}} color="success">Salvar</Button>                                  
                                </div>
                            </form>
                        </div>
                    </ModalBody>
                    
                </Modal>
            </>
        )
    }
}

export default ModalEditar;