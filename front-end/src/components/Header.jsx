import './Header.css';

function Header({ user, onNavigate, activeView = 'main' }) {
    const handleNavigate = (event, target) => {
        event.preventDefault();
        if (onNavigate) {
            onNavigate(target);
        }
    };

    let admin;
    if (user.auth === 3) {
        admin = (
            <li id='AdminPanel' className={activeView === 'admin' ? 'bold' : ''}>
                <a href='#' onClick={(event) => handleNavigate(event, 'admin')}>Admin Panel</a>
            </li>
        );
    }

    return (
        <nav className='Navbar'>
            <ul>
                <li id='MainList' className={activeView === 'main' ? 'bold' : ''}>
                    <a href='#' onClick={(event) => handleNavigate(event, 'main')}>Main Task List</a>
                </li>
                <li id='UserList' className={activeView === 'my-tasks' ? 'bold' : ''}>
                    <a href='#'>My Task List</a>
                </li>
                {admin}
            </ul>
        </nav>
    );
}

export default Header;