// Mock react-native for Jest
module.exports = {
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
  Easing: {
    bezier: (x1, y1, x2, y2) => (t) => t, // Linear fallback
    in: (easing) => easing,
    out: (easing) => easing,
    inOut: (easing) => easing,
  },
  Animated: {
    Value: class {
      constructor(val) { this._value = val; }
      setValue(val) { this._value = val; }
    },
    timing: () => ({ start: () => {}, stop: () => {} }),
    loop: () => ({ start: () => {}, stop: () => {} }),
    sequence: () => ({ start: () => {}, stop: () => {} }),
  },
  StyleSheet: {
    create: (styles) => styles,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
  Image: {},
  View: {},
  Text: {},
  TouchableOpacity: {},
  ScrollView: {},
};
