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
  aiJD.description = data?.description ? data?.description : "";
  aiJD.companydetails = "";
  aiJD.joblocationid = data?.job_location_id ? data?.job_location_id : 0;
  aiJD.joblocation = data?.job_location ? data?.job_location : "";
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
  aiJD.certifications =
    data?.certifications && data?.certifications.length > 0
      ? data?.certifications
      : "";
  aiJD.levelofeducationids =
    data?.level_of_education_data?.length > 0
      ? data?.level_of_education_data
          .map((x) => x.levelofeducationid)
          .join(", ")
      : "";
  aiJD.fieldofstudiesids =
    data?.field_of_study_data?.length > 0
      ? data?.field_of_study_data.map((x) => x.fieldofstudyid).join(", ")
      : "";
  aiJD.issecurityclearancerequired = true;
  aiJD.securityclearance = data?.security_clearance
    ? data?.security_clearance
    : "";
  aiJD.securityclearanceid = data?.security_clearance_id
    ? data?.security_clearance_id
    : "";
  aiJD.jobExperienceScheduleDtos = [{ isactive: true, jobid: 0 }];

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
      data?.job_Experience_Schedule[0]?.work_schedules[0].work_schedule_id.toString();
    aiJD.jobExperienceScheduleDtos["0"]["workSchedulesDtos"] = [
      {
        workschedulesid:
          data?.job_Experience_Schedule[0]?.work_schedules[0].work_schedule_id,
        workschedules:
          data?.job_Experience_Schedule[0]?.work_schedules[0].work_schedule,
      },
    ];
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.job_Types &&
    data?.job_Experience_Schedule[0]?.job_Types?.length > 0
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["jobtypes"] =
      data?.job_Experience_Schedule[0]?.job_Types[0].job_types_id.toString();
    aiJD.jobExperienceScheduleDtos["0"]["jobTypesDtos"] = [
      {
        jobtypesid: data?.job_Experience_Schedule[0]?.job_Types[0].job_types_id,
        jobtypes: data?.job_Experience_Schedule[0]?.job_Types[0].job_types,
      },
    ];
  }

  if (
    data?.job_Experience_Schedule &&
    data?.job_Experience_Schedule?.length > 0 &&
    data?.job_Experience_Schedule[0]?.shifts &&
    data?.job_Experience_Schedule[0]?.shifts?.length > 0
  ) {
    aiJD.jobExperienceScheduleDtos["0"]["shifts"] =
      data?.job_Experience_Schedule[0]?.shifts[0].shift_id.toString();
    aiJD.jobExperienceScheduleDtos["0"]["shiftsDtos"] = [
      {
        shiftid: data?.job_Experience_Schedule[0]?.shifts[0].shift_id,
        shifts: data?.job_Experience_Schedule[0]?.shifts[0].shift,
      },
    ];
  }

  aiJD.jobPaymentBenefitDtos = [
    {
      isactive: true,
      jobid: 0,
    },
  ];

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.benefits !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["benefits"] =
      data.job_Payment_Benefit[0].benefits;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.compensation_package !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["compensationpackage"] =
      data.job_Payment_Benefit[0].compensation_package;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.pay_period_type !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["payperiodtype"] =
      data.job_Payment_Benefit[0].pay_period_type;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.pay_period_type_id !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["payperiodtypeid"] =
      data.job_Payment_Benefit[0].pay_period_type_id;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.minimum_amount !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["minimumamount"] =
      data.job_Payment_Benefit[0].minimum_amount;
  }

  if (
    data?.job_Payment_Benefit &&
    data?.job_Payment_Benefit?.length > 0 &&
    data?.job_Payment_Benefit[0]?.maximum_amount !== undefined
  ) {
    aiJD.jobPaymentBenefitDtos["0"]["maximumamount"] =
      data.job_Payment_Benefit[0].maximum_amount;
  }

  return aiJD;
};

export const aiJD = {
  //   jobid: 250, // excluded field
  companyid: 374,
  companyname: "New company KKORI",
  subsidiaryid: 0,
  subsidiaryname: "",
  jobtitle: "Web Development React",
  description: "<p>test</p>",
  companydetails: "",
  joblocationid: 1,
  joblocation: "Remote",
  locationaddress: "",
  noofopenposition: 2,
  cityid: 29175,
  stateid: 49,
  countryid: 1,
  cityname: "Shelton",
  statename: "Washington",
  countryname: "USA",
  zipcode: "06484",
  //   jobstatus: "Draft", //
  //   jobcreatedatetime: "2025-06-11T12:48:55", //
  isdraft: true,
  isclosed: false,
  //   closedjobreasonid: 0, //
  //   closedjobreason: "", //
  //   closeddate: null, //
  //   publisheddate: "2025-06-11T12:50:07", //
  isactive: true,
  customquestionanswertype: "Audio",
  //   totalLikedCandidates: 0, //
  //   totalRecommendedCandidates: 0, //
  //   totalAcceptedCandidates: 0, //
  //   totalRejectedCandidates: 0, //
  //   totalAppliedCandidates: 0, //
  //   totalOfferedCandidates: 0, //
  //   totalMaybeCandidates: 0, //
  //   totalScheduledCandidates: 0, //
  //   jobCompanyDtos: null, //
  authorizedtoworkinus: true,
  sponsorshiprequiured: false,
  certifications: "",
  levelofeducationids: "",
  fieldofstudiesids: "",
  issecurityclearancerequired: false,
  securityclearanceid: 0,
  securityclearance: "",
  jobKeyQualificationDtos: [
    //
    {
      jobkeyqualifications: 894,
      jobid: 0,
      skillid: 30061,
      skillname: "Test Automation",
      isrequired: true,
      isactive: true,
    },
    {
      jobkeyqualifications: 895,
      jobid: 0,
      skillid: 30060,
      skillname: "Test And Learn",
      isrequired: false,
      isactive: true,
    },
  ],
  jobExperienceScheduleDtos: [
    {
      jobexperiencescheduleid: 298, //
      jobid: 0,
      jobtypes: "1",
      experiencelevelid: 1,
      experiencelevel: "1 year",
      workschedules: "1",
      shifts: "1         ",
      hiringtimelineid: 1,
      hiringtimeline: "0-5 days",
      isactive: true,
      workSchedulesDtos: [
        {
          workschedulesid: 1,
          workschedules: "Weekdays only",
        },
      ],
      jobTypesDtos: [
        {
          jobtypesid: 1,
          jobtypes: "Full-time",
        },
      ],
      shiftsDtos: [
        {
          shiftid: 1,
          shifts: "Day/1st shift",
        },
      ],
    },
  ],
  jobPrescreenApplicationDtos: null,
  jobPaymentBenefitDtos: [
    {
      jobpaymentsbenifitsid: 297, //
      jobid: 0,
      payperiodtypeid: 1,
      payperiodtype: "Per hour",
      minimumamount: "3",
      maximumamount: "33",
      compensationpackage: "",
      benefits: "",
      isactive: true,
    },
  ],
  jobLevelofedulcationDtos: null,
  jobFieldofstudyDtos: null,
  jobCertificationDtos: null,
};
