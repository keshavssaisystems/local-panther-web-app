import React, { useState } from "react";
import {
  Row,
  Col,
  Table,
  Input,
  FormGroup,
  Form,
  Label,
  FormText,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  ToolbarView,
  Heading,
  Underline,
  Strikethrough,
  Link,
  BlockQuote,
  Undo,
  Alignment,
} from "ckeditor5";

// import { FormatPainter } from "ckeditor5-premium-features";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";

import "./createJob.scss";

export default function AIJobCreation({ aiDescriptionData }) {
  const [descriptionData, setDescriptionData] = useState("");
  const [descriptionValidation, setDescriptionValidation] = useState(false);
  const setupDescriptionData = (event) => {
    setDescriptionData(event);
    setDescriptionValidation(event === "");
    aiDescriptionData(event);
  };
  return (
    <>
      <Row className="mt-4">
        <Col md={8} className="ml-15">
          <FormGroup>
            <Label for="description" className="fw-semi-bold">
              Describe the Job Role<span style={{ color: "red" }}>* </span>
            </Label>
            <CKEditor
              name="description"
              editor={ClassicEditor}
              config={{
                licenseKey: "GPL",
                plugins: [
                  Essentials,
                  Paragraph,
                  Bold,
                  Italic,
                  ToolbarView,
                  // FormatPainter,
                  Heading,
                  Underline,
                  Strikethrough,
                  Link,

                  BlockQuote,
                  // Table,
                  // MediaEmbed,
                  // ImageInsert,
                  Undo,
                  Alignment,
                ],
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "|",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "|",
                  "insertTable",
                  "mediaEmbed",
                  "imageUpload",
                  "|",
                  "undo",
                  "redo",
                  "alignment",
                  "outdent",
                  "indent",
                ],
              }}
              id="description"
              maxLength={2000}
              data={""}
              onChange={(e, editor) => {
                setupDescriptionData(editor.getData());
              }}
              className={
                descriptionValidation === true ? "ckeditor-invalid" : ""
              }
            >
              {" "}
              <div
                dangerouslySetInnerHTML={{
                  __html: descriptionData,
                }}
              />
            </CKEditor>
          </FormGroup>
          {descriptionValidation === true && (
            <FormText color="danger">Please enter description</FormText>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={11} className="ml-15"></Col>
      </Row>
    </>
  );
}
