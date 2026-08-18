const defaultBlogs = [
  {
    id: 1,
    title: "How I Started Web Development",
    category: "Web Development",
    content: "A beginner-friendly journey into HTML, CSS and JavaScript.\n\nWeb development becomes much easier when you start with the fundamentals. HTML gives a page its structure, CSS makes it attractive and responsive, and JavaScript adds interaction.\n\nStart with small projects, practice every day, and gradually build more complex applications. The most important step is to keep creating.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    status: "Published"
  },
  {
    id: 2,
    title: "The Future of Artificial Intelligence",
    category: "AI",
    content: "Artificial Intelligence is changing the way we learn, work and create.\n\nFrom intelligent assistants to image generation and automation, AI is becoming part of everyday technology. Students and developers can use it as a tool for learning, experimentation and productivity.\n\nThe future will depend not only on powerful AI systems, but also on people who know how to use them responsibly.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    status: "Published"
  },
  {
    id: 3,
    title: "Build Better Habits as a Student",
    category: "Lifestyle",
    content: "Small habits can make a big difference in student life.\n\nPlan your day, divide large tasks into smaller goals, take meaningful breaks and keep your study environment organized. Consistency is more valuable than trying to be perfect every day.\n\nChoose one habit, practice it regularly, and then build from there.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    status: "Published"
  }
];

function getBlogs() {
  return JSON.parse(localStorage.getItem("blogs")) || defaultBlogs;
}

function saveBlogs(blogs) {
  localStorage.setItem("blogs", JSON.stringify(blogs));
}

function renderHomeBlogs(blogs = getBlogs()) {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  const published = blogs.filter(blog => blog.status === "Published");

  if (!published.length) {
    grid.innerHTML = "<p>No blogs found.</p>";
    return;
  }

  grid.innerHTML = published.map(blog => `
    <article class="blog-card">
      <img src="${blog.image || defaultBlogs[0].image}" alt="${escapeHTML(blog.title)}">
      <div class="blog-card-body">
        <span class="tag">${escapeHTML(blog.category)}</span>
        <h3>${escapeHTML(blog.title)}</h3>
        <p>${escapeHTML(blog.content.slice(0, 105))}${blog.content.length > 105 ? "..." : ""}</p>
        <a href="blog.html?id=${blog.id}" class="read-more">Read Full Blog →</a>
      </div>
    </article>
  `).join("");
}

function showBlogDetail() {
  const container = document.getElementById("blogDetail");
  if (!container) return;

  const id = new URLSearchParams(location.search).get("id");
  const blog = getBlogs().find(item => String(item.id) === String(id));

  if (!blog || blog.status !== "Published") {
    container.innerHTML = `
      <h1>Blog not found</h1>
      <p class="muted">This blog may have been removed or is still a draft.</p>
      <br><a class="back-link" href="index.html#blogs">← Back to blogs</a>
    `;
    return;
  }

  container.innerHTML = `
    <a href="index.html#blogs" class="back-link">← Back to all blogs</a>
    <span class="tag">${escapeHTML(blog.category)}</span>
    <h1>${escapeHTML(blog.title)}</h1>
    <p class="blog-meta">Published on BlogSphere</p>
    <img src="${blog.image || defaultBlogs[0].image}" alt="${escapeHTML(blog.title)}">
    <div class="blog-detail-content">${escapeHTML(blog.content)}</div>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();
    const filtered = getBlogs().filter(blog =>
      blog.title.toLowerCase().includes(term) ||
      blog.category.toLowerCase().includes(term) ||
      blog.content.toLowerCase().includes(term)
    );
    renderHomeBlogs(filtered);
  });
}

function setupMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("navMenu");
  if (btn && nav) btn.addEventListener("click", () => nav.classList.toggle("show"));
}

function setupRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const user = {
      name: document.getElementById("registerName").value.trim(),
      email: document.getElementById("registerEmail").value.trim(),
      password: document.getElementById("registerPassword").value
    };
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("registerMessage").textContent = "Account created! Redirecting...";
    setTimeout(() => location.href = "login.html", 700);
  });
}

function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    if (!savedUser) {
      message.textContent = "Please register first.";
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("loggedIn", "true");
      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => location.href = "dashboard.html", 700);
    } else {
      message.textContent = "Invalid email or password.";
    }
  });
}

function setupCreateBlog() {
  const form = document.getElementById("blogForm");
  if (!form) return;

  const save = status => {
    const title = document.getElementById("blogTitle").value.trim();
    const content = document.getElementById("blogContent").value.trim();
    const category = document.getElementById("blogCategory").value;
    const image = document.getElementById("blogImage").value.trim();

    if (!title || !content) {
      document.getElementById("blogMessage").textContent = "Please enter a title and content.";
      return;
    }

    const blogs = getBlogs();
    blogs.push({
      id: Date.now(),
      title,
      content,
      category,
      image: image || defaultBlogs[0].image,
      status
    });

    saveBlogs(blogs);
    document.getElementById("blogMessage").textContent =
      status === "Published" ? "Blog published successfully!" : "Draft saved successfully!";

    setTimeout(() => location.href = "dashboard.html", 700);
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    save("Published");
  });

  document.getElementById("saveDraft").addEventListener("click", () => save("Draft"));
}

function setupDashboard() {
  const list = document.getElementById("myBlogs");
  if (!list) return;

  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("userName").textContent = user?.name || "Writer";

  const blogs = getBlogs();
  const published = blogs.filter(b => b.status === "Published");
  const drafts = blogs.filter(b => b.status === "Draft");

  document.getElementById("totalBlogs").textContent = blogs.length;
  document.getElementById("publishedBlogs").textContent = published.length;
  document.getElementById("draftBlogs").textContent = drafts.length;

  list.innerHTML = blogs.map(blog => `
    <div class="my-blog">
      <div>
        <h3>${escapeHTML(blog.title)}</h3>
        <p class="muted">${escapeHTML(blog.category)}</p>
      </div>
      <div>
        <span class="status">${escapeHTML(blog.status)}</span>
        ${blog.status === "Published" ? `<a class="read-more" href="blog.html?id=${blog.id}"> View →</a>` : ""}
      </div>
    </div>
  `).join("");
}

function setupLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    location.href = "index.html";
  });
}

renderHomeBlogs();
showBlogDetail();
setupSearch();
setupMenu();
setupRegister();
setupLogin();
setupCreateBlog();
setupDashboard();
setupLogout();
