import React, { useState } from "react";
import { Form, Input, Button, Badge } from "reactstrap";
import "./skillAIProfile.scss"

export default function SkillAIProfile({ skillData, setSkillData }) {
    const [skills, setSkills] = useState(skillData);

    const handleRemoveSkill = (skill) => {
        let updatedSkills = skills.filter((s) => s.skillname !== skill);
        setSkills(updatedSkills);
        setSkillData(updatedSkills);
    };

    return (
        <div>
            <div>
                <h5>Skills</h5>
                <Form>
                    <div className="skills-container">
                        <span className="skills-badge">Update</span>
                        <div className="skills-list">
                            {skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className={`skill-chip ${skill?.operation === "delete" ? "invalid" : ""}`}
                                >
                                    {skill?.skillname}
                                    <span
                                        className="skill-remove"
                                        onClick={() => handleRemoveSkill(skill?.skillname)}
                                        aria-label={`Remove ${skill?.skillname}`}
                                        role="button"
                                    >
                                        ×
                                    </span>
                                </span>
                            ))}
                        </div>

                    </div>
                </Form>
            </div>
        </div>
    );


}