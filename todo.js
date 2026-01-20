import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "./firebase.js";

document.querySelector("#logout").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Signed Out",
        timer: 1200,
        showConfirmButton: false,
      });
      window.location.href = "index.html";
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
    });
});

const addBtn = document.querySelector("#submitBtn");
const updateBtn = document.querySelector("#update_data");
const taskGrid = document.querySelector("#taskGrid");

let currentEditId = null;
let unsubscribe = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    listenTodos(user);
  } else {
    window.location.href = "index.html";
  }
});

addBtn.addEventListener("click", async () => {
  const title = document.querySelector("#taskTitle").value.trim();
  const category = document.querySelector("#taskCategory").value;
  const desc = document.querySelector("#taskDesc").value.trim();

  if (!title || !desc) return;

  try {
    await addDoc(collection(db, "users"), {
      title,
      category,
      desc,
      uid: auth.currentUser.uid,
      createdAt: Date.now(),
      completed: false,
    });

    resetForm();
  } catch (err) {
    console.error(err);
  }
});

function listenTodos(user) {
  if (unsubscribe) unsubscribe();

  const q = query(collection(db, "users"), where("uid", "==", user.uid));

  unsubscribe = onSnapshot(q, (snapshot) => {
    let html = "";
    document.querySelector("#statusCount").innerText = `${snapshot.size} Total`;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const isCompleted = data.completed || false;

      html += `
      <div class="col-xl-6 col-12 mb-4">
        <div class="task-card ${isCompleted ? "completed" : ""}">
          <div class="d-flex justify-content-between">
             <span class="tag ${getTagClass(data.category)}">${data.category}</span>
             <button class="btn-tick ${isCompleted ? "active" : ""}" onclick="toggleComplete('${docSnap.id}', ${isCompleted})">
                <i class="fas ${isCompleted ? "fa-check-double" : "fa-check"}"></i>
             </button>
          </div>

          <h5 class="fw-bold mt-2">${data.title}</h5>
          <p class="desc-text text-muted">${data.desc}</p>

          <div class="mt-3 d-flex gap-2">
            <button class="btn-edit" onclick="editData('${docSnap.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-edit" onclick="deleteData('${docSnap.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    });
    taskGrid.innerHTML = html;
  });
}

window.toggleComplete = async (id, currentStatus) => {
  try {
    await updateDoc(doc(db, "users", id), {
      completed: !currentStatus,
    });
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

window.deleteData = async (id) => {
  try {
    await deleteDoc(doc(db, "users", id));
  } catch (err) {
    console.error(err);
  }
};

window.editData = async (id) => {
  try {
    const snap = await getDoc(doc(db, "users", id));
    const data = snap.data();

    document.querySelector("#taskTitle").value = data.title;
    document.querySelector("#taskCategory").value = data.category;
    document.querySelector("#taskDesc").value = data.desc;

    currentEditId = id;
    addBtn.classList.add("hide");
    updateBtn.classList.add("show");

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
  }
};

updateBtn.addEventListener("click", async () => {
  if (!currentEditId) return;

  const title = document.querySelector("#taskTitle").value;
  const category = document.querySelector("#taskCategory").value;
  const desc = document.querySelector("#taskDesc").value;

  try {
    await updateDoc(doc(db, "users", currentEditId), {
      title,
      category,
      desc,
    });

    Swal.fire({
      icon: "success",
      title: "Updated",
      timer: 1000,
      showConfirmButton: false,
    });

    resetForm();
  } catch (err) {
    console.error(err);
  } finally {
    currentEditId = null;
    updateBtn.classList.remove("show");
    addBtn.classList.remove("hide");
  }
});

function resetForm() {
  document.querySelector("#taskTitle").value = "";
  document.querySelector("#taskDesc").value = "";
  document.querySelector("#taskCategory").value = "Work";

  currentEditId = null;

  addBtn.classList.remove("hide");
  updateBtn.classList.remove("show");
}

function getTagClass(category) {
  if (category === "Work") return "tag-work";
  if (category === "Personal") return "tag-personal";
  if (category === "Urgent") return "tag-urgent";
  return "tag-work";
}
