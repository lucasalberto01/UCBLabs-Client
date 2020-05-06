import React from 'react'
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-BR');

class Calendario extends React.Component{
    calendarRef = React.createRef();

    constructor(pros){
        super(pros)
        let reservas = this.props.reservas === undefined ? [] : this.props.reservas;
        this.state = { reservas : reservas, i : 0}
        
        
    }

    componentDidMount(){
        setInterval(()=>{
            //this.setState({i : this.state.i++})
        }, 1000)
    }

    UNSAFE_componentWillReceiveProps(props){
        var reservas = props.reservas;
        this.setState({reservas})
        //console.log('TESINHO', props.reservas)
    }


    render(){
        return(
            <div>
                 <Calendar
                        ref={this.calendarRef}
                        view={'week'}
                        
                        taskView={false}
                        week={{
                            startDayOfWeek: 1,
                            daynames : ['Dom.','Seg.','Terç.','Qua.','Qui.','Sex.','Sáb.'],
                            narrowWeekend: true
                        }}
                        
                        onClickSchedule={(event) =>this.props.click(event)}
                        isReadOnly={true}
                        schedules={this.state.reservas}
                        template={{
                            time(e){
                                return '<div class="item calendario" >' + e.title + '</div>'
                            }
                        }}
                    />
            </div>
        )
    }
}

export default Calendario;