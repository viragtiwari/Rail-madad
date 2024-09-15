import { useState } from 'react';

function App() {
  const [customers, setCustomers] = useState([
    {
      PNR: '6863189953',
      trainno: '12875',
      category: 'RPF',
      urgency: 'high',
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newStatus, setNewStatus] = useState('');

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

  const filteredCustomers = filter.urgency === 'all' 
    ? customers 
    : customers.filter(customer => customer.urgency === filter.urgency);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <div className="flex items-center">
          <button
            onClick={toggleFilter}
            className="bg-gray-200 px-4 py-2 rounded-md mr-2"
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
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2">Filter</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create
          </button>
        </div>
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
              <th className="py-3 px-6 text-left">PNR No.</th>
              <th className="py-3 px-6 text-left">Train No</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-right">Urgency</th>
              <th className="py-3 px-6 text-right">Status</th>
              <th className="py-3 px-6 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{customer.PNR}</td>
                <td className="py-3 px-6 text-left">{customer.trainno}</td>
                <td className="py-3 px-6 text-left">{customer.category}</td>
                <td className="py-3 px-6 text-right">{customer.urgency}</td>
                <td className="py-3 px-6 text-right">{customer.status}</td>
                <td className="py-3 px-6 text-right">
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
    </div>
  );
}

export default App;
