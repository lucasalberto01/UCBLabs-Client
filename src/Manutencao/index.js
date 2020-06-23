import React from 'react'
import TopBar from './../Teamplate/TopBar'

import ModalNova from './ModalNova'
import ModalEditar from './ModalEditar'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import { socket, listarManutencao } from './../Service'

class Manutencao extends React.Component{
    constructor(props){
        super(props)
        this.modal1 = React.createRef();
        this.modal2 = React.createRef();
        this.state = {
            manutencoes : []
        }
    }

    componentDidMount(){
        listarManutencao((data) =>{
            console.log(data)
            this.setState({manutencoes : data.manutencao})
        })

        socket.on('UpdateManutencao', (data) =>{
            this.setState({manutencoes : data.manutencao})
        })
    }

    novaManutenção = () =>{
        this.modal1.current.display();
    }

    editarManutencao = (local, nome, id_status, obs, id) =>{
        this.modal2.current.display(local, nome, id_status, obs, id);
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
                                    <li className="breadcrumb-item">Dashboard</li>
                                    <li className="breadcrumb-item">Manutenção</li>
                                </ol>
                                
                            </div>
                            <h4 className="page-title">Manutenção</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-outline-primary" onClick={this.novaManutenção}><i className="icon-plus icons"></i> Nova Manutenção</button>
                    </div>
                    <div className="col-12" style={{marginTop: 15}}>
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">Lab</th>
                                    <th scope="col">Equipamento</th>
                                    <th scope="col">Descricao</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.manutencoes.map((element, index) =>{
                                    return(
                                        <tr key={index} style={{backgroundColor : 'white'}}>
                                            <th scope="row">{element.local}</th>
                                            <td>{element.nome}</td>
                                            <td>{element.obs}</td>
                                            <td>{element.status}</td>
                                            <td>{moment(element.data_entrada).format('DD/MM/YYYY HH:mm')}</td>
                                            <td style={{display : 'flex', justifyContent : 'center', cursor : 'pointer'}}>
                                                <span onClick={() => this.editarManutencao(element.local, element.nome, element.id_status, element.obs, element.id)}>
                                                    <i className="icon-pencil icons"></i>
                                                </span>
                                            </td>
                                            
                                        </tr>
                                    )
                                })}                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ModalNova ref={this.modal1} />
            <ModalEditar ref={this.modal2} />
        </div>
        )
    }
}
export default Manutencao;