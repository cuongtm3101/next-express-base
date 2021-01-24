var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").classList.remove("hide")
  } else {
    document.getElementById("navbar").classList.add("hide")
  }
  prevScrollpos = currentScrollPos;
}