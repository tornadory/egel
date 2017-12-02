// Stylesheet
import styles from '../styles/index.scss';

// Application
import Application from './app/Application';

// Initialize
window.app = new Application();

// Service worker
if (process.env.NODE_ENV === 'production') {
	window.addEventListener('load', () => {
		if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js');
		}
	});
}
