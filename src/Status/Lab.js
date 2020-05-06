import React from 'react'

class Lab extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="col-2">
                <div className="laboratorio">
                    <div className="header">
                        <span className="float-right">18:00</span>
                        <span>{this.props.lab.local}</span>
                    </div>
                    
                    <div className="fundo shadow">
                        <i className="icon-screen-desktop icons" />
                        <span>Livre</span>
                    </div>

                    <div className="proximas">
                        
                        <ul>
                            <li className="shadow">
                                <span className="float-right">Livre</span>
                                <span>18:00</span>
                                
                            </li>
                            <li className="shadow">
                                <span className="float-right">Livre</span>
                                <span>18:30</span>
                                
                            </li>
                            <li className="shadow">
                                <span className="float-right">Livre</span>
                                <span>19:00</span>
                                
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
    
        )
    }
}

export default Lab;