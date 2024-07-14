const mysql = require("mysql");
const dbConfig = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const os = require("os");
const fs = require("fs");
const bucket = require("../config/firebaseConfig");

async function uploadImagesToFirebase(files) {
  const urls = [];
  for (const file of files) {
    const tempFilePath = path.join(os.tmpdir(), file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const destinationPath = `individual/${uniqueFilename}`;

    await bucket.upload(tempFilePath, {
      destination: destinationPath,
      metadata: {
        contentType: file.mimetype,
      },
    });

    fs.unlinkSync(tempFilePath);

    const fileRef = bucket.file(destinationPath);
    await fileRef.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    urls.push(url);
  }
  return urls;
}

exports.getAllIndividualInsoles = (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Помилка підключення до бази даних: " + err.stack);
      return res.status(500).send("Помилка підключення до бази даних");
    }
    const sqlQuery = `
            SELECT 
                i.id AS id,
                i.name_en AS name_en,
                i.name_ua AS name_ua,
                i.base_price AS base_price,
                i.image_url AS image_url,
                i.article AS article,
                i.article_variation AS article_variation,
                i.first_about_description_ua AS first_about_description_ua,
                i.first_about_description_en AS first_about_description_en,
                i.second_about_description_ua AS second_about_description_ua,
                i.second_about_description_en AS second_about_description_en,
                i.third_about_description_ua AS third_about_description_ua,
                i.third_about_description_en AS third_about_description_en,
                i.fourth_about_description_ua AS fourth_about_description_ua,
                i.fourth_about_description_en AS fourth_about_description_en,
                i.characteristics_subtitle_ua AS characteristics_subtitle_ua,
                i.characteristics_subtitle_en AS characteristics_subtitle_en,
                i.characteristics_description_ua AS characteristics_description_ua,
                i.characteristics_description_en AS characteristics_description_en,
                i.characteristics AS characteristics,
                COALESCE(AVG(r.stars), 0) AS average_rating,
                COUNT(r.id) AS reviews_count
            FROM 
                individual i
            LEFT JOIN
                reviews r ON i.id = r.id
            GROUP BY 
                i.id
            ORDER BY 
                i.id;
        `;

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error("Помилка виконання запиту: " + err.message);
        return res.status(500).send("Помилка сервера");
      }

      results.forEach((individual) => {
        if (individual.image_url) {
          individual.image_url = JSON.parse(individual.image_url);
        } else {
          individual.image_url = [];
        }

        if (individual.characteristics) {
          individual.characteristics = JSON.parse(individual.characteristics);
        } else {
          individual.characteristics = {};
        }
      });

      res.json(results);
      connection.end();
    });
  });
};

// exports.getIndividualInsole = (req, res) => {
//   const connection = mysql.createConnection(dbConfig);
//   const { id } = req.params;

//   connection.connect((err) => {
//     if (err) {
//       console.error("Помилка підключення до бази даних: " + err.stack);
//       return res.status(500).send("Помилка підключення до бази даних");
//     }

