export const rolesResponse ={
  "statusCode": 200,
  "data": {
    "userRoleList": [
      {
        "userroleid": 1,
        "rolename": "Admin",
        "description": "Admin",
        "isactive": true,
        "currentUserId": 0
      },
      {
        "userroleid": 3,
        "rolename": "Candidate",
        "description": "Candidate",
        "isactive": true,
        "currentUserId": 0
      },
      {
        "userroleid": 2,
        "rolename": "Customer",
        "description": "Customer",
        "isactive": true,
        "currentUserId": 0
      }
    ],
    "totalRows": 3
  },
  "status": "Success",
  "message": "User role get API requested"
}