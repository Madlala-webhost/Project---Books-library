CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    genre VARCHAR (50) NOT NULL,
    rank INTEGER 
    )
    INSERT INTO books (title, genre, rank) VALUES ('The Stellenbosch Mafia', 'Non-fiction', 2 )
ALTER TABLE books ADD recency INTEGER