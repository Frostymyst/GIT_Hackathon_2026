import { useEffect, useState } from 'react';
import Header from './Header'
import './MainList.css'
import Ticket from './Ticket';


function MainList({ user, onNavigate, onLogout }) {
    let [tasks, setTasks] = useState([]); 
    let [ids, setIds] = useState([]); 
    let [tags, setTags] = useState([]);

    const handleSort = (event) => {
        let cat = "http://127.0.0.1:8000/task?category="+event.target.id+"&cname=";
        const catReq = new XMLHttpRequest();
        console.log(cat)
        catReq.onload = () => {
            let cats = JSON.parse(catReq.responseText);
            console.log(cats)
            setTasks(cats.tasks || []);
        }

        catReq.open("GET", cat)
        catReq.send()
    }

    useEffect(() => {
        // Fetch tasks
        const req = new XMLHttpRequest();
        req.onload = () => {
            const taskResp = JSON.parse(req.responseText).tasks;
            setTasks(taskResp || []);
            setIds(taskResp.map((e) => (
                <option key={`task-id-${e.tno}`} value={String(e.tno)}>{e.tno}</option>
            )));
        };
        req.open("GET", "http://127.0.0.1:8000/task");
        req.send();

        // Fetch categories
        const cate = new XMLHttpRequest();
        cate.onload = () => {
            const cateResp = JSON.parse(cate.responseText).categories;
            setTags(cateResp.map((e) => <li id={e.cname} key={e.cname} onClick={handleSort}>{e.cname}</li>));
        };
        cate.open("GET", "http://127.0.0.1:8000/admin/categories");
        cate.send();
    }, []);

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
                            {tags}
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
                onInspect={(taskId) => onNavigate && onNavigate('task-detail', { taskId })}
            />
        ))}
    </>
  )
}

export default MainList