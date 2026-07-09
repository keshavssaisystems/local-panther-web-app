import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  FormText,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import Loader from "react-loaders";
import { useDispatch, useSelector } from "react-redux";
import { dropdownActions, customerCandidateListsActions } from "_store";
import html2pdf from "html2pdf.js";
import moment from "moment";
import uploadIcon from "assets/utils/images/job-detail-icons/upload-icon2.svg";
import cvIcon from "assets/utils/images/customer/view_cv_icon.svg";
import currentOfferIcon from "assets/utils/images/job-detail-icons/currentoffer.svg";
import "../../_components/formComponents/Form.scss";
import "./custuploadoffer.scss";
import { USPhoneNumber } from "_helpers/helper";

export const CustomerUploadOffer = (props) => {
  const dispatch = useDispatch();
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

  // Reset transient UI state whenever the modal is closed so stale data
  // from a previous candidate/session never bleeds into the next open.
  useEffect(() => {
    if (!props.isOpen) {
      setShowPdfPrev(false);
      setGeneratedHtml("");
      setFileName("");
      setFile("");
      setFileError(false);
      setActiveTab(2);
      setSelectedTemplate("");
      setOfferLetterTemplateError(false);
      setPayErr(false);
      setStartDateErr(false);
      setPayTypeErr(false);
      setStartDate("");
      setFinalOffer(false);
    }
  }, [props.isOpen]);

  const getPayPeriod = async () => {
    await dispatch(dropdownActions.getPayPeriodTypeThunk());
  };
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      setFileError(true);
      return;
    }
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");
    setFileError(name === "");
    setFileName(name);
    setFile(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .doc",
  });

  const onCancel = () => {};

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
    } else if (activeTab === 1 && fileName !== "" && startDate !== "" && pay !== "") {
      props.uploadOfferDoc(
        file,
        startDate,
        String(pay).replaceAll(",", ""),
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
          .from(generatedHtml, "string")
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
          String(pay).replaceAll(",", ""),
          finalOffer,
          payType,
          templateData?.offerlettertemplateid,
          generatedHtml
        );
      }, 100);
    } else if (activeTab === 2 && offerLetterTemplateList.length === 0 && !showPdfPrev) {
      setOfferLetterTemplateError(true);
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
      candidateFullName: props.data.candidatename ? props.data.candidatename : props.data.firstname + " " + props.data.lastname,
      candidateAddress:
        (props?.data?.cityname ? props?.data?.cityname : "") +
        (props?.data?.statename ? ", " + props?.data?.statename : ""),
      cityStateZip:
        (props?.data?.zipcode ? ", " + props?.data?.zipcode : ""),
      candidateFirstName: props.data.firstname ? props.data.firstname : props.data?.candidatename?.split(" ")[0],
      companyName: props.data.companyname,
      jobTitle: props.data.jobtitle,
      startDate: moment(startDate)?.format("MM/DD/YYYY").toString(),
      salaryAmount: new Intl.NumberFormat("en-US").format(
        String(pay).replaceAll(",", "")
      ),
      salaryType: payType,
      yourName: userDetail.FirstName + " " + userDetail.LastName,
      yourTitle: userDetail.role,
      phoneNumber: USPhoneNumber(userDetail.Phonenumber),
      emailAddress: userDetail.EmailId,
    };
    const finalHtml = replacePlaceholders(template, offerData);
    // Inject explicit <p> margins so Bootstrap's CSS reset (margin-top:0) doesn't
    // collapse spacing in either the iframe preview or the html2pdf-generated PDF.
    const patchedHtml = finalHtml.replace(
      '</head>',
      '<style>p { margin-top: 1em !important; margin-bottom: 1em !important; }</style></head>'
    );
    setGeneratedHtml(patchedHtml);
  };

  const replacePlaceholders = (template, data) => {
    //return template.replace(/\[([^\]]+)\]/g, (_, key) => data[key.trim()] || `[${key}]`);
    return template.replace(/\[([^\]]+)\]/g, (_, key) => data[key.trim()] || '');
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
    if (generatedHtml) {
      props.updateLoading(true);

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
      setTimeout(async () => {
        await html2pdf().from(generatedHtml, "string").set(pdfOptions).save();
        props.updateLoading(false);
      }, 100);
    }
  };

  return (
    <Modal
      size={showPdfPrev ? "xl" : "lg"}
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={props.loading ? "static" : true}
      keyboard={!props.loading}
      fade={true}
    >
      <ModalHeader
        close={
          <button
            type="button"
            className="btn-close"
            disabled={props.loading}
            aria-label="Close"
            onClick={() => !props.loading && props.onClose()}
          />
        }
      >
        {showPdfPrev ? "Preview Offer Letter" : "Make Offer"}
      </ModalHeader>
      <ModalBody
        style={{ padding: "1.5rem", position: "relative", maxHeight: "82vh", overflowY: "auto" }}
      >
        {/* Loading overlay */}
        {props.loading && (
          <div className="overlay-loader">
            <Loader type="line-scale-pulse-out-rapid" className="d-flex justify-content-center" />
          </div>
        )}

        {/* Counter Offer Banner */}
        {(() => {
          const latestCounterOffer = props.data?.jobCounterOfferDtos?.[0];
          return latestCounterOffer?.counterofferamount ? (
            <div className="offer-counter-banner">
              <span className="text-muted me-1">Candidate Counter Offer:</span>
              <strong>
                ${new Intl.NumberFormat("en-US").format(latestCounterOffer.counterofferamount)}
              </strong>
              {latestCounterOffer.proposedstartdate && (
                <span className="text-muted ms-2">
                  &middot; Proposed Start:{" "}
                  {moment.utc(latestCounterOffer.proposedstartdate).format("MM/DD/YYYY")}
                </span>
              )}
            </div>
          ) : null;
        })()}

        {showPdfPrev ? (
          /* ─── Preview Panel ─── */
          <div className="offer-preview-panel">
            <div className="offer-preview-toolbar">
              <div className="d-flex align-items-center gap-2">
                <Label className="mb-0 fw-semi-bold text-nowrap">Template:</Label>
                <Input
                  type="select"
                  bsSize="sm"
                  value={selectedTemplate}
                  onChange={(e) => onSelectTemplate(e)}
                  style={{ width: "200px" }}
                >
                  {offerLetterTemplateList.map((opt) => (
                    <option key={opt.offerlettertemplateid} value={opt.templatetype}>
                      {opt.templatetype}
                    </option>
                  ))}
                </Input>
                {offerLetterTemplateError && (
                  <span style={{ color: "red", fontSize: "12px" }}>Please select a template.</span>
                )}
              </div>
              <img
                src={currentOfferIcon}
                alt="Download offer letter"
                className="icon-pointer"
                width="20px"
                title="Click here to download offer letter"
                onClick={() => generatePDF()}
              />
            </div>
            <div className="offer-preview-frame">
              <iframe
                srcDoc={generatedHtml}
                title="Offer Letter Preview"
                scrolling="no"
                onLoad={(e) => {
                  const iframe = e.target;
                  const height =
                    iframe.contentDocument?.documentElement?.scrollHeight ||
                    iframe.contentDocument?.body?.scrollHeight ||
                    600;
                  iframe.style.height = height + "px";
                }}
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none",
                  display: "block",
                  overflow: "hidden",
                }}
              />
            </div>
          </div>
        ) : (
          /* ─── Form Panel ─── */
          <div className="offer-form-panel">

            {/* Section: Offer Details */}
            <div className="offer-section">
              <div className="offer-section-title">Offer Details</div>
              <Row className="g-3">
                <Col xs={12} sm={6} md={4}>
                  <FormGroup className="mb-0">
                    <Label className="fw-semi-bold">
                      Salary <span className="text-danger">*</span>
                    </Label>
                    <InputGroup>
                      <InputGroupText>$</InputGroupText>
                      <Input
                        type="number"
                        value={pay}
                        step="any"
                        min={0}
                        placeholder="Enter salary"
                        onChange={(e) => setPayVal(e)}
                      />
                    </InputGroup>
                    {payErr && (
                      <FormText color="danger">Please enter valid salary amount</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <FormGroup className="mb-0">
                    <Label className="fw-semi-bold">
                      Pay Period Type <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      value={payType}
                      onChange={(e) => onPayType(e)}
                    >
                      <option value="0">Select pay period type</option>
                      {payPeriodTypeOption.map((opt) => (
                        <option key={opt.id} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </Input>
                    {payTypeErr && (
                      <FormText color="danger">Please select pay period type</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <FormGroup className="mb-0">
                    <Label className="fw-semi-bold">
                      Start Date <span className="text-danger">*</span>
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
                        setStartDateErr(!date);
                      }}
                    />
                    {startDateErr && (
                      <FormText color="danger">Please select start date</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <div className="offer-final-check">
                    <Input
                      type="checkbox"
                      id="finalOfferCheck"
                      checked={finalOffer}
                      onChange={(e) => setFinalOffer(e.target.checked)}
                    />
                    <Label for="finalOfferCheck" className="mb-0 ms-2">
                      Mark as Final Offer
                    </Label>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Section: Offer Document */}
            <div className="offer-section">
              <div className="offer-section-title">Offer Document</div>
              <div className="offer-method-cards">
                <div
                  className={`offer-method-card${activeTab === 2 ? " active" : ""}`}
                  onClick={() => setActiveTab(2)}
                >
                  <div className="offer-method-icon">
                    <img src={cvIcon} alt="template" width="28" height="32" />
                  </div>
                  <div className="offer-method-text">
                    <div className="offer-method-label">Use Template</div>
                    <div className="offer-method-desc">Auto-generate from a system template</div>
                  </div>
                </div>
                <div
                  className={`offer-method-card${activeTab === 1 ? " active" : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  <div className="offer-method-icon">
                    <img src={uploadIcon} alt="upload" width="28" height="28" />
                  </div>
                  <div className="offer-method-text">
                    <div className="offer-method-label">Upload Document</div>
                    <div className="offer-method-desc">Upload your own PDF, DOCX, or DOC</div>
                  </div>
                </div>
              </div>

              {activeTab === 2 && (
                <div className="offer-template-hint">
                  Fill in the offer details above, then click <strong>Generate Offer</strong> to
                  preview and choose a template before submitting.
                </div>
              )}

              {activeTab === 1 && (
                <div className="mt-3">
                  <div className="dropzone-wrapper dropzone-wrapper-sm">
                    <Dropzone
                      onDrop={(e) => onDrop(e)}
                      onFileDialogCancel={() => onCancel()}
                    >
                      {() => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <div className="dropzone-content">
                            <p>Drop your offer document here</p>
                            <p>or click to select a file (PDF, DOCX, DOC)</p>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  </div>
                  {fileName && (
                    <div className="offer-file-name mt-2">
                      Selected: {fileName}
                    </div>
                  )}
                  {fileError && (
                    <FormText color="danger">Please select a file to upload.</FormText>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        {showPdfPrev ? (
          <Button color="light" disabled={props.loading} onClick={() => setShowPdfPrev(false)}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <div className="d-flex gap-2">
          <Button color="secondary" outline disabled={props.loading} onClick={() => props.onClose()}>
            Cancel
          </Button>
          {props.loading === false && (
            <Button color="primary" onClick={() => onUploadClick()}>
              {activeTab === 1
                ? "Upload File"
                : showPdfPrev
                ? "Confirm & Submit"
                : "Generate Offer"}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};
