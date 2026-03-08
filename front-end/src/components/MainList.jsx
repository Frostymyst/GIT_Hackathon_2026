import Header from './Header'
import './MainList.css'
import Ticket from './Ticket';

function MainList({ user, onNavigate }) {
    // eslint-disable-next-line no-unused-vars
    let tickets;
    const req = new XMLHttpRequest();
    req.onload = () => {
        let taskResp = JSON.parse(req.responseText).tasks;
        tickets = taskResp.map((e) => <Ticket user={user} title={e.name} desc={e.summary} keywords={e.categories} id={e.tno}/>)
    }

    req.open("GET", "http://localhost:8000/task", false)
    req.send()
    /*req.setRequestHeader("Content-Type", "application/json")
    req.send(JSON.stringify({
        email:"test@example.com",
        description:"dsa",
    }))*/

  return (
    <>
        <Header user={user} onNavigate={onNavigate} activeView="main" />
    <table id='Layout'>
        <tbody>
            <tr>
                <td id='SearchDiv'>
                    <h4>
                        Search for a Specific Ticket
                    </h4>
                    <input type='text' name='search' id='TicketSearch' list='tickets' placeholder='Enter a Ticket Number'/> {/* Can also search by customer email if we have time */}
                    <datalist id='tickets'>

                    </datalist>
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
                        <button id='CreateBtn'>
                            <a href='#'>
                                Create Issue
                            </a>
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