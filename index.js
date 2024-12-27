import crypto from 'crypto';
import chalk from 'chalk';

const algorithms = {
    weak: 'aes-128-cbc',
    medium: 'aes-192-cbc',
    high: 'aes-256-cbc',
  };

  const keys = {
    weak: crypto.randomBytes(16),
    medium: crypto.randomBytes(24),
    high: crypto.randomBytes(32),
  };

  const iv = crypto.randomBytes(16);

  function encrypt(level, text) {
    if (!algorithms[level]) {
      console.error(chalk.red(`Encryption level "${level}" is not supported. Use: weak, medium, or high.`));
      process.exit(1);
    }

    const algorithm = algorithms[level];
    const key = keys[level];

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      algorithm,
      iv: iv.toString('hex'),
      encrypted,
      key: key.toString('hex'),
    };
  }

  function showHelp() {
    console.log(chalk.green('--- Help Menu ---'));
    console.log(chalk.yellow('Usage: node index.js <level> "<text>"'));
    console.log(chalk.cyan('Available Commands:'));
    console.log(chalk.magenta('help') + ' - Display this help menu.');
    console.log(chalk.magenta('weak') + ' - Use weak encryption (AES-128-CBC).');
    console.log(chalk.magenta('medium') + ' - Use medium encryption (AES-192-CBC).');
    console.log(chalk.magenta('high') + ' - Use strong encryption (AES-256-CBC).');
    console.log(chalk.green('\nExample:'));
    console.log(chalk.yellow('node index.js high "This is the text to encrypt"'));
  }

  const args = process.argv.slice(2);
  const [level, text] = args;

  if (!level) {
    console.error(chalk.red('Please provide a command or encryption level.'));
    console.error(chalk.yellow('Use "help" to view the available commands.'));
    process.exit(1);
  }

  if (level === 'help') {
    showHelp();
    process.exit(0);
  }

  if (!text) {
    console.error(chalk.red('Please provide the text to encrypt.'));
    console.error(chalk.yellow('Example: node index.js high "Your text to encrypt"'));
    process.exit(1);
  }

  const result = encrypt(level, text);

  console.log(chalk.green('--- Encryption Result ---'));
  console.log(chalk.blueBright(`Encrypted Text: ${chalk.bold(result.encrypted)}`));
  console.log(chalk.cyan(`Algorithm: ${result.algorithm}`));
  console.log(chalk.magenta(`IV: ${result.iv}`));
  console.log(chalk.yellow(`Key: ${result.key}`));