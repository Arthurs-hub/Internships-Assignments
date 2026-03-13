const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <input
        type="text"
        placeholder="Search by author name..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
