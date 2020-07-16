import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { addTiposLabs } from '../../Service'
import Swal from 'sweetalert2';

class AdicionarTipo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            nome : '',
            descricao : ''
        }
    }

    onDisplay = () =>{
        this.setState({exibir : true})
    }

    onSave = (e) =>{
        let { nome, descricao  } = this.state
        e.preventDefault()
        addTiposLabs(nome, descricao, data =>{
            if(data.success){
                Swal.fire({
                    title : 'Pronto',
                    text : 'Adicionado com sucesso',
                    icon : 'success'
                })
                this.setState({exibir : false})
            }

        })
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})}>
                <ModalHeader toggle={() => this.setState({exibir : false})} >Adicionar tipo de laboratorio</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSave}>
                        <FormGroup>
                            <Label>Nome</Label>
                            <Input  required type="text" onChange={({ target }) => this.setState({nome : target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descrição</Label>
                            <Input required type="textarea" onChange={({ target }) => this.setState({descricao : target.value})} />
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

export default AdicionarTipo
