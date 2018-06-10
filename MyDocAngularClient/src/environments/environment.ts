export const environment = {
  production: false,

  region: 'eu-central-1',
  clinicsDoctorsPool:{
    identityPoolId: 'us-east-1:fbe0340f-9ffc-4449-a935-bb6a6661fd53',
    UserPoolId: "eu-central-1_9xDnzevn7",
    ClientId: "54ktu9uu99hocaq4daa41kbaur",
  },
  utilsServiceEndpoint: "https://wz7mf6t6s2.execute-api.eu-central-1.amazonaws.com/dev/utils",
  clinicsServiceEndpoint: "https://oogo5xxxm6.execute-api.eu-central-1.amazonaws.com/dev/clinics",
  doctorsServiceEndpoint: "https://8yz2std66h.execute-api.eu-central-1.amazonaws.com/dev/clinics",
  pacientsServiceEndpoint: "https://7zk631wsnf.execute-api.eu-central-1.amazonaws.com/dev/pacients",
  ddbTableName: 'LoginTrail',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: '',
  s3_endpoint: ''

};

