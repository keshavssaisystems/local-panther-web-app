import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Sticky from "react-stickynode";
import { useDispatch, useSelector } from "react-redux";
import { createjobActions } from "_store";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
  FormGroup,
  Button,
} from "reactstrap";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import DropdownempmodeInput from "./DropdownempmodeInput";
import MultiSelectDropdown from "./DropdownskillInput";
import DropdownremoteInput from "./DropdownremoteInput";
import DropdownstateInput from "./DrodownstateInput";
import DropdowncityInput from "./DrodowncityInput";

import { empmodeActions } from "_store";

import { skillActions } from "_store";
import { stateActions } from "_store";
import { cityActions } from "_store";

const CreateJob = () => {
  // ... your existing code ...
  const dispatch = useDispatch();

  // const dropdownOptions = useSelector((state) => state.empmode.user); // Make sure you are selecting the correct field

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isJobCreated, setIsJobCreated] = useState(false);
  const skillData = useSelector((state) => state.skill.user.data);
  const empModeData = useSelector((state) => state.empmode.user.data);
  const stateData = useSelector((state) => state.state.user.data);
  const cityData = useSelector((state) => state.city.user.data);

  useEffect(() => {
    dispatch(skillActions.getSkill());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empmodeActions.getEmpmode());
  }, [dispatch]);
  useEffect(() => {
    dispatch(stateActions.getState());
  }, [dispatch]);
  useEffect(() => {
    dispatch(cityActions.getCity());
  }, [dispatch]);

  const [createJobData, setcreateJobData] = useState({
    jobid: 0,
    companyid: 1,
    jobtitle: "",
    description: "",
    pitch: "",
    employmentmodeid: 0,
    department: "",
    jobrole: "",
    remotestatus: "",
    noofopenposition: null,
    minexperience: 0,
    maxexperience: 0,
    responsibilities: "",
    isactive: true,
    jobSkillDtos: [],
    jobLocationDtos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "employmentmodeid") {
      setcreateJobData((prevData) => ({
        ...prevData,
        [name]: parseInt(value),
      }));
    } else {
      const newdata = { ...createJobData };
      newdata[name] = value;
      setcreateJobData(newdata);
    }
  };

  // let isSet = [];

  // useEffect(() => {
  //   setcreateJobData({ jobSkillDtos: isSet });
  // }, [isSet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(createjobActions.getCreatejob(createJobData));
    //   const isSkillSelected = createJobData.jobSkillDtos.length > 0;
    //   const isEmploymentModeSelected = createJobData.employmentmodeid !== 0;
    //   const isFormValid = handleValidation() && isSkillSelected && isEmploymentModeSelected;;
    //   if (isFormValid) {
    //     dispatch(createjobActions.getCreatejob(createJobData));
    //   } else { if (!isSkillSelected) {
    //     console.log("Skill is required.");
    //   }
    //   if (!isEmploymentModeSelected) {
    //     console.log("Employment Mode is required.");
    //   }

    //     console.log("Validation Error: Please fix the input errors.");
    //   }
    setIsJobCreated(true);
  };

  const handleSkillChange = (selectedValues) => {
    setSelectedSkills(selectedValues);
  };
  console.log("createJobData", createJobData);
  return (
    <>
      <TransitionGroup>
        <CSSTransition
          component="div"
          classNames="TabsAnimation"
          appear={true}
          timeout={1500}
          enter={false}
          exit={false}
        >
          <div>
            <Card className="main-card mb-3">
              <Sticky
                enabled={true}
                top=".app-header"
                innerZ="15"
                activeClass="sticky-active-class"
              >
                <CardHeader className="card-header-lg">
                  <div className="card-header-title font-size-lg text-capitalize fw-normal">
                    Create Job
                  </div>
                </CardHeader>
              </Sticky>
              <CardBody className="pt-4">
                <Col md="8" className="mx-auto">
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <TextInput
                          label="Job Title"
                          name="jobtitle"
                          value={createJobData.jobtitle}
                          onChange={handleChange}
                          placeholder="Enter job title"
                        />
                        <TextInput
                          onChange={handleChange}
                          value={createJobData.jobrole}
                          label="jobrole"
                          name="jobrole"
                          placeholder="Enter jobrole"
                        ></TextInput>
                        <TextInput
                          label="Job description"
                          name="description"
                          value={createJobData.description}
                          onChange={handleChange}
                          placeholder="Enter job description"
                        />

                        <label>Select Skills:</label>
                        <MultiSelectDropdown
                          options={skillData}
                          selectedOptions={createJobData.selectedSkills}
                          onChange={handleSkillChange}
                        />
                        <label>Select employment mode:</label>
                        <DropdownempmodeInput
                          label="Employment Mode"
                          name="employmentmodeid"
                          selectedEmpMode={createJobData.employmentmodeid}
                          onChange={handleChange}
                          placeholder="Select employment mode"
                          options={empModeData}
                        />

                        <label>Select State:</label>
                        <DropdownstateInput
                          label="State"
                          name="state"
                          selectedState={createJobData.jobLocationDtos}
                          onChange={handleChange}
                          placeholder="Select state"
                          options={stateData}
                        />
                        <label>Select city:</label>
                        <DropdowncityInput
                          label="City"
                          name="city"
                          selectedCity={createJobData.jobLocationDtos}
                          onChange={handleChange}
                          placeholder="Select city"
                          options={cityData}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <NumberInput
                          label="Number of Open Positions"
                          name="noofopenposition"
                          value={createJobData.noofopenposition}
                          onChange={handleChange}
                          placeholder="Number of open positions"
                        />
                        <TextInput
                          onChange={handleChange}
                          value={createJobData.responsibilities}
                          label="responsibilities"
                          name="responsibilities"
                          placeholder="Enter responsibilities"
                        ></TextInput>
                        <DropdownremoteInput
                          handleChange={handleChange}
                          value={createJobData.remotestatus}
                          label="remotestatus"
                          name="remotestatus"
                          placeholder="Enter remote status"
                        />
                        <TextInput
                          onChange={handleChange}
                          value={createJobData.pitch}
                          label="pitch"
                          name="pitch"
                          placeholder="Pitch"
                        />
                        {/* ... other input components ... */}
                        Minimum Exp
                        <NumberInput
                          label="Minimum experince"
                          name="minexperience"
                          value={createJobData.minexperience}
                          onChange={handleChange}
                          placeholder="Enter minimum experience"
                        />
                        <label>Maximum experince</label>
                        <NumberInput
                          label="Maximum experince"
                          name="maxexperience"
                          value={createJobData.maxexperience}
                          onChange={handleChange}
                          placeholder="Enter maximum experience"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </CardBody>
              <CardFooter className="d-block text-center">
                <Button
                  size="sm"
                  className="m-1 p-2"
                  color="success"
                  onClick={(evt) => handleSubmit(evt)}
                >
                  Submit
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CSSTransition>
      </TransitionGroup>
      {isJobCreated && (
        <div className="alert alert-success">Job created successfully!</div>
      )}
    </>
  );
};

export default CreateJob;
