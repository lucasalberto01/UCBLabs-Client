import React from 'react'
import TopBar from './../Teamplate/TopBar'

import ModalNova from './ModalNova'
import ModalEditar from './ModalEditar'

class Manutencao extends React.Component{
    constructor(props){
        super(props)
        this.modal1 = React.createRef();
        this.modal2 = React.createRef();
    }

    novaManutenção = () =>{
        this.modal1.current.display();
    }

    editarManutencao = (id) =>{
        this.modal2.current.display();
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
                        <button className="btn btn-info" onClick={this.novaManutenção}><i className="icon-plus icons"></i> Nova Manutenção</button>
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
                                <tr>
                                    <th scope="row">LAB 1</th>
                                    <td>Projetor</td>
                                    <td>O projetor está apresentando um problema na lampada</td>
                                    <td>Em andamento</td>
                                    <td>22/09/2019 15:33</td>
                                    <td style={{display : 'flex', justifyContent : 'center', cursor : 'pointer'}}>
                                        <a onClick={() => this.editarManutencao(1)}>
                                            <i className="icon-pencil icons"></i>
                                        </a>
                                    </td>
                                </tr>                             
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