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
var merge = require('easy-pdf-merge');
var md5 = require('md5');
const express = require('express');
const app = express();
app.use(express.json({
  type: ['application/json', 'text/plain']
}))
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

  Scholarship.findOne({
    "personalDetails.rollno": req.session.user.name,
    "regStatus": false

  }, (err, student) => {
    if (err) {
      signale.error(err);
      return res.redirect(`/user/${req.session.user.name}/register`);
    }
    else {
      return res.render('register', {
        student: student,
        user: req.session.user
      })
    }
  })

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

  const pythonProcess = spawn('python', ["./checkCredentialsWebmail.py", username, password]);
  pythonProcess.stdout.on('data', (data) => {
    if (data.toString() == 0) {
      signale.note("****Wrong Credentials!****");
      return res.redirect('/user/login')
    }
    else {
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

exports.regUser1 = (req, res) => {
 
  if (!checkEmptyInputPersonal(req)) {
    return res.render(`register`, {
      errors: 'Missing inputs. Please try again.',
      user: req.session.user
    })
  }
  else {
    Scholarship.findOne({
      "personalDetails.rollno": req.session.user.name,
      "regStatus": false
    }, (err, student) => {
      if (err) {
        signale.error(err);
      }
      else {
        if (student != null) {
          student.personalDetails = {
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
          }
          student.save(err => {
            if (err) {
              signale.error(err);

              return res.redirect(`/user/${req.session.user.name}/register`);
            }
            else {
              res.send("ok");
            }

          })
        }
        else {

          let newStudent = new Scholarship(studentDetail(req))
          newStudent.regStatus = false;

          for (var i = 0; i < 5; i++) {
            newStudent.documents.push(null);
          }
          newStudent.save(err => {
            if (err) {
              signale.error(err);

              return res.redirect(`/user/${req.session.user.name}/register`);
            }
            else {
              res.send("ok");
            }


          })
        }
      }
    })
  }






}

exports.regUser2 = (req, res) => {
  Scholarship.findOne({
    "personalDetails.rollno": req.session.user.name,
    "regStatus": false
  }, (err, student) => {
      if (err) {
        signale.error(err);

        return res.redirect(`/user/${req.session.user.name}/register`);

      }
      else {

        student.acads = {
          course_name: sanitize(req.body.course_name),
          course_duration: sanitize(req.body.course_duration),
          fund_required: sanitize(req.body.fund_required),
          tuition_fees: sanitize(req.body.tuition_fees),
          book_fees: req.body.book_fees ? sanitize(req.body.book_fees) : null,
          hostel_fees: req.body.hostel_fees ? sanitize(req.body.hostel_fees) : null,
          other_fees: req.body.other_fees ? sanitize(req.body.other_fees) : null,
          exam_name_1: req.body.exam_name_1,
          exam_year_1: sanitize(req.body.exam_year_1),
          exam_board_1: sanitize(req.body.exam_board_1),
          exam_class_1: "NA",
          exam_percentage_1: sanitize(req.body.exam_percentage_1),
          exam_name_2: sanitize(req.body.exam_name_2),
          exam_year_2: sanitize(req.body.exam_year_2),
          exam_board_2: sanitize(req.body.exam_board_2),
          exam_class_2: "NA",
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
        }


        student.save(err => {
          if (err) {
            signale.error(err);
            return res.redirect(`/user/${req.session.user.name}/register`);
          }
          else {
            res.send("ok");
          }


        })

      }
    })
}

exports.uploadFiles = (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      signale.error(error);
      return res.render(`register`, {
        errors: 'Error uploading documents. Check documents format, size and please try again.',
        user: req.session.user
      })
    }
    else {
      signale.note(req.files);

      Scholarship.findOne({
        "personalDetails.rollno": req.session.user.name,
        "regStatus": false
      }, (err, student) => {
        if (err) {
          console.error(err);
        }
        else {
         
          let file_type = req.params.type;
          let file = req.files[0];
          let len = file.path.length;
          let p = `files/uploads/${file.filename}`;
         
          file.path = p;
        

          if (file_type == "annual") {
            // student.docStatus[0]=true;
            // student.docStatus.set(0,true);
            student.documents.set(0, file);
          }
          if (file_type == "transcript") {
            // student.docStatus[1]=true;
            // student.docStatus.set(1,true);
            student.documents.set(1, file);
          }
          if (file_type == "marksheet12") {
            // student.docStatus[2]=true;
            // student.docStatus.set(2,true);
            student.documents.set(2, file);
          }
          if (file_type == "marksheet10") {
            // student.docStatus[3]=true;
            // student.docStatus.set(3,true);
            student.documents.set(3, file);
          }
          if (file_type == "bankstatement") {
            // student.docStatus[4]=true; <- not a correct way to assign array values in JS
            // student.docStatus.set(4,true);
            student.documents.set(4, file);

          }
          // student.docStatus[0]=1;

          //  student.documents.push(req.files[0]);

          student.save(err => {
            if (err) {
              signale.error(err);
              return res.redirect("/");
            }
            else {
              res.send("ok");
            }
          })
        }
      })
    }
  })

}

