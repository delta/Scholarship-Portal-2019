const signale = require('signale')
const path = require('path');
const sanitize = require('mongo-sanitize');
const shortid = require('shortid');
const config = require('../../config/config.js');
const Scholarship = require('../models/Scholarship.js')
const exec = require('child_process').exec;
const pug = require('pug');
const pdf = require('html-pdf');
const spawn = require("child_process").spawn;
const options = {
  format: 'Letter',
  base: 'file://' + path.resolve('./public') + '/'
};
var upload = require('../../config/upload.js');
var html;


exports.renderLoginForm = (req, res) => {
  return res.render('login');
}

exports.renderRegisterForm = (req, res) => {
  return res.render('register');
}

//matching login credentials to create a new session
exports.validateLogin = (req, res) => {
  //checking for missing inputs
  if (!req.body.username || !req.body.password) {
    return res.redirect('/user/login')
  }
  // no missing inputs, go for further validations
  let username = req.body.username
  let password = req.body.password

  const pythonProcess = spawn('python',["./checkCredentialsWebmail.py",username, password]);
  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
    if(data.toString() == 0){
      signale.note("****Wrong Credentials!****");
      return res.redirect('/user/login')
    }
    else{
    signale.note("****Credentials are correct!****");
      req.session.user = {
        name: username
      }
      return res.redirect(`/user/${username}/register`)
    }
  })

  // function checkCredentials(access) {
  //   // wrong credentials
  //   if (access == 0) {
  //     signale.note("****Wrong Credentials!****");
  //     return res.redirect('/user/login')
  //   }
  //   //correct credentials, create session
  //   signale.note("****Credentials are correct!****");
  //   req.session.user = {
  //     name: username
  //   }
  //   return res.redirect(`/user/${username}/register`)
  // }

  // var execlog = exec('./checkCredentialsOcta.sh ' + username + ' ' + password,
  //   (error, stdout, stderr) => {
  //     if (error !== null) {
  //       signale.error(`exec error: ${error}`);
  //     }
  //     checkCredentials(stdout);
  //   });

}

exports.registerUser = (req, res) => {
  //check for null/missing inputs

  // check for validation errors
  // if(validationErrors(req)){
  //   return res.render(`/user/${_USERNAME}/register`,{
  //     errors:'Incorrect inputs. Please try again.'
  //   })
  // }

  upload(req, res, (error) => {
    if (error) {
      signale.error(error);
      return res.redirect(`/user/${req.session.user.name}/register`);
    }
    if (!checkEmptyInput(req)) {
      return res.render(`register`, {
        errors: 'Missing inputs. Please try again.'
      })
    }
    let newStudent = new Scholarship(studentDetail(req))

    newStudent.save(err => {
      if (err) {
        signale.error(err);
        return res.redirect(`/user/${req.session.user.name}/register`);
      }
      return res.redirect(`/user/${req.session.user.name}/status`)
    })
  })
}

exports.renderStatus = (req, res) => {
  Scholarship.findOne({
    "personalDetails.rollno": req.session.user.name
  }, (err, student) => {
    if (err) {
      signale.error(err)
      return res.redirect('/')
    }
    if (student === null || student === undefined) {
      return res.redirect(`/user/${req.session.user.name}/register`)
    }
    // Compile the source code for pdf file
    const compiledFunction = pug.compileFile('./public/template/pdf-template.pug');

    // Render a set of data
    html = compiledFunction({
      student: student
    });
    pdf.create(html, options).toFile(`./public/files/generated-pdfs/${req.session.user.name}.pdf`, function(err, resp) {
      if (err) return signale.error(err);
      signale.note(resp); // { filename: '/app/newfile.pdf' }
      return res.render('status',{
        student:student
      })

    });
  })
}

