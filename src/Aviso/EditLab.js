import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, } from 'reactstrap';
import { socket, tiposAlertas, listaLabs, editarAlerta, apagarAlerta } from './../Service'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';
import Swal from 'sweetalert2'

class EditLab extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            lista_lab : [],
            listaTipos : [],
            lab : null,

            editar_idLab : null,
            editar_dataTermino : null,
            editar_idTipoAlerta : null,
            editar_mensagem : null,
            editar_indefinido : false,
            editar_id : null


        }
    }

    componentDidMount(){
      
        listaLabs((data) =>{
            console.log(data)
            this.setState({lista_lab : data.Laboratorios, lab : data.Laboratorios[0].id_lab})

        })

        socket.on('AtualizacaoLabs', (data) =>{
            this.setState({lista_lab : data.Laboratorios})
        });

        tiposAlertas((data) => {
           
            this.setState({ listaTipos : data.tipos, tipoAlerta : data.tipos[0].id_aviso})

        })

        socket.on('AtualizacaoTiposAvisos', (data) =>{
            this.setState({ listaTipos : data.lista })
        })

    }

    onDisplay = (data) =>{
        this.setState({ 
            open : true, 
            editar_idLab : data.editar_idLab, 
            editar_dataTermino : data.editar_dataTermino,
            editar_idTipoAlerta : data.editar_idTipoAlerta,
            editar_mensagem : data.editar_mensagem,
            editar_indefinido : data.editar_indefinido,
            editar_id : data.editar_id
        })
    }

    onSave = (e) =>{
        e.preventDefault()

        let { editar_id, editar_idTipoAlerta, editar_idLab, editar_mensagem, editar_dataTermino} = this.state
        let data = {
            id_aviso : editar_id,
            id_tipo_aviso : editar_idTipoAlerta, 
            id_reserva : null, 
            id_lab : editar_idLab, 
            mensagem : editar_mensagem, 
            data_final : editar_dataTermino,
            indefinido : editar_dataTermino === null ? true : false,
        }
        console.log(data)
        
        editarAlerta(data, function(data){
            console.log(data)
            if(data.sucesso){
                this.setState({open : false})

                Swal.fire(
                    'Pronto!',
                    'Aviso foi editado com sucesso!',
                    'success'
                )
            }else{
                Swal.fire(
                    'Opss!',
                    'Algo de errado aconteceu, tente novamente!',
                    'error'
                )
            }
            
        }.bind(this))
    }

    apagarAlerta = () =>{

        let { editar_id } = this.state
        Swal.fire({
            title : 'Certeza?',
            text : 'Tem certeza que deseja apagar este aviso ? Esse caminho não tem mais volta...',
            type : 'question',
            showCancelButton : true,
            cancelButtonText : 'Cancelar',
            cancelButtonColor : 'red',
            confirmButtonText : 'Tenho certeza',
        })
        .then((result) =>{
           
            if(result.value){
                apagarAlerta(editar_id, function(data){
                    if(data.sucesso){
                     
                        Swal.fire(
                            'Pronto!',
                            'Aviso foi apagado com sucesso!',
                            'success'
                        )
                        this.setState({open : false})
                    }else{
                        Swal.fire(
                            'Opss!',
                            'Algo de errado aconteceu, tente novamente!',
                            'error'
                        )
                    }
                }.bind(this))

            }
        })
    }

    render(){
        return(
            <Modal isOpen={this.state.open} toggle={() => this.setState({ open : false })} className={'modal-lg'} >
                <ModalHeader className="text-center" toggle={() => this.setState({ open : false })} >Editar Alerta</ModalHeader>
                <ModalBody>
                    <div className="editar-alerta">
                        <div className="row">
                            <div className="col-12">
                            <Form onSubmit ={ this.onSave }>
                                <FormGroup>
                                    <Label for="exampleSelect">Selecione o Laboratorio</Label>
                                    <Input disabled value={this.state.editar_idLab} type="select" onChange={({target}) => this.setState({ editar_idLab : target.value} )}>
                                        {this.state.lista_lab.map((elemento) => (
                                            <option value={elemento.id_lab }>{elemento.local}</option>
                                        ))}
                                        
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Até quando exibir</Label>
                                    <br/>
                                    <div class="row data-alerta">
                                        <div class="col-8">
                                            <Input type="datetime" value={moment(this.state.editar_dataTermino, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DDTHH:mm')} onChange={({target}) => this.setState({editar_dataTermino : target.value})} />
                                        </div>
                                        <div className="col-4">
                                            <Input onChange={({target}) => this.setState({ editar_indefinido : target.checked, editar_dataTermino : null })} checked={this.state.editar_indefinido ? true : false} type="checkbox" /> Exibir indefinidamente
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Tipo de Mensagem</Label>
                                        <Input type="select" value={this.state.editar_idTipoAlerta} onChange={({target}) => this.setState({ editar_idTipoAlerta : target.value} )}>
                                            {this.state.listaTipos.map(element => {
                                                return (
                                                    <option value={element.id_aviso}>
                                                        {element.tipo}
                                                    </option>
                                                )
                                            })}
                                        </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleText">Mensagem</Label>
                                    <Input required value={this.state.editar_mensagem} onChange={({target}) => this.setState({ editar_mensagem : target.value })} type="textarea" name="text" id="exampleText" />
                                </FormGroup>
                                <FormGroup className="float-right" >
                    
                                    <Button style={{margin : 5}} onClick={() => this.setState({ open : false})} color="secondary">Cancelar</Button>
                                    <Button className="mr-1" color="danger" onClick={this.apagarAlerta}>Apagar</Button>
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

export default EditLab;