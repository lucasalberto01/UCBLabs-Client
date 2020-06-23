import React from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, Col, Button } from 'reactstrap';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';


import { listarReservasDate, DadosReserva, tiposAlertas, salvarAlerta, socket } from './../Service'
import Swal from 'sweetalert2';

class NovoReserva extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            data_select : moment().format('YYYY-MM-DD'),
            reservas : [],
            dados : null,
            listaTipos : [],
            indefinido : false,
            tipoAlerta : null,
            id_lab : 0,
            date : null,
            id_reserva : 0,
            msg : null

        }
    }

    componentDidMount(){
        this.exibir(moment().format('YYYY-MM-DD'))

        
        tiposAlertas((data) => {
           
            this.setState({ listaTipos : data.tipos, tipoAlerta : data.tipos[0].id_aviso})

        })

        socket.on('AtualizacaoTiposAvisos', (data) =>{
            this.setState({ listaTipos : data.lista })
        })
    }

    exibir = (date) =>{
        listarReservasDate({date}, (data) =>{
            console.log(data)
            this.setState({ reservas : data.dados })
        })
    }

    onChanger = ({target}) =>{
        this.setState({data_select : target.value, dados : null})
        this.exibir(target.value)
    }

    onLoadReserva = ({target }) =>{
        let id_reserva = target.value;
        this.setState({id_reserva })
        if(id_reserva !== 0){
            DadosReserva(id_reserva, (data) =>{
                if(data.dados.length > 0){
                    this.setState({ dados : data.dados[0], id_lab : data.dados[0].id_lab })
                }else{
                    this.setState({ dados : null, id_lab : 0 })
                }
                

            })
        } 

    }

    onSave = (e) =>{
        e.preventDefault()
        let { msg, tipoAlerta, id_reserva, date, indefinido, id_lab  } = this.state

        if(parseInt(id_reserva) === 0 || parseInt(tipoAlerta) === 0){
            Swal.fire(
                'Opss!',
                'Preencha todos os campos!',
                'error'
            )
            return;
        }

        let payload = {
            id_aviso : tipoAlerta,
            id_reserva : id_reserva,
            id_lab : id_lab,
            id_pessoa : 1,
            mensagem : msg,
            data_final : indefinido ? null : date,
            indefinido,
            sobre : 'reserva'
        }

        salvarAlerta(payload, (data) => {
            console.log(data)
            if(data.sucesso){
                this.setState({open : false});
                Swal.fire(
                    'Pronto!',
                    'Aviso foi adicionado com sucesso!',
                    'success'
                )
            }else{
                Swal.fire(
                    'Opss!',
                    'Algo de errado aconteceu, tente novamente!',
                    'error'
                )
            }
            
        })

        console.log(payload)
    }

    onDisplay = () =>{
        this.setState({open : true})
    }

    render(){
        return(
            <Modal className={'modal-lg'} isOpen={this.state.open} toggle={() =>this.setState({ open : false})} >
                <ModalHeader className="text-center" toggle={() =>this.setState({ open : false})}>Reserva</ModalHeader>
                <ModalBody>
                    <div>
                        <h6>Criar um aviso sobre um laboratorio</h6>
                        <p>Esse aviso será mostrado apartir de hoje somente na reserva selecionada até a data final</p>
                    </div>
                    <hr/>
                    <Form onSubmit ={ this.onSave }>
                        <FormGroup>
                            <Label >Selecione a data da reserva</Label>
                            <Input onChange={this.onChanger} type="date" value={this.state.data_select}  />
                        </FormGroup>
                        <FormGroup>
                        
                            <Label for="exampleSelect">Selecione a reserva.</Label>
                            {this.state.reservas.length > 0 &&
                            
                                <Input onChange={this.onLoadReserva} type="select" name="select" id="exampleSelect">
                                    <option value={0}>Selecione uma reserva</option>
                                    {this.state.reservas.map(element =>{
                                            
                                        return(
                                            <option value={element.id_reserva}>{element.nome_disciplina} - {element.hora_inicio + ' até ' + element.hora_fim} - {element.local} </option>
                                        )
                                    })}
                                    
                                </Input>
                                
                            }
                            {this.state.reservas.length === 0 &&
                                <Input type="text" disabled value="Não tem nenhuma reserva para este dia" />
                                
                            }
                            
                        </FormGroup>
                        <FormGroup>
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
                                    <Input type="datetime-local" onChange={({target}) => this.setState({date : target.value})} />
                                </div>
                                <div className="col-4">
                                    <Input onChange={({target}) => this.setState({ indefinido : target.checked } )} type="checkbox" /> Exibir indefinidamente
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label>Tipo de Mensagem</Label>
                                <Input type="select" onChange={({target}) => this.setState({ tipoAlerta : target.value} )}>
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
                            <Input required onChange={({target}) => this.setState({ msg : target.value} )} type="textarea" name="text" id="exampleText" />
                        </FormGroup>
                        <FormGroup className="float-right">
                            <Button className={"mr-1"} type="submit" color="success">Salvar</Button>
                            <Button color="dark" onClick={() => this.setState({open : false})}>Cancelar</Button>
                        </FormGroup>
                    </Form>

                </ModalBody>
            </Modal>
        )

    }
}

export default NovoReserva;