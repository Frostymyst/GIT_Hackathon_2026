import './Header.css';

function Header({ user, onNavigate, onLogout, activeView = 'main' }) {
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
                <a href='#' className='nav-link' onClick={(event) => handleNavigate(event, 'admin')}>
                    <i className='fa-solid fa-shield-halved' aria-hidden='true' />
                    <span>Admin Panel</span>
                </a>
            </li>
        );
    }

    return (
        <nav className='Navbar'>
            <div className='NavBrand'>
                <img src='/Catasktrophy.svg' alt='Catasktrophy' className='NavBrandLogo' />
            </div>

            <div className='NavActions'>
                <ul>
                    <li id='MainList' className={activeView === 'main' ? 'bold' : ''}>
                        <a href='#' className='nav-link' onClick={(event) => handleNavigate(event, 'main')}>
                            <i className='fa-solid fa-list-check' aria-hidden='true' />
                            <span>Main Task List</span>
                        </a>
                    </li>
                    <li id='UserList' className={activeView === 'my-tasks' ? 'bold' : ''}>
                        <a href='#' className='nav-link'>
                            <i className='fa-solid fa-clipboard-list' aria-hidden='true' />
                            <span>My Task List</span>
                        </a>
                    </li>
                    <li id='CalendarView' className={activeView === 'calendar' ? 'bold' : ''}>
                        <a href='#' className='nav-link' onClick={(event) => handleNavigate(event, 'calendar')}>
                            <i className='fa-solid fa-calendar-days' aria-hidden='true' />
                            <span>Calendar</span>
                        </a>
                    </li>
                    {admin}
                </ul>

                <button type='button' className='LogoutBtn' onClick={onLogout}>
                    <i className='fa-solid fa-right-from-bracket' aria-hidden='true' />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}

export default Header;