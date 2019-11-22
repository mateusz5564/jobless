const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addEmployee = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {employee: true});
  }).then(() => {
    return {
      message: `Konto pracownika z adresem: ${data.email} zostało utworzone`
    }
  }).catch(err => {
    return err;
  })
})


exports.addEmployer = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { employer: true })
  }).then(() => {
    return {
      message: `Konto pracodawcy z adresem: ${data.email} zostało utworzone`
    }
  }).catch(err => {
    return err
  })
})