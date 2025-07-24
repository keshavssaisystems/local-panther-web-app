export const formatAIJobData = async (data) => {
  let aiJD = {};
  aiJD.jobid = 0;
  aiJD.companyid = JSON.parse(localStorage.getItem("userDetails"))?.CompanyId;
  aiJD.companyname = JSON.parse(
    localStorage.getItem("userDetails")
  )?.Companyname;
  aiJD.subsidiaryid = 0;
  aiJD.subsidiaryname = "";
  aiJD.jobtitle = data?.job_title ? data?.job_title : "";
  // aiJD.description = data?.description ? data?.description : "";
  let joDescription = data?.description ? data?.description : "";
  let updatedJD = "<b>" + joDescription;
  updatedJD = updatedJD.replaceAll("Title:", "Title:</b>");
  updatedJD = updatedJD.replaceAll("\n\n", "<BR><BR><b>");
  updatedJD = updatedJD.replaceAll("\n", "</b><BR>");
  aiJD.description = updatedJD;

  aiJD.companydetails = "";
  if (data?.job_location && data?.job_location?.length > 0) {
    aiJD.joblocationid = data?.job_location[0]?.job_location_id
      ? data?.job_location[0]?.job_location_id
      : 0;
    aiJD.joblocation = data?.job_location[0]?.job_location
      ? data?.job_location[0]?.job_location
      : "";
  }

  aiJD.locationaddress = data?.location_address ? data?.location_address : "";
  aiJD.noofopenposition = data?.no_of_open_position
    ? data?.no_of_open_position
    : "";
  aiJD.cityid = data?.city_data?.length > 0 ? data?.city_data[0].cityid : "";
  aiJD.cityname =
    data?.city_data?.length > 0 ? data?.city_data[0].cityname : "";
  aiJD.stateid =
    data?.state_data?.length > 0 ? data?.state_data[0].stateid : "";
  aiJD.statename =
    data?.state_data?.length > 0 ? data?.state_data[0].statename : "";
  aiJD.countryid =
    data?.country_data?.length > 0 ? data?.country_data[0].countryid : 1;
  aiJD.countryname =
    data?.country_data?.length > 0 ? data?.country_data[0].countryname : "USA";
  aiJD.zipcode = data?.zipcode ? data?.zipcode : "";
  aiJD.isdraft = true;
  aiJD.isclosed = false;
  aiJD.isactive = true;
  aiJD.customquestionanswertype = data?.custom_question_answer_type
    ? data?.custom_question_answer_type
    : "";
  aiJD.authorizedtoworkinus = true;
  aiJD.sponsorshiprequiured = data?.sponsorship_required
    ? data?.sponsorship_required
    : false;

  aiJD.issecurityclearancerequired =
    data?.security_clearance_id && data?.security_clearance_id !== 0
      ? true
      : false;
  aiJD.securityclearance = data?.security_clearance
    ? data?.security_clearance
    : "";
  aiJD.securityclearanceid = data?.security_clearance_id
    ? data?.security_clearance_id
    : "";
  aiJD.jobExperienceScheduleDtos = [{ isactive: true, jobid: 0 }];

  //certifications data
  if (data?.certifications && data?.certifications.length > 0) {
    aiJD.certifications = "0";
    // data?.certifications.length > 0
    //   ? data?.certifications.map((x, ind) => ind + 1).join(",")
    //   : "";
    aiJD.jobCertificationDtos =
      data?.certifications && data?.certifications.length > 0
        ? data?.certifications.map((x, ind) => {
          return {
            certificationid: ind + 1,
            certification: x,
          };
        })
        : "";
  }

  if (
    data?.level_of_education_data &&
    data?.level_of_education_data?.length > 0
  ) {
    aiJD.levelofeducationids =
      data?.level_of_education_data?.length > 0
        ? data?.level_of_education_data
          .map((x) => x.levelofeducationid)
          .join(", ")
        : "";

    aiJD.jobLevelofedulcationDtos =
      data?.level_of_education_data?.length > 0
        ? data?.level_of_education_data.map((x) => x)
        : [];
  }

  if (data?.field_of_study_data && data?.field_of_study_data?.length > 0) {
    aiJD.fieldofstudiesids =
      data?.field_of_study_data?.length > 0
        ? data?.field_of_study_data.map((x) => x.fieldofstudyid).join(", ")
        : "";
    aiJD.jobFieldofstudyDtos = data?.field_of_study_data.map((x) => x);
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.experience_level !== undefined
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["experiencelevel"] =
      data.job_Experience_Schedule[0].experience_level;
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.experience_level_id !== undefined
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["experiencelevelid"] =
      data.job_Experience_Schedule[0].experience_level_id;
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.hiring_timeline !== undefined
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["hiringtimeline"] =
      data.job_Experience_Schedule[0].hiring_timeline;
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.hiring_timeline_id !== undefined
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["hiringtimelineid"] =
      data.job_Experience_Schedule[0].hiring_timeline_id;
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.work_schedules &&
    data?.job_Experience_Schedule[0]?.work_schedules?.length > 0
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["workschedules"] =
      data?.job_Experience_Schedule[0]?.work_schedules
        .map((x) => x.work_schedule_id)
        .join(",");
    aiJD.jobExperienceScheduleDtos["0"]["workSchedulesDtos"] =
      data?.job_Experience_Schedule[0]?.work_schedules.map((x) => {
        return {
          workschedulesid: x.work_schedule_id,
          workschedules: x.work_schedule,
        };
      });
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.job_Types &&
    data?.job_Experience_Schedule[0]?.job_Types?.length > 0
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["jobtypes"] =
      data?.job_Experience_Schedule[0]?.job_Types
        //.map((x) => x.jobtypesid)
        .map((x) => x.job_types_id)
        .join(",");
    aiJD.jobExperienceScheduleDtos["0"]["jobTypesDtos"] =
      data?.job_Experience_Schedule[0]?.job_Types.map((x) => {
        return {
          jobtypesid: x.job_types_id,
          jobtypes: x.job_types,
        };
      });
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.shifts &&
    data?.job_Experience_Schedule[0]?.shifts?.length > 0
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["shifts"] =
      data?.job_Experience_Schedule[0]?.shifts.map((x) => x.shift_id).join(",");
    aiJD.jobExperienceScheduleDtos["0"]["shiftsDtos"] =
      data?.job_Experience_Schedule[0]?.shifts.map((x) => {
        return {
          shiftid: x.shift_id,
          shifts: x.shift,
        };
      });
  }

  aiJD.jobPaymentBenefitDtos = [
    {
      isactive: true,
      jobid: 0,
    },
  ];

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.benefits !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["benefits"] =
      data.job_Payment_Benefit.benefits;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.compensation_package !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["compensationpackage"] =
      data.job_Payment_Benefit.compensation_package;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.pay_period_type !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["payperiodtype"] =
      data.job_Payment_Benefit.pay_period_type;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.pay_period_type_id !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["payperiodtypeid"] =
      data.job_Payment_Benefit.pay_period_type_id;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.minimum_amount !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["minimumamount"] =
      data.job_Payment_Benefit.minimum_amount;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.maximum_amount !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["maximumamount"] =
      data.job_Payment_Benefit.maximum_amount;
  }

  if (data?.skills_data && data?.skills_data?.length > 0) {
    let mustHaveSkills = data?.skills_data?.map((x) => {
      return {
        jobid: 0,
        skillid: x.skillid,
        skillname: x.skillname,
        isrequired: true,
        isactive: true,
      };
    });
    aiJD.jobKeyQualificationDtos = mustHaveSkills;
  }

  if (
    data?.nice_to_have_skills_data &&
    data?.nice_to_have_skills_data?.length > 0
  ) {
    let niceToHaveSkills = data?.nice_to_have_skills_data?.map((x) => {
      return {
        jobid: 0,
        skillid: x.skillid,
        skillname: x.skillname,
        isrequired: false,
        isactive: true,
      };
    });
    if (aiJD.jobKeyQualificationDtos === undefined) {
      aiJD.jobCertificationDtos = niceToHaveSkills;
    } else {
      aiJD.jobKeyQualificationDtos.push(...niceToHaveSkills);
    }
  }
  console.log(aiJD);
  return aiJD;
};

