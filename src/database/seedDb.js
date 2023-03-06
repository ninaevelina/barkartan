const { sequelize } = require("./config");
const { bars } = require("../data/bar");

sequelize.query("PRAGMA foreign_keys = ON", { raw: true });

const seedBarDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS bar;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    //await sequelize.query(`DROP TABLE IF EXISTS review;`);

    // Create bars table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS bar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            city_id_fk INTEGER NOT NULL,
            phone TEXT,
            website TEXT,
            hours TEXT,
            FOREIGN KEY(city_id_fk) REFERENCES city(id)
        );
    `);

    //Create city table
    await sequelize.query(`
          CREATE TABLE IF NOT EXISTS city (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          );
    `);
    // create user table
    await sequelize.query(`
            CREATE TABLE IF NOT EXISTS user (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT,
              password TEXT,
              email TEXT,
              role TEXT DEFAULT "USER"
            );
    `);

    // create review table
    await sequelize.query(`
       CREATE TABLE IF NOT EXISTS review(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review_text TEXT NOT NULL,
        bar_id_fk INTEGER NOT NULL,
        user_id_fk INTEGER NOT NULL,
        rating INTEGER,
        FOREIGN KEY(bar_id_fk) REFERENCES bar(id),
        FOREIGN KEY(user_id_fk) REFERENCES user(id)
       );
    `);

    //City//
    await sequelize.query(
      `INSERT INTO city (name) VALUES 
      ('Stockholm'), ('Västerås'), ('Göteborg');`
    );

    //bar//

    await sequelize.query(
      `INSERT INTO bar (name, address, description, city_id_fk, phone, website, hours) VALUES 
        ('Kullens', 'Tranebergsplan 6', 'Perfekt ställe för en aw med Norrlands guld och en pommestallrik efter skolan.', 1, '08-252160', 'kullensbar.gastrogate.com', 'Sön-Torsdag 13-23 Fredag-Lördag 13-00'),
        ('Kloster', 'Hornsgatan 84', 'Oavsett om du letar efter något bekant eller något nytt så har vi allt för dig. Välkommen till Kloster, mer än bara en Pub.', 1, '08-6692306', 'pubkloster.se', 'Måndag 13:00 till 01:00, Tisdag 13:00 till 01:00, Onsdag 13:00 till 03:00, Torsdag 13:00 till 03:00, Fredag 13:00 till 03:00, Lördag 11:00 till 03:00, Söndag 11:00 till 01:00'),
        ('Dovas', 'Hornsgatan 90', 'Dovas är en mötesplats för alla! Gillar ni härlig stämning, fest och överdrivet BRA PRISER så', 1, '08-429210', 'dovas.se', 'Vardagar 13:00 - 01:00, Helger 11:00 - 01:00'),
        ('Lykke Coffe Bar', 'Nytorgsgatan 38', 'Lykke Nytorget is the place where our wet coffee dreams become reality. From our coffee farms to your cup in an unbroken chain. It is also a place that we opened for completely egoistic reasons. Where we ourselves come to enjoy well made food, delicious baked goods, amazing cocktails and a wide selection of beer. Everything we like as well as coffee you might say.', 1, '08-429210', NULL, 'Monday - Tuesday: 8-20, Wednesday -Thursday: 8-23, Friday -Saturday: 8-00, Sunday: 8-20'),
        ('Retro', 'Sveavägen 120', 'Varva ner efter jobbet på en afterwork på Retro Bar & Restaurant Odenplan.', 1, '08-6129964', 'svea.retrobar.se', 'Mån - Sön 13-01'),
        ('O-learys', 'Stora Torget 2', 'Bra ställe för shuffleboard och bowling och att bli full.', 2, '021-4481630', 'olearys.se', 'Måndag-Tisdag 16-23 Onsdag 16-02 Torsdag 16-23 Fredag 16-03 Lördag 12-03 Söndag 12-22'),
        ('Nya Hattfabriken', 'Slottsgatan 8', 'Perfekt om du är 50+ och vill supa gärnet.', 2, '021-136500', 'nyahattfabriken.se', 'Måndag-Torsdag 11-22:30 Fredag 11-23 Lördag 12-23 Söndag Stängt'),
        ('Tyrolen', 'Liseberg', 'Vill du ha en paus från illamåendet från karusellerna och istället bli illamående av att supa? Då är du välkommen in till oss.', 3, '031-400100', 'liseberg.se', 'Se hemsida för öppettider'),
        ('The Steam Hotel', 'Ångkraftsvägen 14', 'Om du är rik och vill vara i en avslappnande miljö tillsammans med andra rika människor så är det här ett perfekt ställe.', 2, '021-4759900', 'steamhotel.se', 'Måndag-Söndag 15-01'),
        ('Söders Hjärta', 'Bellmansgatan 22', 'Hjärtat är en plats där man äter gott, dricker gott och har det gott! Ägarna Niclaes och Christian förädlar och utvecklar Hjärtat med varsam hand. Alltid bästa maten, bästa drinkarna och bästa musiken!', 1, '08-6401462', 'sodershjarta.se', 'Måndag-Fredag 11-01 Lördag-Söndag 16-01');`
    );

    //Users//
    await sequelize.query(
      `INSERT INTO user (username, password,email,role) VALUES
      ('lisamansson','12345',"lisa@mi.se", "ADMIN"),
      ('juliac','password123',"juliac@mi.se", "USER"),
      ('ninak', 'password9505',"ninak@mi.se","USER"),
      ('majanilsson','maja7523', 'majanilsson@gmail.com', "USER"),
      ('daneiadamsson','daniel1234','danielrr94@gmail.com', "USER"),
      ('kallep', 'kalle9403', 'kallelindroos@gmail.com', "USER"),
      ('linuseriksson', 'Testpassword23', 'linus.e92@gmail.com', "USER");
      `
    );

    //Review

    await sequelize.query(
      `INSERT INTO review (review_text, rating, bar_id_fk, user_id_fk)VALUES
      ('Bra öl till bra pris!', 5, 1, 7),
      ('Sunkigaste stället i sverige', 1, 4, 6),
      ('This pub is a cheap place where you can buy a beer, sit and have a chat with friends.They serve bar food (not the best, not the worst) and bar snacks. There’s also not so cheap beers, wine and spirits. It’s usually crowded, so pretty hard to get a private table. The staff is ok.', 4, 2, 6);
      `
    );
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedBarDb();
