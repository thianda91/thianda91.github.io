
{%- assign superbase_url = site.pageview.superbase.superbase_url -%}
{%- assign superbase_api_key = site.pageview.superbase.superbase_api_key -%}


{%- if superbase_url and
  superbase_api_key -%}

window.superbaseViewCounter = {
  // Supabase 配置信息
  SUPABASE_URL: '{{ superbase_url }}',
  API_KEY: '{{ superbase_api_key }}',

  // 初始化单个页面计数（对应 func: "view_count"）
  init: function (key, url) {
    const requestUrl = url || this.SUPABASE_URL;
    
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'apikey': this.API_KEY,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ 
        func: 'view_count', 
        key: key 
      })
    })
      .then(response => response.json())
      .then(data => {
        var _selector = `.js-pageview[data-page-key="${key}"]`
        const counterDiv = document.querySelector(_selector);
        if (counterDiv) {
          // 根据返回数据结构可能需要调整
          counterDiv.textContent = data.count || data[key] || 0;
        }
      })
      .catch(error => console.error('Error:', error));
  },

  // 批量查询（对应 func: "view_counts"）
  getMultiCounts: function (keys, url) {
    const requestUrl = url || this.SUPABASE_URL;
    
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'apikey': this.API_KEY,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ 
        func: 'view_counts', 
        keys: keys 
      })
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
  window.supabaseUrl = document.location.origin + '/view_count';
})();


{%- endif -%}