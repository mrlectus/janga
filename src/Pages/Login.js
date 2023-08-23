import React, { Component } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Card, FloatingLabel, Form } from "react-bootstrap";
import { countries } from "../Components/countries";
import logo from "../assets/images/nicfost.png"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { baseUrl } from "../Components/BaseUrl";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          loading: false,
          disabled: false
        };
        this.handleChange = this.handleChange.bind(this);
      }

              handleChange(e) {
                this.setState({ selectValue: e.target.value });
              }

              login = async () => {

                this.setState({loading: true, disabled: true})
                // console.warn("country id "+ this.state.selectValue)
                var obj = {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                  }),
                };
                fetch(`${baseUrl}Admin/login`, obj)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.warn(responseJson);
                    // if(responseJson.email === "superadmin@superadmin.com"){
                      localStorage.setItem("email", responseJson.email.trim());
                      localStorage.setItem("canView", responseJson.canview);
                      localStorage.setItem("canCreate", responseJson.cancreate);
                      localStorage.setItem("canApprove", responseJson.canapprove);
                      localStorage.setItem("payments", responseJson.payments);
                      localStorage.setItem("license", responseJson.license);
                      localStorage.setItem("inspection", responseJson.inspection);
                      localStorage.setItem("registration", responseJson.registration);
                      localStorage.setItem("premises", responseJson.premises);
                    // }
                    if (responseJson.message === "Login Successfull") {
                      this.setState({ loading: false });
                      localStorage.setItem("userid", responseJson.userid);
                      localStorage.setItem("token", responseJson.token);
                      this.props.history.push("/dashboard")
                    } else if (
                      responseJson.message === "Index 0 out of bounds for length 0"
                    ) {
                      this.setState({ loading: false });
                      Swal.fire({
                        title: "Error!",
                        text: "Invalid username or password",
                        icon: "error",
                        confirmButtonText: "OK",
                      });
                    } else {
                      this.setState({ loading: false, disabled: false });
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
              };

          getCountry() {
            return countries.map((country) => {
              return <option value={country.dial_code}>{country.name}</option>;
            });
          }

              render() {
                const { loading } = this.state;
                return (
                  <div className="loginContainer">
                    <div
                      className="d-flex justify-content-center"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                      }}
                    >
                      <Card style={{position:'relative', top: 45, backgroundColor: 'rgba(255,255,255,0.6)'}} className="d-flex justify-content-center loginContainer-content">
                        <img
                          src={logo}
                          style={{
                            width: "15%",
                            position: "absolute",
                            top: 25,
                            alignSelf: "center",
                          }}
                        />

                        <h5 className="nicfostText text-dark" style={{position: 'relative', fontWeight:'bold', top: 45, textAlign:'center'}}>NIGERIAN COUNCIL OF FOOD SCIENCE AND TECHNOLOGY (NiCFoST)</h5>
                       <div className="text-center" style={{display:'flex', flexDirection: 'column', alignSelf:'center'}}>
                        <h6 style={{position: 'relative', top: 85, textAlign:'center'}}>Sign in to continue</h6>
                        </div>
                        <div className="container" style={{ marginTop: 90 }}>
                          <Form>
                            <Form.Floating className="mb-3">
                              <input
                                className="form-control shadow-none"
                                id="email"
                                type="email"
                                required="required"
                                onChange={(e) => this.setState({ email: e.target.value })}
                              />
                              <label htmlFor="email">Email</label>
                            </Form.Floating>
                            <Form.Floating>
                              <input
                                className="form-control shadow-none"
                                type="password"
                                id="password"
                                required="required"
                                onChange={(e) =>
                                  this.setState({ password: e.target.value })
                                }
                              />
                              <label htmlFor="floatingPasswordCustom">Password</label>
                            </Form.Floating>

                            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                              <h6
                                style={{
                                  textAlign: "right",
                                  textTransform: "capitalize",
                                  marginTop: 10,
                                  color: "#fff",
                                  fontSize: 13,
                                }}
                              >
                                Forgot password?
                              </h6>
                            </Link>

                            <div className="d-grid gap-2 mb-3" style={{ marginTop: 30 }}>
                              <button
                                type="button"
                                style={{backgroundColor: '#003314'}}
                                className="btn btn-success btn-lg"
                                onClick={(e) => this.login(e)}
                              >
                                {loading ? (
                                  <Spinner animation="border" variant="light" size="sm" />
                                ) : (
                                  "Login"
                                )}
                              </button>
                            </div>
                          </Form>

                        </div>
                      </Card>
                    </div>
                  </div>
                );
              }
            }



export default Login
