const userFormDOM = document.querySelector("#userForm");
const listDOM = document.querySelector("#list");
const toastDOM = document.querySelector("#liveToast");
const toastTitle = document.querySelector("#toastTitle");
const toastMessage = document.querySelector("#toastMessage");

// Bildirim fonksiyonu
const showToast = (type, title, message) => {
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toastDOM.classList.remove("bg-success", "bg-warning", "bg-danger");
  toastDOM.classList.add(`bg-${type}`);
  $(toastDOM).toast("show");
};

// Form gönderim işlemi
userFormDOM.addEventListener("submit", (event) => {
  event.preventDefault();
  const TASK = document.querySelector("#task");
  const taskValue = TASK.value.trim();
  const maxTaskLength = 150;

  if (taskValue === "") {
    showToast("warning", "Uyarı!", "Liste ögesi boş olamaz.");
  } else if (taskValue.length > maxTaskLength) {
    showToast("danger", "Hata!", "Öge çok uzun.");
  } else {
    addNewTask(taskValue); // Görev ekle
    saveToLocalStorage(taskValue); // Yerel depolama işlemi
    TASK.value = ""; // Inputu temizle
    showToast("success", "Başarılı!", "Öge eklendi.");
  }
});

// Yeni görev eklemek için fonksiyon
function addNewTask(task, id = Date.now()) {
  const liDOM = document.createElement("li");
  liDOM.className =
    "list-group-item d-flex justify-content-between align-items-center";
  liDOM.innerHTML = `
        <p class="text-dark mt-3 inText">${task}</p>
        <button class="btn-close border-1" aria-label="Close">&times;</button>
    `;
  liDOM.setAttribute("data-id", id);
  listDOM.append(liDOM);

  // Silme ve yapıldı işaretleme işlemlerini ayırıyoruz
  attachDeleteHandler(liDOM, id);
  attachToggleHandler(liDOM, id);
}

// Görevi silmek için fonksiyon
function attachDeleteHandler(liDOM, id) {
  liDOM.querySelector(".btn-close").addEventListener("click", () => {
    liDOM.remove();
    removeFromLocalStorage(id); // Yerel depolamadan sil
    showToast("info", "Başarılı!", "Öge silindi."); // Silme bildirim
  });
}

// Görevi yapıldı olarak işaretlemek için fonksiyon
function attachToggleHandler(liDOM, id) {
  liDOM.addEventListener("click", () => {
    liDOM.classList.toggle("bg-info");
    const inText = liDOM.querySelector(".inText");
    inText.style.textDecoration = inText.style.textDecoration
      ? ""
      : "line-through";
    toggleTaskStatus(id); // Görev durumunu değiştir
  });
}

// Yerel depolama işlemleri
function saveToLocalStorage(task) {
  const jobs = JSON.parse(localStorage.getItem("list")) || [];
  jobs.push({ id: Date.now(), task, isDone: false });
  localStorage.setItem("list", JSON.stringify(jobs));
  loadItemsFromLocalStorage();
}

function loadItemsFromLocalStorage() {
  listDOM.innerHTML = "";
  const jobs = JSON.parse(localStorage.getItem("list")) || [];
  jobs.forEach((job) => addNewTask(job.task, job.id));
}

function removeFromLocalStorage(id) {
  const jobs = JSON.parse(localStorage.getItem("list")) || [];
  const updatedJobs = jobs.filter((job) => job.id !== id);
  localStorage.setItem("list", JSON.stringify(updatedJobs));
  loadItemsFromLocalStorage();
}

function toggleTaskStatus(id) {
  const jobs = JSON.parse(localStorage.getItem("list")) || [];
  const jobIndex = jobs.findIndex((job) => job.id === id);
  if (jobIndex !== -1) {
    jobs[jobIndex].isDone = !jobs[jobIndex].isDone;
    localStorage.setItem("list", JSON.stringify(jobs));
  }
}

// Sayfa yüklendiğinde görevleri yükle
window.addEventListener("DOMContentLoaded", loadItemsFromLocalStorage);
