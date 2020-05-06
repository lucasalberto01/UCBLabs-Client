import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

import './../App.css'

import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import TopBar from './../Teamplate/TopBar'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt';
import { listarReservas, listaLabs, NovaReserva } from './../Service'

import Swal from 'sweetalert2'

registerLocale('pt', pt)

moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-BR');

class Calendario extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            resertas : [],
            modal : false,
            lista_lab : [],
            data_inicio: null,
            data_termino: null,
            materia : null,
            id_lab : null
        }
        this.toggle = this.toggle.bind(this)

        
    }

    

    componentDidMount(){
        this.loadLabs();
        this.loadReservas();
        
    }

    loadLabs(){
        this.setState({ lista_lab : []}, function(){
            listaLabs(function(data){
                console.log(data)
                this.setState({lista_lab : data.Laboratorios, lab : data.Laboratorios[0].id_lab})

            }.bind(this))
        }.bind(this))

    }

    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    toggle(){
        this.setState({ modal : !this.state.modal})
    }

    envio = (e) =>{
        e.preventDefault();
        var { data_inicio, data_termino, materia, id_lab } = this.state;

        data_inicio = moment(data_inicio).format('YYYY-MM-DD HH:mm:ss')
        data_termino = moment(data_termino).format('YYYY-MM-DD HH:mm:ss')
        if(id_lab){
            let data = {
                data_inicio,
                data_termino,
                materia,
                id_lab,
                id_pess : 1
            }
    
            NovaReserva(data, function(data){
                if(data.code === 200){
                    Swal.fire({
                        title : 'Pronto',
                        text : 'Reserva feita com sucesso',
                        type : 'success'
                    })
                }else if(data.code === 201){
                    Swal.fire({
                        title : 'Opss',
                        text : 'Já tem uma reserva nesse laboratorio nessa data. Escolha outro',
                        type : 'warning'
                    })
                }else{
                    alert(JSON.stringify(data))
                }
                
            })

        }else{
            Swal.fire({
                title : 'Opss',
                text : 'Selecione Todos os Campos',
                type : 'error'
            })
        }
        

    }

    loadReservas = () =>{
        
        let data = {
            id_lab : 1,
            data : '2019-10-16'
        }
        listarReservas(data , (data)=>{
            let saida = []
            let data_ = null;

            data.dados.forEach(element => {
                let push = null;
                if(data_ === null){
                    console.log(element.data_reserva);
                    data_ = moment(element.data_reserva).add({day : 1}).format('YYYY-MM-DD');
                }
                
                if(element.materia === null){
                    push = {
                        id: '1',
                        calendarId: '0',
                        title: 'Livre',
                        category: 'time',
                        dueDateClass: '',
                        start: data_ + ' ' + element.hora_inicio,
                        end: data_ + ' ' + element.hora_fim
                   }
                }else{
                    push = {
                        id: '1',
                        calendarId: '1',
                        title: element.materia,
                        category: 'time',
                        dueDateClass: '',
                        start: data_ + ' ' + element.hora_inicio,
                        end: data_ + ' ' + element.hora_fim
                   }

                }

                saida.push(push)


            });
            console.log(saida)
            this.setState({resertas : saida})
        })

    }
    
    
    
    render(){
        
        return(
            <div className="home">
            <TopBar />

            <div className="container corpo">
                <div className="row">
                    <div class="col-12">
                        <div class="page-title-box">
                            <div class="float-right">
                            <button onClick={this.toggle} type="button" className="btn btn-blue btn-rounded mb-3"><i className="icon-plus icons"></i> Nova Reserva <i>(Teste)</i> </button> 
                            </div>
                            <h4 class="page-title">Calendario</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="col-6">
                            <div className="card border-secondary mb-3">
                                <div className="card-header">Header</div>
                                <div className="card-body text-secondary">
                                    <h5 className="card-title">Secondary card title</h5>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                </div>
                            </div>

                        </div>
                        <div className="col-6">
                            <p>teste</p>    
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.togle}>Editar Laboratorio</ModalHeader>
                <ModalBody>
                <div className="row">
                    <div className="col-12">
                        <Form onSubmit={this.envio}>
                                <FormGroup>
                                    <Label for="exampleSelect">Selecione o Laboratorio</Label>
                                    <Input type="select" onChange={({target}) => this.setState({ id_lab : target.value} )}>
                                        <option value={null}>Selecione um laboratorio</option>
                                        {this.state.lista_lab.map((elemento) => (
                                            <option value={elemento.id_lab }>{elemento.local}</option>
                                        ))}
                                        
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Data Inicio</Label>
                                    <br/>
                                    <DatePicker
                                        locale="pt"
                                        className={'form-control'}
                                        placeholderText="Selecione"
                                        startDate={new Date()}
                                        selected={this.state.data_inicio}
                                        onChange={(date) => {this.setState({data_inicio : date})}}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy HH:mm"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Data Fim</Label>
                                    <br/>
                                    <DatePicker
                                        locale="pt"
                                        className={'form-control'}
                                        placeholderText="Selecione"
                                        startDate={new Date()}
                                        selected={this.state.data_termino}
                                        onChange={(date) => {this.setState({data_termino : date})}}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy HH:mm"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Materia</Label>
                                    <Input required onChange={({target}) => this.setState({ materia : target.value} )} type="text"/>
                                </FormGroup>
                                
                            <Button className="float-right btn-blue">Salvar</Button>
                        </Form>
                    </div>
                </div>
                </ModalBody>
            </Modal>
        </div>
    
        )
    }
}

export default Calendario;