import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, FormText, Form, FormGroup, Label, Input, } from 'reactstrap';
import { editarDisciplinas } from './../../Service'
import Swal from 'sweetalert2'

class ModalEdit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            nome : null,
            professor : null,
            cor : null,
            id : null
        }
    }


    onDisplay  = (id, nome, professor, cor) =>{
        this.setState({ open : true, id, cor, nome, professor})
    }

    onSave = (e) =>{
        let { id, cor, nome, professor } = this.state
        e.preventDefault()

        editarDisciplinas({ id, cor, nome, professor  }, (data) =>{
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

    render(){
        return(
            <Modal isOpen={this.state.open} toggle={() => this.setState({ open : false })} className={'modal-lg'} >
                <ModalHeader className="text-center" toggle={() => this.setState({ open : false })} >Editar Disciplina</ModalHeader>
                <ModalBody>
                    <div className="editar-alerta">
                        <div className="row">
                            <div className="col-12">
                            <Form onSubmit ={ this.onSave }>
                                <FormGroup>
                                    <Label for="exampleSelect">Nome</Label>
                                    <Input required type="text" value={this.state.nome} onChange={({target}) => this.setState({ nome : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleSelect">Professor</Label>
                                    <Input required type="text" value={this.state.professor} onChange={({target}) => this.setState({ professor : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Selecione a Cor</Label>
                                    <Input required type="color" value={this.state.cor} onChange={({target}) => this.setState({ cor : target.value} )} />
                                </FormGroup>
                                <FormGroup className="float-right">
                                    <Button style={{margin : 5}} onClick={() => this.setState({ open : false })} color="secondary">Cancelar</Button>
                                    <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                                </FormGroup>
                                
                            </Form>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )

    }
}

export default ModalEdit;