import { Component } from 'react';
import { Link } from "react-router-dom";
// import Footer from '../components/Footer';

class SideBar extends Component{
    render(){
        return(
          <div className="g-sidenav-show">
          <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3" id="sidenav-main" style={{ height: '100%'}}>
          <div className="sidenav-header" style={{ backgroundColor: '#00264C' }}>
            <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
            <a className="navbar-brand text-center m-0" href="#" target="_blank">
              <img src="../assets/images/nicfost.png" className="navbar-brand-img h-100" alt="main_logo" />
            </a>
          </div>
          <hr className="horizontal light mt-0 mb-2" />
          <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main" style={{height: '150vh', backgroundColor: '#00264C'}}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={window.location.href.toString().includes("dashboard") ? 'active nav-link' : 'nav-link' } to="/dashboard">
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">dashboard</i>
                  </div>
                  <span className={window.location.href.toString().includes("dashboard") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Dashboard</span>
                </Link>
              </li>

              <Link className={window.location.href.toString().includes("new-registrations") ? "text-light nav-link btn btn-success" : window.location.href.toString().includes("food-scientists") ? "text-light nav-link btn btn-success"  : window.location.href.toString().includes("registration-renewals") ? "text-light nav-link btn btn-success" : window.location.href.toString().includes("print-food-scientist-record") ? "text-light nav-link btn btn-success" : "text-light nav-link"} data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenuButton2" style={{ width: 210}}>
              <div class="text-center text-light me-2 d-flex align-items-center justify-content-center">
                <i class="material-icons opacity-10 text-light">how_to_reg</i>
              </div>Food Scientist <i style={{position: 'relative', left: 0, fontSize: 36}} class="material-icons opacity-10 ms-3 text-light">arrow_drop_down</i></Link>
              <ul class="dropdown-menu px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton" style={{ backgroundColor: '#00264C'}}>

              <li className="nav-item">
              <Link to="/new-registrations" className={window.location.href.toString().includes("new-registrations") ? 'btn-success text-light nav-link' : 'nav-link text-light' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("new-registrations") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>All Registrations</span>
              </Link>
              </li>

              {/*
              <li className="nav-item">
              <Link to="/registration-renewals" className={window.location.href.toString().includes("registration-renewals") ? 'btn-success text-light nav-link' : 'nav-link text-light'} style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("registration-renewals") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Renewals</span>
              </Link>
              </li>
              */}

              {/*
              <li className="nav-item">
              <Link to="/food-scientists" className={window.location.href.toString().includes("food-scientists") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("food-scientists") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>All Registrations</span>
              </Link>
              </li>
              */}

              <li className="nav-item">
              <Link to="/print-food-scientist-record" className={window.location.href.toString().includes("print-food-scientist-record") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("print-food-scientist-record") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Registration Report</span>
              </Link>
              </li>

              </ul>

              <Link className={window.location.href.toString().includes("new-licenses") ? "nav-link-text text-light nav-link btn btn-success" : window.location.href.toString().includes("licence-renewals") ? "nav-link-text text-light nav-link nav-item btn-success"  : window.location.href.toString().includes("licenses") ? "nav-link-text text-light nav-link btn btn-success" : window.location.href.toString().includes("print-licence-record") ? "nav-link-text text-light nav-link btn btn-success" : "nav-link-text text-light nav-link nav-item"} data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenuButton2" style={{ width: 190}}><div class="text-center me-2 d-flex align-items-center justify-content-center">
                <i class="material-icons opacity-10 text-light">how_to_reg</i>
              </div>Licenses<i style={{position: 'relative', left: 27, fontSize: 36}} class="material-icons opacity-10 ms-3 text-light">arrow_drop_down</i></Link>
              <ul class="dropdown-menu px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton" style={{ backgroundColor: '#00264C'}}>
              <li class="nav-item" style={{ width: 190}}>
                <Link className={window.location.href.toString().includes("new-licenses") ? 'active nav-link btn-success' : 'nav-link' } to="/new-licenses" style={{ width: 190}}>
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("new-licenses") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Applications</span>
                </Link>
              </li>
              <li class="nav-item" style={{ width: 190}}>
                <Link className={window.location.href.toString().includes("licence-renewals") ? 'nav-link btn btn-success' : 'nav-link' } to="/licence-renewals">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("licence-renewals") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Renewals</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link className={window.location.href.toString().includes("all-licenses") ? 'active nav-link btn-success' : 'nav-link' } to="/all-licenses" style={{ width: 190}}>
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("all-licenses") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>All Licences</span>
                </Link>
              </li>

              <li className="nav-item">
              <Link to="/print-licence-record" className={window.location.href.toString().includes("print-licence-record") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("print-licence-record") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Licence Report</span>
              </Link>
              </li>
              </ul>

              <Link className={window.location.href.toString().includes("premises") ? "text-light nav-link btn btn-success" : window.location.href.toString().includes("premises-renewals") ? "text-light nav-link btn btn-success"  : window.location.href.toString().includes("new-premises") ? "text-light nav-link btn btn-success" : window.location.href.toString().includes("inspections") ? "text-light nav-link btn btn-success" : "text-light nav-link"} data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenuButton2"><div class="text-light me-2">
                <i class="material-icons opacity-10 text-light">business</i>
              </div>Premises<i style={{position: 'relative', left: 24, fontSize: 36}} class="material-icons opacity-10 ms-3 text-light">arrow_drop_down</i></Link>
              <ul class="dropdown-menu px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton" style={{ backgroundColor: '#00264C'}}>

              <li className="nav-item">
              <Link to="/inspections" className={window.location.href.toString().includes("inspections") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("print-licence-record") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Inspections</span>
              </Link>
              </li>

              <li class="nav-item" style={{ width: 190}}>
                <Link className={window.location.href.toString().includes("new-premises") ? 'nav-link btn btn-success' : 'nav-link' } to="/new-premises">
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("new-premises") ? 'nav-link-text text-light' : 'nav-link-text ms-1 text-light'}>New Premises</span>
                </Link>
              </li>

              <li class="nav-item" style={{ width: 190}}>
                <Link className={window.location.href.toString().includes("premises-renewals") ? 'nav-link btn btn-success' : 'nav-link' } to="/premises-renewals">
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("premises-renewals") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Renewals</span>
                </Link>
              </li>

              <li class="nav-item" style={{ width: 190}}>
                <Link className={window.location.href.toString().includes("all-premises") ? 'nav-link btn btn-success' : 'nav-link' } to="/all-premises">
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("premises-renewals") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>All Premises</span>
                </Link>
              </li>

              <li className="nav-item">
              <Link to="/print-premises-record" className={window.location.href.toString().includes("print-premises-record") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("print-premises-record") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Premises Report</span>
              </Link>
              </li>

              <li className="nav-item">
              <Link to="/print-inspection-record" className={window.location.href.toString().includes("print-inspection-record") ? 'nav-link btn-success' : 'nav-link' } style={{ width: 190}}>
                  <div className="text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="material-icons opacity-10 text-light">business</i>
                  </div>
                  <span className={window.location.href.toString().includes("print-inspection-record") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Inspection Report</span>
              </Link>
              </li>

              </ul>

              {localStorage.getItem("email") !== "" &&
              <li class="nav-item" style={{ display: "none"}}>
                <Link className={window.location.href.toString().includes("create-user") ? 'active nav-link' : 'nav-link' } to="/create-user">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("create-user") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Create user</span>
                </Link>
              </li>
            }

              <li class="nav-item" style={{ display: "none"}}>
                <Link className={window.location.href.toString().includes("public-users") ? 'active nav-link' : 'nav-link' } to="/public-users">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("public-users") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-dark'}>Public Users</span>
                </Link>
              </li>

              <li class="nav-item">
                <Link className={window.location.href.toString().includes("admin-users") ? 'active nav-link' : 'nav-link' } to="/admin-users">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("admin-users") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Manage Admin Users</span>
                </Link>
              </li>

              <li class="nav-item">
                <Link className={window.location.href.toString().includes("public-users") ? 'active nav-link' : 'nav-link' } to="/public-users">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("public-users") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Manage Public Users</span>
                </Link>
              </li>

              <li class="nav-item">
                <Link className={window.location.href.toString().includes("payments") ? 'active nav-link' : 'nav-link' } to="/payments">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">credit_card</i>
                  </div>
                  <span className={window.location.href.toString().includes("payments") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Payments</span>
                </Link>
              </li>

              <li class="nav-item" style={{ display: "none"}}>
                <Link className={window.location.href.toString().includes("workflow") ? 'active nav-link' : 'nav-link' } to="/workflow">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10">how_to_reg</i>
                  </div>
                  <span className={window.location.href.toString().includes("workflow") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-dark'}>Workflow</span>
                </Link>
              </li>

              <li class="nav-item">
                <Link className={window.location.href.toString().includes("logout") ? 'active nav-link' : 'nav-link' } to="/logout">
                  <div class="text-center me-2 d-flex align-items-center justify-content-center">
                    <i class="material-icons opacity-10 text-light">logout</i>
                  </div>
                  <span className={window.location.href.toString().includes("logout") ? 'nav-link-text ms-1 text-light' : 'nav-link-text ms-1 text-light'}>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{ height: 450}}>

          <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
            <div class="container-fluid py-1 px-3">
              <nav aria-label="breadcrumb">
                <h5 class="font-weight-bolder mb-0">NiCFoST | {window.location.href.includes("dashboard") ? "Dashboard" : window.location.href.includes("food-scientists") ? 'Food Scientists' : window.location.href.includes("premises") ? 'Premises' : window.location.href.includes("all-licenses") ? 'All Registered Licences' : window.location.href.includes("payments") ? 'Payments' : window.location.href.includes("create-user") ? "Create User" : window.location.href.includes("workflow") ? 'Workflow' : window.location.href.includes("logout") ? 'Logout' : window.location.href.includes("admin-users") ? "Admin Users" : window.location.href.includes("public-users") ? "Public Users" : window.location.href.includes("new-registrations") ? "All Registrations" : window.location.href.includes("licence-renewals") ? 'Renew Licence' : window.location.href.includes("registration-renewals") ? "Renew Registration" : window.location.href.includes("new-licenses") ? 'New Licence Applications' : window.location.href.includes("print-food-scientist-record") ? "Preview Food Scientist Registrations" : window.location.href.includes("print-licence-record") ? "Preview Licence Registrations" : window.location.href.includes("print-premises-record") ? "Preview Premises Registrations" : window.location.href.includes("inspections") ? 'Manage Inspections' : window.location.href.includes('print-inspection-record') ? 'Print Inspection Report' : ''}</h5>
              </nav>
              <ul class="navbar-nav  justify-content-end">
                <li>
                  <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                    <div class="ms-md-auto d-flex">
                      <li class="nav-item dropdown d-flex align-items-center">
                        <a href="#" class="nav-link text-body" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                          <span class="my-auto">
                            <img src="../assets/img/account.svg" class="avatar avatar-sm me-3 " />
                          </span>
                          <i class="fa fa-angle-down cursor-pointer"></i>
                        </a>
                        <ul class="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                         <Link to="/logout" className="text-decoration-none">
                          <li class="mb-2">
                            <a class="dropdown-item border-radius-md" href="javascript:;">
                              <div class="d-flex py-1">
                                <div class="my-auto">
                                  <img src="../assets/img/logout.svg" class="avatar avatar-sm me-3 " />
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                  <h6 class="text-sm font-weight-normal mb-1">
                                    <span class="font-weight-bold text-danger text-decoration-none">Logout</span>
                                  </h6>
                                </div>
                              </div>
                            </a>
                          </li>
                          </Link>
                        </ul>
                      </li>
                      <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
                        <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                          <div class="sidenav-toggler-inner">
                            <i class="sidenav-toggler-line"></i>
                            <i class="sidenav-toggler-line"></i>
                            <i class="sidenav-toggler-line"></i>
                          </div>
                        </a>
                      </li>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
         </main>
          </div>

        )
    }
}

export default SideBar
