/* eslint-disable no-console */
import { onMessage } from 'webext-bridge';
import App from './views/App.svelte';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value.
(() => {
  // TODO: figure out a better way to do this?? maybe??
  const oldContainer = document.getElementById('content-script-container');
  if (oldContainer) {
    document.body.removeChild(oldContainer);
  }
  console.info('[vitesse-webext] Hello world from content script');

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`);
  });

  // mount component to context window
  const container = document.createElement('div');
  container.setAttribute('id', 'content-script-container');
  const root = document.createElement('div');
  const styleEl = document.createElement('link');
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) ||
    container;
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('contentScripts/style.css'),
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);
  new App({ target: root });
})();
