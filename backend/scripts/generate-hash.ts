import bcrypt from 'bcrypt';

const password = 'Admin@123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Hash da senha "Admin@123":', hash);
  console.log('\nUse este hash no seed do banco de dados.');
});
