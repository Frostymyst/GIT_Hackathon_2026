import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import { assignTask } from '../api/taskApi';
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

    const [isAssignMenuOpen, setIsAssignMenuOpen] = useState(false);
    const [assignedTo, setAssignedTo] = useState(props.assignedTo || 'Unassigned');
    const [selectedAssigneeId, setSelectedAssigneeId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const nextAssigned = props.assignedTo || 'Unassigned';
        setAssignedTo(nextAssigned);
        setSelectedAssigneeId(props.assignedToId ? String(props.assignedToId) : '');
    }, [props.assignedTo, props.assignedToId]);

    const assigneeOptions = useMemo(() => {
        const myTier = getTierLevel(props.user);
        const selfId = props.user?.id;
        const selfName = props.user?.name || 'Me';

        const normalizeOption = (employee) => {
            const id = employee?.eno ?? employee?.id;
            const name = employee?.ename || employee?.name;
            if (id === undefined || id === null || !name) {
                return null;
            }
            return {
                id: String(id),
                name,
                tier: getTierLevel(employee),
            };
        };

        if (myTier <= 1) {
            return selfId ? [{ id: String(selfId), name: selfName, tier: 1 }] : [];
        }

        const directory = Array.isArray(props.assigneeDirectory) ? props.assigneeDirectory : [];
        const normalizedDirectory = directory.map(normalizeOption).filter(Boolean);
        let allowed = [];

        if (myTier >= 3) {
            allowed = normalizedDirectory;
        } else {
            allowed = normalizedDirectory.filter((employee) => employee.tier === 1);
        }

        if (myTier === 2 && selfId) {
            allowed = allowed.filter((employee) => employee.id !== String(selfId));
        }

        const fallback = selfId
            ? [{ id: String(selfId), name: selfName, tier: myTier }]
            : [];

        const unique = allowed.filter((employee, index, arr) =>
            arr.findIndex((candidate) => candidate.id === employee.id) === index
        );

        return unique.length ? unique : fallback;
    }, [props.assigneeDirectory, props.user]);

    const handleAssign = async (event) => {
        event.preventDefault();
        if (!selectedAssigneeId) {
            return;
        }

        setIsAssigning(true);
        try {
            await assignTask(props.id, Number(selectedAssigneeId));
            const selectedOption = assigneeOptions.find((option) => option.id === selectedAssigneeId);
            const selectedName = selectedOption?.name || `Employee #${selectedAssigneeId}`;
            setAssignedTo(selectedName);
            setIsAssignMenuOpen(false);

            if (props.onAssignmentUpdated) {
                props.onAssignmentUpdated(props.id, Number(selectedAssigneeId), selectedName);
            }
        } catch (error) {
            console.error(error.message || 'Unable to assign task.');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleSelfAssign = async (event) => {
        const selfName = props.user.name;
        const selfId = props.user.id;

        setIsAssigning(true);
        try {
            await assignTask(props.id, Number(selfId));
            setAssignedTo(selfName);
            setSelectedAssigneeId(String(selfId));

            if (props.onAssignmentUpdated) {
                props.onAssignmentUpdated(props.id, Number(selfId), selfName);
            }
        } catch (error) {
            console.error(error.message || 'Unable to self-assign task.');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleDrop = async () => {
        setIsAssigning(true);
        try {
            await assignTask(props.id, null);
            setAssignedTo('Unassigned');
            setSelectedAssigneeId('');

            if (props.onAssignmentUpdated) {
                props.onAssignmentUpdated(props.id, null, 'Unassigned');
            }
        } catch (error) {
            console.error(error.message || 'Unable to unassign task.');
        } finally {
            setIsAssigning(false);
        }
    };

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
                                    value={selectedAssigneeId}
                                    onChange={(event) => setSelectedAssigneeId(event.target.value)}
                                    disabled={isAssigning}
                                >
                                    <option value=''>Select team member</option>
                                    {assigneeOptions.map((assignee) => (
                                        <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                                    ))}
                                </select>
                                <div className='AssignMenuBtns'>
                                    <button type='submit' className='AssignBtn' disabled={!selectedAssigneeId || isAssigning}>Save</button>
                                    <button type='button' className='AssignBtn' onClick={() => setIsAssignMenuOpen(false)} disabled={isAssigning}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <button onClick={handleSelfAssign} className='AssignBtn' id={props.id} disabled={isAssigning}>
                        Assign Self
                    </button>
                )}
                <button onClick={handleDrop} className='AssignBtn' type='button' disabled={isAssigning}>
                    Drop
                </button>
            </div>
        </div>
    )
}

export default Ticket