import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import './Ticket.css';

function getTierLevel(employee) {
    if (!employee) {
        return 1;
    }

    const byAuth = Number(employee.auth ?? employee.access_level ?? NaN);
    if (!Number.isNaN(byAuth) && byAuth > 0) {
        return byAuth;
    }

    const title = String(employee.title ?? '').toLowerCase();
    if (title.includes('tier 3')) {
        return 3;
    }
    if (title.includes('tier 2')) {
        return 2;
    }
    return 1;
}

function Ticket(props) {
    const handleInspect = () => {
        if (props.onInspect) {
            props.onInspect(props.id);
        }
    };

    const [msg, setMsg] = useState('');
    const [isAssignMenuOpen, setIsAssignMenuOpen] = useState(false);
    const [assignedTo, setAssignedTo] = useState(props.assignedTo || 'Unassigned');
    const [selectedAssignee, setSelectedAssignee] = useState(props.assignedTo || '');

    useEffect(() => {
        const nextAssigned = props.assignedTo || 'Unassigned';
        setAssignedTo(nextAssigned);
        setSelectedAssignee(props.assignedTo || '');
    }, [props.assignedTo]);

    const assigneeOptions = useMemo(() => {
        const myTier = getTierLevel(props.user);
        const selfName = props.user?.name;

        if (myTier <= 1) {
            return selfName ? [selfName] : [];
        }

        const directory = Array.isArray(props.assigneeDirectory) ? props.assigneeDirectory : [];
        let allowed;

        if (myTier >= 3) {
            allowed = directory;
        } else {
            allowed = directory.filter((employee) => getTierLevel(employee) === 1);
        }

        const names = allowed
            .map((employee) => employee?.ename || employee?.name)
            .filter(Boolean);

        if (myTier === 2 && selfName) {
            return names.filter((name) => name !== selfName)
                .filter((value, index, arr) => arr.indexOf(value) === index);
        }

        const fallback = [selfName, ...(props.user?.employees || [])]
            .filter(Boolean)
            .filter((value, index, arr) => arr.indexOf(value) === index);

        const uniqueNames = names.filter((value, index, arr) => arr.indexOf(value) === index);
        return uniqueNames.length ? uniqueNames : fallback;
    }, [props.assigneeDirectory, props.user]);

    const handleAssign = (event) => {
        event.preventDefault();
        if (!selectedAssignee) {
            setMsg('Please choose a team member first.');
            return;
        }

        setAssignedTo(selectedAssignee);
        setMsg(`${props.id} assigned to ${selectedAssignee}`);
        setIsAssignMenuOpen(false);
    };

    const handleSelfAssign = (event) => {
        const selfName = props.user.name;
        setAssignedTo(selfName);
        setSelectedAssignee(selfName);
        setMsg(event.target.id + ' assigned to ' + selfName);
    };

    const handleDrop = () => {
        setAssignedTo('Unassigned');
        setSelectedAssignee('');
        setMsg(`${props.id} unassigned`);
    };

    useEffect(() => {
        console.log(msg);
    }, [msg]);

    let items;
    if (props.keywords) {
        items = <li key={props.keywords}>{props.keywords}</li>
    }

    return (
        <div className='TaskView'>
            <div className='TaskInfo'>
                <h3 className='TaskTitle'>
                    <button type='button' className='InspectLink' onClick={handleInspect}>
                        {props.title}
                    </button>
                </h3>
                <p className='TaskDescription'>
                    {props.desc}
                </p>
                <p className='AssignedToText'>
                    <span>Assigned To:</span> {assignedTo}
                </p>
            </div>
            <div>
                <h4>
                    Category:
                </h4>
                <ul className='TaskTags'>
                    {items ? items:"Error"}
                </ul>
            </div>
            <div className='TaskBtns'>
                {props.user.auth > 1 ? (
                    <>
                        <button type='button' onClick={() => setIsAssignMenuOpen((open) => !open)} className='AssignBtn'>
                            Assign To
                        </button>
                        {isAssignMenuOpen && (
                            <form onSubmit={handleAssign} className='AssignFormMenu' id={props.id}>
                                <select
                                    className='AssignSelect'
                                    name='assignee'
                                    value={selectedAssignee}
                                    onChange={(event) => setSelectedAssignee(event.target.value)}
                                >
                                    <option value=''>Select team member</option>
                                    {assigneeOptions.map((assignee) => (
                                        <option key={assignee} value={assignee}>{assignee}</option>
                                    ))}
                                </select>
                                <div className='AssignMenuBtns'>
                                    <button type='submit' className='AssignBtn' disabled={!selectedAssignee}>Save</button>
                                    <button type='button' className='AssignBtn' onClick={() => setIsAssignMenuOpen(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <button onClick={handleSelfAssign} className='AssignBtn' id={props.id}>
                        Assign Self
                    </button>
                )}
                <button onClick={handleDrop} className='AssignBtn' type='button'>
                    Drop
                </button>
            </div>
        </div>
    )
}

export default Ticket