import React, { Component } from "react";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Sidebar from '../Components/Sidebar';
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
import pdf from "../assets/images/pdf.jpg";
import axios from 'axios';


class Licenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      licenceData: [],
      isLoading: false,
      isDownloading: false,
      loading: false,
      postsPerPage: 10,
      currentPage: 1,
      licenceCertificate: ""
    }
  }

  downloadCert = async (values) => {
    // console.log(values)
    this.setState({ isDownloading: true })
    let val = values.split(",");
    console.log(val)
    try {
      const apiUrl = `${baseUrl}eservices/GetLicenseFile`;
      const payload = {
        id: val[1],
        nameOfCompany: val[0],
        regNumber: val[1],
        validTillDate: "31 December 2023"
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      const response = await axios.post(apiUrl, payload, {
        responseType: 'blob',
        headers: headers,
      });
      // console.warn(response.data);
      let url = window.URL.createObjectURL(response.data);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'licence.pdf';
      this.setState({ licenceCertificate: url })
      this.setState({ isDownloading: false })

    } catch (error) {
      console.error('Error:', error);
    }
  };

  showLicenses = async () => {
    this.setState({ loading: true });

    if (!$.fn.DataTable.isDataTable("#myTable")) {
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
    await fetch(`${baseUrl}License/getAllLicense`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(responseJson);
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
        } else {
          this.setState({ data: responseJson, loading: false })
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

  getIndividualLicense = async (userid) => {
    const url = `${baseUrl}License/getlicenseByUserID/${userid}`;
    this.setState({ isLoading: true });
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
          licenceData: res,
        });


      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  }

  getLicenceDetails = async (userid) => {
    const url = `${baseUrl}License/getlicenseByUserID/${userid}`;
    this.setState({ isLoading: true });
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
          licenceData: res,
        });


      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  }


  showTable = () => {
    const { postsPerPage, currentPage, data } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    try {
      return typeof (data) !== undefined && currentPosts.map((item, index) => {
        return (
          <tr>
            <td className="text-xs font-weight-bold">{index + 1}</td>
            <td className="text-xs font-weight-bold">{item.title}</td>
            <td className="text-xs font-weight-bold">{item.surname + ' ' + item.othernames}</td>
            <td className="text-xs font-weight-bold">{(item.licensenumber)}</td>
            <td className={item.applicationstatus === "approved" ? 'badge bg-success mt-3' : item.applicationstatus == "pending" ? "badge bg-warning mt-3" : item.applicationstatus === "rejected" ? 'badge bg-danger mt-3' : ""}>{(item.applicationstatus)}</td>
            <td className="text-xs font-weight-bold">{moment(item.applicationdaterecieved).format('LL')}</td>
            <td className="text-xs font-weight-bold">{moment(item.licensedate).format('LL') === "Invalid date" ? null : moment(item.licensedate).format('LL')}</td>
            <td>
              <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{ fontSize: 'large' }} ></span></button>
              <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                {parseInt(localStorage.getItem("canView")) === 1 &&
                  <li className="mb-2">
                    <a className="dropdown-item border-radius-md" href="javascript:;">
                      <div className="d-flex py-1">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span id={item.userid} onClick={() => this.getIndividualLicense(item.userid)} className="font-weight-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">View Submission</span>
                        </h6>
                      </div>
                    </a>
                  </li>
                }
                {/*parseInt(localStorage.getItem("license")) === 1 &&
                        <li class="mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                          <a class="dropdown-item border-radius-md" href="javascript:;">
                            <div class="d-flex py-1">
                                <h6 class="text-sm font-weight-normal mb-1">
                                  <span id = { item.userid } onClick={() => this.getLicenceDetails(item.userid)} className="font-weight-bold">Upload Certificate</span>
                                </h6>
                            </div>
                          </a>
                        </li>
                   */   }

                {item.applicationstatus === "approved" && parseInt(localStorage.getItem("license")) === 1 &&
                  <li class="mb-2" data-bs-toggle="modal" data-bs-target="#viewCert">
                    <a class="dropdown-item border-radius-md" href="javascript:;">
                      <div class="d-flex py-1">
                        <h6 class="text-sm font-weight-normal mb-1">
                          <span id={item.userid} onClick={() => this.downloadCert(`${item.organization}, ${item.licensenumber}`)} className="font-weight-bold">View Certificate</span>
                        </h6>
                      </div>
                    </a>
                  </li>
                }

              </ul>
            </td>
            <td></td>
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

  showPagination = () => {
    const { postsPerPage, data } = this.state;
    const pageNumbers = [];
    const totalPosts = data.length;
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i)
    }

    const paginate = (pageNumbers) => {
      this.setState({ currentPage: pageNumbers })
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className={this.state.currentPage === number ? 'page-item active' : 'page-item'}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  componentDidMount() {
    this.showLicenses();
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="g-sidenav-show">
        <Sidebar />
        <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style={{ width: '80%', float: 'right' }}>
          <div class="container-fluid px-4">
            <div class="rown">
              <div class="col-12">
                <div class="card my-3">
                  <div class="card-header pb-4 bg-success">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                      <h5 className="text-light">All Licence Applications</h5>
                      {/*
                   <div class="d-flex align-items-center">
                     <button class="btn bg-gradient-primary mb-0"  data-bs-toggle="modal" data-bs-target="#exampleModal" > <span class="iconify" data-icon="carbon:add" style={{fontSize: 'large'}}></span>Create User</button>
                   </div> */}
                    </div>
                  </div>

                  <div class="card-body">
                    {this.state.loading ? <Spinner animation="border" style={{ position: 'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
                      <div class="container-fluid py-4">
                        <div class="table-responsive p-0 pb-2">
                          <table id="table" className="table align-items-center justify-content-center mb-0">
                            <thead>
                              <tr>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Title</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Name</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Licence No.</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Applied</th>
                                <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Date Approved</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Action</th>
                                <th></th>
                              </tr>
                            </thead>

                            <tbody>
                              {this.showTable()}
                            </tbody>
                          </table>
                          <div style={{ float: 'right' }}>
                            {this.showPagination()}
                          </div>
                        </div>
                      </div>}


                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header d-flex align-items-center justify-content-between">
                            <h5 class="modal-title">Modal title</h5>
                            <button type="button" class="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                          </div>
                          <div class="modal-body">
                            <div class="row">
                              <div class="col-12">
                                <div class="input-group input-group-outline mb-3">
                                  <label class="form-label">Text Input</label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-12">
                                <div class="input-group input-group-outline mb-3">
                                  {/* <!-- <label class="form-label">State</label> --> */}
                                  <select class="form-control">
                                    <option>Select Input</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-12">
                                <div class="input-group input-group-outline mb-3">
                                  <label class="form-label">Text Area</label>
                                  <textarea class="form-control"></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Modal2 --> */}
                    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header d-flex align-items-center justify-content-between">
                            <h5 class="modal-title">Upload Certificate</h5>
                            <button type="button" class="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                          </div>
                          <div class="modal-body">
                            {/*<div class="row">
            <div class="col-lg-12 col-md-4 col-sm-6">
              <label class="form-label">Number Type </label>
              <div class="input-group input-group-outline mb-3">
                <input type="text" class="form-control" placeholder="00123384743" aria-label="Disabled input example" disabled />
              </div>
            </div>
            <div class="col-lg-12 col-md-4 col-sm-6">
              <label class="form-label">Number Sub Type </label>
              <div class="input-group input-group-outline mb-3">
                <input type="text" class="form-control" placeholder="1234" aria-label="Disabled input example" disabled />
              </div>
            </div>
            <span class="pt-3"><hr class="dark horizontal my-3" /></span>
            <div class="table-responsive p-0 pb-2">
              <table class="table align-items-center justify-content-center mb-0">
                <tbody>
                  <div class="text-uppercase text-primary text-xs font-weight-bolder opacity-7 ps-2">Alocation Stage:</div>
                  <tr>
                    <td>
                      <span class="text-xs font-weight-bold text-primary">Fees:</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">$500</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">$500</span>
                    </td>
                    <td>
                      <span class="text-xs font-weight-bold">$500</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="text-xs font-weight-bold text-primary">Tax:</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">90%</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">90%</span>
                    </td>
                    <td>
                      <span class="text-xs font-weight-bold">90%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive p-0 pb-0 pt-2">
              <table class="table align-items-center justify-content-center mb-0">
                <tbody>
                  <div class="text-uppercase text-primary text-xs font-weight-bolder opacity-7 ps-2">Submission Stage:</div>
                  <tr>
                    <td>
                      <span class="text-xs font-weight-bold text-primary">Fees:</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">$500</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">$500</span>
                    </td>
                    <td>
                      <span class="text-xs font-weight-bold">$500</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="text-xs font-weight-bold text-primary">Tax:</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">90%</span>
                    </td>
                    <td>
                      <span class="text-sm font-weight-bold">90%</span>
                    </td>
                    <td>
                      <span class="text-xs font-weight-bold">90%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Save</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </body> */}


                    {/* View Modal */}
                    <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                          <div className="modal-header d-flex align-items-center justify-content-between" style={{ backgroundColor: '#00264C' }}>
                            <h5 className="modal-title text-light">Licence Details</h5>
                            <button type="button" className="btn btn-link m-0 p-0 text-light fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                          </div>
                          <div className="modal-body">
                            <div className="row">
                              <div clasNames="d-flex px-3">
                                {/*<div className="my-auto text-center">
                           <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                         </div> */}
                                {isLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center> :
                                  <div className="d-flex flex-column">
                                    {/*<h6 className="text-lg font-weight-normal mb-1">
                             <span className="font-weight-bold">NiCFOsT</span>
                           </h6> */}
                                    {this.state.licenceData.map((item) => {
                                      console.log(item)
                                      return (
                                        <div>
                                          <h4 className="text-dark text-uppercase ms-sm-4 ">{item.title + ' ' + item.surname + ' ' + item.othernames}</h4>
                                          <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                                          <div className="row">
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
                                                  value={moment(item.applicationdate).format('LL')}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Licence number
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.licensenumber}
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
                                                  value={moment(item.licensedate).format('LL')}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Licence expiry date
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={moment(item.licenseexpdate).format('LL')}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Licence remarks
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <textarea
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.licenseremarks}
                                                >
                                                </textarea>
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Date of birth
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={moment(item.DOB).format('LL')}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Previous surname
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.previoussurname}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Email
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.contactemail}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Phone
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.contacttelephone}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Tertiary Institution
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.tertiaryinstitution}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Course of Study
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.courseofstudy}
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
                                                  value={item.gender}
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
                                                  value={item.lga}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                State
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.state}
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
                                                  value={item.nationality}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Practice category
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.practicecategory}
                                                />
                                              </div>
                                            </div>

                                            <hr />

                                            <label
                                              className="mb-3 h4"
                                              style={{ color: "green" }}
                                              htmlFor="floatingInputCustom"
                                            >
                                              Qualification
                                            </label>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                First qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.qualification1}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Second qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.qualification2}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Third qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.qualification3}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Fourth qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.qualification4}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Fifth qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="text"
                                                  value={item.qualification5}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Year of qualification
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.yearofqualification}
                                                />
                                              </div>
                                            </div>
                                            <hr />

                                            <label
                                              className="mb-3 h4"
                                              style={{ color: "green" }}
                                              htmlFor="floatingInputCustom"
                                            >
                                              Previous Licence
                                            </label>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Date acquired
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={moment(item.previouslicensedate).format('LL')}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Previous licence number
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.previouslicensenumber}
                                                />
                                              </div>
                                            </div>

                                            <hr />
                                            <label
                                              className="mb-3 h4"
                                              style={{ color: "green" }}
                                              htmlFor="floatingInputCustom"
                                            >
                                              Place of work
                                            </label>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization name
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organization}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization name
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organization}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization address
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organizationaddress}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization email
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organizationemail}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization position
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organizationposition}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                              <label
                                                className="form-label"
                                              >
                                                Organization phone
                                              </label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  disabled
                                                  type="phone"
                                                  value={item.organizationtelephone}
                                                />
                                              </div>
                                            </div>

                                            <label
                                              className="h4"
                                              htmlFor="floatingInputCustom"
                                              style={{ color: "#145973" }}
                                            >
                                              Official
                                            </label>
                                            <br />
                                            <br />

                                            <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                              <label className="form-label">Application Status</label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className={item.applicationstatus === "approved" ? "form-control shadow-none bg-success text-center text-uppercase font-weight-bold text-light" : item.applicationstatus === "pending" ? "form-control text-center text-uppercase font-weight-bold text-light shadow-none bg-warning" : item.applicationstatus === "rejected" ? "form-control text-center text-uppercase font-weight-bold text-light shadow-none bg-danger" : "form-control shadow-none"}
                                                  type="text"
                                                  value={item.applicationstatus}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                              <label className="form-label">Licence Date</label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  type="text"
                                                  value={`${item.licensedate}`}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                              <label className="form-label">Licence Number</label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  type="text"
                                                  value={`${item.licensenumber}`}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                              <label className="form-label">Licence Remarks</label>
                                              <div className="input-group input-group-outline mb-3">
                                                <label className="form-label"></label>
                                                <input
                                                  className="form-control shadow-none"
                                                  type="text"
                                                  value={`${item.licenseremarks}`}
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

          {/* Certificate Modal */}
          <div class="modal fade" id="viewCert" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header bg-success d-flex align-items-center justify-content-between">
                  <h5 class="modal-title font-weight-bold text-light">Downloading Your File</h5>
                  <button type="button" class="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <embed type="application/pdf" src={this.state.licenceCertificate} width="600" height="400"></embed>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div class="d-flex align-items-center">

                        <div class="d-flex align-items-center">
                          <div>
                            {this.state.isDownloading && <Spinner animation="border" variant="danger" size="lg" />}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="modal-footer">
                  <button id="closeButton" type="button" class="btn btn-danger data" data-bs-dismiss="modal">Abort</button>
                </div>
              </div>
            </div>
          </div>


        </main >
      </div >
    )
  }

}

export default Licenses
