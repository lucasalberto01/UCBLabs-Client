import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, Col, Row } from 'reactstrap';
import { ExibirDadosPedido, listaLabs, ListarDiciplinas, listarReservas, NovaReserva, CancelarPedido } from './../Service'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Swal from 'sweetalert2'

class AceitarPedido extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open : false,
            open2 : false,
            id_pedido : null,
            dados : null,
            lista_lab : [],
            lista_diciplinas : [],
            horarios : [],
            id_lab : 0,
            id_diciplina : 0,
            hora_selecionada : null,
            data_selecionada : null
        }
        
    }

    componentDidMount(){
        listaLabs((data) => {
            console.log('LABSS >> ', data);
            this.setState({lista_lab : data.Laboratorios})
        })

        ListarDiciplinas(function(data){
            console.log(data)
            this.setState({lista_diciplinas : data.diciplinas})
        }.bind(this))
    }

    display = (id) =>{
        this.setState({open : true, id_pedido: id})
        this.exibirPedido(id)
    }

    exibirPedido = (id) =>{
        ExibirDadosPedido(id, (data)=>{
            data.pedido.data = moment(data.pedido.data).format('DD/MM/YYYY (ddd)')            
            data.pedido.data_criacao = moment(data.pedido.data_criacao).format('DD/MM/YYYY HH:mm')
            let date = moment(data.pedido.data, 'DD/MM/YYYY').toDate()
            console.log(data.pedido);
            this.setState({dados : data.pedido, data_selecionada : date, id_diciplina : data.pedido.id_disciplina})
        })
    }

    rejeitar = () =>{
        this.setState({open : false})
        Swal.fire({
            type : 'question',
            text : 'Tem certeza quer deseja rejeitar esse pedido ?',
            title : 'Certeza ?',
            showCancelButton : true
        })
        .then((res)=>{
            //console.log(res);
            if(res.value){
                CancelarPedido(this.state.id_pedido ,(data) =>{
                    if(data.success){
                        Swal.fire({
                            text : 'Pedido foi Cancelado com sucesso',
                            title : 'Pronto',
                            type : 'success'
                        })
                    }else{
                        Swal.fire({
                            text : 'Não foi possivel cancelar',
                            title : 'Opss',
                            type : 'error'
                        })
                    }
                })
            }
        })
    }

    continuar = () => {
        this.setState({open : false, open2 : true})
    }

    loadHorarios = () => {
        let { data } = this.state.dados
        let { id_lab } = this.state
        
        if(id_lab !== 0){

            let data_ = {
                data : moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                id_lab : this.state.id_lab

            }

            listarReservas(data_, (data) => {
                this.setState({horarios : data.dados})
            })
        }
    }

    onSelecionarHorario = (hora_inicio) =>{
        this.setState({
            horarios : this.state.horarios.filter(element =>{
                    
                if(element.hora_inicio === hora_inicio){
                    element.selecionado = true;
                    this.setState({ hora_selecionada : { hora_inicio : element.hora_inicio, hora_fim : element.hora_fim, id_lab_horario : element.id_lab_horario }})
                }else{
                    element.selecionado = undefined;
                }      
    
                return element
            })
        })
    }

    envio = (e) =>{
        e.preventDefault()
        let { id_lab, id_diciplina, hora_selecionada, data_selecionada, id_pedido } = this.state
        
        console.log(id_lab , id_diciplina,hora_selecionada , data_selecionada)

        if(id_lab !== 0 && id_diciplina !== 0 && hora_selecionada !== null && data_selecionada !== null){
            let data = {
                id_lab,
                id_pedido,
                id_disciplina : id_diciplina,
                id_pessoa : 1,
                id_lab_horario : hora_selecionada.id_lab_horario,
                data_reserva : moment(data_selecionada).format('YYYY-MM-DD'),
    
            }

            NovaReserva(data, (data)=>{
                console.log(data);
                if(data.code === 200){
                    Swal.fire({
                        title : 'Pronto',
                        text : 'Reserva feita com sucesso',
                        icon : 'success'
                    })
                    this.setState({open  : false, open2 : false})
                }else{
                    alert(JSON.stringify(data))
                }
                
            })
            
        
        }else{
            Swal.fire({
                title : 'Opss',
                text : 'Preencha todos os campos',
                icon : 'error'
            })
        }
    }

        

    render(){
        return(
            <>
                <Modal style={{maxWidth : 600}} isOpen={this.state.open} toggle={()=>this.setState({open : false})} >
                    <ModalHeader toggle={()=>this.setState({open : false})}>Revisar Pedido</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            {this.state.dados !== null &&
                            <>
                                <div className="col-12 text-center">
                                    <h5>Dados do Pedido</h5>
                                </div>
                                <div className="col-6">
                                    <p><b>Dia :</b>{this.state.dados.data}</p>
                                    <p><b>Hora :</b>{this.state.dados.hora_inicio}</p>
                                    <p><b>Disciplica :</b>{this.state.dados.nome_disciplina}</p>
                                </div>
                                <div className="col-6">
                                    <p><b>Remetente do Pedido :</b>{this.state.dados.id_remetente}</p>
                                    <p><b>Tipo de Laboratorio :</b>{this.state.dados.nome}</p>
                                    <p><b>Hora que o pedido foi feito :</b>{this.state.dados.data_criacao}</p>
                                </div>
                                <div className="col-12">
                                    <p><b>Observação :</b></p>
                                    <p>
                                        {this.state.dados.observacao}
                                    </p>
                                </div>
                            </>
                            }
                            {this.state.dados === null &&
                                <p>Carregando</p>
                            }
                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.rejeitar()}>Rejeitar</Button>
                        <Button color="primary" onClick={() => this.continuar()}>Continuar</Button>
                        <Button color="secondary" onClick={()=>this.setState({open : false})}>Cancel</Button>
                    </ModalFooter>
            </Modal>
            <Modal style={{maxWidth : 800}} isOpen={this.state.open2} toggle={()=>this.setState({open2 : false})} >
                <ModalHeader toggle={()=>this.setState({open2 : false})}>Fazendo Reserva</ModalHeader>
                <ModalBody>
                    <div className="row">
                        {this.state.dados !== null && 
                        <div className="col-12">
                            <Form onSubmit={this.envio}>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="exampleSelect">Selecione o Laboratorio (Esperado : {this.state.dados.nome})  </Label>
                                        <Input type="select" onChange={({target}) => {this.setState({ id_lab : target.value}, () => this.loadHorarios());} }>
                                            <option value={this.state.id_lab}>Selecione um Laboratorio</option>
                                            {this.state.lista_lab.map((elemento) => (
                                                <option value={elemento.id_lab}>{elemento.local} ({elemento.lab_tipo_nome})</option>
                                            ))}
                                            
                                        </Input>
                                    </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                    <FormGroup>
                                        <Label>Data Reserva</Label>
                                        <br/>
                                        <DatePicker
                                            locale="pt"
                                            className={'form-control'}
                                            placeholderText="Selecione uma data"
                                            startDate={new Date()}
                                            selected={this.state.data_selecionada}
                                            onChange={(data) => this.setState({data_selecionada : data})}
                                            dateFormat="dd/MM/yyyy"
                                            disabled
                                        />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label>Diciplina</Label>
                                    <Input disabled value={this.state.id_diciplina} onChange={({target}) => {this.setState({id_diciplina : target.value})}} placeholder="Selecione Uma Diciplina" type="select">
                                        <option value={0}>Selecione uma disciplina</option>
                                        {this.state.lista_diciplinas.map(element =>{
                                            return (
                                                <option value={element.id_disciplina}>{element.nome_disciplina}</option>
                                            )
                                        })}
                                            
                                    </Input>
                                </FormGroup>

                            <FormGroup>
                                <Label>Horarios Disponiveis (Esperado {this.state.dados.hora_inicio}) </Label>
                                <div className="row horarios">
                                    {this.state.horarios.map(element => {
                                        return(
                                            <div className="col-2">
                                                
                                                <div
                                                className="horario shadow-lg" 
                                                style={{backgroundColor : true ? (element.selecionado ? '#4a4a4a' : '#023490') : 'red'}}
                                                onClick={() => this.onSelecionarHorario(element.hora_inicio)}
                                                >
                                                    <span>
                                                        <p>{element.hora_inicio}</p>
                                                        <p>-</p>
                                                        <p>{element.hora_fim}</p>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {this.state.horarios.length === 0 &&
                                        <div className="col-12">
                                            <p>Selecione um laboratorio e uma Data para exibit os horarios disponives</p>
                                        </div>
                                    
                                    }
                                    
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <button type="submit" class="btn btn-block btn-info">Continuar</button>
                            </FormGroup>
                        </Form>
                        </div>
                        }
                    </div>
                </ModalBody>
            </Modal>
        </>
        )
    }
}

export default AceitarPedido;