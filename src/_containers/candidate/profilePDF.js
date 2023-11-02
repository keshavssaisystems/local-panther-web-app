import React, { useRef } from "react";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  FormGroup,
  InputGroup,
  Label,
  Form,
  CardFooter,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  formatDate,
  formatDateQualification,
  calculateExperience,
  getDate,
  getEducText,
  convertText,
} from "_helpers/helper";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function ProfilePDF(props) {
  const componentRef = useRef();
  const personalInfo_temp = useSelector(
    (state) => state.getProfile.profileData.personalInfo
  );
  const skillsInfo = useSelector(
    (state) => state.getProfile.profileData.skillsInfo
  );

  const qualificationInfo = useSelector(
    (state) => state.getProfile.profileData.qualificationsInfo
  );

  const educationInfo = useSelector(
    (state) => state.getProfile.profileData.educationInfo
  );
  const certificationInfo = useSelector(
    (state) => state.getProfile.profileData.certificationsInfo
  );
  const additionalInfo = useSelector(
    (state) => state.getProfile.profileData.additionalInfo
  );

  const generatePDF = function () {
    const doc = new jsPDF();
    const content = componentRef.current;

    html2canvas(content).then((canvas) => {
      // Convert the canvas to an image
      const imgData = canvas.toDataURL("image/jpeg");

      var pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

      // Open the PDF in a new tab with download option
      var pdfDataUri = pdf.output("datauristring");
      var pdfWindow = window.open();
      pdfWindow.document.open();
      pdfWindow.document.write(
        '<iframe width="100%" height="100%" src="' + pdfDataUri + '"></iframe>'
      );
    });
  };
  const profile_img = localStorage.getItem("profileImage");

  return (
    <div>
      <Card>
        <CardBody>
          <div
            className="profile-pdf"
            style={{ fontFamily: "capitana, sans-serif" }}
            ref={componentRef}
          >
            <div>
              <Row>
                <Col className="col-8">
                  <h1>
                    {personalInfo_temp.firstname} {personalInfo_temp.lastname}
                  </h1>
                  <p>
                    {personalInfo_temp.city}
                    {", "}
                    {personalInfo_temp.state}
                    <br />
                    <span style={{ fontWeight: "500" }}>
                      {personalInfo_temp.email}
                    </span>
                  </p>

                  <p>
                    <span style={{ fontWeight: "500" }}>
                      Willing to relocate to: {personalInfo_temp.city} -{" "}
                      {personalInfo_temp.state}, {personalInfo_temp.country}
                    </span>
                  </p>
                </Col>
                {/* {profile_img != "" ? (
                  <Col>
                    <div className="float-end rounded-circle profile-img me-3">
                      <img
                        width={100}
                        className="rounded-circle"
                        src={profile_img}
                        alt="profile-icon"
                      />
                    </div>
                  </Col>
                ) : (
                  <></>
                )} */}
              </Row>
            </div>

            <div className="mb-4 mt-3">
              <h2 style={{ color: "#979797" }}>Work Experience</h2>
              <hr />
              {qualificationInfo?.map((item) => (
                <div>
                  <h3>{item.jobtitle}</h3>
                  <p style={{ color: "#979797" }}>
                    {item.company}-{item.statename},{item.cityname}
                  </p>
                  <p style={{ color: "#979797" }}> {getDate(item)}</p>
                  {item.jobdescription != "" ? (
                    <p className="mt-2 mb-2" style={{ fontWeight: "500" }}>
                      {item.jobdescription}{" "}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h2 style={{ color: "#979797" }}>Education</h2>
              <hr />
              {educationInfo?.map((item) => (
                <div>
                  <h3>{item.levelofeducation}</h3>
                  <p style={{ color: "#979797" }}>{getEducText(item)}</p>
                  <p style={{ color: "#979797" }}>{getDate(item)}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h2 style={{ color: "#979797" }}>Skills</h2>
              <hr />
              <ul>
                {skillsInfo?.map((item) => (
                  <li>{item.skillname}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h2 style={{ color: "#979797" }}>Certification and Licenses</h2>
              <hr />
              {certificationInfo?.map((item) => (
                <p style={{ fontWeight: "500" }}>{item.certificationname}</p>
              ))}
            </div>

            <div>
              <h2 style={{ color: "#979797" }}>Additional information</h2>
              <hr />
              {additionalInfo?.map((item) => (
                <div>
                  <ul
                    dangerouslySetInnerHTML={{
                      __html: convertText(item.summary),
                    }}
                  />
                  <ul
                    dangerouslySetInnerHTML={{
                      __html: convertText(item.additionalInfo),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardBody>
        <Col>
          {!props?.hideDownLoad ? (
            <Button
              className="float-end me-2 mb-2"
              onClick={(evt) => generatePDF(false)}
            >
              download
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Card>
    </div>
  );
}
