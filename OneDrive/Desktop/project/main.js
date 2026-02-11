let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[i].classList.add("active");
  dots[i].classList.add("active");
}

function nextSlide() {
  index++;
  if (index >= slides.length) index = 0;
  showSlide(index);
}

/* Auto slide every 3 seconds */
setInterval(nextSlide, 3000);

/* Click dots */
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
});
 let ison = false
function search() {

 
 if(!ison){
 document.getElementById("inpt").style.display = "block"
ison= true
 }
 else{
ison=false
document.getElementById("inpt").style.display = "none"
 }
}

const btn = document.getElementById("scrollTopBtn");

// show / hide button
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

// scroll to top
btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const srch = document.getElementById("srch")
srch.addEventListener("click", () => {
  window.location.href="search.html"
})
 const products = [
    {
      name: "Black watch",
      description: "This is the product description.",
      price: 350,
      link:"watch.html",

      image: "Images/watch.jpg",
      rating: 4
    },
    {
      name: "Men's jacket",
      description: "This is the product description.",
      price: 350,
      link:"jacket.html",
      image: "Images/jacket.webp",
      rating: 4
    },
    {
      name: "Nike Shoe",
      description: "This is the product description.",
      price: 350,
      link:"shoe.html",
      
      image: "Images/shoe.jpg",
      rating: 4
    },
     {
      name: "Smartphone",
      description: "This is the product description.",
      price: 350,
      link:"mobile.html",
      image: "Images/OIP.webp",
      rating: 4
    },
    { name: "Earbuds",
      description: "This is the product description.",
      price: 350,
      link:"earbud.html",
      image: "Images/earbud.webp",
      rating: 4
    }
    
  ];
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    status.style.color = "red";
    status.innerText = "Please fill all fields!";
    return;
  }

  status.style.color = "green";
  status.innerText = "Message sent successfully ✔️";

  form.reset();
})
let filtr = false 
function toggleFilter() {
  const panel = document.getElementById("filterPanel");
  const icon = document.getElementById("filterIcon");

  panel.classList.toggle("active");
  icon.style.transform = panel.classList.contains("active")
    ? "rotate(90deg)"
    : "rotate(0deg)";
}