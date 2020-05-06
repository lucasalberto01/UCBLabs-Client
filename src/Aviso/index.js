import React from 'react'
import TopBar from './../Teamplate/TopBar'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, } from 'reactstrap';
import { listaLabs, socket, tiposAlertas, salvarAlerta, listarAlertas, editarAlerta, apagarAlerta } from './../Service'

import Swal from 'sweetalert2'

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Moment from 'react-moment';

moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-BR');

class Avisos extends React.Component{
    constructor(props) {
    super(props);
        this.state = {
            modal: false,
            modal_2 : false,
            ajuda : false,
            lista_lab : [],
            listaTipos : [],
            data : new Date(),
            msg : null,
            lab : null,
            tipoAlerta : null,
            indefinido : false,
            avisos : [],
            
            editar_modal : false,
            editar_mensagem : null,
            editar_idLab : null,
            editar_idTipoAlerta : null,
            editar_indefinido : null, 
            editar_dataTermino : null,
            editar_id : null
            
            
        };

        this.toggle = this.toggle.bind(this);
        this.avancar = this.avancar.bind(this);
        this.loadLabs = this.loadLabs.bind(this)
        this.loadAvisos = this.loadAvisos.bind(this)
        this.salvarAlert = this.salvarAlert.bind(this)
        this.editarAlertas = this.editarAlertas.bind(this)
    }

    componentDidMount(){
        this.loadLabs();
        this.loadAvisos()

        socket.on('AtualizacaoLabs', function(data){
            this.setState({lista_lab : data.Laboratorios})
        }.bind(this));

        tiposAlertas(function(data){
            console.log(data)
            this.setState({ listaTipos : data.tipos, tipoAlerta : data.tipos[0].id_aviso})

        }.bind(this))

        
    }
    loadAvisos(){
        listarAlertas(function(data){

            data.lista.filter(element => {
                if(element.data_final !== null){
                    element.data_final = moment(element.data_final).format('DD/MM/YY HH:mm')
                }
                return element
            })
            
            this.setState({avisos : data.lista})

        }.bind(this))
    }

    

    loadLabs(){
        this.setState({ ListaLaboratorio : []}, function(){
            listaLabs(function(data){
                console.log(data)
                this.setState({lista_lab : data.Laboratorios, lab : data.Laboratorios[0].id_lab})

            }.bind(this))
        }.bind(this))

    }

    toggle() {
        this.setState(prevState => ({
            modal: prevState.modal === false ? true : false,
            modal_2 : false
        }));
    }

    avancar(classe_alerta){
        this.setState({modal_2 : true, modal : false});
    }

    handleChange = date => {
        this.setState({
            data: date
        });
    };

    fecharModalEditar = () =>{
        this.setState({ editar_modal : false })
    }

    abrirModalEditar(idLab, data_termino, tipoAlerta, mensagem, idAlerta){
        console.log(moment(data_termino, "DD/MM/YYYY HH:mm"))
        let editar = {
            editar_modal : true,
            editar_mensagem : mensagem,
            editar_idLab : idLab,
            editar_idTipoAlerta : tipoAlerta,
            editar_indefinido : data_termino === null ? true : false,
            editar_dataTermino : data_termino === null ? null : new Date(moment(data_termino, "DD/MM/YYYY HH:mm")),
            editar_id : idAlerta
        }
        this.setState(editar)
    } 

    editarAlertas(e){
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
                this.setState({editar_modal : false})
                this.loadAvisos()
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
        

        e.preventDefault()
    }

