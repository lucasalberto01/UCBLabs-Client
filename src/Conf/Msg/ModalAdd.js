import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, FormText, Form, FormGroup, Label, Input, } from 'reactstrap';
import { saveTipoAviso } from './../../Service'
import Swal from 'sweetalert2'


class ModalAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            cor : '#023490',
            tipo : '',
            icone : ''
        }
    }

    onDisplay = () =>{
        this.setState({ exibir : true})
    }

    onSave = (e) => {
        e.preventDefault()
        let { cor, tipo, icone } = this.state

        saveTipoAviso({ cor, tipo, icone }, (data)=>{
            console.log(data)

            if(data.success){
                Swal.fire({
                    type: 'success',
                    title: 'Prontinho',
                    text: 'Tipo de Aviso salvo com sucesso!'
                })
                this.setState({ exibir : false })
            }
        })
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({ exibir : false })} >
                <ModalHeader className="text-center" toggle={() => this.setState({ exibir : false })} >Adicionar Alerta</ModalHeader>
                <ModalBody>
                    <div className="editar-alerta">
                        <div className="row">
                            <div className="col-12">
                            <Form onSubmit ={ this.onSave }>
                                <FormGroup>
                                    <Label for="exampleSelect">Tipo</Label>
                                    <Input required type="text" value={this.state.tipo} onChange={({target}) => this.setState({ tipo : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Selecione a Cor</Label>
                                    <br/>
                                    <Input required type="color" value={this.state.cor} onChange={({target}) => this.setState({ cor : target.value} )} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Icone Name</Label>
                                    <Input required type="text" value={this.state.icone} onChange={({target}) => this.setState({ icone : target.value} )} />
                                    <FormText color="muted">
                                        Ultilizamos os icones do <a href="https://simplelineicons.github.io/">Simple Line Icons</a>. Só pegar o nome e colar nesse campo
                                    </FormText>
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