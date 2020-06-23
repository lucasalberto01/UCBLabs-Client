import React from 'react'
import ModalAdd from './ModalAdd'
import ModalEdit from './ModalEdit'

import { socket, listarEquipamentos } from './../../Service'

class Equipamento extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            equipamentos : []
        }

        this.ModalAdd = React.createRef()
        this.ModalEdit = React.createRef()
    }

    componentDidMount(){
        listarEquipamentos((data) =>{
            console.log(data)
            this.setState({equipamentos : data })
        })

        socket.on('UpdateEquipamentos', (data) =>{
            console.log(data)
            this.setState({equipamentos : data.equipamentos })
        })


    }

    onAdd = () =>{
        this.ModalAdd.current.onDisplay()
    }

    onEdit = (nome, descricao, code, id_lab, id) =>{
        this.ModalEdit.current.onDisplay(nome, descricao, code, id_lab, id)
    }

    render(){
        return(
            <>
               <div className="card">
                    <h5 className="card-header">Equipamentos</h5>
                    <div className="card-body">
                        <p className="card-text">Aqui você pode ver e editar os equipamentos</p>
                        <button type="button" className="btn btn-outline-primary" onClick={this.onAdd}>Novo Equipamento</button>
                    </div>
                </div>

                <table className="table mt-3" style={{backgroundColor : '#fff', border : '1px solid rgba(0,0,0,.125)', borderRadius : '.25rem' }}>
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Code</th>
                        <th scope="col">Lab</th>
                        <th scope="col">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.equipamentos.map((element, index) =>{
                            return(
                                <tr key={index} >
                                    <th>{element.nome}</th>
                                    <td>{element.descricao}</td>
                                    <td>{element.code}</td>
                                    <td>{element.local}</td>
                                    <td>
                                        <>
                                            <span style={{cursor : 'pointer'}} onClick={() => this.onEdit(element.nome, element.descricao, element.code, element.id_lab, element.id )}>
                                                <i className="m-1 icon-pencil icons"></i>
                                            </span>
                                            <span style={{cursor : 'pointer'}} onClick={() => this.onDetele(element.id_aviso)}>
                                                <i className="m-1 icon-ban icons"></i>
                                            </span>
                                        </>
                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
                <ModalAdd ref={this.ModalAdd} />
                <ModalEdit ref={this.ModalEdit} />
            </>
        )
    }
}

export default Equipamento;