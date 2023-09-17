import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import coat from "../assets/images/coat.png";
import logo from "../assets/images/logo.png";
import moment from 'moment';
import DatePicker from 'react-date-picker';
import Sidebar from '../Components/Sidebar';
let PASSPORT_FILEBASE64 = "";

class Inspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      inspectionData: [],
      postsPerPage: 10,
      currentPage: 1,
      imageReport: '',
      status: '',
      loading: true,
      noRecords: false,
      isInspectionLoading: false,
      isCanceling: false,
      isBooking: false,
      checkRejectStatus: true,
      followUpRemarks: "",
      companySize: [],
      size: '',
      // inspectorComments: "",
      inspectorName: "",
      rejectedComment: "",
      recid: "",
      bookrecid: "",
      approvalDate: "",
      inspectionDate: "",

      //COLOR VARIABLES
      colorStatus: 'black',
      colorSize: 'black',
      colorRemarks: 'black',
      colorComments: 'black',
      colorInspectorName: 'black',
      colorApproval: 'black',
      reportImageColor: 'black',
      inspectionDateColor: 'black',
    }
    this.handleReportImage = this.handleReportImage.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleInspectionDateChange = this.handleInspectionDateChange.bind(this);
    this.handleCompanySizeChange = this.handleCompanySizeChange.bind(this);
  }
  handleStatusChange(e) {
    this.setState({ status: e.target.value });
  }
  handleDateChange(date) {
    this.setState({
      approvalDate: date
    })
  }

  print() {
    window.print()
  }

  handleInspectionDateChange(date) {
    this.setState({
      inspectionDate: date
    })
  }
  handleCompanySizeChange(e) {
    this.setState({
      size: e.target.value
    })
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

  async handleReportImage(e) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);

      fileReader.onload = () => {
        resolve(fileReader.result);
        PASSPORT_FILEBASE64 = fileReader.result
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  getInspectionRecordId = (recid) => {
    this.setState({ recid: recid })
  }
  getBookRecordId = (recid) => {
    this.setState({ bookrecid: recid })
  }

  getCompanySize = async () => {
    const url = `${baseUrl}Fees/getFeesByPaymentType/corporate`;
    this.setState({ isLoading: true });
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 401) {
          Swal.fire({
            title: "Session Expired",
            text: "Session expired. Please login",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            this.props.history.push("/login");
          });
        } else {
          console.warn(res);
          this.setState({ companySize: res })
          // console.warn(res);
        }
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  }


  showCompanySize() {
    return this.state.companySize.map((item) => {
      return (
        <option disabled={item.paymentcategory !== "annual" ? 'disabled' : null} value={`${item.paymenttype},${item.amount}, ${item.description}, ${item.paymentcategory}, ${item.paymentsubcategory}, ${item.remitaid}`}>{item.paymentcategory === "annual" ? item.paymentsubcategory : null}</option>
      )
    });
  }


  bookInspection = async () => {
    if (this.state.inspectionDate === "") {
      Swal.fire({
        title: "Empty",
        text: "Please enter inspection date",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ inspectionDateColor: 'red' })
    } else {
      this.setState({ isBooking: true, isDisabled: true });
      var obj = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          inspectiondate: this.state.inspectionDate,
          inspectionstatus: "booked",
          recid: this.state.bookrecid
        }),
      };
      await fetch(`${baseUrl}Inspection/bookInspection`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.warn(responseJson);
          if (responseJson.message === "Inspection booked Successfully") {
            Swal.fire({
              title: "Success",
              text: 'Inspection Booked Successfully',
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload()
            })
          }
        })
        .catch((error) => {
          this.setState({ isBooking: false, isDisabled: false });
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    };
  };

  addInspection = async () => {
    this.setState({ isSubmitting: true });
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        inspectionstatus: this.state.status,
        recid: this.state.recid,
        reportToBase64String: PASSPORT_FILEBASE64,
        reportdate: this.state.approvalDate

      }),
    };
    await fetch(`${baseUrl}Inspection/submitInspection`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.message === "Inspection Report Submitted Successfully") {
          this.addInspectionOfficial();
        }
      })
      .catch((error) => {
        this.setState({ isSubmitting: false, disabled: false });
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  addInspectionOfficial = async () => {
    this.setState({ isSubmitting: true });
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        approvedate: this.state.approvalDate,
        companysize: this.state.size,
        inspectionstatus: this.state.status,
        recid: this.state.recid,
        remarks: this.state.followUpRemarks
      }),
    };
    await fetch(`${baseUrl}Inspection/inspectionOfficial`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson.message === "Inspection Official Details Updated Successfully") {
          Swal.fire({
            title: "Success",
            text: 'Inspection Official Details Updated Successfully',
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload()
          })
        }
      })
      .catch((error) => {
        this.setState({ isSubmitting: false, disabled: false });
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  getInspectionDetails = (recid) => {
    const url = `${baseUrl}Inspection/getInspectionByRecID/${recid}`;
    this.setState({ isInspectionLoading: true });
    fetch(url, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        this.setState({
          isInspectionLoading: false,
          inspectionData: res,
        });
      })
      .catch(error => {
        this.setState({ error: true, isInspectionLoading: false });
        alert(error);
      });
  }

  cancelInspection = (recid) => {
    this.setState({ isCanceling: true })
    const url = `${baseUrl}Inspection/removeRecord/${recid}`;
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
        console.warn(res.status);
        console.warn(res);
        if (res.message === "Record removed successfully") {
          this.setState({ isCanceling: false });
          Swal.fire({
            title: "Success",
            text: "Record removed successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload()
            // this.props.history.push("/new-registrations")
          })
        } else {
          Swal.fire({
            title: "Error",
            text: res.message,
            icon: "error",
            confirmButtonText: "OK",
          })
          this.setState({ isCanceling: false });
        }
      })
      .catch(error => {
        this.setState({ isCanceling: false });
        alert(error);
      });
  }

  showTable = () => {
    const { postsPerPage, currentPage, data, filteredData } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

    try {
      return typeof (data) !== undefined && currentPosts.map((item, index) => {
        return (
          <tbody>
            <tr>
              <td>
                <span className="text-xs font-weight-bold">{postsPerPage * (currentPage - 1) + index + 1}</span>
              </td>
              <td className="text-xs text-secondary text-capitalize font-weight-bold">{item.organisationname}</td>
              <td className="text-xs font-weight-bold">{item.addressstreet}</td>
              <td className="text-xs font-weight-bold">{item.businesstype}</td>
              <td className={item.inspectionstatus !== null ? (item.inspectionstatus.toLowerCase() === "approved" ? 'badge bg-success' : item.inspectionstatus.toLowerCase() === "pending" ? 'badge bg-warning' : item.inspectionstatus.toLowerCase() === "rejected" ? "badge bg-danger" : '') : null}>{(item.inspectionstatus !== null ? item.inspectionstatus : null)}</td>
              <td className="text-xs font-weight-bold">{moment(item.applicationdate).format('LL') === "Invalid date" ? null : moment(item.applicationdate).format('LL')}</td>
              <td>
                <button className="btn btn-primary-2 mb-0" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"><span class="iconify" data-icon="charm:menu-meatball" style={{ fontSize: 'large' }} ></span></button>
                <ul className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="#dropdownMenuButton2">
                  {parseInt(localStorage.getItem("canView")) === 1 &&
                    <li className="mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <h6 className="text-sm font-weight-normal mb-1">
                            <span id={item.recid} onClick={() => this.getInspectionDetails(item.recid)} className="font-weight-bold">View</span>
                          </h6>
                        </div>
                      </a>
                    </li>
                  }
                  {parseInt(localStorage.getItem("inspection")) === 1 &&
                    <li className="mb-2" data-bs-toggle="modal" data-bs-target="#bookInspection">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <h6 className="text-sm font-weight-normal mb-1">
                            <span id={item.recid} onClick={() => this.getBookRecordId(item.recid)} className="font-weight-bold">Book Inspection</span>
                          </h6>
                        </div>
                      </a>
                    </li>
                  }
                  {parseInt(localStorage.getItem("inspection")) === 1 &&
                    <li className="mb-2" data-bs-toggle="modal" data-bs-target="#submitInspection">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <h6 className="text-sm font-weight-normal mb-1">
                            <span id={item.recid} onClick={() => this.getInspectionRecordId(item.recid)} className="font-weight-bold">Submit Inspection Report</span>
                          </h6>
                        </div>
                      </a>
                    </li>
                  }
                  {parseInt(localStorage.getItem("inspection")) === 1 &&
                    <li className="mb-2" data-bs-toggle="modal" data-bs-target="#cancel">
                      <a className="dropdown-item border-radius-md" href="javascript:;">
                        <div className="d-flex py-1">
                          <h6 className="text-sm text-danger font-weight-normal mb-1">
                            <span id={item.recid} className="font-weight-bold">Cancel Inspection</span>
                          </h6>
                        </div>
                      </a>
                    </li>
                  }
                </ul>
              </td>
              {/* Start of Cancel Inspection */}
              <div class="modal fade" id="cancel" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header bg-danger">
                      <h5 class="modal-title text-uppercase font-weight-bold text-light" id="exampleModalLabel">Cancel Inspection Application</h5>
                      <button type="button" class="btn-close text-light bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      Are you sure you want to cancel this inspection application? <br />You cannot UNDO this action.
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="btn btn-danger" id={item.formid} onClick={() => this.cancelInspection(item.recid)}>{this.state.isCanceling ? <Spinner animation="border" className="text-center" variant="light" size="lg" /> : "Yes, Continue"}</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*End of Cancel Inspection */}

              {/* Start of Book Inspection */}
              <div class="modal fade" id="bookInspection" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header bg-success">
                      <h5 class="modal-title text-uppercase font-weight-bold text-light" id="exampleModalLabel">Schedule Inspection</h5>
                      <button type="button" class="btn-close text-light bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                        <label
                          style={{ color: this.state.inspectionDateColor }}
                          className="form-label"
                        >
                          Inspection Date <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <DatePicker
                            selected={this.state.inspectionDate}
                            calendarAriaLabel="Select date of birth"
                            className="input-group form-control shadow-none mr-1 mb-3"
                            value={this.state.inspectionDate}
                            onChange={this.handleInspectionDateChange}
                            name="startDate"
                            dateFormat="MM/dd/yyyy" />
                        </div>
                      </div>

                      <button
                        disabled={this.state.isDisabled}
                        style={{
                          alignSelf: "center",
                          width: "100%",
                          backgroundColor: "#003314",
                        }}
                        type="button"
                        className="btn btn-success btn-lg"
                        onClick={() => this.bookInspection()}
                      >
                        {this.state.isBooking ? (
                          <Spinner animation="border" variant="light" size="sm" />
                        ) : (
                          <span className="font-weight-bold">
                            {/* APPLY <i class="fas fa-chevron-right"></i> */}
                            BOOK INSPECTION
                          </span>
                        )}
                      </button>


                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*End of Book Inspection */}
            </tr>
          </tbody>
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

  checkValidation = () => {
    const { followUpRemarks, size, approvalDate, status, colorStatus, colorRemarks, colorSize, colorComments, colorInspectorName, reportImageColor, colorApproval } = this.state;
    if (status === "") {
      Swal.fire({
        title: "Empty",
        text: "Please select approval status",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ colorStatus: 'red' })
    } else if (size === "") {
      Swal.fire({
        title: "Empty",
        text: "Please select company size",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ colorSize: 'red' })
    }
    else if (followUpRemarks === "") {
      Swal.fire({
        title: "Empty",
        text: "Please indicate follow-up remarks",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ colorRemarks: 'red' })
    } else if (approvalDate === "") {
      Swal.fire({
        title: "Empty",
        text: "Please indicate date of approval",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ colorApproval: 'red' })
    } else {
      this.addInspection()
    }
  }


  retrieveInspections = async () => {
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Inspection/getAllInspection`, obj)
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
        } else if (responseJson.length <= 0) {
          this.setState({ noRecords: true, loading: false })
        } else {
          // console.warn(responseJson);
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
  }


  componentDidMount() {
    this.retrieveInspections();
    this.getCompanySize();
    this.setState({ filteredData: this.state.data });
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
    const { loading, noRecords, showSearchResults, isDisabled, isSubmitting, isLoading, isInspectionLoading } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>

          <div className="col-md-10">
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" id="dashboard">
              {!showSearchResults &&
                <div class="container-fluid px-4">
                  <div class="rown">
                    <div class="col-12">
                      <div class="card my-3">
                        <div class="card-header pb-2" style={{ backgroundColor: '#00264C' }}>
                          <div class="d-flex flex-wrap">
                            <h5 className="text-light">Manage All Inspections</h5>
                          </div>
                        </div>
                        <div class="card-body">

                          {loading ? <center><Spinner animation="border" variant="success" size="lg" className="text-center" /></center> :
                            <div class="table-responsive p-0 pb-2">
                              <div className="d-flex justify-content-end">
                                <input onChange={this.handleFilterChange} type="text" id="myInput" className="outline-none h-10 m-2" placeholder="Search for org.." title="Type in a name" />
                              </div>
                              <table id="table" className="table align-items-center justify-content-center mb-0">
                                <thead>
                                  <tr>
                                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">S/N</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Organization</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Address</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Business Type</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Status</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Application Date</th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">Action</th>
                                  </tr>
                                </thead>
                                {this.showTable()}
                              </table>
                              {noRecords && <center><p>No inspection record found.</p></center>}
                            </div>}

                          <div style={{ float: 'right' }}>
                            {this.showPagination()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {/* View Modal */}
              <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header d-flex align-items-center justify-content-between bg-success">
                      <h5 className="modal-title text-light">Inspection Details</h5>
                      <button className="text-light btn btn-primary btn-lg text-light" style={{ marginRight: 18 }} onClick={() => this.print()}>Print</button>
                      <button type="button" className="btn btn-link m-0 p-0 text-dark fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                    </div>
                    <div className="text-center container-fluid px-4 d-flex justify-content-between" style={{ width: '100%', justifyContent: 'space-evenly', alignItems: 'center', position: 'relative', top: 18 }}>
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
                          {/*
                <div className="my-auto text-center">
                  <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
                </div> */}
                          {isInspectionLoading ? <center><Spinner animation="border" className="text-center" variant="success" size="lg" /></center> :
                            <div className="d-flex flex-column">
                              {this.state.inspectionData.length > 0 && this.state.inspectionData.map((item) => {
                                return (
                                  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{ width: !localStorage.getItem("token") ? '90%' : '100%', position: localStorage.getItem("token") ? 'relative' : '', right: 0, padding: 18, float: !localStorage.getItem("token") ? '' : 'right', marginBottom: 90 }}>
                                    <div className="container-fluid px-4">
                                      <div className="rown">
                                        <div className="col-12">
                                          <div className="card my-3 mb-4">
                                            <div className="card-header pb-0 bg-success">
                                              <div className="text-center">
                                                <h5 className="text-light text-center font-weight-bold mb-4">{`Inspection Registration Details`}</h5>
                                              </div>
                                            </div>
                                            {/* <div class="card-body"> */}
                                            <div className="container" style={{ marginTop: 18, padding: 9 }}>
                                              <div style={{ marginTop: 0 }}></div>
                                              <form className="row">

                                                <label
                                                  className="mb-3 h4"
                                                  style={{ color: "green" }}
                                                  htmlFor="floatingInputCustom"
                                                >
                                                  Orgnainzation Information
                                                </label>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    style={{ color: this.state.colorSurname }}
                                                    className="form-label"
                                                  >
                                                    Organization Name <span className="text-danger">*</span>
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control w-50 shadow-none"
                                                      type="text"
                                                      required="required"
                                                      value={item.organisationname}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Address
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <textarea
                                                      className="form-control w-50 shadow-none"
                                                      rows="2"
                                                      value={item.addressstreet}
                                                    ></textarea>
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Address LGA <span className="text-danger">*</span>
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={item.addresslga}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label"
                                                  >
                                                    Address State <span className="text-danger">*</span>
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={item.addressstate}
                                                    />
                                                  </div>
                                                </div>


                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Business Type
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={item.businesstype}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Business Description
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      type="text"
                                                      className="form-control shadow-none"
                                                      value={item.businessdescription}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Product Brand
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      type="text"
                                                      className="form-control shadow-none"
                                                      value={item.productbrands}
                                                    />
                                                  </div>
                                                </div>

                                                <label
                                                  className="mb-3 h4"
                                                  style={{ color: "green" }}
                                                  htmlFor="floatingInputCustom"
                                                >
                                                  Contact Information
                                                </label>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Contact Name
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      type="text"
                                                      className="form-control shadow-none"
                                                      value={item.contactname}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Contact Email
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      required="required"
                                                      value={item.contactemail}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Contact Phone
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={item.contactphone}
                                                    />
                                                  </div>
                                                </div>


                                                <label
                                                  className="mb-3 h4"
                                                  style={{ color: "green" }}
                                                  htmlFor="floatingInputCustom"
                                                >
                                                  Official Remarks
                                                </label>
                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Application Date
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={moment(item.applicationdate).format('LL')}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Inspection Date
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={moment(item.inspectiondate).format('LL')}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Status
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className={item.inspectionstatus.toLowerCase() === "pending" ? 'form-control bg-warning text-light shadow-none' : item.inspectionstatus.toLowerCase() === "approved" ? 'form-control bg-success text-light' : item.inspectionstatus.toLowerCase() === "rejected" ? 'form-control bg-danger text-light' : ''}
                                                      type="text"
                                                      value={item.inspectionstatus}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-6 mb-3">
                                                  <label
                                                    className="form-label text-dark"
                                                  >
                                                    Remarks
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      disabled
                                                      className="form-control shadow-none"
                                                      type="text"
                                                      value={item.remarks}
                                                    />
                                                  </div>
                                                </div>

                                              </form>
                                            </div>

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </main>
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

              {/* Start of Submit Inspection */}
              <div class="modal fade" id="submitInspection" tabindex="-1" aria-labelledby="submitInspection" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header d-flex align-items-center justify-content-between bg-success">
                      <h5 class="modal-title text-light font-weight-bold">Submit Inspection Report</h5>
                      <button type="button" class="btn btn-link m-0 p-0 text-light fs-4" data-bs-dismiss="modal" aria-label="Close"><span class="iconify" data-icon="carbon:close"></span></button>
                    </div>
                    <div class="modal-body">
                      <div class="container-fluid px-4">
                        <div class="rown">
                          <div class="col-12">
                            <div>
                              <div class="card-body">
                                <form id="payment-form">

                                  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                    <label
                                      style={{ color: this.state.colorStatus }}
                                      className="form-label"
                                    >
                                      Status <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <select
                                        className="form-control shadow-none"
                                        aria-label="Select"
                                        onChange={this.handleStatusChange}
                                      >
                                        <option selected disabled>
                                          -- Select status --
                                        </option>
                                        <option value="APPROVED">APPROVED</option>
                                        <option value="REJECTED">REJECTED</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                    <label
                                      style={{ color: this.state.colorSize }}
                                      className="form-label"
                                    >
                                      Company Size <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <select
                                        className="form-control shadow-none"
                                        aria-label="Select"
                                        onChange={this.handleCompanySizeChange}
                                      >
                                        <option selected disabled>
                                          -- Select status --
                                        </option>
                                        {this.showCompanySize()}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                    <label
                                      className="form-label"
                                      style={{ color: this.state.colorRemarks }}
                                    >
                                      Remarks <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <input
                                        className="form-control shadow-none"
                                        onChange={(e) =>
                                          this.setState({ followUpRemarks: e.target.value })
                                        }
                                        type="text"
                                      />
                                    </div>
                                  </div>

                                  {/*  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                        <label
                          className="form-label"
                          style={{ color: this.state.colorComments}}
                        >
                          Inspector's Comments <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <input
                            className="form-control shadow-none"
                            onChange={(e) =>
                              this.setState({ inspectorComments: e.target.value })
                            }
                            type="text"
                          />
                        </div>
                      </div> */}

                                  {/*  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                        <label
                          className="form-label"
                          style={{ color: this.state.colorInspectorName}}
                        >
                          Inspector's Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label"></label>
                          <input
                          onChange={(e) =>
                            this.setState({ inspectorName: e.target.value })
                          }
                            className="form-control shadow-none"
                            type="text"
                          />
                        </div>
                      </div> */}

                                  <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                    <label
                                      style={{ color: this.state.colorApproval }}
                                      className="form-label"
                                    >
                                      Approval Date <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group input-group-outline mb-3">
                                      <label className="form-label"></label>
                                      <DatePicker
                                        selected={this.state.approvalDate}
                                        calendarAriaLabel="Select date of birth"
                                        className="input-group form-control shadow-none mr-1 mb-3"
                                        value={this.state.approvalDate}
                                        onChange={this.handleDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy" />
                                    </div>
                                  </div>

                                  <div className="col-sm-6 col-lg-12 col-md-4 mb-3">
                                    <label
                                      style={{ color: this.state.reportImageColor }}
                                      htmlFor="floatingInputCustom"
                                    >
                                      Upload Report Image
                                    </label>

                                    <div className="col-sm-6 col-lg-12 col-md-6 mb-3">
                                      <input
                                        className="form-control shadow-none"
                                        type="file"
                                        required="required"
                                        onChange={this.handleReportImage}
                                      />
                                    </div>
                                  </div>

                                  {this.state.status === "REJECTED" &&
                                    <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                      <label
                                        className="form-label text-danger"
                                      >
                                        State Reason(s) For Rejection
                                      </label>
                                      <div className="input-group input-group-outline mb-3">
                                        <label className="form-label"></label>
                                        <input
                                          onChange={(e) =>
                                            this.setState({ rejectedComment: e.target.value })
                                          }
                                          className="form-control shadow-none"
                                          type="text"
                                        />
                                      </div>
                                    </div>
                                  }

                                  <button
                                    disabled={isDisabled}
                                    style={{
                                      alignSelf: "center",
                                      width: "100%",
                                      backgroundColor: "#003314",
                                    }}
                                    type="button"
                                    className="btn btn-success btn-lg"
                                    onClick={() => this.checkValidation()}
                                  >
                                    {isSubmitting ? (
                                      <Spinner animation="border" variant="light" size="sm" />
                                    ) : (
                                      <span className="font-weight-bold">
                                        {/* APPLY <i class="fas fa-chevron-right"></i> */}
                                        SUBMIT APPLICATION
                                      </span>
                                    )}
                                  </button>

                                </form>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>


                    <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of Submit Inspection*/}
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default Inspection;
