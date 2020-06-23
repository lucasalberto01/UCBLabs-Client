import React from 'react'
import TopBar from './../Teamplate/TopBar'
import Msg from './Msg'
import Diciplina from './Diciplina'
import Equipamento from './Equipamento'
import { Alert } from 'reactstrap';


class Config extends React.Component{
    
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
                                    <li className="breadcrumb-item">Configurações</li>
                                </ol>
                                </div>
                                <h4 className="page-title">Configurações</h4>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <Alert color="danger">
                                Na documentação original as diciplinas iriam ser importadas automaticamente do sistema da faculdade.
                                <br/>
                                Na documentação original os equipamentos iriam ser importadas automaticamente do sistema da faculdade.
                                <br/>
                                Essa tela foi adicionada só com o intuito de demostração
                            </Alert>
                        </div>
                        <div className="col-6">
                            <Msg/>
                        </div>

                        <div className="col-6">
                           <Diciplina />
                        </div>
                       
                    </div>

                    <hr/>  
                    <div className="row">
                        <div className="col-12">
                            <Equipamento />
                        </div>
                    </div>

                </div>
                

                
       
            </div>
        )
    }
}

export default Config;