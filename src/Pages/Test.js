{
  /* Review Registration Modal */
}
<div
  className="modal fade"
  id="approve"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header d-flex align-items-center justify-content-between">
        <h5 className="modal-title">Approve / Reject Application</h5>
        <button
          type="button"
          className="btn btn-link m-0 p-0 text-dark fs-4"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <span class="iconify" data-icon="carbon:close"></span>
        </button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div clasNames="d-flex px-3">
            {/*<div className="my-auto text-center">
                <img src="../assets/img/account.svg" className="avatar avatar-exbg  me-4 "/>
              </div> */}
            {isLoading ? (
              <center>
                <Spinner
                  animation="border"
                  className="text-center"
                  variant="danger"
                  size="lg"
                />
              </center>
            ) : (
              <div className="d-flex flex-column">
                {/*<h6 className="text-lg font-weight-normal mb-1">
                  <span className="font-weight-bold">NiCFOsT</span>
                </h6> */}
                {this.state.userApproveData.map((item) => {
                  return (
                    <div>
                      <span>
                        <hr class="dark horizontal my-3" />
                      </span>

                      <div className="row">
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
                            <option selected disabled>
                              --Select Application Status --
                            </option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                          <label className="form-label">Remarks</label>
                          <div className="input-group input-group-outline mb-3">
                            <textarea
                              className="form-control shadow-none"
                              onChange={(e) =>
                                this.setState({ remarks: e.target.value })
                              }
                            ></textarea>
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

                      <div className="row">
                        <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                          <label className="form-label">Date of approval</label>
                          <div className="input-group input-group-outline mb-3">
                            <label className="form-label"></label>
                            <input
                              className="form-control shadow-none"
                              disabled
                              type="phone"
                              value={moment(d.getTime()).format("LL")}
                              onValue={this.handleLicenceDate}
                            />
                          </div>
                        </div>

                        <div className="col-sm-12 col-lg-12 col-md-12 mb-3">
                          <label className="form-label">
                            NiCFoST Registration Number
                          </label>
                          <div className="input-group input-group-outline mb-3">
                            <label className="form-label"></label>
                            <input
                              className="form-control shadow-none"
                              type="text"
                              onChange={(e) =>
                                this.setState({ regNumber: e.target.value })
                              }
                              value={
                                item.applicationstatus === "approved"
                                  ? item.nifstregistrationnumber
                                  : null
                              }
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
                          {item.applicationstatus !== "approved" && (
                            <button
                              id={`${item.formid}, ${item.nifstregistrationnumber}`}
                              disabled={this.state.disabled}
                              style={{
                                alignSelf: "center",
                                width: "100%",
                                backgroundColor: "#003314",
                              }}
                              className="btn btn-success btn-lg"
                              onClick={(e) =>
                                this.reviewApplication(
                                  `${item.formid}, ${item.nifstregistrationnumber}, ${item.licensenumber}`,
                                )
                              }
                            >
                              {isApproving ? (
                                <Spinner
                                  animation="border"
                                  variant="light"
                                  size="sm"
                                />
                              ) : (
                                <span className="font-weight-bold">
                                  {/* APPLY <i class="fas fa-chevron-right"></i> */}
                                  Submit Review
                                </span>
                              )}
                            </button>
                          )}
                        </div>
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
        </div>
      </div>
      <div class="modal-footer" style={{ display: "none" }}>
        <button type="button" data-bs-dismiss="modal" class="btn btn-danger">
          Close
        </button>
      </div>
    </div>
  </div>
</div>;
