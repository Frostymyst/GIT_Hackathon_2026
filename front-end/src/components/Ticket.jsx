// eslint-disable-next-line no-unused-vars
import { useState } from 'react';
import React from 'react';
import './Ticket.css';

function Ticket(props) {
    let items;
    if (props.keywords != false) {
        items = props.keywords.map(e => <li>{e}</li>)
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
        </div>
    )
}

export default Ticket