import React from 'react'
import TopBar from './../Teamplate/TopBar'

import Calendario from './../Calendario/calendario'
import EditarReserva from './EditarReserva'
import { socket,  listarReservas } from './../Service'

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

class Laboratorio extends React.Component{
    constructor(props){
        super(props)
        this.modal1 = React.createRef();
        let id_lab = this.props.match.params.id
        this.state = { reservas : [], id_lab : id_lab, modal : false, infoLab : {}}
        this.toggle = this.toggle.bind(this);
        this.sobreReserva = this.sobreReserva.bind(this)

        
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    componentDidMount(){
        this.loadReservas()

        socket.on('AtualizacaoReservas', ()=>{
            this.setState({reservas : []}, ()=>{
                this.loadReservas()
            })
            
        })
    }

    loadReservas = () =>{

        let dias = []
    
        for(let i = 0; i <= 6; i++ ){
            let date = moment().day(i);
            dias.push(moment(date).format('YYYY-MM-DD'))
        }

        dias.forEach(element =>{
            this.loadData(element);
        })
        
    }

    loadData = (dia) =>{
        let data = {
            id_lab : this.state.id_lab,
            data : dia
        }
        console.log('Dados', data)
        listarReservas(data , (data)=>{
            console.log('Reservas' , data)
            let saida = []
            let data_ = null;

            data.dados.forEach(element => {
                let push = null;
                if(true){
                    if(data_ === null){
                        console.log(element.data_reserva);
                        data_ = dia
                    }
                    
                    if(element.materia === null){
                        push = {
                            raw : { id_lab_horario : element.id_lab_horario, id_reserva : element.id_reserva  },
                            title: 'Trancado',
                            bgColor : '#f3f8ff',
                            category: 'time',
                            dueDateClass: '',
                            start: data_ + ' ' + element.hora_inicio,
                            end: data_ + ' ' + element.hora_fim,
                            isReadOnly: true
                        }
                    }else{
                        push = {
                            raw : { id_lab_horario : element.id_lab_horario, id_reserva : element.id_reserva },
                            bgColor : element.color,
                            title: element.materia,
                            category: 'time',
                            dueDateClass: '',
                            start: data_ + ' ' + element.hora_inicio,
                            end: data_ + ' ' + element.hora_fim,
                            isReadOnly: true
                            
                        }

                    }

                    saida.push(push)
                }


            });
            //console.log('Saida', this.state.reservas)
            this.setState({reservas : [...this.state.reservas, ...saida]})
        })

    }


    sobreReserva = (item) =>{
        let { id_lab } = this.state
        let { raw } = item.schedule
        //console.log(item.schedule.start.getTime())
        //console.log(item.schedule.end.getTime())
        let a = item.schedule.start.getTime()
        let b = item.schedule.end.getTime()
        
        //this.setState({infoLab : { titulo, hora_inicio, hora_fim} })
        console.log(item.schedule)
        let dados = {
            inicio : moment(a).format(),
            fim : moment(b).format(),
            id_lab,
            id_lab_horario : raw.id_lab_horario,
            id_reserva : raw.id_reserva
        }
        this.clickReserva(dados);
        
        

    }

    clickReserva = (dados) =>{
        this.modal1.current.display(dados);
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
                        <div className="col-12">
                            {this.state.reservas.length > 0 &&
                                <Calendario click={(item) => {this.sobreReserva(item)} } reservas={this.state.reservas} />
                            }
                            
                        </div>
                    </div>
                        <EditarReserva ref={this.modal1} />
                </div>
            </div>
        )
    }
}

export default Laboratorio;