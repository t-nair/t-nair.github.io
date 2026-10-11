/* Theme: stored choice, else the system preference. Sets data-theme on <html>
   before paint; the toggle is injected so pages need only this one script. */
(function () {
  var r = document.documentElement, k = 'theme', t;
  try { t = localStorage.getItem(k); } catch (e) {}
  if (t !== 'dark' && t !== 'light') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  r.dataset.theme = t;
  var s = document.createElement('style');
  s.textContent = '.theme-toggle{position:fixed;right:16px;bottom:16px;z-index:300;background:none;border:0;padding:8px;font:inherit;font-size:13px;color:inherit;opacity:.7;cursor:pointer}.theme-toggle:hover,.theme-toggle:focus-visible{opacity:1}';
  document.head.appendChild(s);
  addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'theme-toggle';
    function sync() {
      var d = r.dataset.theme === 'dark';
      b.textContent = d ? '[light]' : '[dark]';
      b.setAttribute('aria-label', 'Switch to ' + (d ? 'light' : 'dark') + ' mode');
    }
    b.onclick = function () {
      r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(k, r.dataset.theme); } catch (e) {}
      sync();
    };
    sync();
    document.body.appendChild(b);
  });
})();
