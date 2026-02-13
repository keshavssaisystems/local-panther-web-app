import React from "react";
import "./fairMatchReport.css";
const FairMatchSection = ({ scorejson }) => {
  const data =
    typeof scorejson === "string"
      ? JSON.parse(scorejson)
      : scorejson;

  const toPercent = (val) => Math.round((val / 10) * 100);

  return (
    <section className="mb-0 p-2 p-sm-4 pt-sm-0">
      <div className="border fairmatch-box">

        <h2 className="section-title mb-4 fw-bold">
          OpenWorX FairMatch Report
        </h2>

        <div className="row">

          {/* Overall */}
          <div className="col-12 mb-4">
            <div className="overall-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Overall Role Fit</h4>
              <div className="overall-score">
                {toPercent(data.average_score)}%
              </div>
            </div>
          </div>

          <MatchBlock
            title="Job Title"
            percent={toPercent(data.jobtitlescore)}
            description={data.job_position_description}
          />

          <MatchBlock
            title="Location"
            percent={toPercent(data.locationscore)}
            description={data.location_description}
          />

          <MatchBlock
            title="Skills"
            percent={toPercent(data.skillsscore)}
            description={data.skills_description}
          />

          <MatchBlock
            title="Experience"
            percent={toPercent(data.experiencescore)}
            description={data.experience_description}
          />

          <MatchBlock
            title="Education"
            percent={toPercent(data.educationscore)}
            description={
              data.level_of_education_description +
              " " +
              data.education_field_description
            }
          />

        </div>
      </div>
    </section>
  );
};

const MatchBlock = ({ title, percent, description }) => (
  <div className="col-md-6 mb-4">
    <div className="match-block">

      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="match-title">{title}</span>
        <span className="match-percent">{percent}%</span>
      </div>

      <div className="progress-wrapper mb-2">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="match-description">{description}</p>

    </div>
  </div>
);

export default FairMatchSection;
