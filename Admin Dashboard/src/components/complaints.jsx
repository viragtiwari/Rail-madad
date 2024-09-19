import { useState } from 'react';

function App() {
  const [customers, setCustomers] = useState([
    {
      PNR: '6863189953',
      trainno: '12875',
      category: 'RPF',
      urgency: 'High',
      status: 'pending',
      description: 'This is a dummy description. The customer\'s seat has been occupied by a person in blue chanting "bheem bheem bheem," which sounded as if he was Travis Scott playing a fiend.',
      media: 'https://images.pexels.com/photos/258347/pexels-photo-258347.jpeg?auto=compress&cs=tinysrgb&w=600', // Example image with a mobile aspect ratio
    },
    // Add more customer data as needed
  ]);

  const [filter, setFilter] = useState({
    urgency: 'all',
  });

  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    PNR: '',
    trainno: '',
    category: '',
    urgency: '',
    status: '',
    description: '',
    media: '',
  });
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter({ urgency: value });
  };

  const handleFilterSubmit = () => {
    // Implement filtering logic here based on urgency
    // ...
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setNewStatus(customer.status); // Set current status for editing
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStatusSubmit = () => {
    if (selectedCustomer) {
      // Update the customer's status in the list
      setCustomers(customers.map(customer =>
        customer.PNR === selectedCustomer.PNR
          ? { ...customer, status: newStatus }
          : customer
      ));
    }
    closeModal();
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleCreateSubmit = () => {
    setCustomers([...customers, newCustomer]);
    setShowCreateModal(false);
    setNewCustomer({
      PNR: '',
      trainno: '',
      category: '',
      urgency: '',
      status: '',
      description: '',
      media: '',
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const activeCustomers = customers.filter(customer => customer.status !== 'resolved');
  const resolvedCustomers = customers.filter(customer => customer.status === 'resolved');

  const filteredCustomers = filter.urgency === 'all' 
    ? activeCustomers 
    : activeCustomers.filter(customer => customer.urgency === filter.urgency);

  const searchedCustomers = filteredCustomers.filter(customer =>
    customer.PNR.includes(searchQuery) ||
    customer.trainno.includes(searchQuery) ||
    customer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 my-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-semibold italic underline my-4">COMPLAINTS</h1>
        <div className="flex items-center">
          <div className="relative mx-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-200 px-4 py-2 rounded-md pr-10"
            />
            <svg
              className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
              />
            </svg>
          </div>
          <button
            onClick={toggleFilter}
            className="bg-gray-200 px-4 py-2 rounded-md mr-2 flex items-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-8.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            <span className="ml-2">Filter</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-t-md ${activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Active Complaints
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 mx-4 py-2 rounded-t-md ${activeTab === 'resolved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Resolved Complaints
        </button>
      </div>

      {showFilter && (
        <div className="bg-white rounded-md shadow-md overflow-hidden mt-4">
          <div className="px-6 py-4 bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            Filter
          </div>

          <div className="p-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Urgency
              </label>
              <select
                name="urgency"
                value={filter.urgency}
                onChange={handleFilterChange}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                <option value="all">All</option>
                <option value="very high">Very High</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <button
              onClick={handleFilterSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-md shadow-md overflow-hidden mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">PNR No.</th>
              <th className="py-3 px-6 text-center ">Train No</th>
              <th className="py-3 px-6 text-center">Category</th>
              <th className="py-3 px-6 text-center">Urgency</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'active' ? searchedCustomers : resolvedCustomers).map((customer, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 hover:bg-gray-100 transition-all ${(customer.urgency === 'High' || customer.urgency === 'Very high') && activeTab === "active" ? 'bg-red-200' : ''}`}
              >
              <td className="py-3 px-6 text-center">{customer.PNR}</td>
                <td className="py-3 px-6 text-center">{customer.trainno}</td>
                <td className="py-3 px-6 text-center">{customer.category}</td>
                <td className="py-3 mx-4  text-center">{customer.urgency}</td>
                <td className="py-3 px-6 text-center">{customer.status}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openModal(customer)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-auto" style={{ width: '30vw', height: '90vh' }}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            <div className="mb-4">
              <p><strong>PNR:</strong> {selectedCustomer.PNR}</p>
              <p><strong>Train No:</strong> {selectedCustomer.trainno}</p>
              <p><strong>Category:</strong> {selectedCustomer.category}</p>
              <p><strong>Urgency:</strong> {selectedCustomer.urgency}</p>
              <p><strong>Status:</strong> {selectedCustomer.status}</p>
            </div>
            <p className="mb-4">{selectedCustomer.description}</p>
            <div className="mb-4">
              <img
                src={selectedCustomer.media}
                alt="Customer Media"
                className="w-[200px] h-auto object-cover"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={handleStatusChange}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <button
              onClick={handleStatusSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-auto" style={{ width: '30vw', height: '90vh' }}>
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Customer</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                PNR
              </label>
              <input
                type="text"
                name="PNR"
                value={newCustomer.PNR}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Train No
              </label>
              <input
                type="text"
                name="trainno"
                value={newCustomer.trainno}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={newCustomer.category}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Urgency
              </label>
              <select
                name="urgency"
                value={newCustomer.urgency}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              >
                <option value="Very High">Very High</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Minimal">Minimal</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                name="status"
                value={newCustomer.status}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              >
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newCustomer.description}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Media URL
              </label>
              <input
                type="text"
                name="media"
                value={newCustomer.media}
                onChange={handleCreateChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <button
              onClick={handleCreateSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;