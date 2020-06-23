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
            id_reserva : 0,
            id_lab : 0,
            id_lab_horario : 0,
            dia : null,
            hora_inicio : null,
            hora_fim : null,
            materia : null
            
        }
    }

    display = (id_reserva, id_lab, id_lab_horario, dia, hora_inicio, hora_fim, materia) =>{
        this.setState({
            open : true, 
            id_reserva,
            id_lab,
            id_lab_horario,
            dia,
            hora_inicio,
            hora_fim,
            materia
        })
        
    }

    livre = () =>{
        let { id_lab, id_lab_horario, dia } = this.state

        let data = {
            id_lab, 
            id_lab_horario, 
            data_reserva : dia
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
                    data_reserva : dia, 
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

    onTransferir = (id_reserva) =>{
        this.props.onTransferir(id_reserva)
        this.setState({open : false})
    }

    render(){
        return(
            <>
                <Modal isOpen={this.state.open} toggle={() => this.setState({open : false})} >
                    <ModalHeader toggle={() => this.setState({open : false})}>Informações</ModalHeader>
                    <ModalBody>
                        
                        <div className="exibir-materias">
                            <span><b>Disciplina: </b> {this.state.materia === null ? 'Trancado' : this.state.materia} </span>
                            <span><b>Dia: </b> {moment(this.state.dia).format("DD/MM/YYYY")} </span>
                            <span><b>Inicio: </b> {this.state.hora_inicio} </span>
                            <span><b>Fim: </b> {this.state.hora_fim} </span>
                        </div>
                        
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={this.state.materia !== null ? true : false} color="success" onClick={() => this.livre()}>Marcar como Tempo Livre</Button>
                        <Button disabled={(this.state.materia === null || this.state.materia === "Livre" ) ? true : false} color="warning" onClick={() => this.onTransferir(this.state.id_reserva)}>Transferir</Button>
                        <Button color="secondary" onClick={() => this.setState({open : false})}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default EditarReserva;