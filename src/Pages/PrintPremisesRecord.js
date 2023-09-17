import React, { Component } from "react";
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
// import $ from "jquery";
import moment from 'moment';
import ReactToPrint from "react-to-print";
import { DownloadExcel } from "react-excel-export";



class PrintPremisesRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      loading: false,
      isLoading: false,
      premisesData: [],
      postsPerPage: 10,
      currentPage: 1,
    }
  }
  print() {
    window.print()
  }

  downloadRecord = async () => {
    this.setState({ isDownloading: true });
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/csv",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Premises/download`, obj)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'premises.csv';
          a.click();
          this.setState({ isDownloading: false })
        });
      })
      .catch((error) => {
        this.setState({ isDownloading: false })
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  getSinglePremises = (userid) => {
    const url = `${baseUrl}Premises/getPremisesByUserID/${userid}`;
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
        // console.warn(res)
        this.setState({
          isLoading: false,
          premisesData: res,
        });


      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  }

  showPagination = () => {
    const { postsPerPage, data, filteredData } = this.state;
    const pageNumbers = [];
    const totalPosts = filteredData.length;
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

  showPremises = async () => {
    this.setState({ loading: true });

    // if (!$.fn.DataTable.isDataTable("#table")) {
    //     $(document).ready(function () {
    //       setTimeout(function () {
    //         $("#table").DataTable({
    //           pagingType: "full_numbers",
    //           pageLength: 20,
    //           processing: true,
    //           dom: "Bfrtip",
    //           select: {
    //             style: "single",
    //           },
    //
    //           buttons: [
    //             {
    //               extend: "pageLength",
    //               className: "btn btn-secondary bg-secondary",
    //             },
    //             {
    //               extend: "copy",
    //               className: "btn btn-secondary bg-secondary",
    //             },
    //             {
    //               extend: "csv",
    //               className: "btn btn-secondary bg-secondary",
    //             },
    //             {
    //               extend: "print",
    //               customize: function (win) {
    //                 $(win.document.body).css("font-size", "10pt");
    //                 $(win.document.body)
    //                   .find("table")
    //                   .addClass("compact")
    //                   .css("font-size", "inherit");
    //               },
    //               className: "btn btn-secondary bg-secondary",
    //             },
    //           ],
    //
    //           fnRowCallback: function (
    //             nRow,
    //             aData,
    //             iDisplayIndex,
    //             iDisplayIndexFull
    //           ) {
    //             var index = iDisplayIndexFull + 1;
    //             $("td:first", nRow).html(index);
    //             return nRow;
    //           },
    //
    //           lengthMenu: [
    //             [10, 20, 30, 50, -1],
    //             [10, 20, 30, 50, "All"],
    //           ],
    //           columnDefs: [
    //             {
    //               targets: 0,
    //               render: function (data, type, row, meta) {
    //                 return type === "export" ? meta.row + 1 : data;
    //               },
    //             },
    //           ],
    //         });
    //       }, 1000);
    //     });
    //   }

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
          this.setState({ data: responseJson, loading: false, filteredData: responseJson })
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


  showTable = () => {
    const { postsPerPage, currentPage, data, filteredData } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = parseInt(indexOfLastPost) - parseInt(postsPerPage);
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);
    try {
      return typeof (data) !== undefined && currentPosts.map((item, index) => {
        return (
          <tr>
            <td className="text-xs text-capitalize font-weight-bold">{postsPerPage * (currentPage - 1) + index + 1}</td>
            <td className="text-xs text-capitalize font-weight-bold">{(item.organisationname)}</td>
            <td className="text-xs text-capitalize font-weight-bold">{(item.businesstype)}</td>
            <td className={item.applicationstatus === "approved" ? 'badge bg-success mt-3' : item.applicationstatus == "pending" ? "badge bg-warning mt-3" : item.applicationstatus === "rejected" ? 'badge bg-danger mt-3' : ""}>{(item.applicationstatus)}</td>
            <td className="text-xs text-capitalize font-weight-bold">{(item.applicationdate)}</td>

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

  componentDidMount() {
    this.setState({ filteredData: this.state.data });
    this.showPremises();
  }
  handleFilterChange = (e) => {
    const filterValue = e.target.value;
    this.setState({ filterValue }, () => {
      const filteredData = this.state?.data?.filter(item =>
        item?.organisationname?.toLowerCase()?.includes(filterValue?.toLowerCase())

      );
      this.setState({ filteredData });
    });
  };


  render() {
    const { isLoading } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>
          <div className="col-md-10">
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " id="dashboard">
              <div class="container-fluid px-4">
                <div class="rown">
                  <div class="col-12">
                    <div class="card my-3">
                      <div class="card-header pb-4 bg-light">
                        <div class="d-flex flex-wrap align-items-center justify-content-between">
                          <h5 className="text-dark">All Premises Applications</h5>
                          <div class="d-flex flex-wrap align-items-center justify-content-between">
                            <button className="text-dark btn btn-light btn-lg" style={{ marginRight: 18 }} onClick={() => this.print()}>Print</button>

                            <button disabled={this.state.loading} onClick={() => this.downloadRecord()} className="btn btn-lg btn-primary">
                              {this.state.isDownloading ? (
                                <Spinner animation="border" variant="light" size="sm" />
                              ) : (
                                "Export as Excel"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="card-body">

                        {this.state.loading ? <Spinner animation="border" style={{ position: 'relative', left: 450, top: 0 }} className="text-center" variant="success" size="lg" /> :
                          <div class="container-fluid py-4">
                            <div className="d-flex justify-content-end">
                              <input onChange={this.handleFilterChange} type="text" id="myInput" className="outline-none h-10 m-2" placeholder="Search for org.." title="Type in a name" />
                            </div>
                            <div class="table-responsive p-0 pb-2">
                              <table id="table" className="table align-items-center justify-content-center mb-0">
                                <thead>
                                  <tr>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Organization</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Business Type</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Date</th>
                                    <th></th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {this.showTable()}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ float: 'right' }}>
                              {this.showPagination()}
                            </div>
                          </div>
                        }
                        {/* <Footer /> */}
                        {/* View Modal */}
                        <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                              <div className="modal-header d-flex align-items-center justify-content-between" style={{ backgroundColor: '#00264C' }}>
                                <h5 className="modal-title text-light">Premises Details</h5>
                                <button type="button" className="btn btn-link m-0 p-0 text-light fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div clasNames="d-flex px-3">
                                    <div className="my-auto text-center">
                                      <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 " />
                                    </div>
                                    {isLoading ? <Spinner animation="border" style={{ position: 'relative', left: 680, top: 250 }} className="text-center" variant="success" size="lg" /> :
                                      <div className="d-flex flex-column">
                                        {/*<h6 className="text-lg font-weight-normal mb-1">
                             <span className="font-weight-bold">NiCFOsT</span>
                           </h6> */}
                                        {this.state.premisesData.map((item) => {
                                          return (
                                            <div>
                                              <h4 className="text-dark text-uppercase ms-sm-4 ">{item.organisationname}</h4>
                                              <span className="pt-3"><hr class="dark horizontal my-3" /></span>

                                              <div className="row">

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
                                                      value={item.registrationnumber}
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
                                                      value={moment(item.applicationdate).format('LL')}
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
                                                      value={item.applicationstatus}
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
                                                    Business type
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={item.businesstype}
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
                                                      value={item.businessdescription}
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
                                                      value={item.productbrands}
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
                                                      value={moment(item.inspectiondate).format('LL')}
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
                                                      value={item.inspectionfees}
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
                                                      value={item.inspectionfollowup}
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
                                                      value={item.inspectionfees}
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
                                                      value={item.inspectionstatus}
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
                                                      value={item.inspectionteamleadername}
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
                                                      value={item.inspectionteamleadercomment}
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
                                                      value={item.leadfoodscientistname}
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
                                                      value={item.leadfoodscientistlicensenumber}
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
                                                    Address
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={item.locationaddress}
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
        </div>
      </div>
    )
  }
}

export default PrintPremisesRecord;
