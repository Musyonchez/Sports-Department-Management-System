const bcrypt = require('bcryptjs');
const { db, migrate } = require('./db');

migrate();

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);

const insertFacility = db.prepare(`
  INSERT INTO facilities (name, category, description, image, capacity)
  VALUES (?, ?, ?, ?, ?)
`);

const insertEquipment = db.prepare(`
  INSERT INTO equipment (name, category, image, total_quantity, available_quantity)
  VALUES (?, ?, ?, ?, ?)
`);

function seed() {
  const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (userCount > 0) {
    console.log('Database already has data — skipping seed.');
    return;
  }

  const passwordHash = bcrypt.hashSync('password123', 10);

  db.transaction(() => {
    insertUser.run('Admin User', 'admin@sports.edu', passwordHash, 'admin');
    insertUser.run('Officer User', 'officer@sports.edu', passwordHash, 'officer');
    insertUser.run('Student User', 'student@sports.edu', passwordHash, 'student');

    const facilities = [
      ['Football Pitch', 'football', 'Professional outdoor football field.', 'football.jpg', 22],
      ['Basketball Court', 'basketball', 'Modern indoor basketball court.', 'basketball.jpg', 10],
      ['Tennis Court', 'tennis', 'Outdoor tennis training facility.', 'tennis.jpg', 4],
      ['Volleyball Court', 'volleyball', 'Professional volleyball court.', 'volleyball.jpg', 12],
      ['Rugby Field', 'rugby', 'Full-size rugby playing field.', 'rugby.jpg', 30],
      ['Gymnasium', 'gym', 'Fully equipped fitness centre.', 'gym.jpg', 40],
    ];
    for (const f of facilities) insertFacility.run(...f);

    const equipment = [
      ['Footballs', 'balls', 'football.jpg', 18, 18],
      ['Basketballs', 'balls', 'basketball.jpg', 12, 12],
      ['Tennis Rackets', 'rackets', 'tennis.jpg', 3, 3],
      ['Team Jerseys', 'jerseys', 'sports.jpg', 5, 5],
      ['Training Cones', 'cones', 'sports.jpg', 9, 9],
      ['Volleyball Net', 'nets', 'volleyball.jpg', 0, 0],
    ];
    for (const e of equipment) insertEquipment.run(...e);
  })();

  console.log('Seed complete:');
  console.log('  admin@sports.edu / officer@sports.edu / student@sports.edu — password: password123');
}

seed();