//     const sqlQuery = `
//               SELECT
//                   i.id AS id,
//                   i.name_en AS name_en,
//                   i.name_ua AS name_ua,
//                   i.base_price AS base_price,
//                   i.image_url AS image_url,
//                   i.article AS article,
//                   i.article_variation AS article_variation,
//                   i.first_about_description_ua AS first_about_description_ua,
//                   i.first_about_description_en AS first_about_description_en,
//                   i.second_about_description_ua AS second_about_description_ua,
//                   i.second_about_description_en AS second_about_description_en,
//                   i.third_about_description_ua AS third_about_description_ua,
//                   i.third_about_description_en AS third_about_description_en,
//                   i.fourth_about_description_ua AS fourth_about_description_ua,
//                   i.fourth_about_description_en AS fourth_about_description_en,
//                   i.characteristics_subtitle_ua AS characteristics_subtitle_ua,
//                   i.characteristics_subtitle_en AS characteristics_subtitle_en,
//                   i.characteristics_description_ua AS characteristics_description_ua,
//                   i.characteristics_description_en AS characteristics_description_en,
//                   i.characteristics AS characteristics,
//                   COALESCE(AVG(r.stars), 0) AS average_rating,
//                   COUNT(r.id) AS reviews_count,
//                   iv.variation_type,
//                   iv.variation_value,
//                   iv.additional_price,
//                   iv.image_url AS variation_image_url,
//                   iv.variation_image AS variation_image,
//                   iv.category AS category,
//                   iv.article AS article,
//                   iv.variation_description_en AS variation_description_en,
//                   iv.variation_description_ua AS variation_description_ua,
//                   iv.first_about_description_ua AS first_about_description_ua,
//                   iv.first_about_description_en AS first_about_description_en,
//                   iv.second_about_description_ua AS second_about_description_ua,
//                   iv.second_about_description_en AS second_about_description_en,
//                   iv.third_about_description_ua AS third_about_description_ua,
//                   iv.third_about_description_en AS third_about_description_en,
//                   iv.fourth_about_description_ua AS fourth_about_description_ua,
//                   iv.fourth_about_description_en AS fourth_about_description_en,
//                   iv.characteristics_subtitle_ua AS characteristics_subtitle_ua,
//                   iv.characteristics_subtitle_en AS characteristics_subtitle_en,
//                   iv.characteristics_description_ua AS characteristics_description_ua,
//                   iv.characteristics_description_en AS characteristics_description_en,
//                   iv.characteristics AS characteristics
//               FROM
//                   individual i
//               LEFT JOIN
//                   individualVariations iv ON p.id = iv.individual_id
//               LEFT JOIN
//                   reviews r ON p.id = r.individual_id
//               WHERE
//                   i.id = ?
//               GROUP BY
//                   i.id, iv.id
//               ORDER BY
//                   i.id, iv.variation_type;
//           `;

//     connection.query(sqlQuery, [id], (err, results) => {
//       if (err) {
//         console.error("Помилка виконання запиту: " + err.message);
//         res.status(500).send("Помилка сервера");
//       } else {
//         if (results.length === 0) {
//           res.status(404).send("Індивідуальної устілки не знайдено");
//           connection.end();
//           return;
//         }

//         const individual = {
//           id: results[0].id,
//           name_en: results[0].name_en,
//           name_ua: results[0].name_ua,
//           base_price: results[0].base_price,
//           image_url: JSON.parse(results[0].image_url || "[]"),
//           average_rating: results[0].average_rating,
//           reviews_count: results[0].reviews_count,
//           article: results[0].article,
//           article_variation: results[0].article_variation,
//           first_about_description_ua: results[0].first_about_description_ua,
//           first_about_description_en: results[0].first_about_description_en,
//           second_about_description_ua: results[0].second_about_description_ua,
//           second_about_description_en: results[0].second_about_description_en,
//           third_about_description_ua: results[0].third_about_description_ua,
//           third_about_description_en: results[0].third_about_description_en,
//           fourth_about_description_ua: results[0].fourth_about_description_ua,
//           fourth_about_description_en: results[0].fourth_about_description_en,
//           characteristics_subtitle_ua: results[0].characteristics_subtitle_ua,
//           characteristics_subtitle_en: results[0].characteristics_subtitle_en,
//           characteristics_description_ua:
//             results[0].characteristics_description_ua,
//           characteristics_description_en:
//             results[0].characteristics_description_en,
//           characteristics: JSON.parse(results[0].characteristics || "{}"),
//           variations: {
//             colors: [],
//             sizes: [],
//           },
//         };

