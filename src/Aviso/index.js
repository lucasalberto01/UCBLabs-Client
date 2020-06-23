import React from 'react'
import TopBar from './../Teamplate/TopBar'

import Swal from 'sweetalert2'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import { socket, listarAlertas, listarTipoAlerta } from './../Service'

import NovoLab from './NovoLab'
import NovoReserva from './NovoReserva'

import EditLab from './EditLab'
import EditReserva from './EditReserva'

import ModalAdd from '../Conf/Msg/ModalAdd'
import ModalEdit from '../Conf/Msg/ModalEdit'

class Avisos extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            avisos : [],
            tipos : []
        }

        this.NovoLab = React.createRef();
        this.EditLab = React.createRef();
        this.EditReserva = React.createRef();
        this.NovoReserva = React.createRef();

        this.ModalAdd = React.createRef();
        this.ModalEdit = React.createRef();
    }

    componentWillMount(){
        listarAlertas((data) =>{
            this.setState({avisos : data.lista})
        })

        socket.on('UpdateStatusAvisos', async (resp) =>{
            this.setState({avisos : resp.avisos})
        })

        listarTipoAlerta((data) =>{
            this.setState({tipos : data.lista})
        })

        socket.on('AtualizacaoTiposAvisos', (data) =>{
            this.setState({ tipos : data.lista })
        })
    }

    onAddLab = () =>{
        this.NovoLab.current.onDisplay()
    }

    onAddTipo = () =>{
        this.ModalAdd.current.onDisplay()
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

    onEditTipo = (id, icone, tipo, cor, ativo) =>{
        this.ModalEdit.current.onDisplay(id, icone, tipo, cor, ativo)
    }

    render(){
        return(
            <div className="home">
                <TopBar />

                <div className="container corpo">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                        <li className="breadcrumb-item"><a href="#">Avisos</a></li>
                                    </ol>
                                </div>
                                <h4 className="page-title">Avisos</h4>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-4">
                            <button type="button" className="btn btn-outline-primary" onClick={this.onAddLab} > <i className="icon-plus icons"></i> Laboratorio</button>
                            <button type="button" className="btn btn-outline-primary ml-3" onClick={this.onAddReserva }> <i className="icon-plus icons"></i> Reserva</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <div className="card shadow ">
                                <h5 className="card-header">Avisos Ativos</h5>
                                <div className="card-body">

                                    {this.state.avisos.map((element, index) => (
                                        <div className="media pb-3" key={index}>
                                            <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={element.color} /><text x="50%" y="50%" fill={element.color} dy=".3em">32x32</text></svg>
                                            <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                
                                                <span className="d-block"><b>{element.local}</b> by {element.sobre} {element.data_final}</span>
                                                <a href="#" className="float-right" onClick={() =>  this.abrirModalEditar(element.id_lab, element.data_final, element.id_tipo_aviso, element.mensagem, element.id_aviso_reserva, element.id_reserva, element.sobre)}>Editar</a>
                                                {element.mensagem}
                                            </p>
                                        </div>
                                    ))}

                                    {this.state.avisos.length === 0 &&
                                        <div>
                                            <p>Está tudo em dia :)</p>
                                        </div>
                                    }

                                    <small className="d-block text-right mt-3">
                                        <a href="#">Mostra todos os avisos</a>
                                    </small>

                                </div>
                               
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card shadow ">
                                <h5 className="card-header">
                                    <a href="#" className="float-right text-white" onClick={this.onAddTipo }>
                                        <i className="icon-plus icons"></i>
                                    </a>
                                    Gerenciar Tipos de avisos
                                </h5>
                                <div className="card-body">
                                    <h5>Tipos de avisos</h5>
                                    <p>Todos os Tipos de avisos que estão cadastrados na plataforma</p>

                                    <div>
                                        {this.state.tipos.map((element, index) =>(
                                            <div key={index} style={{display : 'flex', backgroundColor : element.color, padding : 8, justifyContent : 'space-between', borderRadius : 3, marginBottom : 5, opacity : element.ativo === 1 ? '1' : '0.3'}}>
                                                <span>{element.tipo + (element.ativo === 0 ? ' (desativado)' : '') }</span>
                                                <span>
                                                    <a href="#" className="text-dark" onClick={() => this.onEditTipo(element.id_aviso, element.icone, element.tipo, element.color, element.ativo) }>
                                                        <i className="icon-pencil icons"></i>
                                                    </a>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <NovoLab ref={this.NovoLab} />
                    <NovoReserva ref={this.NovoReserva} />
                    <EditLab ref={this.EditLab} />
                    <EditReserva ref={this.EditReserva} />

                    <ModalAdd ref={this.ModalAdd} />
                    <ModalEdit ref={this.ModalEdit} />

                </div>
            </div>
        )
    }
}

export default Avisos