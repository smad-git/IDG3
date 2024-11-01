export type AmplifyDependentResourcesAttributes = {
  "api": {
    "idg3Api": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "idg3devlambdaLayer": {
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