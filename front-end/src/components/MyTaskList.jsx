import { useEffect, useState } from 'react';
import Header from './Header';
import './MainList.css';
import Ticket from './Ticket';
import { getTasksByEmployee } from '../api/taskApi';
import { API_BASE_URL } from '../api/httpClient';

function MyTaskList({ user, onNavigate, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [allMyTasks, setAllMyTasks] = useState([]);
  const [ids, setIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [employeeDirectory, setEmployeeDirectory] = useState([]);

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
      <option key={`my-task-id-${task.tno}`} value={String(task.tno)}>{task.tno}</option>
    )));
  };

  const handleSort = (categoryName) => {
    const normalized = String(categoryName || '').trim().toLowerCase();

    if (selectedCategory.toLowerCase() === normalized) {
      setSelectedCategory('');
      setVisibleTasks(allMyTasks);
      return;
    }

    const filtered = allMyTasks.filter((task) =>
      String(task?.categories || '').trim().toLowerCase() === normalized
    );

    setSelectedCategory(categoryName);
    setVisibleTasks(filtered);
  };

  useEffect(() => {
    async function loadMyTasks() {
      try {
        const response = await getTasksByEmployee(user?.id);
        const rows = Array.isArray(response?.tasks) ? response.tasks : [];
        setAllMyTasks(rows);
        setVisibleTasks(rows);
      } catch {
        setAllMyTasks([]);
        setVisibleTasks([]);
      }
    }

    loadMyTasks();

    const cate = new XMLHttpRequest();
    cate.onload = () => {
      const cateResp = JSON.parse(cate.responseText).categories;
      setCategories(Array.isArray(cateResp) ? cateResp : []);
    };
    cate.open('GET', `${API_BASE_URL}/admin/categories`);
    cate.send();

    const employeesReq = new XMLHttpRequest();
    employeesReq.onload = () => {
      const employeesResp = JSON.parse(employeesReq.responseText).employees;
      setEmployeeDirectory(Array.isArray(employeesResp) ? employeesResp : []);
    };
    employeesReq.open('GET', `${API_BASE_URL}/employee/search?query=`);
    employeesReq.send();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedCategory) {
      setVisibleTasks(allMyTasks);
      return;
    }

    const normalized = selectedCategory.trim().toLowerCase();
    const filtered = allMyTasks.filter((task) =>
      String(task?.categories || '').trim().toLowerCase() === normalized
    );
    setVisibleTasks(filtered);
  }, [allMyTasks, selectedCategory]);

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
                <ul id="TagList">
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
          assignedToId={task?.assigned_to ?? null}
          assigneeDirectory={employeeDirectory}
          onAssignmentUpdated={(taskId, employeeId) => {
            setAllMyTasks((prev) => {
              const next = prev
                .map((row) => (String(row.tno) === String(taskId) ? { ...row, assigned_to: employeeId } : row))
                .filter((row) => String(row.assigned_to) === String(user?.id));
              return next;
            });

            setTasks((prev) => {
              const next = prev
                .map((row) => (String(row.tno) === String(taskId) ? { ...row, assigned_to: employeeId } : row))
                .filter((row) => String(row.assigned_to) === String(user?.id));

              setIds(next.map((row) => (
                <option key={`my-task-id-${row.tno}`} value={String(row.tno)}>{row.tno}</option>
              )));

              return next;
            });
          }}
          onInspect={(taskId) => onNavigate && onNavigate('task-detail', { taskId })}
        />
      ))}
    </>
  );
}

export default MyTaskList;
