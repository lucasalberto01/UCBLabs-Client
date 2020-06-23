import React from 'react'
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { listaLabs, addEquipamentos } from './../../Service'

import Swal from 'sweetalert2'

class ModalAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            lista_lab : [],
            lab : 0,
            disable_lab_select : false,
            nome : null,
            descricao : null,
            codigo : null
        }
    }

    componentDidMount(){
        listaLabs((data) =>{
            console.log(data)
            this.setState({lista_lab : data.Laboratorios, lab : data.Laboratorios[0].id_lab})

        })

    }

    onSave = (e) =>{
        e.preventDefault()
        let { lab, nome, descricao, codigo} = this.state

        let payload = {
            id_lab : lab, 
            nome, 
            descricao, 
            code : codigo
        }

        addEquipamentos(payload, (data) =>{
            if(data.success){
                Swal.fire({
                    type: 'success',
                    title: 'Prontinho',
                    text: 'Adicionado com sucesso salvo com sucesso!'
                })
                this.setState({ open : false });
            }
        })

        
    }

    onDisplay = (lab=0) =>{
        let disable_lab_select = lab === 0 ? false : true
        this.setState({open : true, lab, disable_lab_select})
    }

    render(){
        return(
            <Modal isOpen={this.state.open} toggle={() => this.setState({open : false})} className={'modal-lg'} >
                <ModalHeader toggle={() => this.setState({open : false})}>Adicionar Equipamento</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSave}>
                        <FormGroup>
                            <Label>Laboratorio</Label>
                            <Input disabled={this.state.disable_lab_select} defaultValue={this.state.lab} type="select" onChange={({target}) => this.setState({ lab : target.value} )}>
                                <option value={0}>Não pertence a um Laboratorio</option>
                                {this.state.lista_lab.map((elemento, index) => (
                                    <option key={index} value={elemento.id_lab }>{elemento.local}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Nome</Label>
                            <Input type="text" required placeholder="Nome equipamento" onChange={({target}) => this.setState({ nome : target.value})}  />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descricção</Label>
                            <Input type="textarea" required  placeholder="Descricção do equipamento" onChange={({target}) => this.setState({ descricao : target.value})}  />
                        </FormGroup>
                        <FormGroup>
                            <Label>Codigo interno</Label>
                            <Input type="text"  placeholder="Opcional..." onChange={({target}) => this.setState({ codigo : target.value})}  />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button style={{margin : 5}} onClick={() => this.setState({ open : false })} color="secondary">Cancelar</Button>
                            <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        )
    }
} 

export default ModalAdd;