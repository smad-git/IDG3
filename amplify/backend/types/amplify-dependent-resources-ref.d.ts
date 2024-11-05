export type AmplifyDependentResourcesAttributes = {
  "api": {
    "idg3api": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "idg3devlambdalayer": {
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