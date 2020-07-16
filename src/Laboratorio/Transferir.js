import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, FormText, Label, Input } from 'reactstrap';

import { DadosReserva, listaLabs, listarReservas, editReserva, tiposAlertas, salvarAlerta } from './../Service'
import Swal from 'sweetalert2';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

class Transferir extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            dados : null,
            labs : [],
            date : null,
            id_lab : 0,
            id_lab_horario : 0,
            horarios : [],

            msg_alerta : '',

            alerta : false,
            tipoAlerta : 0,
            listaTipos : []
        }
    }

    componentDidMount(){
        listaLabs(data =>{
            console.log(data)
            this.setState({labs : data.Laboratorios})
        })

        tiposAlertas((data) => {
            this.setState({ listaTipos : data.tipos, tipoAlerta : data.tipos[0].id_aviso})
        })

    }

    onLoadHoraios = ({target}) =>{
        let { msg_alerta } = this.state
        let date = target.value

        msg_alerta+= date + " as "

        this.setState({ date, msg_alerta })

        let { id_lab} = this.state
        let payload = {
            data : date,
            id_lab
        }
        listarReservas(payload, data =>{         
            this.setState({horarios : data.dados })
        })
    }

    onDisplay = (id_reserva) =>{
        this.setState({open : true})
        DadosReserva(id_reserva, (data) =>{
            let dados = data.dados[0]
            let msg_alerta = "A aula do dia " + dados.data_reserva + " das " + dados.hora_inicio + " as " + dados.hora_fim + " foi transferida para o dia "

            this.setState({dados, msg_alerta})
        })
        
    }

    onSave = (e) =>{
        e.preventDefault()

        let { dados, id_lab, id_lab_horario, date, alerta, msg_alerta, tipoAlerta} = this.state

        let payload = {
            id_reserva : dados.id_reserva,
            id_lab,
            id_lab_horario,
            date
        }

        if(id_lab === 0 || id_lab_horario === 0 || date === null){
            Swal.fire({
                title : "Opsss",
                text : "Preencha todos os dados",
                type : "error"
            })
            return;
        }

        if(alerta){
            let payload = {
                id_aviso : tipoAlerta,
                id_reserva : dados.id_reserva,
                id_lab : id_lab,
                id_pessoa : 1,
                mensagem : msg_alerta,
                data_final : null,
                indefinido : true,
                sobre : 'reserva'
            }
    
            salvarAlerta(payload, (data) => {
                console.log(data)
            })
        }

        let text = "Tem certeza que deseja transferir a aula do dia " + moment(this.state.dados.data_reserva).format('DD/MM/YYYY') + " para o dia " + moment(date).format('DD/MM/YYYY') + " ?\n"
        
        Swal.fire({
            title : "Tem certeza ?",
            text,
            type : "question",
            showCancelButton : true,
            confirmButtonText : "Sim",
            cancelButtonText : "Não"
        })
        .then(resp =>{
            if(resp.value){
                editReserva(payload, data =>{
                    if(data.success){
                        Swal.fire({
                            title : "Pronto",
                            text : "A reserva foi tranferida com sucesso",
                            type : "success"
                        })
                        this.setState({open : false})
                    }
                })
            }
        })

        console.log(payload)
    }

    render(){
        return(
            <Modal className={'modal-lg'} isOpen={this.state.open} toggle={() => this.setState({ open : false})} >
                <ModalHeader toggle={() => this.setState({ open : false})}>Transferencia</ModalHeader>
                <ModalBody>
                    {this.state.dados !== null &&
                        <>
                            <div className="p-3 text-white-50 bg-dark rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                    <svg className="bd-placeholder-img mr-2 rounded" width={40} height={40} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={this.state.dados.color === null ? "#CCC" : this.state.dados.color} /><text x="50%" y="50%" fill={this.state.dados.color === null ? "#CCC" : this.state.dados.color} dy=".3em">32x32</text></svg>
                                    <div className="lh-100">
                                        <h6 className="mb-0 text-white lh-100">{this.state.dados.nome_disciplina}</h6>
                                        <small>{this.state.dados.nome_professor}</small>
                                    </div>
                                </div>
                                <div className="mt-2 text-white" style={{ display : 'flex', justifyContent: 'space-between'}}>
                                    <span>Dia : {this.state.dados.data_reserva}</span>
                                    <span>{this.state.dados.hora_inicio} - {this.state.dados.hora_fim}</span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p><b>Labotario</b></p>
                                <ul style={{display: 'flex', justifyContent : "space-between", marginLeft : -20}}>
                                    <li>Local : <b>{this.state.dados.local}</b></li>
                                    <li>Tipo : <b>{this.state.dados.lab_tipo}</b></li>
                                </ul>
                            </div>
                            
                            <h6 className="border-bottom font-weight-bolder border-gray mt-3 mb-3">Transferir para :</h6>

                            <Form onSubmit={this.onSave}>
                                <FormGroup>
                                    <Label for="exampleEmail">Selecione o Laboratorio</Label>
                                    <Input defaultValue={this.state.id_lab} type="select" onChange={({target}) => this.setState({ id_lab : parseInt(target.value)} )} >
                                            <option value="0">Selecione um Laboratorio</option>
                                        {this.state.labs.map((element, index) =>(
                                            <option key={index} value={element.id_lab} >{element.local} ({element.lab_tipo_nome}) </option>
                                        ))}
                                    </Input>
                                    <FormText color="muted">
                                        *Selecione sempre um labotario do mesmo tipo ou melhor
                                    </FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleEmail">Selecione o Dia</Label>
                                    {this.state.id_lab !== 0 &&
                                        <Input type="date" onChange={this.onLoadHoraios} />
                                    }
                                    {this.state.id_lab === 0 &&
                                        <Input type="text" disabled value="Selecione um laboratorio antes" />
                                    }
                                    
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleEmail">Selecione o Horario Livre</Label>
                                    {this.state.horarios.length > 0 &&
                                        <Input defaultValue={this.state.id_lab_horario} onChange={({target}) => this.setState({ id_lab_horario : parseInt(target.value) })} type="select">
                                                <option value="0">Selecione um Horario</option>

                                            {this.state.horarios.map((element, index) =>(
                                                <option value={element.id_lab_horario} key={index} disabled={element.id_reserva === null ? false : true} >{element.hora_inicio} - {element.hora_fim} </option>
                                            ))}
                                        </Input>
                                    }
                                    {this.state.horarios.length === 0 &&
                                        <Input type="text" disabled value="Selecione um dia antes" />
                                    }
                                </FormGroup>
                                <FormGroup check className="mb-2">
                                    <Label check>
                                    <Input type="checkbox" checked={this.state.alerta} onChange={({target}) => this.setState({ alerta : target.checked})} />
                                            Gerar um aviso automatico
                                    </Label>
                                </FormGroup>
                                {this.state.alerta && 
                                <>
                                    <FormGroup>
                                        <Label>Uma pequena descrição do que aconteceu para colocar no aviso</Label>
                                        <Input value={this.state.msg_alerta} onChange={({target}) => this.setState({msg_alerta : target.value})} type="textarea" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Tipo de aviso</Label>
                                        <Input type="select" defaultValue={this.state.tipoAlerta} onChange={({target}) => this.setState({ tipoAlerta : target.value} )}>
                                            {this.state.listaTipos.map(element => {
                                                return (
                                                    <option value={element.id_aviso}>
                                                        {element.tipo}
                                                    </option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                </>
                                }
                               
                                <FormGroup>
                                    <div className="float-right">
                                        <Button color="dark" onClick={() => this.setState({open : false})} >Cancelar</Button>
                                        <Button color="success" className="ml-1" type="submit">Salvar</Button>
                                    </div>
                                </FormGroup>
                            </Form>
                        </>
                    }

                </ModalBody>
            </Modal>
        )
    }
}

export default Transferir