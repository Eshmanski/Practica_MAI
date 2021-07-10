const $sideNav = document.querySelectorAll('.sidenav');
const $textarea = document.querySelector('textarea#description');

M.Sidenav.init($sideNav);
const textareaCounter = new M.CharacterCounter($textarea);
