$(document).ready(function () {

  $("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
    if (stepPosition === 'first') {
      $("#prev-btn").addClass('disabled');
    } else if (stepPosition === 'final') {
      $("#next-btn").addClass('disabled');
    } else {
      $("#prev-btn").removeClass('disabled');
      $("#next-btn").removeClass('disabled');
    }
  });
  $("#smartwizard").on("leaveStep", async function (e, anchorObject, stepNumber, stepDirection, stepPosition) {

    let rollno = document.getElementById("Roll Number").value;
    if (stepNumber == 0) {


      if (!checkValidation()) {
        e.preventDefault();
        $('#requiredSubmitModal').modal('show');
      }
      if (checkValidation()) {
        let res = await fetch(`/user/${rollno}/personal`, {
          method: "POST",
          body: JSON.stringify({
            rollno: document.getElementById("Roll Number").value,

            firstname: document.getElementById("First Name").value,
            lastname: document.getElementById("Last Name").value,
            nationality: document.getElementById("Nationality").value,
            dob: document.getElementById("Date of Birth").value,
            gender: document.getElementById("Gender").value,
            disability: document.getElementById("disability").value,
            father_name: document.getElementById("Father's Name").value,
            father_occupation: document.getElementById("Occupation").value,
            mother_name: document.getElementById("Mother's Name").value,
            mother_occupation: document.getElementById("mother_occupation").value,
            annual_income: document.getElementById("annual_income").value,
            address: document.getElementById("address").value
          })
        })
          .then(function (res) {
            // console.log(res);
          })
          .catch(function (err) {
            console.error(err);
          })
      }

    }
    else if (stepNumber == 1) {
      let res = await fetch(`/user/${rollno}/acad`, {
        method: "POST",
        body: JSON.stringify({
          course_name: document.getElementById("course_name").value,
          course_duration: document.getElementById("course_duration").value,
          fund_required: document.getElementById("fund_required").value,
          tuition_fees: document.getElementById("tuition_fees").value,
          book_fees: document.getElementById("book_fees").value,
          hostel_fees: document.getElementById("hostel_fees").value,
          other_fees: document.getElementById("other_fees").value,
          exam_name_1: document.getElementById("exam_name_1").value,
          exam_year_1: document.getElementById("exam_year_1").value,
          exam_board_1: document.getElementById("exam_board_1").value,

          exam_percentage_1: document.getElementById("exam_percentage_1").value,
          exam_name_2: document.getElementById("exam_name_2").value,
          exam_year_2: document.getElementById("exam_year_2").value,
          exam_board_2: document.getElementById("exam_board_2").value,
          exam_percentage_2: document.getElementById("exam_percentage_2").value,
          degree_1: document.getElementById("degree_1").value,
          degree_year_1: document.getElementById("degree_year_1").value,
          degree_subject_1: document.getElementById("degree_subject_1").value,
          degree_institute_1: document.getElementById("degree_institute_1").value,
          degree_grade_1: document.getElementById("degree_grade_1").value,
          degree_percentage_1: document.getElementById("degree_percentage_1").value,
          degree_2: document.getElementById("degree_2").value,
          degree_year_2: document.getElementById("degree_year_2").value,
          degree_subject_2: document.getElementById("degree_subject_2").value,
          degree_institute_2: document.getElementById("degree_institute_2").value,
          degree_grade_2: document.getElementById("degree_grade_2").value,
          degree_percentage_2: document.getElementById("degree_percentage_2").value,
          qualitative_achievement_1: document.getElementById("qualitative_achievement_1").value,
          qualitative_achievement_2: document.getElementById("qualitative_achievement_2").value,
        })
      })
        .then(function (res) {
          // console.log(res);
        })
        .catch(function (err) {
          console.error(err);
        })
    }

  })

  $('#smartwizard').smartWizard({
    selected: 0,
    theme: 'default',
    keyNavigation: false,
    transitionEffect: 'fade',
    showStepURLhash: true,
    toolbarSettings: {
      toolbarButtonPosition: 'end',
    }
  });

  $("#prev-btn").on("click", function () {
    $('#smartwizard').smartWizard("prev");
    return true;
  });

  $("#next-btn").on("click", function () {
    $('#smartwizard').smartWizard("next");
    return true;
  });

  $('#smartwizard').smartWizard("theme", "arrows");

  $(this).scrollTop(0);

});

