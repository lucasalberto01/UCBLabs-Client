import React from 'react'
import TopBar from './../Teamplate/TopBar'
import {  } from 'reactstrap';
import { socket, listarAlertas, apagarAlerta } from './../Service'
import Swal from 'sweetalert2'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import NovoLab from './NovoLab'
import NovoReserva from './NovoReserva'

import EditLab from './EditLab'
import EditReserva from './EditReserva'


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


        this.NovoLab = React.createRef();
        this.EditLab = React.createRef();
        this.EditReserva = React.createRef();
        this.NovoReserva = React.createRef();
    }

    componentDidMount(){
        listarAlertas(async (data) =>{
        
            this.setState({avisos : data.lista})

        })

        socket.on('UpdateStatusAvisos', async (resp) =>{
        
            

            this.setState({avisos : resp.avisos})
        })
    }

    onAddLab = () =>{
        this.NovoLab.current.onDisplay()
    }

    onAddReserva= () =>{
        this.NovoReserva.current.onDisplay()
    }


    abrirModalEditar = (idLab, data_termino, tipoAlerta, mensagem, idAlerta, id_reserva, sobre) =>{
        
        let editar = {
            editar_modal : true,
            editar_mensagem : mensagem,
            editar_idLab : idLab,
            editar_idTipoAlerta : tipoAlerta,
            editar_indefinido : data_termino === null ? true : false,
            editar_dataTermino : data_termino === null ? null : data_termino,
            editar_id : idAlerta,
            id_reserva
        }

        console.log(sobre)

        if(sobre === 'laboratorio'){
            this.EditLab.current.onDisplay(editar)
        
        }else if(sobre === 'reserva'){
            this.EditReserva.current.onDisplay(editar)
        }
        
    } 

    apagarAlerta = (id_aviso) =>{
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
                            
                                <button type="button" class="btn btn-outline-primary" onClick={this.onAddLab} > <i className="icon-plus icons"></i> Laboratorio</button>
                                <button type="button" class="btn btn-outline-primary ml-3" onClick={this.onAddReserva }> <i className="icon-plus icons"></i> Reserva</button>
                            
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                        
                            <table className="table table-striped aviso">
                                <thead className="thead-dark">
                                    <tr>
                                    
                                        <th scope="col">Mensagem</th>
                                        <th width="15%" scope="col">Sala</th>
                                        <th width="15%" scope="col">Sobre</th>
                                        <th width="20%" scope="col">Data Termino</th>
                                        <th width="8%" scope="col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.avisos.map(element => {
                                        return(
                                            <tr>
                                                
                                                
                                                <td>{element.mensagem}</td>
                                                <td>{element.local}</td>
                                                <td>{element.id_reserva === null ? 'Laboratorio' : 'Reserva'}</td>
                                                <td>{element.data_final === null ? 'Sem data definida' : moment(element.data_final).format('DD/MM/YYYY HH:mm')}</td>
                                                <td className="botoes">
                                                    <span onClick={() => this.abrirModalEditar(element.id_lab, element.data_final, element.id_tipo_aviso, element.mensagem, element.id_aviso_reserva, element.id_reserva, element.sobre)} ><i className="icon-pencil icons"></i></span>
                                                    <span onClick={() => this.apagarAlerta(element.id_aviso_reserva)}><i className="icon-close icons"></i></span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <NovoLab ref={this.NovoLab} />
                    <NovoReserva ref={this.NovoReserva} />
                    <EditLab ref={this.EditLab} />
                    <EditReserva ref={this.EditReserva} />

                   
                                                   
                </div>
            </div>
        )
    }
}

export default Avisos;