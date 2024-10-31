export type AmplifyDependentResourcesAttributes = {
  "api": {
    "igdPortalRestApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "idg3idgPortalLambdaLayer": {
      "Arn": "string"
    },
    "patientMigration": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}