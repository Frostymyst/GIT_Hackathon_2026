import Header from './Header'
import './MainList.css'

// eslint-disable-next-line no-unused-vars
function MainList(props) {
    // eslint-disable-next-line no-unused-vars
    let tickets;
    const req = new XMLHttpRequest();
    req.onload = () => {
        console.log(req)
        tickets = req
    }

    req.open("GET", "http://localhost:8000/task")
    req.send()

    const User = {
    id:1,
    name:"Matt",
    auth:3,
    employees: [
      "Sawyer",
      "Zaki",
      "Ethan",
      "Kelvin"
    ]
  }

  return (
    <>
    <Header user={User} />
    <table id='Layout'>
        <tbody>
            <tr>
                <td id='SearchDiv' colSpan={2}>
                    <h4>
                        Search for a Specific Ticket
                    </h4>
                    <input type='text' name='search' id='TicketSearch' list='tickets' placeholder='Enter a Ticket Number'/> {/* Can also search by customer email if we have time */}
                    <datalist id='tickets'>

                    </datalist>
                </td>
                <td id='TagDiv' colSpan={4}>
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
    </>
  )
}

export default MainList