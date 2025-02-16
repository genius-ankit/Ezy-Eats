import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const IMAGE_FOLDER = `${FileSystem.documentDirectory}menu-images/`;

export const imageHelper = {
  async saveImage(imageUri: string, canteenId: string, itemId: string) {
    try {
      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(IMAGE_FOLDER, { intermediates: true });

      // Compress and resize image
      const manipResult = await manipulateAsync(
        imageUri,
        [{ resize: { width: 600, height: 600 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // Generate unique filename
      const fileName = `${canteenId}-${itemId}.jpg`;
      const filePath = IMAGE_FOLDER + fileName;

      // Save file
      await FileSystem.moveAsync({
        from: manipResult.uri,
        to: filePath
      });

      return filePath;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  },

  async getImageUri(canteenId: string, itemId: string) {
    const filePath = IMAGE_FOLDER + `${canteenId}-${itemId}.jpg`;
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      return info.exists ? filePath : null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }
}; 