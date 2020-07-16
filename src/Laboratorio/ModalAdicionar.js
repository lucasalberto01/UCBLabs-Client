import React from 'react'
import Swal from 'sweetalert2'

import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { novoLab, socket, listarTiposLabs} from './../Service'

class ModalAdicionar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modal : false,
            local : null, 
            capacidade : null, 
            descricao : null,
            id_lab_tipo : 0,
            tipos : []
        }
    }

    componentDidMount(){
        listarTiposLabs((data) =>{
            console.log(data)
            this.setState({tipos : data.tipos})
        })
    }

    onDisplay = () =>{
        this.setState({modal : true})
    }

    envio = (e) => {
        e.preventDefault();

        let { local, capacidade, descricao, id_lab_tipo } = this.state

        if(local !== null && capacidade !== null && descricao !== null && id_lab_tipo !== 0){
            let data = {
                local,
                capacidade,
                descricao,
                id_lab_tipo
            }
            
            novoLab(data, function(data){
                console.log(data.data)
                if(data.data.code === 200){
                    this.setState({ modal : false})
                    this.props.loadLabs()

                    Swal.fire({
                        icon: 'success',
                        title: 'Prontinho',
                        text: 'Laboratorio adicionado com sucesso!'
                    })
                    
                }
            }.bind(this))
            

        }else{
            Swal.fire({
                title : 'Opss',
                text : 'Preencha todos os campos',
                icon : 'error'
            })
        }
    }

    render(){
        return(
            <Modal isOpen={this.state.modal} toggle={() => this.setState({ modal : false}) } >
                <ModalHeader toggle={() => this.setState({ modal : false}) }>Novo Laboratorio</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <Form onSubmit={this.envio}>
                                    <FormGroup>
                                        <Label >Local</Label>
                                        <Input onChange={({target}) => this.setState({ local : target.value} )} required type="text" placeholder="Ex.: LAB 01" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >Capacidade</Label>
                                        <Input onChange={({target}) => this.setState({ capacidade : target.value} )} required type="number" placeholder="Ex.: 30" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleSelect">Tipo</Label>
                                        <Input defaultValue={this.state.id_lab_tipo} type="select" onChange={({target}) => this.setState({id_lab_tipo : parseInt(target.value)})}>
                                            <option value={0}>Selecione um tipo</option>
                                            {this.state.tipos.map(element =>{
                                                return(<option value={element.id_lab_tipo}>{element.nome}</option>)
                                            })}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail">Descrição</Label>
                                        <Input onChange={({target}) => this.setState({ descricao : target.value} )} required type="textarea" placeholder="EX.: Primeiro laboratorio a esquerda" />
                                    </FormGroup>
                                <Button className="float-right btn-blue">Salvar</Button>
                            </Form>
                        </div>
                    </div>
                    
                </ModalBody>
            </Modal>
        )
    }
}

export default ModalAdicionar