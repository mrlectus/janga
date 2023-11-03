import React, { Component } from "react";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { Spinner } from "react-bootstrap";
import "jquery/dist/jquery.min.js";
import axios from "axios";
import coat from "../assets/images/coat.png";
import logo from "../assets/images/logo.png";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import $ from "jquery";
import moment from "moment";
import pdf from "../assets/images/pdf.jpg";

class Premises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      loading: false,
      isLoading: false,
      isDownloading: false,
      premisesData: [],
      postsPerPage: 10,
      currentPage: 1,
      premisesCertificate: "",
    };
  }

  print() {
    window.print();
  }

  getSinglePremises = (userid) => {
    const url = `${baseUrl}Premises/getPremisesByUserID/${userid}`;
    this.setState({ isLoading: true });
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.warn(res);
        this.setState({
          isLoading: false,
          premisesData: res,
        });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  };

  getCertificate = async (values) => {
    this.setState({ isDownloading: true });
    let val = values.split(",");
    try {
      const apiUrl = `${baseUrl}eservices/GetPremisesFile??timestamp=${Date.now()}`;
      const payload = {
        nameOfCompany: val[3],
        addressOfPremises: val[0],
        regNumber: val[2],
        categoryOfBusiness: val[1],
        nameOfLeadScientist: val[4],
        cfsnNo: val[2],
        validTillDate: "31 December 2023",
        id: val[2],
      };

      const headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      };
      const response = await axios.post(apiUrl, payload, {
        responseType: "blob",
        headers: headers,
      });
      let url = window.URL.createObjectURL(response.data);
      let a = document.createElement("a");
      a.href = url;
      a.download = "premises.pdf";
      this.setState({ premisesCertificate: url });
      this.setState({ isDownloading: false });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  showPagination = () => {
  const { postsPerPage, data, currentPage } = this.state;
  const totalPosts = data.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const maxVisiblePages = 5; // Maximum number of visible page buttons
  const pageNumbers = [];
  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    // If total pages are less than or equal to maxVisiblePages, show all pages.
    startPage = 1;
    endPage = totalPages;
  } else {
    // Calculate the start and end page numbers based on current page and maxVisiblePages.
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxVisiblePages / 2);
      endPage = currentPage + Math.floor(maxVisiblePages / 2);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPage = (page) => {
    this.setState({ currentPage: page });
  };

  return (
    <nav>
      <ul className="pagination">
        {startPage > 1 && (
          <li key={1} className="page-item">
            <button onClick={() => goToPage(1)} className="page-link">
              1
            </button>
          </li>
        )}
        {startPage > 2 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={
              currentPage === number ? "page-item active" : "page-item"
            }
          >
            <button onClick={() => goToPage(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        {endPage < totalPages - 1 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        {endPage < totalPages && (
          <li key={totalPages} className="page-item">
            <button onClick={() => goToPage(totalPages)} className="page-link">
              {totalPages}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};


  showPremises = async () => {
    this.setState({ loading: true });
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
          this.setState({
            data: responseJson,
            loading: false,
            filteredData: responseJson,
          });
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
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);
    try {
      return (
        typeof data !== undefined &&
        currentPosts.map((item, index) => {
          return (
            <tr>
              <td className="text-xs text-capitalize font-weight-bold">
                {postsPerPage * (currentPage - 1) + index + 1}
              </td>
              <td className="text-xs text-capitalize font-weight-bold">
                {item.organisationname}
              </td>
              <td className="text-xs text-capitalize font-weight-bold">
                {item.businesstype}
              </td>
              <td
                className={
                  item.inspectionstatus === "approved"
                    ? "badge bg-success mt-3"
                    : item.inspectionstatus == "pending"
                    ? "badge bg-warning mt-3"
                    : item.inspectionstatus === "rejected"
                    ? "badge bg-danger mt-3"
                    : ""
                }
              >
                {item.inspectionstatus}
              </td>
              <td className="text-xs text-capitalize font-weight-bold">
                {moment(item.applicationdate).format("LL")}
              </td>
              <td>
                <button
                  className="btn btn-primary-2 mb-0"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    class="iconify"
                    data-icon="charm:menu-meatball"
                    style={{ fontSize: "large" }}
                  ></span>
                </button>
                <ul
                  className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
                  aria-labelledby="#dropdownMenuButton2"
                >
                  <li className="mb-2">
                    <a
                      className="dropdown-item border-radius-md"
                      href="javascript:;"
                    >
                      <div className="d-flex py-1">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span
                            id={item.userid}
                            onClick={() => this.getSinglePremises(item.userid)}
                            className="font-weight-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal1"
                          >
                            View Submission
                          </span>
                        </h6>
                      </div>
                    </a>
                  </li>

                  <li className="mb-2">
                    <a
                      className="dropdown-item border-radius-md"
                      href="javascript:;"
                    >
                      <div className="d-flex py-1">
                        <h6 className="text-sm font-weight-normal mb-1">
                          <span
                            id={item.userid}
                            onClick={() =>
                              this.getCertificate(
                                `${item.locationaddress}, ${item.businesstype}, ${item.registrationnumber}, ${item.organisationname}, ${item.leadfoodscientistname}, ${item.registrationnumber} `,
                              )
                            }
                            className="font-weight-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#viewCert"
                          >
                            View Certificate
                          </span>
                        </h6>
                      </div>
                    </a>
                  </li>
                </ul>
              </td>

              <td></td>
            </tr>
          );
        })
      );
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        type: "error",
      });
    }
  };

  componentDidMount() {
    this.showPremises();
    this.setState({ filteredData: this.state.data });
  }

  handleFilterChange = (e) => {
    const filterValue = e.target.value;
    this.setState({ filterValue }, () => {
      const filteredData = this.state?.data?.filter((item) =>
        item?.organisationname
          ?.toLowerCase()
          ?.includes(filterValue?.toLowerCase()),
      );
      this.setState({ filteredData });
    });
    this.setState({ currentPage: 1 });
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
            <main
              class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
              id="dashboard"
            >
              <div class="container-fluid px-4">
                <div class="rown">
                  <div class="col-12">
                    <div class="card my-3">
                      <div class="card-header pb-4 bg-success">
                        <div class="d-flex flex-wrap align-items-center justify-content-between">
                          <h5 className="text-light">
                            All Premises Applications
                          </h5>
                          {/*
                   <div class="d-flex align-items-center">
                     <button class="btn bg-gradient-primary mb-0"  data-bs-toggle="modal" data-bs-target="#exampleModal" > <span class="iconify" data-icon="carbon:add" style={{fontSize: 'large'}}></span>Create User</button>
                   </div>
                   */}
                        </div>
                      </div>

                      <div class="card-body">
                        {this.state.loading ? (
                          <Spinner
                            animation="border"
                            style={{ position: "relative", left: 450, top: 0 }}
                            className="text-center"
                            variant="success"
                            size="lg"
                          />
                        ) : (
                          <div class="container-fluid py-4">
                            <div className="d-flex justify-content-end">
                              <input
                                onChange={this.handleFilterChange}
                                type="text"
                                id="myInput"
                                className="outline-none h-10 m-2"
                                placeholder="Search for org.."
                                title="Type in organisation"
                              />
                            </div>
                            <div class="table-responsive p-0 pb-2">
                              <table
                                id="table"
                                className="table align-items-center justify-content-center mb-0"
                              >
                                <thead>
                                  <tr>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      S/N
                                    </th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Organization
                                    </th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Business Type
                                    </th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Application Status
                                    </th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Application Date
                                    </th>
                                    <th className="text-capitalize text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Action
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>

                                <tbody>{this.showTable()}</tbody>
                              </table>
                            </div>
                            <div style={{ float: "right" }}>
                              {this.showPagination()}
                            </div>
                          </div>
                        )}
                        {/* <Footer /> */}
                        {/* View Modal */}
                        <div
                          className="modal fade"
                          id="exampleModal1"
                          tabindex="-1"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                              <div className="modal-header d-flex align-items-center justify-content-between bg-success">
                                <h5 className="modal-title text-light">
                                  Premises Details
                                </h5>
                                <button
                                  className="text-light btn btn-primary btn-lg text-light"
                                  style={{ marginRight: 18 }}
                                  onClick={() => this.print()}
                                >
                                  Print
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-link m-0 p-0 text-light fs-4"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="carbon:close"
                                  ></span>
                                </button>
                              </div>
                              <div
                                className="text-center container-fluid px-4 d-flex justify-content-between"
                                style={{
                                  width: "100%",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  position: "relative",
                                  top: 18,
                                }}
                              >
                                <div>
                                  <img
                                    src={logo}
                                    className="navbar-brand-img"
                                    alt="main_logo"
                                    style={{ width: 81 }}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-weight-bold text-center">
                                    NIGERIAN COUNCIL OF FOOD SCIENCE AND
                                    TECHNOLOGY (NiCFoST)
                                  </h4>
                                </div>
                                <div>
                                  <img
                                    src={coat}
                                    className="navbar-brand-img h-100"
                                    style={{ width: 126 }}
                                    alt="main_logo"
                                  />
                                </div>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div clasNames="d-flex px-3">
                                    <div className="my-auto text-center">
                                      <img
                                        src="../assets/img/account.svg"
                                        className="avatar avatar-exbg  me-4 "
                                      />
                                    </div>
                                    {isLoading ? (
                                      <Spinner
                                        animation="border"
                                        style={{
                                          position: "relative",
                                          left: 680,
                                          top: 250,
                                        }}
                                        className="text-center"
                                        variant="success"
                                        size="lg"
                                      />
                                    ) : (
                                      <div className="d-flex flex-column">
                                        {/*<h6 className="text-lg font-weight-normal mb-1">
                             <span className="font-weight-bold">NiCFOsT</span>
                           </h6> */}
                                        {this.state.premisesData.map((item) => {
                                          return (
                                            <div>
                                              <h4 className="text-dark text-uppercase ms-sm-4 ">
                                                {item.organisationname}
                                              </h4>
                                              <span className="pt-3">
                                                <hr class="dark horizontal my-3" />
                                              </span>

                                              <div className="row">
                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Registration number
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.registrationnumber
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Application date
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={moment(
                                                        item.applicationdate,
                                                      ).format("LL")}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Application status
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.applicationstatus
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Date acquired licence
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={moment(
                                                        item.licensedate,
                                                      ).format("LL")}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
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
                                                  <label className="form-label">
                                                    Business description
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.businessdescription
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
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
                                                  <label className="form-label">
                                                    Inspection date
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={moment(
                                                        item.inspectiondate,
                                                      ).format("LL")}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection fees
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionfees
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection follow-up
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionfollowup
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection fees
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionfees
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection status
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionstatus
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection team leader's
                                                    name
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionteamleadername
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Inspection team leader's
                                                    comment
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.inspectionteamleadercomment
                                                      }
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
                                                  <label className="form-label">
                                                    Lead food scientist's name
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.leadfoodscientistname
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
                                                    Lead food scientist's
                                                    licence number
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.leadfoodscientistlicensenumber
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
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
                                                  <label className="form-label">
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
                                                  <label className="form-label">
                                                    Address
                                                  </label>
                                                  <div className="input-group input-group-outline mb-3">
                                                    <label className="form-label"></label>
                                                    <input
                                                      className="form-control shadow-none"
                                                      disabled
                                                      type="phone"
                                                      value={
                                                        item.locationaddress
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-sm-6 col-lg-4 col-md-4 mb-3">
                                                  <label className="form-label">
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

                                                <label
                                                  className="mb-3 h4"
                                                  style={{ color: "green" }}
                                                  htmlFor="floatingInputCustom"
                                                >
                                                  Certificate Image
                                                </label>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                  <span className="pt-3">
                                    <hr class="dark horizontal my-3" />
                                  </span>

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
                                <button
                                  type="button"
                                  data-bs-dismiss="modal"
                                  class="btn btn-primary"
                                >
                                  Close
                                </button>
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
              <div
                class="modal fade"
                id="viewCert"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header bg-success d-flex align-items-center justify-content-between">
                      <h5 class="modal-title font-weight-bold text-light">
                        Downloading Your File
                      </h5>
                      <button
                        type="button"
                        class="btn btn-link m-0 p-0 text-dark fs-4"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <span class="iconify" data-icon="carbon:close"></span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <div class="row">
                        <embed
                          type="application/pdf"
                          src={this.state.premisesCertificate}
                          width="600"
                          height="400"
                        ></embed>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div class="d-flex align-items-center">
                            <div>
                              {this.state.isDownloading && (
                                <Spinner
                                  animation="border"
                                  variant="danger"
                                  size="lg"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        id="closeButton"
                        type="button"
                        class="btn btn-danger data"
                        data-bs-dismiss="modal"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Premises;
