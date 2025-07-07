import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ModalFooter,
  ModalHeader,
  ButtonGroup,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  FormText,
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import Loader from "react-loaders";
import { useDispatch, useSelector } from "react-redux";
import { dropdownActions, customerCandidateListsActions } from "_store";
import html2pdf from "html2pdf.js";
import moment from "moment";
import currentOffer from "assets/utils/images/job-detail-icons/currentoffer.svg";
import "../../_components/formComponents/Form.scss";
import "./custuploadoffer.scss";
import { USPhoneNumber } from "_helpers/helper";

export const CustomerUploadOffer = (props) => {
  const dispatch = useDispatch();
  const contentRef = useRef();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [pay, setPay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [payErr, setPayErr] = useState(false);
  const [startDateErr, setStartDateErr] = useState(false);
  const [finalOffer, setFinalOffer] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [payType, setPayType] = useState("");
  const [payTypeErr, setPayTypeErr] = useState(false);
  const [activeTab, setActiveTab] = useState(2);
  const [showPdfPrev, setShowPdfPrev] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [offerLetterTemplateError, setOfferLetterTemplateError] =
    useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");

  const payPeriodTypeOption = useSelector(
    (state) => state.dropdown.payPeriodType
  );

  const offerLetterTemplateList = useSelector(
    (state) => state.customerCandidateList.offerLetterTemplates
  );

  useEffect(() => {
    getPayPeriod();
    dispatch(customerCandidateListsActions.getofferLetterTemplate());
  }, []);

  useEffect(() => {
    if (props?.data?.jobPaymentBenefitDtos?.length > 0) {
      setPayType(props?.data?.jobPaymentBenefitDtos[0].payperiodtype);
      setPay(props?.data?.jobPaymentBenefitDtos[0].minimumamount);
    }
    if (props?.data?.jobOfferDtos?.length > 0) {
      setPayType(props?.data?.jobOfferDtos[0].payperiodtype);
      setPay(props?.data?.jobOfferDtos[0].salary);
    }
  }, [props.data]);

  const getPayPeriod = async () => {
    await dispatch(dropdownActions.getPayPeriodTypeThunk());
  };
  const onDrop = useCallback((acceptedFiles) => {
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");
    setFileError(name === "");
    setFileName(name);
    setFile(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .doc",
  });

  const onCancel = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  const onUploadClick = async () => {
    if (
      (fileName === "" && activeTab === 1) ||
      startDate === "" ||
      pay === "" ||
      parseInt(pay) === 0 ||
      payType === "" ||
      parseInt(payType) === 0
    ) {
      if (activeTab === 1) {
        setFileError(fileName === "");
      }

      setStartDateErr(startDate === "");
      setPayErr(pay === "" || parseInt(pay) === 0);
      setPayTypeErr(payType === "" || parseInt(payType) === 0);
      return false;
    } else if (fileName !== "" && startDate !== " " && pay !== "") {
      props.uploadOfferDoc(
        file,
        startDate,
        pay.replaceAll(",", ""),
        finalOffer,
        payType
      );
    } else if (
      activeTab === 2 &&
      offerLetterTemplateList.length > 0 &&
      !showPdfPrev
    ) {
      setSelectedTemplate(offerLetterTemplateList[0].templatetype);
      generateUpdatedHtml(offerLetterTemplateList[0].template);
      setShowPdfPrev(true);
    } else if (activeTab === 2 && showPdfPrev) {
      const element = contentRef.current;

      await waitForImagesToLoad(element);
      // Generate PDF as Blob
      const options = {
        margin: 10,
        filename: generateFilenameWithTimestamp(),
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 1.2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      props.updateLoading(true);
      setTimeout(async () => {
        let fileData = await html2pdf()
          .from(element)
          .set(options)
          .outputPdf("blob");

        const file = new File([fileData], generateFilenameWithTimestamp(), {
          type: "application/pdf",
        });
        let templateData = offerLetterTemplateList.find(
          (d) => d.templatetype === selectedTemplate
        );
        props.updateLoading(false);
        props.uploadOfferDoc(
          [file],
          startDate,
          pay.replaceAll(",", ""),
          finalOffer,
          payType,
          templateData?.offerlettertemplateid,
          generatedHtml
        );
      }, [100]);
    }
  };

  const setPayVal = (e) => {
    setPay(e.target.value);
    setPayErr(e.target.value === "" || parseInt(e.target.value) === 0);
  };

  const onPayType = (e) => {
    setPayTypeErr(e.target.value === "" || parseInt(e.target.value) === 0);
    setPayType(e.target.value);
  };

  const onSelectTemplate = (e) => {
    setSelectedTemplate(e.target.value);
    let ind = offerLetterTemplateList.findIndex(
      (d) => d.templatetype === e.target.value
    );
    if (ind !== -1) {
      generateUpdatedHtml(offerLetterTemplateList[ind].template);
    }
  };

  const generateUpdatedHtml = (template) => {
    let userDetail = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails"))
      : {};

    const offerData = {
      companylogo: localStorage.getItem("logo")
        ? localStorage.getItem("logo")
        : "",
      Letterhead: "Offer Letter",
      date: moment().format("MM/DD/YYYY"),
      candidateFullName: props.data.firstname + " " + props.data.lastname,
      candidateAddress:
        (props?.data?.cityname ? props?.data?.cityname : "") +
        (props?.data?.statename ? ", " + props?.data?.statename : ""),
      cityStateZip:
        (props?.data?.cityname ? props?.data?.cityname : "") +
        (props?.data?.statename ? ", " + props?.data?.statename : "") +
        (props?.data?.zipcode ? ", " + props?.data?.zipcode : ""),
      candidateFirstName: props.data.firstname,
      companyName: props.data.companyname,
      jobTitle: props.data.jobtitle,
      startDate: moment(startDate)?.format("YYYY-MM-DD").toString(),
      salaryAmount: new Intl.NumberFormat("en-US").format(
        pay.replaceAll(",", "")
      ),
      salaryType: payType,
      yourName: userDetail.FirstName + " " + userDetail.LastName,
      yourTitle: userDetail.role,
      phoneNumber: USPhoneNumber(userDetail.Phonenumber),
      emailAddress: userDetail.EmailId,
    };
    const finalHtml = replacePlaceholders(template, offerData);
    setGeneratedHtml(finalHtml);
  };

  const replacePlaceholders = (template, data) => {
    return template.replace(
      /\[([^\]]+)\]/g,
      (_, key) => data[key.trim()] || `[${key}]`
    );
  };

  function generateFilenameWithTimestamp(
    prefix = "offer_letter",
    extension = "pdf"
  ) {
    const now = new Date();

    // Get date components

    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");

    // Get time components
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Create the timestamp string in a common format (e.g., YYYYMMDD_HHmmss_SSS)
    const timestamp = `${month}${day}_${hours}${minutes}${seconds}`;

    // Combine prefix, timestamp, and extension
    return `${prefix}_${timestamp}.${extension}`;
  }

  const generatePDF = async (event) => {
    const content = contentRef.current;

    if (content) {
      props.updateLoading(true);

      await waitForImagesToLoad(content);
      const pdfOptions = {
        margin: 10,
        html2canvas: {
          scale: 1.2,
          useCORS: true,
        },
        filename: generateFilenameWithTimestamp(),
        image: { type: "jpeg", quality: 0.9 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      setTimeout(() => {
        html2pdf().from(content).set(pdfOptions).save();
        props.updateLoading(false);
      }, [100]);
    }
  };

  const waitForImagesToLoad = async (container) => {
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // don't block on broken image
        });
      })
    );
  };

  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Make Offer</ModalHeader>
      <ModalBody
        style={{ maxHeight: "75vh", overflow: "auto", minHeight: "40vh" }}
      >
        {props.loading ? (
          <div className="offer-loading-div">
            <Loader
              type="line-scale-pulse-out-rapid"
              className="d-flex justify-content-center"
            />
          </div>
        ) : (
          <div>
            <Nav fill pills>
              <NavItem>
                <NavLink
                  active={activeTab === 2}
                  // className={activeTab === 2 ? "active" : ""}
                  onClick={() => {
                    setActiveTab(2);
                  }}
                >
                  System Generated Offer
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 1}
                  // className={activeTab === 1 ? "active" : ""}
                  onClick={() => {
                    setActiveTab(1);
                  }}
                >
                  Manual Upload Offer
                </NavLink>
              </NavItem>
              <TabContent activeTab={activeTab}>
                <hr style={{ margin: "0px", marginBottom: "1rem" }}></hr>
                <TabPane tabId={1}>
                  <Row>
                    {" "}
                    <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                      <FormGroup>
                        <Label for={"pay"} className="fw-semi-bold">
                          Salary<span style={{ color: "red" }}>* </span>
                        </Label>
                        <InputGroup>
                          <InputGroupText>$</InputGroupText>
                          <Input
                            id={"pay"}
                            name={"pay"}
                            type={"number"}
                            value={pay}
                            step={"any"}
                            min={0}
                            placeholder={"Enter salary"}
                            invalid={false}
                            onChange={(e) => setPayVal(e)}
                          />
                        </InputGroup>
                        {payErr && (
                          <FormText color="danger">
                            Please enter valid salary amount
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                      <Label className="fw-semi-bold">
                        Pay period type <span style={{ color: "red" }}>* </span>
                      </Label>
                      <Input
                        id={"payPeriodType"}
                        name={"payPeriodType"}
                        type={"select"}
                        onChange={(e) => onPayType(e)}
                      >
                        <option key={0} value={"0"}>
                          Select pay period type
                        </option>
                        {payPeriodTypeOption.length > 0 &&
                          payPeriodTypeOption.map((options) => (
                            <option
                              key={options.id}
                              value={options.name}
                              selected={payType === options.name}
                            >
                              {options.name}
                            </option>
                          ))}
                      </Input>
                      {payTypeErr && (
                        <FormText color="danger">
                          Please select pay period type
                        </FormText>
                      )}
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                      <FormGroup>
                        <Label for={"pay"} className="fw-semi-bold">
                          Start date<span style={{ color: "red" }}>* </span>
                        </Label>
                        <DatePicker
                          name="startdate"
                          placeholderText="Select start date"
                          className="form-control"
                          selected={startDate}
                          minDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          onChange={(date) => {
                            setStartDate(date);
                            setStartDateErr(date === "");
                          }}
                        />
                        {startDateErr && (
                          <FormText color="danger">
                            Please select start date
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <div className="dropzone-wrapper dropzone-wrapper-sm">
                        <Dropzone
                          onDrop={(e) => onDrop(e)}
                          onFileDialogCancel={() => onCancel()}
                        >
                          {() => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="dropzone-content">
                                <p>Upload offer for candidate</p>
                                <p>
                                  Try dropping some files here, or click to
                                  select files to upload.
                                </p>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      </div>
                      <div className="pt-2">
                        <strong className="content-title">
                          <span className="me-2 mt-1 mb-1">{fileName}</span>
                        </strong>
                        {fileError ? (
                          <FormText color="danger">
                            Please select file for upload.
                          </FormText>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Input
                        type="checkbox"
                        value={finalOffer}
                        onChange={(e) => {
                          setFinalOffer(e.target.checked);
                        }}
                      />
                      <Label className="ps-1"> Is final offer</Label>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={2}>
                  <Row>
                    {" "}
                    {!showPdfPrev && (
                      <>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                          <FormGroup>
                            <Label for={"pay"} className="fw-semi-bold">
                              Salary<span style={{ color: "red" }}>* </span>
                            </Label>
                            <InputGroup>
                              <InputGroupText>$</InputGroupText>
                              <Input
                                id={"pay"}
                                name={"pay"}
                                type={"number"}
                                value={pay}
                                step={"any"}
                                min={0}
                                placeholder={"Enter salary"}
                                invalid={false}
                                onChange={(e) => setPayVal(e)}
                              />
                            </InputGroup>
                            {payErr && (
                              <FormText color="danger">
                                Please enter valid salary amount
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                          <Label className="fw-semi-bold">
                            Pay period type{" "}
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"payPeriodType"}
                            name={"payPeriodType"}
                            type={"select"}
                            onChange={(e) => onPayType(e)}
                          >
                            <option key={0} value={"0"}>
                              Select pay period type
                            </option>
                            {payPeriodTypeOption.length > 0 &&
                              payPeriodTypeOption.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.name}
                                  selected={payType === options.name}
                                >
                                  {options.name}
                                </option>
                              ))}
                          </Input>
                          {payTypeErr && (
                            <FormText color="danger">
                              Please select pay period type
                            </FormText>
                          )}
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                          <FormGroup>
                            <Label for={"pay"} className="fw-semi-bold">
                              Start date<span style={{ color: "red" }}>* </span>
                            </Label>
                            <DatePicker
                              name="startdate"
                              placeholderText="Select start date"
                              className="form-control"
                              selected={startDate}
                              minDate={new Date()}
                              showMonthDropdown
                              showYearDropdown
                              onChange={(date) => {
                                setStartDate(date);
                                setStartDateErr(date === "");
                              }}
                            />
                            {startDateErr && (
                              <FormText color="danger">
                                Please select start date
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <Input
                            type="checkbox"
                            value={finalOffer}
                            onChange={(e) => {
                              setFinalOffer(e.target.checked);
                            }}
                          />
                          <Label className="ps-1"> Is final offer</Label>
                        </Col>
                      </>
                    )}
                    {showPdfPrev && (
                      <>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                          <FormGroup>
                            <Label for={"pay"} className="fw-semi-bold">
                              Select Template
                              <span style={{ color: "red" }}>* </span>
                            </Label>
                            <Input
                              id={"offerlettertemplate"}
                              name={"offerlettertemplate"}
                              type={"select"}
                              value={selectedTemplate}
                              onChange={(e) => onSelectTemplate(e)}
                            >
                              {offerLetterTemplateList.length > 0 &&
                                offerLetterTemplateList.map((options) => (
                                  <option
                                    key={options.offerlettertemplateid}
                                    value={options.templatetype}
                                    selected={
                                      selectedTemplate === options.templatetype
                                    }
                                  >
                                    {options.templatetype}
                                  </option>
                                ))}
                            </Input>
                            {offerLetterTemplateError && (
                              <FormText color="danger">
                                Please select template for offer letter.
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                        <Col
                          style={{ textAlign: "end", paddingTop: "16px" }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={8}
                          xl={8}
                          xxl={8}
                        >
                          <img
                            src={currentOffer}
                            alt="new offer"
                            className={"icon-pointer"}
                            width={"20px"}
                            title="Click here to download offer letter"
                            onClick={() => generatePDF()}
                          ></img>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <Card>
                            <CardBody>
                              <div id="pdf-content" ref={contentRef}>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: generatedHtml,
                                  }}
                                ></div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </>
                    )}
                  </Row>
                </TabPane>
              </TabContent>
            </Nav>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          {activeTab === 2 && showPdfPrev && (
            <Button
              color="primary"
              className="me-2"
              onClick={() => setShowPdfPrev(false)}
            >
              Back
            </Button>
          )}
          <Button
            color="primary"
            className="me-2"
            onClick={() => onUploadClick()}
          >
            {activeTab === 1
              ? "Upload File"
              : showPdfPrev && activeTab === 2
              ? "Confirm & Submit"
              : "Generate offer"}
          </Button>
          <Button color="secondary" onClick={() => props.onClose()}>
            Close
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};
