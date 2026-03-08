import Header from './Header'
import './MainList.css'
import Ticket from './Ticket';

function MainList({ user, onNavigate, onLogout }) {
    let tickets; let ids;
    const req = new XMLHttpRequest();
    req.onload = () => {
        let taskResp = JSON.parse(req.responseText).tasks;
        tickets = taskResp.map((e) => <Ticket user={user} title={e.name} desc={e.summary} keywords={e.categories} id={e.tno}/>)
        ids = taskResp.map((e) => <>
        <option>{e.tno}</option><option>{e.name}</option>
        </>)
    }

    req.open("GET", "http://127.0.0.1:8000/task", false)
    req.send()
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
                        <input type='search' name='search' id='TicketSearch' list='tickets' placeholder='Enter a Ticket Number'/> 
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
                        <ul>
                            {/*Add keywords here*/}
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