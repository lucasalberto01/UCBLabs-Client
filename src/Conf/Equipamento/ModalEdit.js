import React from 'react'
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { listaLabs, editEquipamentos, deleteEquipamentos } from './../../Service'

import Swal from 'sweetalert2'

class ModalEdit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            lista_lab : [],
            id_lab : 0,
            nome : null,
            descricao : null,
            code : null,
            id : 0,
            disable_lab : false

        }
    }

    componentDidMount(){
        listaLabs((data) =>{
            console.log(data)
            this.setState({lista_lab : data.Laboratorios, lab : data.Laboratorios[0].id_lab})

        })
    }

    onDisplay = (nome, descricao, code, id_lab, id, disable_lab=false) =>{
        
        this.setState({
            open : true,
            nome,
            descricao,
            code,
            id_lab,
            id,
            disable_lab
        })
    }

    onSave = (e) =>{
        e.preventDefault()
        let {id, id_lab, nome, descricao, code} = this.state

        let payload = {
            id_lab : parseInt(id_lab) === 0 ? null : id_lab, 
            nome, 
            descricao, 
            code : code,
            id
        }
        editEquipamentos(payload, (data) =>{
            if(data.success){
                Swal.fire({
                    type: 'success',
                    title: 'Prontinho',
                    text: 'Editado com sucesso salvo com sucesso!'
                })
                this.setState({ open : false });
            }
        })
    }

    onDelete = () =>{
        let { id, id_lab } = this.state
        Swal.fire({
            title : 'Certeza ?',
            text : 'Tem certeza que deseja apagar esse equipamento ?',
            showCancelButton : true,
            type : 'question',
            cancelButtonText : 'Não',
            confirmButtonText : 'Sim'
        })
        .then(resp =>{
            if(resp.value){
                deleteEquipamentos(id, id_lab, data =>{
                    if(data.success){
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Apagado com sucesso salvo com sucesso!'
                        })
                        this.setState({ open : false });
                    }
                })
            }
        })
    }

    render(){
        return(
            <Modal isOpen={this.state.open} toggle={() => this.setState({open : false})} className={'modal-lg'} >
                <ModalHeader toggle={() => this.setState({open : false})}>Editar Equipamento</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSave}>
                        <FormGroup>
                            <Label>Laboratorio</Label>
                            <Input defaultValue={this.state.id_lab} disabled={this.state.disable_lab} type="select" onChange={({target}) => this.setState({ id_lab : target.value} )}>
                                <option value={0}>Não pertence a um Laboratorio</option>
                                {this.state.lista_lab.map((elemento, index) => (
                                    <option key={index} value={elemento.id_lab }>{elemento.local}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nome</Label>
                            <Input type="text" required placeholder="Nome equipamento" onChange={({target}) => this.setState({ nome : target.value})} value={this.state.nome} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descricção</Label>
                            <Input type="textarea" required  placeholder="Descricção do equipamento" onChange={({target}) => this.setState({ descricao : target.value})} value={this.state.descricao} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Codigo interno</Label>
                            <Input type="text"  placeholder="Opcional..." onChange={({target}) => this.setState({ code : target.value})} value={this.state.code} />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button style={{margin : 5}} onClick={() => this.setState({ open : false })} color="secondary">Cancelar</Button>
                            <Button style={{margin : 5}} color="danger" onClick={this.onDelete}>Apagar</Button>
                            <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        )
    }
}

export default ModalEdit