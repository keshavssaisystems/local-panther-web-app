export const customers = {
  title: "Customers",
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Customer Listings",
  columns: [
    {
      name: "Name",
      id: "name",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    {
      name: "Company",
      id: "companyname",
      selector: (row) => row.companyname,
      sortable: true,
    },
    {
      name: "City, State",
      id: "cityname",
      selector: (row) =>
        row.cityname === "" && row.statename === ""
          ? "-"
          : row.cityname === "" && row.statename !== ""
          ? row.statename
          : row.cityname !== "" && row.statename === ""
          ? row.cityname
          : row.cityname + ", " + row.statename,
      sortable: true,
    },
    {
      name: "Zipcode",
      selector: (row) => row.zipcode,
      sortable: true,
    },
    {
      name: "Phone",
      id: "phonenumber",
      selector: (row) => row.phonenumber,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row.email,
      sortable: true,
    },
  ],
  searchFilter: [
    {
      name: "Company",
      id: "company",
    },
    {
      name: "Active",
      id: "active",
    },
  ],
  buttonsList: [
    {
      name: "Search",
      id: "search",
    },
    {
      name: "Add",
      id: "add",
    },
  ],
};

export const company = {
  title: "Company",
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Company Listings",
  columns: [
    {
      name: "Company",
      id: "companyname",
      selector: (row) => row.companyname,
      sortable: true,
    },
    {
      name: "City",
      id: "cityname",
      selector: (row) => row.cityname,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.statename,
      sortable: true,
    },
    {
      name: "Zip",
      selector: (row) => row.contactemail,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.contactphonenumber,
      sortable: true,
    },
  ],
  searchFilter: [
    {
      name: "Industry",
      id: "industry",
    },
    {
      name: "City / State",
      id: "cityState",
    },
  ],
  buttonsList: [
    {
      name: "Search",
      id: "search",
    },
    {
      name: "Add",
      id: "add",
      className: "btn-actions-pane-right ",
    },
  ],
};

export const users = {
  title: "Users",
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Users Listings",
  columns: [
    {
      name: "User role",
      id: "rolename",
      selector: (row) => row.rolename,
      sortable: true,
    },
    {
      name: "First name",
      id: "firstName",
      selector: (row) => row.firstname,
      sortable: true,
    },
    {
      name: "Last name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "User name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      id: "email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      id: "phonenumber",
      selector: (row) => row.phonenumber,
      sortable: true,
    },
    {
      name: "Status",
      id: "isactive",
      selector: (row) => row.isactive,
      sortable: true,
    },
  ],
  searchFilter: [
    {
      name: "User role",
      id: "role",
    },
    {
      name: "City",
      id: "city",
    },
  ],
  buttonsList: [
    {
      name: "Search",
      id: "search",
    },
    {
      name: "Add",
      id: "add",
    },
  ],
};

export const roles = {
  title: "Roles",
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Roles Listings",
  columns: [
    {
      name: "Role",
      id: "rolename",
      selector: (row) => row.rolename,
      sortable: true,
    },
    {
      name: "Description",
      id: "description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Status",
      id: "isactive",
      selector: (row) => row.isactive,
      sortable: true,
    },
    {
      name: "# of Users",
      id: "numOfUsers",
      selector: (row) => row.numOfUsers,
      sortable: true,
    },
  ],
  searchFilter: [
    {
      name: "Role",
      id: "role",
    },
    {
      name: "Status",
      id: "isactive",
    },
  ],
  buttonsList: [
    {
      name: "Search",
      id: "search",
    },
    {
      name: "Add",
      id: "add",
      selector: (row) => row.add,
      sortable: false,
      align: "right",
    },
  ],
};

export const menuMapping = {
  title: "Menu Mapping",
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Menu Mapping Listings",
  columns: [
    {
      name: "Role",
      id: "role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Description",
      id: "description",
      selector: (row) => row.description,
      sortable: true,
    },
  ],
  searchFilter: [
    {
      name: "Role",
      id: "role",
    },
    {
      name: "#ofUsers",
      id: "numOfUsers",
    },
  ],
  buttonsList: [
    {
      name: "Search",
      id: "search",
    },
    {
      name: "Add",
      id: "add",
      selector: (row) => row.add,
      sortable: false,
      align: "right",
    },
  ],
};
