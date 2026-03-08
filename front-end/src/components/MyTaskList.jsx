import { useEffect, useState } from 'react';
import Header from './Header';
import './MainList.css';
import Ticket from './Ticket';
import { getTasksByEmployee } from '../api/taskApi';

function MyTaskList({ user, onNavigate, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [allMyTasks, setAllMyTasks] = useState([]);
  const [ids, setIds] = useState([]);
  const [tags, setTags] = useState([]);
  const [employeeDirectory, setEmployeeDirectory] = useState([]);

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

  const handleSort = (event) => {
    const selectedCategory = String(event.target.id || '').toLowerCase();
    const filtered = allMyTasks.filter((task) =>
      String(task?.categories || '').toLowerCase() === selectedCategory
    );
    setTasks(filtered);
    setIds(filtered.map((task) => (
      <option key={`my-task-id-${task.tno}`} value={String(task.tno)}>{task.tno}</option>
    )));
  };

  useEffect(() => {
    async function loadMyTasks() {
      try {
        const response = await getTasksByEmployee(user?.id);
        const rows = Array.isArray(response?.tasks) ? response.tasks : [];
        setAllMyTasks(rows);
        setTasks(rows);
        setIds(rows.map((task) => (
          <option key={`my-task-id-${task.tno}`} value={String(task.tno)}>{task.tno}</option>
        )));
      } catch {
        setAllMyTasks([]);
        setTasks([]);
        setIds([]);
      }
    }

    loadMyTasks();

    const cate = new XMLHttpRequest();
    cate.onload = () => {
      const cateResp = JSON.parse(cate.responseText).categories;
      setTags(cateResp.map((category) => (
        <li id={category.cname} key={category.cname} onClick={handleSort}>{category.cname}</li>
      )));
    };
    cate.open('GET', 'http://127.0.0.1:8000/admin/categories');
    cate.send();

    const employeesReq = new XMLHttpRequest();
    employeesReq.onload = () => {
      const employeesResp = JSON.parse(employeesReq.responseText).employees;
      setEmployeeDirectory(Array.isArray(employeesResp) ? employeesResp : []);
    };
    employeesReq.open('GET', 'http://127.0.0.1:8000/employee/search?query=');
    employeesReq.send();
  }, [user?.id]);

  return (
    <>
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="my-tasks" />
      <section className="list-page-hero">
        <p className="list-page-eyebrow">My Work Queue</p>
        <h1 className="list-page-title">My Task List</h1>
        <p className="list-page-subtitle">Tasks currently assigned to you.</p>
      </section>

      <table id="Layout">
        <tbody>
          <tr>
            <td id="SearchDiv">
              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <label>
                  <h4>Search for a Specific Ticket</h4>
                </label>
                <input type="search" name="search" id="TicketSearch" list="tickets" placeholder="Enter a Ticket Number or Name" />
                <datalist id="tickets">{ids}</datalist>
              </form>
            </td>
            <td id="TagDiv">
              <div id="Tags">
                <h4>Filter by Tags/Keywords:</h4>
                <ul id="TagList">{tags}</ul>
              </div>
              <div id="CreateDiv">
                <button id="CreateBtn" type="button" onClick={() => onNavigate && onNavigate('create-task')}>
                  Create Task
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {tasks.length === 0 && (
        <p className="list-empty-message">No tasks are currently assigned to you.</p>
      )}

      {tasks.map((task) => (
        <Ticket
          key={task.tno}
          user={user}
          title={task.name}
          desc={task.summary}
          keywords={task.categories}
          id={task.tno}
          assignedTo={getAssignedToLabel(task)}
          assigneeDirectory={employeeDirectory}
          onInspect={(taskId) => onNavigate && onNavigate('task-detail', { taskId })}
        />
      ))}
    </>
  );
}

export default MyTaskList;
