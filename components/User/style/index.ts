import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  videoIcon: {
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center', 
    right: 5, 
    top: 5, 
    zIndex: 20, 
    borderRadius: 100, 
  },
  backgroundSmall: {
    width: '100%', 
    height: 120, 
    position: 'relative',
  },
  backgroundMedium: {
    width: '100%', 
    height: 180, 
    position: 'relative',
  },
  backgroundLarge: {
    width: '100%', 
    height: 230, 
    position: 'relative',
  },
  avatarSmall: {
    position: 'absolute', 
    top: -30, 
    left: 20, 
    width: 75, 
    height: 75, 
    borderRadius: 100,
    borderWidth: 3,
  },
  avatarMedium: {
    position: 'absolute', 
    top: -45, 
    left: 20, 
    width: 90, 
    height: 90, 
    borderRadius: 100,
    borderWidth: 3,
  },
  avatarLarge: {
    position: 'absolute', 
    top: -55, 
    left: 20, 
    width: 100, 
    height: 100, 
    borderRadius: 100,
    borderWidth: 3,
  },
  imageContainer: {
    width: 0.33333 * Dimensions.get("window").width, 
    height: 0.33333 * Dimensions.get("window").width * 1.25, 
    padding: 1,
  },
});