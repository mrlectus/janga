import React, { PureComponent } from "react";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import { Spinner } from "react-bootstrap";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";
import moment from 'moment';
import coat from "../assets/images/coat.png";
import logo from "../assets/images/logo.png";

class RenewPremises extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
        data: [],
        userApproveData: [],
        approval: "",
        remarks: "",
        licenceNumber: "",
        loading: false,
        isLoading: false,
        isApproving: false,
        isCanceling: false,
        isPremisesLoading: false,
        premisesData: [],
        postsPerPage: 10,
        currentPage: 1,
      }
      this.handleApprovalChange = this.handleApprovalChange.bind(this);
  }

  handleApprovalChange(e){
    this.setState({ approval: e.target.value });
  }


    print(){
      window.print()
    }

  reviewApplication = async (value) => {
      this.setState({isApproving: true, disabled: true})
      let date = new Date();

      if(this.state.approval === "" || !this.state.approval === "rejected"){
        Swal.fire({
          title: "Empty",
          text: "Please specify application status",
          icon: "error",
          confirmButtonText: "OK",
        });
        this.setState({ isApproving: false, disabled: false})
      }else if(this.state.licenceNumber === "" && !this.state.approval === "rejected"){
        Swal.fire({
          title: "Empty",
          text: "Please enter a valid licence number",
          icon: "error",
          confirmButtonText: "OK",
        });
        this.setState({ isApproving: false, disabled: false})
      }else if(this.state.remarks === ""){
        Swal.fire({
          title: "Empty",
          text: "Please specify remarks",
          icon: "error",
          confirmButtonText: "OK",
        });
        this.setState({ isApproving: false, disabled: false})
      }else {

      var obj = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          applicationstatus: this.state.approval,
          licensedate: date,
          licensenumber: this.state.licenceNumber,
          licenseremarks: this.state.remarks,
          recid: value
        }),
      };
      await fetch(`${baseUrl}Premises/updatePremisesOfficial`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.warn(responseJson);
          if (responseJson.message === "Premises updated Successfully") {
            this.setState({ isApproving: false, disabled: false})
            Swal.fire({
              title: "Success",
              text: responseJson.message,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
                window.location.reload()
                // this.props.history.push("/new-premises")
            })
          } else {
            this.setState({ isApproving: false, disabled: false });
            Swal.fire({
              title: "Error!",
              text: responseJson.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false, disabled: false });
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
      }
    };

  reviewRegistration = (recid) => {
  const url = `${baseUrl}Premises/getPremisesByRecID/${recid}`;
  this.setState({isLoading: true});
  fetch(url, {
    method: 'GET',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(res => res.json())
    .then(res => {
      this.setState({
        isLoading: false,
        userApproveData: res,
      });
    })
    .catch(error => {
      this.setState({error: true, loading: false});
      alert(error);
    });
}

  getSinglePremises = (userid) => {
    const url = `${baseUrl}Premises/getPremisesByUserID/${userid}`;
    this.setState({isPremisesLoading: true});
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        // console.warn(res)
        this.setState({
          isPremisesLoading: false,
          premisesData: res,
        });
      })
      .catch(error => {
        this.setState({error: true, loading: false});
        alert(error);
      });
  }

  showPremises = async () => {
      this.setState({ loading: true });

      if (!$.fn.DataTable.isDataTable("#table")) {
          $(document).ready(function () {
            setTimeout(function () {
              $("#table").DataTable({
                pagingType: "full_numbers",
                pageLength: 20,
                processing: true,
                dom: "Bfrtip",
                select: {
                  style: "single",
                },

                buttons: [
                  {
                    extend: "pageLength",
                    className: "btn btn-secondary bg-secondary",
                  },
                  {
                    extend: "copy",
                    className: "btn btn-secondary bg-secondary",
                  },
                  {
                    extend: "csv",
                    className: "btn btn-secondary bg-secondary",
                  },
                  {
                    extend: "print",
                    customize: function (win) {
                      $(win.document.body).css("font-size", "10pt");
                      $(win.document.body)
                        .find("table")
                        .addClass("compact")
                        .css("font-size", "inherit");
                    },
                    className: "btn btn-secondary bg-secondary",
                  },
                ],

                fnRowCallback: function (
                  nRow,
                  aData,
                  iDisplayIndex,
                  iDisplayIndexFull
                ) {
                  var index = iDisplayIndexFull + 1;
                  $("td:first", nRow).html(index);
                  return nRow;
                },

                lengthMenu: [
                  [10, 20, 30, 50, -1],
                  [10, 20, 30, 50, "All"],
                ],
                columnDefs: [
                  {
                    targets: 0,
                    render: function (data, type, row, meta) {
                      return type === "export" ? meta.row + 1 : data;
                    },
                  },
                ],
              });
            }, 1000);
          });
        }

      let obj = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await fetch(`${baseUrl}Premises/getAllPremises`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.warn(responseJson);
          if (responseJson.status === 401) {
              this.setState({ loading: false });
              Swal.fire({
                title: "Session Expired",
                text: "Session expired. Please login",
                icon: "error",
                confirmButtonText: "OK",
              }).then(() => {
                this.props.history.push("/login");
              });
            }else{
            this.setState({data: responseJson, loading: false})
            }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };

    cancelApplication = (recid) => {
      this.setState({isCanceling: true})
      const url = `${baseUrl}Premises/removeRecord/${recid}`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then(res => res.json())
        .then(res => {
          // console.warn(res);
          if(res.message === "Record removed successfully"){
              this.setState({isCanceling: false});
            Swal.fire({
              title: "Success",
              text: "Record removed successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
                this.props.history.push("/new-registrations")
            })
          }else{
            Swal.fire({
              title: "Error",
              text: "An error occurred, please try again",
              icon: "error",
              confirmButtonText: "OK",
            })
            this.setState({isCanceling: false});
          }
        })
        .catch(error => {
          this.setState({isCanceling: false});
          alert(error);
        });
    }


      showPagination = () => {
        const { postsPerPage, data } = this.state;
        const pageNumbers = [];
        const totalPosts = data.length;
        for(let i = 1; i<= Math.ceil(totalPosts/postsPerPage); i++){
          pageNumbers.push(i)
        }

       const paginate = (pageNumbers) => {
         this.setState({currentPage: pageNumbers})
       }

        return(
          <nav>
          <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className={this.state.currentPage === number ? 'page-item active' : 'page-item'}>
            <button onClick={()=> paginate(number)} className="page-link">
              { number }
            </button>
           </li>
         ))}
          </ul>
          </nav>
        )
      }


    showTable = () => {
      const { postsPerPage, currentPage, data } = this.state;
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
      try {
        return currentPosts.map((item, index) => {
          return (
              <tr>
               <td className="text-xs text-capitalize font-weight-bold">{postsPerPage * (currentPage-1)+index+1}</td>
               <td className="text-xs text-capitalize font-weight-bold">{(item.organisationname)}</td>
               <td className="text-xs text-capitalize font-weight-bold">{(item.businesstype)}</td>
               <td className={item.applicationstatus === "approved" ? 'badge bg-success mt-3' : item.applicationstatus=="pending" ? "badge bg-warning mt-3" : item.applicationstatus === "rejected" ? 'badge bg-danger mt-3' : ""}>{(item.applicationstatus)}</td>
               <td className="text-xs text-capitalize font-weight-bold">{moment(item.applicationdate).format('LL')}</td>
               <td className="text-xs text-capitalize font-weight-bold">{moment(item.licensedate).format('LL') === "Invalid date" ? null : moment(item.licensedate).format('LL')}</td>
               <td>
                    <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{fontSize: 'large'}} ></span></button>
                    <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                      <li className="mb-2">
                        <a className="dropdown-item border-radius-md" href="javascript:;">
                          <div className="d-flex py-1">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span id = { item.userid } onClick={() => this.getSinglePremises(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">View Submission</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                      {localStorage.getItem("email") !== null &&
                      <li class="mb-2" data-bs-toggle="modal" data-bs-target="#cancel">
                        <a class="dropdown-item border-radius-md" href="javascript:;">
                          <div class="d-flex py-1">
                              <h6 class="text-sm font-weight-normal mb-1">
                                <span class="font-weight-bold text-danger">Cancel Application</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                    }
                      {localStorage.getItem("email") !== null &&
                      <li class="mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal3">
                        <a class="dropdown-item border-radius-md" href="javascript:;">
                          <div class="d-flex py-1">
                              <h6 class="text-sm font-weight-normal mb-1">
                                <span id = { item.recid } onClick={() => this.reviewRegistration(item.recid)} className="font-weight-bold">Approve / Reject</span>
                              </h6>
                          </div>
                        </a>
                      </li>
                    }
                    </ul>
                    </td>
                    <td></td>
                    {/*Cancel Application */}
                    <div class="modal fade" id="cancel" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header bg-danger">
                          <h5 class="modal-title text-uppercase font-weight-bold text-light" id="exampleModalLabel">Cancel Application</h5>
                          <button type="button" class="btn-close text-light bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          Are you sure you want to cancel this application? <br />You cannot UNDO this action.
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                          <button type="button" class="btn btn-danger" id={item.recid} onClick={()=>this.cancelApplication(item.recid)}>{this.state.isCanceling ? <Spinner animation="border" className="text-center" variant="light" size="lg" /> : "Yes, Continue"}</button>
                        </div>
                      </div>
                    </div>
                  </div>
             </tr>
              );
        });
      } catch (e) {
        Swal.fire({
          title: "Error",
          text: e.message,
          type: "error",
        })
      }
    };

    componentDidMount(){
        this.showPremises();
    }

  render(){
    const { isLoading, isApproving, isPremisesLoading } = this.state;
      return(
      <div className="g-sidenav-show">
        <Sidebar />
     <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{width: '80%', float: 'right'}}>
       <div class="container-fluid px-4">
       <div class="rown">
         <div class="col-12">
           <div class="card my-3">
             <div class="card-header pb-4 bg-success">
               <div class="d-flex flex-wrap align-items-center justify-content-between">
                 <h5 className="text-light">Newly Registered Premises</h5>
                 {/*
                 <div class="d-flex align-items-center">
                   <button class="btn bg-gradient-primary mb-0"  data-bs-toggle="modal" data-bs-target="#exampleModal" > <span class="iconify" data-icon="carbon:add" style={{fontSize: 'large'}}></span>Create User</button>
                 </div>
                 */}
               </div>
             </div>

         <div class="card-body">

       {this.state.loading ?  <Spinner animation="border" style={{ position:'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
       <div class="container-fluid py-4">
       <div class="table-responsive p-0 pb-2">
     <table id="table" className="table align-items-center justify-content-center mb-0">
         <thead>
             <tr>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Organization</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Business Type</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Date</th>
            <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Approval Date</th>
             <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
             <th></th>
             </tr>
         </thead>
         <tbody>
        {this.showTable()}
         </tbody>
         </table>
         </div>
         <div style={{float: 'right'}}>
         {this.showPagination()}
         </div>
         </div>
          }
         {/* <Footer /> */}
         {/* Review Registration Modal */}
           <div className="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
             <div className="modal-dialog">
               <div className="modal-content">
                 <div className="modal-header d-flex align-items-center justify-content-between" style={{ backgroundColor: '#00264C'}}>
                   <h5 className="modal-title text-light">Approve / Reject Application</h5>
                   <button type="button" className="btn btn-link m-0 p-0 text-light fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                 </div>
                 <div className="modal-body">
                   <div className="row">
                     <div clasNames="d-flex px-3">
                       {/*<div className="my-auto text-center">
                         <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                       </div> */}
                       { isLoading ? <center><Spinner animation="border" className="text-center" variant="danger" size="lg" /></center>  :
                       <div className="d-flex flex-column">
                         {/*<h6 className="text-lg font-weight-normal mb-1">
                           <span className="font-weight-bold">NiCFOsT</span>
                         </h6> */}
                         {this.state.userApproveData.map((item) => {
                           return (
                             <div>
                             <span><hr class="dark horizontal my-3" /></span>

                            <div className = "row">
                            <label
                              className="h6"
                              style={{ color: "red", marginTop: -36 }}
                              htmlFor="floatingInputCustom"
                            >
                              Administrative action
                            </label>




                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                             <label htmlFor="role">Status</label>
                               <select
                                 className="form-control shadow-none"
                                 aria-label="Floating label select example"
                                 onChange={this.handleApprovalChange}
                                 id="role"
                               >
                                  <option selected disabled>--Select Application Status --</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>

                               </select>
                             </div>

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Remarks
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <textarea className="form-control shadow-none"  onChange={(e) => this.setState({ remarks: e.target.value })}>
                                  </textarea>
                                </div>
                              </div>
                             </div>

                             <hr />

                             <label
                               className="h6"
                               style={{ color: "red" }}
                               htmlFor="floatingInputCustom"
                             >
                               Administrative information for approval
                             </label>

                             <div className = "row">

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Date of approval
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { moment(item.applicationdate).format('LL') }
                                    onValue={this.handleLicenceDate}

                                  />
                                </div>
                              </div>

                             <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Licence number
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                    type="type"
                                    value = {item.applicationstatus === "approved" ? item.licensenumber : null }
                                    onChange={(e) => this.setState({ licenceNumber: e.target.value })}
                                  />
                                </div>
                              </div>

                                <div
                                className="text-center"
                                  style={{
                                    margin: "auto",
                                    width: "100%",
                                    marginTop: 45,
                                  }}
                                >
                                {item.applicationstatus !== "approved" &&
                                  <button
                                    id={`${item.recid}`}
                                    disabled={this.state.disabled}
                                    style={{
                                      alignSelf: "center",
                                      width: "100%",
                                      backgroundColor: "#003314",
                                    }}
                                    className="btn btn-success btn-lg"
                                    onClick={(e) => this.reviewApplication(`${item.recid}`)}
                                  >

                                    {isApproving ? (
                                      <Spinner animation="border" variant="light" size="sm" />
                                    ) : (
                                      <span className="font-weight-bold">
                                        {/* APPLY <i class="fas fa-chevron-right"></i> */}
                                        Submit Review
                                      </span>
                                    )}
                                  </button>
                                }
                                </div>

                             </div>
                             </div>
                         )
                         })}
                       </div>
                     }
                     </div>

                     <span className="pt-3"><hr class="dark horizontal my-3" /></span>
                   </div>
                 </div>
                 <div class="modal-footer" style={{ display: "none"}}>
                   <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Close</button>
                 </div>
               </div>
             </div>
           </div>

         {/* View Modal */}
           <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
             <div className="modal-dialog modal-xl">
               <div className="modal-content">
                 <div className="modal-header d-flex align-items-center justify-content-between bg-success">
                   <h5 className="modal-title text-light">Premises Details</h5>
                     <button className="text-light btn btn-primary btn-lg text-light" style={{ marginRight: 18}} onClick={()=>this.print()}>Print</button>
                   <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                 </div>
                 <div className="text-center container-fluid px-4 d-flex justify-content-between" style={{width: '100%', justifyContent: 'space-evenly', alignItems: 'center', position: 'relative', top: 18 }}>
                 <div>
                 <img src={logo} className="navbar-brand-img" alt="main_logo" style={{ width: 81 }} />
                 </div>
                 <div>
                 <h4 className="font-weight-bold text-center">NIGERIAN COUNCIL OF FOOD SCIENCE AND TECHNOLOGY (NiCFoST)</h4>
                 </div>
                 <div>
                 <img src={coat} className="navbar-brand-img h-100" style={{ width: 126 }} alt="main_logo" />
                 </div>
                 </div>
                 <div className="modal-body">
                   <div className="row">
                     <div clasNames="d-flex px-3">
                       <div className="my-auto text-center">
                         <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                       </div>
                       { isPremisesLoading ? <center><Spinner animation="border" variant="primary" size="lg" /></center>  :
                       <div className="d-flex flex-column">
                         {/*<h6 className="text-lg font-weight-normal mb-1">
                           <span className="font-weight-bold">NiCFOsT</span>
                         </h6> */}
                         {this.state.premisesData.map((item) => {
                           return (
                             <div>
                             <h4 className="text-dark text-uppercase ms-sm-4 ">{ item.organisationname }</h4>
                             <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                            <div className = "row">

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Registration number
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { item.registrationnumber }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Application date
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { moment(item.applicationdate).format('LL') }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Application status
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { item.applicationstatus }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Date acquired licence
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { moment(item.licensedate).format('LL') }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Business type
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { item.businesstype }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Business description
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <input
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { item.businessdescription }
                                  />
                                </div>
                              </div>

                             <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                <label
                                  className="form-label"
                                >
                                  Product brands
                                </label>
                                <div className="input-group input-group-outline mb-3">
                                  <label className="form-label"></label>
                                  <textarea
                                    className="form-control shadow-none"
                                     disabled
                                    type="phone"
                                    value = { item.productbrands }
                                  ></textarea>
                                </div>
                              </div>

                              <hr />
                            <label
                              className="mb-3 h4"
                              style={{ color: "green" }}
                              htmlFor="floatingInputCustom"
                            >
                             Inspection
                            </label>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection date
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { moment(item.inspectiondate).format('LL') }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection fees
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionfees }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection follow-up
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionfollowup }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection fees
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionfees }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection status
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionstatus }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection team leader's name
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionteamleadername }
                                   />
                                 </div>
                               </div>

                              <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                 <label
                                   className="form-label"
                                 >
                                   Inspection team leader's comment
                                 </label>
                                 <div className="input-group input-group-outline mb-3">
                                   <label className="form-label"></label>
                                   <input
                                     className="form-control shadow-none"
                                     disabled
                                     type="phone"
                                     value = { item.inspectionteamleadercomment }
                                   />
                                 </div>
                               </div>

                               <hr />
                             <label
                               className="mb-3 h4"
                               style={{ color: "green" }}
                               htmlFor="floatingInputCustom"
                             >
                              Lead food scientist
                             </label>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    Lead food scientist's name
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.leadfoodscientistname }
                                    />
                                  </div>
                                </div>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    Lead food scientist's licence number
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.leadfoodscientistlicensenumber }
                                    />
                                  </div>
                                </div>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    LGA
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.lga }
                                    />
                                  </div>
                                </div>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    Nationality
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.nationality }
                                    />
                                  </div>
                                </div>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    Address
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.locationaddress }
                                    />
                                  </div>
                                </div>

                               <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                  <label
                                    className="form-label"
                                  >
                                    Gender
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control shadow-none"
                                      disabled
                                      type="phone"
                                      value = { item.gender }
                                    />
                                  </div>
                                </div>

                                </div>

                             </div>
                         )
                         })}
                       </div>
                     }
                     </div>
                     <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                     {/*
                     <div className="d-flex flex-column px-3">
                       <h6 className="mb-3 text-sm">Applicant's History</h6>

                       <span className="mb-2 text-xs">Date Applied: <span class="text-dark font-weight-bold ms-sm-2">8 Feb, 2022</span></span>
                       <span className="mb-2 text-xs">Created By: <span class="text-dark ms-sm-2 font-weight-bold">info@byteworks.com</span></span>
                       <span className="mb-2 text-xs">Updated By: <span class="text-dark ms-sm-2 font-weight-bold">info@byteworks.com</span></span>
                     </div>
                     */}
                   </div>
                 </div>
                 <div class="modal-footer">
                   <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
                 </div>
               </div>
             </div>
           </div>
           </div>
           </div>
           </div>
           </div>
           </div>
       </main>
        </div>
      )
    }
}

export default RenewPremises
