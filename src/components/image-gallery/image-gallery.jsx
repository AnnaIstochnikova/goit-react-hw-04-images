import { ImageGalleryItem } from 'components/image-gallery-item/image-gallery-item';

export const ImageGallery = ({ data }) => {
  return (
    <ul className="gallery">
      <ImageGalleryItem listOfItems={data} />
    </ul>
  );
};
