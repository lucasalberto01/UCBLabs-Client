import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, } from 'reactstrap';
import Swal from 'sweetalert2'
import { addDisciplina } from './../../Service'

class ModalAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            nome : '',
            professor : '',
            cor : null
        }
    }

    onDisplay = () =>{
        this.setState({ exibir : true, cor : this.gera_cor(), nome : '', professor : ''})
    }

    gera_cor =() =>{
        var hexadecimais = '0123456789ABCDEF';
        var cor = '#';
      
        // Pega um número aleatório no array acima
        for (var i = 0; i < 6; i++ ) {
        //E concatena à variável cor
            cor += hexadecimais[Math.floor(Math.random() * 16)];
        }
        return cor;
    }

    onSave = (e) =>{
        e.preventDefault()
        let { cor, nome, professor } = this.state
        
        addDisciplina({cor, nome, professor}, (data) =>{
            if(data.success){
                Swal.fire({
                    type: 'success',
                    title: 'Prontinho',
                    text: 'Editado com sucesso salvo com sucesso!'
                })
                this.setState({ exibir : false });
            }
        })

    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({ exibir : false })} >
                <ModalHeader className="text-center" toggle={() => this.setState({ exibir : false })} >Adicionar Disciplina</ModalHeader>
                <ModalBody>
                    <div className="editar-alerta">
                        <div className="row">
                            <div className="col-12">
                            <Form onSubmit ={ this.onSave }>
                                <FormGroup>
                                    <Label>Nome</Label>
                                    <Input required type="text" placeholder="Ex : Informatica" value={this.state.nome} onChange={({target}) => this.setState({ nome : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label >Professor</Label>
                                    <Input required type="text" placeholder="Ex : Professor Silva" value={this.state.professor} onChange={({target}) => this.setState({ professor : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Selecione a Cor</Label>
                                    <Input required type="color" value={this.state.cor} onChange={({target}) => this.setState({ cor : target.value} )} />
                                </FormGroup>
                                <FormGroup className="float-right">
                                    <Button style={{margin : 5}} onClick={() => this.setState({ exibir : false })} color="secondary">Cancelar</Button>
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

export default ModalAdd;