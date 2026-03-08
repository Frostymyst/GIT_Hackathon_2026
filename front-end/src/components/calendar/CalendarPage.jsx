import { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '../Header';
import { getTasks } from '../../api/taskApi';
import './CalendarPage.css';

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDueDate(raw) {
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function CalendarPage({ user, onNavigate, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('Loading tasks...');

  useEffect(() => {
    async function loadTasks() {
      setStatus('Loading tasks...');
      try {
        const response = await getTasks();
        const rows = Array.isArray(response?.tasks) ? response.tasks : [];

        const normalized = rows.map((task, index) => {
          const dueDate = parseDueDate(task.due_date ?? task.dueDate);
          return {
            id: task.tno ?? task.id ?? index,
            name: task.name ?? `Task ${task.tno ?? index + 1}`,
            status: task.status ?? 'new',
            dueDate,
          };
        });

        setTasks(normalized);
        setStatus('');
      } catch (error) {
        setTasks([]);
        setStatus(error.message || 'Unable to load tasks for calendar.');
      }
    }

    loadTasks();
  }, []);

  const dueDateMap = useMemo(() => {
    const map = new Map();

    tasks.forEach((task) => {
      if (!task.dueDate) {
        return;
      }

      const key = toDateKey(task.dueDate);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(task);
    });

    return map;
  }, [tasks]);

  const selectedKey = toDateKey(selectedDate);
  const tasksDueOnSelectedDate = dueDateMap.get(selectedKey) || [];

  return (
    <div className="calendar-page">
      <Header user={user} onNavigate={onNavigate} onLogout={onLogout} activeView="calendar" />
      <main className="calendar-main">
        <section className="calendar-hero">
          <p className="calendar-eyebrow">Schedule</p>
          <h1 className="calendar-title">Task Due Calendar</h1>
          <p className="calendar-subtitle">Select a date to see which tasks are due.</p>
        </section>

        <section className="calendar-layout">
          <div className="calendar-card">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="task-calendar"
              tileClassName={({ date, view }) => {
                if (view !== 'month') {
                  return null;
                }
                return dueDateMap.has(toDateKey(date)) ? 'task-calendar-due-day' : null;
              }}
            />
          </div>

          <div className="calendar-card due-list-card">
            <h2 className="due-list-title">
              <i className="fa-solid fa-calendar-check" aria-hidden="true" />
              <span>Due on {selectedKey}</span>
            </h2>

            {status && <p className="calendar-message">{status}</p>}

            {!status && tasksDueOnSelectedDate.length === 0 && (
              <p className="calendar-message">No tasks due on this date.</p>
            )}

            {!status && tasksDueOnSelectedDate.length > 0 && (
              <ul className="due-task-list">
                {tasksDueOnSelectedDate.map((task) => (
                  <li key={task.id} className="due-task-item">
                    <span className="due-task-name">{task.name}</span>
                    <span className={`due-task-status due-task-status-${task.status}`}>{task.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CalendarPage;
