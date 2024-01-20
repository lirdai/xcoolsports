import { StyleSheet } from 'react-native'
import theme from '@xcoolsports/constants/theme'

export default StyleSheet.create({
  pagination: {
    position: 'absolute',
    alignItems: 'center',
  },
  paginationX: {
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationY: {
    right: 10,
    top: 0,
    bottom: 0,
  },
  pointStyle: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  pointActiveStyle: {},
  spaceStyle: {
    marginHorizontal: theme.h_spacing_sm / 2,
    marginVertical: theme.v_spacing_sm / 2,
  },
  wrapperStyle: {
    overflow: 'hidden',
  },
  fullScreenModalStyle: {
    width: '100%',
    height: '100%',
  },
})