//         results.forEach((row) => {
//           const variation = {
//             value: row.variation_value,
//             additional_price: row.additional_price,
//             image_url: JSON.parse(row.variation_image_url),
//             article: row.article,
//             variation_type: row.variation_type,
//             variation_image: row.variation_image,
//             category: row.category,
//             variation_description_en: row.variation_description_en,
//             variation_description_ua: row.variation_description_ua,
//             first_about_description_ua: row.first_about_description_ua,
//             first_about_description_en: row.first_about_description_en,
//             second_about_description_ua: row.second_about_description_ua,
//             second_about_description_en: row.second_about_description_en,
//             third_about_description_ua: row.third_about_description_ua,
//             third_about_description_en: row.third_about_description_en,
//             fourth_about_description_ua: row.fourth_about_description_ua,
//             fourth_about_description_en: row.fourth_about_description_en,
//             characteristics_subtitle_ua: row.characteristics_subtitle_ua,
//             characteristics_subtitle_en: row.characteristics_subtitle_en,
//             characteristics_description_ua: row.characteristics_description_ua,
//             characteristics_description_en: row.characteristics_description_en,
//             characteristics: row.characteristics,
//           };

//           if (row.variation_type === "coverage") {
//             individual.variations.colors.push(variation);
//           } else if (row.variation_type === "sizes") {
//             individual.variations.sizes.push(variation);
//           }
//         });

//         res.json(individual);
//       }
//       connection.end();
//     });
//   });
// };

exports.getIndividualInsole = (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const { id } = req.params;

  connection.connect((err) => {
    if (err) {
      console.error("Помилка підключення до бази даних: " + err.stack);
      return res.status(500).send("Помилка підключення до бази даних");
    }

    const sqlQuery = `
        SELECT 
          i.id AS id,
          i.name_en AS name_en,
          i.name_ua AS name_ua,
          i.base_price AS base_price,
          i.image_url AS image_url,
          i.article AS article,
          i.article_variation AS article_variation,
          i.first_about_description_ua AS first_about_description_ua,
          i.first_about_description_en AS first_about_description_en,
          i.second_about_description_ua AS second_about_description_ua,
          i.second_about_description_en AS second_about_description_en,
          i.third_about_description_ua AS third_about_description_ua,
          i.third_about_description_en AS third_about_description_en,
          i.fourth_about_description_ua AS fourth_about_description_ua,
          i.fourth_about_description_en AS fourth_about_description_en,
          i.characteristics_subtitle_ua AS characteristics_subtitle_ua,
          i.characteristics_subtitle_en AS characteristics_subtitle_en,
          i.characteristics_description_ua AS characteristics_description_ua,
          i.characteristics_description_en AS characteristics_description_en,
          i.characteristics AS characteristics,
          0 AS average_rating,
          0 AS reviews_count
        FROM 
          individual i
        WHERE 
          i.id = ?
      `;

    connection.query(sqlQuery, [id], (err, results) => {
      if (err) {
        console.error("Помилка виконання запиту: " + err.message);
        res.status(500).send("Помилка сервера");
      } else {
        if (results.length === 0) {
          res.status(404).send("Індивідуальної устілки не знайдено");
          connection.end();
          return;
        }

        const individual = {
          id: results[0].id,
          name_en: results[0].name_en,
          name_ua: results[0].name_ua,
          base_price: results[0].base_price,
          image_url: JSON.parse(results[0].image_url || "[]"),
          average_rating: results[0].average_rating,
          reviews_count: results[0].reviews_count,
          article: results[0].article,
          article_variation: results[0].article_variation,
          first_about_description_ua: results[0].first_about_description_ua,
          first_about_description_en: results[0].first_about_description_en,
          second_about_description_ua: results[0].second_about_description_ua,
          second_about_description_en: results[0].second_about_description_en,
          third_about_description_ua: results[0].third_about_description_ua,
          third_about_description_en: results[0].third_about_description_en,
          fourth_about_description_ua: results[0].fourth_about_description_ua,
          fourth_about_description_en: results[0].fourth_about_description_en,
          characteristics_subtitle_ua: results[0].characteristics_subtitle_ua,
          characteristics_subtitle_en: results[0].characteristics_subtitle_en,
          characteristics_description_ua:
            results[0].characteristics_description_ua,
          characteristics_description_en:
            results[0].characteristics_description_en,
          characteristics: JSON.parse(results[0].characteristics || "{}"),
        };

        res.json(individual);
      }
      connection.end();
    });
  });
};

