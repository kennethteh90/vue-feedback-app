import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('FeedbackApp', () => App);
AppRegistry.runApplication('FeedbackApp', {
  rootTag: document.getElementById('root'),
});