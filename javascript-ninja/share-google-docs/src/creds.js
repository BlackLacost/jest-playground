require('dotenv').config()

module.exports = {
  type: 'service_account',
  project_id: 'sharing-docs',
  private_key_id: 'd6d625e4e1ea93082af4aadf12fa7e35f153adb2',
  private_key: process.env.GREDS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: 'google-drive-share@sharing-docs.iam.gserviceaccount.com',
  client_id: '112637458379014561825',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/google-drive-share%40sharing-docs.iam.gserviceaccount.com',
}