function checkValidation() {
  var Parr = [
    document.getElementById("Roll Number").value,
    document.getElementById("First Name").value,
    document.getElementById("Nationality").value,
    document.getElementById("Date of Birth").value,
    document.getElementById("Gender").value,
    document.getElementById("Father's Name").value,
    document.getElementById("Occupation").value,
    document.getElementById("Mother's Name").value,
    document.getElementById("annual_income").value,
    document.getElementById("address").value
  ]
  flag2 = 1;
  //  mimeFlag = 1;
  Parr.forEach((val) => {
    if (val == "") {
      flag2 = 0;
    }
  })


  return flag2;

}

async function uploadFiles() {
  let annual = document.getElementById("Annual Income Certificate");
  let upload_annual_btn = document.getElementById("uploadannual");
  let preview_annual_btn = document.getElementById("previewannual");
  let transcript = document.getElementById("Transcript");
  let upload_transcript_btn = document.getElementById("uploadtranscript");
  let preview_transcript_btn = document.getElementById("previewtranscript");
  let marksheet12 = document.getElementById("12th Marksheet");
  let upload_marksheet12_btn = document.getElementById("uploadmarksheet12");
  let preview_marksheet12_btn = document.getElementById("previewmarksheet12");
  let marksheet10 = document.getElementById("10th Marksheet");
  let upload_marksheet10_btn = document.getElementById("uploadmarksheet10");
  let preview_marksheet10_btn = document.getElementById("previewmarksheet10");
  let bankStatement = document.getElementById("Bank Statement");
  let upload_bankstatement_btn = document.getElementById("uploadbankstatement");
  let preview_bankstatement_btn = document.getElementById("previewbankstatement");
  let rollno = document.getElementById("Roll Number").value;

  upload_annual_btn.disabled = true;
  //  preview_annual_btn.disabled=true;
  upload_transcript_btn.disabled = true;
  //  preview_transcript_btn.disabled=true;
  upload_marksheet12_btn.disabled = true;
  //  preview_marksheet12_btn.disabled=true;
  upload_marksheet10_btn.disabled = true;
  //  preview_marksheet10_btn.disabled=true;
  upload_bankstatement_btn.disabled = true;
  //  preview_bankstatement_btn.disabled=true;

  if (preview_annual_btn.value != "") {


    preview_annual_btn.addEventListener('click', function (e) {
      window.open(e.target.value);
    })

  }
  if (preview_transcript_btn.value != "") {
    preview_transcript_btn.addEventListener('click', function (e) {
      window.open(e.target.value);
    })
  }
  if (preview_marksheet12_btn.value != "") {
    preview_marksheet12_btn.addEventListener("click", function (e) {
      window.open(e.target.value);
    })

  }
  if (preview_marksheet10_btn.value != "") {
    preview_marksheet10_btn.addEventListener('click', function (e) {
      window.open(e.target.value);
    })
  }
  if (preview_bankstatement_btn.value != "") {
    preview_bankstatement_btn.addEventListener("click", function (e) {
      window.open(e.target.value);
    })
  }


  annual.addEventListener("input", async function (e) {
    upload_annual_btn.disabled = false;
    preview_annual_btn.disabled = false;

    var file_url = URL.createObjectURL(e.target.files[0]);

    preview_annual_btn.addEventListener('click', function () {
      window.open(file_url);
    })

    upload_annual_btn.addEventListener('click',  function () {
      let formData = new FormData();
      if (String(document.getElementById("Annual Income Certificate").value).split('.')[1] == 'pdf') {
        formData.append("document", annual.files[0]);

        let res =  fetch(`/user/${rollno}/file/annual`, {
          method: "POST",
          body: formData,
        })
          .then(function (res) {
            annual.disabled = true;
            upload_annual_btn.disabled = true;
            preview_annual_btn.textContent = "view";
            upload_annual_btn.textContent = 'File Uploaded';
          })
          .catch(function (err) {
            console.log(err);
          })
      }
      else {
        upload_annual_btn.disabled = true;
        preview_annual_btn.disabled = true;
        annual.value = '';
        $('#mimeSubmitModal').modal('show');
      }
    })
  })
  transcript.addEventListener("input", async function (e) {

    upload_transcript_btn.disabled = false;
    preview_transcript_btn.disabled = false;

    var file_url = URL.createObjectURL(e.target.files[0]);
    preview_transcript_btn.addEventListener('click', function () {
      window.open(file_url);
    })
    upload_transcript_btn.addEventListener('click',  function () {
      if (String(document.getElementById("Transcript").value).split('.')[1] == 'pdf') {
        let formData = new FormData();
        formData.append("document", transcript.files[0]);
        let res =  fetch(`/user/${rollno}/file/transcript`, {
          method: "POST",
          body: formData
        })
          .then(function (res) {
            transcript.disabled = true;
            upload_transcript_btn.disabled = true;
            preview_transcript_btn.textContent = "view";
            upload_transcript_btn.textContent = "File Uploaded";
          })
          .catch(function (err) {
            console.error(err);
          }
          )
      }
      else {
        upload_transcript_btn.disabled = true;
        preview_transcript_btn.disabled = true;
        transcript.value = '';
        $('#mimeSubmitModal').modal('show');
      }

    })
  })
  marksheet12.addEventListener("input", async function (e) {
    upload_marksheet12_btn.disabled = false;
    preview_marksheet12_btn.disabled = false;

    var file_url = URL.createObjectURL(e.target.files[0]);
    preview_marksheet12_btn.addEventListener('click', function () {
      window.open(file_url);
    })

    upload_marksheet12_btn.addEventListener('click',  function () {
      if (String(document.getElementById("12th Marksheet").value).split('.')[1] == 'pdf') {
        let formData = new FormData();
        formData.append("document", marksheet12.files[0]);
        let res =  fetch(`/user/${rollno}/file/marksheet12`, {
          method: "POST",
          body: formData
        })
          .then(function (res) {
            marksheet12.disabled = true;
            upload_marksheet12_btn.disabled = true;
            preview_marksheet12_btn.textContent = "view";
            upload_marksheet12_btn.textContent = "File Uploaded";

          })
          .catch(function (err) {
            console.log(err);
          })
      }
      else {
        upload_marksheet12_btn.disabled = true;
        preview_marksheet12_btn.disabled = true;
        marksheet12.value = '';
        $('#mimeSubmitModal').modal('show');
      }
    })
  })
  marksheet10.addEventListener("input", async function (e) {
    upload_marksheet10_btn.disabled = false;
    preview_marksheet10_btn.disabled = false;

    var file_url = URL.createObjectURL(e.target.files[0]);
    preview_marksheet10_btn.addEventListener('click', function () {
      window.open(file_url);
    })

    upload_marksheet10_btn.addEventListener('click',  function () {
      if (String(document.getElementById("10th Marksheet").value).split('.')[1] == 'pdf') {
        let formData = new FormData();

        formData.append("document", marksheet10.files[0]);
        let res =  fetch(`/user/${rollno}/file/marksheet10`, {
          method: "POST",
          body: formData
        })
          .then(function (res) {
            marksheet10.disabled = true;
            upload_marksheet10_btn.disabled = true;
            preview_marksheet10_btn.textContent = "view";
            upload_marksheet10_btn.textContent = "File Uploaded";
          })
          .catch(function (err) {
            console.log(err);
          })
      }
      else {
        upload_marksheet10_btn.disabled = true;
        preview_marksheet10_btn.disabled = true;
        marksheet10.value = '';
        $('#mimeSubmitModal').modal('show');
      }

    })
  })
  bankStatement.addEventListener("input", async function (e) {
    upload_bankstatement_btn.disabled = false;
    preview_bankstatement_btn.disabled = false;

    var file_url = URL.createObjectURL(e.target.files[0]);
    preview_bankstatement_btn.addEventListener('click', function () {
      window.open(file_url);
    })

    upload_bankstatement_btn.addEventListener('click',  function () {
      if (String(document.getElementById("Bank Statement").value).split('.')[1] == 'pdf') {
        let formData = new FormData();

        formData.append("document", bankStatement.files[0]);
        let res =  fetch(`/user/${rollno}/file/bankstatement`, {
          method: "POST",
          body: formData
        })
          .then(function (res) {
            bankStatement.disabled = true;
            upload_bankstatement_btn.disabled = true;
            preview_bankstatement_btn.textContent = "view";
            upload_bankstatement_btn.textContent = "File Uploaded";
          })
          .catch(function (err) {
            console.log(err);
          })
      }
      else {
        upload_bankstatement_btn.disabled = true;
        preview_bankstatement_btn.disabled = true;
        bankStatement.value = '';
        $('#mimeSubmitModal').modal('show');
      }
    })

  })

}



