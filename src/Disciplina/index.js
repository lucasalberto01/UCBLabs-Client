import React from 'react'
import TopBar from '../Teamplate/TopBar'
import { Card, CardHeader, CardBody } from 'reactstrap'

import ModalEdit from '../Conf/Diciplina/ModalEdit'
import ModalAdd from '../Conf/Diciplina/ModalAdd'
import ModalImport from '../Conf/Diciplina/ModalImport'
import {  socket, ListarDiciplinas} from '../Service'

class Disciplina extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            lista : []
        }

        this.ModalEdit = React.createRef()
        this.ModalAdd = React.createRef()
        this.ModalImport = React.createRef()
    }

    componentDidMount(){
        ListarDiciplinas((data) =>{
            this.setState({lista : data.diciplinas})
        })

        socket.on('AtualizacaoDiciplinas', (data) =>{
            this.setState({lista : data.diciplinas})
        })
    }

    onEdit = (id, cor, nome, professor) =>{
        this.ModalEdit.current.onDisplay(id, nome, professor, cor)
    }

    onImport = () =>{
        this.ModalImport.current.onDisplay()
    }

    onAdd = () =>{
        this.ModalAdd.current.onDisplay()
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
                                        <li className="breadcrumb-item">Disciplinas</li>
                                    </ol>
                                </div>
                                <h4 className="page-title">Disciplinas</h4>
                            </div>
                        </div>

                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <button type="button" class="btn btn-outline-primary mb-3" onClick={this.onAdd}><i class="icon-plus icons"></i> Nova Disciplina</button>
                            <button type="button" class="btn btn-outline-primary mb-3 ml-3" onClick={this.onImport}><i class="icon-plus icons"></i> Importar Disciplina</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Card className="shadow">
                                <CardHeader>Disciplinas</CardHeader>
                                <CardBody>
                                    <div className="bg-white">
                                        <h5 className="border-bottom pb-2 mb-0 text-muted">Todas as disciplinas cadastradas</h5>
                                        {this.state.lista.map(element =>(
                                            <div className="media text-muted pt-3">
                                                <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={element.color} /><text x="50%" y="50%" fill={element.color} dy=".3em">32x32</text></svg>
                                                <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                    <span className="d-block text-gray-dark">
                                                        <a href="#" className="float-right" onClick={() =>  this.onEdit(element.id_disciplina, element.color , element.nome_disciplina, element.nome_professor)} >Editar</a>
                                                        <b>{element.nome_disciplina}</b>
                                                    </span>
                                                    {element.nome_professor}
                                                </p>
                                            </div>
                                        
                                        ))}
                                    </div>

                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
                <ModalEdit ref={this.ModalEdit} />
                <ModalAdd ref={this.ModalAdd} />
                <ModalImport ref={this.ModalImport} />
            </div>
        )
    }
}

export default Disciplina