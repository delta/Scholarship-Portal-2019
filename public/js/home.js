var submitBtn = document.querySelector('.redirect')

submitBtn.addEventListener('click', (e) => {
  window.location.href = "http://localhost:3000/user/login";
})