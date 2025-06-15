export interface Vendor {
    id: number;
    user_id: string;
    name: string;
    address: string;
    phone: string;
    business: string;
    created_at: string; // ISO format or Date type if you're using real dates
    updated_at: string; // ISO format or Date type if you're using real dates
  }
  
  const vendorList: Vendor[] = [
    {
      id: 1,
      user_id: "USR001",
      name: "John Doe",
      address: "123 Main St, Springfield",
      phone: "+1-234-567-890",
      business: "Doe Industries",
      created_at: "2023-01-01T10:00:00Z",
      updated_at: "2023-01-02T12:00:00Z",
    },
    {
      id: 2,
      user_id: "USR002",
      name: "Jane Smith",
      address: "456 Elm St, Shelbyville",
      phone: "+1-345-678-901",
      business: "Smith LLC",
      created_at: "2023-01-03T09:00:00Z",
      updated_at: "2023-01-04T11:30:00Z",
    },
    {
      id: 3,
      user_id: "USR003",
      name: "Alice Johnson",
      address: "789 Oak St, Capital City",
      phone: "+1-456-789-012",
      business: "Johnson Supplies",
      created_at: "2023-01-05T08:00:00Z",
      updated_at: "2023-01-06T14:00:00Z",
    },
    {
      id: 4,
      user_id: "USR001",
      name: "Clark Kevin",
      address: "123 Main St, Springfield",
      phone: "+1-234-567-890",
      business: "Doe Industries",
      created_at: "2023-01-01T10:00:00Z",
      updated_at: "2023-01-02T12:00:00Z",
    },
    {
      id: 5,
      user_id: "USR002",
      name: "Jason Anderson",
      address: "456 Elm St, Shelbyville",
      phone: "+1-345-678-901",
      business: "Smith LLC",
      created_at: "2023-01-03T09:00:00Z",
      updated_at: "2023-01-04T11:30:00Z",
    },
    {
      id: 6,
      user_id: "USR003",
      name: "Fredrick Rodger",
      address: "789 Oak St, Capital City",
      phone: "+1-456-789-012",
      business: "Johnson Supplies",
      created_at: "2023-01-05T08:00:00Z",
      updated_at: "2023-01-06T14:00:00Z",
    },
    // Add other vendors similarly...
  ];
  
  export default vendorList;