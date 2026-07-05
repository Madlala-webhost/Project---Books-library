import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv";


const app = express();
app.set("view engine", "ejs");
const port = 4000;
env.config({ override: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const API_URL_Id = "https://openlibrary.org/search.json?";
const API_Key = process.env.APIKEY;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});
await db.connect();

//access database to retrieve data
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC");
  const allBooks = result.rows;
  res.render("index.ejs", {
    books: allBooks,
  });
});
//add a new book
app.post("/add", async (req, res) => {
  const bookTitle = req.body.newBook;
  const authorName = req.body.bookAuthor;
  const bookGenre = req.body.bookGenre;
  const bookRanking = req.body.bookRanking;
  const bookRecency = req.body.bookRecency;

  try {
    const result = await axios.get(
      `${API_URL_Id}title=${bookTitle}&author=${authorName}`,
    );

    if (!result.data.docs || result.data.docs.length === 0) {
      res.send("Search not found");
    }
    const bookData = result.data.docs[0];
    const coverId = bookData.cover_i;
    console.dir(coverId);

    if (!coverId) {
      res.send("Search not found");
    } else {
      //also check if book already exists in the database(not done yet)
      const response = await db.query(
        "INSERT INTO books (title, genre, rank, recency, author, cover_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [bookTitle, bookGenre, bookRanking, bookRecency, authorName, coverId],
      );
      const storedBooks = response.rows;
      return res.redirect("/");
    }
  } catch (err) {
    console.error("Error adding new book:", err);
    res.send("Error handling request");
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