function checkEmptyInput(req) {
  let bool = (
    req.body.firstname &&
    req.body.nationality &&
    req.body.dob &&
    req.body.gender &&
    req.body.father_name &&
    req.body.father_occupation &&
    req.body.mother_name &&
    req.body.annual_income &&
    req.body.address &&
    req.body.course_name &&
    req.body.course_duration &&
    req.body.fund_required &&
    req.body.tuition_fees &&
    req.body.exam_name_1 &&
    req.body.exam_year_1 &&
    req.body.exam_board_1 &&
    req.body.exam_class_1 &&
    req.body.exam_percentage_1 &&
    req.body.exam_name_2 &&
    req.body.exam_year_2 &&
    req.body.exam_board_2 &&
    req.body.exam_class_2 &&
    req.body.exam_percentage_2 &&
    req.body.degree_1 &&
    req.body.degree_year_1 &&
    req.body.degree_subject_1 &&
    req.body.degree_institute_1 &&
    req.body.degree_grade_1 &&
    req.body.degree_percentage_1 &&
    req.body.qualitative_achievement_1 &&
    req.body.qualitative_achievement_2 &&
    (req.files.length == 4 || req.files.length == 5)
  )
  return bool;
}

function studentDetail(req) {
  return {
    personalDetails: {
      rollno: sanitize(req.session.user.name),
      firstname: sanitize(req.body.firstname),
      lastname: req.body.lastname ? sanitize(req.body.lastname) : null,
      nationality: sanitize(req.body.nationality),
      dob: sanitize(req.body.dob),
      gender: sanitize(req.body.gender),
      disability: req.body.disability ? sanitize(req.body.disability) : null,
      father_name: sanitize(req.body.father_name),
      father_occupation: sanitize(req.body.father_occupation),
      mother_name: sanitize(req.body.mother_name),
      mother_occupation: req.body.mother_occupation ? sanitize(req.body.mother_occupation) : null,
      annual_income: sanitize(req.body.annual_income),
      address: sanitize(req.body.address)
    },
    acads: {
      course_name: sanitize(req.body.course_name),
      course_duration: sanitize(req.body.course_duration),
      fund_required: sanitize(req.body.fund_required),
      tuition_fees: sanitize(req.body.tuition_fees),
      book_fees: req.body.book_fees ? sanitize(req.body.book_fees) : null,
      hostel_fees: req.body.hostel_fees ? sanitize(req.body.hostel_fees) : null,
      other_fees: req.body.other_fees ? sanitize(req.body.other_fees) : null,
      exam_name_1: sanitize(req.body.exam_name_1),
      exam_year_1: sanitize(req.body.exam_year_1),
      exam_board_1: sanitize(req.body.exam_board_1),
      exam_class_1: sanitize(req.body.exam_class_1),
      exam_percentage_1: sanitize(req.body.exam_percentage_1),
      exam_name_2: sanitize(req.body.exam_name_2),
      exam_year_2: sanitize(req.body.exam_year_2),
      exam_board_2: sanitize(req.body.exam_board_2),
      exam_class_2: sanitize(req.body.exam_class_2),
      exam_percentage_2: sanitize(req.body.exam_percentage_2),
      degree_1: sanitize(req.body.degree_1),
      degree_year_1: sanitize(req.body.degree_year_1),
      degree_subject_1: sanitize(req.body.degree_subject_1),
      degree_institute_1: sanitize(req.body.degree_institute_1),
      degree_grade_1: sanitize(req.body.degree_grade_1),
      degree_percentage_1: sanitize(req.body.degree_percentage_1),
      degree_2: req.body.degree_2 ? sanitize(req.body.degree_2) : null,
      degree_year_2: req.body.degree_year_2 ? sanitize(req.body.degree_year_2) : null,
      degree_subject_2: req.body.degree_subject_2 ? sanitize(req.body.degree_subject_2) : null,
      degree_institute_2: req.body.degree_institute_2 ? sanitize(req.body.degree_institute_2) : null,
      degree_grade_2: req.body.degree_grade_2 ? sanitize(req.body.degree_grade_2) : null,
      degree_percentage_2: req.body.degree_percentage_2 ? sanitize(req.body.degree_percentage_2) : null,
      qualitative_achievement_1: sanitize(req.body.qualitative_achievement_1),
      qualitative_achievement_2: sanitize(req.body.qualitative_achievement_2)
    },
    documents: req.files,
    scholarshipStatus: -1,
    uniqueID: shortid.generate(),
    scholarship: 'No response received'
  }
}
