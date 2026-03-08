import { useEffect, useState } from 'react';
import Header from './Header'
import './MainList.css'
import Ticket from './Ticket';
import { API_BASE_URL } from '../api/httpClient';


function MainList({ user, onNavigate, onLogout }) {
    let [tasks, setTasks] = useState([]); 
    let [allTasks, setAllTasks] = useState([]);
    let [ids, setIds] = useState([]); 
    let [categories, setCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState('');
    let [employeeDirectory, setEmployeeDirectory] = useState([]);

    const isCompletedTask = (task) => String(task?.status || '').trim().toLowerCase() === 'completed';

    const getAssignedToLabel = (task) => {
        const assignedId = task?.assigned_to ?? task?.assignedTo ?? task?.eno;
        if (!assignedId) {
            return 'Unassigned';
        }

        const matched = employeeDirectory.find((employee) => {
            const employeeId = employee?.eno ?? employee?.id;
            return String(employeeId) === String(assignedId);
        });

        if (!matched) {
            return `Employee #${assignedId}`;
        }

        return matched.ename || matched.name || `Employee #${assignedId}`;
    };

    const setVisibleTasks = (rows) => {
        const visibleRows = (rows || []).filter((task) => !isCompletedTask(task));
        setTasks(visibleRows);
        setIds(visibleRows.map((task) => (
            <option key={`task-id-${task.tno}`} value={String(task.tno)}>{task.tno}</option>
        )));
    };

    const handleSort = (categoryName) => {
        const normalized = String(categoryName || '').trim().toLowerCase();

        if (selectedCategory.toLowerCase() === normalized) {
            setSelectedCategory('');
            setVisibleTasks(allTasks);
            return;
        }

        const filtered = allTasks.filter((task) =>
            String(task?.categories || '').trim().toLowerCase() === normalized
        );

        setSelectedCategory(categoryName);
        setVisibleTasks(filtered);
    }

    useEffect(() => {
        // Fetch tasks
        const req = new XMLHttpRequest();
        req.onload = () => {
            const taskResp = JSON.parse(req.responseText).tasks;
            const rows = taskResp || [];
            setAllTasks(rows);
            setVisibleTasks(rows);
        };
        req.open("GET", "${API_BASE_URL}/task");
        req.send();

        // Fetch categories
        const cate = new XMLHttpRequest();
        cate.onload = () => {
            const cateResp = JSON.parse(cate.responseText).categories;
            setCategories(Array.isArray(cateResp) ? cateResp : []);
        };
        cate.open("GET", "${API_BASE_URL}/admin/categories");
        cate.send();

        // Fetch employee directory for assignment rules
        const employeesReq = new XMLHttpRequest();
        employeesReq.onload = () => {
            const employeesResp = JSON.parse(employeesReq.responseText).employees;
            setEmployeeDirectory(Array.isArray(employeesResp) ? employeesResp : []);
        };
        employeesReq.open("GET", "${API_BASE_URL}/employee/search?query=");
        employeesReq.send();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setVisibleTasks(allTasks);
            return;
        }

        const normalized = selectedCategory.trim().toLowerCase();
        const filtered = allTasks.filter((task) =>
            String(task?.categories || '').trim().toLowerCase() === normalized
        );
        setVisibleTasks(filtered);
    }, [allTasks, selectedCategory]);

  return (
    <>
                <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="main" />
    <table id='Layout'>
        <tbody>
            <tr>
                <td id='SearchDiv'>
                    <form role='search' onSubmit={(e) => {
                        e.preventDefault()
                        console.log(e.target.childNodes[1].value)
                    }}>
                        <label>
                            <h4>
                                Search for a Specific Ticket
                            </h4>
                        </label>
                        <input type='search' name='search' id='TicketSearch' list='tickets' placeholder='Enter a Ticket Number or Name'/> 
                        <datalist id='tickets'>
                            {ids}
                        </datalist>
                    </form>
                </td>
                <td id='TagDiv'>
                    <div id='Tags'>
                        <h4>
                            Filter by Tags/Keywords:
                        </h4>
                        <ul id='TagList'>
                            {categories.map((category) => {
                                const isActive = selectedCategory.toLowerCase() === String(category.cname || '').toLowerCase();
                                return (
                                    <li
                                        id={category.cname}
                                        key={category.cname}
                                        className={isActive ? 'TagItem is-active' : 'TagItem'}
                                        onClick={() => handleSort(category.cname)}
                                    >
                                        {category.cname}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div id='CreateDiv'>
                        <button id='CreateBtn' type='button' onClick={() => onNavigate && onNavigate('create-task')}>
                            Create Task
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
        {tasks.map((task) => (
            <Ticket
                key={task.tno}
                user={user}
                title={task.name}
                desc={task.summary}
                keywords={task.categories}
                id={task.tno}
                assignedTo={getAssignedToLabel(task)}
                assignedToId={task?.assigned_to ?? null}
                assigneeDirectory={employeeDirectory}
                onAssignmentUpdated={(taskId, employeeId) => {
                    setTasks((prev) => prev.map((row) =>
                        String(row.tno) === String(taskId)
                            ? { ...row, assigned_to: employeeId }
                            : row
                    ));
                }}
                onInspect={(taskId) => onNavigate && onNavigate('task-detail', { taskId })}
            />
        ))}
    </>
  )
}

export default MainList