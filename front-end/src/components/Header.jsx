import './Header.css';

function Header(props) {
    let admin;
    if (props.user.auth == 3) {
        admin = <li id='AdminPanel' className={window.location.pathname === "/admin_panel" ? "bold":""}><a href='#'>Admin Panel</a></li>
    }

    console.log(window.location.pathname)

    return (
        <nav className='Navbar'>
            <ul>
                <li id='MainList' className={window.location.pathname === "/" ? "bold":""}>
                    <a href='#'>Main Task List</a>
                </li>
                <li id='UserList' className={window.location.pathname === "/" + props.user.id ? "bold":""}>
                    <a href='#'>My Task List</a>
                </li>
                {admin}
            </ul>
        </nav>
    );
}

export default Header;