exports.registerUser = (req, res) => {
  //check for null/missing inputs

  // check for validation errors
  // if(validationErrors(req)){
  //   return res.render(`/user/${_USERNAME}/register`,{
  //     errors:'Incorrect inputs. Please try again.'
  //   })
  // }



    // let newStudent = new Scholarship(studentDetail(req))
// signale.note(checkInputValidation());
  if(!checkInputValidation(req)) {
    Scholarship.findOne({
      "personalDetails.rollno": req.session.user.name,
      "regStatus": false
    }, (err, student) => {
      if (err) {
        signale.error(err)
        return res.redirect('/')
      }
      else {
      
        student.regStatus = true;
        student.scholarshipStatus = -1,
        student.uniqueID = shortid.generate(),
        student.scholarship = 'No response received';

        student.save(err, () => {
          if (err) {
            signale.error(err);
            return res.redirect(`/user/${req.session.user.name}/register`);
          }
          else {
            // res.send("ok");
            return res.redirect(`/user/${req.session.user.name}/status`)
          }

        })
      }
    })
   }

  
}

exports.renderStatus = (req, res) => {
  Scholarship.findOne({
    "personalDetails.rollno": req.session.user.name,
    "regStatus": true
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
    pdf.create(html, options).toFile(`./public/files/generated-pdfs/roll_no${req.session.user.name}.pdf`, function (err, resp) {
      if (err) {
        return signale.error(err);
      }
      const files = [`./public/files/generated-pdfs/roll_no${req.session.user.name}.pdf` + "public" + student.documents[0].path, 
      path.resolve(config.dir.ADMIN_BASE_DIR,"public",student.documents[1].path),
      path.resolve(config.dir.ADMIN_BASE_DIR,"public",student.documents[2].path), 
      path.resolve(config.dir.ADMIN_BASE_DIR,"public",student.documents[3].path)
    ];
      if (student.documents.length > 4) {
        files.push(path.resolve(config.dir.ADMIN_BASE_DIR,"public",student.documents[4].path));
      }
      target = "./public/files/generated-pdfs/" + md5("delta_cares_" + req.session.user.name + "_security") + ".pdf";

      merge(files, target, function (err) {
        if (err){
          signale.error(err);
        }
        return res.render('status', {
          student: student, path: target
        })
      });
    });
  })
}

function checkEmptyInputPersonal(req) {
  let bool = (
    req.body.firstname != '' &&
    req.body.nationality != '' &&
    req.body.dob != '' &&
    req.body.gender != '' &&
    req.body.father_name != '' &&
    req.body.father_occupation != '' &&
    req.body.mother_name != '' &&
    req.body.annual_income != '' &&
    req.body.address != ''
  )
  return bool;
}

function checkInputValidation(req)
{
  Scholarship.findOne({
    "personalDetails.rollno": req.session.user.name,
    "regStatus": false
  },(err,student)=>{
    if (err) {
      signale.error(err)
      return res.redirect('/')
    }
    else{
      let bool=(
      
        student.personalDetails.rollno&&
        student.personalDetails.firstname&&
        student.personalDetails.lastname &&
        student.personalDetails.nationality&& 
        student.personalDetails.dob &&
        student.personalDetails.gender&&
          
        student.personalDetails.father_name && 
        student.personalDetails.father_occupation &&
        student.personalDetails.mother_name &&
         
        student.personalDetails.annual_income &&
        student.personalDetails.address &&
        
        
        student.acads.course_name&&
        student.acads.course_duration&&
        student.acads.fund_required&&
        student.acads.tuition_fees&&
        student.acads.exam_name_1&&
        student.acads.exam_year_1&&
        student.acads.exam_board_1&&
     
        student.acads.exam_percentage_1&&
        student.acads.exam_name_2&&
        student.acads.exam_year_2&&
        student.acads.exam_board_2&&
        student.acads.exam_percentage_2&&
        student.acads.degree_1&&
        student.acads.degree_year_1&&
 
        student.acads.degree_subject_1&&
        student.acads.degree_institute_1&&
        student.acads.degree_grade_1&&
        student.acads.degree_percentage_1&&
 
        student.acads.qualitative_achievement_1&&
        student.acads.qualitative_achievement_2&&

        student.documents[0]&&
        student.documents[1]&&
        student.documents[2]&&
        student.documents[3]
      );

      return bool;
      // return true;
    }
  })
  // return true;
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
      exam_name_1: req.body.exam_name_1,
      exam_year_1: sanitize(req.body.exam_year_1),
      exam_board_1: sanitize(req.body.exam_board_1),
      exam_class_1: "NA",
      exam_percentage_1: sanitize(req.body.exam_percentage_1),
      exam_name_2: sanitize(req.body.exam_name_2),
      exam_year_2: sanitize(req.body.exam_year_2),
      exam_board_2: sanitize(req.body.exam_board_2),
      exam_class_2: "NA",
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