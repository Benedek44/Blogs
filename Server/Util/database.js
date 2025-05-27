import Database from "better-sqlite3";

const db = new Database("./Data/database.sqlite");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
  )`).run();

export const getUsers = () => db.prepare("SELECT * FROM users").all();

export const getUser = (id) => db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export const saveUser = (name) => db.prepare("INSERT INTO users (name) VALUES (?)").run(name);

export const updateUser = (id, name) => db
.prepare("UPDATE users SET name = ? WHERE id = ?")
.run(name, id);

export const deleteUser = (id) => db
.prepare("DELETE FROM users WHERE id = ?")
.run(id);

export const getBlogs = () => db.prepare("SELECT * FROM blogs").all();

export const getBlog = (id) => db.prepare("SELECT * FROM blogs WHERE id = ?").get(id);

export const saveBlog = (authorId, title, category, content, createdAt, updatedAt) => db.prepare("INSERT INTO blogs (author_id, title, category, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(authorId, title, category, content, createdAt, updatedAt);

export const updateBlog= (id, authorId, title, category, content, createdAt, updatedAt) => db
.prepare("UPDATE blogs SET author_id = ?, title = ?, category = ?, content = ?, created_at = ?, updated_at = ? WHERE id = ?")
.run(authorId, title, category, content, createdAt, updatedAt, id);

export const deleteBlog = (id) => db
.prepare("DELETE FROM blogs WHERE id = ?")
.run(id);

const users = [
    {name:"Ann"},
    {name:"Bob"},
    {name:"Martin"},
    {name:"Noel"}
];

const rowCountUsers = db.prepare(`SELECT COUNT(*) AS count FROM users`).get().count;
if (rowCountUsers === 0) {
    for (const user of users) saveUser(user.name);
}

const blogs = [
  {authorId: 1, title: "Hogyan kezdjünk bele a blogírásba?", category: "Útmutatók", content: "Ebben a bejegyzésben megosztom a legjobb tippeket és trükköket, hogy hogyan kezdj bele a blogírásba, és hogyan tartsd fenn az olvasók érdeklődését.", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 2, title: "A legfrissebb technológiai hírek", category: "Hírek", content: "Összegyűjtöttük a legújabb technológiai trendeket és híreket, amelyek hatással lehetnek a mindennapi életünkre.", createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 3, title: "Mi változott az utóbbi hónapban?", category: "Frissítések", content: "Ebben a bejegyzésben részletesen bemutatom az elmúlt hónap legfontosabb változásait és fejlesztéseit.", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 4, title: "Az olvasók véleménye a legújabb trendekről", category: "Vélemények", content: "Ebben a cikkben összegyűjtöttük az olvasók véleményét a legújabb trendekről és fejlesztésekről.", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 1, title: "10 tipp a hatékony időgazdálkodáshoz", category: "Tippek", content: "Ebben a bejegyzésben megosztom a legjobb időgazdálkodási tippeket, amelyek segítenek a produktivitás növelésében.", createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 2, title: "Új funkciók, amiket érdemes kipróbálni", category: "Újdonságok", content: "Bemutatjuk a legújabb funkciókat és eszközöket, amelyek megkönnyíthetik a mindennapjaidat.", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 3, title: "Részletes elemzés a piaci trendekről", category: "Elemzések", content: "Ebben a bejegyzésben mélyreható elemzést nyújtunk a jelenlegi piaci trendekről és azok hatásairól.", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
  {authorId: 4, title: "Hogyan építsünk erős közösséget?", category: "Közösségi", content: "Ebben a cikkben megosztom a legjobb stratégiákat és ötleteket, hogy hogyan építsünk erős és támogató közösséget.", createdAt: new Date().toISOString(), updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)).toISOString()},
];

const rowCountBlogs = db.prepare(`SELECT COUNT(*) AS count FROM blogs`).get().count;
if (rowCountBlogs === 0) {
    for (const blog of blogs) {
        saveBlog(blog.authorId, blog.title, blog.category, blog.content, blog.createdAt, blog.updatedAt);
    }
}