exports.createIndividualInsole = async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const {
    name_ua,
    name_en,
    article,
    base_price,
    article_variation,
    first_about_description_ua,
    first_about_description_en,
    second_about_description_ua,
    second_about_description_en,
    third_about_description_ua,
    third_about_description_en,
    fourth_about_description_ua,
    fourth_about_description_en,
    characteristics_subtitle_ua,
    characteristics_subtitle_en,
    characteristics_description_ua,
    characteristics_description_en,
    characteristics,
  } = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS individual (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_ua VARCHAR(255) NOT NULL,
      name_en VARCHAR(255) NOT NULL,
      base_price DECIMAL(10, 2) NOT NULL,
      image_url JSON,
      article VARCHAR(255) NOT NULL,
      article_variation VARCHAR(255),
      first_about_description_ua TEXT,
      first_about_description_en TEXT,
      second_about_description_ua TEXT,
      second_about_description_en TEXT,
      third_about_description_ua TEXT,
      third_about_description_en TEXT,
      fourth_about_description_ua TEXT,
      fourth_about_description_en TEXT,
      characteristics_subtitle_ua VARCHAR(255),
      characteristics_subtitle_en VARCHAR(255),
      characteristics_description_ua TEXT,
      characteristics_description_en TEXT,
      characteristics JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  const validateInput = (data) => {
    if (!data.name_ua || !data.name_en || !data.base_price || !data.article) {
      return false;
    }
    return true;
  };

  if (!validateInput(req.body)) {
    return res.status(400).send("Невірні вхідні дані");
  }

  let imageUrls = [];
  if (req.files) {
    try {
      imageUrls = await uploadImagesToFirebase(req.files);
    } catch (err) {
      console.error("Помилка завантаження зображень: " + err);
      return res.status(500).send("Помилка завантаження зображень");
    }
  }

  connection.connect((err) => {
    if (err) {
      console.error("Помилка підключення до бази даних: " + err.stack);
      return res.status(500).send("Помилка підключення до бази даних");
    }

    connection.query(createTableQuery, (err) => {
      if (err) {
        console.error("Помилка створення таблиці: " + err.message);
        return res.status(500).send("Помилка сервера при створенні таблиці");
      }

      const sqlQuery = `
        INSERT INTO individual (
          name_ua, 
          name_en, 
          base_price, 
          image_url, 
          article, 
          article_variation,
          first_about_description_ua,
          first_about_description_en,
          second_about_description_ua,
          second_about_description_en,
          third_about_description_ua,
          third_about_description_en,
          fourth_about_description_ua,
          fourth_about_description_en,
          characteristics_subtitle_ua,
          characteristics_subtitle_en,
          characteristics_description_ua,
          characteristics_description_en,
          characteristics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        sqlQuery,
        [
          name_ua,
          name_en,
          base_price,
          JSON.stringify(imageUrls),
          article,
          article_variation,
          first_about_description_ua,
          first_about_description_en,
          second_about_description_ua,
          second_about_description_en,
          third_about_description_ua,
          third_about_description_en,
          fourth_about_description_ua,
          fourth_about_description_en,
          characteristics_subtitle_ua,
          characteristics_subtitle_en,
          characteristics_description_ua,
          characteristics_description_en,
          characteristics,
        ],
        (err, results) => {
          if (err) {
            console.error("Помилка виконання запиту: " + err.message);
            return res.status(500).send("Помилка сервера");
          }
          res.status(201).json({
            message: "Продукт успішно створено",
            individualId: results.insertId,
          });
          connection.end();
        }
      );
    });
  });
};

exports.updateIndividualInsole = async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const { id } = req.params;
  const {
    name_ua,
    name_en,
    article,
    base_price,
    article_variation,
    first_about_description_ua,
    first_about_description_en,
    second_about_description_ua,
    second_about_description_en,
    third_about_description_ua,
    third_about_description_en,
    fourth_about_description_ua,
    fourth_about_description_en,
    characteristics_subtitle_ua,
    characteristics_subtitle_en,
    characteristics_description_ua,
    characteristics_description_en,
    characteristics,
  } = req.body;

  try {
    connection.connect();

    const getImageQuery = "SELECT image_url FROM individual WHERE id = ?";
    const [results] = await new Promise((resolve, reject) => {
      connection.query(getImageQuery, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    let currentImageUrls =
      results.length > 0 && results[0].image_url
        ? JSON.parse(results[0].image_url)
        : [];

    if (req.files) {
      const uploadedImageUrls = await uploadImagesToFirebase(req.files);
      currentImageUrls = currentImageUrls.concat(uploadedImageUrls);
    }

    const sqlQuery = `
        UPDATE individual SET 
        name_ua = ?,
        name_en = ?,
        article = ?,
        base_price = ?,
        article_variation = ?,
        first_about_description_ua = ?,
        first_about_description_en = ?,
        second_about_description_ua = ?,
        second_about_description_en = ?,
        third_about_description_ua = ?,
        third_about_description_en = ?,
        fourth_about_description_ua = ?,
        fourth_about_description_en = ?,
        characteristics_subtitle_ua = ?,
        characteristics_subtitle_en = ?,
        characteristics_description_ua = ?,
        characteristics_description_en = ?,
        characteristics = ?,
        image_url = ?
        WHERE id = ?
    `;

    await new Promise((resolve, reject) => {
      connection.query(
        sqlQuery,
        [
          name_ua,
          name_en,
          article,
          base_price,
          article_variation,
          first_about_description_ua,
          first_about_description_en,
          second_about_description_ua,
          second_about_description_en,
          third_about_description_ua,
          third_about_description_en,
          fourth_about_description_ua,
          fourth_about_description_en,
          characteristics_subtitle_ua,
          characteristics_subtitle_en,
          characteristics_description_ua,
          characteristics_description_en,
          characteristics,
          JSON.stringify(currentImageUrls),
          id,
        ],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json({ message: "Продукт успішно оновлено" });
  } catch (err) {
    console.error("Помилка оновлення продукту: " + err);
    res.status(500).send("Помилка сервера");
  } finally {
    connection.end();
  }
};

exports.deleteIndividualInsole = (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const { id } = req.params;

  connection.connect((err) => {
    if (err) {
      console.error("Помилка підключення до бази даних: " + err.stack);
      return res.status(500).send("Помилка підключення до бази даних");
    }

    const getImageQuery = "SELECT image_url FROM individual WHERE id = ?";
    connection.query(getImageQuery, [id], async (err, results) => {
      if (err) {
        console.error("Помилка отримання поточних зображень: " + err.message);
        connection.end();
        return res.status(500).send("Помилка сервера");
      }

      let currentImageUrls = [];
      if (results.length > 0 && results[0].image_url) {
        currentImageUrls = JSON.parse(results[0].image_url);
      }

      //   const deleteReviewsQuery = "DELETE FROM reviews WHERE product_id = ?";
      //   connection.query(deleteReviewsQuery, [id], (err, results) => {
      //     if (err) {
      //       console.error("Помилка видалення відгуків: " + err.message);
      //       return res.status(500).send("Помилка сервера");
      //     }

      //     const deleteVariationsQuery =
      //       "DELETE FROM productVariations WHERE product_id = ?";
      //     connection.query(deleteVariationsQuery, [id], async (err, results) => {
      //       if (err) {
      //         console.error("Помилка видалення варіацій: " + err.message);
      //         return res.status(500).send("Помилка сервера");
      //       }

      //     });
      //   });
      const deleteIndividualQuery = "DELETE FROM individual WHERE id = ?";
      connection.query(deleteIndividualQuery, [id], async (err, results) => {
        if (err) {
          console.error("Помилка виконання запиту: " + err.message);
          return res.status(500).send("Помилка сервера");
        }

        try {
          for (const url of currentImageUrls) {
            const fileName = url.split("/").pop();
            await bucket.file(`individual/${fileName}`).delete();
          }
        } catch (err) {
          console.error("Помилка видалення зображень з Firebase: " + err);
          return res.status(500).send("Помилка видалення зображень");
        }

        res.json({ message: "Індивідуальна устілка успішно видалена" });
        connection.end();
      });
    });
  });
};
