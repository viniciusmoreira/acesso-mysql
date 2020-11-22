const fs = require('fs');
const db = require('./db');

const initMigrations = async (connection) => {
  const [results] = await connection.query(`show tables like 'migrations'`);

  if(results.length === 0){
    await connection.query('START TRANSACTION');
    await connection.query(`
      CREATE TABLE migrations (
        id INT NOT NULL AUTO_INCREMENT,
        version INT NOT NULL,
        PRIMARY KEY (id)
      )
    `);

    await connection.query(`insert into migrations (id, version) values (1, 0)`)
    await connection.query('COMMIT');
  }
}

const getCurrentVesion = async (connection) => {
  const [results] = await connection.query(`select * from migrations`);

  if(results.length > 0){
    return results[0].version;
  }

  return 0
}

const migration = async () => {
  const connection = await db
  const migrations = fs.readdirSync('./migrations/')

  await initMigrations(connection);
  const currentVersion = await getCurrentVesion(connection);
  let targetVersion = 1000;
  if(process.argv.length > 2){
    if(process.argv[2] === '--target-version' && process.argv[3]){
      targetVersion = parseInt(process.argv[3]);
    }
  }
  const sortUp = (a, b) => a > b ? 1 : -1 
  const sortDown = (a, b) => a < b ? 1 : -1

  const migrationsSorted = migrations
    .map(version => {
      return parseInt(version.split('.')[0])
    })
    .sort(targetVersion > currentVersion ? sortUp : sortDown)

  for await(const migration of migrationsSorted){
    const m = require('./migrations/' + migration);

    if(targetVersion >= migration && migration > currentVersion){
      await connection.query('START TRANSACTION');
      await connection.query(`update migrations set version = ? where id = ?`, [migration, 1]);
      if(m.up){
        await m.up(connection);
        console.log('Migration UP:' + migration)
      }
      await connection.query('COMMIT');
    } else if (migration <= currentVersion && targetVersion < migration){
      await connection.query('START TRANSACTION');

      const migrationIndex = migrationsSorted.indexOf(migration);

      await connection.query(`update migrations set version = ? where id = ?`, [migrationsSorted[migrationIndex+1] || 0, 1]);
      if(m.down){
        await m.down(connection);
        console.log('Migration DOWN:' + migration)
      }
      await connection.query('COMMIT');
    }
  }
}

migration();