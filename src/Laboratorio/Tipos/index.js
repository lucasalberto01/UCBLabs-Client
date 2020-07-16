import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Adicionar from './Adicionar'
import Editar from './Editar'
import { socket, listarTiposLabs, apagarTiposLabs } from '../../Service'
import Swal from 'sweetalert2';

class TiposDeLaboratorios extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            tipos : []
        }
        this.Adicionar = React.createRef();
        this.Editar = React.createRef();
    }

    componentDidMount(){
        listarTiposLabs(({ tipos }) =>{
            this.setState({tipos})
        })

        socket.on('UpdateTipoLab', ({tipos }) =>{
            this.setState({tipos})
        })
    }

    onDisplay = () =>{
        this.setState({exibir : true})
    }

    onAdd = () =>{
        this.Adicionar.current.onDisplay()
    }

    onEdit = (nome, descricao, id) =>{
        this.Editar.current.onDisplay(nome, descricao, id)
    }

    onDelete = (id) =>{
        Swal.fire({
            title : 'Tem certeza que deseja apagar ?',
            text : 'Lembresse, você só pode apagar caso ele não esteja selecionado em nenhum dos laboratorios',
            icon : 'question',
            confirmButtonText : 'Sim',
            showCancelButton : true,
            cancelButtonText : 'Não'

        })
        .then(res =>{
            if(res.value){
                apagarTiposLabs(id, data =>{
                    console.log(data)
                    if(data.code === 200){
                        Swal.fire({
                            title : 'Pronto',
                            text : 'Apagado com sucesso',
                            icon : 'success'
                        })
                    }else if(data.code === 403){
                        Swal.fire({
                            title : 'Opss',
                            text : 'Esse tipo de laboratorio ta sendo usado por ' + data.n_lab_usando + ' laboratorio(s)',
                            icon : 'warning'
                        })
                    }else{
                        Swal.fire({
                            title : 'Opss',
                            text : 'Erro de conexão com o servidor',
                            icon : 'error'
                        })
                    }
                })
            }
        })
    }

    render(){
        return(
            <>
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({ exibir : false})} className="modal-lg" >
                <ModalHeader toggle={() => this.setState({ exibir : false})} >Tipo Cadastrados</ModalHeader>
                    <ModalBody>
                        <div>
                            <h5>Tipos de Labotarios</h5>
                            <p>Tipos de laboratio serve para ajudar os coordenadores do curso a selecionar o melhor labotarorio para oque eles querem<br/>Tente sempre deixar a descrição o mais simples e completa possivel</p>
                        </div>
                        <h5 className="text-muted border-bottom pb-2">
                            <a href="#" onClick={this.onAdd} className="float-right text-dark">
                                <i className="mdi mdi-plus-circle mdi-18px" />
                            </a>
                            Tipos
                        </h5>
                        <ul class="list-group rounded-0">
                            {this.state.tipos.map(element =>(
                                <li class="list-group-item bg-dark text-white rounded-0">
                                    <span className="float-right">
                                        <a href="#" className="mr-2 text-white" onClick={() => this.onEdit(element.nome, element.descricao, element.id_lab_tipo) }>
                                            <i className="mdi mdi-pencil mdi-18px" />
                                        </a>
                                        <a href="#" className="text-danger" onClick={() => this.onDelete(element.id_lab_tipo)}>
                                            <i className="mdi mdi-delete mdi-18px" />
                                        </a>
                                    </span>
                                    <span>
                                        <span className="font-weight-bold">{element.nome}</span>
                                        <br/>
                                        <span className="small text-white">{element.descricao}</span>
                                    </span>
                                </li>
                            ))}
                            
                        </ul>
                    </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => this.setState({ exibir : false})} >Fechar</Button>
                </ModalFooter>
            </Modal>
            <Adicionar ref={this.Adicionar} />
            <Editar ref={this.Editar} />
            </>
        )
    }
}

export default TiposDeLaboratorios