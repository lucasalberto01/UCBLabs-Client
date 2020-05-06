import React from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Row, Col  } from 'reactstrap';

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { ListarDiciplinas, NovoPedido, listarTiposLabs, ListarHorarios } from './../Service'
import Cookies from 'universal-cookie';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Swal from 'sweetalert2'

const cookies = new Cookies();

class Pedido extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modal : false,
            lista_lab : [],
            lista_diciplinas : [],
            horarios : [],
            data : null, 
            id_lab : null,
            id_diciplina : null,
            hora_selecionada : null,
            observacao : null
        }
    }

    display = ()=>{
        this.setState({modal : true})
    }

    componentDidMount(){
        this.loadLabs();
        this.loadHorarios();

        ListarDiciplinas(function(data){
            console.log(data)
            this.setState({lista_diciplinas : data.diciplinas})
        }.bind(this))
    }

    loadLabs(){
        this.setState({ lista_lab : []}, function(){
            listarTiposLabs(function(data){
                console.log(data)
                this.setState({lista_lab : data.tipos})

            }.bind(this))
        }.bind(this))

    }

    seleonarData = (data) =>{
        this.setState({ data : data});
        
    }
    
    loadHorarios(){
        ListarHorarios((data)=>{
            this.setState({horarios : data.horarios, hora_selecionada : null});
        })
    }
    

    onSelecionarHorario = (hora_inicio)=>{

        this.setState({
            
            horarios : this.state.horarios.filter(element =>{
                    
                if(element.hora_inicio === hora_inicio){
                    element.selecionado = true;
                    this.setState({ hora_selecionada : { hora_inicio : element.hora_inicio, hora_fim : element.hora_fim }})
                }else{
                    element.selecionado = undefined;
                }      
    
                return element
            })
        })

        
    }

    envio = (e) =>{
        e.preventDefault();

        let { id_lab, hora_selecionada, data, id_diciplina, observacao } = this.state
        let cokie = cookies.get('WebApp')

        data = moment(data).format('YYYY-MM-DD');

        if(id_lab !== null && hora_selecionada != null && data !== null && id_diciplina !== null && cokie.id_usuario !== null){
            let dados = {
                id_remetente : cokie.id_usuario,
                id_diciplina : id_diciplina,
                data,
                hora : hora_selecionada,
                observacao,
                id_tipo_lab : id_lab,
    
            }
            NovoPedido(dados, (data) =>{
                console.log(data);
                if(data.success){
                    Swal.fire({
                        type : 'success',
                        title : 'Pronto',
                        text : 'Pedido Realizado com Sucesso'
                    })
                    this.setState({modal : false})
                }else{
                    Swal.fire({
                        type : 'error',
                        title : 'Opss',
                        text : 'Algo de errado aconteceu, tente novamente'
                    })
                }
            })

        }else{
            Swal.fire({
                type : 'error',
                title : 'Opss',
                text : 'Preencha todos os Campos'
            })
        }

        
    }



    render(){
        return(
            <div>
            <Modal isOpen={this.state.modal} toggle={()=>this.setState({modal : false})}
                style={{maxWidth:800}}
            >
              <ModalHeader toggle={()=>this.setState({modal : false})}>Nova Reserva</ModalHeader>
              <ModalBody>
                <div className="row">
                    <div className="col-12">
                    <Form onSubmit={this.envio}>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="exampleSelect">Selecione o Laboratorio</Label>
                                    <Input type="select" onChange={({target}) => {this.setState({ id_lab : target.value});} }>
                                        <option value={0}>Selecione um tipo de laboratorio</option>
                                        {this.state.lista_lab.map((elemento) => (
                                            <option value={elemento.id_lab_tipo }>{elemento.nome}</option>
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
                                        selected={this.state.data}
                                        onChange={this.seleonarData}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label>Diciplina</Label>
                                <Input onChange={({target}) => {this.setState({id_diciplina : target.value})}} placeholder="Selecione Uma Diciplina" type="select">
                                    <option value={0}>Selecione uma disciplina</option>
                                    {this.state.lista_diciplinas.map(element =>{
                                        return (
                                            <option value={element.id_disciplina}>{element.nome_disciplina}</option>
                                        )
                                    })}
                                        
                                </Input>
                            </FormGroup>

                        <FormGroup>
                            <Label>Horarios Disponiveis</Label>
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
                            <Label>Observação</Label>
                            <Input onChange={({target}) => {this.setState({observacao : target.value})}} type="textarea" />
                        </FormGroup>
                        <FormGroup>
                            <button type="submit" class="btn btn-block btn-info">Continuar</button>
                        </FormGroup>
                    </Form>
                    </div>
                </div>
              </ModalBody>
              
            </Modal>
          </div>
        )
    }
}

export default Pedido;