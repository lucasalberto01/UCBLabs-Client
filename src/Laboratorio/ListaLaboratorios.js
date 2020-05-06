import React from 'react'
import TopBar from './../Teamplate/TopBar'
import { listaLabs } from './../Service'
import Swal from 'sweetalert2'
import { novoLab, getDadosLab, editarLab, apagarLab, socket, listarTiposLabs } from './../Service'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

import ModalEditar from './ModalEditar'
import ModalAdicionar from './ModalAdicionar'

class ListaLaboratorio extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
            Lista_Laboratorio : [], 
            modal : false, 
            modal_editar : false , 
            local: null, 
            capacidade : null, 
            descricao : null,
            tipos : [],
            local_editar : null, 
            capacidade_editar : null, 
            descricao_editar : null,  
            id_editar : null,
            load_editar : true
        }
        this.loadLabs = this.loadLabs.bind(this)
        this.editar = this.editar.bind(this)

        this.ref_modal_editar = React.createRef();
        this.ref_modal_adicionar = React.createRef();
    }

    componentDidMount(){
        this.loadLabs()

        socket.on('AtualizacaoLabs', function(data){
            console.log(data)
            this.setState({Lista_Laboratorio : data.Laboratorios})
        }.bind(this));

        listarTiposLabs((data) =>{
            console.log(data)
            this.setState({tipos : data.tipos})
        })
        

    }

    loadLabs(){
        this.setState({ ListaLaboratorio : []}, function(){
            listaLabs(function(data){
                console.log(data)
                this.setState({Lista_Laboratorio : data.Laboratorios})

            }.bind(this))
        }.bind(this))

    }

    novo = () =>{
        this.ref_modal_adicionar.current.onDisplay()
    }


    editar(id_lab){
        this.ref_modal_editar.current.onDisplay(id_lab)

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
                                    <li className="breadcrumb-item"><a href="javascript: void(0);">Dashboard</a></li>
                                    <li className="breadcrumb-item"><a href="javascript: void(0);">Laboratorio</a></li>
                                </ol>
                                </div>
                                <h4 className="page-title">Laboratorios</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <button onClick={this.novo} type="button" className="btn btn-blue btn-rounded mb-3"><i className="icon-plus icons"></i> Novo Laboratorio</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow ">
                                <h5 className="card-header">Laboratorios</h5>
                                <div className="card-body">
                                    {this.state.Lista_Laboratorio.length > 0 &&
                                        <div className="row lista-computador">
                                            
                                                {this.state.Lista_Laboratorio.map((item) => (
                                                    <div className="col-2" onClick={() => this.editar(item.id_lab) }>
                                                        <div className="item shadow">
                                                            <i className="icon-screen-desktop icons" />
                                                            <span>{item.local}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                            
                                        </div>
                                    }

                                    {this.state.Lista_Laboratorio.length === 0 &&
                                        <div className="text-center">
                                            <div className="carregando"></div>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <ModalAdicionar ref={this.ref_modal_adicionar} loadLabs={() => this.loadLabs()} />
                    <ModalEditar ref={this.ref_modal_editar} loadLabs={() => this.loadLabs()} />
                   
                </div>
            </div>
        )
    }
}

export default ListaLaboratorio;