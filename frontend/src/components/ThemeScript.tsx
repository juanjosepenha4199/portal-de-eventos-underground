export function ThemeScript() {
  const script = `
(function() {
  try {
    var theme = localStorage.getItem('underground-theme');
    if (theme === 'light') document.documentElement.classList.add('light');
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
