const args = ['start'];
const opts = { stdio: 'inherit', shell: true };
require('child_process').spawn('npm', args, opts);
