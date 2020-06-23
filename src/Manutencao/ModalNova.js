import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';

import { listaLabs, listarEquipamentos, saveManutencao } from './../Service'
import Swal from 'sweetalert2';

class ModalNova extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            labs : [],
            equipamentos : [],
            select_lab : 0,
            select_equipamento : 0,
            descricao : null
        }


    }

    componentDidMount(){
        listaLabs(data =>{
            this.setState({ labs : data.Laboratorios})
        })
        
    }

    onSelect = ({target }) =>{
        let id = parseInt(target.value)

        this.setState({ select_lab : id})

        listarEquipamentos({id_lab : id}, data =>{
            this.setState({ equipamentos : data })
        })
    }

    display = () =>{
        this.setState({ exibir : true})
    }

    onSave = (e) =>{
        e.preventDefault()

        let { select_equipamento, select_lab, descricao } = this.state
        console.log({ id_equipamento : select_equipamento, id_lab : select_lab, descricao })

        select_lab = parseInt(select_lab)
        select_equipamento = parseInt(select_equipamento)

        if(select_equipamento === 0 || select_lab === 0){
            Swal.fire({
                title : 'Opss',
                text : 'Preencha todos os campos',
                type : "error"
            })
            return;
        }

        saveManutencao({ id_equipamento : select_equipamento, id_lab : select_lab, descricao }, data =>{
            if(data.success){
                Swal.fire({
                    title : 'Pronto',
                    text : 'Salvo com success',
                    type : 'success'
                })
                this.setState({ exibir : false})
            }
        })
    }

    render(){
        return(
            <>
            <Modal style={{maxWidth : 700}} isOpen={this.state.exibir} toggle={() => this.setState({exibir : false})} >
                <ModalHeader toggle={() => this.setState({exibir : false})}>Nova Manutenção</ModalHeader>
                <ModalBody>
                    <div>
                        <form onSubmit={this.onSave}>
                            <div class="form-group">
                                <label>Selecionar Laboratorio</label>
                                <Input defaultValue={this.state.select_lab} type="select" onChange={this.onSelect}>
                                    <option value="0">Nenhum</option>
                                    <option value="-1">Fora do Laboratorio</option>
                                    {this.state.labs.map((elemento) => {
                                        return(
                                            <option value={elemento.id_lab }>{elemento.local}</option>
                                        )
                                    })
                                    }
                                </Input>

                                
                            </div>
                            <div class="form-group">
                                <label>Selecionar Equipamento</label>

                                {this.state.select_lab === 0 &&
                                    <Input type="text" value="Selecione um Laboratorio Primeiro" disabled />
                                }

                                {this.state.select_lab !== 0 &&
                                <>
                                     <p>{this.state.equipamentos.length === 0 ? 'Não tem nenhum equipamento cadastrado para onde você selecionou' : ''}</p>
                                    <Input defaultValue={this.state.select_equipamento} type="select" onChange={({target}) => this.setState({ select_equipamento : target.value} )}>
                                        <option value="0">Selecione um equipamento</option>
                                        {this.state.equipamentos.map((elemento) => {
                                            return(
                                                <option value={elemento.id }>{elemento.nome}</option>
                                            )
                                        })
                                        }
                                    </Input>
                                   
                                    
                                </>
                                }

                                
                            </div>
                            <div class="form-group">
                                <label>Descrição da manutenção e detalhes da resolução</label>
                                <textarea required onChange={({target}) => this.setState({ descricao : target.value} )}  class="form-control" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <p>O sistema marcara essa manutenção como pendente autormaticamente</p>
                            </div>
                            <div className="form-group float-right">
                                <Button className="mr-1" type="submit" color="success">Salvar</Button>
                                <Button color="secondary" onClick={() => this.setState({exibir : false})}>Cancelar</Button>
                            </div>
                            
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </>
        )
    }
}

export default ModalNova;