import React, { useEffect, useState } from 'react'
import { listarReservas, socket } from '../Service'
import moment from 'moment'


const Lab = React.memo(({ lab }) =>{
    const [dados, setDados ] = useState(null)
    const [last_update_, setLastUpdate] = useState(moment().format('HH:mm'))

    useEffect(() =>{
        loadAulas()
        socket.on('AtualizacaoReservas', () =>{
            loadAulas()
        })
        socket.on('AtualizacaoDiciplinas', () =>{
            loadAulas()
        })

        var last_update = moment().format('HH:mm')

        setInterval(() =>{
            let now = moment().format('HH:mm')
            //console.log({now, last_update, id : lab.id_lab})
    
            if(last_update !== now){
                loadAulas()
                last_update = now
            }
    
        }, 1000)

    }, [])

    

    function loadAulas(){
        const date = moment().format('YYYY-MM-DD')
        console.log(lab)

        let payload = {
            id_lab : lab.id_lab,
            data : date
        }

        listarReservas(payload , (data)=>{
            try{
                const dados = data.dados
                var saida = {}
                dados.map(element =>{
                    console.log(element)
                    let is_antes, is_depois
                    is_antes = moment().isAfter(date + ' ' + element.hora_inicio)
                    is_depois = moment().isBefore(date + ' ' + element.hora_fim)

                    if(is_antes && is_depois){
                        saida.atual = element
                    }

                    is_antes = moment().add({minutes : 30}).isAfter(date + ' ' + element.hora_inicio)
                    is_depois = moment().add({minutes : 30}).isBefore(date + ' ' + element.hora_fim)

                    if(is_antes && is_depois){
                        saida.next1 = element
                    }

                    is_antes = moment().add({minutes : 60}).isAfter(date + ' ' + element.hora_inicio)
                    is_depois = moment().add({minutes : 60}).isBefore(date + ' ' + element.hora_fim)

                    if(is_antes && is_depois){
                        saida.next2 = element
                    }

                    is_antes = moment().add({minutes : 90}).isAfter(date + ' ' + element.hora_inicio)
                    is_depois = moment().add({minutes : 90}).isBefore(date + ' ' + element.hora_fim)

                    if(is_antes && is_depois){
                        saida.next3 = element
                    }


                })
                console.log(saida)
                setDados(saida)
            }catch(e){
                console.error(e)
            }
           



            //setDados(dados)
        });
    }


    return(
        <div className="col-2 p-1 mt-3">
            <div className="laboratorio">
                <div className="header font-weight-bold text-muted">
                    <span className="float-right">{dados?.atual?.hora_inicio}</span>
                    <span>{lab.local}</span>
                </div>
                
                {dados !== null &&
                    <>
                        {dados.atual && 
                        <div className="shadow fundo" style={{backgroundColor : dados.atual.color !== null ? dados.atual.color : '#343a40' }}>
                            <i className="icon-screen-desktop icons" />
                            <span className="mt-2" style={{textAlign : 'center'}}>{dados.atual.materia === null ? 'Trancado' : dados.atual.materia}</span>
                        </div>
                        }

                        {!dados.atual &&
                             <div className="shadow fundo" style={{backgroundColor : '#343a40' }}>
                                <i className="icon-screen-desktop icons" />
                                <span className="mt-2" style={{textAlign : 'center'}}>Trancado</span>
                            </div>
                        }
                        <div className="proximas">
                            <ul>
                                {dados.next1 && 
                                <li className="shadow" style={{backgroundColor : dados.next1.color !== null ? dados.next1.color : '#343a40' }}>
                                    <span>{dados.next1.hora_inicio.split(':')[0] + ':' + dados.next1.hora_inicio.split(':')[1]}</span>
                                    <span className="float-right materia pl-1">{dados.next1.materia === null ? 'Trancado' : dados.next1.materia}</span>
                                </li>
                                }
                                {dados.next2 && 
                                <li className="shadow" style={{backgroundColor : dados.next2.color !== null ? dados.next2.color : '#343a40' }}>
                                    <span>{dados.next2.hora_inicio.split(':')[0] + ':' + dados.next2.hora_inicio.split(':')[1]}</span>
                                    <span className="float-right materia pl-1">{dados.next2.materia === null ? 'Trancado' : dados.next2.materia}</span>
                                    
                                    
                                </li>
                                }
                                {dados.next3 && 
                                <li className="shadow" style={{backgroundColor : dados.next3?.color !== null ? dados.next3.color : '#343a40' }}>
                                <   span>{dados.next3.hora_inicio.split(':')[0] + ':' + dados.next3.hora_inicio.split(':')[1]}</span>
                                    <span className="float-right materia pl-1">{dados.next3.materia === null ? 'Trancado' : dados.next3.materia}</span>
                                    
                                    
                                </li>
                                }
                            </ul>
                        </div>
                    </>
                }
               
                
            </div>
        </div>

    )
    
})

export default Lab;