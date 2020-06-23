import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, FormText, Form, FormGroup, Label, Input, } from 'reactstrap';
import { editarTipoAviso, apagarTipoAviso, ativarTipoAviso } from './../../Service'
import Swal from 'sweetalert2'

class ModalEdit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            tipo : null,
            cor : null,
            icone : null,
            id : null,
            ativo : 1
        }
    }

    componentDidMount(){

    }

    onDisplay  = (id, icone, tipo, cor, ativo) =>{
        this.setState({ open : true, id, cor, icone, tipo, ativo : parseInt(ativo)})
    }

    onSave = (e) =>{
        let { id, cor, icone, tipo } = this.state
        e.preventDefault()

        editarTipoAviso({ id, cor, icone, tipo }, (data) =>{
            console.log(data)
            if(data.success){
                Swal.fire({
                    type: 'success',
                    title: 'Prontinho',
                    text: 'Tipo de Aviso editado com sucesso!'
                })
                this.setState({ open : false })
            }
        })
    }

    onDetele = () =>{
        let {id } = this.state
        Swal.fire({
            title : 'Certeza?',
            text : 'Tem certeza que deseja desativer este tipo de aviso ?',
            type : 'question',
            showCancelButton : true,
            cancelButtonText : 'Cancelar',
            cancelButtonColor : 'red',
            confirmButtonText : 'Tenho certeza',
        })
        .then((result) =>{
            if(result.value){
                apagarTipoAviso({id}, (data) =>{
                    if(data.success){
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Tipo de aviso desativado com sucesso!'
                        })
                        this.setState({open : false})
                    }
                    
                })
            }
        })
    }

    onEnable = () =>{
        let { id } = this.state

        Swal.fire({
            title : 'Certeza?',
            text : 'Tem certeza que deseja ativar este tipo de aviso ?',
            type : 'question',
            showCancelButton : true,
            cancelButtonText : 'Cancelar',
            cancelButtonColor : 'red',
            confirmButtonText : 'Tenho certeza',
        })
        .then((result) =>{
            if(result.value){
                ativarTipoAviso({id}, (data) =>{
                    if(data.success){
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Tipo de aviso desativado com sucesso!'
                        })
                        this.setState({open : false})
                    }
                    
                })
            }
        })
    }


    render(){
        return(
            <Modal isOpen={this.state.open} toggle={() => this.setState({ open : false })} >
                <ModalHeader className="text-center" toggle={() => this.setState({ open : false })} >Editar Alerta</ModalHeader>
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
                                    <Button style={{margin : 5}} onClick={() => this.setState({ open : false })} color="secondary">Cancelar</Button>
                                    {this.state.ativo === 1 ? 
                                        <Button style={{margin : 5}} onClick={this.onDetele} color="danger">Desativar</Button>
                                    :
                                        <Button style={{margin : 5}} onClick={this.onEnable} color="info">Ativar</Button>
                                    }
                                    
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