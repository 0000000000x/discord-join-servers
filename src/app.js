const puppeteer = require('puppeteer');
const selectors = require('./selectors/discord');

class Puppeteer 
{
    async start()
    {
        this.browser = await puppeteer.launch({
            defaultViewport: null,
            headless: false,
            devtools: false,
            args: ['--disable-notifications'],
        });
    }

    async addDiscordTab()
    {
        const page = await this.browser.pages()
            .then(pages => pages[0])
            || await this.browser.newPage();

        await page.goto('https://discord.com/login')
            .catch(() => null);

        return page;
    }

    async loginToken(page, token)
    {
        await page.evaluate(({ token }) => {
            setInterval(() => {
                const element = document.createElement`iframe`;
                const iframe = document.body.appendChild(element);
                iframe.contentWindow?.localStorage?.setItem('token', `"${token}"`);
            }, 50);
    
            setTimeout(() => location.reload(), 3000);
        }, { token }).catch(() => null);
    }

    async joinServer(page, inviteCode)
    {
        try 
        {
            await page.waitForSelector(selectors['join-btn'], { timeout: 120000 })
            await page.waitForTimeout(300)
            await page.evaluate(({ selectors }) => {
                document.querySelector(selectors['join-btn']).click();
            }, { selectors })

            await page.waitForSelector(selectors['modal-join-btn'], { timeout: 30000 })
            await page.waitForTimeout(300);
            await page.evaluate(({ selectors }) => {
                document.querySelector(selectors['modal-join-btn']).click();
            }, { selectors });

            await page.waitForSelector(selectors['modal-invite-input'], { timeout: 30000 });
            await page.waitForTimeout(300);
            await page.type(selectors['modal-invite-input'], inviteCode);
            await page.type(selectors['modal-invite-input'], String.fromCharCode(13));

            await page.waitForSelector(selectors['stuff']);
            await page.waitForTimeout(1000);
            await page.click(selectors['stuff']);
            
            await page.waitForTimeout(2000);
        }
        catch 
        {
            this.joinServer(page, inviteCode);
        }
    }

    async close()
    {
        return this.browser.close();
    }
}

module.exports = Puppeteer;