export const aiJDNew = {
  jobid: 256,
  companyid: 374,
  companyname: "New company KKORI",
  subsidiaryid: 0,
  subsidiaryname: "",
  jobtitle: "React Engineer new",
  description: "<p>React engineer</p>",
  companydetails: "Pramod Comp",
  joblocationid: 2,
  joblocation: "Hybrid",
  locationaddress: "Pune",
  noofopenposition: 5,
  cityid: 232,
  stateid: 1,
  countryid: 1,
  cityname: "Shelby",
  statename: "Alabama",
  countryname: "USA",
  zipcode: "35143",
  jobstatus: "Publish",
  jobcreatedatetime: "2025-06-21T11:22:28",
  isdraft: false,
  isclosed: false,
  closedjobreasonid: 0,
  closedjobreason: "",
  closeddate: null,
  publisheddate: "2025-06-21T11:22:29",
  isactive: true,
  customquestionanswertype: "Audio",
  totalLikedCandidates: 0,
  totalRecommendedCandidates: 0,
  totalAcceptedCandidates: 0,
  totalRejectedCandidates: 0,
  totalAppliedCandidates: 0,
  totalOfferedCandidates: 0,
  totalMaybeCandidates: 0,
  totalScheduledCandidates: 0,
  jobCompanyDtos: null,
  authorizedtoworkinus: true,
  sponsorshiprequiured: false,
  certifications: "2,6,7",
  levelofeducationids: "2,3,6",
  fieldofstudiesids: "3,4,7",
  issecurityclearancerequired: true,
  securityclearanceid: 1,
  securityclearance: "Secret Clearance",
  jobKeyQualificationDtos: [
    {
      jobkeyqualifications: 911,
      jobid: 0,
      skillid: 33444,
      skillname: "React",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 912,
      jobid: 0,
      skillid: 33427,
      skillname: "react js",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 913,
      jobid: 0,
      skillid: 25368,
      skillname: "React Jsx",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 914,
      jobid: 0,
      skillid: 25369,
      skillname: "React Native",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 915,
      jobid: 0,
      skillid: 25370,
      skillname: "React Native FBSDK",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 916,
      jobid: 0,
      skillid: 30958,
      skillname: "TypeScript",
      isrequired: false,
      isactive: true,
    },
    {
      jobkeyqualifications: 917,
      jobid: 0,
      skillid: 33468,
      skillname: "JavaScript",
      isrequired: false,
      isactive: true,
    },
  ],
  jobExperienceScheduleDtos: [
    {
      jobexperiencescheduleid: 304,
      jobid: 0,
      jobtypes: "1,2,3,4",
      experiencelevelid: 1,
      experiencelevel: "1 year",
      workschedules: "1,2,3",
      shifts: "1,2,3,8   ",
      hiringtimelineid: 1,
      hiringtimeline: "0-5 days",
      isactive: true,
      workSchedulesDtos: [
        {
          workschedulesid: 1,
          workschedules: "Weekdays only",
        },
        {
          workschedulesid: 2,
          workschedules: "Weekends only",
        },
        {
          workschedulesid: 3,
          workschedules: "Weekends if required",
        },
      ],
      jobTypesDtos: [
        {
          jobtypesid: 1,
          jobtypes: "Full-time",
        },
        {
          jobtypesid: 2,
          jobtypes: "Part-time",
        },
        {
          jobtypesid: 3,
          jobtypes: "Contract/Temp",
        },
        {
          jobtypesid: 4,
          jobtypes: "Direct Hire/Perm",
        },
      ],
      shiftsDtos: [
        {
          shiftid: 1,
          shifts: "Day/1st shift",
        },
        {
          shiftid: 2,
          shifts: "Evening/2nd shift",
        },
        {
          shiftid: 3,
          shifts: "Night/3rd shift",
        },
        {
          shiftid: 8,
          shifts: "Regular 8 hour shift",
        },
      ],
    },
  ],
  jobPrescreenApplicationDtos: null,
  jobPaymentBenefitDtos: [
    {
      jobpaymentsbenifitsid: 303,
      jobid: 0,
      payperiodtypeid: 1,
      payperiodtype: "Per hour",
      minimumamount: "55",
      maximumamount: "555",
      compensationpackage: "additional compensation",
      benefits: "additional benefits",
      isactive: true,
    },
  ],
  jobLevelofedulcationDtos: [
    {
      levelofeducationid: 2,
      levelofeducation: "Associate's Degree",
    },
    {
      levelofeducationid: 3,
      levelofeducation: "Bachelor's Degree",
    },
    {
      levelofeducationid: 6,
      levelofeducation: "Doctoral degree",
    },
  ],
  jobFieldofstudyDtos: [
    {
      fieldofstudyid: 3,
      fieldofstudy: "Art",
    },
    {
      fieldofstudyid: 4,
      fieldofstudy: "Business Administration",
    },
    {
      fieldofstudyid: 7,
      fieldofstudy: "Software Engineering",
    },
  ],
  jobCertificationDtos: [
    {
      certificationid: 2,
      certification: "BLS",
    },
    {
      certificationid: 6,
      certification: "Certified Medical assistant",
    },
    {
      certificationid: 7,
      certification: "Certified Scrum master",
    },
  ],
};
