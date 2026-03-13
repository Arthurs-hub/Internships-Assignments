import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import { favouritesReducer } from '../reducers/favouritesReducer';
import SearchBar from './SearchBar';
import PhotoCard from './PhotoCard';
import Loading from './Loading';
import Error from './Error';

const Gallery = () => {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    () => {
      const savedFavourites = localStorage.getItem('favourites');
      return savedFavourites ? JSON.parse(savedFavourites) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter(photo =>
      photo.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [photos, searchTerm]);

  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: photoId });
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Photo Gallery</h1>
      
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredPhotos.map(photo => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isFavourite={favourites.includes(photo.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
