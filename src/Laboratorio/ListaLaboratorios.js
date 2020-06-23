import React from 'react'
import TopBar from './../Teamplate/TopBar'
import Swal from 'sweetalert2'

import ModalEditar from './ModalEditar'
import ModalAdicionar from './ModalAdicionar'
import AddEquipamento from '../Conf/Equipamento/ModalAdd'
import EditEquipamento from '../Conf/Equipamento/ModalEdit'

import { listaLabs, getDadosLab, listarEquipamentos, socket } from './../Service'

class ListaLaboratorio extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
            Lista_Laboratorio : [], 
            tipos : [],
            lab_select : 0,
            lab_info : null,
            lab_equipamentos : []
        }
        this.loadLabs = this.loadLabs.bind(this)

        this.ref_modal_editar = React.createRef();
        this.ref_modal_adicionar = React.createRef();
        this.ref_modal_equipamento = React.createRef();
        this.ref_modal_equipamento_edit = React.createRef();
    }

    componentDidMount(){
        this.loadLabs()

        socket.on('AtualizacaoLabs', function(data){
            var id_lab = this.state.lab_select
            var lab_info = null

            data.Laboratorios.map(element =>{
                if(id_lab === element.id_lab){
                    lab_info = element
                }
            })

            this.setState({Lista_Laboratorio : data.Laboratorios, lab_info })
        }.bind(this));

        socket.on('UpdateEquipamentos', ({ equipamentos }) =>{
            let id_lab = this.state.lab_select
            let saida = equipamentos.filter((element =>{
                return id_lab === element.id_lab
            }))

            this.setState({ lab_equipamentos : saida })
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

    addEquipamento = () =>{
        let { lab_select } = this.state
        this.ref_modal_equipamento.current.onDisplay(lab_select)
    }

    editEquipamento = (nome, descricao, code, id_lab, id) =>{

        this.ref_modal_equipamento_edit.current.onDisplay(nome, descricao, code, id_lab, id, true)
    }

    edit = () =>{
        let { lab_select } = this.state
        this.ref_modal_editar.current.onDisplay(lab_select)
    }

    select = (id_lab) =>{
        //
        this.setState({lab_select : id_lab})
        getDadosLab(id_lab, data =>{
            this.setState({lab_info : data.informacoes})
        })

        listarEquipamentos({ id_lab }, data =>{
            this.setState({lab_equipamentos : data })
        })

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
                                    <li className="breadcrumb-item"><a href="#">Laboratorio</a></li>
                                </ol>
                                </div>
                                <h4 className="page-title">Laboratorios</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <button onClick={this.novo} type="button" className="btn btn-outline-primary mb-3"><i className="icon-plus icons"></i> Novo Laboratorio</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <div className="card shadow ">
                                <h5 className="card-header">Laboratorios</h5>
                                <div className="card-body">
                                    {this.state.Lista_Laboratorio.length > 0 &&
                                        <div className="row lista-computador">
                                            
                                                {this.state.Lista_Laboratorio.map((item, index) => (
                                                    <div key={index} className="col-2" onClick={() => this.select(item.id_lab) }>
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
                        <div className="col-4">
                            <div className="card shadow ">
                                <h5 className="card-header">Informações</h5>
                                {this.state.lab_info !== null &&
                                    <div className="card-body">
                                        <div>
                                            <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                                                <h3>{this.state.lab_info.local}</h3>
                                                <a href="#" onClick={this.edit}>
                                                    <i className="icon-pencil icons"></i>
                                                </a>
                                                
                                            </div>
                                            
                                            <span>Capacidade : {this.state.lab_info.capacidade}</span><br/>
                                            <span>{this.state.lab_info.lab_tipo_nome}</span><br/>
                                            <small  className="text-muted font-10">{this.state.lab_info.lab_tipo_descricao}</small><br/><br/>
                                            <span>Descrição: </span><br/>
                                            <small>{this.state.lab_info.descricao}</small>
                                        </div>
                                        <br/>
                                        <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                                            <h5>Equipamentos:</h5>
                                            <a href="#" onClick={this.addEquipamento}>
                                                <i className="icon-plus icons"></i>
                                            </a>
                                        </div>
                                        
                                        {this.state.lab_equipamentos.map((element, key) =>(
                                            <div key={key} style={{display : 'flex', backgroundColor : '#ccc', padding : 8, justifyContent : 'space-between', borderRadius : 3, marginBottom : 5}}>
                                                <span>{element.nome}</span>
                                                <span>
                                                    <a href="#" onClick={() => this.editEquipamento(element.nome, element.descricao, element.code, element.id_lab, element.id)}>
                                                        <i className="icon-pencil icons"></i>
                                                    </a>
                                                </span>
                                            </div>
                                        ))}
                                        
                                        
                                    </div>
                                }

                                {this.state.lab_info === null &&
                                    <div className="card-body">
                                        <span>Selecione um labotario para ver os dados</span>
                                    </div>
                                
                                }
                                
                            </div>
                        </div>
                    </div>
            
                    <ModalAdicionar ref={this.ref_modal_adicionar} loadLabs={() => this.loadLabs()} />
                    <ModalEditar ref={this.ref_modal_editar} loadLabs={() => this.loadLabs()} />
                    <AddEquipamento ref={this.ref_modal_equipamento} />
                    <EditEquipamento ref={this.ref_modal_equipamento_edit} />
                   
                </div>
            </div>
        )
    }
}

export default ListaLaboratorio;