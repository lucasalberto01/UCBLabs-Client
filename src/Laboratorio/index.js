import React from 'react'
import { Card, CardHeader, CardBody, Input, Label} from 'reactstrap';
import TopBar from '../Teamplate/TopBar'

import { socket, listarReservas, getDadosLab, listarEquipamentos } from './../Service'

import EditarReserva from './EditarReserva'
import Transferir from './Transferir'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

class Laboratorio extends React.Component{
    constructor(props){
        super(props)
        this.EditarReserva = React.createRef();
        this.Transferir = React.createRef();
        this.state = {
            dia : moment().format('YYYY-MM-DD'),
            id_lab : this.props.match.params.id,
            dados : [],
            lab_info : {},
            lab_equipamentos : []
        }
    }

    componentDidMount(){
        const id_lab = this.props.match.params.id;

        socket.on('AtualizacaoReservas', ()=>{
            this.setState({dados : []}, ()=>{
                this.loadReservas()
            })
            
        })

        getDadosLab(id_lab, data =>{
            this.setState({lab_info : data.informacoes})
        })

        listarEquipamentos({ id_lab }, data =>{
            this.setState({lab_equipamentos : data })
        })

        this.loadReservas()
    }

    onChanger = ({target}) =>{
        let dia = target.value 
        this.setState({dados : [], dia }, ()=>{
            this.loadReservas()
        })

    }

    loadReservas = () =>{
        let { id_lab, dia} = this.state
        let payload = {
            id_lab,
            data : dia
        }

        listarReservas(payload , (data)=>{
            console.log(data)
            this.setState({dados : data.dados})
        });
    }

    onEdit = (id_reserva, id_lab, id_lab_horario, dia, hora_inicio, hora_fim, materia) =>{
        this.EditarReserva.current.display(id_reserva, id_lab, id_lab_horario, dia, hora_inicio, hora_fim, materia);
    }

    onTransferir = (id_reserva) =>{
        this.Transferir.current.onDisplay(id_reserva)
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
                                        <li className="breadcrumb-item">Laboratorio</li>
                                    </ol>
                                </div>
                                <h4 className="page-title">Laboratorio</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <Card>
                                <CardHeader>Reservas</CardHeader>
                                <CardBody>
                                    <Label>Selecione um dia para carregar as aulas</Label>
                                    <Input value={this.state.dia} onChange={this.onChanger} type="date"/>
                            
                                    {this.state.dados.length > 0 &&
                                        <div className="mt-4 bg-white rounded">
                                            <h4 className="border-bottom border-gray pb-2 mb-0">Aulas - {moment(this.state.dia, 'YYYY-MM-DD').format('DD/MM/YYYY')}</h4>
                                            <div className="row">
                                            {this.state.dados.map((element, index) =>(
                                                <div className="media text-muted pt-3 col-4" key={index}>
                                                    <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={element.color === null ? "#CCC" : element.color} /><text x="50%" y="50%" fill={element.color === null ? "#CCC" : element.color} dy=".3em">32x32</text></svg>

                                                    <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                        <strong className="text-gray-dark">{element.hora_inicio} - {element.hora_fim}</strong>
                                                            <a
                                                                href="#" 
                                                                onClick={() => this.onEdit(element.id_reserva, element.id_lab, element.id_lab_horario, this.state.dia, element.hora_inicio, element.hora_fim, element.materia)} 
                                                            >Editar</a>
                                                        </div>
                                                        <span className="d-block"> {element.materia === null ? 'Trancada' : element.materia }</span>
                                                    </div>
                                                </div> 
                                            ))}
                                            </div>
                                                                                
                                        </div>
                                    }
                                    

                                </CardBody>                      
                            </Card>
                            
                        </div>
                        <div className="col-4">
                            <Card>
                                <CardHeader>Informações</CardHeader>
                                <CardBody>
                                    <div>
                                        <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                                            <h3>{this.state.lab_info.local}</h3>
                                            
                                        </div>
                                        
                                        <span>Capacidade : {this.state.lab_info.capacidade}</span><br/>
                                        <span>{this.state.lab_info.lab_tipo_nome}</span><br/>
                                        <small  className="text-muted font-10">{this.state.lab_info.lab_tipo_descricao}</small><br/><br/>
                                        <span>Descrição: </span><br/>
                                        <small>{this.state.lab_info.descricao}</small>
                                    </div>
                                    <br/>
                                    <div style={{display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                                        <h5>Equipamentos Disponiveis:</h5>
                                       
                                    </div>
                                    
                                    {this.state.lab_equipamentos.map((element, key) =>(
                                        <div key={key} style={{display : 'flex', backgroundColor : '#313131', padding : 8, justifyContent : 'space-between', borderRadius : 3, marginBottom : 5}}>
                                            <span style={{color : '#eee'}}>{element.nome}</span>
                                            
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>

                        </div>
                    </div>
                        
                </div>
                <EditarReserva onTransferir={this.onTransferir} ref={this.EditarReserva} />
                <Transferir ref={this.Transferir} />
            </div>
        )
    }
}

export default Laboratorio