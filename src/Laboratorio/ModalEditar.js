import React from 'react'
import Swal from 'sweetalert2'

import { apagarLab, socket, getDadosLab, listarTiposLabs, editarLab} from './../Service'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';


class ModalEditar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modal_editar : false,
            capacidade_editar : null, 
            local_editar : null, 
            descricao_editar : null,
            tipo_editar : null, 
            id_editar : null, 
            load_editar : true
        }   

        
    }

    componentDidMount(){
        listarTiposLabs((data) =>{
            console.log(data)
            this.setState({tipos : data.tipos})
        })
    }

    onDisplay(id_lab){
        this.setState({modal_editar : true, capacidade_editar : null, local_editar : null, descricao_editar : null, id_editar : id_lab, load_editar : true})
        getDadosLab(id_lab, (data) => {
            console.log(data);

            let { capacidade, local, descricao, id_lab, id_lab_tipo } = data.informacoes
            this.setState({capacidade_editar : capacidade, local_editar : local, descricao_editar : descricao, load_editar : false, id_editar : id_lab, tipo_editar : id_lab_tipo})
            
        })
    }

    async apagar(){
        let confirmacao = await Swal.fire({
            title : 'Certeza ?',
            text : 'Tem certeza que quer excluir o laboratorio ' + this.state.local_editar + ' ?',
            type : 'warning',
            showCancelButton : true,
            showConfirmButton : true
        })

    
        if(confirmacao.value){
            if(this.state.id_editar !== null){
                apagarLab(this.state.id_editar, function(data){
                    console.log(data);
                    if(data.code === 200){
                        this.setState({ modal_editar : false, capacidade_editar : null, local_editar : null, descricao_editar : null, id_editar : null})
                        this.props.loadLabs()
    
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Laboratorio Apagado com sucesso!'
                        })
                    }
    
    
                }.bind(this));
            }
        }

    }

    envio2 = (e) => {
        e.preventDefault();
        let { local_editar : local, capacidade_editar : capacidade, descricao_editar : descricao, id_editar : id_lab, tipo_editar : tipo } = this.state

        if(local !== null, capacidade !== null, descricao !== null, tipo !== null){
            let data = {
                local,
                capacidade,
                descricao,
                id_lab,
                tipo
            }
            
            editarLab(data, function(data){
                console.log(data)
                if(data.code === 200){
                    
                    this.setState({ modal_editar : false})
                    this.props.loadLabs()

                    Swal.fire({
                        type: 'success',
                        title: 'Prontinho',
                        text: 'Laboratorio editado com sucesso!'
                    })

                }
            }.bind(this))
        }
    }

    render(){
        return(
            <Modal isOpen={this.state.modal_editar} toggle={() => this.setState({modal_editar : false})} className={this.props.className}>
                <ModalHeader toggle={() => this.setState({modal_editar : false})} >Editar Laboratorio</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            {!this.state.load_editar && 
                                <Form onSubmit={this.envio2}>
                                    <FormGroup>
                                        <Label for="exampleEmail">Local</Label>
                                        <Input onChange={({target}) => this.setState({ local_editar : target.value} )} value={this.state.local_editar}  required type="text" placeholder="Ex.: LAB 01" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail">Capacidade</Label>
                                        <Input onChange={({target}) => this.setState({ capacidade_editar : target.value} )} value={this.state.capacidade_editar} required type="number" placeholder="Ex.: 30" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleSelect">Tipo</Label>
                                        <Input value={this.state.tipo_editar} onChange={({target}) => this.setState({ tipo_editar : target.value} )} type="select" name="select" id="exampleSelect">
                                            {this.state.tipos.map(element =>{
                                                return(<option value={element.id_lab_tipo}>{element.nome}</option>)
                                            })}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail">Descrição</Label>
                                        <Input onChange={({target}) => this.setState({ descricao_editar : target.value} )} value={this.state.descricao_editar} required type="textarea" placeholder="EX.: Primeiro laboratorio a esquerda" />
                                    </FormGroup>
                                    
                                    <Button className="float-right btn-blue ml-1">Salvar</Button>
                                    <Button onClick={this.apagar} type={'button'} className="float-right btn-danger">Apagar</Button>
                                </Form>
                            }
                            {this.state.load_editar && 
                                <div className="text-center">
                                    <div className="carregando"></div>
                                </div>
                            }
                            
                        </div>
                    </div>
                    
                </ModalBody>
            </Modal>

        )
    }
}

export default ModalEditar