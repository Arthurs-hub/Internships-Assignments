export const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE':
      const photoId = action.payload;
      const isFavourite = state.includes(photoId);
      
      if (isFavourite) {
        return state.filter(id => id !== photoId);
      } else {
        return [...state, photoId];
      }
    
    case 'LOAD_FAVOURITES':
      return action.payload;
    
    default:
      return state;
  }
};