    salvarAlert(e){
        let { tipoAlerta, lab, msg, data, indefinido } = this.state
        let data_ = {
            id_aviso : parseInt(tipoAlerta),
            id_reserva : null, 
            id_lab : parseInt(lab), 
            id_pessoa : 1, 
            mensagem : msg, 
            data_final : data, 
            indefinido
        }

        salvarAlerta(data_, function(data){
            console.log(data)
            if(data.sucesso){
                this.setState({modal_2 : false, modal : false});
                this.loadAvisos()
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
            
        }.bind(this))

        e.preventDefault()
    }

    apagarAlerta(id_aviso){
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
            console.log(result)
            if(result.value){
                apagarAlerta(id_aviso, function(data){
                    if(data.sucesso){
                        this.loadAvisos()
                        Swal.fire(
                            'Pronto!',
                            'Aviso foi apagado com sucesso!',
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
                                <div class="page-title-right">
                                    <ol class="breadcrumb m-0">
                                        <li class="breadcrumb-item"><a href="#">Dashboard</a></li>
                                        <li class="breadcrumb-item"><a href="#">Avisos</a></li>
                                    </ol>
                                </div>
                                <h4 class="page-title">Avisos</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-sm-4" style={{display : 'flex', flexDirection : 'row', alignItems: 'center'}}>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-secondary" onClick={() => {this.avancar('lab')}} >Laboratorio</button>
                                <button type="button" class="btn btn-secondary" onClick={() => {this.avancar('reserv')} }>Reserva</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                        
                            <table className="table table-striped aviso">
                                <thead className="thead-dark">
                                <tr>
                                    <th width="5%" scope="col">#</th>
                                    <th scope="col">Mensagem</th>
                                    <th width="15%" scope="col">Sala</th>
                                    <th width="20%" scope="col">Data Termino</th>
                                    <th width="8%" scope="col">Ação</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.avisos.map(element => {
                                        return(
                                            <tr>
                                                {console.log(element)}
                                                <th scope="row">0</th>
                                                <td>{element.mensagem}</td>
                                                <td>{element.local}</td>
                                                <td>{element.data_final === null ? 'Sem data definida' : element.data_final}</td>
                                                <td className="botoes">
                                                    <span onClick={() => this.abrirModalEditar(element.id_lab, element.data_final, element.id_tipo_aviso, element.mensagem, element.id_aviso_reserva)} ><i className="icon-pencil icons"></i></span>
                                                    <span onClick={() => this.apagarAlerta(element.id_lab)}><i className="icon-close icons"></i></span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Modal className={'modal-lg'} isOpen={this.state.modal_2} toggle={this.toggle} >
                        <ModalHeader className="text-center" toggle={this.toggle}>Novo Alerta</ModalHeader>
                        <ModalBody>
                            <div className="add-alert2">
                                <div className="row">
                                    <div className="col-12">
                                    <Form onSubmit ={ this.salvarAlert }>
                                        <FormGroup>
                                            <Label for="exampleSelect">Selecione o Laboratorio</Label>
                                            <Input value={this.state.lab} type="select" onChange={({target}) => this.setState({ lab : target.value} )}>
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
                                                    <DatePicker
                                                        locale="pt"
                                                        className={'form-control'}
                                                        selected={this.state.data}
                                                        onChange={this.handleChange}
                                                        showTimeSelect
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                    />
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
                                        <FormGroup className="float-right" >
                            
                                            <Button style={{margin : 5}} color="secondary" onClick={this.toggle}>Cancelar</Button>
                                            <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                                        </FormGroup>
                                        
                                    </Form>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        
                    </Modal>
                    
                    <Modal isOpen={this.state.editar_modal} toggle={this.fecharModalEditar} className={'modal-lg'} >
                        <ModalHeader className="text-center" toggle={this.fecharModalEditar}>Editar Alerta</ModalHeader>
                        <ModalBody>
                            <div className="editar-alerta">
                                <div className="row">
                                    <div className="col-12">
                                    <Form onSubmit ={ this.editarAlertas }>
                                        <FormGroup>
                                            <Label for="exampleSelect">Selecione o Laboratorio</Label>
                                            <Input value={this.state.editar_idLab} type="select" onChange={({target}) => this.setState({ editar_idLab : target.value} )}>
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
                                                {console.log(this.state.editar_dataTermino)}
                                                    <DatePicker
                                                        locale="pt-BR"
                                                        className={'form-control'}
                                                        
                                                        selected={this.state.editar_dataTermino}
                                                        onChange={(date) => {this.setState({ editar_dataTermino : date})}}
                                                        showTimeSelect
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                    />
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
                            
                                            <Button style={{margin : 5}} onClick={this.fecharModalEditar} color="secondary">Cancelar</Button>
                                            <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                                        </FormGroup>
                                        
                                    </Form>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                                                    
                </div>
            </div>
        )
    }
}

export default Avisos;