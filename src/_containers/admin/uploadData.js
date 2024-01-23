import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Modal } from "reactstrap";
import { Progress } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay-ts";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Loader from "react-loaders";
import Dropzone from "react-dropzone";
import PageTitle from "_components/common/pagetitle";
import "./adminDashboardDetails.scss";
import excelIcon from "../../assets/utils/images/Excel.svg";
import uploadIcon from "../../assets/utils/images/icon-wrapper.svg";
import { resumeTemplateActions } from "_store";
import errorIcon from "../../assets/utils/images/error_icon.png";
import icon from "../../assets/utils/images/upload.svg";

export function UploadData(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resumeTemplateActions.getExcelTemplate());
  }, []);

  const excelTemplate = useSelector(
    (state) => state.getResumeTemplate.excelTemplate
  );

  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [formatError, setFormatError] = useState(false);
  const [loading, setLoader] = useState(false);

  const [acceptedFile, setAcceptedFiles] = useState([]);

  let url = `${process.env.REACT_APP_PANTHER_URL}`;

  const uploadFile = async function () {
    setLoader(true);
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    const form = new FormData();
    form.append("atsCandidateDataList", acceptedFile[0]);

    axios
      .post(`${url}/api/ATSCandidateData`, form, config)
      .then((result) => {
        debugger;
        if (result.data) {
          if (result.data.statusId === 200) {
            setSuccess(true);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
        setLoader(false);
      })
      .catch((error) => {});
  };

  const onDrop = (acceptedFiles) => {
    debugger;
    setFormatError(false);
    setError(false);
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");

    let format = name.split(".");
    setFileName(name);
    if (
      format[format.length - 1] !== "xls" &&
      format[format.length - 1] !== "xlsx"
    ) {
      setFormatError(true);
      return;
    } else {
      setFormatError(false);
    }

    if (acceptedFiles[0].size > 5 * 1024 * 1024) {
      setFileName("");
      setSizeError(true);

      return;
    } else {
      setSizeError(false);
      setAcceptedFiles(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xls,.xlsx",
  });
  const onCancel = (acceptedFiles) => {};

  return (
    <div>
      <LoadingOverlay
        tag="div"
        active={loading}
        styles={{
          overlay: (base) => ({
            ...base,
            background: "#fff",
            opacity: 0.5,
          }),
        }}
        spinner={
          <Loader active={loading} type="line-scale-pulse-out-rapid"></Loader>
        }
      >
        <Row>
          <Col md="12">
            <PageTitle heading={"Upload Data"} icon={icon} />
          </Col>
          <div className="admin-upload-data">
            <Card className="card-hover-shadow-2x mb-3">
              <CardBody>
                <div className="mb-4">
                  <Button className="mb-2 btn btn-light excel-border">
                    <a
                      href={excelTemplate}
                      download={excelTemplate}
                      className="upload-excel"
                    >
                      <img
                        className="m-1"
                        src={excelIcon}
                        alt="excel-download"
                      ></img>
                      <span style={{ verticalAlign: "middle" }}>
                        {" "}
                        Download excel template
                      </span>
                    </a>
                  </Button>
                  <p style={{ fontStyle: "italic" }}>
                    Fill in the data as per the template and then upload the
                    excel file.
                  </p>
                </div>

                <Row className="mb-4">
                  <Col className="col-7">
                    <div className="dropzone-wrapper dropzone-wrapper-md">
                      <Dropzone
                        onDrop={(e) => onDrop(e)}
                        onFileDialogCancel={onCancel}
                      >
                        {() => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="dropzone-content">
                              <div>
                                <img
                                  src={uploadIcon}
                                  alt="uplaod-icon"
                                  className="mt-3 mb-3"
                                ></img>
                              </div>

                              <p>
                                <strong>
                                  Click or drag file to this area to upload{" "}
                                </strong>
                              </p>
                              <p>
                                Support for a single or bulk upload. Maximum
                                file size 5MB.
                              </p>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    </div>
                  </Col>
                  <Col md="5">
                    {!sizeError && (
                      <Row className="mb-2 d-block">
                        <Col>
                          {fileName}{" "}
                          {success && (
                            <span className="float-end">100% Completed</span>
                          )}
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col>
                        {success && <Progress color="success" value="100" />}

                        {(formatError || error) && (
                          <Progress color="danger" value="100" />
                        )}

                        {formatError && (
                          <span class="upload-error-text">
                            {" "}
                            "Invalid file type. Supported documents are .xls,
                            .xlsx"
                          </span>
                        )}
                        {error && (
                          <span class="upload-error-text">
                            {" "}
                            Invalid data format. Please ensure the data follows
                            the specified template
                          </span>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <div className="file-info d-flex justify-content-center align-items-center">
                    <Button
                      className="upload-data-btn upload-btn-text"
                      onClick={(evt) => uploadFile()}
                      disabled={!fileName || fileName === "" || sizeError}
                    >
                      Upload
                    </Button>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </LoadingOverlay>
      <Modal className="modal-reject-align profile-view" isOpen={sizeError}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              File size should not exceed 5 MB
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Please try again
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setSizeError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
}
