import React, { PureComponent } from "react";
import Sidebar from "../Components/Sidebar";
import Swal from "sweetalert2";
import { Form, Spinner } from "react-bootstrap";
import { baseUrl } from "../Components/BaseUrl";
import $ from "jquery";
import moment from "moment";
import profileImage from "../assets/images/profile.png";
import logo from "../assets/images/profile.png";
let newUserID = "";

class AdminUsers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      disabledUserData: [],
      enabledUserData: [],
      userData: [],
      userRoleArray: [],
      isDisabledLoading: false,
      isEnabledLoading: false,
      isLoading: false,
      isDisabled: false,
      isCreating: false,
      loading: false,
      postsPerPage: 10,
      currentPage: 1,
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userRole: "",
      userType: "",
      canCreate: true,
      canView: true,
      canApprove: true,
      //VARIABLE COLOR
      userRoleColor: "black",
      userTypeColor: "black",
      emailColor: "black",
      phoneColor: "black",
      passwordColor: "black",
      confirmPasswordColor: "black",
      colorPriviledge: "black",
    };
    this.handleUserRoleChange = this.handleUserRoleChange.bind(this);
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
    this.handleCanCreateChange = this.handleCanCreateChange.bind(this);
    this.handleCanViewChange = this.handleCanViewChange.bind(this);
    this.handleCanApproveChange = this.handleCanApproveChange.bind(this);
  }

  handleUserRoleChange(e) {
    this.setState({ userRole: e.target.value });
  }

  handleUserTypeChange(e) {
    this.setState({ userType: e.target.value });
  }

  handleCanCreateChange(e) {
    e.target.checked === true
      ? this.setState({ canCreate: 1 })
      : this.setState({ canCreate: 0 });
  }
  handleCanViewChange(e) {
    e.target.checked === true
      ? this.setState({ canView: 1 })
      : this.setState({ canView: 0 });
  }
  handleCanApproveChange(e) {
    e.target.checked === true
      ? this.setState({ canApprove: 1 })
      : this.setState({ canApprove: 0 });
  }

  createUser = async () => {
    const { password, confirmPassword, phone, userRole, userType, email } =
      this.state;
    this.setState({ isCreating: true, isDisabled: true });
    var obj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        confirmpassword: confirmPassword,
        countryid: "+234",
        email: email,
        password: password,
        telephone: phone,
        userrole: userRole,
        userstatus: "pending",
        usertype: userType,
      }),
    };
    await fetch(`${baseUrl}Admin/createUsers`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson.message === "Created User Profile Successfully") {
          newUserID = responseJson.userid;
          this.assignPrivilege();
        }
      })
      .catch((error) => {
        this.setState({ isCreating: false, isDisabled: false });
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  assignPrivilege = async () => {
    // console.warn(this.state.canView);
    // console.warn(typeof(this.state.canView));
    const { canApprove, canCreate, canView } = this.state;
    this.setState({ isCreating: true, isDisabled: true });
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        canapprove: 1,
        cancreate: 1,
        canview: 1,
        inspection: 0,
        license: 0,
        payments: 0,
        premises: 0,
        registration: 0,
        userid: newUserID.trim(),
      }),
    };
    await fetch(`${baseUrl}Admin/changePrivileges`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson.message === "Changed Admin Privileges Successfully") {
          Swal.fire({
            title: "Success",
            text: "New user created successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        this.setState({ isCreating: false, isDisabled: false });
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  checkValidation = () => {
    const {
      email,
      phone,
      password,
      confirmPassword,
      canCreate,
      canView,
      canApprove,
      userType,
      userRole,
    } = this.state;
    if (email === "") {
      Swal.fire({
        title: "Empty",
        text: "Please specify an email",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ emailColor: "red" });
    } else if (phone === "") {
      Swal.fire({
        title: "Empty",
        text: "Please specify a phone number",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ phoneColor: "red" });
    } else if (password === "") {
      Swal.fire({
        title: "Empty",
        text: "Please specify a password",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ passwordColor: "red" });
    } else if (confirmPassword === "") {
      Swal.fire({
        title: "Empty",
        text: "Please confirm your password",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ confirmPasswordColor: "red" });
    } else if (password !== confirmPassword) {
      Swal.fire({
        title: "Empty",
        text: "Passwords do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (userType === "") {
      Swal.fire({
        title: "Empty",
        text: "Please specify user type",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ userTypeColor: "red" });
    } else if (userRole === "") {
      Swal.fire({
        title: "Empty",
        text: "Please specify user role",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ userRoleColor: "red" });
    } else if (
      canCreate === false &&
      canView === false &&
      canApprove === false
    ) {
      Swal.fire({
        title: "Empty",
        text: "Please assign at least one priviledge",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ colorPriviledge: "red" });
    } else {
      this.createUser();
    }
  };

  getUserDetails = (userId) => {
    const url = `${baseUrl}Users/id/${userId}`;
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
        // console.warn(res);
        this.setState({
          isLoading: false,
          userData: [res],
        });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  };

  getUser = async () => {
    const url = `${baseUrl}Lookups/GetUserRole`;
    // this.setState({isLoading: true});
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.warn(res);
        this.setState({ userRoleArray: res });
      })
      .catch((error) => {
        alert(error);
      });
  };

  getUserRole() {
    return this.state.userRoleArray.map((userrole) => {
      return <option value={userrole}>{userrole}</option>;
    });
  }

  getDisabledUserDetails = (userId) => {
    const url = `${baseUrl}Users/id/${userId}`;
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
        // console.warn(res);
        this.setState({
          isLoading: false,
          disabledUserData: [res],
        });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  };

  getEnabledUserDetails = (userId) => {
    const url = `${baseUrl}Users/id/${userId}`;
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
        // console.warn(res);
        this.setState({
          isLoading: false,
          enabledUserData: [res],
        });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        alert(error);
      });
  };

  showUsers = async () => {
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
              iDisplayIndexFull,
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
    await fetch(`${baseUrl}UsersMgt/GetUsersByType/public`, obj)
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
        } else {
          this.setState({ data: responseJson, loading: false });
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

  enableUserStatus = async (userId) => {
    this.setState({ isEnabledLoading: true });
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userstatus: "enabled",
        userid: `${userId}`,
      }),
    };
    await fetch(`${baseUrl}UsersMgt/UpdateUserStatus`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson.message === "User Status Updated") {
          Swal.fire({
            title: "Success",
            text: `${userId} status has been successfully enabled`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
          this.setState({ isEnabledLoading: false });
        } else {
          Swal.fire({
            title: "Error",
            text: `We could not complete that. Please try again later`,
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ isEnabledLoading: false });
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
    this.setState({ isEnabledLoading: false });
  };

  disableUserStatus = async (userId) => {
    this.setState({ isDisabledLoading: true });
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userstatus: "disabled",
        userid: `${userId}`,
      }),
    };
    await fetch(`${baseUrl}UsersMgt/UpdateUserStatus`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn(responseJson);
        if (responseJson.message === "User Status Updated") {
          Swal.fire({
            title: "Success",
            text: `${userId} status has been successfully disabled`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
          this.setState({ isDisabledLoading: false });
        } else {
          Swal.fire({
            title: "Error",
            text: `We could not complete that. Please try again later`,
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ isDisabledLoading: false });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        this.setState({ isDisabledLoading: false });
      });
  };

  showTable = () => {
    const { postsPerPage, currentPage, data } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    try {
      return currentPosts.map((item, index) => {
        return (
          <tr>
            <td className="text-xs font-weight-bold">
              {postsPerPage * (currentPage - 1) + index + 1}
            </td>
            <td className="text-xs font-weight-bold">{item.email}</td>
            <td className="text-xs font-weight-bold">{item.userrole}</td>
            <td className="text-xs font-weight-bold">
              <button
                className={
                  item.userstatus === "enabled"
                    ? "btn btn-success text-light text-xs font-weight-bold"
                    : "btn btn-danger text-light text-xs font-weight-bold"
                }
              >
                {item.userstatus}
              </button>
            </td>
            <td className="text-xs font-weight-bold">{item.usertype}</td>
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
                <li
                  className="mb-2"
                  id={item.userId}
                  onClick={() => this.getUserDetails(item.userId)}
                  data-bs-toggle="modal"
                  data-bs-target="#viewUser"
                >
                  <a
                    className="dropdown-item border-radius-md"
                    href="javascript:;"
                  >
                    <div className="d-flex py-1">
                      <h6 className="text-sm font-weight-normal mb-1">
                        <span className="font-weight-bold">View</span>
                      </h6>
                    </div>
                  </a>
                </li>
                {localStorage.getItem("email") ===
                  "superadmin@superadmin.com" && (
                  <li
                    class="mb-2"
                    id={item.userId}
                    onClick={() => this.getEnabledUserDetails(item.userId)}
                    data-bs-toggle="modal"
                    data-bs-target="#enableModal"
                  >
                    <a
                      class="dropdown-item border-radius-md"
                      href="javascript:;"
                    >
                      <div class="d-flex py-1">
                        <h6 class="text-sm font-weight-normal mb-1">
                          <span className="font-weight-bold">Enable</span>
                        </h6>
                      </div>
                    </a>
                  </li>
                )}
                {localStorage.getItem("email") ===
                  "superadmin@superadmin.com" && (
                  <li
                    class="mb-2"
                    id={item.userId}
                    onClick={() => this.getDisabledUserDetails(item.userId)}
                    data-bs-toggle="modal"
                    data-bs-target="#disableModal"
                  >
                    <a
                      class="dropdown-item border-radius-md"
                      href="javascript:;"
                    >
                      <div class="d-flex py-1">
                        <h6 class="text-sm font-weight-normal mb-1">
                          <span class="font-weight-bold">Disable</span>
                        </h6>
                      </div>
                    </a>
                  </li>
                )}
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
      });
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

  componentDidMount() {
    this.showUsers();
  }

  render() {
    const {
      isLoading,
      userData,
      disabledUserData,
      enabledUserData,
      isEnabledLoading,
      isDisabledLoading,
    } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>
          <div className="col-md-10">
            <main
              class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
              id="dashboard"
            >
              <div class="container-fluid px-4">
                <div class="rown">
                  <div class="col-12">
                    <div class="card my-3">
                      <div class="card-header pb-4 bg-success">
                        <div class="d-flex flex-wrap align-items-center justify-content-between">
                          <h5 className="text-light">All Public Users</h5>
                          {/*<div class="d-flex align-items-center">
                      <button class="btn bg-warning font-weight-bold mb-0 text-dark"  data-bs-toggle="modal" data-bs-target="#createUser" >Create User<span class="iconify" data-icon="carbon:add" style={{fontSize: 'large', fontWeight: 'bold'}}></span></button>
                    </div> */}
                        </div>
                      </div>

                      <div className="card-body">
                        {this.state.loading ? (
                          <Spinner
                            variant="success"
                            animation="border"
                            style={{ position: "relative", left: 450, top: 0 }}
                            className="text-center"
                            variant="success"
                            size="lg"
                          />
                        ) : (
                          <div className="container-fluid py-4">
                            <div className="table-responsive p-0 pb-2">
                              <table className="table align-items-center justify-content-center mb-0">
                                <thead>
                                  <tr>
                                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      S/N
                                    </th>
                                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      Email
                                    </th>
                                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      User-role
                                    </th>
                                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      User status
                                    </th>
                                    <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">
                                      User type
                                    </th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                      Action
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>

                                <tbody>{this.showTable()}</tbody>
                              </table>
                              <div style={{ float: "right" }}>
                                {this.showPagination()}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Start of View Modal */}
                        <div
                          class="modal fade"
                          id="viewUser"
                          tabindex="-1"
                          aria-labelledby="viewPending"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header d-flex align-items-center justify-content-between">
                                <h5 class="modal-title">Details</h5>
                                <button
                                  type="button"
                                  className="btn btn-link m-0 p-0 text-dark fs-4"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="carbon:close"
                                  ></span>
                                </button>
                              </div>
                              {isLoading ? (
                                <Spinner
                                  animation="border"
                                  style={{
                                    position: "relative",
                                    right: 0,
                                    left: 220,
                                    top: 0,
                                  }}
                                  className="text-center"
                                  variant="danger"
                                  size="sm"
                                />
                              ) : (
                                <div className="modal-body">
                                  {userData.length > 0 &&
                                    userData.map((item) => {
                                      return (
                                        <div className="row">
                                          <div className="d-flex px-3">
                                            <div className="my-auto">
                                              <img
                                                src={profileImage}
                                                className="avatar avatar-exbg  me-4 "
                                              />
                                            </div>
                                            <div className="d-flex flex-column justify-content-center">
                                              <span className="mb-2 text-sm font-weight-bold">
                                                USER ID:{" "}
                                                <span className="text-danger text-sm font-weight-bold">
                                                  {item.userid}
                                                </span>
                                              </span>
                                              <span className="mb-0 text-sm font-weight-bold">
                                                Status:{" "}
                                                <span>
                                                  <button
                                                    className={
                                                      item.userstatus ===
                                                      "enabled"
                                                        ? "btn btn-success badge badge-success text-xs font-weight-bold"
                                                        : item.userstatus ===
                                                          "disabled"
                                                        ? "btn btn-danger badge badge-danger text-xs font-weight-bold"
                                                        : null
                                                    }
                                                  >
                                                    {item.userstatus}
                                                  </button>
                                                </span>
                                              </span>
                                              <span className="mb-2 text-sm font-weight-bold">
                                                Role:{" "}
                                                <span>
                                                  <button
                                                    className={
                                                      item.userrole === "admin"
                                                        ? "btn btn-success badge badge-success text-xs font-weight-bold"
                                                        : null
                                                    }
                                                  >
                                                    {item.userrole}
                                                  </button>
                                                </span>
                                              </span>
                                            </div>
                                          </div>
                                          <span className="pt-1">
                                            <hr className="dark horizontal my-3" />
                                          </span>
                                          <div className="d-flex flex-column px-3">
                                            <h6 className="mb-3 text-sm">
                                              User Details
                                            </h6>
                                            <span className="mb-2 text-xs">
                                              Email:{" "}
                                              <span className="text-dark font-weight-bold ms-sm-2">
                                                {item.email}
                                              </span>
                                            </span>
                                            <span className="mb-2 text-xs">
                                              Phone:{" "}
                                              <span className="text-dark font-weight-bold ms-sm-2">
                                                {item.telephone}
                                              </span>
                                            </span>
                                            <span className="mb-2 text-xs">
                                              User Type:{" "}
                                              <span className="text-success ms-sm-2 font-weight-bold">
                                                {item.usertype}
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* End of View Modal */}

                        {/* Start of Disable Modal  */}
                        <div
                          className="modal fade"
                          id="disableModal"
                          tabindex="-1"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header d-flex align-items-center justify-content-between">
                                <h5 className="modal-title">Disable User</h5>
                                <button
                                  type="button"
                                  className="btn btn-link m-0 p-0 text-dark fs-4"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span
                                    className="iconify"
                                    data-icon="carbon:close"
                                  ></span>
                                </button>
                              </div>
                              {isLoading ? (
                                <Spinner
                                  animation="border"
                                  style={{
                                    position: "relative",
                                    right: 0,
                                    left: 220,
                                    top: 0,
                                    padding: 10,
                                  }}
                                  className="text-center"
                                  variant="danger"
                                  size="sm"
                                />
                              ) : (
                                <div className="modal-body">
                                  <div className="row">
                                    <div className="d-flex px-3">
                                      <div className="my-auto">
                                        <img
                                          src={logo}
                                          class="avatar avatar-exbg  me-4 "
                                          alt="rubi moni"
                                        />
                                      </div>
                                      <div className="d-flex flex-column justify-content-center">
                                        <h6 className="text-lg font-weight-normal mb-1">
                                          <span className="font-weight-bold">
                                            NiCFoST
                                          </span>
                                        </h6>
                                      </div>
                                    </div>
                                    <span className="pt-3">
                                      <hr class="dark horizontal my-3" />
                                    </span>
                                    <div className="d-flex flex-column px-3">
                                      {disabledUserData.length > 0 &&
                                        disabledUserData.map((item) => {
                                          return (
                                            <p className="text-center font-weight-bold">
                                              {`Are you sure you want to disable`}
                                              <span className="text-danger">{` ${item.email}?`}</span>
                                            </p>
                                          );
                                        })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="modal-footer">
                                <button
                                  data-bs-dismiss="modal"
                                  type="button"
                                  className="btn btn-secondary"
                                >
                                  Abort
                                </button>
                                {disabledUserData.length > 0 &&
                                  disabledUserData.map((item) => {
                                    return (
                                      <button
                                        id="closeButton"
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() =>
                                          this.disableUserStatus(item.userid)
                                        }
                                      >
                                        {isDisabledLoading ? (
                                          <Spinner
                                            size="sm"
                                            animation="border"
                                            variant="light"
                                          />
                                        ) : (
                                          "Disable"
                                        )}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* End of Disable Modal */}

                        {/* Start of Enable Modal  */}
                        <div
                          className="modal fade"
                          id="enableModal"
                          tabindex="-1"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header d-flex align-items-center justify-content-between">
                                <h5 className="modal-title">Enable User</h5>
                                <button
                                  type="button"
                                  className="btn btn-link m-0 p-0 text-dark fs-4"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span
                                    className="iconify"
                                    data-icon="carbon:close"
                                  ></span>
                                </button>
                              </div>
                              {isLoading ? (
                                <Spinner
                                  animation="border"
                                  style={{
                                    position: "relative",
                                    right: 0,
                                    left: 220,
                                    top: 0,
                                    padding: 10,
                                  }}
                                  className="text-center"
                                  variant="danger"
                                  size="sm"
                                />
                              ) : (
                                <div className="modal-body">
                                  <div className="row">
                                    <div className="d-flex px-3">
                                      <div className="my-auto">
                                        <img
                                          src={logo}
                                          className="avatar avatar-exbg  me-4 "
                                        />
                                      </div>
                                      <div className="d-flex flex-column justify-content-center">
                                        <h6 className="text-lg font-weight-normal mb-1">
                                          <span className="font-weight-bold">
                                            NiCFoST
                                          </span>
                                        </h6>
                                      </div>
                                    </div>
                                    <span className="pt-3">
                                      <hr class="dark horizontal my-3" />
                                    </span>
                                    <div className="d-flex flex-column px-3">
                                      {enabledUserData.length > 0 &&
                                        enabledUserData.map((item) => {
                                          return (
                                            <p className="text-center font-weight-bold">
                                              {`Are you sure you want to enable`}
                                              <span className="text-success">{` ${item.email}?`}</span>
                                            </p>
                                          );
                                        })}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div class="modal-footer">
                                <button
                                  data-bs-dismiss="modal"
                                  type="button"
                                  className="btn btn-secondary"
                                >
                                  Abort
                                </button>
                                {enabledUserData.length > 0 &&
                                  enabledUserData.map((item) => {
                                    return (
                                      <button
                                        id="closeButton"
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() =>
                                          this.enableUserStatus(item.userid)
                                        }
                                      >
                                        {isEnabledLoading ? (
                                          <Spinner
                                            size="sm"
                                            animation="border"
                                            variant="light"
                                          />
                                        ) : (
                                          "Enable"
                                        )}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* End of Enable Modal */}

                        {/* Create User */}
                        <div
                          class="modal fade"
                          id="createUser"
                          tabindex="-1"
                          aria-labelledby="createUser"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header bg-success">
                                <h5
                                  class="modal-title text-uppercase font-weight-bold text-light"
                                  id="exampleModalLabel"
                                >
                                  Create New User
                                </h5>
                                <button
                                  type="button"
                                  class="btn-close text-light bg-light"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body">
                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    style={{ color: this.state.emailColor }}
                                    className="form-label"
                                  >
                                    Email <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control w-50 shadow-none"
                                      type="text"
                                      required="required"
                                      onChange={(e) =>
                                        this.setState({ email: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    style={{ color: this.state.phoneColor }}
                                    className="form-label"
                                  >
                                    Phone <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control w-50 shadow-none"
                                      type="text"
                                      required="required"
                                      onChange={(e) =>
                                        this.setState({ phone: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    style={{ color: this.state.passwordColor }}
                                    className="form-label"
                                  >
                                    Password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control w-50 shadow-none"
                                      type="text"
                                      required="required"
                                      onChange={(e) =>
                                        this.setState({
                                          password: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    style={{
                                      color: this.state.confirmPasswordColor,
                                    }}
                                    className="form-label"
                                  >
                                    Confirm password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <input
                                      className="form-control w-50 shadow-none"
                                      type="text"
                                      required="required"
                                      onChange={(e) =>
                                        this.setState({
                                          confirmPassword: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    className="form-label"
                                    style={{ color: this.state.userTypeColor }}
                                  >
                                    Select User Type{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <select
                                      className="form-control shadow-none"
                                      aria-label="Select state"
                                      onChange={this.handleUserTypeChange}
                                    >
                                      <option selected disabled>
                                        -- Select User Type --
                                      </option>
                                      <option value="private">PRIVATE</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                                  <label
                                    className="form-label"
                                    style={{ color: this.state.userRoleColor }}
                                  >
                                    Select User role{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group input-group-outline mb-3">
                                    <label className="form-label"></label>
                                    <select
                                      className="form-control shadow-none"
                                      aria-label="Select state"
                                      onChange={this.handleUserRoleChange}
                                    >
                                      <option selected disabled>
                                        -- Select userrole --
                                      </option>
                                      <option value="admin">ADMIN</option>
                                    </select>
                                  </div>
                                </div>

                                <label
                                  style={{ color: this.state.colorPriviledge }}
                                  className="form-label"
                                >
                                  Assign Priviledge{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <div style={{ marginTop: 25 }}>
                                    <Form.Floating className="mb-3">
                                      <input
                                        class="form-check-input shadow-none col-sm-6 col-lg-6 col-md-6 mb-3"
                                        type="checkbox"
                                        id="checkBoxUS"
                                        name="canCreate"
                                        value={this.state.canCreate}
                                        onChange={this.handleCanCreateChange}
                                      />{" "}
                                      Can Create
                                    </Form.Floating>
                                  </div>

                                  <div style={{ marginTop: 25 }}>
                                    <Form.Floating className="mb-3">
                                      <input
                                        class="form-check-input shadow-none col-sm-6 col-lg-6 col-md-6 mb-3"
                                        type="checkbox"
                                        id="checkBoxUS"
                                        name="canView"
                                        value={this.state.canApprove}
                                        onChange={this.handleCanApproveChange}
                                      />{" "}
                                      Can Approve
                                    </Form.Floating>
                                  </div>

                                  <div style={{ marginTop: 25 }}>
                                    <Form.Floating className="mb-3">
                                      <input
                                        class="form-check-input shadow-none col-sm-6 col-lg-6 col-md-6 mb-3"
                                        type="checkbox"
                                        id="checkBoxUS"
                                        name="US"
                                        onChange={this.handleCanViewChange}
                                      />{" "}
                                      Can View
                                    </Form.Floating>
                                  </div>
                                </div>

                                {/* <button
                 disabled={this.state.isDisabled}
                 style={{
                   alignSelf: "center",
                   width: "100%",
                   backgroundColor: "#003314",
                 }}
                 type="button"
                 className="btn btn-success btn-lg"
                 onClick={() => this.checkValidation()}
               >
                 {this.state.isCreating? (
                   <Spinner animation="border" variant="light" size="sm" />
                 ) : (
                   <span className="font-weight-bold">

                      CREATE USER
                   </span>
                 )}
               </button> */}
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-danger"
                                  data-bs-dismiss="modal"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*End of Create User */}
                      </div>
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

export default AdminUsers;
