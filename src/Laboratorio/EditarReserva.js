import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { DadosReserva, verificaReserva, NovaReserva } from './../Service'

import Swal from 'sweetalert2'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

class EditarReserva extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open : false,
            dados : null,
            disciplina : 'Livre'
            
        }
    }

    display = (data) =>{
        data.data_inicio = moment(data.inicio).format('HH:mm')
        data.data_fim = moment(data.fim).format('HH:mm')
        data.dia = moment(data.inicio).format('DD/MM/YYYY')
        this.setState({open : true, dados : data, disciplina : 'Livre'})
        this.exibirPedido(data)
    }

    exibirPedido = (data) =>{
        
        if(data.id_reserva){
            DadosReserva(data.id_reserva, (data) =>{
                
                this.setState({disciplina : data.dados[0].nome_disciplina})
            })
        }else{
            //alert('Vazio')
        }
        
    }

    livre = () =>{
        let { id_lab, id_lab_horario, inicio } = this.state.dados

        let data_reserva = moment(inicio).format('YYYY-MM-DD');

        let data = {
            id_lab, 
            id_lab_horario, 
            data_reserva
        }

        verificaReserva(data, (data)=>{
            if(data.existe){
                Swal.fire({
                    text : 'Tem certeza que deseja marcar como tempo livre ?',
                    title : 'Certeza?',
                    type : 'success'
                }).then((res)=>{
                    console.log(res);
                })
            }else{

                let data = {
                    id_lab, 
                    id_disciplina : 1, 
                    id_pessoa : 1, 
                    id_lab_horario, 
                    data_reserva, 
                    id_pedido : null
                }
                NovaReserva(data, (data)=>{
                    if(data.code === 200){
                        Swal.fire({
                            text : 'Pronto, Alteração feita com sucesso',
                            title : 'Pronto',
                            type : 'success'
                        })
                        this.setState({open : false})
                    }else{
                        Swal.fire({
                            text : 'Opss',
                            title : 'Algo deu errado, tente novamente',
                            type : 'error'
                        })
                    }
                })
                
            }
        })

        
    }

    render(){
        return(
            <>
                <Modal style={{maxWidth : 700}} isOpen={this.state.open} toggle={() => this.setState({open : false})} >
                    <ModalHeader toggle={() => this.setState({open : false})}>Informações</ModalHeader>
                    <ModalBody>
                        {this.state.dados &&
                            <div className="exibir-materias">
                                <span><b>Disciplina: </b> {this.state.disciplina} </span>
                                <span><b>Dia: </b> {this.state.dados.dia} </span>
                                <span><b>Inicio: </b> {this.state.dados.data_fim} </span>
                                <span><b>Fim: </b> {this.state.dados.data_fim} </span>
                            </div>
                        }
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.livre()}>Marcar como Tempo Livre</Button>
                        <Button color="warning" onClick={() => null}>Transferir</Button>
                        <Button color="primary" onClick={() => null}>Editar</Button>
                        <Button color="secondary" onClick={() => this.setState({open : false})}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default EditarReserva;