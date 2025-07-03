// rating-new.ejs
let reviews = document.querySelectorAll(".reviews");
for (let review of reviews) {
  // console.log(review);
  // console.log(review.childNodes[3].innerText);
  if (review.childNodes[3].innerText) {
    let num = parseInt(review.childNodes[3].innerText);
    let end = 0;
    if (num == 1) end = 7;
    if (num == 2) end = 9;
    if (num == 3) end = 11;
    if (num == 4) end = 13;
    if (num == 5) end = 15;
    for (let i = 5; i < end; i += 2) {
      //   console.log(review.childNodes[i]);
      review.childNodes[i].classList.add("checked");
    }
  }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()