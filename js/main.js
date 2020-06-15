if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js').then(registration => {
      console.log('service worker registered success');
    }).catch( err => {
      console.log('There was an error during the registartion process');
    })
  });
}