window.onload = function () {
  uploadFiles();
  var submitbtn = document.getElementById("submitbtn");
  submitbtn.addEventListener('click', (e) => {

    var arr = [
      document.getElementById("Roll Number").value,
      document.getElementById("First Name").value,
      document.getElementById("Nationality").value,
      document.getElementById("Date of Birth").value,
      document.getElementById("Gender").value,
      document.getElementById("Father's Name").value,
      document.getElementById("Occupation").value,
      document.getElementById("Mother's Name").value,
      document.getElementById("annual_income").value,
      document.getElementById("address").value,
      document.getElementById("course_name").value,
      document.getElementById("course_duration").value,
      document.getElementById("fund_required").value,
      document.getElementById("tuition_fees").value,
      document.getElementById("exam_name_1").value,
      document.getElementById("exam_year_1").value,
      document.getElementById("exam_board_1").value,
      document.getElementById("exam_percentage_1").value,
      document.getElementById("exam_name_2").value,
      document.getElementById("exam_year_2").value,
      document.getElementById("exam_board_2").value,
      document.getElementById("exam_percentage_2").value,
      document.getElementById("degree_1").value,
      document.getElementById("degree_year_1").value,
      document.getElementById("degree_subject_1").value,
      document.getElementById("degree_institute_1").value,
      document.getElementById("degree_percentage_1").value,
      document.getElementById("qualitative_achievement_1").value,
      document.getElementById("qualitative_achievement_2").value,
    ]

    let upload_annual_btn = document.getElementById("uploadannual");
    let upload_transcript_btn = document.getElementById("uploadtranscript");
    let upload_marksheet12_btn = document.getElementById("uploadmarksheet12");
    let upload_marksheet10_btn = document.getElementById("uploadmarksheet10");
    let upload_bankstatement_btn = document.getElementById("uploadbankstatement");

    

  

    if(upload_annual_btn.disabled == false) { upload_annual_btn.click(); }
    if(upload_transcript_btn.disabled == false) { upload_transcript_btn.click(); }
    if(upload_marksheet12_btn.disabled == false) { upload_marksheet12_btn.click(); }
    if(upload_marksheet10_btn.disabled == false) { upload_marksheet10_btn.click(); }
    if(upload_bankstatement_btn.disabled == false) { upload_bankstatement_btn.click(); }

    

    flag = 1;
    mimeFlag = 1;
    arr.forEach((val) => {
      if (val == "") {
        flag = 0;
      }
    })
    if (!flag) {
      e.preventDefault();
      $('#requiredSubmitModal').modal('show');
    }

    if (flag) {
      var mime = [
        upload_annual_btn.textContent == "File Uploaded",
        upload_transcript_btn.textContent == "File Uploaded",
        upload_marksheet12_btn.textContent == "File Uploaded",
        upload_marksheet10_btn.textContent == "File Uploaded"
      ];

      // if(document.getElementById("Bank Statement").value){
      //   var bankExt = document.getElementById("Bank Statement").value.split('.').length-1;
      //   mime.push(String(document.getElementById("Bank Statement").value).split('.')[bankExt]);
      // }
      mimeFlag = 1;

      mime.forEach((val) => {
        if (!val) {
          mimeFlag = 0;
        }
      })
      if (!mimeFlag) {
        e.preventDefault();
        $('#requiredSubmitModal').modal('show');
      }
    }
  })

}