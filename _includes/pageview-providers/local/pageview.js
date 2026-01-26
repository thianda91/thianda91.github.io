window.viewCounter = {
  // 单个初始化方法
  init: function (key, url) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: key })
    })
      .then(response => response.json())
      .then(data => {
        var _selector = `.js-pageview[data-page-key="${key}"]`
        const counterDiv = document.querySelector(_selector);
        if (counterDiv) {
          counterDiv.textContent = data.count;
        }
      })
      .catch(error => console.error('Error:', error));
  },

  // 批量查询
  getMultiCounts: function (keys, url) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys: keys })
    })
      .then(response => response.json())
      .then(data => {
        keys.forEach(key => {
          var _selector = `.js-pageview[data-page-key="${key}"]`
          var counterDiv = document.querySelector(_selector);
          if (counterDiv) {
            counterDiv.textContent = data[key] || 0;
          }
        });
      })
      .catch(error => console.error('Error:', error));
  },
  getPathName: function (pathname) {
    if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    return pathname.split('/').slice(-1)[0]
  }
};

(function () {
  window.post_url = document.location.origin + '/view_count';
})();