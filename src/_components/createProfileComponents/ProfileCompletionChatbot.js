import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
  Card,
  CardBody,
  Alert
} from 'reactstrap';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import { FaRobot } from "react-icons/fa";
import Select from 'react-select';
import './ProfileCompletionChatbot.scss';
import {
  dropdownActions,
  studyFieldActions,
  getLocationFilter,
  yearActions,
  monthActions,
  profileCompletionActions
} from "_store";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { convertDateToYYYMMDD } from '_helpers/helper';
const ProfileCompletionChatbot = ({ isOpen, missingFields, onClose, candidateId }) => {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    skills: '',
    education: [],
    experience: []
  });
  const [errors, setErrors] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const levelOfEducationOption = useSelector((state) => state.dropdown.levelOfEducationList || []);
  const studyFieldOption = useSelector((state) => state.getStudyField.studyFieldList || []);
  const monthList = useSelector((state) => state.monthList.user.data || []);
  const yearList = useSelector((state) => state.yearList.user.data || []);
  const [educationLevels, setEducationLevels] = useState([]);
  const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  console.log(candidateId);
  useEffect(() => {
    if (studyFieldOption?.length > 0) {
      setFieldOfStudyOptions(studyFieldOption);
    }
  }, [studyFieldOption]);

  // US States for dropdown
  const countries = [
    { value: 1, label: 'USA' }
  ];

  const steps = [
    { key: 'welcome', title: 'Welcome', required: false },
    { key: 'skills', title: 'Skills', required: true },
    { key: 'education', title: 'Education', required: true },
    { key: 'experience', title: 'Experience', required: true },
    { key: 'review', title: 'Review', required: false }
  ];

  // Filter steps based on missing fields
  const requiredSteps = steps.filter(step =>
    missingFields.includes(step.key) || step.key === 'review' || step.key === 'welcome'
  );

  const currentStepData = requiredSteps[currentStep];

  useEffect(() => {
    if (!levelOfEducationOption || levelOfEducationOption.length === 0) dispatch(dropdownActions?.getLevelOFEducationThunk());
    if (!studyFieldOption || studyFieldOption.length === 0) dispatch(studyFieldActions.getStudyField());
    if (!yearList || yearList.length === 0) dispatch(yearActions.getyear());
    if (!monthList || monthList.length === 0) dispatch(monthActions.getmonth());


    console.log("monthList in useEffect:", monthList);
    const monthOptions = monthList?.map(({ id: value, ...rest }) => {
      return {
        value: `${value}`,
        label: `${rest.name}`,
        id: rest.id
      };
    });
    console.log(monthOptions);
    setMonths(monthOptions);

  }, [dispatch, monthList, yearList, levelOfEducationOption, studyFieldOption]);


  useEffect(() => {
    const newEducationLevels = levelOfEducationOption.map(({ id: value, ...rest }) => {
      return {
        value: `${value}`,
        label: `${rest.name}`,
      };
    });
    setEducationLevels(newEducationLevels);
  }, [levelOfEducationOption]);

  useEffect(() => {
    const yearOptions = yearList?.map(({ id: value, ...rest }) => {
      return {
        value: `${rest.id}`,
        label: `${rest.name}`,
        id: rest.id
      };
    });
    setYears(yearOptions);
  }, [yearList]);

  // Add Education Entry
  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          levelOfEducation: '',
          levelofeducationid: 0,
          fieldOfStudy: '',
          fieldofstudyid: 0,
          school: '',
          city: '',
          cityid: 0,
          state: '',
          stateid: 0,
          country: 'United States',
          countryid: 0
        }
      ]
    }));
  };

  // Remove Education Entry
  const removeEducationEntry = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Update Education Entry
  const updateEducationEntry = (id, field, updates) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  // Add Experience Entry
  const addExperienceEntry = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          jobTitle: '',
          currentlyWorking: false,
          fromMonth: '',
          fromYear: '',
          toMonth: '',
          toYear: '',
          jobDescription: ''
        }
      ]
    }));
  };

  // Remove Experience Entry
  const removeExperienceEntry = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Update Experience Entry
  const updateExperienceEntry = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Validation
  const validateStep = () => {
    const newErrors = {};

    if (currentStepData.key === 'skills') {
      if (!formData.skills.trim()) {
        newErrors.skills = 'Please enter at least one skill';
      }
    }

    if (currentStepData.key === 'education') {
      if (formData.education.length === 0) {
        newErrors.education = 'Please add at least one education entry';
      } else {
        formData.education.forEach((edu, index) => {
          if (!edu.levelOfEducation) {
            newErrors[`education_${index}_level`] = 'Level of education is required';
          }
          if (!edu.fieldOfStudy) {
            newErrors[`education_${index}_field`] = 'Field of study is required';
          }
          if (!edu.school) {
            newErrors[`education_${index}_school`] = 'School name is required';
          }
        });
      }
    }

    if (currentStepData.key === 'experience') {
      if (formData.experience.length === 0) {
        newErrors.experience = 'Please add at least one experience entry';
      } else {
        formData.experience.forEach((exp, index) => {
          if (!exp.jobTitle) {
            newErrors[`experience_${index}_title`] = 'Job title is required';
          }
          if (!exp.jobDescription) {
            newErrors[`experience_${index}_desc`] = 'Job description is required';
          }
          if (!exp.currentlyWorking && (!exp.toMonth || !exp.toYear)) {
            newErrors[`experience_${index}_to`] = 'End date is required';
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Next
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < requiredSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        handleComplete();
      }
    }
  };

  // Handle Back
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Handle Skip
  const handleSkip = () => {
    if (currentStep < requiredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  // Handle Complete
  const handleComplete = () => {
    let requestPayload = getPayload();

    dispatch(profileCompletionActions.updateProfileThunk({
      payload: requestPayload
    }))
      .then(() => {
        setIsComplete(true);
      })
      .catch(error => {
        console.error('Profile update error:', error);
        setErrors({ submit: 'Failed to update profile. Please try again.' });
      });
  };

  const getPayload = () => {
    const payload = { ...formData };
    let requestPayload = {
      "educationList": payload.education.map(edu => ({
        candidateeducationid: 0,
        fieldofstudy: edu.fieldOfStudy,
        fieldofstudyid: edu.fieldofstudyid,
        levelofeducation: edu.levelOfEducation,
        levelofeducationid: edu.levelofeducationid,
        school: edu.school,
        cityid: edu.cityid,
        countryid: edu.countryid,
        stateid: edu.stateid
      })),
      "qualificationList": payload.experience.map(exp => {
        const endDate = exp.currentlyWorking ? null : (exp.toMonth && exp.toYear ?
          new Date(`${exp.toMonth} 1, ${exp.toYear}`)
          : null);

        return {
          candidatequalificationid: 0,
          startdate: exp.fromMonth && exp.fromYear ?
            new Date(`${exp.fromMonth} 1, ${exp.fromYear}`) : null,
          enddate: endDate,
          company: exp.company || '',
          iscurrentlyworking: exp.currentlyWorking,
          jobtitle: exp.jobTitle,
          jobdescription: exp.jobDescription
        };
      }),
      "skillsList": payload.skills
    };

    return requestPayload;
  };

  // Initialize education/experience arrays if empty
  useEffect(() => {
    if (isOpen) {
      if (formData.education.length === 0 && missingFields.includes('education')) {
        addEducationEntry();
      }
      if (formData.experience.length === 0 && missingFields.includes('experience')) {
        addExperienceEntry();
      }
    }
  }, [isOpen, missingFields]);

  // Close handler
  const handleClose = () => {
    if (!isComplete && currentStep > 0) {
      //
    }

    // Reset state
    setCurrentStep(0);
    setFormData({
      skills: '',
      education: [],
      experience: []
    });
    setErrors({});
    setIsComplete(false);
    onClose();
  };

  // Render Welcome Step
  const renderWelcomeStep = () => (
    <div className="step-content review-content">
      <div className="step-header">
        <h4>Welcome</h4>
        <p className="text-muted">
          Welcome to your OpenWorX Profile Assistant! We're here to guide you through completing your profile for optimal AI job matching.
        </p>

        <p className="text-muted">
          To complete your profile, we need the following mandatory details: <br />
          <ul>
            {missingFields.includes('skills') && (<li>Skills</li>)}
            {missingFields.includes('education') && (<li>Education</li>)}
            {missingFields.includes('experience') && (<li>Experience</li>)}
          </ul>
        </p>

        <p className="text-muted">
          Ready to start filling them out?
        </p>
      </div>
    </div>
  );

  // Render Skills Step
  const renderSkillsStep = () => (
    <div className="step-content">
      <div className="step-header">
        <p><strong>Skills</strong></p>
        <p className="text-muted">
          Great! Let's start with your professional skills.<br />
          Please list your top 5 relevant skills (comma-separated,<br />
          e.g., Figma, UX Research, Prototyping).
        </p>
      </div>

      <FormGroup>
        <Input
          type="textarea"
          rows="5"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="Figma, UX Research, Prototyping"
          invalid={!!errors.skills}
        />
        {errors.skills && <div className="text-danger small mt-1">{errors.skills}</div>}
      </FormGroup>
    </div>
  );

  // Render Education Step
  const renderEducationStep = () => (
    <div className="step-content">
      <div className="step-header">
        <p><strong>Education</strong></p>
        <p className="text-muted">
          Next, let's talk about your highest level of education.<br />
          Please provide your <strong>Degree/Certification</strong> and the <strong>Institution Name</strong>.
        </p>
      </div>

      {formData.education.map((edu, index) => (
        <Card key={edu.id} className="mb-3 education-card">
          <CardBody>
            {formData.education.length > 1 && (
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="entry-summary">
                  {edu.levelOfEducation && (
                    <div className="font-weight-bold">{edu.levelOfEducation}</div>
                  )}
                  {edu.school && (
                    <div className="text-muted small">
                      {edu.school}
                      {edu.city && edu.state && `, ${edu.city}, ${edu.state}`}
                    </div>
                  )}
                </div>

                <Button
                  color="link"
                  className="text-danger p-0"
                  onClick={() => removeEducationEntry(edu.id)}
                >
                  <FiTrash2 size={18} />
                </Button>
              </div>
            )}
            {formData.education.length - 1 === index && (
              <>
                <FormGroup>
                  <Label>Level of education</Label>
                  <Select
                    options={educationLevels}
                    value={educationLevels.find(opt => opt.value === edu.levelofeducationid)}
                    onChange={(option) => updateEducationEntry(edu.id, 'levelOfEducation', {
                      levelOfEducation: option.label,
                      levelofeducationid: option.value
                    })}
                    placeholder="Select"
                    className={errors[`education_${index}_level`] ? 'is-invalid' : ''}
                  />
                  {errors[`education_${index}_level`] && (
                    <div className="text-danger small mt-1">{errors[`education_${index}_level`]}</div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Field of study</Label>
                  <Select
                    options={fieldOfStudyOptions}
                    value={fieldOfStudyOptions.find(opt => opt.value === edu.fieldofstudyid)}
                    onChange={(option) => updateEducationEntry(edu.id, 'fieldOfStudy', {
                      fieldOfStudy: option.label,
                      fieldofstudyid: option.value
                    })}
                    placeholder="Select"
                    className={errors[`education_${index}_field`] ? 'is-invalid' : ''}
                  />
                  {errors[`education_${index}_field`] && (
                    <div className="text-danger small mt-1">{errors[`education_${index}_field`]}</div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>School</Label>
                  <Input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducationEntry(edu.id, 'school', { school: e.target.value })}
                    placeholder="Enter School"
                    invalid={!!errors[`education_${index}_school`]}
                  />
                  {errors[`education_${index}_school`] && (
                    <div className="text-danger small mt-1">{errors[`education_${index}_school`]}</div>
                  )}
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>City, State</Label>
                      <AsyncSelect
                        name="skills"
                        placeholder="Search to select"
                        loadOptions={loadOptionsDeb}
                        cacheOptions
                        isMulti={false}
                        className="location-dropdown"
                        value={!edu.cityid ? [] : { value: edu.cityid, label: edu.citylabel, state: edu.state, stateid: edu.stateid, city: edu.city }}
                        defaultOptions={selectedLocation}
                        onChange={(option) => updateEducationEntry(edu.id, 'city', {
                          citylabel: option.label,
                          city: option.city,
                          cityid: option.value,
                          state: option.statename,
                          stateid: option.stateid
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Country</Label>
                      <Select
                        options={countries}
                        value={countries.find(opt => opt.value === edu.countryid)}
                        onChange={(option) => updateEducationEntry(edu.id, 'country', {
                          country: option.label,
                          countryid: option.value
                        })}
                        placeholder="Select"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
          </CardBody>
        </Card>
      ))}

      {errors.education && <Alert color="danger">{errors.education}</Alert>}

      <Button
        color="success"
        outline
        block
        onClick={addEducationEntry}
        className="add-entry-btn"
      >
        <FiPlus className="mr-2" />
        Add This Entry
      </Button>
    </div>
  );

  // Render Experience Step
  const renderExperienceStep = () => (
    <div className="step-content">
      <div className="step-header">
        <h4>Experience</h4>
        <p className="text-muted">
          Almost done! Please summarize your most recent or<br />
          relevant Professional Experience<br />
          (Role, Company, Key Responsibilities).
        </p>
      </div>

      {formData.experience.map((exp, index) => (
        <Card key={exp.id} className="mb-3 experience-card">
          <CardBody>
            {formData.experience.length > 1 && (
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="entry-summary">
                  {exp.jobTitle && (
                    <div className="font-weight-bold">{exp.jobTitle}</div>
                  )}
                  {(exp.fromMonth || exp.fromYear) && (
                    <div className="text-muted small">
                      {exp.fromMonth} {exp.fromYear} to {exp.currentlyWorking ? 'Present' : `${exp.toMonth} ${exp.toYear}`}
                      {exp.fromMonth && exp.fromYear && exp.toMonth && exp.toYear && !exp.currentlyWorking && (
                        ` (${calculateDuration(exp.fromMonth, exp.fromYear, exp.toMonth, exp.toYear)})`
                      )}
                    </div>
                  )}
                  {exp.jobDescription && (
                    <div className="text-muted small mt-1">
                      {exp.jobDescription.substring(0, 100)}...{' '}
                      <span className="text-primary">More...</span>
                    </div>
                  )}
                </div>
                <Button
                  color="link"
                  className="text-danger p-0"
                  onClick={() => removeExperienceEntry(exp.id)}
                >
                  <FiTrash2 size={18} />
                </Button>
              </div>
            )}
            {formData.experience.length - 1 === index && (
              <>
                <FormGroup>
                  <Label>Job title</Label>
                  <Input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperienceEntry(exp.id, 'jobTitle', e.target.value)}
                    placeholder="Enter job title"
                    invalid={!!errors[`experience_${index}_title`]}
                  />
                  {errors[`experience_${index}_title`] && (
                    <div className="text-danger small mt-1">{errors[`experience_${index}_title`]}</div>
                  )}
                </FormGroup>

                <FormGroup check className="mb-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={exp.currentlyWorking}
                      onChange={(e) => updateExperienceEntry(exp.id, 'currentlyWorking', e.target.checked)}
                    />
                    Currently working
                  </Label>
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>From</Label>
                      <Row>
                        <Col xs={6}>
                          <Select
                            options={months}
                            value={months.find(m => m.label === exp.fromMonth)}
                            onChange={(option) => updateExperienceEntry(exp.id, 'fromMonth', option.label)}
                            placeholder="Select month"
                          />
                        </Col>
                        <Col xs={6}>
                          <Select
                            options={years}
                            value={years.find(y => y.label === exp.fromYear)}
                            onChange={(option) => updateExperienceEntry(exp.id, 'fromYear', option.label)}
                            placeholder="Select year"
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>To</Label>
                      <Row>
                        <Col xs={6}>
                          <Select
                            options={months}
                            value={months.find(m => m.label === exp.toMonth)}
                            onChange={(option) => updateExperienceEntry(exp.id, 'toMonth', option.label)}
                            placeholder="Select month"
                            isDisabled={exp.currentlyWorking}
                          />
                        </Col>
                        <Col xs={6}>
                          <Select
                            options={years}
                            value={years.find(y => y.label === exp.toYear)}
                            onChange={(option) => updateExperienceEntry(exp.id, 'toYear', option.label)}
                            placeholder="Select year"
                            isDisabled={exp.currentlyWorking}
                          />
                        </Col>
                      </Row>
                      {errors[`experience_${index}_to`] && (
                        <div className="text-danger small mt-1">{errors[`experience_${index}_to`]}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label>Job description</Label>
                  <Input
                    type="textarea"
                    rows="4"
                    value={exp.jobDescription}
                    onChange={(e) => updateExperienceEntry(exp.id, 'jobDescription', e.target.value)}
                    placeholder="Enter job description"
                    invalid={!!errors[`experience_${index}_desc`]}
                  />
                  {errors[`experience_${index}_desc`] && (
                    <div className="text-danger small mt-1">{errors[`experience_${index}_desc`]}</div>
                  )}
                </FormGroup>
              </>
            )}

          </CardBody>
        </Card>
      ))}

      {errors.experience && <Alert color="danger">{errors.experience}</Alert>}

      <Button
        color="success"
        outline
        block
        onClick={addExperienceEntry}
        className="add-entry-btn"
      >
        <FiPlus className="mr-2" />
        Add This Entry
      </Button>
    </div>
  );

  // Calculate duration
  const calculateDuration = (fromMonth, fromYear, toMonth, toYear) => {
    const from = new Date(`${fromMonth} 1, ${fromYear}`);
    const to = new Date(`${toMonth} 1, ${toYear}`);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    return `${months} months`;
  };

  // Render Review Step
  const renderReviewStep = () => (
    <div className="step-content review-content">
      <div className="step-header">
        <h4>Review</h4>
        <p className="text-muted">
          Fantastic! You've provided all the required information. Here is a<br />
          summary of your updates.
        </p>
      </div>
      {missingFields.includes('skills') && (<div className="review-section">
        <h6 className="text-primary mb-3">Skills</h6>
        <Card className="mb-3">
          <CardBody>
            <p className="mb-0">{formData.skills}</p>
          </CardBody>
        </Card>
      </div>)}

      {missingFields.includes('education') && (
        <div className="review-section">
          <h6 className="text-primary mb-3">Education ({formData.education.length} Entry)</h6>
          {formData.education.map((edu, index) => (
            <Card key={edu.id} className="mb-3">
              <CardBody>
                <div className="font-weight-bold mb-1">{edu.levelOfEducation}</div>
                <div className="text-muted small">
                  {edu.school}, {edu.city}, {edu.state}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      {missingFields.includes('experience') && (
        <div className="review-section">
          <h6 className="text-primary mb-3">Experience ({formData.experience.length} Entry)</h6>
          {formData.experience.map((exp, index) => (
            <Card key={exp.id} className="mb-3">
              <CardBody>
                <div className="font-weight-bold mb-1">{exp.jobTitle}</div>
                <div className="text-muted small mb-2">
                  {exp.fromMonth} {exp.fromYear} to {exp.currentlyWorking ? 'Present' : `${exp.toMonth} ${exp.toYear}`}
                  {exp.fromMonth && exp.fromYear && exp.toMonth && exp.toYear && !exp.currentlyWorking && (
                    ` (${calculateDuration(exp.fromMonth, exp.fromYear, exp.toMonth, exp.toYear)})`
                  )}
                </div>
                <div className="small">
                  {exp.jobDescription}...{' '}
                  <span className="text-primary">More...</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

      )}




      {errors.submit && <Alert color="danger">{errors.submit}</Alert>}
    </div>
  );

  // Render Complete Step
  const renderCompleteStep = () => (
    <div className="complete-content text-center">
      <div className="success-icon mb-4">
        <FiCheck size={64} color="#28a745" />
      </div>
      <h3 className="mb-3">Profile Complete!</h3>
      <p className="text-muted mb-4">
        Your OpenWorX profile is now at 100% and ready for<br />
        optimal AI-based job matching. Thank you for providing<br />
        your details!
      </p>
      <p className="font-weight-bold mb-4">
        All required fields are updated. You're set!
      </p>
      <Button color="primary" size="lg" onClick={handleClose}>
        Find Your Next Opportunity
      </Button>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    if (isComplete) {
      return renderCompleteStep();
    }

    switch (currentStepData?.key) {
      case 'welcome':
        return renderWelcomeStep();
      case 'skills':
        return renderSkillsStep();
      case 'education':
        return renderEducationStep();
      case 'experience':
        return renderExperienceStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

  const loadOptions = async function (inputValue) {
    if (inputValue.length >= 2) {
      if (inputValue !== "") {
        const { data = [] } = await getLocationFilter(inputValue);
        setCityList(data);

        let location_data = data.map(({ cityid: value, ...rest }) => {
          return {
            value,
            label: `${rest.location + ", " + rest.statename}`,
            city: rest.location,
            statename: rest.statename,
            stateid: rest.stateid
          };
        });
        setSelectedLocation(location_data);
        return location_data;
      }
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      size="lg"
      className="profile-assistant-wizard-modal"
      backdrop={isComplete ? true : "static"}
      keyboard={isComplete}
    >
      <ModalHeader toggle={handleClose} className="wizard-header">
        <div className="d-flex align-items-center">
          {/* <img src="/path-to-openworx-logo.png" alt="OpenWorX" className="header-logo mr-2" /> */}
          <FaRobot size={24} className="header-logo mr-2" style={{ paddingRight: '2px' }} />
          OpenWorX Profile Assistant

        </div>
      </ModalHeader>

      <ModalBody className="wizard-body">
        {renderCurrentStep()}
      </ModalBody>

      {!isComplete && (
        <ModalFooter className="wizard-footer">
          <div className="footer-actions w-100">
            <Button
              color="link"
              onClick={handleSkip}
              className="skip-btn"
            >
              Skip for now
            </Button>
            <div className="action-buttons">
              <Button
                color="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
                outline
              >
                Back
              </Button>
              <Button
                color="primary"
                onClick={handleNext}
              >
                {currentStep === requiredSteps.length - 1 ? 'Confirm & Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
};

ProfileCompletionChatbot.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  missingFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  candidateId: PropTypes.number.isRequired
};

export default ProfileCompletionChatbot;