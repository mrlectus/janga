import React, { Component } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Card, FloatingLabel, Form } from "react-bootstrap";
import { countries } from "../Components/countries";
import logo from "../assets/images/nicfost.png";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_email: "black",
      error_region: "black",
      error_phone: "black",
      error_password: "black",
      error_confirm_password: "black",
      error_user_role: "black",
      error_user_type: "black",
      error_user_status: "black",
      email: null,
      phone: null,
      password: null,
      confirm_password: null,
      selectValue: null,
      user_role: null,
      user_type: null,
      user_status: null,
      loading: false,
      disabled: false,
      userRoles: [],
      userTypes: [],
      userStatus: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUserRoleChange = this.handleUserRoleChange.bind(this);
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
    this.handleUserStatusChange = this.handleUserStatusChange.bind(this);
  }

  handleChange(e) {
    this.setState({ selectValue: e.target.value });
  }

  handleUserRoleChange(e) {
    this.setState({ user_role: e.target.value });
  }

  handleUserTypeChange(e) {
    this.setState({ user_type: e.target.value });
  }

  handleUserStatusChange(e) {
    this.setState({ user_status: e.target.value });
  }

  getUserRoles = async () => {
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Lookups/GetUserRole`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error == "Unauthorized") {
          this.setState({ loader: false });
          Swal.fire({
            title: "Session Expired",
            text: "Session expired. Please login",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            this.props.history.push("/login");
          });
        } else {
          this.setState({ userRoles: responseJson });
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

  getUserTypes = async () => {
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Lookups/GetUserRole`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error == "Unauthorized") {
          this.setState({ loader: false });
          Swal.fire({
            title: "Session Expired",
            text: "Session expired. Please login",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            this.props.history.push("/login");
          });
        } else {
          this.setState({ userTypes: responseJson });
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

  getUserStatus = async () => {
    let obj = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    await fetch(`${baseUrl}Lookups/GetUserStatus`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error == "Unauthorized") {
          this.setState({ loader: false });
          Swal.fire({
            title: "Session Expired",
            text: "Session expired. Please login",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            this.props.history.push("/login");
          });
        } else {
          this.setState({ userStatus: responseJson });
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

  componentDidMount() {
    this.getUserRoles();
    this.getUserTypes();
    this.getUserStatus();
  }

  checkValidation = () => {
    const {
      email,
      password,
      selectValue,
      confirm_password,
      user_role,
      user_status,
      user_type,
      phone,
    } = this.state;
    if (email === null) {
      Swal.fire({
        title: "Empty",
        text: "Please enter an email address",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_email: "red" });
    } else if (selectValue === null) {
      Swal.fire({
        title: "Empty",
        text: "Please enter a region",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_region: "red", error_email: "black" });
    } else if (phone === null) {
      Swal.fire({
        title: "Empty",
        text: "Please enter a phone number",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_phone: "red", error_region: "black" });
    } else if (password === null) {
      Swal.fire({
        title: "Empty",
        text: "Please enter a password",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_password: "red", error_phone: "black" });
    } else if (confirm_password === null) {
      Swal.fire({
        title: "Empty",
        text: "Please confirm password",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_confirm_password: "red", error_password: "black" });
    } else if (password !== confirm_password) {
      Swal.fire({
        title: "Empty",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (user_role === null) {
      Swal.fire({
        title: "Empty",
        text: "Please select user role",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({
        error_user_role: "red",
        error_confirm_password: "black",
      });
    } else if (user_type === null) {
      Swal.fire({
        title: "Empty",
        text: "Please select user type",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_user_type: "red", error_user_role: "black" });
    } else if (user_status === null) {
      Swal.fire({
        title: "Empty",
        text: "Please select user status",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.setState({ error_user_status: "red", error_user_type: "black" });
    } else {
      this.createUser();
    }
  };

  createUser = async (e) => {
    this.setState({ loading: true, disabled: true });
    var obj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        countryid: this.state.selectValue,
        password: this.state.password,
        email: this.state.email,
        confirmpassword: this.state.confirm_password,
        telephone: this.state.phone,
        userrole: this.state.user_role,
        userstatus: this.state.user_status,
        usertype: this.state.user_type,
      }),
    };
    fetch(`${baseUrl}Admin/createUsers`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(responseJson);
        if (responseJson.status === 401) {
          Swal.fire({
            title: "Unauthorized",
            text: responseJson.error,
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ loading: false });
        } else if (responseJson.message.includes("already exists")) {
          Swal.fire({
            title: "Duplicate",
            text: "Email is already taken!",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ loading: false });
        } else if (
          responseJson.message.includes("Telephone is already taken!")
        ) {
          Swal.fire({
            title: "Duplicate",
            text: "Telephone is already taken!",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ loading: false });
        } else if (
          responseJson.message === "Created User Profile Successfully"
        ) {
          // Swal.fire({
          //   title: "Success",
          //   text: "User profile created successfully",
          //   icon: "success",
          //   confirmButtonText: "OK",
          // });
          this.updateUserStatus(responseJson.userid);
          // this.setState({ loading: false })
          // this.props.history.push('/create-user')
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
  };

  updateUserStatus = async (userid) => {
    this.setState({ loading: true, disabled: true });
    console.warn(userid);
    var obj = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userid: userid,
        userstatus: "pending",
      }),
    };
    fetch(`${baseUrl}UsersMgt/UpdateUserStatus`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(responseJson);
        if (responseJson.status === 401) {
          Swal.fire({
            title: "Unauthorized",
            text: responseJson.error,
            icon: "error",
            confirmButtonText: "OK",
          });
          this.setState({ loading: false });
        }
        // else if(responseJson.message.includes("already exists")) {
        //   Swal.fire({
        //     title: "Duplicate",
        //     text: "Email is already taken!",
        //     icon: "error",
        //     confirmButtonText: "OK",
        //   });
        //   this.setState({ loading: false })
        // } else if(responseJson.message.includes("Telephone is already taken!")){
        //   Swal.fire({
        //     title: "Duplicate",
        //     text: "Telephone is already taken!",
        //     icon: "error",
        //     confirmButtonText: "OK",
        //   });
        //    this.setState({ loading: false })
        // } else if( responseJson.message === "Created User Profile Successfully" ) {
        //   Swal.fire({
        //     title: "Success",
        //     text: "User profile created successfully",
        //     icon: "success",
        //     confirmButtonText: "OK",
        //   });
        //   this.setState({ loading: false })
        //   this.props.history.push('/create-user')
        // }
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
  };

  getCountry = () => {
    return countries.map((country) => {
      return <option value={country.dial_code}>{country.name}</option>;
    });
  };

  showUserRoles = () => {
    return this.state.userRoles.map((roles) => {
      return <option value={roles.referencename}>{roles.referencename}</option>;
    });
  };

  showUserTypes = () => {
    return this.state.userTypes.map((roles) => {
      return <option value={roles.referencename}>{roles.referencename}</option>;
    });
  };

  showUserStatus = () => {
    return this.state.userStatus.map((roles) => {
      return <option value={roles.referencename}>{roles.referencename}</option>;
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="g-sidenav-show">
        <Sidebar />
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
                      <h5 className="text-light">Create a new user</h5>
                    </div>
                  </div>
                  <div class="card-body">
                    <div>
                      <div className="d-flex justify-content-center">
                        <div
                          className="text-center"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignSelf: "center",
                          }}
                        ></div>
                        <div className="container" style={{ marginTop: 0 }}>
                          <Form>
                            <Form.Floating className="mb-3">
                              <input
                                className="form-control shadow-none"
                                type="email"
                                id="email"
                                onChange={(e) =>
                                  this.setState({ email: e.target.value })
                                }
                              />
                              <label
                                style={{ color: this.state.error_email }}
                                htmlFor="email"
                              >
                                Email
                              </label>
                            </Form.Floating>
                            <FloatingLabel
                              className="mb-3"
                              controlId="floatingSelectGrid"
                            >
                              <select
                                className="form-control shadow-none"
                                aria-label="Floating label select example"
                                onChange={this.handleChange}
                                id="region"
                              >
                                <option disabled selected>
                                  --Select Region --
                                </option>
                                {this.getCountry()}
                              </select>
                              <label
                                style={{ color: this.state.error_region }}
                                htmlFor="region"
                              >
                                Region
                              </label>
                            </FloatingLabel>
                            <Form.Floating className="mb-3">
                              <input
                                className="form-control shadow-none"
                                type="phone"
                                id="phone"
                                onChange={(e) =>
                                  this.setState({ phone: e.target.value })
                                }
                              />
                              <label
                                style={{ color: this.state.error_phone }}
                                htmlFor="phone"
                              >
                                Phone
                              </label>
                            </Form.Floating>

                            <Form.Floating className="mb-3">
                              <input
                                className="form-control shadow-none"
                                type="password"
                                id="password"
                                onChange={(e) =>
                                  this.setState({ password: e.target.value })
                                }
                              />
                              <label
                                style={{ color: this.state.error_password }}
                                htmlFor="floatingPasswordCustom"
                              >
                                Password
                              </label>
                            </Form.Floating>

                            <Form.Floating className="mb-3">
                              <input
                                className="form-control shadow-none"
                                type="password"
                                id="conf"
                                onChange={(e) =>
                                  this.setState({
                                    confirm_password: e.target.value,
                                  })
                                }
                              />
                              <label
                                style={{
                                  color: this.state.error_confirm_password,
                                }}
                                htmlFor="conf"
                              >
                                Confirm Password
                              </label>
                            </Form.Floating>

                            <FloatingLabel
                              className="mb-3"
                              controlId="floatingSelectGrid"
                            >
                              <select
                                className="form-control shadow-none"
                                aria-label="Floating label select example"
                                onChange={this.handleUserRoleChange}
                                id="role"
                              >
                                <option selected>--Select User Role --</option>
                                {this.showUserRoles()}
                              </select>
                              <label
                                style={{ color: this.state.error_user_role }}
                                htmlFor="role"
                              >
                                User Role
                              </label>
                            </FloatingLabel>

                            <FloatingLabel
                              className="mb-3"
                              controlId="floatingSelectGrid"
                            >
                              <select
                                className="form-control shadow-none"
                                aria-label="Floating label select example"
                                onChange={this.handleUserTypeChange}
                                id="role"
                              >
                                <option selected>
                                  --Select User Status --
                                </option>
                                {this.showUserTypes()}
                              </select>
                              <label
                                style={{ color: this.state.error_user_type }}
                                htmlFor="role"
                              >
                                User Type
                              </label>
                            </FloatingLabel>

                            <FloatingLabel
                              className="mb-3"
                              controlId="floatingSelectGrid"
                            >
                              <select
                                className="form-control shadow-none"
                                aria-label="Floating label select example"
                                onChange={this.handleUserStatusChange}
                                id="status"
                              >
                                <option selected>
                                  --Select User Status --
                                </option>
                                {this.showUserStatus()}
                              </select>
                              <label
                                style={{ color: this.state.error_user_status }}
                                htmlFor="status"
                              >
                                User Type
                              </label>
                            </FloatingLabel>

                            <div
                              className="d-grid gap-2 mb-3"
                              style={{ marginTop: 30 }}
                            >
                              <button
                                style={{ backgroundColor: "#003314" }}
                                className="btn btn-success btn-lg"
                                onClick={(e) => this.checkValidation(e)}
                              >
                                {loading ? (
                                  <Spinner
                                    animation="border"
                                    variant="light"
                                    size="sm"
                                  />
                                ) : (
                                  "Create User"
                                )}
                              </button>
                            </div>
                          </Form>
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
    );
  }
}

export default CreateUser;
