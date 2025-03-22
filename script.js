const level1Images = ["car.png", "cycle.png", "bike.png"];
let level3Images = ["mobile.jpg", "laptop.jpg", "headphone.jpg"];
const level2Images = [
  "grid1",
  "grid2",
  "grid3",
  "grid4",
  "grid5",
  "grid6",
  "grid7",
  "grid8",
  "grid9",
]; // Different image for grid selection
var Data = JSON.parse(localStorage.getItem("userData")) || [];
let username = "";
let level1 = "";
let level2 = "";
let level3 = [];
let registration = false;
function register() {
  registration = true;
  level1Register();
}
function login() {
  registration = false;
  level1Register();
}
function level1Register() {
  let selectedImage = "";
  let container = document.getElementById("container");
  container.innerHTML = "";
  let label = document.createElement("h3");
  label.innerHTML = "Enter username";
  let usernameField = document.createElement("input");
  usernameField.id = "usernameField";
  let label_2=document.createElement("h3");
  label_2.innerHTML="Select one image and memorise";
  let imgbox = document.createElement("div");
  imgbox.setAttribute("id", "imgbox");
  let button = document.createElement("button");
  button.className = "next";
  level1Images.forEach((img) => {
    let imgElement = document.createElement("img");
    imgElement.src = `images/${img}`;
    imgElement.onclick = () => {
      selectedImage = img;
      // Remove "selected" class from all images
      document.querySelectorAll("#imgbox img").forEach((element) => {
        element.classList.remove("selected");
      });

      // Add "selected" class to the clicked image
      imgElement.classList.add("selected");
    };
    imgbox.appendChild(imgElement);
  });
  button.innerText = "Next";
  button.onclick = () => {
    username = usernameField.value;
    level1 = selectedImage;
    if(validateLevel1())
    level2Register();
  };

  container.append(label, usernameField,label_2, imgbox, button);
}
function validateLevel1(){
    if (!username.trim()) {
        alert("Username cannot be empty!");
        return false;
    }
    if (username.includes(" ")) {
        alert("Username cannot contain spaces!");
        return false;
    }
    if (level1=="") {
        alert("Please select an image!");
        return false;
    }
    return true;

}
function level2Register() {
  let selectedGrid = "";
  let container = document.getElementById("container");
  container.innerHTML = "";
  let label = document.createElement("h3");
  label.innerHTML = "Select a grid";
  let level2imgbox = document.createElement("div");
  level2imgbox.setAttribute("id", "level2imgbox");
  let button = document.createElement("button");
  button.className = "next";
  level2Images.forEach((gridno) => {
    let grid = document.createElement("div");
    grid.onclick = () => {
      selectedGrid = gridno;
      // Remove "selected" class from all div
      document.querySelectorAll("#level2imgbox div").forEach((g) => {
        g.classList.remove("selected-grid");
      });

      // Add "selected" class to the clicked div
      grid.classList.add("selected-grid");
    };
    level2imgbox.appendChild(grid);
  });
  button.innerText = "Next";
  button.onclick = () => {
    level2 = selectedGrid;
    if(validateLevel2())
    level3Register();
  };
  container.append(label, level2imgbox, button);
}
function validateLevel2(){
    if(level2==""){
        alert("Please select a grid");
        return false;
    }
    return true;

}
function level3Register() {
  shuffleArray(level3Images);
  const container = document.getElementById("container");
  container.innerHTML = ""; // Clear previous content

  // Create image container div dynamically
  let label = document.createElement("h3");
  label.innerHTML = "Rearrange and memorise the order";
  const imageContainer = document.createElement("div");
  imageContainer.id = "imageContainer";
  let button = document.createElement("button");
  button.innerText = "Submit";
  button.className = "next";
  container.append(label, imageContainer, button);
  level3Images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = `./images/${src}`;
    img.classList.add("draggable");
    img.setAttribute("draggable", "true");
    img.id = "img" + (index + 1);

    imageContainer.appendChild(img);
  });

  enableDragAndDrop();
  button.onclick = () => {
    level3 = [...document.querySelectorAll(".draggable")].map((img) =>
      img.src.split("/").pop()
    ); // Store final order
    submit();
  };
}

function enableDragAndDrop() {
  const container = document.getElementById("imageContainer");
  let draggedItem = null;

  document.querySelectorAll(".draggable").forEach((img) => {
    img.addEventListener("dragstart", (e) => {
      draggedItem = img;
      img.classList.add("dragging");
    });

    img.addEventListener("dragend", () => {
      draggedItem.classList.remove("dragging");
      draggedItem = null;
      logNewOrder();
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggedItem);
    } else {
      container.insertBefore(draggedItem, afterElement);
    }
  });
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - (box.left + box.width / 2); // Measure horizontal offset
  
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  }
  

function logNewOrder() {
  const newOrder = [...document.querySelectorAll(".draggable")].map((img) => {
    return img.src.split("/").pop(); // Extracts the file name
  });
  // console.log("New Order:", newOrder);
  level3 = newOrder;
}

function submit() {
  event.preventDefault();
  var userObj = {
    username: username,
    level1: level1,
    level2: level2,
    level3: level3,
  };
  if (registration) {
    Data.push(userObj);
    localStorage.setItem("userData", JSON.stringify(Data));
    // sweet alert
    Swal.fire({
      title: "Success!",
      text: registration
        ? "You have completed the Registration."
        : "Logged in Successfully",
      icon: "success",
      timer: 3000, // 5 seconds
      showConfirmButton: false,
    });

    // Redirect to index.html after 5 sec
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } else {
    let registeredUsers = JSON.parse(localStorage.getItem("userData")) || [];

    // Find user with matching credentials
    const user = registeredUsers.find(
      (u) =>
        u.username === username &&
        u.level1 === level1 &&
        u.level2 === level2 &&
        JSON.stringify(u.level3) === JSON.stringify(level3)
    );
    if (user) {
        // ✅ Login Successful
        Swal.fire({
          title: "Login Successful!",
          text: "Redirecting...",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
    
        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = "dashboard.html"; // Change to your desired page
        }, 3000);
      } else {
        // ❌ Invalid Credentials
        Swal.fire({
          title: "Login Failed",
          text: "Invalid username or authentication details!",
          icon: "error",
          timer:3000,
          confirmButtonText: "Try Again",
        });
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = "index.html"; // Change to your desired page
          }, 3000);
      }
  }
  username = "";
  level1 = "";
  level2 = "";
  level3 = [];
}
// Function to shuffle the array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}