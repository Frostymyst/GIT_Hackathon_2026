import Header from './Header'
import './MainList.css'
import Ticket from './Ticket';


function MainList({ user, onNavigate, onLogout }) {
    let tickets; let ids; let tags;
    const req = new XMLHttpRequest();
    const cate = new XMLHttpRequest();
    req.onload = () => {
        let taskResp = JSON.parse(req.responseText).tasks;
        tickets = taskResp.map((e) => <Ticket user={user} title={e.name} desc={e.summary} keywords={e.categories} id={e.tno}/>);
        ids = taskResp.map((e) => <>
        <option>{e.tno}</option><option>{e.name}</option>
        </>)
    }

    const handleSort = (event) => {
        let cat = event.target.id;
        const catReq = new XMLHttpRequest();
        catReq.open("GET", "http://127.0.0.1:8000/task/category/"+cat)
        catReq.send()

        catReq.onload = () => {
            let cats = JSON.parse(req.responseText).tasks;
            tickets = cats.map((e) => <Ticket user={user} title={e.name} desc={e.summary} keywords={e.categories} id={e.tno}/>)
            console.log(cats)
        }
    }

    cate.onload = () => {
        let cateResp = JSON.parse(cate.responseText).categories;
        tags = cateResp.map((e) => <li id={e.cname} key={e.cname} onClick={handleSort}>{e.cname}</li>)
        console.log(tags)
    }

    req.open("GET", "http://127.0.0.1:8000/task", false)
    req.send()
    cate.open("GET", "http://127.0.0.1:8000/admin/categories", false)
    cate.send()
    /*req.setRequestHeader("Content-Type", "application/json")
    req.send(JSON.stringify({
        email:"test@example.com",
        description:"dsa",
    }))*/

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
    {tickets}
    </>
  )
}

export default MainList