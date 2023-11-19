import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import "./dashboard.scss";

export function MissingInterview({ cardOptions }) {
  let data2 = [
    {
      jobid: 58,
      scheduleinterviewid: 52,
      jobtitle: "Sr. Marketing Executive",
      candidatename: "Sai Bindu Raavi",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "10:30:00",
      intervieweremailids: "",
      meetingstatus: "Completed",
      format: "Video",
      videolink: "",
      durationid: 2,
      duration: "30 min",
      phonenumber: "(987)-654-32346",
      isappvideocall: true,
      interviewaddress: "",
    },
    {
      jobid: 56,
      scheduleinterviewid: 71,
      jobtitle: "Sr. Software Architect",
      candidatename: "Alice Colin",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "15:30:00",
      intervieweremailids: "iswatirupatirao@gmail.com",
      meetingstatus: "Not joined",
      format: "In-person",
      videolink: "",
      durationid: 3,
      duration: "45 min",
      phonenumber: "7545212356",
      isappvideocall: false,
      interviewaddress: "New Street Square Building, USA",
    },
    {
      jobid: 58,
      scheduleinterviewid: 52,
      jobtitle: "Sr. Marketing Executive",
      candidatename: "Sai Bindu Raavi",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "10:30:00",
      intervieweremailids: "",
      meetingstatus: "Completed",
      format: "Video",
      videolink: "",
      durationid: 2,
      duration: "30 min",
      phonenumber: "(987)-654-32346",
      isappvideocall: true,
      interviewaddress: "",
    },
    {
      jobid: 56,
      scheduleinterviewid: 71,
      jobtitle: "Sr. Software Architect",
      candidatename: "Alice Colin",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "15:30:00",
      intervieweremailids: "iswatirupatirao@gmail.com",
      meetingstatus: "Not joined",
      format: "In-person",
      videolink: "",
      durationid: 3,
      duration: "45 min",
      phonenumber: "7545212356",
      isappvideocall: false,
      interviewaddress: "New Street Square Building, USA",
    },
    {
      jobid: 58,
      scheduleinterviewid: 52,
      jobtitle: "Sr. Marketing Executive",
      candidatename: "Sai Bindu Raavi",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "10:30:00",
      intervieweremailids: "",
      meetingstatus: "Completed",
      format: "Video",
      videolink: "",
      durationid: 2,
      duration: "30 min",
      phonenumber: "(987)-654-32346",
      isappvideocall: true,
      interviewaddress: "",
    },
    {
      jobid: 56,
      scheduleinterviewid: 71,
      jobtitle: "Sr. Software Architect",
      candidatename: "Alice Colin",
      scheduledate: "2023-11-20T00:00:00",
      starttime: "15:30:00",
      intervieweremailids: "iswatirupatirao@gmail.com",
      meetingstatus: "Not joined",
      format: "In-person",
      videolink: "",
      durationid: 3,
      duration: "45 min",
      phonenumber: "7545212356",
      isappvideocall: false,
      interviewaddress: "New Street Square Building, USA",
    },
  ];
  return (
    <>
      <Col>
        <Card className="missed-interview">
          <div className="ms-3 mt-3 missed-interview-title">
            Missed interviews
          </div>
          <CardBody className="overflow-auto">
            <div className="mi-main-card">
              <div className="widget-chart-content">
                <div className="widget-content-left fsize-1">
                  <div className="widget-main-title ms-2 mt-2">
                    JAVA Developer
                  </div>
                </div>
                <div className="widget-content-left fsize-1">
                  <Row>
                    <Col>
                      {" "}
                      <div className="widget-main-subtitle ms-2">Candidate</div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                    <Col className="right-align me-2">
                      <div className="widget-main-subtitle ms-2">
                        Interviewer
                      </div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="divider" />
                <Row className="mt-2 mb-2">
                  <Col className="left-align">
                    {" "}
                    <div className="widget-main-subtitle-name ms-2">
                      11/10/2023
                    </div>
                  </Col>
                  <Col className="center-align">
                    <div className="widget-main-subtitle-name ms-2">
                      11:00AM
                    </div>
                  </Col>
                  <Col className="right-align me-2">
                    <div className="widget-main-subtitle-name ms-2">
                      Reschedule
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mi-main-card">
              <div className="widget-chart-content">
                <div className="widget-content-left fsize-1">
                  <div className="widget-main-title ms-2 mt-2">
                    JAVA Developer
                  </div>
                </div>
                <div className="widget-content-left fsize-1">
                  <Row>
                    <Col>
                      {" "}
                      <div className="widget-main-subtitle ms-2">Candidate</div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                    <Col className="right-align me-2">
                      <div className="widget-main-subtitle ms-2">
                        Interviewer
                      </div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="divider" />
                <Row className="mt-2 mb-2">
                  <Col className="left-align">
                    {" "}
                    <div className="widget-main-subtitle-name ms-2">
                      11/10/2023
                    </div>
                  </Col>
                  <Col className="center-align">
                    <div className="widget-main-subtitle-name ms-2">
                      11:00AM
                    </div>
                  </Col>
                  <Col className="right-align me-2">
                    <div className="widget-main-subtitle-name ms-2">
                      Reschedule
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mi-main-card">
              <div className="widget-chart-content">
                <div className="widget-content-left fsize-1">
                  <div className="widget-main-title ms-2 mt-2">
                    JAVA Developer
                  </div>
                </div>
                <div className="widget-content-left fsize-1">
                  <Row>
                    <Col>
                      {" "}
                      <div className="widget-main-subtitle ms-2">Candidate</div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                    <Col className="right-align me-2">
                      <div className="widget-main-subtitle ms-2">
                        Interviewer
                      </div>
                      <div className="widget-main-subtitle-name ms-2">
                        JAVA Developer
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="divider" />
                <Row className="mt-2 mb-2">
                  <Col className="left-align">
                    {" "}
                    <div className="widget-main-subtitle-name ms-2">
                      11/10/2023
                    </div>
                  </Col>
                  <Col className="center-align">
                    <div className="widget-main-subtitle-name ms-2">
                      11:00AM
                    </div>
                  </Col>
                  <Col className="right-align me-2">
                    <div className="widget-main-subtitle-name ms-2">
                      Reschedule
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
