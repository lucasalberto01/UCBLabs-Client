import React from 'react'
import ModalEdit from './ModalEdit'
import ModalAdd from './ModalAdd'

import { socket, ListarDiciplinas } from './../../Service'


class Diciplina extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            lista : []
        }

        this.ModalEdit = React.createRef()
        this.ModalAdd = React.createRef()
    }

    componentDidMount(){
        ListarDiciplinas((data) =>{
            this.setState({lista : data.diciplinas})
        })

        socket.on('AtualizacaoDiciplinas', (data) =>{
            this.setState({lista : data.diciplinas})
        })
    }

    onEdit = (id, cor, nome) =>{
        this.ModalEdit.current.onDisplay(id, nome, cor)
    }

    onAdd = () =>{
        this.ModalAdd.current.onDisplay()
    }

    render(){
        return(
            <> 
                 <div className="card">
                    <h5 className="card-header">Diciplinas</h5>
                    <div className="card-body">
                        <p className="card-text">Aqui você pode ver e editar as Diciplinas</p>
                        <button type="button" className="btn btn-outline-primary" onClick={this.onAdd} >Nova Diciplina</button>
                    </div>
                </div>

                <table className="table mt-3" style={{backgroundColor : '#fff', border : '1px solid rgba(0,0,0,.125)', borderRadius : '.25rem' }}>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Cor</th>
                            <th scope="col">Ação</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.lista.map(element =>{
                            return(
                                <tr>
                                    <th scope="row">{element.nome_disciplina}</th>
                                    
                                    <td>
                                        <span class="badge p-1" style={{backgroundColor : element.color}}>Cor</span>
                                    </td>
                                  
                                    <td style={{display: 'flex', flexDirection : 'row', justifyContent : 'center'}}>
                                    
                                        <>
                                            <span style={{cursor : 'pointer'}} onClick={() => this.onEdit(element.id_disciplina, element.color , element.nome_disciplina)}>
                                                <i className="m-1 icon-pencil icons"></i>
                                            </span>
                                        </>
                        
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <ModalEdit ref={this.ModalEdit} />
                <ModalAdd ref={this.ModalAdd} />
            </>
        )
    }
}

export default Diciplina;