import React from 'react'
import ModalAdd from './ModalAdd'
import ModalEdit from './ModalEdit'
import Swal from 'sweetalert2'

import { socket,  listarTipoAlerta, apagarTipoAviso, ativarTipoAviso } from './../../Service'

class Msg extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tipos : []
        }

        this.ModalAdd = React.createRef();
        this.ModalEdit = React.createRef();
    }

    componentDidMount(){
        listarTipoAlerta((data) =>{
            console.log({ data })
            this.setState({tipos : data.lista})
        })

        socket.on('AtualizacaoTiposAvisos', (data) =>{
            console.log({ data })
            this.setState({ tipos : data.lista })
        })
    }

    onAdd = () =>{
        this.ModalAdd.current.onDisplay()
    }

    onEdit = (id, icone, tipo, cor, ativo) =>{
        this.ModalEdit.current.onDisplay(id, icone, tipo, cor, ativo)
    }

    onDetele = (id) =>{
        Swal.fire({
            title : 'Certeza?',
            text : 'Tem certeza que deseja desativer este tipo de aviso ?',
            type : 'question',
            showCancelButton : true,
            cancelButtonText : 'Cancelar',
            cancelButtonColor : 'red',
            confirmButtonText : 'Tenho certeza',
        })
        .then((result) =>{
            if(result.value){
                apagarTipoAviso({id}, (data) =>{
                    if(data.success){
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Tipo de aviso desativado com sucesso!'
                        })
                    }
                    
                })
            }
        })
    }

    onEnable = (id) =>{
        Swal.fire({
            title : 'Certeza?',
            text : 'Tem certeza que deseja ativar este tipo de aviso ?',
            type : 'question',
            showCancelButton : true,
            cancelButtonText : 'Cancelar',
            cancelButtonColor : 'red',
            confirmButtonText : 'Tenho certeza',
        })
        .then((result) =>{
            if(result.value){
                ativarTipoAviso({id}, (data) =>{
                    if(data.success){
                        Swal.fire({
                            type: 'success',
                            title: 'Prontinho',
                            text: 'Tipo de aviso desativado com sucesso!'
                        })
                    }
                    
                })
            }
        })
    }

    render(){
        return(
            <>
                <div className="card">
                    <h5 className="card-header">Tipos de mensagem</h5>
                    <div className="card-body">
                        <p className="card-text">Aqui você pode ver e editar os tipos de mensagens</p>
                        <button type="button" className="btn btn-outline-primary" onClick={this.onAdd} >Novo Tipo</button>
                    </div>
                </div>

                <table className="table mt-3" style={{backgroundColor : '#fff', border : '1px solid rgba(0,0,0,.125)', borderRadius : '.25rem' }}>
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Tipo</th>
                        <th scope="col">Icone</th>
                        <th scope="col">Cor</th>
                        <th scope="col">Ação</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.tipos.map((element, index) =>{
                            return(
                                <tr key={index} style={{opacity : element.ativo === 1 ? '1' : '0.3'}}>
                                    <th scope="row">{element.tipo + (element.ativo === 0 ? ' (desativado)' : '') }</th>
                                    <td>{element.icone} <i className={'m-1 icon-' + element.icone +' icons'}></i> </td>
                                    <td>
                                        <span class="badge p-1" style={{backgroundColor : element.color}}>Color Selecionada</span>
                                    </td>
                                    <td style={{display: 'flex', flexDirection : 'row', justifyContent : 'center'}}>
                                        {element.ativo === 1 &&
                                            <>
                                                <span style={{cursor : 'pointer'}} onClick={() => this.onEdit(element.id_aviso, element.icone, element.tipo, element.color, element.ativo )}>
                                                    <i className="m-1 icon-pencil icons"></i>
                                                </span>
                                                <span style={{cursor : 'pointer'}} onClick={() => this.onDetele(element.id_aviso)}>
                                                    <i className="m-1 icon-ban icons"></i>
                                                </span>
                                            </>
                                        }

                                        {element.ativo === 0 && 
                                            <span style={{cursor : 'pointer'}} onClick={() => this.onEnable(element.id_aviso)}>
                                                <i className="m-1 icon-check icons"></i>
                                            </span>
                                        }
                                        
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

export default Msg