export type AmplifyDependentResourcesAttributes = {
  "api": {
    "idgApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "idg3idgLambdaLayer": {
      "Arn": "string"
    },
    "idgPatientMigration": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}