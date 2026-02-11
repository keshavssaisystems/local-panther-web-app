import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "_store";
import { fetchWrapper } from "_helpers";
import { addEducationThunk } from "_store/education.slice";
import { addQualificationThunk } from "_store/qualificationSkills.slice";
import { getProfileActions } from "_store";

export default function ProfileChatbot({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const profileData = useSelector((s) => s.getProfile.profileData || {});
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const candidateId = userDetails.UserId;

  const [step, setStep] = useState(0);
  const [skillsInput, setSkillsInput] = useState("");
  const [educationDegree, setEducationDegree] = useState("");
  const [educationInstitute, setEducationInstitute] = useState("");
  const [educationYear, setEducationYear] = useState("");
  const [experienceTitle, setExperienceTitle] = useState("");
  const [experienceCompany, setExperienceCompany] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  const onNext = async () => {
    if (step === 0) {
      // save skills if provided
      if (skillsInput.trim()) {
        try {
          const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
          // Use API directly to add/update skills. Using id 0 to create new entries.
          await fetchWrapper.put(
            `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateSkill/UpdateCandidateSkill/0/${candidateId}`,
            { skills }
          );
        } catch (e) {
          // ignore
        }
      }
    }

    if (step === 1) {
      // add education
      if (educationDegree || educationInstitute) {
        const payload = [
          {
            candidateid: candidateId,
            levelofeducationid: 0,
            degree: educationDegree,
            institution: educationInstitute,
            yearofpassing: educationYear,
          },
        ];
        await dispatch(addEducationThunk(payload));
      }
    }

    if (step === 2) {
      // add qualification / experience
      if (experienceTitle || experienceCompany) {
        const payload = [
          {
            candidateid: candidateId,
            jobtitle: experienceTitle,
            company: experienceCompany,
            iscurrentlyworking: false,
          },
        ];
        await dispatch(addQualificationThunk(payload));
      }
    }

    if (step < 2) {
      setStep(step + 1);
    } else {
      // finished: refresh profile and close with confirmation
      await dispatch(getProfileActions.getCandidate(candidateId));
      alert("Your profile has been updated successfully.");
      onClose();
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <Form>
          <FormGroup>
            <Label>Skills (comma separated)</Label>
            <Input type="textarea" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
          </FormGroup>
        </Form>
      );
    }
    if (step === 1) {
      return (
        <Form>
          <FormGroup>
            <Label>Degree / Qualification</Label>
            <Input value={educationDegree} onChange={(e) => setEducationDegree(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Institution</Label>
            <Input value={educationInstitute} onChange={(e) => setEducationInstitute(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Year</Label>
            <Input value={educationYear} onChange={(e) => setEducationYear(e.target.value)} />
          </FormGroup>
        </Form>
      );
    }
    return (
      <Form>
        <FormGroup>
          <Label>Most Recent Job Title</Label>
          <Input value={experienceTitle} onChange={(e) => setExperienceTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Company</Label>
          <Input value={experienceCompany} onChange={(e) => setExperienceCompany(e.target.value)} />
        </FormGroup>
      </Form>
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} backdrop="static">
      <ModalHeader toggle={onClose}>Complete Your Profile</ModalHeader>
      <ModalBody>
        <p>
          I noticed some details are missing from your profile. I can help you fill them in quickly. Please answer the questions below.
        </p>
        {renderStep()}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>Skip</Button>
        <Button color="primary" onClick={onNext}>{step < 2 ? "Next" : "Finish"}</Button>
      </ModalFooter>
    </Modal>
  );
}
