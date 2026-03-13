const Error = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Error;
