const PhotoCard = ({ photo, isFavourite, onToggleFavourite }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={photo.download_url}
        alt={photo.author}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 flex items-center justify-between">
        <p className="text-gray-800 font-medium">{photo.author}</p>
        <button
          onClick={() => onToggleFavourite(photo.id)}
          className="text-2xl focus:outline-none"
        >
          {isFavourite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;
