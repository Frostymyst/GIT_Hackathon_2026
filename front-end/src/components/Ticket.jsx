import { useState, useEffect } from 'react';
import React from 'react';
import './Ticket.css';

function Ticket(props) {
    let [msg, setMsg] = useState("")

    const handleAssign = (event) => {
        event.preventDefault();
        const selected = new FormData(event.target);
        setMsg(event.target.id + " assigned to " + [...selected.values()]);
    }

    const handleSelfAssign = (event) => {
        setMsg(event.target.id + " assigned to " + props.user.name);
    }

    useEffect(() => {
        console.log(msg);
    }, [msg]);

    let items;
    if (props.keywords != false) {
        items = props.keywords.map(e => <li key={e}>{e}</li>)
    }
    let btns;
    if (props.user.auth > 1) {
        btns = props.user.employees.map(e => <option key={e} value={e}>{e}</option>)
    }

    return (
            <div className='TaskView'>
            <div>
                <h3>
                    {props.title}
                </h3>
                <p className='TaskDescription'>
                    {props.desc}
                </p>
            </div>
            <div>
                <h4>
                    Tags/Keywords:
                </h4>
                <ul className='TaskTags'>
                    {items ? items:"Error"}
                </ul>
            </div>
            <div className='TaskBtns'>
                {btns ? 
                <form onSubmit={handleAssign} className='AssignForm' id={props.id}>
                    <button type='submit' className='AssignBtn'>Assign To</button>
                    <select className='AssignSelect' name={props.id} multiple={true}>
                        <option key={props.user.id} value={props.user.name}>{props.user.name}</option>
                        {btns}
                    </select>
                </form>
                :
                <button onClick={handleSelfAssign} className='AssignBtn' id={props.id}>
                    Assign Self
                </button>}
                <button onClick={handleSelfAssign} className='AssignBtn' id={props.id}>
                    Drop
                </button>
            </div>
            </div>
    )
}

export default Ticket