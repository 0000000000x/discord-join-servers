const { readFileSync } = require('fs');
const Puppeteer = require('./src/app');

const invites = readFileSync('./server-list.txt', 'utf8').split(/\r?\n/);
const tokens = readFileSync('./token-list.txt', 'utf8').split(/\r?\n/);

process.on('unhandledRejection', (rejection) => {
    if (rejection.message == 'target should exist before targetInfoChanged')
        return null;

    console.log(rejection);
});

(async () => {
    console.log(`Inicializando ${tokens.length} tokens...`);
    console.log(`Tentando entrar em ${invites.length} servidores...`);

    for (let token of tokens)
    {
        startRecursiveServerJoin(token);
    }
    
    async function startRecursiveServerJoin(token)
    {
        const puppeteer = new Puppeteer();
        await puppeteer.start();
        
        const page = await puppeteer.addDiscordTab()
            .catch(() => null);

        await puppeteer.loginToken(page, token)
            .catch(() => null);

        for (let invite of invites)
        {
            await puppeteer.joinServer(page, invite)
                .catch(() => null);
        }

        await puppeteer.close();
    }
})();