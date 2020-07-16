import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { editTiposLabs } from '../../Service'
import Swal from 'sweetalert2';

class EditarTipo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            id : 0,
            nome : '',
            descricao : ''
        }
    }

    onDisplay = (nome, descricao, id) =>{
        this.setState({exibir : true, nome, descricao, id})
    }

    onSave = (e) =>{
        let { nome, descricao, id } = this.state
        e.preventDefault()
        editTiposLabs(nome, descricao, id, data =>{
            if(data.success){
                Swal.fire({
                    title : 'Pronto',
                    text : 'Editado com sucesso',
                    icon : 'success'
                })
                this.setState({exibir : false})
            }

        })
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})}>
                <ModalHeader toggle={() => this.setState({exibir : false})} >Editar tipo de laboratorio</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSave}>
                        <FormGroup>
                            <Label>Nome</Label>
                            <Input  required type="text" value={this.state.nome} onChange={({ target }) => this.setState({nome : target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descricao</Label>
                            <Input required type="textarea" value={this.state.descricao} onChange={({ target }) => this.setState({descricao : target.value})} />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button onClick={() => this.setState({exibir : false})} color="danger">Cancelar</Button>
                            <Button className="ml-2" type="submit" color="success">Salvar</Button>
                            
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        )
    }
}

export default EditarTipo
