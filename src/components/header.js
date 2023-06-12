import React from 'react';
import { NavLink } from 'react-router-dom';

let Header=()=>{
    let token = localStorage.getItem('token');
    const logout = evt=>{
      evt.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }

      /*useEffect(() => {
        document.querySelector('#navbarSideCollapse').addEventListener('click', () => {
          document.querySelector('.offcanvas-collapse').classList.toggle('open')
        });
      }, []);*/

    return(
        <header className="navbar navbar-expand-lg fixed-top navbar-light bg-light align-items-center justify-content-center justify-content-md-between pb-3 mb-4 border-bottom">
          <a href="/" className="fw-bold ms-3 d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
              QR CODE
          </a>
          {token ?
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <NavLink activeclassname="active" className="nav-link" to="/admin/dashboard">
                      Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink activeclassname="active" className="nav-link" to="/admin/jobs">
                      Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink activeclassname="active" className="nav-link" to="/admin/scanner">
                      Scanner 
                  </NavLink>
                </li>
                <li>
                  <NavLink activeclassname="active" className="nav-link" to="/admin/templates">
                      Templates 
                  </NavLink>
                </li>
            </ul>
            : null
          }
    
          <div className="col-md-3 text-end">
            {token ?<button type="button" className="btn btn-outline-primary me-2" onClick={logout}>Logout</button> : <a href='/login' type="button" className="btn btn-outline-primary me-2">Login</a> }
          </div>
        </header>
    );
}
export default Header;