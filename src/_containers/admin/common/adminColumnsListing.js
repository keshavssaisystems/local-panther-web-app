export const customers = {
  title : 'Customers',
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Customer Listings",
  columns : [
  {
    name: "Name",
    id: "name",
    selector: row => row.name,
    sortable: true,
  },
  {
    name: "Company",
    id: "company",
    selector: row => row.company,
    sortable: true,
  },
  {
    name: "Address",
    selector: row => row.address,
    sortable: true,
  },
  {
    name: "City",
    selector: row => row.city,
    sortable: true,
  },
  {
    name: "State",
    selector: row => row.state,
    sortable: true,
  },
  {
    name: "Phone",
    selector: row => row.phone,
    sortable: true,
  },
  {
    name: "Email",
    selector: row => row.email,
    sortable: true,
  },
  {
    name: "Status",
    selector: row => row.statuses,
    sortable: true,
  },
  {
    name: "Registration",
    selector: row => row.date,
    sortable: true,
  }
],
searchFilter: [
      {
        name: "Company",
        id: "company",
      },
      {
        name: "isActive",
        id: "isActive",
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
    ]
}

export const company = {
  title: 'Company',
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Company Listings",
  columns : [
  {
    name: "Company",
      id: "companyname",
    selector: row => row.companyname,
    sortable: true,
  },
  {
    name: "City",
    id: "cityname",
    selector: row => row.cityname,
    sortable: true,
  },
  {
    name: "State",
    selector: row => row.statename,
    sortable: true,
  },
  {
    name: "Zip",
    selector: row => row.contactemail,
    sortable: true,
  },
  {
    name: "Industry",
    selector: row => row.contactphonenumber,
    sortable: true,
  },
],
searchFilter: [
  {
        name: "Industry",
        id: "industry"
  },
  {
    name: "City / State",
    id: "cityState"
  },

    ],
buttonsList: [
      {
        name: "Search",
        id: "search"
      },
      {
        name: "Add",
        id: "add",
        className: "btn-actions-pane-right "
      },
    ]
}


export const users = {
  title: 'Users',
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Users Listings",
  columns : [
  {
    name: "User role",
    id: "role",
    selector: row => row.role,
    sortable: true,
  },
  {
    name: "First name",
    id: "firstName",
    selector: row => row.firstName,
    sortable: true,
  },
  {
    name: "Last name",
    selector: row => row.lastName,
    sortable: true,
  },
  {
    name: "Address",
    selector: row => row.address,
    sortable: true,
  },
  {
    name: "City",
    selector: row => row.city,
    sortable: true,
  },
  {
    name: "State",
    selector: row => row.state,
    sortable: true,
  },
  {
    name: "Zip code",
    selector: row => row.zipCode,
    sortable: true,
  },
  {
    name: "Email",
    selector: row => row.email,
    sortable: true,
  },
  {
    name: "Mobile",
    selector: row => row.mobile,
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
    ]
  };

export const roles = {
  title: 'Roles',
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Roles Listings",
  columns : [
  {
    name: "Role",
    id: "role",
    selector: row => row.role,
    sortable: true,
  },
  {
    name: "Description",
    id: "description",
    selector: row => row.description,
    sortable: true,
  },
  {
    name: "# of Users",
    selector: row => row.numOfUsers,
    sortable: true,
  }
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
        selector: row => row.add,
        sortable: false,
        align : "right"
      },
    ]
  };

export const menuMapping = {
  title: 'Menu Mapping',
  icon: "assets/utils/images/candidate.svg",
  listingTitle: "Menu Mapping Listings",
  columns : [
  {
    name: "Role",
    id: "role",
    selector: row => row.role,
    sortable: true,
  },
  {
    name: "Description",
    id: "description",
    selector: row => row.description,
    sortable: true,
  }
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
        selector: row => row.add,
        sortable: false,
        align: "right"
      },
    ]
  };
