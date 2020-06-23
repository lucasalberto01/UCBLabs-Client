import React from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, Col, Button } from 'reactstrap';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Swal from 'sweetalert2'


import { editarAlerta, DadosReserva, tiposAlertas, apagarAlerta, socket } from './../Service'


class EditReserva extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            id_reserva : 0,
            listaTipos : [],
            dados : null,
            indefinido : false,
            date : null,
            id_tipo_alerta : 0,
            id_aviso : 0,
            id_lab : 0,
            msg : null,


        }
    }

    componentDidMount(){
        tiposAlertas((data) => {
            this.setState({ listaTipos : data.tipos, tipoAlerta : data.tipos[0].id_aviso})
        })

        socket.on('AtualizacaoTiposAvisos', (data) =>{
            this.setState({ listaTipos : data.lista })
        })
    }

    onDisplay = (data) =>{


        let { id_reserva, editar_indefinido, editar_dataTermino, editar_idTipoAlerta, editar_mensagem, editar_idLab, editar_id } = data

        this.setState({
            open : true, 
            indefinido : editar_indefinido,
            date : editar_dataTermino,
            id_tipo_alerta : editar_idTipoAlerta,
            id_aviso : editar_id,
            id_lab : editar_idLab,
            msg : editar_mensagem,
            id_reserva
        })

        DadosReserva(id_reserva, (data) =>{
            if(data.dados.length > 0){
                this.setState({ dados : data.dados[0], id_lab : data.dados[0].id_lab })
            }else{
                this.setState({ dados : null, id_lab : 0 })
            }

        })
 
    }

    onSave = (e) =>{
        e.preventDefault()

        let { id_aviso, id_tipo_alerta, id_reserva, id_lab, msg, date } = this.state

        let payload = {
            id_aviso : id_aviso,
            id_tipo_aviso : id_tipo_alerta, 
            id_reserva : id_reserva, 
            id_lab : id_lab, 
            mensagem : msg, 
            data_final : date,
            indefinido : date === null ? true : false,
        }

        editarAlerta(payload, function(data){
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

        let { id_aviso } = this.state
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
                apagarAlerta(id_aviso, function(data){
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
            <Modal className={'modal-lg'} isOpen={this.state.open} toggle={() =>this.setState({ open : false})} >
            <ModalHeader className="text-center" toggle={() =>this.setState({ open : false})}>Reserva</ModalHeader>
            <ModalBody>
                <Form onSubmit ={ this.onSave }>
                    <FormGroup>
                        <Label>Dados</Label>
                        {this.state.dados && 
                            <ListGroup>
                                <Row>
                                    <Col col="3">
                                        <ListGroupItem style={{minHeight : 150}}>
                                            <ListGroupItemHeading>Disciplina</ListGroupItemHeading>
                                            <ListGroupItemText tag={"div"} >
                                                
                                                    <ul style={{marginLeft : -20}}>
                                                        <li>Nome : {this.state.dados.nome_disciplina} </li>
                                                        <li>Professor : {this.state.dados.nome_professor} </li>
                                                    </ul>
                                                
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    </Col>
                                    <Col col="3">
                                        <ListGroupItem style={{minHeight : 150}}>
                                            <ListGroupItemHeading>Laboratorio</ListGroupItemHeading>
                                            <ListGroupItemText tag={"div"}>
                                                <ul style={{marginLeft : -20}}>
                                                    <li>Local : {this.state.dados.local}  </li>
                                                    <li>Descricao : {this.state.dados.descricao}  </li>
                                                </ul>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    </Col>
                                    <Col col="3">
                                        <ListGroupItem style={{minHeight : 150}}>
                                            <ListGroupItemHeading>Horario</ListGroupItemHeading>
                                            <ListGroupItemText tag={"div"}>
                                                <ul style={{marginLeft : -20}}>
                                                    <li>Dia: {moment(this.state.dados.data_reserva).format('DD/MM/YYYY')}  </li>
                                                    <li>Horario Inicio : {this.state.dados.hora_inicio}  </li>
                                                    <li>Horario Fim : {this.state.dados.hora_fim}  </li>
                                                </ul>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    </Col>
                                </Row>
                            </ListGroup>
                        
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label>Até quando exibir</Label>
                        <br/>
                        <div class="row data-alerta">
                            <div class="col-8">
                                <Input type="datetime" value={moment(this.state.date, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DDTHH:mm')} onChange={({target}) => this.setState({date : target.value})} />
                            </div>
                            <div className="col-4">
                                <Input onChange={({target}) => this.setState({ indefinido : target.checked } )} type="checkbox" checked={this.state.indefinido} /> Exibir indefinidamente
                            </div>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>Tipo de Mensagem</Label>

                            <Input type="select" onChange={({target}) => this.setState({ id_tipo_alerta : target.value} )}>
                                {this.state.listaTipos.map(element => {
                                    return (
                                        <option value={element.id_aviso} selected={element.id_aviso === this.state.id_tipo_alerta ? true : false}>
                                            {element.tipo}
                                        </option>
                                    )
                                })}
                            </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleText">Mensagem</Label>
                        <Input required onChange={({target}) => this.setState({ msg : target.value} )} type="textarea" value={this.state.msg}/>
                    </FormGroup>
                    <FormGroup className="float-right">
                        <Button className={"mr-1"} type="submit" color="success">Salvar</Button>
                        <Button className="mr-1" color="danger" onClick={this.apagarAlerta}>Apagar</Button>
                        <Button color="dark" onClick={() => this.setState({open : false})}>Cancelar</Button>
                    </FormGroup>
                </Form>

            </ModalBody>
        </Modal>
        )
    }
}

export default EditReserva;