let editingId = null;
const BASE_URL = 'http://localhost:8080';

const usersMap = {};

async function loadUsersMap() {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    const users = await res.json();
    users.forEach(u => {
      usersMap[u.id] = u.name;
    });
  } catch (e) {
    console.error("Nem sikerült beolvasni a felhasználókat:", e);
  }
}

async function fetchBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`);
  return res.json();
}

function renderBlogs(blogs) {
  const container = document.getElementById('blogContainer');
  container.innerHTML = '';

  blogs.forEach(blog => {
    const card = document.createElement('div');
    card.className = 'card';
    const authorName = usersMap[blog.author_id] || (`Ismeretlen (#${blog.author_id})`);
    const createdAt = new Date(blog.created_at).toLocaleString('hu-HU');
    const updatedAt = new Date(blog.updated_at).toLocaleString('hu-HU');

    card.innerHTML = `
      <h3 class="title">${blog.title}</h3><br>
      <p><strong>Kategória:</strong> ${blog.category}</p>
      <p class="desc">${blog.content}</p>
      <div class="meta">
        <p><strong>Készítette:</strong> ${authorName}</p>
        <p><strong>Létrehozva:</strong> ${createdAt}</p>
        <p><strong>Frissítve:</strong> ${updatedAt}</p>
      </div>
      <div class="actions">
        <button onclick="editBlog(${blog.id})">Szerkesztés</button>
        <button onclick="deleteBlog(${blog.id})">Törlés</button>
      </div>
    `;

    container.appendChild(card);
  });
}

async function loadAllData() {
  await loadUsersMap();
  try {
    const blogs = await fetchBlogs();
    renderBlogs(blogs);
  } catch (e) {
    console.error("Nem sikerült beolvasni a blogokat:", e);
  }
}

async function openEditor(id = null) {
  document.getElementById('editorPopup').style.display = 'flex';
  document.getElementById('formTitle').innerText = id ? 'Bejegyzés szerkesztése' : 'Új blogbejegyzés';
  editingId = id;

  const authorSelect = document.getElementById('author');
  authorSelect.innerHTML = '<option value="">Szerző választása</option>';
  for (const [idUser, name] of Object.entries(usersMap)) {
    const opt = document.createElement('option');
    opt.value = idUser;
    opt.textContent = name;
    authorSelect.appendChild(opt);
  }

  if (id) {

    try {
      const res = await fetch(`${BASE_URL}/blogs/${id}`);
      const blog = await res.json();
      document.getElementById('blogId').value = blog.id;
      document.getElementById('title').value = blog.title;
      document.getElementById('category').value = blog.category;
      document.getElementById('content').value = blog.content;
      document.getElementById('author').value = blog.author_id;
    } catch (e) {
      console.error("Nem sikerült betölteni a blogot szerkesztésre:", e);
    }
  } else {
    document.getElementById('blogId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('category').value = '';
    document.getElementById('content').value = '';
    document.getElementById('author').value = '';
  }
}

function closeEditor() {
  document.getElementById('editorPopup').style.display = 'none';
}

async function saveBlog() {
  const id = document.getElementById('blogId').value;
  const data = {
    authorId: document.getElementById('author').value,
    title: document.getElementById('title').value.trim(),
    category: document.getElementById('category').value.trim(),
    content: document.getElementById('content').value.trim()
  };

  if (!data.authorId || !data.title || !data.category || !data.content) {
    alert('Kérlek, tölts ki minden mezőt!');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/blogs/${id}` : `${BASE_URL}/blogs`;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      closeEditor();
      loadAllData();
    } else {
      const err = await res.json();
      alert('Hiba történt mentéskor: ' + (err.message || res.status));
    }
  } catch (e) {
    console.error("Hiba a mentés közben:", e);
    alert('Hálózati hiba történt mentéskor.');
  }
}

async function deleteBlog(id) {
  if (!confirm("Biztosan törlöd ezt a bejegyzést?")) return;
  try {
    const res = await fetch(`${BASE_URL}/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadAllData();
    } else {
      const err = await res.json();
      alert('Törlés sikertelen: ' + (err.message || res.status));
    }
  } catch (e) {
    console.error("Hiba a törlés közben:", e);
    alert('Hálózati hiba történt törléskor.');
  }
}

function editBlog(id) {
  openEditor(id);
}

window.addEventListener('DOMContentLoaded', loadAllData);
