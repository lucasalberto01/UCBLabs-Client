import React from 'react'
import TopBar from './../Teamplate/TopBar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Relatorio extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selecionar_dados : true,
            data_inicio : null,
            data_fim  : null
        }
    }

    continuar = () =>{
        this.setState({selecionar_dados : false})
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
                                    {!this.state.selecionar_dados &&
                                        <button className="btn btn-info"><i className="icon-printer icons"> </i>Imprimir</button>
                                    }
                                    
                                </div>
                                <h4 className="page-title">Relatorios</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.selecionar_dados &&
                            <div className="col-12">
                            <div style={{justifyContent: 'center', display: 'flex'}}>
                            <div className="card" style={{width: 500}}>
                                    <div className="card-header">
                                        Dados
                                    </div>
                                    <div class="card-body">
                                        <form>
                                            <div class="form-group">
                                                <label>Tipo de Relatio</label>
                                                <select class="form-control">
                                                    <option value="1">Listar Novas Reservas</option>
                                                    <option value="2">Listar Pedidos Cancelados</option>
                                                </select>
                                            </div> 
                                            <div className="form-group">
                                                 <label>De</label>
                                                 <DatePicker
                                                    locale="pt"
                                                    className={'form-control'}
                                                    placeholderText="Selecione"
                                                    selected={this.state.data_inicio}
                                                    onChange={(date)=>this.setState({data_inicio : date})}
                                                    showTimeSelect
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                />

                                            </div>
                                            <div className="form-group">
                                                    <label>Até</label> 
                                                    <DatePicker
                                                    locale="pt"
                                                    className={'form-control'}
                                                    placeholderText="Selecione"
                                                    startDate={this.state.data_inicio}
                                                    selected={this.state.data_fim}
                                                    onChange={(date)=>this.setState({data_fim : date})}
                                                    showTimeSelect
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <button onClick={this.continuar} className="btn btn-info btn-block">Continuar</button>
                                            </div>
                                        </form>
                                    </div>
                            </div>
                           </div>
                        </div>
                        }

                    {!this.state.selecionar_dados &&
                        <div className="col-12">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Disciplina</th>
                                    <th scope="col">Responsavel</th>
                                    <th scope="col">Data Reserva</th>
                                    <th scope="col">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Programação web</td>
                                        <td>Usuario 1</td>
                                        <td>10/10/2019</td>
                                        <td>05/10/2019</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Algoritmo</td>
                                        <td>Usuario 1</td>
                                        <td>01/11/2019</td>
                                        <td>05/11/2019</td>
                                    </tr>
                                                                     
                                </tbody>
                            </table>

                        </div>
                    }
                    </div>
                        
                </div>
            </div>
        )
    }
}

export default Relatorio;