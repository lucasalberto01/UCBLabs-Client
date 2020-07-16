import React from 'react'
import TopBar from './../Teamplate/TopBar'

import ModalNova from './ModalNova'
import ModalEditar from './ModalEditar'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import { socket, listarManutencao } from './../Service'
import { Card, CardBody, CardHeader } from 'reactstrap';

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

    colorStaus = (status) =>{
        if(status === 'Em andamento'){
            return '#17a2b8'
        }else if(status === 'Concluido'){
            return '#28a745'
        }else{
            return '#6c757d'
        }
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
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <Card>
                            <CardHeader>Manutenções realizadas</CardHeader>
                            <CardBody>
                                <h5 className="text-muted border-bottom pb-2 mb-3" >Manutenções</h5>
                                <p>Legenda dos Status : 
                                    <span class="badge badge-secondary m-1 p-1"> Pendente </span> 
                                    <span class="badge badge-info m-1 p-1"> Em andamento </span> 
                                    <span class="badge badge-success m-1 p-1"> Concluido </span> 
                                    
                                </p>
                                
                                <div className="mt-4">
                                    {this.state.manutencoes.map((element, index) =>(
                                        <div className="media text-muted pb-3">
                                            <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={this.colorStaus(element.status)} /><text x="50%" y="50%" fill={this.colorStaus(element.status)} dy=".3em">32x32</text></svg>
                                            <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                <a href="#" className="float-right" onClick={() => this.editarManutencao(element.local, element.nome, element.id_status, element.obs, element.id)}>
                                                    Editar
                                                </a>
                                                <span className="d-block" >
                                                    <strong>{!element.local ? 'Fora do Laboratorio' : element.local}</strong> - {element.nome} - {moment(element.data_entrada).format('DD/MM/YYYY HH:mm')}
                                                
                                                </span>
                                                {element.obs} 
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
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