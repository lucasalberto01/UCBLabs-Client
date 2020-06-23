import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, } from 'reactstrap';
import { socket, listaLabs, tiposAlertas, salvarAlerta } from './../Service'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';
import Swal from 'sweetalert2'

class NovoLab extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            lab : null,
            lista_lab : [],
            listaTipos : [],
            tipoAlerta : null, 
            lab : null, 
            msg : null, 
            data : null, 
            indefinido : false
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

    onDisplay = () =>{
        this.setState({open : true})
    }

    onSave = (e) =>{
        let { tipoAlerta, lab, msg, data, indefinido } = this.state
        let data_ = {
            id_aviso : parseInt(tipoAlerta),
            id_reserva : null, 
            id_lab : parseInt(lab), 
            id_pessoa : 1, 
            mensagem : msg, 
            data_final : data, 
            indefinido,
            sobre : 'laboratorio'
        }

        salvarAlerta(data_, (data) => {
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

        e.preventDefault()
    }

    render(){
        return(
            <Modal className={'modal-lg'} isOpen={this.state.open} toggle={() =>this.setState({ open : false})} >
            <ModalHeader className="text-center" toggle={() =>this.setState({ open : false})}>Novo Alerta</ModalHeader>
            <ModalBody>
                <div className="add-alert2">
                        <div>
                            <h6>Criar um aviso sobre um laboratorio</h6>
                            <p>Esse aviso será mostrado em todas as aulas desse laboratorio apartir de hoje até a data final</p>
                        </div>
                        <hr/>
                        <Form onSubmit ={ this.onSave }>
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
                                        <Input type="date" value={this.state.data} onChange={({target}) => this.setState({ data : target.value} )} />
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
                
                                <Button style={{margin : 5}} color="secondary" onClick={() => this.setState({ open : false})}>Cancelar</Button>
                                <Button style={{margin : 5}} color="success" type="submit">Salvar</Button>
                            </FormGroup>
                            
                        </Form>
                </div>
            </ModalBody>
            
        </Modal>
        
        )
    }
}

export default NovoLab;